import { useState } from "react";
import { usePreview } from "./use-preview";
import { PreviewToolbar } from "./preview-toolbar";
import { PreviewFrame } from "./preview-frame";
import type { PreviewProvider, ViewportPreset } from "./types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PreviewPanel() {
  const [provider, setProvider] = useState<PreviewProvider>("local-docker");
  const [viewport, setViewport] = useState<ViewportPreset>("desktop");
  const { status, baseUrl, error, start, stop } = usePreview();

  const handleStart = () => start(provider, "main");

  return (
    <div className="flex h-screen flex-col bg-background">
      <PreviewToolbar
        status={status}
        provider={provider}
        viewport={viewport}
        baseUrl={baseUrl}
        onProviderChange={setProvider}
        onViewportChange={setViewport}
        onStart={handleStart}
        onStop={stop}
      />

      {status === "idle" && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">
              No preview running
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a provider and click Start to launch a live preview
            </p>
          </div>
        </div>
      )}

      {(status === "creating" || status === "starting") && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto size-8 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium text-foreground">
              {status === "creating"
                ? "Setting up your preview..."
                : "Starting the app..."}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              This takes about 30–60 seconds
            </p>
          </div>
        </div>
      )}

      {status === "ready" && baseUrl && (
        <PreviewFrame url={baseUrl} viewport={viewport} />
      )}

      {status === "error" && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-destructive">
              Something went wrong
            </p>
            {error && (
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            )}
            <Button className="mt-4" onClick={handleStart}>
              Try again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
