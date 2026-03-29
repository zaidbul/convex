import { useEffect, useState } from "react"
import { useNavigate, useParams } from "@tanstack/react-router"
import { toast } from "sonner"
import type { FeedbackSuggestionDetail, Team } from "@/components/tickets/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  useCreateIssueFromSuggestionMutation,
  useUpdateFeedbackSuggestionMutation,
} from "@/query/mutations/tickets"

export function FeedbackSuggestionReviewDialog({
  open,
  onOpenChange,
  suggestion,
  teams,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  suggestion: FeedbackSuggestionDetail | null
  teams: Team[]
}) {
  const navigate = useNavigate()
  const { slug } = useParams({ strict: false }) as { slug?: string }
  const updateSuggestion = useUpdateFeedbackSuggestionMutation()
  const createIssue = useCreateIssueFromSuggestionMutation()
  const [selectedTeamId, setSelectedTeamId] = useState("")
  const [issueTitle, setIssueTitle] = useState("")
  const [issueDescription, setIssueDescription] = useState("")

  useEffect(() => {
    if (!suggestion) return
    setSelectedTeamId(
      suggestion.selectedTeam?.id ?? suggestion.suggestedTeam?.id ?? teams[0]?.id ?? ""
    )
    setIssueTitle(suggestion.title)
    setIssueDescription(
      [
        suggestion.summary,
        "",
        "Proposed solution",
        suggestion.proposedSolution,
      ].join("\n")
    )
  }, [suggestion, teams])

  if (!suggestion) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{suggestion.title}</DialogTitle>
          <DialogDescription>
            Review the synthesized direction, confirm the owning team, and create an issue when ready.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Suggested team
              </p>
              <Select
                value={selectedTeamId}
                onValueChange={(value) => setSelectedTeamId(value ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stat label="Signals" value={String(suggestion.evidenceCount)} />
              <Stat label="Confidence" value={`${suggestion.confidence}%`} />
              <Stat label="Impact" value={String(suggestion.impactScore)} />
            </div>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Problem summary</h3>
            <p className="text-sm text-muted-foreground">{suggestion.summary}</p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Proposed solution</h3>
            <p className="text-sm text-muted-foreground">{suggestion.proposedSolution}</p>
          </section>

          {suggestion.aiRationale && (
            <section className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">AI rationale</h3>
              <p className="text-sm text-muted-foreground">{suggestion.aiRationale}</p>
            </section>
          )}

          <section className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Create issue</h3>
            <div className="grid gap-3">
              <div className="space-y-2">
                <Label htmlFor="feedback-issue-title">Issue title</Label>
                <Input
                  id="feedback-issue-title"
                  value={issueTitle}
                  onChange={(event) => setIssueTitle(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-issue-description">Issue description</Label>
                <Textarea
                  id="feedback-issue-description"
                  className="min-h-40"
                  value={issueDescription}
                  onChange={(event) => setIssueDescription(event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Evidence</h3>
            <div className="space-y-2">
              {suggestion.evidence.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-outline-variant/10 bg-surface px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      {item.title || item.summary || "Feedback signal"}
                    </p>
                    <span className="text-xs text-muted-foreground">{item.importSourceName}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                    {item.originalText}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <DialogFooter className="justify-between gap-2 sm:justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await updateSuggestion.mutateAsync({
                    suggestionId: suggestion.id,
                    selectedTeamId,
                    status: "reviewing",
                  })
                  toast.success("Suggestion marked for review")
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Failed to update suggestion")
                }
              }}
            >
              Mark reviewing
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await updateSuggestion.mutateAsync({
                    suggestionId: suggestion.id,
                    selectedTeamId,
                    status: "dismissed",
                  })
                  toast.success("Suggestion dismissed")
                  onOpenChange(false)
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Failed to dismiss suggestion")
                }
              }}
            >
              Dismiss
            </Button>
          </div>

          <Button
            disabled={!selectedTeamId || !issueTitle.trim() || createIssue.isPending}
            onClick={async () => {
              try {
                const created = await createIssue.mutateAsync({
                  suggestionId: suggestion.id,
                  teamId: selectedTeamId,
                  title: issueTitle,
                  description: issueDescription,
                })
                onOpenChange(false)
                if (slug) {
                  navigate({
                    to: "/$slug/tickets/$teamSlug/issue/$issueId",
                    params: {
                      slug,
                      teamSlug:
                        teams.find((team) => team.id === selectedTeamId)?.slug ??
                        suggestion.selectedTeam?.slug ??
                        suggestion.suggestedTeam?.slug ??
                        "",
                      issueId: created.id,
                    },
                  })
                }
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to create issue")
              }
            }}
          >
            Create issue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-outline-variant/10 bg-surface px-3 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-medium text-foreground">{value}</p>
    </div>
  )
}
