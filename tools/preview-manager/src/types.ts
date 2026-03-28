export type PreviewStatus =
  | "creating"
  | "starting"
  | "ready"
  | "error"
  | "stopped";

export type PreviewProvider = "local-docker" | "e2b";

export interface Preview {
  id: string;
  provider: PreviewProvider;
  branch: string;
  repoPath: string;
  workspacePath: string;
  containerId?: string;
  port?: number;
  status: PreviewStatus;
  baseUrl?: string;
  pid?: number;
  startedAt: Date;
  lastSeenAt: Date;
  env: Record<string, string>;
}