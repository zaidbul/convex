import type { ToolSet } from "ai"
import { tool } from "ai"
import { z } from "zod"
import type { ViewerContext } from "./tickets-data"

const FEEDBACK_CHAT_MODEL =
  process.env.FEEDBACK_CHAT_MODEL || "gpt-4o"

export { FEEDBACK_CHAT_MODEL }

export const feedbackChatSystemPrompt = `You are a feedback ingestion assistant. Your role is to help users import and contextualize feedback data for analysis.

## Your Capabilities
- Process uploaded files (CSV, JSON, TXT, MD) into structured feedback items
- Ask clarifying questions about the feedback source, context, and categorization
- Track readiness for analysis based on the quality and completeness of ingested data
- Provide summaries of uploaded feedback content

## Guidelines
- Be concise and action-oriented
- This is a demo environment — tools are stubbed but the conversation flow works normally
`

export function createFeedbackChatTools(_context: ViewerContext): ToolSet {
  return {
    processUploadedFile: tool({
      description:
        "Process an uploaded file into structured feedback items. Call this when the user uploads a file.",
      inputSchema: z.object({
        attachmentId: z.string().describe("The ID of the uploaded attachment"),
        fileName: z.string().describe("The file name"),
        fileType: z.string().describe("The MIME type of the file"),
        sourceName: z.string().optional().describe("Human-readable name for this feedback source"),
      }),
      execute: async ({ fileName }) => {
        return {
          success: true,
          importId: `fb-import-demo-${Date.now()}`,
          itemCount: 3,
          fileName,
          kind: "csv" as const,
          message: `Processed "${fileName}": 3 feedback item(s) imported (demo mode).`,
        }
      },
    }),

    askStructuredQuestions: tool({
      description:
        'Present structured discovery questions about the feedback context.',
      inputSchema: z.object({
        questions: z
          .array(
            z.object({
              question: z.string().min(1),
              questionRephrase: z.string().min(1),
              type: z.enum(["text", "number", "select", "multi-select"]),
              options: z.array(z.string().min(1)).max(8).optional(),
            })
          )
          .min(1)
          .max(8),
      }),
      outputSchema: z.object({
        answers: z.array(
          z.object({
            question: z.string().min(1),
            answer: z.union([z.string(), z.array(z.string())]),
          })
        ),
      }),
    }),

    updateReadinessScore: tool({
      description:
        "Update the readiness score (0-100) for analysis.",
      inputSchema: z.object({
        score: z.number().min(0).max(100),
        reason: z.string().optional(),
      }),
      outputSchema: z.object({
        score: z.number().int().min(0).max(100),
        reason: z.string().optional(),
      }),
      execute: async ({ score, reason }) => {
        return { score: Math.max(0, Math.min(100, Math.round(score))), reason }
      },
    }),

    getExistingFeedbackContext: tool({
      description:
        "Check what feedback data already exists in the workspace.",
      inputSchema: z.object({}),
      execute: async () => {
        return {
          existingItemCount: 8,
          existingClusterCount: 3,
          existingSuggestionCount: 5,
          topFeatureAreas: ["search", "editor", "dashboard", "tickets", "workspace-management"],
          recentSuggestions: [
            { title: "Overhaul search indexing and ranking", status: "new", confidence: 82 },
            { title: "Improve keyboard shortcut discoverability", status: "reviewing", confidence: 65 },
            { title: "Build a public REST API for integrations", status: "accepted", confidence: 70 },
          ],
        }
      },
    }),
  }
}
