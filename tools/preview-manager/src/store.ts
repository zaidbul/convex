import type { Preview } from "./types";

const previews = new Map<string, Preview>();

export const store = {
  get(id: string): Preview | undefined {
    return previews.get(id);
  },

  set(id: string, preview: Preview): void {
    previews.set(id, preview);
  },

  delete(id: string): void {
    previews.delete(id);
  },

  all(): Preview[] {
    return Array.from(previews.values());
  },

  update(id: string, patch: Partial<Preview>): Preview | undefined {
    const preview = previews.get(id);
    if (!preview) return undefined;
    const updated = { ...preview, ...patch };
    previews.set(id, updated);
    return updated;
  },
};