import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Plus, Play, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreateIssueDialog } from "@/components/tickets/create-issue-dialog"
import type { Team } from "@/components/tickets/types"

interface DashboardQuickActionsProps {
  teams: Team[]
  slug: string
}

export function DashboardQuickActions({
  teams,
  slug,
}: DashboardQuickActionsProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const navigate = useNavigate()

  const firstTeam = teams[0]

  return (
    <>
      <Card className="border-outline-variant/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => setCreateOpen(true)}
            disabled={teams.length === 0}
          >
            <Plus className="size-4" strokeWidth={1.75} />
            New Issue
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            disabled={!firstTeam}
            onClick={() => {
              if (firstTeam) {
                navigate({
                  to: "/$slug/tickets/$teamSlug/cycles/current",
                  params: { slug, teamSlug: firstTeam.slug },
                })
              }
            }}
          >
            <Play className="size-4" strokeWidth={1.75} />
            View Cycles
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            disabled={!firstTeam}
            onClick={() => {
              if (firstTeam) {
                navigate({
                  to: "/$slug/tickets/$teamSlug/issues",
                  params: { slug, teamSlug: firstTeam.slug },
                })
              }
            }}
          >
            <Users className="size-4" strokeWidth={1.75} />
            Team View
          </Button>
        </CardContent>
      </Card>

      <CreateIssueDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        teams={teams}
        defaultTeamId={firstTeam?.id}
      />
    </>
  )
}
