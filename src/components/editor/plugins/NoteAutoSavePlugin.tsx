import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $convertToMarkdownString, type Transformer } from "@lexical/markdown";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useUpdateNoteMutation } from "@/query/mutations/notes";

type NoteAutoSavePluginProps = {
  noteId: string;
  transformers: ReadonlyArray<Transformer>;
  debounceMs?: number;
  title?: string;
  onStatusChange?: (status: "idle" | "scheduled" | "saving" | "saved" | "error") => void;
};

export function NoteAutoSavePlugin(props: NoteAutoSavePluginProps): null {
  const {
    noteId,
    transformers,
    debounceMs = 800,
    title,
    onStatusChange,
  } = props;

  const [editor] = useLexicalComposerContext();
  const updateNote = useUpdateNoteMutation();

  const lastSavedContentRef = React.useRef<string | null>(null);
  const lastSavedTitleRef = React.useRef<string | null>(null);
  const isSavingRef = React.useRef<boolean>(false);
  const isInitialLoadCompleteRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      isInitialLoadCompleteRef.current = true;
    }, 200);
    return () => clearTimeout(timer);
  }, [noteId]);

  const performSave = React.useCallback(
    async (currentTitle: string, currentMarkdown: string) => {
      if (isSavingRef.current) return;

      if (
        currentMarkdown === lastSavedContentRef.current &&
        currentTitle === lastSavedTitleRef.current
      ) {
        onStatusChange?.("idle");
        return;
      }

      try {
        isSavingRef.current = true;
        onStatusChange?.("saving");
        await updateNote.mutateAsync({
          noteId,
          title: currentTitle,
          content: currentMarkdown,
        });
        lastSavedContentRef.current = currentMarkdown;
        lastSavedTitleRef.current = currentTitle;
        onStatusChange?.("saved");
        window.setTimeout(() => onStatusChange?.("idle"), 1200);
      } catch {
        onStatusChange?.("error");
      } finally {
        isSavingRef.current = false;
      }
    },
    [noteId, updateNote, onStatusChange],
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
    const currentTitle = (title ?? "").trim();

    if (
      markdownNow === lastSavedContentRef.current &&
      currentTitle === lastSavedTitleRef.current
    ) {
      onStatusChange?.("idle");
      return;
    }

    debouncedSave(currentTitle, markdownNow);
  }, [debouncedSave, editor, transformers, title, onStatusChange]);

  React.useEffect(() => {
    return editor.registerUpdateListener(() => {
      scheduleSave();
    });
  }, [editor, scheduleSave]);

  // Also schedule save when title changes
  React.useEffect(() => {
    scheduleSave();
  }, [scheduleSave]);

  React.useEffect(() => {
    return () => {
      (debouncedSave as any).flush?.();
    };
  }, [debouncedSave]);

  return null;
}
