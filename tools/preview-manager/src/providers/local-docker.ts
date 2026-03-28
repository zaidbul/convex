import { exec } from "child_process";
import { promisify } from "util";
import { mkdirSync, cpSync, rmSync } from "fs";
import type { Preview } from "../types";
import { store } from "../store";

const execAsync = promisify(exec);

const IMAGE_NAME = "convex-preview";

function getRandomPort(): number {
  return Math.floor(Math.random() * (65535 - 10000) + 10000);
}

async function ensureImageBuilt(repoPath: string): Promise<void> {
  try {
    await execAsync(`docker image inspect ${IMAGE_NAME} > /dev/null 2>&1`);
  } catch {
    console.log(`[docker] Building ${IMAGE_NAME} image...`);
    const dockerfilePath = `${repoPath}/tools/preview-manager/Dockerfile.preview`;
    await execAsync(
      `docker build -t ${IMAGE_NAME} -f "${dockerfilePath}" "${repoPath}"`
    );
    console.log(`[docker] Image ${IMAGE_NAME} built successfully`);
  }
}

async function waitUntilReady(port: number, maxAttempts = 40): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/`, {
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok || res.status < 500) {
        console.log(`[docker] Container ready on port ${port} (attempt ${i + 1})`);
        return true;
      }
    } catch {}
    if (i % 5 === 4) {
      console.log(`[docker] Waiting for container on port ${port}... (attempt ${i + 1}/${maxAttempts})`);
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  return false;
}

export async function createLocalDockerPreview(
  id: string,
  branch: string,
  repoPath: string,
  env: Record<string, string>
): Promise<Preview> {
  const port = getRandomPort();

  const preview: Preview = {
    id,
    provider: "local-docker",
    branch,
    repoPath,
    workspacePath: `/home/preview/app`,
    status: "creating",
    port,
    startedAt: new Date(),
    lastSeenAt: new Date(),
    env,
  };

  store.set(id, preview);

  try {
    await ensureImageBuilt(repoPath);

    const tempDir = (process.env.TEMP || process.env.TMP || "/tmp").replace(/\\/g, "/");
    const workspacePath = `${tempDir}/convex-previews/${id}`;
    mkdirSync(workspacePath, { recursive: true });

    cpSync(repoPath, workspacePath, {
      recursive: true,
      filter: (src) =>
        !src.includes("node_modules") &&
        !src.includes("convex-previews") &&
        !src.includes(".git"),
    });

    store.update(id, { status: "starting", workspacePath });

    const envFlags = Object.entries({
      ...env,
      PORT: "3000",
      NODE_ENV: "development",
      APP_URL: `http://127.0.0.1:4310/preview/${id}`,
    })
      .map(([k, v]) => `-e "${k}=${v}"`)
      .join(" ");

    const dockerPath = workspacePath.replace(/^([A-Za-z]):/, "/$1").replace(/\\/g, "/");

    const { stdout: containerId } = await execAsync(
      `docker run -d --rm -p ${port}:3000 ${envFlags} -v "${dockerPath}:/home/preview/app" convex-preview sh -c "bun install && bun run preview:dev"`
    );

    store.update(id, { containerId: containerId.trim() });

    const ready = await waitUntilReady(port);

    if (!ready) {
      // Capture logs for debugging
      let logs = "";
      try {
        const result = await execAsync(
          `docker logs ${containerId.trim()} --tail 50 2>&1`
        );
        logs = result.stdout;
      } catch {}

      store.update(id, {
        status: "error",
        error: `Container did not become ready in time.${logs ? `\n${logs}` : ""}`,
      });
      throw new Error("Container did not become ready in time");
    }

    store.update(id, {
      status: "ready",
      baseUrl: `http://127.0.0.1:4310/preview/${id}/`,
      lastSeenAt: new Date(),
    });

    return store.get(id)!;
  } catch (err) {
    if (store.get(id)?.status !== "error") {
      store.update(id, {
        status: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
    throw err;
  }
}

export async function stopLocalDockerPreview(preview: Preview): Promise<void> {
  if (preview.containerId) {
    try {
      await execAsync(`docker stop ${preview.containerId}`);
    } catch {}
  }

  if (preview.workspacePath && preview.workspacePath.includes("convex-previews")) {
    try {
      rmSync(preview.workspacePath, { recursive: true, force: true });
    } catch {}
  }
}
