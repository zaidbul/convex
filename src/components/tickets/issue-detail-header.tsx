import { Link, useParams } from "@tanstack/react-router"
import { ChevronRight, Copy, MoreHorizontal, Star } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { IssueDetail, Team } from "./types"

export function IssueDetailHeader({
  team,
  issue,
}: {
  team: Team
  issue: IssueDetail
}) {
  const params = useParams({ strict: false })
  const slug = (params as { slug?: string }).slug

  return (
    <div className="flex h-11 items-center gap-2 border-b border-outline-variant/10 px-2 shrink-0">
      <SidebarTrigger className="size-7" />

      <div className="flex items-center gap-1 text-sm min-w-0 flex-1">
        <Link
          to="/$slug/tickets/$teamSlug/issues"
          params={{ slug: slug!, teamSlug: team.slug }}
          search={{ filter: undefined }}
          className="shrink-0 flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <div
            className="size-3 rounded"
            style={{ backgroundColor: team.color }}
          />
          <span>{team.name}</span>
        </Link>
        <ChevronRight className="size-3 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground font-mono text-xs shrink-0">
          {issue.identifier}
        </span>
        <span className="truncate text-foreground">
          {issue.title}
        </span>
      </div>

      <Separator orientation="vertical" className="h-4 mx-1" />

      <div className="flex items-center gap-0.5 shrink-0">
        <Button variant="ghost" size="icon" className="size-7">
          <Star className="size-3.5" strokeWidth={1.5} />
        </Button>
        <Button variant="ghost" size="icon" className="size-7">
          <Copy className="size-3.5" strokeWidth={1.5} />
        </Button>
        <Button variant="ghost" size="icon" className="size-7">
          <MoreHorizontal className="size-3.5" strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  )
}
