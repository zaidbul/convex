import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $convertToMarkdownString, type Transformer } from "@lexical/markdown";
import { useDebouncer } from "@tanstack/react-pacer";
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
  const idleTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      isInitialLoadCompleteRef.current = true;
    }, 200);
    return () => clearTimeout(timer);
  }, [noteId]);

  const pendingRef = React.useRef<{ title: string; content: string } | null>(null);

  const performSave = React.useCallback(
    async (currentTitle: string, currentMarkdown: string) => {
      if (isSavingRef.current) {
        // Queue the latest content instead of dropping it
        pendingRef.current = { title: currentTitle, content: currentMarkdown };
        return;
      }

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
        if (idleTimerRef.current) {
          window.clearTimeout(idleTimerRef.current);
        }
        idleTimerRef.current = window.setTimeout(() => {
          idleTimerRef.current = null;
          onStatusChange?.("idle");
        }, 1200);
      } catch {
        onStatusChange?.("error");
      } finally {
        isSavingRef.current = false;
        // Drain queued content
        const pending = pendingRef.current;
        pendingRef.current = null;
        if (pending !== null && (pending.content !== lastSavedContentRef.current || pending.title !== lastSavedTitleRef.current)) {
          performSave(pending.title, pending.content);
        }
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

  const debouncedSave = useDebouncer(stablePerformSave, {
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

    debouncedSave.maybeExecute(currentTitle, markdownNow);
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
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
      debouncedSave.flush();
    };
  }, [debouncedSave]);

  return null;
}
