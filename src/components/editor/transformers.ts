import {
  TRANSFORMERS,
  type ElementTransformer,
} from "@lexical/markdown";
import { type LexicalNode } from "lexical";
import { $createImageNode, $isImageNode, ImageNode } from "./nodes/ImageNode";

// Image transformer: ![alt](url)
export const IMAGE_TRANSFORMER: ElementTransformer = {
  dependencies: [ImageNode],
  export: (node: LexicalNode) => {
    if (!$isImageNode(node)) {
      return null;
    }
    const imageNode = node as ImageNode;
    const src = imageNode.getSrc();
    const altText = imageNode.getAltText() || "image";
    return `![${altText}](${src})`;
  },
  regExp: /^!\[([^\]]*)\]\(([^)]+)\)$/,
  replace: (parentNode, _children, match) => {
    const altText = match[1] || "image";
    const src = match[2];
    const imageNode = $createImageNode({ src, altText });
    parentNode.replace(imageNode);
  },
  type: "element",
};

// Transformers for markdown import/export
export const MARKDOWN_CONVERT_TRANSFORMERS = [
  IMAGE_TRANSFORMER,
  ...TRANSFORMERS,
];

// Transformers for markdown shortcuts (typing)
export const MARKDOWN_SHORTCUT_TRANSFORMERS = TRANSFORMERS;
