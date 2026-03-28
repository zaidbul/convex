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

  static getDerivedStateFromError(_error: Error) {
    // Never set error state to prevent remounting - errors are handled globally
    return { hasError: false };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Suppress React DOM reconciliation errors - they're handled globally
    const errorMessage = error.message || "";
    if (
      (errorMessage.includes("removeChild") && errorMessage.includes("not a child")) ||
      errorMessage.includes("NotFoundError") ||
      (errorMessage.includes("Failed to execute") && errorMessage.includes("removeChild"))
    ) {
      return;
    }
    console.error("[Editor] Error caught by boundary:", error, errorInfo);
  }

  override render() {
    // Always render children - never remount to preserve focus
    return this.props.children;
  }
}
