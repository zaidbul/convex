import { CircleDot, Circle, Loader2, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardStatsCardsProps {
  stats: { byStatus: Record<string, number>; total: number }
}

const cards = [
  {
    label: "Backlog",
    key: "backlog",
    icon: Circle,
    color: "text-muted-foreground",
    bg: "bg-muted-foreground/10",
  },
  {
    label: "Todo",
    key: "todo",
    icon: CircleDot,
    color: "text-on-surface-variant",
    bg: "bg-on-surface-variant/10",
  },
  {
    label: "In Progress",
    keys: ["in-progress", "in-review"],
    icon: Loader2,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Done",
    key: "done",
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
] as const

function getCount(
  stats: Record<string, number>,
  card: (typeof cards)[number]
): number {
  if ("keys" in card) {
    return card.keys.reduce((sum, k) => sum + (stats[k] ?? 0), 0)
  }
  return stats[card.key] ?? 0
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        const count = getCount(stats.byStatus, card)

        return (
          <Card key={card.label} className="border-outline-variant/10">
            <CardContent className="flex items-center gap-3 px-4 py-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-lg",
                  card.bg
                )}
              >
                <Icon className={cn("size-4", card.color)} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums text-foreground">
                  {count}
                </p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
