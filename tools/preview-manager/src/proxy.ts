import http from "http";
import httpProxy from "http-proxy";
import { store } from "./store";

const proxy = httpProxy.createProxyServer({
  ws: true,
  changeOrigin: true,
});

proxy.on("error", (err, req, res) => {
  console.error("[proxy] error", err.message);
  if (res instanceof http.ServerResponse) {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Preview not ready yet.");
  }
});

export function handleProxy(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  previewId: string
) {
  const preview = store.get(previewId);

  if (!preview || preview.status !== "ready" || !preview.port) {
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: preview?.status ?? "not_found" }));
    return;
  }

  const target = `http://127.0.0.1:${preview.port}`;

  res.setHeader("Cache-Control", "no-store");

  proxy.web(req, res, { target });
}

export function handleProxyUpgrade(
  req: http.IncomingMessage,
  socket: any,
  head: Buffer,
  previewId: string
) {
  const preview = store.get(previewId);
  if (!preview || !preview.port) return socket.destroy();

  const target = `http://127.0.0.1:${preview.port}`;
  proxy.ws(req, socket, head, { target });
}