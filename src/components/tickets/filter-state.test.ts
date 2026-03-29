import { describe, expect, test } from "vitest"
import {
  parseIssueQueryFilters,
  serializeIssueQueryFilters,
} from "./filter-state"

describe("filter-state", () => {
  test("parses an empty search state to the all-issues preset when configured", () => {
    expect(
      parseIssueQueryFilters({}, { defaultPresetFilter: "all" })
    ).toEqual({
      presetFilter: "all",
    })
  })

  test("omits the default all-issues preset from serialized search", () => {
    expect(
      serializeIssueQueryFilters(
        { presetFilter: "all" },
        { defaultPresetFilter: "all" }
      )
    ).toEqual({
      filter: undefined,
    })
  })

  test("preserves explicit presets and advanced filters", () => {
    expect(
      serializeIssueQueryFilters(
        { presetFilter: "backlog" },
        { defaultPresetFilter: "all" }
      )
    ).toEqual({
      filter: "backlog",
    })

    expect(
      serializeIssueQueryFilters(
        {
          advancedFilters: {
            logic: "and",
            statuses: ["todo"],
            priorities: ["high"],
            assigneeIds: ["user-1"],
            labelIds: ["label-1"],
            cycleIds: ["cycle-1"],
            dueFrom: "2026-03-01",
            dueTo: "2026-03-31",
          },
        },
        { defaultPresetFilter: "all" }
      )
    ).toEqual({
      logic: "and",
      statuses: "todo",
      priorities: "high",
      assigneeIds: "user-1",
      labelIds: "label-1",
      cycleIds: "cycle-1",
      dueFrom: "2026-03-01",
      dueTo: "2026-03-31",
    })
  })
})
