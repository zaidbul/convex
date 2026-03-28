import { exec } from "child_process";
import { promisify } from "util";
import type { Preview } from "../types";
import { store } from "../store";

const execAsync = promisify(exec);

function getRandomPort(): number {
  return Math.floor(Math.random() * (65535 - 10000) + 10000);
}

async function waitUntilReady(
  port: number,
  maxAttempts = 30
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/`);
      if (res.ok || res.status < 500) return true;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 2000));
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
    const workspacePath = `.preview/workspaces/${id}`;
    await execAsync(`mkdir -p ${workspacePath}`);
    await execAsync(`git worktree add ${workspacePath} ${branch}`);

    store.update(id, { status: "starting", workspacePath });

    const envFlags = Object.entries({
      ...env,
      PORT: "3000",
      NODE_ENV: "development",
      APP_URL: `http://127.0.0.1:4310/preview/${id}`,
    })
      .map(([k, v]) => `-e ${k}="${v}"`)
      .join(" ");

    const { stdout: containerId } = await execAsync(
      `docker run -d --rm \
        -p ${port}:3000 \
        ${envFlags} \
        -v ${process.cwd()}/${workspacePath}:/home/preview/app \
        convex-preview \
        sh -c "bun install && bun run preview:dev"`
    );

    store.update(id, { containerId: containerId.trim() });

    const ready = await waitUntilReady(port);

    if (!ready) {
      store.update(id, { status: "error" });
      throw new Error("Container did not become ready in time");
    }

    store.update(id, {
      status: "ready",
      baseUrl: `http://127.0.0.1:4310/preview/${id}/`,
      lastSeenAt: new Date(),
    });

    return store.get(id)!;
  } catch (err) {
    store.update(id, { status: "error" });
    throw err;
  }
}