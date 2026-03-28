import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { AutoLinkPlugin, type LinkMatcher } from "@lexical/react/LexicalAutoLinkPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { $convertToMarkdownString } from "@lexical/markdown";
import { CustomMarkdownShortcutPlugin } from "./plugins/CustomMarkdownShortcutPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "./lexical-code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { MentionNode } from "./nodes/MentionNode";
import { ImageNode } from "./nodes/ImageNode";
import { CodeHighlightPlugin } from "./plugins/CodeHighlightPlugin";
import { ImagePlugin } from "./plugins/ImagePlugin";
import { AttachmentPlugin } from "./plugins/AttachmentPlugin";
import { LexicalDOMErrorBoundary } from "./LexicalDOMErrorBoundary";
import { useLexicalErrorSuppression } from "./hooks/useLexicalErrorSuppression";
import { MARKDOWN_CONVERT_TRANSFORMERS, MARKDOWN_SHORTCUT_TRANSFORMERS } from "./transformers";
import { issueEditorTheme } from "./editorTheme";
import { FormattingToolbar } from "./plugins/FormattingToolbar";
import { SlashCommandPlugin } from "./plugins/SlashCommandPlugin";
import { MentionsPlugin, type MemberUser } from "./plugins/MentionsPlugin";

const URL_REG_EXP = /https?:\/\/(?:www\.)?[a-zA-Z0-9\-_]+(?:\.[a-zA-Z0-9\-_]+)+(?:[/?#][^\s]*)?/g;
const EMAIL_REG_EXP = /(?:mailto:)?[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

const AUTO_LINK_MATCHERS: LinkMatcher[] = [
  (text: string) => {
    URL_REG_EXP.lastIndex = 0;
    const match = URL_REG_EXP.exec(text);
    if (!match) return null;
    const url = match[0];
    return { index: match.index, length: url.length, text: url, url };
  },
  (text: string) => {
    EMAIL_REG_EXP.lastIndex = 0;
    const match = EMAIL_REG_EXP.exec(text);
    if (!match) return null;
    const value = match[0];
    const email = value.replace(/^mailto:/i, "");
    const url = value.startsWith("mailto:") ? value : `mailto:${email}`;
    return { index: match.index ?? 0, length: value.length, text: email, url };
  },
];

const EDITOR_NODES = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  CodeNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  HorizontalRuleNode,
  MentionNode,
  ImageNode,
];

export type CompactIssueEditorHandle = {
  getMarkdown: () => string;
  clearEditor: () => void;
};

// Bridge component to capture the editor ref from inside LexicalComposer
function EditorRefBridge({
  editorRef,
}: {
  editorRef: React.MutableRefObject<ReturnType<typeof useLexicalComposerContext>[0] | null>;
}) {
  const [editor] = useLexicalComposerContext();
  React.useEffect(() => {
    editorRef.current = editor;
  }, [editor, editorRef]);
  return null;
}

type CompactIssueEditorProps = {
  members?: MemberUser[];
  placeholder?: string;
};

export const CompactIssueEditor = forwardRef<CompactIssueEditorHandle, CompactIssueEditorProps>(
  function CompactIssueEditor({ members, placeholder }, ref) {
    const editorRef = useRef<ReturnType<typeof useLexicalComposerContext>[0] | null>(null);

    useImperativeHandle(ref, () => ({
      getMarkdown() {
        let markdown = "";
        editorRef.current?.getEditorState().read(() => {
          markdown = $convertToMarkdownString(MARKDOWN_CONVERT_TRANSFORMERS);
        });
        return markdown;
      },
      clearEditor() {
        editorRef.current?.update(() => {
          const root = $getRoot();
          root.clear();
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(""));
          root.append(paragraph);
        });
      },
    }));

    const initialConfig = React.useMemo(
      () => ({
        namespace: "compact-issue-editor",
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
      [],
    );

    useLexicalErrorSuppression();

    return (
      <LexicalDOMErrorBoundary>
        <LexicalComposer initialConfig={initialConfig}>
          <EditorRefBridge editorRef={editorRef} />
          <div className="relative rounded-lg bg-surface-low/50 ring-1 ring-foreground/5 focus-within:ring-primary/30 transition-shadow">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="outline-none focus:outline-none min-h-[120px] max-h-[300px] overflow-y-auto px-3 py-2.5 text-foreground text-[15px]"
                  suppressHydrationWarning
                />
              }
              placeholder={
                <div className="pointer-events-none absolute top-2.5 left-3 text-muted-foreground text-[15px]">
                  {placeholder ?? "Add a description... (type / for commands)"}
                </div>
              }
              ErrorBoundary={(props) => <LexicalErrorBoundary {...props} />}
            />
            <FormattingToolbar />
          </div>

          {/* Plugins */}
          <HistoryPlugin />
          <CustomMarkdownShortcutPlugin transformers={MARKDOWN_SHORTCUT_TRANSFORMERS} />
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
        </LexicalComposer>
      </LexicalDOMErrorBoundary>
    );
  },
);
