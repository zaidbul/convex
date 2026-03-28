import { useEffect } from "react";

function isLexicalDOMError(msg: string): boolean {
  return (
    (msg.includes("removeChild") && msg.includes("not a child")) ||
    msg.includes("NotFoundError") ||
    (msg.includes("Failed to execute") && msg.includes("removeChild"))
  );
}

// Ref-counted singleton: only one set of global handlers regardless of editor count
let refCount = 0;
let savedOnerror: typeof globalThis.onerror = null;
let unhandledRejectionHandler: ((e: PromiseRejectionEvent) => void) | null = null;

function acquire() {
  refCount++;
  if (refCount > 1) return; // already installed

  savedOnerror = globalThis.onerror;

  globalThis.onerror = (event, source, lineno, colno, error) => {
    const msg =
      (error instanceof Error ? error.message : typeof event === "string" ? event : "") || "";
    if (isLexicalDOMError(msg)) return true;
    if (typeof savedOnerror === "function") {
      return savedOnerror(event, source, lineno, colno, error);
    }
    return false;
  };

  unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
    const msg = event.reason?.message || String(event.reason || "");
    if (isLexicalDOMError(msg)) {
      event.preventDefault();
    }
  };

  globalThis.addEventListener("unhandledrejection", unhandledRejectionHandler);
}

function release() {
  refCount = Math.max(0, refCount - 1);
  if (refCount > 0) return; // other editors still mounted

  globalThis.onerror = savedOnerror;
  savedOnerror = null;

  if (unhandledRejectionHandler) {
    globalThis.removeEventListener("unhandledrejection", unhandledRejectionHandler);
    unhandledRejectionHandler = null;
  }
}

export function useLexicalErrorSuppression() {
  useEffect(() => {
    acquire();
    return release;
  }, []);
}
