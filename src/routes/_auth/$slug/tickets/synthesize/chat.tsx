import { useState, useCallback } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  feedbackChatsQueryOptions,
  feedbackChatQueryOptions,
} from "@/query/options/tickets"
import { useDeleteFeedbackChatMutation } from "@/query/mutations/tickets"
import { FeedbackChatPanel } from "@/components/feedback/feedback-chat-panel"
import { FeedbackChatHistory } from "@/components/feedback/feedback-chat-history"

export const Route = createFileRoute(
  "/_auth/$slug/tickets/synthesize/chat"
)({
  component: SynthesizeChatPage,
})

function SynthesizeChatPage() {
  const queryClient = useQueryClient()
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const { data: chatList = [] } = useQuery(feedbackChatsQueryOptions())
  const { data: activeChatData } = useQuery(
    feedbackChatQueryOptions(activeChatId ?? "")
  )
  const activeChat = activeChatData as {
    messages?: Array<{
      id: string
      chatId: string
      role: "user" | "assistant" | "system"
      content: string
      toolCallsJson: any[] | null
      toolResultJson: any[] | null
      attachmentsJson: Array<{
        id: string
        fileName: string
        fileType: string
        fileSize: number
      }> | null
      partsJson: any[] | null
      messageIndex: number
      createdAt: string
    }>
    readinessScore?: number
  } | null | undefined

  const deleteChat = useDeleteFeedbackChatMutation()

  const handleNewChat = useCallback(() => {
    setActiveChatId(null)
  }, [])

  const handleChatCreated = useCallback(
    (chatId: string) => {
      setActiveChatId(chatId)
      queryClient.invalidateQueries({ queryKey: ["feedback-chats"] })
    },
    [queryClient]
  )

  const handleMessagesUpdated = useCallback(() => {
    if (activeChatId) {
      queryClient.invalidateQueries({
        queryKey: ["feedback-chat", activeChatId],
      })
    }
    queryClient.invalidateQueries({ queryKey: ["feedback-chats"] })
    queryClient.invalidateQueries({ queryKey: ["feedback-imports"] })
    queryClient.invalidateQueries({ queryKey: ["feedback-items"] })
    queryClient.invalidateQueries({ queryKey: ["feedback-suggestions"] })
  }, [activeChatId, queryClient])

  const handleDeleteChat = useCallback(
    (chatId: string) => {
      deleteChat.mutate({ chatId })
      if (activeChatId === chatId) {
        setActiveChatId(null)
      }
    },
    [activeChatId, deleteChat]
  )

  return (
    <div className="grid h-full gap-4 px-6 py-6 lg:grid-cols-[280px_1fr]">
      <div className="overflow-auto rounded-md border">
        <div className="p-3">
          <h3 className="text-sm font-medium">Sessions</h3>
        </div>
        <div className="px-2 pb-2">
          <FeedbackChatHistory
            chats={chatList}
            activeChatId={activeChatId}
            onSelect={setActiveChatId}
            onDelete={handleDeleteChat}
          />
        </div>
      </div>

      <FeedbackChatPanel
        chatId={activeChatId}
        messages={activeChat?.messages ?? []}
        readinessScore={activeChat?.readinessScore ?? 0}
        onNewChat={handleNewChat}
        onChatCreated={handleChatCreated}
        onMessagesUpdated={handleMessagesUpdated}
      />
    </div>
  )
}
