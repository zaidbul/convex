import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
  type LexicalEditor,
  getDOMSelection,
  $isParagraphNode,
  $isTextNode,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $isHeadingNode, type HeadingTagType } from "@lexical/rich-text";
import { $createParagraphNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState, useRef } from "react";
import { mergeRegister } from "@lexical/utils";
import { createPortal } from "react-dom";
import type React from "react";
import {
  Bold,
  CaseLower,
  CaseSensitive,
  CaseUpper,
  ChevronDown,
  Code2,
  CornerDownLeft,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  Strikethrough,
  TextQuote,
  Underline,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isLinkNode } from "@lexical/link";
import { $isCodeHighlightNode } from "../lexical-code";
import { getDOMRangeRect } from "../utils/getDOMRangeRect";
import { setFloatingElemPosition } from "../utils/setFloatingElemPosition";

function getSelectedNode(selection: ReturnType<typeof $getSelection>) {
  if (!$isRangeSelection(selection)) return null;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  return isBackward ? focusNode : anchorNode;
}

function safePrompt(message: string, defaultValue?: string): string | null {
  const promptFn =
    typeof globalThis !== "undefined" && "prompt" in globalThis
      ? (globalThis as { prompt?: typeof prompt }).prompt
      : undefined;
  return typeof promptFn === "function" ? promptFn(message, defaultValue) : null;
}

type BlockType = "paragraph" | "h1" | "h2" | "h3" | "h4";

const blockTypeToLabel: Record<BlockType, string> = {
  paragraph: "Regular text",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
};

function FloatingTextFormatToolbar({
  editor,
  anchorElem,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isStrikethrough,
  isCode,
  blockType,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isLink: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
  blockType: BlockType;
}) {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

  const insertLink = useCallback(() => {
    const url = safePrompt("Enter URL");
    if (url === null) return;
    if (url === "") {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url });
    }
  }, [editor]);

  function mouseMoveListener(e: MouseEvent) {
    if (popupCharStylesEditorRef?.current && (e.buttons === 1 || e.buttons === 3)) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== "none") {
        const x = e.clientX;
        const y = e.clientY;
        const elementUnderMouse = document.elementFromPoint(x, y);

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          popupCharStylesEditorRef.current.style.pointerEvents = "none";
        }
      }
    }
  }
  function mouseUpListener() {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== "auto") {
        popupCharStylesEditorRef.current.style.pointerEvents = "auto";
      }
    }
  }

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.addEventListener("mousemove", mouseMoveListener);
    document.addEventListener("mouseup", mouseUpListener);

    return () => {
      document.removeEventListener("mousemove", mouseMoveListener);
      document.removeEventListener("mouseup", mouseUpListener);
    };
  }, [popupCharStylesEditorRef]);

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = getDOMSelection(editor._window);

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      setFloatingElemPosition(rangeRect, popupCharStylesEditorElem, anchorElem, isLink);
    }
  }, [editor, anchorElem, isLink]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar();
      });
    };

    globalThis.addEventListener("resize", update);
    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      globalThis.removeEventListener("resize", update);
      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
      }
    };
  }, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateTextFormatFloatingToolbar]);

  const formatBlockType = useCallback(
    (newBlockType: BlockType) => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        if (newBlockType === "paragraph") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          const headingTag = newBlockType as HeadingTagType;
          $setBlocksType(selection, () => $createHeadingNode(headingTag));
        }
      });
    },
    [editor],
  );

  return (
    <div
      ref={popupCharStylesEditorRef}
      className="fixed flex items-center gap-1 rounded-2xl bg-popover/90 backdrop-blur-2xl px-2 py-1.5 shadow-2xl ring-1 ring-foreground/5"
      style={{
        opacity: 0,
        top: 0,
        left: 0,
        transform: "translate(-10000px, -10000px)",
        zIndex: 9999,
        willChange: "transform, opacity",
      }}
    >
      {editor.isEditable() && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center gap-1 rounded-xl px-2 py-1 text-sm hover:bg-accent"
            >
              <span className="text-xs font-medium">{blockTypeToLabel[blockType]}</span>
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                onClick={() => formatBlockType("paragraph")}
                className={blockType === "paragraph" ? "bg-accent" : ""}
              >
                <TextQuote className="mr-2 h-4 w-4" />
                Regular text
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => formatBlockType("h1")}
                className={blockType === "h1" ? "bg-accent" : ""}
              >
                <Heading1 className="mr-2 h-4 w-4" />
                <span className="font-bold text-lg">Heading 1</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => formatBlockType("h2")}
                className={blockType === "h2" ? "bg-accent" : ""}
              >
                <Heading2 className="mr-2 h-4 w-4" />
                <span className="font-bold text-base">Heading 2</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => formatBlockType("h3")}
                className={blockType === "h3" ? "bg-accent" : ""}
              >
                <Heading3 className="mr-2 h-4 w-4" />
                <span className="font-bold text-sm">Heading 3</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="mx-1 h-5 w-px bg-foreground/10" />
          <Button
            variant={isBold ? "secondary" : "ghost"}
            size="sm"
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            title="Bold"
            aria-label="Format text as bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={isItalic ? "secondary" : "ghost"}
            size="sm"
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            title="Italic"
            aria-label="Format text as italics"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={isUnderline ? "secondary" : "ghost"}
            size="sm"
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            title="Underline"
            aria-label="Format text to underlined"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant={isStrikethrough ? "secondary" : "ghost"}
            size="sm"
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            }}
            title="Strikethrough"
            aria-label="Format text with a strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant={isCode ? "secondary" : "ghost"}
            size="sm"
            type="button"
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            }}
            title="Code"
            aria-label="Format as code"
          >
            <Code2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center justify-center rounded-xl p-1.5 hover:bg-accent"
            >
              <CaseSensitive className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => {
                  editor.update(() => {
                    const selection = $getSelection();
                    if (!$isRangeSelection(selection) || selection.isCollapsed()) return;
                    const text = selection.getTextContent();
                    const transformed = text.toUpperCase();
                    selection.insertText(transformed);
                  });
                }}
              >
                <CaseUpper className="mr-2 h-4 w-4" />
                Uppercase
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  editor.update(() => {
                    const selection = $getSelection();
                    if (!$isRangeSelection(selection) || selection.isCollapsed()) return;
                    const text = selection.getTextContent();
                    const transformed = text.toLowerCase();
                    selection.insertText(transformed);
                  });
                }}
              >
                <CaseLower className="mr-2 h-4 w-4" />
                Lowercase
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  editor.update(() => {
                    const selection = $getSelection();
                    if (!$isRangeSelection(selection) || selection.isCollapsed()) return;
                    const text = selection.getTextContent();
                    const transformed = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
                    selection.insertText(transformed);
                  });
                }}
              >
                <CornerDownLeft className="mr-2 h-4 w-4" />
                Sentence case
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant={isLink ? "secondary" : "ghost"}
            size="sm"
            type="button"
            onClick={insertLink}
            title="Insert link"
            aria-label="Insert link"
          >
            <Link2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}

function useFloatingTextFormatToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
): React.JSX.Element | null {
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = getDOMSelection(editor._window);
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        setIsText(false);
        return;
      }

      const node = getSelectedNode(selection);

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

      if ($isHeadingNode(element)) {
        const tag = element.getTag();
        setBlockType(tag as BlockType);
      } else {
        setBlockType("paragraph");
      }

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      const parent = node?.getParent();
      if (node && ($isLinkNode(parent) || $isLinkNode(node))) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (!$isCodeHighlightNode(selection.anchor.getNode()) && selection.getTextContent() !== "") {
        setIsText(node ? $isTextNode(node) || $isParagraphNode(node) : false);
      } else {
        setIsText(false);
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, "");
      if (!selection.isCollapsed() && rawTextContent === "") {
        setIsText(false);
        return;
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener("selectionchange", updatePopup);
    return () => {
      document.removeEventListener("selectionchange", updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      }),
    );
  }, [editor, updatePopup]);

  if (!isText) {
    return null;
  }

  return createPortal(
    <FloatingTextFormatToolbar
      editor={editor}
      anchorElem={anchorElem}
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isUnderline={isUnderline}
      isStrikethrough={isStrikethrough}
      isCode={isCode}
      blockType={blockType}
    />,
    anchorElem,
  );
}

type FormattingToolbarProps = {
  anchorElem?: HTMLElement;
};

export function FormattingToolbar({ anchorElem }: FormattingToolbarProps) {
  const [editor] = useLexicalComposerContext();
  const anchor =
    anchorElem ?? (typeof document !== "undefined" ? document.body : undefined);
  return useFloatingTextFormatToolbar(editor, anchor!);
}
