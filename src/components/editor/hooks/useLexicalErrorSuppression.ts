import { useEffect } from "react";

export function useLexicalErrorSuppression() {
  useEffect(() => {
    const originalError = globalThis.onerror;

    const errorHandler = (
      event: ErrorEvent | string,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error | null,
    ): boolean => {
      const errorMessage =
        (error && typeof error === "object" && "message" in error
          ? error.message
          : typeof event === "string"
            ? event
            : event.message) || "";

      if (
        (errorMessage.includes("removeChild") && errorMessage.includes("not a child")) ||
        errorMessage.includes("NotFoundError") ||
        (errorMessage.includes("Failed to execute") && errorMessage.includes("removeChild"))
      ) {
        return true;
      }

      if (originalError) {
        if (typeof originalError === "function") {
          return originalError(event, source, lineno, colno, error || undefined);
        }
      }
      return false;
    };

    globalThis.onerror = errorHandler as typeof globalThis.onerror;

    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason || "");
      if (
        (errorMessage.includes("removeChild") && errorMessage.includes("not a child")) ||
        errorMessage.includes("NotFoundError") ||
        (errorMessage.includes("Failed to execute") && errorMessage.includes("removeChild"))
      ) {
        event.preventDefault();
        return;
      }
    };

    globalThis.addEventListener("unhandledrejection", unhandledRejectionHandler);

    const reactErrorHandler = (event: Event) => {
      if (event instanceof ErrorEvent) {
        const errorMessage = event.message || event.error?.message || "";
        if (
          (errorMessage.includes("removeChild") && errorMessage.includes("not a child")) ||
          errorMessage.includes("NotFoundError") ||
          (errorMessage.includes("Failed to execute") && errorMessage.includes("removeChild"))
        ) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
      }
      return true;
    };

    document.addEventListener("error", reactErrorHandler, true);

    return () => {
      globalThis.onerror = originalError;
      document.removeEventListener("error", reactErrorHandler, true);
      globalThis.removeEventListener("unhandledrejection", unhandledRejectionHandler);
    };
  }, []);
}
