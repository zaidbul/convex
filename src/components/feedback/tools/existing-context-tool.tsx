import { Database } from "lucide-react"
import { FeedbackToolCard, type ToolState } from "./feedback-tool-card"
import { Badge } from "@/components/ui/badge"
import type { ToolPart } from "../feedback-chat-types"

interface ExistingContextToolProps {
  part: ToolPart
}

export function ExistingContextTool({ part }: ExistingContextToolProps) {
  const output = part.output as {
    existingItemCount?: number
    existingClusterCount?: number
    existingSuggestionCount?: number
    topFeatureAreas?: string[]
  } | undefined

  const hasOutput = part.state === "output-available"
  const state: ToolState =
    part.state === "output-error" || part.state === "output-denied"
      ? "error"
      : hasOutput
        ? "completed"
        : "running"

  const title = hasOutput
    ? `${output?.existingItemCount ?? 0} items, ${output?.existingClusterCount ?? 0} clusters, ${output?.existingSuggestionCount ?? 0} suggestions`
    : "Checking existing feedback..."

  return (
    <FeedbackToolCard
      title={title}
      icon={<Database className="size-3.5 text-muted-foreground" />}
      state={state}
      defaultOpen={hasOutput}
    >
      {hasOutput && output?.topFeatureAreas && output.topFeatureAreas.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-muted-foreground">Top feature areas:</span>
          <div className="flex flex-wrap gap-1">
            {output.topFeatureAreas.map((area) => (
              <Badge key={area} variant="secondary" className="text-[10px]">
                {area}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </FeedbackToolCard>
  )
}
