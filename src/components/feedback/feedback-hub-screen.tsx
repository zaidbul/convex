import { useState, useCallback } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Sparkles } from "lucide-react"
import type { FeedbackSuggestion } from "@/components/tickets/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  teamsQueryOptions,
  feedbackSuggestionQueryOptions,
  feedbackChatsQueryOptions,
  feedbackChatQueryOptions,
} from "@/query/options/tickets"
import {
  useRunFeedbackAnalysisMutation,
  useDeleteFeedbackChatMutation,
} from "@/query/mutations/tickets"
import type {
  FeedbackCluster,
  FeedbackImport,
  FeedbackItem,
  FeedbackSuggestionDetail,
} from "@/components/tickets/types"
import { FeedbackImportForm } from "./feedback-import-form"
import { FeedbackSuggestionReviewDialog } from "./feedback-suggestion-review-dialog"
import { FeedbackChatPanel } from "./feedback-chat-panel"
import { FeedbackChatHistory } from "./feedback-chat-history"
import { FeedbackAnalysisDashboard } from "./feedback-analysis-dashboard"

const suggestionStatusLabel: Record<FeedbackSuggestion["status"], string> = {
  new: "New",
  reviewing: "Reviewing",
  accepted: "Accepted",
  issue_created: "Issue Created",
  dismissed: "Dismissed",
}

export function FeedbackHubScreen({
  imports,
  items,
  clusters,
  suggestions,
  selectedSuggestion,
}: {
  imports: FeedbackImport[]
  items: FeedbackItem[]
  clusters: FeedbackCluster[]
  suggestions: FeedbackSuggestion[]
  selectedSuggestion: FeedbackSuggestionDetail | null
}) {
  const queryClient = useQueryClient()
  const { data: teams = [] } = useQuery(teamsQueryOptions())
  const runAnalysis = useRunFeedbackAnalysisMutation()
  const [activeTab, setActiveTab] = useState("chat")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(
    selectedSuggestion?.id ?? null
  )
  const { data: fetchedSuggestion } = useQuery(
    feedbackSuggestionQueryOptions(selectedSuggestionId ?? "")
  )

  // Chat state
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const { data: chatList = [] } = useQuery(feedbackChatsQueryOptions())
  const { data: activeChatData } = useQuery(feedbackChatQueryOptions(activeChatId ?? ""))
  const activeChat = activeChatData as {
    messages?: Array<{ id: string; chatId: string; role: "user" | "assistant" | "system"; content: string; toolCallsJson: any[] | null; toolResultJson: any[] | null; attachmentsJson: Array<{ id: string; fileName: string; fileType: string; fileSize: number }> | null; partsJson: any[] | null; messageIndex: number; createdAt: string }>
    readinessScore?: number
  } | null | undefined
  const deleteChat = useDeleteFeedbackChatMutation()

  const handleNewChat = useCallback(() => {
    setActiveChatId(null)
  }, [])

  const handleChatCreated = useCallback((chatId: string) => {
    setActiveChatId(chatId)
    queryClient.invalidateQueries({ queryKey: ["feedback-chats"] })
  }, [queryClient])

  const handleMessagesUpdated = useCallback(() => {
    if (activeChatId) {
      queryClient.invalidateQueries({ queryKey: ["feedback-chat", activeChatId] })
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

  const currentSuggestion =
    fetchedSuggestion ??
    (selectedSuggestion && selectedSuggestionId === selectedSuggestion.id
      ? selectedSuggestion
      : null)

  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" strokeWidth={1.75} />
              <h1 className="text-2xl font-semibold text-foreground">Feedback Hub</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Import unstructured feedback, cluster repeated pain points, and turn them into reviewable product directions.
            </p>
          </div>
          <Button
            onClick={() => runAnalysis.mutate({ force: true })}
            disabled={runAnalysis.isPending}
          >
            {runAnalysis.isPending ? "Running analysis..." : "Re-run analysis"}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="clusters">Clusters</TabsTrigger>
            <TabsTrigger value="signals">Signals</TabsTrigger>
            <TabsTrigger value="imports">Imports</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
              <Card className="border-outline-variant/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                </CardHeader>
                <CardContent className="px-2 pb-2">
                  <FeedbackChatHistory
                    chats={chatList}
                    activeChatId={activeChatId}
                    onSelect={setActiveChatId}
                    onDelete={handleDeleteChat}
                  />
                </CardContent>
              </Card>

              <FeedbackChatPanel
                chatId={activeChatId}
                messages={activeChat?.messages ?? []}
                readinessScore={activeChat?.readinessScore ?? 0}
                onNewChat={handleNewChat}
                onChatCreated={handleChatCreated}
                onMessagesUpdated={handleMessagesUpdated}
              />
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <FeedbackAnalysisDashboard
              items={items}
              clusters={clusters}
              suggestions={suggestions}
              imports={imports}
            />
          </TabsContent>

          <TabsContent value="suggestions">
            <Card className="border-outline-variant/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Suggested Directions</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-1">
                <FeedbackSuggestionsTable
                  suggestions={suggestions}
                  onReview={(suggestionId) => {
                    setSelectedSuggestionId(suggestionId)
                    setDialogOpen(true)
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clusters">
            <Card className="border-outline-variant/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Clusters</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cluster</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Feature</TableHead>
                      <TableHead>Signals</TableHead>
                      <TableHead>Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clusters.map((cluster) => (
                      <TableRow key={cluster.id}>
                        <TableCell>{cluster.title}</TableCell>
                        <TableCell>{cluster.suggestedTeam?.name ?? "Unassigned"}</TableCell>
                        <TableCell>{cluster.featureArea ?? "General"}</TableCell>
                        <TableCell>{cluster.signalCount}</TableCell>
                        <TableCell>{cluster.confidence}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signals">
            <Card className="border-outline-variant/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Signals</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead>Feature</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Team</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.importSourceName}</TableCell>
                        <TableCell className="max-w-[360px] whitespace-normal">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {item.title || item.summary || "Feedback item"}
                            </p>
                            {item.summary && (
                              <p className="line-clamp-2 text-xs text-muted-foreground">
                                {item.summary}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.featureArea ?? "General"}</TableCell>
                        <TableCell>{item.severity ?? "n/a"}</TableCell>
                        <TableCell>{item.suggestedTeam?.name ?? "Unassigned"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="imports">
            <FeedbackImportForm />

            <Card className="mt-4 border-outline-variant/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Imports</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Kind</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {imports.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">{entry.sourceName}</p>
                            {entry.sourceDescription && (
                              <p className="text-xs text-muted-foreground">
                                {entry.sourceDescription}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{entry.kind}</TableCell>
                        <TableCell>{entry.itemCount}</TableCell>
                        <TableCell>{new Date(entry.updatedAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <FeedbackSuggestionReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        suggestion={currentSuggestion}
        teams={teams}
      />
    </>
  )
}

function FeedbackSuggestionsTable({
  suggestions,
  onReview,
}: {
  suggestions: FeedbackSuggestion[]
  onReview: (suggestionId: string) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Signals</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suggestions.map((suggestion) => (
          <TableRow key={suggestion.id}>
            <TableCell className="max-w-[360px] whitespace-normal">
              <div className="space-y-1">
                <p className="font-medium text-foreground">{suggestion.title}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{suggestion.summary}</p>
              </div>
            </TableCell>
            <TableCell>
              {suggestion.selectedTeam?.name ?? suggestion.suggestedTeam?.name ?? "Unassigned"}
            </TableCell>
            <TableCell>{suggestion.evidenceCount}</TableCell>
            <TableCell>{suggestion.confidence}%</TableCell>
            <TableCell>
              <Badge variant="outline" className="rounded-full text-[10px]">
                {suggestionStatusLabel[suggestion.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" onClick={() => onReview(suggestion.id)}>
                Review
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
