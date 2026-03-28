import { Preview } from "../types";
import { store } from "../store";
import { Sandbox } from "@e2b/code-interpreter";

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

    await sandbox.commands.run(
      `git clone ${repoPath} /home/user/app && cd /home/user/app && git checkout ${branch}`
    );

    await sandbox.commands.run(
      "cd /home/user/app && bun install"
    );

    sandbox.commands.run(
      "cd /home/user/app && bun run preview:dev"
    );

    const host = sandbox.getHost(3000);
    const baseUrl = `https://${host}`;

    store.update(id, {
      status: "ready",
      baseUrl,
      lastSeenAt: new Date(),
    });

    return store.get(id)!;
  } catch (err) {
    store.update(id, { status: "error" });
    throw err;
  }
}