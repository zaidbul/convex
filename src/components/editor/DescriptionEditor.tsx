import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { $convertFromMarkdownString, $convertToMarkdownString } from "@lexical/markdown";
import { CustomMarkdownShortcutPlugin } from "./plugins/CustomMarkdownShortcutPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { EDITOR_NODES, AUTO_LINK_MATCHERS } from "./editorConfig";
import { CodeHighlightPlugin } from "./plugins/CodeHighlightPlugin";
import { ImagePlugin } from "./plugins/ImagePlugin";
import { AttachmentPlugin } from "./plugins/AttachmentPlugin";
import { IssueAutoSavePlugin } from "./plugins/IssueAutoSavePlugin";
import { LexicalDOMErrorBoundary } from "./LexicalDOMErrorBoundary";
import { useLexicalErrorSuppression } from "./hooks/useLexicalErrorSuppression";
import { MARKDOWN_CONVERT_TRANSFORMERS, MARKDOWN_SHORTCUT_TRANSFORMERS } from "./transformers";
import { issueEditorTheme } from "./editorTheme";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import { FormattingToolbar } from "./plugins/FormattingToolbar";
import { SlashCommandPlugin } from "./plugins/SlashCommandPlugin";
import { MentionsPlugin, type MemberUser } from "./plugins/MentionsPlugin";


// Plugin to load markdown content into the editor
function LoadContentPlugin({
  issueId,
  markdown,
}: {
  issueId: string;
  markdown?: string | null;
}) {
  const [editor] = useLexicalComposerContext();
  const prevIdRef = React.useRef<string | null>(null);
  const hasLoadedRef = React.useRef(false);

  React.useEffect(() => {
    if (!issueId || markdown == null) return;

    if (hasLoadedRef.current && prevIdRef.current === issueId) {
      return;
    }

    editor.getEditorState().read(() => {
      const currentMarkdown = $convertToMarkdownString(MARKDOWN_CONVERT_TRANSFORMERS);
      const isIdChange = prevIdRef.current !== issueId;
      const isContentDifferent = currentMarkdown !== markdown;

      if (isIdChange || (!hasLoadedRef.current && isContentDifferent)) {
        prevIdRef.current = issueId;
        hasLoadedRef.current = true;

        editor.update(() => {
          const root = $getRoot();
          root.clear();
          if (!markdown.trim()) {
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(""));
            root.append(paragraph);
            return;
          }
          $convertFromMarkdownString(markdown, MARKDOWN_CONVERT_TRANSFORMERS);
        });
      }
    });
  }, [editor, issueId, markdown]);

  return null;
}

export type DescriptionEditorProps = {
  issueId: string;
  initialMarkdown?: string | null;
  members?: MemberUser[];
};

export function DescriptionEditor({
  issueId,
  initialMarkdown,
  members,
}: DescriptionEditorProps) {
  const [saveStatus, setSaveStatus] = React.useState<
    "idle" | "scheduled" | "saving" | "saved" | "error"
  >("idle");

  const initialConfig = React.useMemo(
    () => ({
      namespace: `description-editor-${issueId}`,
      theme: issueEditorTheme,
      nodes: EDITOR_NODES,
      onError(error: unknown) {
        try {
          const err = error instanceof Error ? error : new Error(String(error));
          const errorMessage = err.message || "";
          if (
            (errorMessage.includes("removeChild") && errorMessage.includes("not a child")) ||
            errorMessage.includes("NotFoundError") ||
            (errorMessage.includes("Failed to execute") && errorMessage.includes("removeChild"))
          ) {
            return;
          }
          console.error(err);
        } catch {
          /* no-op */
        }
      },
    }),
    [issueId],
  );

  useLexicalErrorSuppression();

  return (
    <LexicalDOMErrorBoundary>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="outline-none focus:outline-none min-h-[120px] text-foreground"
                suppressHydrationWarning
              />
            }
            placeholder={
              <div className="pointer-events-none absolute top-0 left-0 text-muted-foreground text-[15px]">
                Add a description... (type / for commands)
              </div>
            }
            ErrorBoundary={(props) => <LexicalErrorBoundary {...props} />}
          />
          <FormattingToolbar />
        </div>

        {/* Save Status */}
        <div className="h-5 flex items-center mt-2 text-xs">
          {saveStatus === "saving" && (
            <div className="text-muted-foreground flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving...
            </div>
          )}
          {saveStatus === "saved" && (
            <div className="text-muted-foreground flex items-center gap-1.5">
              <Check className="w-3 h-3 text-emerald-500" />
              Saved
            </div>
          )}
          {saveStatus === "error" && (
            <div className="text-destructive flex items-center gap-1.5">
              <TriangleAlert className="w-3 h-3" />
              Failed to save
            </div>
          )}
        </div>

        {/* Plugins */}
        <HistoryPlugin />
        <CustomMarkdownShortcutPlugin transformers={MARKDOWN_SHORTCUT_TRANSFORMERS} />
        <IssueAutoSavePlugin
          issueId={issueId}
          transformers={MARKDOWN_CONVERT_TRANSFORMERS}
          debounceMs={800}
          onStatusChange={setSaveStatus}
        />
        <ListPlugin />
        <CheckListPlugin />
        <LinkPlugin />
        <AutoLinkPlugin matchers={AUTO_LINK_MATCHERS} />
        <CodeHighlightPlugin />
        <HorizontalRulePlugin />
        <SlashCommandPlugin />
        <MentionsPlugin members={members} />
        <ImagePlugin />
        <AttachmentPlugin />
        <LoadContentPlugin issueId={issueId} markdown={initialMarkdown} />
      </LexicalComposer>
    </LexicalDOMErrorBoundary>
  );
}
