import { registerMarkdownShortcuts, type Transformer } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $getSelection, $isRangeSelection } from "lexical";

/**
 * Custom markdown shortcut plugin that wraps the standard one.
 * Also ensures focus is preserved after markdown transformations.
 */
export function CustomMarkdownShortcutPlugin({
  transformers,
}: {
  transformers: Array<Transformer>;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregisterMarkdown = registerMarkdownShortcuts(editor, transformers);

    // Ensure focus is preserved after markdown transformations
    const unregisterFocus = editor.registerUpdateListener(
      ({ tags, editorState }) => {
        if (tags.has("historic") || tags.has("collaboration")) {
          return;
        }

        const rootElement = editor.getRootElement();
        if (!rootElement) return;

        editorState.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection) && selection.isCollapsed()) {
            requestAnimationFrame(() => {
              if (document.activeElement !== rootElement) {
                rootElement.focus({ preventScroll: true });
              }
            });
          }
        });
      },
    );

    return () => {
      unregisterMarkdown();
      unregisterFocus();
    };
  }, [editor, transformers]);

  return null;
}
