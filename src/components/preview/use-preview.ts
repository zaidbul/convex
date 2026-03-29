import { useState, useRef, useCallback, useEffect } from "react";
import type { PreviewStatus, PreviewProvider } from "./types";
import { PREVIEW_MANAGER_URL } from "./types";

interface UsePreviewReturn {
  status: PreviewStatus;
  previewId: string | null;
  baseUrl: string | null;
  error: string | null;
  start: (provider: PreviewProvider, branch: string) => Promise<void>;
  stop: () => Promise<void>;
}

export function usePreview(): UsePreviewReturn {
  const [status, setStatus] = useState<PreviewStatus>("idle");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  const cleanup = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(
    (id: string) => {
      heartbeatRef.current = setInterval(() => {
        fetch(`${PREVIEW_MANAGER_URL}/api/previews/${id}/heartbeat`, {
          method: "POST",
        }).catch(() => {});
      }, 120_000);
    },
    []
  );

  const pollStatus = useCallback(
    (id: string) => {
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(
            `${PREVIEW_MANAGER_URL}/api/previews/${id}/status`
          );
          const data = await res.json();

          setStatus(data.status);

          if (data.status === "ready" && data.baseUrl) {
            setBaseUrl(data.baseUrl);
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
            startHeartbeat(id);
          }

          if (data.status === "error") {
            setError(data.error ?? "Preview failed to start");
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
          }
        } catch {
          setError("Lost connection to preview manager");
          setStatus("error");
          cleanup();
        }
      }, 2000);
    },
    [cleanup, startHeartbeat]
  );

  const start = useCallback(
    async (provider: PreviewProvider, branch: string) => {
      cleanup();
      setError(null);
      setBaseUrl(null);
      setStatus("creating");

      try {
        const res = await fetch(`${PREVIEW_MANAGER_URL}/api/previews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ branch, provider }),
        });

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const data = await res.json();
        if (!isMountedRef.current) return;
        setPreviewId(data.id);
        pollStatus(data.id);
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(
          err instanceof Error ? err.message : "Failed to create preview"
        );
        setStatus("error");
      }
    },
    [cleanup, pollStatus]
  );

  const stop = useCallback(async () => {
    cleanup();
    if (previewId) {
      try {
        await fetch(`${PREVIEW_MANAGER_URL}/api/previews/${previewId}/stop`, {
          method: "POST",
        });
      } catch {}
    }
    setStatus("idle");
    setBaseUrl(null);
    setPreviewId(null);
    setError(null);
  }, [cleanup, previewId]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return { status, previewId, baseUrl, error, start, stop };
}
