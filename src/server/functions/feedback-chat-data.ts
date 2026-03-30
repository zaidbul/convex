import type { TicketsDatabase, ViewerContext } from "./tickets-data"

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

type FeedbackChatStatus = "active" | "ready" | "analysis_triggered" | "completed"

export type FeedbackChatRecord = {
  id: string
  title: string | null
  status: FeedbackChatStatus
  readinessScore: number
  linkedImportIds: string[]
  createdAt: string
  updatedAt: string
}

export type FeedbackChatMessageRecord = {
  id: string
  chatId: string
  role: string
  content: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolCallsJson: any[] | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolResultJson: any[] | null
  attachmentsJson:
    | Array<{ id: string; fileName: string; fileType: string; fileSize: number }>
    | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  partsJson: any[] | null
  messageIndex: number
  createdAt: string
}

export type FeedbackChatDetail = FeedbackChatRecord & {
  messages: FeedbackChatMessageRecord[]
}

// ── Mock Data ───────────────────────────────────────────────────────

const MOCK_CHATS: FeedbackChatRecord[] = [
  {
    id: "chat-001",
    title: "Q1 Support Ticket Analysis",
    status: "ready",
    readinessScore: 72,
    linkedImportIds: ["fb-import-001"],
    createdAt: daysAgo(14),
    updatedAt: daysAgo(13),
  },
  {
    id: "chat-002",
    title: "NPS Survey Review",
    status: "active",
    readinessScore: 35,
    linkedImportIds: ["fb-import-002"],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(6),
  },
]

const MOCK_MESSAGES: Record<string, FeedbackChatMessageRecord[]> = {
  "chat-001": [
    {
      id: "msg-001", chatId: "chat-001", role: "assistant",
      content: "Hello! I'm ready to help you import and analyze feedback data. What feedback would you like to import today?",
      toolCallsJson: null, toolResultJson: null, attachmentsJson: null, partsJson: null,
      messageIndex: 0, createdAt: daysAgo(14),
    },
    {
      id: "msg-002", chatId: "chat-001", role: "user",
      content: "I have a CSV export from our support ticket system with customer complaints from Q1.",
      toolCallsJson: null, toolResultJson: null,
      attachmentsJson: [{ id: "att-001", fileName: "support-q1-export.csv", fileType: "text/csv", fileSize: 24680 }],
      partsJson: null,
      messageIndex: 1, createdAt: daysAgo(14),
    },
    {
      id: "msg-003", chatId: "chat-001", role: "assistant",
      content: "I've processed your CSV file and found 5 feedback items. Here's what I see:\n\n- **Search performance** — Multiple complaints about slow search (high severity)\n- **Keyboard shortcuts** — Users struggling to discover shortcuts\n- **Dashboard staleness** — Charts require manual refresh\n- **API access** — Enterprise customers requesting integrations\n- **Permissions** — Admins finding the permission model confusing\n\nTo help me classify these better, I have a few questions about the context.",
      toolCallsJson: null, toolResultJson: null, attachmentsJson: null, partsJson: null,
      messageIndex: 2, createdAt: daysAgo(14),
    },
    {
      id: "msg-004", chatId: "chat-001", role: "user",
      content: "These are from our enterprise tier customers, mostly teams of 20-50 people.",
      toolCallsJson: null, toolResultJson: null, attachmentsJson: null, partsJson: null,
      messageIndex: 3, createdAt: daysAgo(13),
    },
    {
      id: "msg-005", chatId: "chat-001", role: "assistant",
      content: "Great context! Enterprise teams of that size tend to hit scale issues first. The readiness score is now at 72% — you have enough context to run analysis. Would you like to proceed?",
      toolCallsJson: null, toolResultJson: null, attachmentsJson: null, partsJson: null,
      messageIndex: 4, createdAt: daysAgo(13),
    },
  ],
  "chat-002": [
    {
      id: "msg-010", chatId: "chat-002", role: "assistant",
      content: "Hello! I'm ready to help you import and analyze feedback data. What feedback would you like to import today?",
      toolCallsJson: null, toolResultJson: null, attachmentsJson: null, partsJson: null,
      messageIndex: 0, createdAt: daysAgo(7),
    },
    {
      id: "msg-011", chatId: "chat-002", role: "user",
      content: "Here are our NPS survey results from March.",
      toolCallsJson: null, toolResultJson: null,
      attachmentsJson: [{ id: "att-002", fileName: "nps-march-2026.json", fileType: "application/json", fileSize: 8420 }],
      partsJson: null,
      messageIndex: 1, createdAt: daysAgo(7),
    },
    {
      id: "msg-012", chatId: "chat-002", role: "assistant",
      content: "I've processed the NPS survey data and found 3 feedback items. The themes include positive feedback about issue creation speed, search relevance concerns, and a request for a mobile app.\n\nCould you tell me more about the respondent demographics?",
      toolCallsJson: null, toolResultJson: null, attachmentsJson: null, partsJson: null,
      messageIndex: 2, createdAt: daysAgo(6),
    },
  ],
}

// ── Exported Functions ──────────────────────────────────────────────

export async function createFeedbackChatForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _input: { title?: string }
): Promise<{ id: string }> {
  return { id: `chat-${crypto.randomUUID().slice(0, 8)}` }
}

export async function getFeedbackChatForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  chatId: string
): Promise<FeedbackChatDetail | null> {
  const chat = MOCK_CHATS.find((c) => c.id === chatId)
  if (!chat) return null

  return {
    ...chat,
    messages: MOCK_MESSAGES[chatId] ?? [],
  }
}

export async function listFeedbackChatsForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext
): Promise<FeedbackChatRecord[]> {
  return MOCK_CHATS
}

export async function deleteFeedbackChatForViewer(
  _db: TicketsDatabase,
  _context: ViewerContext,
  _chatId: string
): Promise<{ deleted: boolean }> {
  return { deleted: true }
}

export async function saveFeedbackChatMessage(
  _db: TicketsDatabase,
  _chatId: string,
  _message: {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    toolCallsJson?: unknown[] | null
    toolResultJson?: unknown | null
    attachmentsJson?: Array<{
      id: string
      fileName: string
      fileType: string
      fileSize: number
    }> | null
    partsJson?: any[] | null
  }
): Promise<void> {
  // no-op in demo mode
}

export async function updateFeedbackChatReadiness(
  _db: TicketsDatabase,
  _chatId: string,
  _score: number
): Promise<void> {
  // no-op in demo mode
}

export async function updateFeedbackChatStatus(
  _db: TicketsDatabase,
  _chatId: string,
  _status: "active" | "ready" | "analysis_triggered" | "completed"
): Promise<void> {
  // no-op in demo mode
}

export async function linkImportToChat(
  _db: TicketsDatabase,
  _chatId: string,
  _importId: string
): Promise<void> {
  // no-op in demo mode
}

export async function saveFeedbackChatAttachment(
  _db: TicketsDatabase,
  _input: {
    id: string
    chatId: string
    messageId: string
    fileName: string
    fileType: string
    fileSize: number
    rawContent: string
  }
): Promise<void> {
  // no-op in demo mode
}
