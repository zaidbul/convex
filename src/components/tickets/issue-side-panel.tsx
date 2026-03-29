import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { issueDetailQueryOptions } from "@/query/options/tickets"
import { useUpdateIssueTitleMutation } from "@/query/mutations/tickets"
import { useIssuePanel } from "./issue-panel-provider"
import { IssuePropertiesPanel } from "./issue-properties-panel"

function PanelSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-outline-variant/10 px-4 py-3">
        <div className="h-4 w-20 animate-pulse rounded bg-surface-high" />
        <div className="ml-auto h-4 w-4 animate-pulse rounded bg-surface-high" />
      </div>
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-surface-high" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface-high" />
        <div className="mt-6 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-surface-high" />
          ))}
        </div>
      </div>
    </div>
  )
}

function EmptyPanel() {
  return (
    <div className="flex h-full items-center justify-center px-6 text-center">
      <p className="text-sm text-on-surface-variant">
        Select an issue to view details
      </p>
    </div>
  )
}

function PanelContent({ issueId, teamSlug }: { issueId: string; teamSlug: string }) {
  const { data: issue } = useSuspenseQuery(issueDetailQueryOptions(issueId))
  const { setPanelOpen } = useIssuePanel()
  const navigate = useNavigate()
  const params = useParams({ strict: false }) as { slug?: string; teamSlug?: string }
  const updateTitle = useUpdateIssueTitleMutation()
  const [title, setTitle] = useState(issue?.title ?? "")
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

  function handleOpenFullPage() {
    if (!params.slug || !params.teamSlug) return
    navigate({
      to: "/$slug/tickets/$teamSlug/issue/$issueId",
      params: { slug: params.slug, teamSlug: params.teamSlug, issueId },
    })
  }

  if (!issue) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Issue not found</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-outline-variant/10 px-4 py-2.5 shrink-0">
        <span className="font-mono text-xs text-on-surface-variant">
          {issue.identifier}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={handleOpenFullPage}
            title="Open full page"
          >
            <Maximize2 className="size-3.5 text-on-surface-variant" strokeWidth={1.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={() => setPanelOpen(false)}
            title="Close panel"
          >
            <X className="size-3.5 text-on-surface-variant" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1">
        {/* Editable title */}
        <div className="px-4 pt-4 pb-2">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-on-surface outline-none placeholder:text-on-surface-variant/50"
            placeholder="Issue title"
          />
        </div>

        {/* Properties */}
        <IssuePropertiesPanel issue={issue} teamSlug={teamSlug} />
      </ScrollArea>
    </div>
  )
}

export function IssueSidePanel({ teamSlug }: { teamSlug: string }) {
  const { selectedIssueId } = useIssuePanel()

  if (!selectedIssueId) {
    return <EmptyPanel />
  }

  return (
    <Suspense fallback={<PanelSkeleton />}>
      <PanelContent issueId={selectedIssueId} teamSlug={teamSlug} />
    </Suspense>
  )
}
