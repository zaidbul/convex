import { useMemo } from "react"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import {
  CircleDot,
  Eye,
  Sparkles,
  Settings,
  Users,
} from "lucide-react"
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import type { Issue, Team } from "./types"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const params = useParams({ strict: false })
  const slug = (params as { slug?: string }).slug
  const queryClient = useQueryClient()

  if (!slug) return null

  const teams = queryClient.getQueryData<Team[]>(["teams"]) ?? []

  const allIssues = useMemo(() => {
    const queriesData = queryClient.getQueriesData<Issue[]>({ queryKey: ["issues"] })
    const seen = new Set<string>()
    const result: Array<Issue & { teamSlug: string }> = []

    for (const [key, data] of queriesData) {
      const teamSlug = key[1] as string
      if (data) {
        for (const issue of data) {
          if (!seen.has(issue.id)) {
            seen.add(issue.id)
            result.push({ ...issue, teamSlug })
          }
        }
      }
    }

    return result
  }, [queryClient])

  function runAction(fn: () => void) {
    onOpenChange(false)
    fn()
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Search issues, teams, or pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {allIssues.length > 0 && (
            <CommandGroup heading="Issues">
              {allIssues.slice(0, 10).map((issue) => (
                <CommandItem
                  key={issue.id}
                  onSelect={() =>
                    runAction(() =>
                      navigate({
                        to: "/$slug/tickets/$teamSlug/issue/$issueId",
                        params: {
                          slug: slug,
                          teamSlug: issue.teamSlug,
                          issueId: issue.id,
                        },
                      })
                    )
                  }
                >
                  <CircleDot className="size-4 text-on-surface-variant" strokeWidth={1.5} />
                  <span className="text-xs text-on-surface-variant">
                    {issue.identifier}
                  </span>
                  <span className="truncate">{issue.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {teams.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Teams">
                {teams.map((team) => (
                  <CommandItem
                    key={team.id}
                    onSelect={() =>
                      runAction(() =>
                        navigate({
                          to: "/$slug/tickets/$teamSlug/issues",
                          params: { slug: slug, teamSlug: team.slug },
                          search: { filter: undefined },
                        })
                      )
                    }
                  >
                    <Users className="size-4 text-on-surface-variant" strokeWidth={1.5} />
                    <span>{team.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />
          <CommandGroup heading="Pages">
            <CommandItem
              onSelect={() =>
                runAction(() =>
                  navigate({
                    to: "/$slug/tickets/feedback",
                    params: { slug: slug },
                    search: { suggestionId: undefined },
                  })
                )
              }
            >
              <Sparkles className="size-4 text-on-surface-variant" strokeWidth={1.5} />
              <span>Feedback Hub</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runAction(() =>
                  navigate({
                    to: "/$slug/tickets/views",
                    params: { slug: slug },
                  })
                )
              }
            >
              <Eye className="size-4 text-on-surface-variant" strokeWidth={1.5} />
              <span>Views</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runAction(() =>
                  navigate({
                    to: "/$slug/settings",
                    params: { slug: slug },
                  })
                )
              }
            >
              <Settings className="size-4 text-on-surface-variant" strokeWidth={1.5} />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
