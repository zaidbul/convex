import { useCallback, useEffect, useRef, useState } from "react"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { IssueEditor } from "@/components/editor/IssueEditor"
import {
  issueDetailQueryOptions,
  teamMembersQueryOptions,
} from "@/query/options/tickets"
import { useUpdateIssueTitleMutation } from "@/query/mutations/tickets"
import { IssueDetailHeader } from "./issue-detail-header"
import { IssuePropertiesPanel } from "./issue-properties-panel"
import { IssueActivityFeed } from "./issue-activity-feed"
import type { Team } from "./types"

export function IssueDetailView({
  issueId,
  team,
}: {
  issueId: string
  team: Team
}) {
  const { data: issue } = useSuspenseQuery(issueDetailQueryOptions(issueId))
  const { data: teamMembers = [] } = useQuery(teamMembersQueryOptions(team.id))
  const [title, setTitle] = useState(issue?.title ?? "")
  const updateTitle = useUpdateIssueTitleMutation()
  const titleDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearPendingTitleSave = useCallback(() => {
    if (titleDebounceRef.current) {
      clearTimeout(titleDebounceRef.current)
      titleDebounceRef.current = null
    }
  }, [])

  useEffect(() => {
    setTitle(issue?.title ?? "")
    return clearPendingTitleSave
  }, [issueId, issue?.title, clearPendingTitleSave])

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setTitle(newTitle)
      clearPendingTitleSave()
      titleDebounceRef.current = setTimeout(() => {
        updateTitle.mutate({ issueId, title: newTitle })
      }, 400)
    },
    [clearPendingTitleSave, issueId, updateTitle],
  )

  if (!issue) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Issue not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-surface-low">
      <IssueDetailHeader team={team} issue={issue} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main content: Editor + Activity */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-8 py-6">
            {/* Mobile properties trigger */}
            <div className="mb-4 lg:hidden">
              <Sheet>
                <SheetTrigger
                  render={
                    <Button variant="outline" size="sm" className="gap-1.5" />
                  }
                >
                  <Settings2 className="size-3.5" />
                  Properties
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Properties</SheetTitle>
                  </SheetHeader>
                  <div className="overflow-y-auto flex-1">
                    <IssuePropertiesPanel issue={issue} teamSlug={team.slug} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <IssueEditor
              issueId={issue.id}
              title={title}
              onTitleChange={handleTitleChange}
              initialMarkdown={issue.description}
              members={teamMembers}
              autoSave={true}
            />

            <IssueActivityFeed issueId={issue.id} />
          </div>
        </div>

        {/* Right: Properties Panel (desktop) */}
        <div className="hidden w-[330px] shrink-0 border-l border-outline-variant/10 overflow-y-auto lg:block">
          <IssuePropertiesPanel issue={issue} teamSlug={team.slug} />
        </div>
      </div>
    </div>
  )
}
