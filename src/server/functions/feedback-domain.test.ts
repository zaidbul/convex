import { describe, expect, test } from "vitest"
import {
  buildFeedbackIssueDescription,
  normalizeFeedbackImport,
} from "./feedback-domain"

describe("feedback-domain helpers", () => {
  test("splits pasted feedback into normalized chunks", () => {
    const chunks = normalizeFeedbackImport({
      kind: "paste",
      sourceName: "Manual dump",
      rawContent: `
# Search
Search is hard to find across larger workspaces, and the current relevance feels inconsistent when users are trying to triage issues quickly.

Search should support saved queries so teams can keep a stable set of backlog and triage workflows without rebuilding filters every time.

# Dashboard
Dashboard should highlight repeated complaints and synthesize the highest-volume pain points into suggested product directions for the team.
      `,
    })

    expect(chunks).toHaveLength(3)
    expect(chunks[0]).toMatchObject({
      title: "Search",
    })
    expect(chunks[0]?.normalizedText).toContain("Search is hard to find across larger workspaces")
    expect(chunks[2]?.title).toBe("Dashboard")
  })

  test("parses csv and json imports into itemized chunks", () => {
    const csvChunks = normalizeFeedbackImport({
      kind: "csv",
      sourceName: "tickets.csv",
      rawContent: "title,body\nSearch,Search is broken\nDashboard,Needs better filters",
    })

    const jsonChunks = normalizeFeedbackImport({
      kind: "json",
      sourceName: "feedback.json",
      rawPayloadJson: [
        { title: "Command palette", body: "Needs better ranking" },
        { title: "Inbox", body: "Unread state is confusing" },
      ],
    })

    expect(csvChunks).toHaveLength(2)
    expect(csvChunks[0]?.title).toBe("Search")
    expect(jsonChunks).toHaveLength(2)
    expect(jsonChunks[1]?.normalizedText).toContain("Unread state is confusing")
  })

  test("builds markdown issue descriptions with evidence bullets", () => {
    const description = buildFeedbackIssueDescription({
      suggestionTitle: "Improve search relevance",
      summary: "People struggle to find the right ticket quickly.",
      proposedSolution: "Add ranking and saved query support.",
      aiRationale: "Multiple imports describe the same discovery problem.",
      evidence: [
        {
          title: "Search feedback",
          summary: "Search results feel random.",
          originalText: "Search results feel random and incomplete.",
        },
      ],
    })

    expect(description).toContain("# Improve search relevance")
    expect(description).toContain("## Supporting feedback")
    expect(description).toContain("Signal 1: Search feedback")
  })
})
