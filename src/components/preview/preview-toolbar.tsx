import {
  Monitor,
  Tablet,
  Smartphone,
  Play,
  Square,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { PreviewStatus, PreviewProvider, ViewportPreset } from "./types";

interface PreviewToolbarProps {
  status: PreviewStatus;
  provider: PreviewProvider;
  viewport: ViewportPreset;
  baseUrl: string | null;
  onProviderChange: (provider: PreviewProvider) => void;
  onViewportChange: (viewport: ViewportPreset) => void;
  onStart: () => void;
  onStop: () => void;
}

const STATUS_BADGE: Record<
  PreviewStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  idle: { label: "Idle", variant: "outline" },
  creating: { label: "Creating...", variant: "secondary" },
  starting: { label: "Starting...", variant: "secondary" },
  ready: { label: "Ready", variant: "default" },
  error: { label: "Error", variant: "destructive" },
};

export function PreviewToolbar({
  status,
  provider,
  viewport,
  baseUrl,
  onProviderChange,
  onViewportChange,
  onStart,
  onStop,
}: PreviewToolbarProps) {
  const badge = STATUS_BADGE[status];
  const isRunning = status !== "idle" && status !== "error";
  const isLoading = status === "creating" || status === "starting";

  return (
    <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-2">
      {/* Provider selector */}
      <Select
        value={provider}
        onValueChange={(val) => onProviderChange(val as PreviewProvider)}
        disabled={isRunning}
      >
        <SelectTrigger size="sm" className="w-[140px]">
          <SelectValue placeholder="Provider" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="local-docker">Docker</SelectItem>
          <SelectItem value="e2b">E2B Cloud</SelectItem>
        </SelectContent>
      </Select>

      {/* Start/Stop */}
      {status === "idle" || status === "error" ? (
        <Button size="sm" onClick={onStart}>
          <Play className="mr-1.5 size-3.5" />
          Start
        </Button>
      ) : (
        <Button size="sm" variant="secondary" onClick={onStop}>
          {isLoading ? (
            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
          ) : (
            <Square className="mr-1.5 size-3.5" />
          )}
          Stop
        </Button>
      )}

      {/* Status badge */}
      <Badge variant={badge.variant}>{badge.label}</Badge>

      {/* URL bar */}
      {baseUrl && (
        <input
          readOnly
          value={baseUrl}
          className="h-8 flex-1 rounded-lg border border-border bg-muted/30 px-3 text-xs text-muted-foreground outline-none"
        />
      )}

      <div className="ml-auto" />

      {/* Viewport presets */}
      <ToggleGroup
        value={[viewport]}
        onValueChange={(val) => {
          if (val.length > 0) onViewportChange(val[0] as ViewportPreset);
        }}
        variant="outline"
        size="sm"
      >
        <ToggleGroupItem value="desktop" aria-label="Desktop viewport">
          <Monitor className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="tablet" aria-label="Tablet viewport">
          <Tablet className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="mobile" aria-label="Mobile viewport">
          <Smartphone className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
