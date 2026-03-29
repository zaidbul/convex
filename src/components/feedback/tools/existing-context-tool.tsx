import { Database } from "lucide-react"
import { FeedbackToolCard, type ToolState } from "./feedback-tool-card"
import { Badge } from "@/components/ui/badge"
import type { MessagePart } from "../feedback-chat-types"

interface ExistingContextToolProps {
  callPart?: MessagePart
  resultPart?: MessagePart
}

export function ExistingContextTool({ resultPart }: ExistingContextToolProps) {
  const result = (resultPart?.result ?? resultPart?.output) as {
    existingItemCount?: number
    existingClusterCount?: number
    existingSuggestionCount?: number
    topFeatureAreas?: string[]
  } | undefined

  const hasResult = !!result
  const state: ToolState = hasResult ? "completed" : "running"

  const title = hasResult
    ? `${result.existingItemCount ?? 0} items, ${result.existingClusterCount ?? 0} clusters, ${result.existingSuggestionCount ?? 0} suggestions`
    : "Checking existing feedback..."

  return (
    <FeedbackToolCard
      title={title}
      icon={<Database className="size-3.5 text-muted-foreground" />}
      state={state}
      defaultOpen={hasResult}
    >
      {hasResult && result.topFeatureAreas && result.topFeatureAreas.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-muted-foreground">Top feature areas:</span>
          <div className="flex flex-wrap gap-1">
            {result.topFeatureAreas.map((area) => (
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
