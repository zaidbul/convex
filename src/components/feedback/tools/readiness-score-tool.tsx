import { Gauge } from "lucide-react"
import { FeedbackToolCard, type ToolState } from "./feedback-tool-card"
import type { ToolPart } from "../feedback-chat-types"

interface ReadinessScoreToolProps {
  part: ToolPart
}

export function ReadinessScoreTool({ part }: ReadinessScoreToolProps) {
  const output = part.output as {
    score?: number
    reason?: string
  } | undefined

  const input = part.input as {
    score?: number
    reason?: string
  } | undefined

  const hasOutput = part.state === "output-available"
  const state: ToolState =
    part.state === "output-error" || part.state === "output-denied"
      ? "error"
      : hasOutput
        ? "completed"
        : "running"
  const score = output?.score ?? input?.score
  const reason = output?.reason ?? input?.reason

  const title = hasOutput
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
