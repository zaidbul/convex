import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $convertToMarkdownString, type Transformer } from "@lexical/markdown";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useUpdateIssueDescriptionMutation } from "@/query/mutations/tickets";

type IssueAutoSavePluginProps = {
  issueId: string;
  transformers: ReadonlyArray<Transformer>;
  debounceMs?: number;
  onStatusChange?: (status: "idle" | "scheduled" | "saving" | "saved" | "error") => void;
};

export function IssueAutoSavePlugin(props: IssueAutoSavePluginProps): null {
  const {
    issueId,
    transformers,
    debounceMs = 800,
    onStatusChange,
  } = props;

  const [editor] = useLexicalComposerContext();
  const updateDescription = useUpdateIssueDescriptionMutation();

  const lastSavedRef = React.useRef<string | null>(null);
  const isSavingRef = React.useRef<boolean>(false);
  const isInitialLoadCompleteRef = React.useRef<boolean>(false);

  // Mark initial load complete after a short delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      isInitialLoadCompleteRef.current = true;
    }, 200);
    return () => clearTimeout(timer);
  }, [issueId]);

  const performSave = React.useCallback(
    async (currentMarkdown: string) => {
      if (isSavingRef.current) return;

      // Skip if nothing changed
      if (currentMarkdown === lastSavedRef.current) {
        onStatusChange?.("idle");
        return;
      }

      try {
        isSavingRef.current = true;
        onStatusChange?.("saving");
        await updateDescription.mutateAsync({
          issueId,
          description: currentMarkdown,
        });
        lastSavedRef.current = currentMarkdown;
        onStatusChange?.("saved");
        window.setTimeout(() => onStatusChange?.("idle"), 1200);
      } catch {
        onStatusChange?.("error");
      } finally {
        isSavingRef.current = false;
      }
    },
    [issueId, updateDescription, onStatusChange],
  );

  const performSaveRef = React.useRef(performSave);
  React.useLayoutEffect(() => {
    performSaveRef.current = performSave;
  }, [performSave]);

  const stablePerformSave = React.useCallback((...args: Parameters<typeof performSave>) => {
    return performSaveRef.current(...args);
  }, []);

  const debouncedSave = useDebouncedCallback(stablePerformSave, {
    wait: debounceMs,
  });

  const scheduleSave = React.useCallback(() => {
    if (!isInitialLoadCompleteRef.current) return;

    let markdownNow = "";
    editor.getEditorState().read(() => {
      markdownNow = $convertToMarkdownString(transformers as Transformer[]);
    });

    if (markdownNow === lastSavedRef.current) {
      onStatusChange?.("idle");
      return;
    }

    debouncedSave(markdownNow);
  }, [debouncedSave, editor, transformers, onStatusChange]);

  React.useEffect(() => {
    return editor.registerUpdateListener(() => {
      scheduleSave();
    });
  }, [editor, scheduleSave]);

  // Flush pending save on unmount
  React.useEffect(() => {
    return () => {
      (debouncedSave as any).flush?.();
    };
  }, [debouncedSave]);

  return null;
}
