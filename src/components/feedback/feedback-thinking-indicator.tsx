import { Bot } from "lucide-react"

export function FeedbackThinkingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-muted-foreground/20 bg-muted">
        <Bot className="size-3.5 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span
          className="bg-gradient-to-r from-muted-foreground/60 via-foreground to-muted-foreground/60 bg-[length:200%_100%] bg-clip-text text-transparent"
          style={{
            animation: "thinking-shimmer 2s ease-in-out infinite",
          }}
        >
          Thinking...
        </span>
        <style>{`
          @keyframes thinking-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    </div>
  )
}
