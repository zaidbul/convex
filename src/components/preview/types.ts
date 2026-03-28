export type PreviewStatus =
  | "idle"
  | "creating"
  | "starting"
  | "ready"
  | "error";

export type PreviewProvider = "local-docker" | "e2b";

export type ViewportPreset = "desktop" | "tablet" | "mobile";

export interface ViewportDimensions {
  width: string;
  height: string;
  label: string;
}

export const VIEWPORT_PRESETS: Record<ViewportPreset, ViewportDimensions> = {
  desktop: { width: "100%", height: "100%", label: "Desktop" },
  tablet: { width: "834px", height: "1112px", label: "Tablet" },
  mobile: { width: "390px", height: "844px", label: "Mobile" },
};

export const PREVIEW_MANAGER_URL = "http://127.0.0.1:4310";
