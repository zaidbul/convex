import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  issueActivityQueryOptions,
  issueCommentsQueryOptions,
} from "@/query/options/tickets"
import { useCreateIssueCommentMutation } from "@/query/mutations/tickets"
import { statusConfig, priorityConfig } from "./constants"
import type { ActivityEntry, IssueCommentDetail, IssueStatus, IssuePriority } from "./types"

function relativeTime(dateStr: string) {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: false })
}

function ActivityDescription({ entry }: { entry: ActivityEntry }) {
  const actorName = entry.actor?.name ?? "Someone"

  switch (entry.type) {
    case "created":
      return <><span className="font-medium">{actorName}</span> created the issue</>
    case "status_change": {
      const from = statusConfig[entry.data.from as IssueStatus]?.label ?? entry.data.from
      const to = statusConfig[entry.data.to as IssueStatus]?.label ?? entry.data.to
      return <><span className="font-medium">{actorName}</span> changed status from {from} to {to}</>
    }
    case "priority_change": {
      const from = priorityConfig[entry.data.from as IssuePriority]?.label ?? entry.data.from
      const to = priorityConfig[entry.data.to as IssuePriority]?.label ?? entry.data.to
      return <><span className="font-medium">{actorName}</span> changed priority from {from} to {to}</>
    }
    case "assignee_change": {
      if (entry.data.assigneeUserId) {
        return <><span className="font-medium">{actorName}</span> assigned the issue</>
      }
      return <><span className="font-medium">{actorName}</span> removed the assignee</>
    }
    case "label_change":
      return <><span className="font-medium">{actorName}</span> updated labels</>
    case "description_change":
      return <><span className="font-medium">{actorName}</span> updated the description</>
    case "comment":
      return null
    default:
      return <><span className="font-medium">{actorName}</span> updated the issue</>
  }
}

function ActivityItem({ entry }: { entry: ActivityEntry }) {
  if (entry.type === "comment") return null

  return (
    <div className="flex items-start gap-3 py-1.5">
      <div className="w-5 flex justify-center shrink-0 pt-0.5">
        {entry.actor ? (
          <Avatar className="size-4">
            <AvatarImage src={entry.actor.avatarUrl} />
            <AvatarFallback className="text-[6px]">
              {entry.actor.initials}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="size-4 rounded-full bg-muted" />
        )}
      </div>
      <div className="flex-1 min-w-0 text-xs text-muted-foreground leading-relaxed">
        <ActivityDescription entry={entry} />
        <span className="ml-1.5">· {relativeTime(entry.createdAt)}</span>
      </div>
    </div>
  )
}

function CommentItem({ comment }: { comment: IssueCommentDetail }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Avatar className="size-5 shrink-0 mt-0.5">
        <AvatarImage src={comment.author.avatarUrl} />
        <AvatarFallback className="text-[7px]">
          {comment.author.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{comment.author.name}</span>
          <span className="text-xs text-muted-foreground">
            {relativeTime(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-foreground mt-0.5 whitespace-pre-wrap">
          {comment.body}
        </p>
      </div>
    </div>
  )
}

function CommentInput({ issueId }: { issueId: string }) {
  const [body, setBody] = useState("")
  const createComment = useCreateIssueCommentMutation()

  const handleSubmit = () => {
    const trimmed = body.trim()
    if (!trimmed) return
    createComment.mutate(
      { issueId, body: trimmed },
      { onSuccess: () => setBody("") },
    )
  }

  return (
    <div className="rounded-lg border border-outline-variant/20 bg-surface">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            handleSubmit()
          }
        }}
        placeholder="Leave a comment..."
        rows={2}
        className="w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
      />
      <div className="flex items-center justify-end px-3 pb-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          onClick={handleSubmit}
          disabled={!body.trim() || createComment.isPending}
        >
          <Send className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

type TimelineItem =
  | { kind: "activity"; entry: ActivityEntry }
  | { kind: "comment"; comment: IssueCommentDetail }

export function IssueActivityFeed({ issueId }: { issueId: string }) {
  const { data: activity = [] } = useQuery(issueActivityQueryOptions(issueId))
  const { data: comments = [] } = useQuery(issueCommentsQueryOptions(issueId))

  const timeline = useMemo((): TimelineItem[] => {
    const items: TimelineItem[] = [
      ...(activity as ActivityEntry[])
        .filter((a: ActivityEntry) => a.type !== "comment")
        .map((entry: ActivityEntry): TimelineItem => ({ kind: "activity", entry })),
      ...(comments as IssueCommentDetail[]).map(
        (comment: IssueCommentDetail): TimelineItem => ({ kind: "comment", comment }),
      ),
    ]
    items.sort((a: TimelineItem, b: TimelineItem) => {
      const aTime = a.kind === "activity" ? a.entry.createdAt : a.comment.createdAt
      const bTime = b.kind === "activity" ? b.entry.createdAt : b.comment.createdAt
      return aTime.localeCompare(bTime)
    })
    return items
  }, [activity, comments])

  return (
    <div>
      {timeline.length > 0 && (
        <>
          <Separator className="my-4" />
          <div className="relative">
            <div className="absolute left-[9px] top-3 bottom-3 w-px bg-outline-variant/20" />
            <div className="space-y-0.5">
              {timeline.map((item) =>
                item.kind === "activity" ? (
                  <ActivityItem key={item.entry.id} entry={item.entry} />
                ) : (
                  <CommentItem key={item.comment.id} comment={item.comment} />
                ),
              )}
            </div>
          </div>
        </>
      )}

      <div className="mt-4">
        <CommentInput issueId={issueId} />
      </div>
    </div>
  )
}
