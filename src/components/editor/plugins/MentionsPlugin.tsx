import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  TextNode,
  type RangeSelection,
} from "lexical";
import { LexicalTypeaheadMenuPlugin, MenuOption } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import * as React from "react";
import { createPortal } from "react-dom";
import { User, Hash } from "lucide-react";

import { $createMentionNode } from "../nodes/MentionNode";

const MENTION_REGEX = /(^|[\s([{\n])@([\w.-]*)$/;
const TAG_REGEX = /(^|[\s([{\n])#([\w-]*)$/;

type SuggestionType = "mention" | "tag";

type Suggestion = {
  id: string;
  label: string;
  type: SuggestionType;
  searchText: string;
  imageUrl?: string;
};

const DEFAULT_MENTION_RESULTS = 10;
const MAX_VISIBLE_MENU_ROWS = 6;
const MENU_ITEM_HEIGHT = 40;
const MENU_VERTICAL_PADDING = 8;
const MENU_MIN_HEIGHT = 96;
const MENU_MAX_HEIGHT = MAX_VISIBLE_MENU_ROWS * MENU_ITEM_HEIGHT + MENU_VERTICAL_PADDING;

// Ref-counted scroll lock shared across all editor instances
const scrollLockState = {
  count: 0,
  previousBodyOverflow: "",
  previousHtmlOverflow: "",
};

const STATIC_TAGS: Suggestion[] = [
  { id: "todo", label: "TODO", type: "tag", searchText: "todo" },
  { id: "blocked", label: "Blocked", type: "tag", searchText: "blocked" },
  { id: "completed", label: "Completed", type: "tag", searchText: "completed" },
];

class MentionOption extends MenuOption {
  constructor(public suggestion: Suggestion) {
    super(suggestion.id);
  }
}

function checkForTrigger(
  selection: RangeSelection,
  matchers: Array<{
    regex: RegExp;
    type: SuggestionType;
    trigger: "@" | "#";
  }>,
) {
  const anchor = selection.anchor.getNode();
  const textContent = anchor.getTextContent().slice(0, selection.anchor.offset);

  for (const matcher of matchers) {
    const match = textContent.match(matcher.regex);
    if (match && match.index !== undefined) {
      const prefix = match[1] ?? "";
      const matchingString = match[2] ?? "";
      const leadOffset = match.index + prefix.length;
      return {
        leadOffset,
        matchingString,
        replaceableString: `${matcher.trigger}${matchingString}`,
        trigger: matcher.type,
      };
    }
  }
  return null;
}

function getQueryTextForSelection(): {
  leadOffset: number;
  matchingString: string;
  replaceableString: string;
  trigger: SuggestionType;
} | null {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return null;
  const match = checkForTrigger(selection, [
    { regex: MENTION_REGEX, type: "mention", trigger: "@" },
    { regex: TAG_REGEX, type: "tag", trigger: "#" },
  ]);
  return match;
}

function getFilteredSuggestions(
  type: SuggestionType,
  query: string,
  mentionSuggestions: Suggestion[],
): Suggestion[] {
  const normalized = query.trim().toLowerCase();
  const allSuggestions = type === "mention" ? mentionSuggestions : STATIC_TAGS;
  const limit = type === "mention" ? DEFAULT_MENTION_RESULTS : STATIC_TAGS.length;

  const filtered = allSuggestions.filter((option) => {
    if (option.type !== type) return false;
    if (!normalized) return true;
    return option.searchText.includes(normalized);
  });

  if (!normalized) {
    return filtered.slice(0, limit);
  }

  const ranked = filtered.sort((a, b) => {
    const aLabel = a.label.toLowerCase();
    const bLabel = b.label.toLowerCase();
    const aStartsWith = Number(aLabel.startsWith(normalized));
    const bStartsWith = Number(bLabel.startsWith(normalized));
    if (aStartsWith !== bStartsWith) {
      return bStartsWith - aStartsWith;
    }
    const aIndex = a.searchText.indexOf(normalized);
    const bIndex = b.searchText.indexOf(normalized);
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    return a.label.localeCompare(b.label);
  });

  return ranked.slice(0, limit);
}

function acquireScrollLock(): () => void {
  if (typeof document === "undefined") {
    return () => {};
  }

  const { body, documentElement } = document;
  if (scrollLockState.count === 0) {
    scrollLockState.previousBodyOverflow = body.style.overflow;
    scrollLockState.previousHtmlOverflow = documentElement.style.overflow;
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
  }
  scrollLockState.count += 1;

  return () => {
    scrollLockState.count = Math.max(0, scrollLockState.count - 1);
    if (scrollLockState.count === 0) {
      body.style.overflow = scrollLockState.previousBodyOverflow;
      documentElement.style.overflow = scrollLockState.previousHtmlOverflow;
    }
  };
}

function isEventInsideMenu(
  eventTarget: EventTarget | null,
  menuElement: HTMLDivElement | null,
): boolean {
  return Boolean(menuElement && eventTarget instanceof Node && menuElement.contains(eventTarget));
}

function MentionMenu({
  options,
  selectedIndex,
  onSelectOption,
  left,
  top,
  maxHeight,
}: {
  options: MentionOption[];
  selectedIndex: number | null;
  onSelectOption: (option: MentionOption) => void;
  left: number;
  top: number;
  maxHeight: number;
}) {
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const releaseScrollLock = acquireScrollLock();
    const preventOutsideWheel = (event: WheelEvent) => {
      if (isEventInsideMenu(event.target, menuRef.current)) {
        return;
      }
      if (event.cancelable) {
        event.preventDefault();
      }
    };
    const preventOutsideTouchMove = (event: TouchEvent) => {
      if (isEventInsideMenu(event.target, menuRef.current)) {
        return;
      }
      if (event.cancelable) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", preventOutsideWheel, { capture: true, passive: false });
    window.addEventListener("touchmove", preventOutsideTouchMove, {
      capture: true,
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", preventOutsideWheel, { capture: true });
      window.removeEventListener("touchmove", preventOutsideTouchMove, { capture: true });
      releaseScrollLock();
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="fixed w-64 overflow-y-auto rounded-2xl bg-popover/90 backdrop-blur-2xl p-1.5 shadow-2xl ring-1 ring-foreground/5"
      style={{
        zIndex: 9999,
        left,
        top,
        maxHeight,
      }}
    >
      {options.length === 0 ? (
        <div className="px-3 py-2 text-sm text-muted-foreground">No matches</div>
      ) : (
        options.map((option, i) => (
          <button
            key={option.key}
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={() => {
              onSelectOption(option);
            }}
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-accent ${
              i === selectedIndex ? "bg-accent" : ""
            }`}
          >
            {option.suggestion.type === "mention" ? (
              option.suggestion.imageUrl ? (
                <img
                  src={option.suggestion.imageUrl}
                  alt=""
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-low text-xs">
                  <User className="h-3 w-3 text-muted-foreground" />
                </div>
              )
            ) : (
              <Hash className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="truncate">{option.suggestion.label}</span>
          </button>
        ))
      )}
    </div>
  );
}

// Adapted member type for this project
export type MemberUser = {
  id: string;
  name: string;
  initials?: string;
  avatarUrl?: string;
};

type MentionsPluginProps = {
  anchorElem?: HTMLElement;
  members?: MemberUser[];
  onMention?: (userId: string) => void;
};

export function MentionsPlugin({ anchorElem, members, onMention }: MentionsPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = React.useState<string>("");
  const [currentType, setCurrentType] = React.useState<SuggestionType>("mention");
  const anchorElement = anchorElem ?? (typeof document !== "undefined" ? document.body : undefined);

  const mentionSuggestions = React.useMemo((): Suggestion[] => {
    if (!members || members.length === 0) {
      return [];
    }
    return members.map((member) => ({
      id: member.id,
      label: member.name,
      type: "mention" as const,
      searchText: member.name.toLowerCase(),
      imageUrl: member.avatarUrl || undefined,
    }));
  }, [members]);

  const options = React.useMemo(() => {
    return getFilteredSuggestions(currentType, query, mentionSuggestions).map(
      (suggestion) => new MentionOption(suggestion),
    );
  }, [currentType, query, mentionSuggestions]);

  const onSelectOption = React.useCallback(
    (option: MentionOption, nodeToRemove: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        if (option.suggestion.type === "mention") {
          const mentionNode = $createMentionNode({
            id: option.suggestion.id,
            label: option.suggestion.label,
          });
          let insertedMentionNode: typeof mentionNode | null = null;

          if (nodeToRemove) {
            nodeToRemove.replace(mentionNode);
            insertedMentionNode = mentionNode;
          } else {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertNodes([mentionNode]);
              insertedMentionNode = mentionNode;
            }
          }
          if (insertedMentionNode) {
            const trailingSpace = $createTextNode(" ");
            insertedMentionNode.insertAfter(trailingSpace);
            trailingSpace.select();
            onMention?.(option.suggestion.id);
          }
        } else {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if (nodeToRemove) {
              nodeToRemove.remove();
            }
            selection.insertText(`#${option.suggestion.label} `);
          }
        }
      });
      closeMenu();
    },
    [editor, onMention],
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionOption>
      onQueryChange={(newQuery) => {
        setQuery(newQuery ?? "");
      }}
      triggerFn={(_text) => {
        const match = getQueryTextForSelection();
        if (!match) return null;
        setCurrentType(match.trigger);
        return {
          leadOffset: match.leadOffset,
          matchingString: match.matchingString,
          replaceableString: match.replaceableString,
        };
      }}
      options={options}
      menuRenderFn={(anchorRef, { selectedIndex, selectOptionAndCleanUp }) => {
        const container = anchorRef.current;
        if (!container) return null;

        const rect = container.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const viewportPadding = 12;
        const menuWidth = 256;
        const visibleRows = Math.max(1, Math.min(MAX_VISIBLE_MENU_ROWS, options.length));
        const estimatedMenuHeight = Math.min(
          MENU_MAX_HEIGHT,
          Math.max(MENU_MIN_HEIGHT, visibleRows * MENU_ITEM_HEIGHT + MENU_VERTICAL_PADDING),
        );
        const spaceBelow = viewportHeight - rect.bottom - viewportPadding;
        const spaceAbove = rect.top - viewportPadding;
        const shouldFlipAbove = spaceBelow < 140 && spaceAbove > spaceBelow;

        const maxHeight = Math.max(
          MENU_MIN_HEIGHT,
          Math.min(
            MENU_MAX_HEIGHT,
            shouldFlipAbove ? spaceAbove - viewportPadding : spaceBelow - viewportPadding,
          ),
        );
        const menuHeightForPosition = Math.min(maxHeight, estimatedMenuHeight);

        const left = Math.min(
          Math.max(rect.left, viewportPadding),
          viewportWidth - menuWidth - viewportPadding,
        );
        const top = shouldFlipAbove
          ? Math.max(viewportPadding, rect.top - menuHeightForPosition - 8)
          : Math.min(viewportHeight - menuHeightForPosition - viewportPadding, rect.bottom + 8);

        return createPortal(
          <MentionMenu
            options={options}
            selectedIndex={selectedIndex}
            onSelectOption={selectOptionAndCleanUp}
            left={left}
            top={top}
            maxHeight={maxHeight}
          />,
          document.body,
        );
      }}
      onSelectOption={onSelectOption}
      parent={anchorElement}
    />
  );
}
