import type { MessagePart } from "../feedback-chat-types"
import { ProcessFileTool } from "./process-file-tool"
import { AskQuestionsTool, type AskQuestionsOutput } from "./ask-questions-tool"
import { ReadinessScoreTool } from "./readiness-score-tool"
import { ExistingContextTool } from "./existing-context-tool"
import { FeedbackToolCard } from "./feedback-tool-card"

interface FeedbackToolRendererProps {
  /** The tool-call part (has args/input) */
  callPart?: MessagePart
  /** The tool-result part (has result/output) */
  resultPart?: MessagePart
  /** Callback for interactive tool outputs (askStructuredQuestions) */
  onToolOutput?: (toolCallId: string, output: AskQuestionsOutput) => void
}

/**
 * Routes a tool call/result pair to the appropriate display component.
 * Call this for each tool invocation in a message.
 */
export function FeedbackToolRenderer({
  callPart,
  resultPart,
  onToolOutput,
}: FeedbackToolRendererProps) {
  const toolName = callPart?.toolName ?? resultPart?.toolName

  switch (toolName) {
    case "processUploadedFile":
      return <ProcessFileTool callPart={callPart} resultPart={resultPart} />

    case "askStructuredQuestions":
      return (
        <AskQuestionsTool
          callPart={callPart}
          resultPart={resultPart}
          onSubmit={onToolOutput}
        />
      )

    case "updateReadinessScore":
      return <ReadinessScoreTool callPart={callPart} resultPart={resultPart} />

    case "getExistingFeedbackContext":
      return <ExistingContextTool callPart={callPart} resultPart={resultPart} />

    default: {
      // Generic fallback for unknown tools
      const hasResult = !!resultPart
      return (
        <FeedbackToolCard
          title={toolName ?? "Tool"}
          state={hasResult ? "completed" : "running"}
        >
          {hasResult && (
            <pre className="max-h-32 overflow-auto whitespace-pre-wrap text-muted-foreground">
              {JSON.stringify(resultPart?.result ?? resultPart?.output, null, 2)}
            </pre>
          )}
        </FeedbackToolCard>
      )
    }
  }
}
