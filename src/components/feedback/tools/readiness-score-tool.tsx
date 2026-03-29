import { Gauge } from "lucide-react"
import { FeedbackToolCard, type ToolState } from "./feedback-tool-card"
import type { MessagePart } from "../feedback-chat-types"

interface ReadinessScoreToolProps {
  callPart?: MessagePart
  resultPart?: MessagePart
}

export function ReadinessScoreTool({ callPart, resultPart }: ReadinessScoreToolProps) {
  const result = (resultPart?.result ?? resultPart?.output) as {
    score?: number
    reason?: string
  } | undefined

  const args = (callPart?.args ?? callPart?.input) as {
    score?: number
    reason?: string
  } | undefined

  const hasResult = !!result
  const state: ToolState = hasResult ? "completed" : "running"
  const score = result?.score ?? args?.score
  const reason = result?.reason ?? args?.reason

  const title = hasResult
    ? `Readiness: ${score}%${reason ? ` — ${reason}` : ""}`
    : "Updating readiness score..."

  return (
    <FeedbackToolCard
      title={title}
      icon={<Gauge className="size-3.5 text-muted-foreground" />}
      state={state}
      compact
    />
  )
}
