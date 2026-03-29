import { z } from "zod"
import {
  issueStatuses,
  issuePriorities,
  cycleStatuses,
  feedbackImportKinds,
  feedbackSuggestionStatuses,
  workspaceMembershipRoles,
} from "@/db/schema"

// ── Primitives ──────────────────────────────────────────────────────

const id = z.string().min(1)
const optionalLimit = z.number().int().min(1).max(100).optional()

// ── Notification schemas ────────────────────────────────────────────

export const listNotificationsSchema = z.object({
  scope: z.enum(["all", "unread"]).optional(),
  type: z
    .enum(["all", "assignment", "status", "comment", "mention", "cycle"])
    .optional(),
  limit: optionalLimit,
  offset: z.number().int().min(0).optional(),
})

export const listRecentNotificationsSchema = z.object({
  limit: optionalLimit,
})

export const markNotificationAsReadSchema = z.object({
  notificationId: id,
})

// ── Ticket schemas ──────────────────────────────────────────────────

export const teamSlugSchema = z.object({
  teamSlug: z.string().min(1),
})

export const issueIdSchema = z.object({
  issueId: id,
})

export const getIssuesSchema = z.object({
  teamSlug: z.string().min(1),
  filter: z
    .union([
      z.string(),
      z.object({
        presetFilter: z
          .enum([
            "all",
            "active",
            "backlog",
            "backlog-not-estimated",
            "backlog-graded",
            "recently-added",
            "my-issues",
          ])
          .optional(),
        advancedFilters: z
          .object({
            logic: z.enum(["and", "or"]),
            statuses: z.array(z.enum(issueStatuses)),
            priorities: z.array(z.enum(issuePriorities)),
            assigneeIds: z.array(z.string()),
            labelIds: z.array(z.string()),
            cycleIds: z.array(z.string()),
            dueFrom: z.string().optional(),
            dueTo: z.string().optional(),
          })
          .optional(),
      }),
    ])
    .optional(),
})

export const createIssueSchema = z.object({
  teamId: id,
  title: z.string().min(1).max(500),
  description: z.string().max(50_000).optional(),
  status: z.enum(issueStatuses).optional(),
  priority: z.enum(issuePriorities).optional(),
  dueDate: z.string().nullable().optional(),
})

export const createCycleSchema = z.object({
  teamId: id,
  name: z.string().min(1).max(200),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
})

export const updateIssueDescriptionSchema = z.object({
  issueId: id,
  description: z.string().max(50_000),
})

export const updateIssueStatusSchema = z.object({
  issueId: id,
  status: z.enum(issueStatuses),
})

export const updateIssuePrioritySchema = z.object({
  issueId: id,
  priority: z.enum(issuePriorities),
})

export const updateIssueAssigneeSchema = z.object({
  issueId: id,
  assigneeUserId: z.string().nullable(),
})

export const updateIssueCycleSchema = z.object({
  issueId: id,
  cycleId: z.string().nullable(),
})

export const updateIssueDueDateSchema = z.object({
  issueId: id,
  dueDate: z.string().nullable(),
})

export const updateCycleStatusSchema = z.object({
  cycleId: id,
  status: z.enum(cycleStatuses),
})

export const updateIssueLabelsSchema = z.object({
  issueId: id,
  labelIds: z.array(z.string().min(1)),
})

export const updateIssueTitleSchema = z.object({
  issueId: id,
  title: z.string().min(1).max(500),
})

export const teamIdSchema = z.object({
  teamId: id,
})

export const viewIdSchema = z.object({
  viewId: id,
})

export const createSavedViewSchema = z.object({
  teamId: id,
  name: z.string().min(1).max(200),
  presetFilter: z.string().optional(),
  advancedFilters: z
    .object({
      logic: z.enum(["and", "or"]),
      statuses: z.array(z.enum(issueStatuses)),
      priorities: z.array(z.enum(issuePriorities)),
      assigneeIds: z.array(z.string()),
      labelIds: z.array(z.string()),
      cycleIds: z.array(z.string()),
      dueFrom: z.string().optional(),
      dueTo: z.string().optional(),
    })
    .optional(),
})

export const updateSavedViewSchema = z.object({
  viewId: id,
  name: z.string().min(1).max(200).optional(),
  presetFilter: z.string().nullable().optional(),
  advancedFilters: z
    .object({
      logic: z.enum(["and", "or"]),
      statuses: z.array(z.enum(issueStatuses)),
      priorities: z.array(z.enum(issuePriorities)),
      assigneeIds: z.array(z.string()),
      labelIds: z.array(z.string()),
      cycleIds: z.array(z.string()),
      dueFrom: z.string().optional(),
      dueTo: z.string().optional(),
    })
    .nullable()
    .optional(),
})

export const issueCommentSchema = z.object({
  issueId: id,
  body: z.string().min(1).max(10_000),
})

export const myIssuesSchema = z.object({
  limit: optionalLimit,
})

// ── Settings schemas ────────────────────────────────────────────────

export const updateWorkspaceNameSchema = z.object({
  name: z.string().min(1).max(200),
})

export const createTeamSettingsSchema = z.object({
  name: z.string().min(1).max(200),
  identifier: z.string().min(1).max(10),
  color: z.string().min(1),
})

export const updateTeamSettingsSchema = z.object({
  teamId: id,
  name: z.string().min(1).max(200),
  identifier: z.string().min(1).max(10),
  color: z.string().min(1),
})

export const deleteTeamSchema = z.object({
  teamId: id,
})

export const updateMemberRoleSchema = z.object({
  userId: id,
  role: z.enum(workspaceMembershipRoles),
})

export const removeMemberSchema = z.object({
  userId: id,
})

// ── Feedback schemas ────────────────────────────────────────────────

export const createFeedbackImportSchema = z.object({
  kind: z.enum(feedbackImportKinds),
  sourceName: z.string().min(1).max(200),
  sourceDescription: z.string().max(1000).optional(),
  rawContent: z.string().optional(),
  rawPayloadJson: z.unknown().optional(),
})

export const listFeedbackSuggestionsSchema = z
  .object({
    limit: optionalLimit,
  })
  .optional()

export const feedbackSuggestionIdSchema = z.object({
  suggestionId: id,
})

export const updateFeedbackSuggestionSchema = z.object({
  suggestionId: id,
  status: z.enum(feedbackSuggestionStatuses).optional(),
  selectedTeamId: z.string().nullable().optional(),
})

export const createIssueFromSuggestionSchema = z.object({
  suggestionId: id,
  teamId: z.string().optional(),
  title: z.string().max(500).optional(),
  description: z.string().max(50_000).optional(),
})

export const runFeedbackAnalysisSchema = z
  .object({
    force: z.boolean().optional(),
  })
  .optional()

// ── Feedback chat schemas ──────────────────────────────────────────

export const createFeedbackChatSchema = z.object({
  title: z.string().max(200).optional(),
})

export const feedbackChatIdSchema = z.object({
  chatId: id,
})

export const uploadFeedbackChatAttachmentSchema = z.object({
  chatId: id,
  fileName: z.string().min(1).max(500),
  fileType: z.string().min(1).max(100),
  rawContent: z.string(),
})

export const autoCreateTicketsSchema = z
  .object({
    confidenceThreshold: z.number().int().min(0).max(100).optional(),
    cycleId: z.string().optional(),
  })
  .optional()
