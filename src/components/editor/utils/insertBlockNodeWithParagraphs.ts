import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isElementNode,
  type ElementNode,
  type LexicalNode,
} from "lexical";

export function insertBlockNodeWithParagraphs(node: LexicalNode): void {
  const root = $getRoot();
  const selection = $getSelection();
  const isEmptyEditor =
    root.getChildrenSize() === 0 ||
    (root.getChildrenSize() === 1 && root.getTextContent().trim() === "");

  if ($isRangeSelection(selection) && !isEmptyEditor) {
    $insertNodes([node]);
  } else if (isEmptyEditor) {
    root.clear();
    root.append(node);
  } else {
    root.append(node);
  }

  const nextSibling = node.getNextSibling();
  const nextElement =
    nextSibling && $isElementNode(nextSibling) ? (nextSibling as ElementNode) : null;

  if (nextElement) {
    nextElement.selectStart();
    return;
  }

  const trailingParagraph = $createParagraphNode();
  node.insertAfter(trailingParagraph);
  trailingParagraph.selectStart();
}
