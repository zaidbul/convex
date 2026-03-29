// @vitest-environment jsdom

import { act, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { IssueAutoSavePlugin } from "./IssueAutoSavePlugin"
import { NoteAutoSavePlugin } from "./NoteAutoSavePlugin"

let updateListener: (() => void) | null = null
let currentMarkdown = ""

const issueMutateAsyncMock = vi.fn(async () => undefined)
const noteMutateAsyncMock = vi.fn(async () => undefined)

vi.mock("@lexical/react/LexicalComposerContext", () => ({
  useLexicalComposerContext: () => [
    {
      registerUpdateListener: (listener: () => void) => {
        updateListener = listener
        return () => {
          if (updateListener === listener) {
            updateListener = null
          }
        }
      },
      getEditorState: () => ({
        read: (callback: () => void) => callback(),
      }),
    },
  ],
}))

vi.mock("@lexical/markdown", () => ({
  $convertToMarkdownString: () => currentMarkdown,
}))

vi.mock("@tanstack/react-pacer", () => ({
  useDebouncer: <T extends (...args: any[]) => unknown>(callback: T) => ({
    maybeExecute: (...args: Parameters<T>) => callback(...args),
    flush: vi.fn(),
  }),
}))

vi.mock("@/query/mutations/tickets", () => ({
  useUpdateIssueDescriptionMutation: () => ({
    mutateAsync: issueMutateAsyncMock,
  }),
}))

vi.mock("@/query/mutations/notes", () => ({
  useUpdateNoteMutation: () => ({
    mutateAsync: noteMutateAsyncMock,
  }),
}))

describe("auto-save plugins", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    updateListener = null
    currentMarkdown = "Updated content"
    issueMutateAsyncMock.mockClear()
    noteMutateAsyncMock.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test("IssueAutoSavePlugin clears the pending idle timer on unmount", async () => {
    const onStatusChange = vi.fn()
    const view = render(
      <IssueAutoSavePlugin
        issueId="issue-1"
        transformers={[]}
        onStatusChange={onStatusChange}
      />,
    )

    act(() => {
      vi.advanceTimersByTime(200)
    })

    await act(async () => {
      updateListener?.()
      await Promise.resolve()
    })

    expect(issueMutateAsyncMock).toHaveBeenCalledWith({
      issueId: "issue-1",
      description: "Updated content",
    })

    view.unmount()

    act(() => {
      vi.advanceTimersByTime(1200)
    })

    expect(onStatusChange).not.toHaveBeenCalledWith("idle")
  })

  test("NoteAutoSavePlugin clears the pending idle timer on unmount", async () => {
    const onStatusChange = vi.fn()
    const view = render(
      <NoteAutoSavePlugin
        noteId="note-1"
        title="Draft title"
        transformers={[]}
        onStatusChange={onStatusChange}
      />,
    )

    act(() => {
      vi.advanceTimersByTime(200)
    })

    await act(async () => {
      updateListener?.()
      await Promise.resolve()
    })

    expect(noteMutateAsyncMock).toHaveBeenCalledWith({
      noteId: "note-1",
      title: "Draft title",
      content: "Updated content",
    })

    view.unmount()

    act(() => {
      vi.advanceTimersByTime(1200)
    })

    expect(onStatusChange).not.toHaveBeenCalledWith("idle")
  })
})
