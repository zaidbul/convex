import { COMMAND_PRIORITY_EDITOR, type LexicalCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

import { $createImageNode, type ImagePayload, INSERT_IMAGE_COMMAND } from "../nodes/ImageNode";
import { insertBlockNodeWithParagraphs } from "../utils/insertBlockNodeWithParagraphs";

export function ImagePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand<ImagePayload>(
      INSERT_IMAGE_COMMAND as LexicalCommand<ImagePayload>,
      (payload) => {
        editor.update(() => {
          const imageNode = $createImageNode(payload);
          insertBlockNodeWithParagraphs(imageNode);
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
