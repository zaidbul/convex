import { FileText } from "lucide-react"
import { FeedbackToolCard, type ToolState } from "./feedback-tool-card"
import type { ToolPart } from "../feedback-chat-types"

interface ProcessFileToolProps {
  part: ToolPart
}

export function ProcessFileTool({ part }: ProcessFileToolProps) {
  const input = part.input as {
    fileName?: string
    fileType?: string
    attachmentId?: string
  } | undefined

  const output = part.output as {
    success?: boolean
    itemCount?: number
    fileName?: string
    kind?: string
    message?: string
  } | undefined

  const fileName = output?.fileName ?? input?.fileName ?? "file"
  const hasOutput = part.state === "output-available"
  const state: ToolState =
    part.state === "output-error" || part.state === "output-denied"
      ? "error"
      : hasOutput
        ? output?.success === false
          ? "error"
          : "completed"
        : "running"

  const title = hasOutput
    ? output?.success
      ? `${output.itemCount ?? 0} items imported from ${fileName}`
      : output?.message ?? part.errorText ?? `Failed to process ${fileName}`
    : `Processing ${fileName}...`

  return (
    <FeedbackToolCard
      title={title}
      icon={<FileText className="size-3.5 text-muted-foreground" />}
      state={state}
      compact
    />
  )
}
