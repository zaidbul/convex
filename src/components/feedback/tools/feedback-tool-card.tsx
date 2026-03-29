import { useState, type ReactNode } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type ToolState = "running" | "completed" | "error"

function getStatusIcon(state: ToolState) {
  switch (state) {
    case "running":
      return <Loader2 className="size-3.5 animate-spin text-blue-500" />
    case "completed":
      return <CheckCircle2 className="size-3.5 text-emerald-500" />
    case "error":
      return <XCircle className="size-3.5 text-red-500" />
  }
}

interface FeedbackToolCardProps {
  title: string
  icon?: ReactNode
  state: ToolState
  children?: ReactNode
  defaultOpen?: boolean
  compact?: boolean
}

export function FeedbackToolCard({
  title,
  icon,
  state,
  children,
  defaultOpen = false,
  compact = false,
}: FeedbackToolCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const hasContent = !!children

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-xs">
        {getStatusIcon(state)}
        {icon}
        <span className="text-muted-foreground">{title}</span>
        {children && <div className="ml-auto">{children}</div>}
      </div>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors hover:bg-muted/50",
          state === "error" && "border-red-500/30 bg-red-500/5",
          state === "running" && "border-blue-500/20 bg-blue-500/5",
          state === "completed" && "border-border bg-muted/20"
        )}
      >
        {getStatusIcon(state)}
        {icon}
        <span className="flex-1 text-left font-medium">{title}</span>
        {hasContent && (
          <ChevronDown
            className={cn(
              "size-3.5 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        )}
      </CollapsibleTrigger>
      {hasContent && (
        <CollapsibleContent>
          <div className="rounded-b-lg border border-t-0 px-3 py-2 text-xs">
            {children}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  )
}
