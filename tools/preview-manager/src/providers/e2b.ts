import { execSync } from "child_process";
import { readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import type { Preview } from "../types";
import { store } from "../store";
import { Sandbox } from "@e2b/code-interpreter";

async function waitUntilReady(
  url: string,
  maxAttempts = 40
): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 3000));
  }
  return false;
}

function createTarball(repoPath: string): Buffer {
  const tmp = join(tmpdir(), `e2b-upload-${Date.now()}.tar.gz`);
  execSync(
    `tar czf "${tmp}" --exclude=node_modules --exclude=.git --exclude=convex-previews -C "${repoPath}" .`
  );
  return readFileSync(tmp);
}

export async function createE2BPreview(
  id: string,
  branch: string,
  repoPath: string,
  env: Record<string, string>
): Promise<Preview> {
  const preview: Preview = {
    id,
    provider: "e2b",
    branch,
    repoPath,
    workspacePath: "/home/user/app",
    status: "creating",
    startedAt: new Date(),
    lastSeenAt: new Date(),
    env,
  };

  store.set(id, preview);

  try {
    store.update(id, { status: "starting" });

    const sandbox = await Sandbox.create({
      envs: {
        ...env,
        PORT: "3000",
        NODE_ENV: "development",
      },
    });

    store.update(id, { sandboxId: sandbox.sandboxId });

    // Upload project files as tarball
    const tarball = createTarball(repoPath);
    await sandbox.files.write("/home/user/app.tar.gz", tarball.buffer as ArrayBuffer);

    // Extract and install
    await sandbox.commands.run(
      "mkdir -p /home/user/app && tar xzf /home/user/app.tar.gz -C /home/user/app"
    );
    await sandbox.commands.run("cd /home/user/app && bun install");

    // Start dev server in background (don't await)
    sandbox.commands.run("cd /home/user/app && bun run preview:dev");

    // Build the public URL
    const host = sandbox.getHost(3000);
    const baseUrl = `https://${host}`;

    // Wait for the app to be ready
    const ready = await waitUntilReady(baseUrl);

    if (!ready) {
      store.update(id, {
        status: "error",
        error: "E2B sandbox app did not become ready in time",
      });
      throw new Error("E2B sandbox did not become ready in time");
    }

    store.update(id, {
      status: "ready",
      baseUrl,
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

export async function stopE2BPreview(preview: Preview): Promise<void> {
  if (preview.sandboxId) {
    try {
      const sandbox = await Sandbox.connect(preview.sandboxId);
      await sandbox.kill();
    } catch {}
  }
}
