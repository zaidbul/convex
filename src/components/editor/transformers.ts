import {
  TRANSFORMERS,
  type TextMatchTransformer,
  type ElementTransformer,
} from "@lexical/markdown";
import { type LexicalNode, type TextNode } from "lexical";
import { $createImageNode, $isImageNode, ImageNode } from "./nodes/ImageNode";
import {
  $createMentionNode,
  $isMentionNode,
  MentionNode,
} from "./nodes/MentionNode";

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

const MENTION_IMPORT_REGEXP = /@\[(.+?)\]\(mention:([^)]+)\)/;

export const MENTION_TRANSFORMER: TextMatchTransformer = {
  dependencies: [MentionNode],
  export: (node: LexicalNode) => {
    if (!$isMentionNode(node)) {
      return null;
    }

    const label = node.getLabel().replaceAll("]", "\\]");
    return `@[${label}](mention:${node.getId()})`;
  },
  importRegExp: MENTION_IMPORT_REGEXP,
  regExp: MENTION_IMPORT_REGEXP,
  replace: (node: TextNode, match: RegExpMatchArray) => {
    const label = match[1];
    const id = match[2];

    if (!label || !id) {
      return;
    }

    node.replace(
      $createMentionNode({
        id,
        label: label.replaceAll("\\]", "]"),
      })
    );
  },
  trigger: "@",
  type: "text-match",
};

// Transformers for markdown import/export
export const MARKDOWN_CONVERT_TRANSFORMERS = [
  IMAGE_TRANSFORMER,
  MENTION_TRANSFORMER,
  ...TRANSFORMERS,
];

// Transformers for markdown shortcuts (typing)
export const MARKDOWN_SHORTCUT_TRANSFORMERS = TRANSFORMERS;
