import { $getSelection, $isRangeSelection, TextNode, $createParagraphNode } from "lexical";
import { LexicalTypeaheadMenuPlugin, MenuOption } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code2,
  Quote,
  Minus,
  Type,
  Image,
} from "lucide-react";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createCodeNode } from "../lexical-code";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { TRIGGER_IMAGE_UPLOAD_COMMAND } from "./AttachmentPlugin";

const SLASH_REGEX = /(^|\s)\/([a-zA-Z0-9]*)$/;

type SlashCommand = {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[];
  execute: (editor: ReturnType<typeof useLexicalComposerContext>[0]) => void;
};

const SLASH_COMMANDS: SlashCommand[] = [
  {
    id: "paragraph",
    label: "Text",
    description: "Plain text paragraph",
    icon: <Type className="h-4 w-4" />,
    keywords: ["text", "paragraph", "p"],
    execute: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    },
  },
  {
    id: "h1",
    label: "Heading 1",
    description: "Large section heading",
    icon: <Heading1 className="h-4 w-4" />,
    keywords: ["heading", "h1", "title", "large"],
    execute: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h1"));
        }
      });
    },
  },
  {
    id: "h2",
    label: "Heading 2",
    description: "Medium section heading",
    icon: <Heading2 className="h-4 w-4" />,
    keywords: ["heading", "h2", "subtitle", "medium"],
    execute: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h2"));
        }
      });
    },
  },
  {
    id: "h3",
    label: "Heading 3",
    description: "Small section heading",
    icon: <Heading3 className="h-4 w-4" />,
    keywords: ["heading", "h3", "small"],
    execute: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h3"));
        }
      });
    },
  },
  {
    id: "bullet-list",
    label: "Bullet List",
    description: "Unordered list with bullets",
    icon: <List className="h-4 w-4" />,
    keywords: ["bullet", "list", "ul", "unordered"],
    execute: (editor) => {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    },
  },
  {
    id: "numbered-list",
    label: "Numbered List",
    description: "Ordered list with numbers",
    icon: <ListOrdered className="h-4 w-4" />,
    keywords: ["numbered", "list", "ol", "ordered"],
    execute: (editor) => {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    },
  },
  {
    id: "checklist",
    label: "Checklist",
    description: "Task list with checkboxes",
    icon: <CheckSquare className="h-4 w-4" />,
    keywords: ["check", "todo", "task", "checkbox"],
    execute: (editor) => {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    },
  },
  {
    id: "code",
    label: "Code Block",
    description: "Code with syntax highlighting",
    icon: <Code2 className="h-4 w-4" />,
    keywords: ["code", "codeblock", "snippet", "pre"],
    execute: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    },
  },
  {
    id: "quote",
    label: "Quote",
    description: "Blockquote for citations",
    icon: <Quote className="h-4 w-4" />,
    keywords: ["quote", "blockquote", "citation"],
    execute: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    },
  },
  {
    id: "divider",
    label: "Divider",
    description: "Horizontal line separator",
    icon: <Minus className="h-4 w-4" />,
    keywords: ["divider", "hr", "line", "separator"],
    execute: (editor) => {
      editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    },
  },
  {
    id: "image",
    label: "Image",
    description: "Upload an image",
    icon: <Image className="h-4 w-4" />,
    keywords: ["image", "picture", "photo", "upload", "attachment"],
    execute: (editor) => {
      editor.dispatchCommand(TRIGGER_IMAGE_UPLOAD_COMMAND, undefined);
    },
  },
];

class SlashCommandOption extends MenuOption {
  constructor(public command: SlashCommand) {
    super(command.id);
  }
}

function getFilteredCommands(query: string): SlashCommand[] {
  const normalized = query.toLowerCase();
  if (!normalized) return SLASH_COMMANDS;
  return SLASH_COMMANDS.filter((cmd) => {
    if (cmd.label.toLowerCase().includes(normalized)) return true;
    return cmd.keywords.some((kw) => kw.includes(normalized));
  });
}

type SlashCommandPluginProps = {
  anchorElem?: HTMLElement;
};

export function SlashCommandPlugin({ anchorElem }: SlashCommandPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = React.useState<string>("");
  const anchorElement = anchorElem ?? (typeof document !== "undefined" ? document.body : undefined);

  const options = React.useMemo(() => {
    return getFilteredCommands(query).map((command) => new SlashCommandOption(command));
  }, [query]);

  const onSelectOption = React.useCallback(
    (option: SlashCommandOption, nodeToRemove: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove();
        }
      });
      option.command.execute(editor);
      closeMenu();
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<SlashCommandOption>
      onQueryChange={(newQuery) => {
        setQuery(newQuery ?? "");
      }}
      triggerFn={(_text) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return null;

        const anchor = selection.anchor.getNode();
        if (!(anchor instanceof TextNode)) return null;

        const textContent = anchor.getTextContent().slice(0, selection.anchor.offset);
        const match = textContent.match(SLASH_REGEX);

        if (!match || match.index === undefined) return null;

        const slashStartOffset = match.index + match[1].length;

        return {
          leadOffset: slashStartOffset,
          matchingString: match[2] ?? "",
          replaceableString: "/" + (match[2] ?? ""),
        };
      }}
      options={options}
      menuRenderFn={(anchorRef, { selectedIndex, selectOptionAndCleanUp }) => {
        const container = anchorRef.current;
        if (!container || options.length === 0) return null;

        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const menuHeight = Math.min(options.length * 52 + 32, 320);
        const shouldFlipAbove = rect.bottom + menuHeight > viewportHeight - 20;

        return createPortal(
          <div
            className="fixed max-h-80 w-72 overflow-y-auto rounded-2xl bg-popover/90 backdrop-blur-2xl p-1.5 shadow-2xl ring-1 ring-foreground/5"
            style={{
              zIndex: 9999,
              left: rect.left,
              ...(shouldFlipAbove
                ? { bottom: viewportHeight - rect.top + 4 }
                : { top: rect.bottom + 4 }),
            }}
          >
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Basic blocks
            </div>
            {options.map((option, i) => (
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  selectOptionAndCleanUp(option);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm hover:bg-accent ${
                  i === selectedIndex ? "bg-accent" : ""
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-low text-muted-foreground">
                  {option.command.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{option.command.label}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {option.command.description}
                  </div>
                </div>
              </button>
            ))}
          </div>,
          document.body,
        );
      }}
      onSelectOption={onSelectOption}
      parent={anchorElement}
    />
  );
}
