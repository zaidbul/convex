import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight, Copy, MoreHorizontal, Star } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { issueFavoriteQueryOptions } from "@/query/options/tickets"
import { useToggleIssueFavoriteMutation } from "@/query/mutations/tickets"
import { IssueActionsDropdown } from "./issue-actions-menu"
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
  const navigate = useNavigate()

  const issueUrl = `${window.location.origin}/${slug}/tickets/${team.slug}/issue/${issue.id}`

  const { data: favoriteData } = useQuery(issueFavoriteQueryOptions(issue.id))
  const toggleFavorite = useToggleIssueFavoriteMutation()
  const isFavorited = favoriteData?.favorited ?? false

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
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
          onClick={() => toggleFavorite.mutate({ issueId: issue.id })}
        >
          <Star
            className={cn(
              "size-3.5",
              isFavorited ? "fill-amber-400 text-amber-400" : ""
            )}
            strokeWidth={1.5}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          title="Copy link"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(issueUrl)
              toast.success("Link copied to clipboard")
            } catch {
              toast.error("Failed to copy link")
            }
          }}
        >
          <Copy className="size-3.5" strokeWidth={1.5} />
        </Button>
        <IssueActionsDropdown
          issueId={issue.id}
          issueIdentifier={issue.identifier}
          issueUrl={issueUrl}
          onActionComplete={() => {
            navigate({
              to: "/$slug/tickets/$teamSlug/issues",
              params: { slug: slug!, teamSlug: team.slug },
              search: { filter: undefined },
            })
          }}
          trigger={
            <Button variant="ghost" size="icon" className="size-7">
              <MoreHorizontal className="size-3.5" strokeWidth={1.5} />
            </Button>
          }
        />
      </div>
    </div>
  )
}
