import { createContext, useCallback, useContext, useEffect, useState } from "react"

interface IssuePanelContextValue {
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
  togglePanel: () => void
  selectedIssueId: string | null
  selectIssue: (issueId: string) => void
  clearSelection: () => void
}

const IssuePanelContext = createContext<IssuePanelContextValue | null>(null)

const STORAGE_KEY = "issue-panel-open"

function readStoredPanelOpen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true"
  } catch {
    return false
  }
}

export function useIssuePanel() {
  const ctx = useContext(IssuePanelContext)
  if (!ctx) {
    throw new Error("useIssuePanel must be used within IssuePanelProvider")
  }
  return ctx
}

export function useIssuePanelSafe(): IssuePanelContextValue | null {
  return useContext(IssuePanelContext)
}

export function IssuePanelProvider({ children }: { children: React.ReactNode }) {
  const [panelOpen, setPanelOpenState] = useState(readStoredPanelOpen)
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)

  const setPanelOpen = useCallback((open: boolean) => {
    setPanelOpenState(open)
    try {
      localStorage.setItem(STORAGE_KEY, String(open))
    } catch {
      // Storage unavailable
    }
  }, [])

  const togglePanel = useCallback(() => {
    setPanelOpen(!panelOpen)
  }, [panelOpen, setPanelOpen])

  const selectIssue = useCallback(
    (issueId: string) => {
      setSelectedIssueId(issueId)
      if (!panelOpen) {
        setPanelOpen(true)
      }
    },
    [panelOpen, setPanelOpen],
  )

  const clearSelection = useCallback(() => {
    setSelectedIssueId(null)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panelOpen) {
        setPanelOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [panelOpen, setPanelOpen])

  return (
    <IssuePanelContext.Provider
      value={{
        panelOpen,
        setPanelOpen,
        togglePanel,
        selectedIssueId,
        selectIssue,
        clearSelection,
      }}
    >
      {children}
    </IssuePanelContext.Provider>
  )
}
