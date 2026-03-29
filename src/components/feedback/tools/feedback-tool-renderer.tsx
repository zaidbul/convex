import type { ToolPart } from "../feedback-chat-types"
import { ProcessFileTool } from "./process-file-tool"
import { AskQuestionsTool, type AskQuestionsOutput } from "./ask-questions-tool"
import { ReadinessScoreTool } from "./readiness-score-tool"
import { ExistingContextTool } from "./existing-context-tool"
import { FeedbackToolCard } from "./feedback-tool-card"

interface FeedbackToolRendererProps {
  part: ToolPart
  /** Callback for interactive tool outputs (askStructuredQuestions) */
  onToolOutput?: (toolCallId: string, output: AskQuestionsOutput) => void
}

/**
 * Routes a tool call/result pair to the appropriate display component.
 * Call this for each tool invocation in a message.
 */
export function FeedbackToolRenderer({
  part,
  onToolOutput,
}: FeedbackToolRendererProps) {
  const toolName = part.toolName

  switch (toolName) {
    case "processUploadedFile":
      return <ProcessFileTool part={part} />

    case "askStructuredQuestions":
      return (
        <AskQuestionsTool
          part={part}
          onSubmit={onToolOutput}
        />
      )

    case "updateReadinessScore":
      return <ReadinessScoreTool part={part} />

    case "getExistingFeedbackContext":
      return <ExistingContextTool part={part} />

    default: {
      const hasOutput = part.state === "output-available"
      return (
        <FeedbackToolCard
          title={toolName}
          state={
            part.state === "output-error" || part.state === "output-denied"
              ? "error"
              : hasOutput
                ? "completed"
                : "running"
          }
        >
          {hasOutput && (
            <pre className="max-h-32 overflow-auto whitespace-pre-wrap text-muted-foreground">
              {JSON.stringify(part.output, null, 2)}
            </pre>
          )}
        </FeedbackToolCard>
      )
    }
  }
}
