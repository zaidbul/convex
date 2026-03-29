import { Link } from "@tanstack/react-router"
import { ArrowRight, Sparkles } from "lucide-react"
import type { FeedbackSuggestion } from "@/components/tickets/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const statusLabelMap: Record<FeedbackSuggestion["status"], string> = {
  new: "New",
  reviewing: "Reviewing",
  accepted: "Accepted",
  issue_created: "Issue Created",
  dismissed: "Dismissed",
}

export function DashboardSuggestedDirections({
  suggestions,
  slug,
}: {
  suggestions: FeedbackSuggestion[]
  slug: string
}) {
  const visibleSuggestions = suggestions.slice(0, 6)

  return (
    <Card className="border-outline-variant/10">
      <CardHeader className="flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" strokeWidth={1.75} />
          <CardTitle className="text-sm font-medium">Suggested Directions</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          render={
            <Link
              to="/$slug/tickets/synthesize/suggestions"
              params={{ slug }}
            />
          }
        >
          Open hub
          <ArrowRight className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-1">
        {visibleSuggestions.length === 0 ? (
          <div className="px-6 py-10 text-sm text-muted-foreground">
            Import feedback to generate suggested directions.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Signals</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleSuggestions.map((suggestion) => (
                <TableRow key={suggestion.id}>
                  <TableCell className="max-w-[320px]">
                    <div className="space-y-1">
                      <p className="truncate font-medium text-foreground">{suggestion.title}</p>
                      <p className="line-clamp-2 whitespace-normal text-xs text-muted-foreground">
                        {suggestion.summary}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {suggestion.selectedTeam?.name ??
                      suggestion.suggestedTeam?.name ??
                      "Unassigned"}
                  </TableCell>
                  <TableCell>{suggestion.evidenceCount}</TableCell>
                  <TableCell>{suggestion.confidence}%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full text-[10px]">
                      {statusLabelMap[suggestion.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
