import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const readinessLabels: Array<{ max: number; label: string; color: string }> = [
  { max: 20, label: "Upload feedback files to get started", color: "text-muted-foreground" },
  { max: 40, label: "Files received — add context for better analysis", color: "text-orange-500" },
  { max: 60, label: "Getting there — a bit more context needed", color: "text-amber-500" },
  { max: 80, label: "Good context — ready for analysis", color: "text-emerald-500" },
  { max: 100, label: "Excellent — comprehensive context gathered", color: "text-emerald-600" },
]

function getReadinessInfo(score: number) {
  return readinessLabels.find((l) => score <= l.max) ?? readinessLabels[readinessLabels.length - 1]
}

export function FeedbackChatReadiness({ score }: { score: number }) {
  const info = getReadinessInfo(score)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className={cn("font-medium", info.color)}>{info.label}</span>
        <span className="tabular-nums text-muted-foreground">{score}%</span>
      </div>
      <Progress value={score} className="h-1.5" />
    </div>
  )
}
