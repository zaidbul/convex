import http from "http";
import { randomUUID } from "crypto";
import { store } from "./store";
import { createLocalDockerPreview, stopLocalDockerPreview } from "./providers/local-docker";
import { createE2BPreview, stopE2BPreview } from "./providers/e2b";
import { handleProxy, handleProxyUpgrade } from "./proxy";
import type { PreviewProvider } from "./types";

const PORT = 4310;

function json(res: http.ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

async function parseBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url ?? "/";
  const method = req.method ?? "GET";

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Proxy route
  const proxyMatch = url.match(/^\/preview\/([^/]+)(\/.*)?$/);
  if (proxyMatch) {
    handleProxy(req, res, proxyMatch[1]);
    return;
  }

  // GET /api/previews — list all
  if (method === "GET" && url === "/api/previews") {
    json(res, 200, store.all());
    return;
  }

  // POST /api/previews — create
  if (method === "POST" && url === "/api/previews") {
    const body = await parseBody(req);
    const id = randomUUID();
    const repoPath = process.cwd();
    const branch = body.branch ?? "main";
    const provider: PreviewProvider = body.provider ?? "local-docker";
    const env = {
      TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL ?? "",
      TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ?? "",
    };

    const createFn =
      provider === "e2b" ? createE2BPreview : createLocalDockerPreview;

    createFn(id, branch, repoPath, env).catch((err) =>
      console.error(`[preview:${provider}] error`, err)
    );

    json(res, 202, { id, status: "creating", provider });
    return;
  }

  // GET /api/previews/:id
  const getMatch = url.match(/^\/api\/previews\/([^/]+)$/);
  if (method === "GET" && getMatch) {
    const preview = store.get(getMatch[1]);
    if (!preview) return json(res, 404, { error: "not found" });
    json(res, 200, preview);
    return;
  }

  // GET /api/previews/:id/status
  const statusMatch = url.match(/^\/api\/previews\/([^/]+)\/status$/);
  if (method === "GET" && statusMatch) {
    const preview = store.get(statusMatch[1]);
    if (!preview) return json(res, 404, { error: "not found" });
    json(res, 200, {
      status: preview.status,
      baseUrl: preview.baseUrl,
      provider: preview.provider,
      error: preview.error,
    });
    return;
  }

  // POST /api/previews/:id/stop
  const stopMatch = url.match(/^\/api\/previews\/([^/]+)\/stop$/);
  if (method === "POST" && stopMatch) {
    const preview = store.get(stopMatch[1]);
    if (!preview) return json(res, 404, { error: "not found" });

    try {
      if (preview.provider === "local-docker") {
        await stopLocalDockerPreview(preview);
      } else if (preview.provider === "e2b") {
        await stopE2BPreview(preview);
      }
    } catch (err) {
      console.error("[preview] stop error", err);
    }

    store.update(stopMatch[1], { status: "stopped" });
    json(res, 200, { ok: true });
    return;
  }

  // POST /api/previews/:id/heartbeat
  const heartbeatMatch = url.match(/^\/api\/previews\/([^/]+)\/heartbeat$/);
  if (method === "POST" && heartbeatMatch) {
    store.update(heartbeatMatch[1], { lastSeenAt: new Date() });
    json(res, 200, { ok: true });
    return;
  }

  json(res, 404, { error: "not found" });
});

server.on("upgrade", (req, socket, head) => {
  const url = req.url ?? "/";
  const proxyMatch = url.match(/^\/preview\/([^/]+)(\/.*)?$/);
  if (proxyMatch) {
    handleProxyUpgrade(req, socket, head, proxyMatch[1]);
  } else {
    socket.destroy();
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Preview manager running on http://127.0.0.1:${PORT}`);
});
