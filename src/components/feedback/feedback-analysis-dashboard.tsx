import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Zap } from "lucide-react"
import type {
  FeedbackItem,
  FeedbackCluster,
  FeedbackSuggestion,
  FeedbackImport,
} from "@/components/tickets/types"

interface FeedbackAnalysisDashboardProps {
  items: FeedbackItem[]
  clusters: FeedbackCluster[]
  suggestions: FeedbackSuggestion[]
  imports: FeedbackImport[]
  onAutoCreateTickets?: () => void
  isAutoCreating?: boolean
}

const SEVERITY_COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
}

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2, 173 58% 39%))",
  "hsl(var(--chart-3, 197 37% 24%))",
  "hsl(var(--chart-4, 43 74% 66%))",
  "hsl(var(--chart-5, 27 87% 67%))",
]

export function FeedbackAnalysisDashboard({
  items,
  clusters,
  suggestions,
  imports,
  onAutoCreateTickets,
  isAutoCreating,
}: FeedbackAnalysisDashboardProps) {
  // Severity distribution
  const severityData = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0, unknown: 0 }
    for (const item of items) {
      if (item.severity === "high") counts.high++
      else if (item.severity === "medium") counts.medium++
      else if (item.severity === "low") counts.low++
      else counts.unknown++
    }
    return [
      { name: "High", value: counts.high, fill: SEVERITY_COLORS.high },
      { name: "Medium", value: counts.medium, fill: SEVERITY_COLORS.medium },
      { name: "Low", value: counts.low, fill: SEVERITY_COLORS.low },
    ].filter((d) => d.value > 0)
  }, [items])

  // Feature area breakdown
  const featureAreaData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of items) {
      const area = item.featureArea ?? "Uncategorized"
      counts.set(area, (counts.get(area) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }))
  }, [items])

  // Import source breakdown
  const sourceData = useMemo(() => {
    const counts = new Map<string, number>()
    for (const imp of imports) {
      counts.set(imp.sourceName, (counts.get(imp.sourceName) ?? 0) + imp.itemCount)
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }))
  }, [imports])

  // Top suggestions ranked by priority
  const topSuggestions = useMemo(
    () =>
      suggestions
        .filter((s) => s.status === "new" || s.status === "reviewing")
        .slice(0, 6),
    [suggestions]
  )

  // Stats
  const analyzedCount = items.filter((i) => i.analyzedAt).length
  const highConfidenceSuggestions = suggestions.filter(
    (s) => s.confidence >= 75 && s.status === "new"
  )

  const isEmpty = items.length === 0

  if (isEmpty) {
    return (
      <Card className="border-outline-variant/10">
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <BarChart3 className="size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No feedback data to analyze yet. Import feedback via the Chat or
            Imports tab, then run analysis.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Signals"
          value={items.length}
          subtitle={`${analyzedCount} analyzed`}
          icon={<BarChart3 className="size-4" />}
        />
        <StatCard
          title="Clusters"
          value={clusters.length}
          subtitle={`${clusters.reduce((sum, c) => sum + c.signalCount, 0)} signals grouped`}
          icon={<PieChartIcon className="size-4" />}
        />
        <StatCard
          title="Suggestions"
          value={suggestions.length}
          subtitle={`${highConfidenceSuggestions.length} high confidence`}
          icon={<TrendingUp className="size-4" />}
        />
        <StatCard
          title="Sources"
          value={imports.length}
          subtitle={`${new Set(imports.map((i) => i.kind)).size} formats`}
          icon={<Zap className="size-4" />}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Severity distribution */}
        {severityData.length > 0 && (
          <Card className="border-outline-variant/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Severity Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {severityData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4">
                {severityData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: d.fill }}
                    />
                    {d.name}: {d.value}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feature area breakdown */}
        {featureAreaData.length > 0 && (
          <Card className="border-outline-variant/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                By Feature Area
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={featureAreaData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Source breakdown */}
      {sourceData.length > 0 && (
        <Card className="border-outline-variant/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">By Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {sourceData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Top suggestions */}
      {topSuggestions.length > 0 && (
        <Card className="border-outline-variant/10">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium">
              Top Actionable Suggestions
            </CardTitle>
            {onAutoCreateTickets && highConfidenceSuggestions.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={onAutoCreateTickets}
                disabled={isAutoCreating}
              >
                {isAutoCreating
                  ? "Creating tickets..."
                  : `Auto-create ${highConfidenceSuggestions.length} ticket${highConfidenceSuggestions.length > 1 ? "s" : ""}`}
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            {topSuggestions.map((s) => (
              <div
                key={s.id}
                className="flex items-start justify-between gap-3 rounded-md border px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {s.summary}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {s.evidenceCount} signals
                  </Badge>
                  <Badge
                    variant={s.confidence >= 75 ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {s.confidence}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string
  value: number
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <Card className="border-outline-variant/10">
      <CardContent className="flex items-center gap-3 py-4">
        <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-[10px] text-muted-foreground/70">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )
}
