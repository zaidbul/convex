import { tool, type ToolSet } from "ai"
import { z } from "zod"
import { db } from "@/db/connection"
import type { ViewerContext } from "./tickets-data"
import {
  createFeedbackImportForViewer,
  listFeedbackItemsForViewer,
  listFeedbackClustersForViewer,
  listFeedbackSuggestionsForViewer,
} from "./feedback-data"
import type { CreateFeedbackImportInput, FeedbackImportKind } from "./feedback-domain"
import * as schema from "@/db/schema"
import { eq } from "drizzle-orm"

const FEEDBACK_CHAT_MODEL =
  process.env.FEEDBACK_CHAT_MODEL || "gpt-5.3-chat-latest"

export { FEEDBACK_CHAT_MODEL }

export const feedbackChatSystemPrompt = `You are a feedback ingestion assistant. Your role is to help users import and contextualize feedback data for analysis.

## Your Capabilities
- Process uploaded files (CSV, JSON, TXT, MD) into structured feedback items
- Ask clarifying questions about the feedback source, context, and categorization
- Track readiness for analysis based on the quality and completeness of ingested data
- Provide summaries of uploaded feedback content

## Conversation Flow
1. Greet the user briefly and ask what feedback they'd like to import
2. When files are uploaded, process them using the processUploadedFile tool
3. After processing, summarize what was found and ask contextual questions using askStructuredQuestions
4. Update the readiness score as more context is gathered using updateReadinessScore
5. When readiness is sufficient (>= 50), let the user know they can run analysis

## Readiness Score Rubric
- 0-20: No files uploaded or processed yet
- 20-40: Files uploaded but minimal context provided
- 40-60: Basic context gathered (source type, general category)
- 60-80: Good context — source, timeframe, and feature areas identified
- 80-100: Rich context with full metadata, ready for comprehensive analysis

## Guidelines
- Be concise and action-oriented
- After processing a file, always summarize the key themes you found
- Use askStructuredQuestions to gather metadata efficiently (prefer select/multi-select)
- Call updateReadinessScore after each meaningful interaction
- Do NOT call updateReadinessScore on your first response
- If the user has already uploaded files and provided context, move the score up quickly
- You can call getExistingFeedbackContext to check what feedback already exists in the workspace
`

const feedbackDiscoveryQuestionSchema = z.object({
  question: z.string().min(1).describe("The question to ask the user."),
  questionRephrase: z
    .string()
    .min(1)
    .describe("A clearer rephrased version of the same question."),
  type: z
    .enum(["text", "number", "select", "multi-select"])
    .describe(
      "Prefer select/multi-select when possible. Use text/number for open-ended input."
    ),
  options: z
    .array(z.string().min(1))
    .max(8)
    .optional()
    .describe(
      'Options for select/multi-select. Do NOT include "Other" (the UI adds it). Omit for text/number.'
    ),
})

function inferFileKind(fileName: string, fileType: string): FeedbackImportKind {
  const ext = fileName.split(".").pop()?.toLowerCase()
  if (ext === "csv" || fileType === "text/csv") return "csv"
  if (ext === "json" || fileType === "application/json") return "json"
  if (ext === "md") return "md"
  return "txt"
}

export function createFeedbackChatTools(context: ViewerContext): ToolSet {
  return {
    processUploadedFile: tool({
      description:
        "Process an uploaded file into structured feedback items. Call this when the user uploads a file. The file content is read from the database automatically — you do NOT need to provide the file content.",
      inputSchema: z.object({
        attachmentId: z.string().describe("The ID of the uploaded attachment"),
        fileName: z.string().describe("The file name"),
        fileType: z.string().describe("The MIME type of the file"),
        sourceName: z
          .string()
          .optional()
          .describe("Human-readable name for this feedback source"),
      }),
      execute: async ({ attachmentId, fileName, fileType, sourceName }) => {
        // Read file content directly from the database — no need for the AI to relay it
        const attachment = await db.query.feedbackChatAttachments.findFirst({
          where: eq(schema.feedbackChatAttachments.id, attachmentId),
        })

        if (!attachment) {
          return {
            success: false,
            importId: null,
            itemCount: 0,
            fileName,
            kind: "txt" as const,
            message: `Attachment "${attachmentId}" not found. The file may not have been uploaded correctly.`,
          }
        }

        const rawContent = attachment.rawContent
        const kind = inferFileKind(fileName, fileType)

        const importInput: CreateFeedbackImportInput = {
          kind,
          sourceName: sourceName || fileName,
          rawContent: kind === "json" ? undefined : rawContent,
          rawPayloadJson: kind === "json" ? JSON.parse(rawContent) : undefined,
        }

        const result = await createFeedbackImportForViewer(db, context, importInput)

        // Link the attachment to the import
        await db
          .update(schema.feedbackChatAttachments)
          .set({
            importId: result.id,
            processedAt: new Date().toISOString(),
          })
          .where(eq(schema.feedbackChatAttachments.id, attachmentId))

        return {
          success: true,
          importId: result.id,
          itemCount: result.itemCount,
          fileName,
          kind,
          message: `Processed "${fileName}" (${kind}): ${result.itemCount} feedback item(s) imported.`,
        }
      },
    }),

    askStructuredQuestions: tool({
      description:
        'Present structured discovery questions about the feedback context. Prefer select/multi-select with best-guess options. The UI adds an "Other" choice automatically.',
      inputSchema: z.object({
        questions: z
          .array(feedbackDiscoveryQuestionSchema)
          .min(1)
          .max(8)
          .describe("One or more contextual questions."),
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
        "Update the readiness score (0-100) for analysis. Call as confidence improves through the conversation. Do NOT call on first response.",
      inputSchema: z.object({
        score: z
          .number()
          .min(0)
          .max(100)
          .describe("Current readiness score based on uploaded data and context quality."),
        reason: z
          .string()
          .optional()
          .describe("Brief explanation of the score."),
      }),
      outputSchema: z.object({
        score: z.number().int().min(0).max(100),
        reason: z.string().optional(),
      }),
      execute: async ({ score, reason }) => {
        const normalizedScore = Math.max(0, Math.min(100, Math.round(score)))
        return { score: normalizedScore, reason }
      },
    }),

    getExistingFeedbackContext: tool({
      description:
        "Check what feedback data already exists in the workspace. Use to avoid duplicates and understand existing context.",
      inputSchema: z.object({}),
      execute: async () => {
        const [items, clusters, suggestions] = await Promise.all([
          listFeedbackItemsForViewer(db, context),
          listFeedbackClustersForViewer(db, context),
          listFeedbackSuggestionsForViewer(db, context, {}),
        ])

        return {
          existingItemCount: items.length,
          existingClusterCount: clusters.length,
          existingSuggestionCount: suggestions.length,
          topFeatureAreas: [
            ...new Set(
              items
                .map((i) => i.featureArea)
                .filter((fa): fa is string => fa !== null)
            ),
          ].slice(0, 10),
          recentSuggestions: suggestions.slice(0, 5).map((s) => ({
            title: s.title,
            status: s.status,
            confidence: s.confidence,
          })),
        }
      },
    }),
  }
}
