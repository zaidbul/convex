import type { ViewportPreset } from "./types";
import { VIEWPORT_PRESETS } from "./types";

const SANDBOX_ATTRS =
  "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation";

interface PreviewFrameProps {
  url: string;
  viewport: ViewportPreset;
}

export function PreviewFrame({ url, viewport }: PreviewFrameProps) {
  const dims = VIEWPORT_PRESETS[viewport];
  const isConstrained = viewport !== "desktop";

  return (
    <div className="flex flex-1 items-start justify-center overflow-auto bg-muted/30 p-4">
      <div
        className={
          isConstrained
            ? "rounded-2xl border border-border bg-background shadow-lg"
            : "h-full w-full"
        }
        style={
          isConstrained
            ? { width: dims.width, height: dims.height }
            : undefined
        }
      >
        <iframe
          src={url}
          sandbox={SANDBOX_ATTRS}
          allow="display-capture; microphone; storage-access-by-user-activation"
          title="Live preview"
          className="h-full w-full border-none"
          style={
            isConstrained
              ? {
                  width: dims.width,
                  height: dims.height,
                  borderRadius: "1rem",
                }
              : { width: "100%", height: "100%" }
          }
        />
      </div>
    </div>
  );
}
