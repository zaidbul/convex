import { useState, useEffect, useRef } from "react";

type PreviewStatus = "idle" | "creating" | "starting" | "ready" | "error";

export default function Preview({ branch }: { branch: string }) {
  const [status, setStatus] = useState<PreviewStatus>("idle");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPreview = async () => {
    setStatus("creating");

    const res = await fetch("http://127.0.0.1:4310/api/previews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branch }),
    });

    const data = await res.json();
    setPreviewId(data.id);
    pollStatus(data.id);
  };

  const pollStatus = async (id: string) => {
    const interval = setInterval(async () => {
      const res = await fetch(
        `http://127.0.0.1:4310/api/previews/${id}/status`
      );
      const data = await res.json();

      setStatus(data.status);

      if (data.status === "ready") {
        setBaseUrl(`http://127.0.0.1:4310/preview/${id}/`);
        clearInterval(interval);
        startHeartbeat(id);
      }

      if (data.status === "error") {
        clearInterval(interval);
      }
    }, 2000);
  };

  const startHeartbeat = (id: string) => {
    heartbeatRef.current = setInterval(() => {
      fetch(`http://127.0.0.1:4310/api/previews/${id}/heartbeat`, {
        method: "POST",
      });
    }, 120000);
  };

  const stopPreview = async () => {
    if (!previewId) return;
    await fetch(`http://127.0.0.1:4310/api/previews/${previewId}/stop`, {
      method: "POST",
    });
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    setStatus("idle");
    setBaseUrl(null);
    setPreviewId(null);
  };

  useEffect(() => {
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "#16130d",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        background: "#1e1a13",
      }}>
        <h2 style={{ color: "#eae1d6", margin: 0 }}>Preview</h2>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ color: "#eae1d6", fontSize: "14px" }}>
            {status === "idle" && "Not started"}
            {status === "creating" && "Creating preview..."}
            {status === "starting" && "Starting app..."}
            {status === "ready" && "Ready"}
            {status === "error" && "Error"}
          </span>
          {status === "idle" && (
            <button onClick={startPreview} style={{
              background: "#fd5300",
              color: "#220a00",
              border: "none",
              borderRadius: "9999px",
              padding: "0.5rem 1.5rem",
              cursor: "pointer",
              fontWeight: "bold",
            }}>Preview</button>
          )}
          {status !== "idle" && (
            <button onClick={stopPreview} style={{
              background: "#333",
              color: "#eae1d6",
              border: "none",
              borderRadius: "9999px",
              padding: "0.5rem 1.5rem",
              cursor: "pointer",
            }}>Stop</button>
          )}
        </div>
      </div>

      {(status === "creating" || status === "starting") && (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#eae1d6",
          fontSize: "18px",
        }}>
          <div>
            <p style={{ textAlign: "center" }}>
              {status === "creating" ? "Setting up your preview..." : "Starting the app..."}
            </p>
            <p style={{ textAlign: "center", color: "#fd5300", fontSize: "14px" }}>
              This takes about 30-60 seconds
            </p>
          </div>
        </div>
      )}

      {status === "ready" && baseUrl && (
        <iframe
          src={baseUrl}
          style={{
            flex: 1,
            border: "none",
            width: "100%",
          }}
          title="preview"
        />
      )}

      {status === "error" && (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fd5300",
          fontSize: "18px",
        }}>
          Something went wrong. Try again.
        </div>
      )}
    </div>
  );
}