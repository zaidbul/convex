import React from "react";

// Error boundary to catch React DOM reconciliation errors
// This is a transparent wrapper that never remounts to preserve focus
export class LexicalDOMErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    const msg = error.message || "";
    const isLexicalDOMError =
      (msg.includes("removeChild") && msg.includes("not a child")) ||
      msg.includes("NotFoundError") ||
      (msg.includes("Failed to execute") && msg.includes("removeChild"));
    // Only suppress known Lexical DOM reconciliation errors
    return { hasError: !isLexicalDOMError };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const msg = error.message || "";
    const isLexicalDOMError =
      (msg.includes("removeChild") && msg.includes("not a child")) ||
      msg.includes("NotFoundError") ||
      (msg.includes("Failed to execute") && msg.includes("removeChild"));
    if (isLexicalDOMError) {
      return;
    }
    console.error("[Editor] Error caught by boundary:", error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          Something went wrong in the editor. Please reload the page.
        </div>
      );
    }
    return this.props.children;
  }
}
