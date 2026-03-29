import { FileText } from "lucide-react"
import { FeedbackToolCard, type ToolState } from "./feedback-tool-card"
import type { MessagePart } from "../feedback-chat-types"

interface ProcessFileToolProps {
  callPart?: MessagePart
  resultPart?: MessagePart
}

export function ProcessFileTool({ callPart, resultPart }: ProcessFileToolProps) {
  const args = (callPart?.args ?? callPart?.input) as {
    fileName?: string
    fileType?: string
    attachmentId?: string
  } | undefined

  const result = (resultPart?.result ?? resultPart?.output) as {
    success?: boolean
    itemCount?: number
    fileName?: string
    kind?: string
    message?: string
  } | undefined

  const fileName = result?.fileName ?? args?.fileName ?? "file"
  const hasResult = !!result
  const state: ToolState = result
    ? result.success ? "completed" : "error"
    : "running"

  const title = hasResult
    ? result.success
      ? `${result.itemCount ?? 0} items imported from ${fileName}`
      : result.message ?? `Failed to process ${fileName}`
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
