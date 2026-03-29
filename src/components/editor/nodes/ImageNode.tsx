import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $isElementNode,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  createCommand,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type ElementNode,
  type LexicalCommand,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
} from "lexical";
import * as React from "react";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SerializedImageNode = SerializedLexicalNode & {
  altText: string;
  caption?: string | null;
  height?: number | null;
  maxWidth?: number;
  src: string;
  type: "image";
  version: 1;
  width?: number | null;
};

export type ImagePayload = {
  altText?: string;
  caption?: string | null;
  height?: number | null;
  key?: NodeKey;
  maxWidth?: number;
  src: string;
  width?: number | null;
};

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");
export const IMAGE_NODE_SELECT_COMMAND: LexicalCommand<NodeKey> = createCommand(
  "IMAGE_NODE_SELECT_COMMAND",
);

const DEFAULT_MAX_WIDTH = 720;

function convertImageElement(domNode: Node): DOMConversionOutput | null {
  if (!(domNode instanceof HTMLImageElement)) {
    return null;
  }

  const widthAttr = domNode.getAttribute("width");
  const heightAttr = domNode.getAttribute("height");
  const width = widthAttr ? Number.parseInt(widthAttr, 10) : null;
  const height = heightAttr ? Number.parseInt(heightAttr, 10) : null;

  return {
    node: $createImageNode({
      src: domNode.src,
      altText: domNode.alt ?? "",
      width: Number.isFinite(width) ? width : null,
      height: Number.isFinite(height) ? height : null,
    }),
  };
}

function ImageComponent({
  altText,
  caption,
  height,
  src,
  width,
  imageClassName,
}: {
  altText: string;
  caption?: string | null;
  height?: number | null;
  src: string;
  width?: number | null;
  imageClassName?: string;
}) {
  return (
    <>
      <img
        src={src}
        alt={altText}
        loading="lazy"
        className={cn(
          "h-auto w-full rounded-lg object-contain transition-colors",
          imageClassName,
        )}
        style={{ height: height ?? undefined, width: width ?? "100%" }}
      />
      {caption ? (
        <figcaption className="mt-2 w-full text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </>
  );
}

export class ImageNode extends DecoratorNode<React.JSX.Element> {
  __src: string;
  __altText: string;
  __width: number | null | undefined;
  __height: number | null | undefined;
  __caption: string | null | undefined;
  __maxWidth: number;

  static override getType(): string {
    return "image";
  }

  static override clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, {
      altText: node.__altText,
      caption: node.__caption,
      height: node.__height,
      width: node.__width,
      maxWidth: node.__maxWidth,
      key: node.__key,
    });
  }

  static override importJSON(json: SerializedImageNode): ImageNode {
    return new ImageNode(json.src, {
      altText: json.altText,
      caption: json.caption,
      height: json.height,
      maxWidth: json.maxWidth ?? DEFAULT_MAX_WIDTH,
      width: json.width,
    });
  }

  static override importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 1,
      }),
    };
  }

  constructor(src: string, payload: Omit<ImagePayload, "src"> = {}, key?: NodeKey) {
    const { altText = "", width, height, caption, maxWidth = DEFAULT_MAX_WIDTH } = payload;
    super(key ?? payload.key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
    this.__caption = caption ?? null;
    this.__maxWidth = maxWidth;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    if (this.__width) element.setAttribute("width", String(this.__width));
    if (this.__height) element.setAttribute("height", String(this.__height));
    element.setAttribute("data-lexical-image", "true");
    return { element };
  }

  override exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      altText: this.__altText,
      caption: this.__caption ?? undefined,
      height: this.__height ?? undefined,
      maxWidth: this.__maxWidth,
      src: this.__src,
      type: "image",
      version: 1,
      width: this.__width ?? undefined,
    };
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  setAltText(altText: string): void {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  setDimensions(width: number | null, height: number | null): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  setCaption(caption: string | null): void {
    const writable = this.getWritable();
    writable.__caption = caption;
  }

  setMaxWidth(maxWidth: number): void {
    const writable = this.getWritable();
    writable.__maxWidth = maxWidth;
  }

  override createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme?.image ?? "";
    if (className) {
      span.className = className;
    }
    return span;
  }

  override updateDOM(): false {
    return false;
  }

  override decorate(_editor: LexicalEditor, _config: EditorConfig): React.JSX.Element {
    return (
      <ImageNodeView
        altText={this.__altText}
        caption={this.__caption ?? undefined}
        height={this.__height ?? undefined}
        maxWidth={this.__maxWidth}
        src={this.__src}
        width={this.__width ?? undefined}
        nodeKey={this.getKey()}
        editor={_editor}
      />
    );
  }

  override isInline(): boolean {
    return false;
  }
}

export function $createImageNode(payload: ImagePayload): ImageNode {
  return new ImageNode(payload.src, payload);
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode;
}

function ImageNodeView({
  altText,
  caption,
  height,
  maxWidth,
  src,
  width,
  nodeKey,
  editor,
}: {
  altText: string;
  caption?: string | null;
  height?: number | null;
  maxWidth?: number;
  src: string;
  width?: number | null;
  nodeKey: NodeKey;
  editor: LexicalEditor;
}): React.JSX.Element {
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);

  const removeNodeAndMoveCaret = React.useCallback(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (!node) return;

      const root = $getRoot();
      const previousSibling = node.getPreviousSibling();
      const nextSibling = node.getNextSibling();

      node.remove();

      let target: LexicalNode | null = previousSibling || nextSibling || root.getLastChild();

      if (!target) {
        const paragraph = $createParagraphNode();
        root.append(paragraph);
        paragraph.selectStart();
        return;
      }

      if ($isElementNode(target)) {
        if (previousSibling) {
          (target as ElementNode).selectEnd();
        } else {
          (target as ElementNode).selectStart();
        }
      }
    });
  }, [editor, nodeKey]);

  const moveSelectionToSibling = React.useCallback(
    (direction: "previous" | "next"): boolean => {
      let handled = false;
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (!node) return;

        let sibling = direction === "previous" ? node.getPreviousSibling() : node.getNextSibling();

        if (!sibling) {
          const paragraph = $createParagraphNode();
          if (direction === "previous") {
            node.insertBefore(paragraph);
          } else {
            node.insertAfter(paragraph);
          }
          sibling = paragraph;
        }

        if (sibling && $isElementNode(sibling)) {
          if (direction === "previous") {
            (sibling as ElementNode).selectEnd();
          } else {
            (sibling as ElementNode).selectStart();
          }
          handled = true;
        }
      });
      return handled;
    },
    [editor, nodeKey],
  );

  React.useEffect(() => {
    return mergeRegister(
      editor.registerCommand<NodeKey>(
        IMAGE_NODE_SELECT_COMMAND,
        (key) => {
          if (key !== nodeKey) return false;
          if (!editor.isEditable()) return false;
          clearSelection();
          setSelected(true);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        (event) => {
          if (!isSelected) return false;
          event?.preventDefault();
          removeNodeAndMoveCaret();
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        (event) => {
          if (!isSelected) return false;
          event?.preventDefault();
          removeNodeAndMoveCaret();
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event) => {
          if (!isSelected) return false;
          event?.preventDefault();
          return moveSelectionToSibling("next");
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_LEFT_COMMAND,
        (event) => {
          if (!isSelected) return false;
          event?.preventDefault();
          return moveSelectionToSibling("previous");
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        (event) => {
          if (!isSelected) return false;
          event?.preventDefault();
          return moveSelectionToSibling("previous");
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        (event) => {
          if (!isSelected) return false;
          event?.preventDefault();
          return moveSelectionToSibling("next");
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        (event) => {
          if (!isSelected) return false;
          event?.preventDefault();
          return moveSelectionToSibling("next");
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [
    editor,
    nodeKey,
    clearSelection,
    setSelected,
    isSelected,
    removeNodeAndMoveCaret,
    moveSelectionToSibling,
  ]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!editor.isEditable()) return;
      event.preventDefault();
      editor.dispatchCommand(IMAGE_NODE_SELECT_COMMAND, nodeKey);
    },
    [editor, nodeKey],
  );

  const handleRemove = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      removeNodeAndMoveCaret();
    },
    [removeNodeAndMoveCaret],
  );

  return (
    <figure
      className={cn(
        "group relative my-4 flex flex-col items-center rounded-lg transition-shadow",
        editor.isEditable() ? "cursor-pointer" : "cursor-default",
        isSelected
          ? "ring-2 ring-primary/20"
          : editor.isEditable()
            ? "hover:ring-1 hover:ring-muted-foreground/30"
            : "",
      )}
      style={{ maxWidth }}
      onClick={handleClick}
    >
      <ImageComponent
        altText={altText}
        caption={caption}
        height={height}
        src={src}
        width={width}
        imageClassName={cn(
          isSelected ? "ring-1 ring-primary/60" : "",
          editor.isEditable() && "group-hover:ring-1 group-hover:ring-primary/40",
        )}
      />
      {editor.isEditable() && (
        <button
          type="button"
          onClick={handleRemove}
          className={cn(
            "absolute top-2 right-2 h-7 w-7 rounded-full bg-popover/90 backdrop-blur-sm text-foreground",
            "flex items-center justify-center shadow-lg ring-1 ring-foreground/5",
            "transition-opacity opacity-0 group-hover:opacity-100",
            isSelected && "opacity-100",
          )}
          aria-label="Delete image"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </figure>
  );
}
