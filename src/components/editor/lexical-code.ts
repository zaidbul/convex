import "./plugins/prism-setup";

// Centralize Lexical code imports so Prism is initialized first.
export {
  $createCodeNode,
  $isCodeHighlightNode,
  CodeHighlightNode,
  CodeNode,
  registerCodeHighlighting,
} from "@lexical/code";
