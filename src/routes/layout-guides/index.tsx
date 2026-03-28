import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import {
  layoutExamples,
  type LayoutCategory,
  type LayoutExampleId,
} from "@/components/layout-examples/layout-catalog";
import {
  LayoutPatternLegend,
  layoutPatternChecks,
} from "@/components/layout-examples/layout-renderer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/layout-guides/")({
  component: LayoutGalleryPage,
});

const categoryOrder: readonly LayoutCategory[] = ["Sidebar", "Hybrid", "Workspace", "Specialized"];

const categoryDescriptions: Record<LayoutCategory, string> = {
  Sidebar: "Classic app shells with collapsible, floating, or fixed side navigation.",
  Hybrid: "Combine top navigation with optional sidebars for layered information architecture.",
  Workspace: "Multi-pane layouts for dense, productivity-oriented interfaces.",
  Specialized: "Purpose-built shells for settings, data tables, auth, and marketing pages.",
};

const layoutGuidePathById = {
  "sidebar-left-icon": "/layout-guides/sidebar-left-icon",
  "sidebar-left-offcanvas": "/layout-guides/sidebar-left-offcanvas",
  "sidebar-left-floating-icon": "/layout-guides/sidebar-left-floating-icon",
  "sidebar-left-inset": "/layout-guides/sidebar-left-inset",
  "sidebar-right": "/layout-guides/sidebar-right",
  "sidebar-non-collapsible": "/layout-guides/sidebar-non-collapsible",
  "topnav-left-sidebar": "/layout-guides/topnav-left-sidebar",
  "topnav-only": "/layout-guides/topnav-only",
  "leftnav-right-panel": "/layout-guides/leftnav-right-panel",
  "master-detail": "/layout-guides/master-detail",
  "three-column-workspace": "/layout-guides/three-column-workspace",
  "settings-sidebar": "/layout-guides/settings-sidebar",
  "data-table-layout": "/layout-guides/data-table-layout",
  "auth-minimal": "/layout-guides/auth-minimal",
  "marketing-public": "/layout-guides/marketing-public",
} as const satisfies Record<LayoutExampleId, string>;

type LayoutExample = (typeof layoutExamples)[number];

const examplesByCategory = layoutExamples.reduce(
  (acc, example) => {
    const bucket = acc[example.category];
    if (bucket) {
      bucket.push(example);
    }
    return acc;
  },
  {
    Sidebar: [] as LayoutExample[],
    Hybrid: [] as LayoutExample[],
    Workspace: [] as LayoutExample[],
    Specialized: [] as LayoutExample[],
  },
);

/** SVG wireframe thumbnails for each layout */
function LayoutThumbnail({ layoutId }: { layoutId: string }) {
  const shared = {
    bg: "fill-surface-container",
    stroke: "stroke-outline-variant/15",
    panel: "fill-surface-high",
    accent: "fill-primary/20",
    accentStroke: "stroke-primary/40",
    bar: "fill-on-surface-variant/15",
    barDark: "fill-on-surface-variant/25",
  };

  const wireframes: Record<string, React.ReactNode> = {
    "sidebar-left-icon": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="50" height="180" className={shared.panel} rx="0" />
        <rect x="12" y="16" width="26" height="6" rx="2" className={shared.barDark} />
        <rect x="14" y="36" width="22" height="4" rx="1" className={shared.bar} />
        <rect x="14" y="48" width="22" height="4" rx="1" className={shared.bar} />
        <rect x="14" y="60" width="22" height="4" rx="1" className={shared.bar} />
        <rect x="14" y="72" width="22" height="4" rx="1" className={shared.bar} />
        <rect x="14" y="84" width="22" height="4" rx="1" className={shared.bar} />
        <rect x="8" y="36" width="3" height="4" rx="1" className="fill-primary/40" />
        <rect x="50" y="0" width="230" height="28" className={shared.panel} />
        <rect x="60" y="10" width="50" height="5" rx="2" className={shared.barDark} />
        <rect x="240" y="9" width="28" height="8" rx="3" className={shared.bar} />
        <rect
          x="62"
          y="40"
          width="48"
          height="30"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="118"
          y="40"
          width="48"
          height="30"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="174"
          y="40"
          width="48"
          height="30"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="230"
          y="40"
          width="38"
          height="30"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="62"
          y="82"
          width="206"
          height="86"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="74" y="94" width="60" height="5" rx="2" className={shared.barDark} />
        <rect x="74" y="106" width="120" height="4" rx="1" className={shared.bar} />
      </svg>
    ),
    "sidebar-left-offcanvas": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="60" height="180" className={shared.panel} rx="0" />
        <line
          x1="60"
          y1="0"
          x2="60"
          y2="180"
          className="stroke-primary/30"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <polygon points="56,88 50,84 50,92" className="fill-primary/30" />
        <rect x="12" y="16" width="36" height="6" rx="2" className={shared.barDark} />
        <rect x="12" y="36" width="36" height="4" rx="1" className={shared.bar} />
        <rect x="12" y="48" width="36" height="4" rx="1" className={shared.bar} />
        <rect x="12" y="60" width="36" height="4" rx="1" className={shared.bar} />
        <rect x="12" y="72" width="36" height="4" rx="1" className={shared.bar} />
        <rect x="60" y="0" width="220" height="28" className={shared.panel} />
        <rect x="70" y="10" width="50" height="5" rx="2" className={shared.barDark} />
        <rect
          x="72"
          y="40"
          width="196"
          height="52"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="72"
          y="102"
          width="196"
          height="66"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
      </svg>
    ),
    "sidebar-left-floating-icon": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="280" height="180" className={shared.bg} rx="0" />
        <rect
          x="8"
          y="8"
          width="48"
          height="164"
          rx="8"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="18" y="22" width="28" height="5" rx="2" className={shared.barDark} />
        <rect x="20" y="40" width="24" height="4" rx="1" className={shared.bar} />
        <rect x="20" y="52" width="24" height="4" rx="1" className={shared.bar} />
        <rect x="20" y="64" width="24" height="4" rx="1" className={shared.bar} />
        <circle cx="32" cy="158" r="6" className={shared.bar} />
        <rect x="64" y="0" width="216" height="28" className={shared.panel} />
        <rect x="74" y="10" width="50" height="5" rx="2" className={shared.barDark} />
        <rect
          x="68"
          y="38"
          width="200"
          height="60"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="68"
          y="108"
          width="200"
          height="64"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
      </svg>
    ),
    "sidebar-left-inset": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="280" height="180" className={shared.bg} rx="0" />
        <rect x="0" y="0" width="56" height="180" className={shared.panel} rx="0" />
        <rect x="12" y="16" width="32" height="6" rx="2" className={shared.barDark} />
        <rect x="12" y="36" width="32" height="4" rx="1" className={shared.bar} />
        <rect x="12" y="48" width="32" height="4" rx="1" className={shared.bar} />
        <rect x="12" y="60" width="32" height="4" rx="1" className={shared.bar} />
        <rect
          x="64"
          y="8"
          width="208"
          height="164"
          rx="8"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="76" y="22" width="60" height="5" rx="2" className={shared.barDark} />
        <rect
          x="76"
          y="42"
          width="96"
          height="44"
          rx="4"
          className="fill-surface-container/30 stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="180"
          y="42"
          width="80"
          height="44"
          rx="4"
          className="fill-surface-container/30 stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="76"
          y="96"
          width="184"
          height="64"
          rx="4"
          className="fill-surface-container/30 stroke-outline-variant/15"
          strokeWidth="0.5"
        />
      </svg>
    ),
    "sidebar-right": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="230" height="28" className={shared.panel} />
        <rect x="10" y="10" width="50" height="5" rx="2" className={shared.barDark} />
        <rect x="230" y="0" width="50" height="180" className={shared.panel} rx="0" />
        <rect x="242" y="16" width="26" height="6" rx="2" className={shared.barDark} />
        <rect x="242" y="36" width="26" height="4" rx="1" className={shared.bar} />
        <rect x="242" y="48" width="26" height="4" rx="1" className={shared.bar} />
        <rect x="242" y="60" width="26" height="4" rx="1" className={shared.bar} />
        <rect x="242" y="72" width="26" height="4" rx="1" className={shared.bar} />
        <rect
          x="12"
          y="40"
          width="104"
          height="30"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="124"
          y="40"
          width="96"
          height="30"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="12"
          y="82"
          width="208"
          height="86"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
      </svg>
    ),
    "sidebar-non-collapsible": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="64" height="180" className={shared.panel} rx="0" />
        <line x1="64" y1="0" x2="64" y2="180" className="stroke-outline-variant/15" strokeWidth="1.5" />
        <rect x="10" y="16" width="44" height="6" rx="2" className={shared.barDark} />
        <rect x="10" y="36" width="44" height="5" rx="1" className="fill-primary/20" />
        <rect x="10" y="49" width="44" height="4" rx="1" className={shared.bar} />
        <rect x="10" y="61" width="44" height="4" rx="1" className={shared.bar} />
        <rect x="10" y="73" width="44" height="4" rx="1" className={shared.bar} />
        <rect x="10" y="85" width="44" height="4" rx="1" className={shared.bar} />
        <rect x="22" y="160" width="20" height="8" rx="2" className={shared.bar} />
        <rect x="64" y="0" width="216" height="28" className={shared.panel} />
        <rect x="76" y="10" width="50" height="5" rx="2" className={shared.barDark} />
        <rect
          x="76"
          y="40"
          width="96"
          height="36"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="180"
          y="40"
          width="88"
          height="36"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="76"
          y="86"
          width="192"
          height="82"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
      </svg>
    ),
    "topnav-left-sidebar": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="280" height="28" className={shared.panel} />
        <rect x="10" y="10" width="40" height="6" rx="2" className={shared.barDark} />
        <rect x="60" y="11" width="24" height="4" rx="1" className={shared.bar} />
        <rect x="90" y="11" width="24" height="4" rx="1" className={shared.bar} />
        <rect x="120" y="11" width="24" height="4" rx="1" className={shared.bar} />
        <rect x="236" y="8" width="34" height="10" rx="4" className={shared.bar} />
        <rect
          x="12"
          y="38"
          width="56"
          height="132"
          rx="6"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="20" y="50" width="40" height="4" rx="1" className="fill-primary/20" />
        <rect x="20" y="62" width="40" height="4" rx="1" className={shared.bar} />
        <rect x="20" y="74" width="40" height="4" rx="1" className={shared.bar} />
        <rect x="20" y="86" width="40" height="4" rx="1" className={shared.bar} />
        <rect
          x="78"
          y="38"
          width="48"
          height="28"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="132"
          y="38"
          width="48"
          height="28"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="186"
          y="38"
          width="48"
          height="28"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="240"
          y="38"
          width="30"
          height="28"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="78"
          y="76"
          width="192"
          height="94"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
      </svg>
    ),
    "topnav-only": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="280" height="28" className={shared.panel} />
        <rect x="10" y="10" width="40" height="6" rx="2" className={shared.barDark} />
        <rect x="140" y="11" width="28" height="4" rx="1" className={shared.bar} />
        <rect x="174" y="11" width="28" height="4" rx="1" className={shared.bar} />
        <rect x="208" y="11" width="28" height="4" rx="1" className={shared.bar} />
        <rect x="244" y="8" width="26" height="10" rx="4" className={shared.bar} />
        <rect
          x="20"
          y="40"
          width="240"
          height="44"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="32" y="52" width="80" height="5" rx="2" className={shared.barDark} />
        <rect x="32" y="64" width="140" height="4" rx="1" className={shared.bar} />
        <rect
          x="20"
          y="96"
          width="76"
          height="72"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="104"
          y="96"
          width="76"
          height="72"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="188"
          y="96"
          width="72"
          height="72"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
      </svg>
    ),
    "leftnav-right-panel": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="280" height="24" className={shared.panel} />
        <rect x="0" y="24" width="48" height="156" className={shared.panel} />
        <rect x="8" y="36" width="32" height="4" rx="1" className="fill-primary/20" />
        <rect x="8" y="48" width="32" height="4" rx="1" className={shared.bar} />
        <rect x="8" y="60" width="32" height="4" rx="1" className={shared.bar} />
        <rect x="8" y="72" width="32" height="4" rx="1" className={shared.bar} />
        <rect
          x="56"
          y="32"
          width="158"
          height="140"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="68" y="44" width="60" height="5" rx="2" className={shared.barDark} />
        <rect
          x="68"
          y="58"
          width="64"
          height="44"
          rx="3"
          className="fill-surface-container/30 stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="140"
          y="58"
          width="62"
          height="44"
          rx="3"
          className="fill-surface-container/30 stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect x="222" y="24" width="58" height="156" className={shared.panel} />
        <rect x="228" y="36" width="44" height="4" rx="1" className={shared.barDark} />
        <rect
          x="228"
          y="50"
          width="44"
          height="28"
          rx="3"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="228"
          y="86"
          width="44"
          height="28"
          rx="3"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="228"
          y="122"
          width="44"
          height="28"
          rx="3"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
      </svg>
    ),
    "master-detail": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="280" height="24" className={shared.panel} />
        <rect
          x="12"
          y="32"
          width="86"
          height="140"
          rx="6"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="20" y="42" width="60" height="5" rx="2" className={shared.barDark} />
        <rect
          x="20"
          y="56"
          width="70"
          height="12"
          rx="2"
          className="fill-primary/10 stroke-primary/20"
          strokeWidth="0.5"
        />
        <rect
          x="20"
          y="74"
          width="70"
          height="12"
          rx="2"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="20"
          y="92"
          width="70"
          height="12"
          rx="2"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="20"
          y="110"
          width="70"
          height="12"
          rx="2"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="20"
          y="128"
          width="70"
          height="12"
          rx="2"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="20"
          y="146"
          width="70"
          height="12"
          rx="2"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="108"
          y="32"
          width="162"
          height="140"
          rx="6"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="120" y="44" width="70" height="6" rx="2" className={shared.barDark} />
        <rect x="120" y="58" width="130" height="4" rx="1" className={shared.bar} />
        <rect
          x="120"
          y="72"
          width="64"
          height="32"
          rx="3"
          className="fill-surface-container/30 stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="192"
          y="72"
          width="64"
          height="32"
          rx="3"
          className="fill-surface-container/30 stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="120"
          y="112"
          width="136"
          height="48"
          rx="3"
          className="fill-surface-container/20 stroke-outline-variant/15"
          strokeWidth="0.5"
        />
      </svg>
    ),
    "three-column-workspace": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="280" height="24" className={shared.panel} />
        <rect x="0" y="24" width="48" height="156" className={shared.panel} />
        <rect x="8" y="36" width="32" height="4" rx="1" className="fill-primary/20" />
        <rect x="8" y="48" width="32" height="4" rx="1" className={shared.bar} />
        <rect x="8" y="60" width="32" height="4" rx="1" className={shared.bar} />
        <rect x="8" y="72" width="32" height="4" rx="1" className={shared.bar} />
        <rect x="48" y="24" width="76" height="156" className="fill-surface-high/60" />
        <line x1="48" y1="24" x2="48" y2="180" className="stroke-outline-variant/15" strokeWidth="0.5" />
        <line x1="124" y1="24" x2="124" y2="180" className="stroke-outline-variant/15" strokeWidth="0.5" />
        <rect x="54" y="36" width="64" height="4" rx="1" className={shared.barDark} />
        <rect
          x="54"
          y="50"
          width="64"
          height="18"
          rx="3"
          className="fill-primary/10 stroke-primary/20"
          strokeWidth="0.5"
        />
        <rect
          x="54"
          y="74"
          width="64"
          height="18"
          rx="3"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="54"
          y="98"
          width="64"
          height="18"
          rx="3"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="54"
          y="122"
          width="64"
          height="18"
          rx="3"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="132"
          y="32"
          width="140"
          height="140"
          rx="4"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="144" y="44" width="60" height="5" rx="2" className={shared.barDark} />
        <rect x="144" y="58" width="110" height="4" rx="1" className={shared.bar} />
        <rect
          x="144"
          y="72"
          width="36"
          height="20"
          rx="2"
          className="fill-surface-container/30 stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="186"
          y="72"
          width="36"
          height="20"
          rx="2"
          className="fill-surface-container/30 stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="228"
          y="72"
          width="36"
          height="20"
          rx="2"
          className="fill-surface-container/30 stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="144"
          y="100"
          width="116"
          height="60"
          rx="3"
          className="fill-surface-container/20 stroke-outline-variant/15"
          strokeWidth="0.5"
        />
      </svg>
    ),
    "settings-sidebar": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="280" height="24" className={shared.panel} />
        <rect
          x="20"
          y="36"
          width="64"
          height="132"
          rx="6"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="28" y="48" width="48" height="4" rx="1" className="fill-primary/20" />
        <rect x="28" y="60" width="48" height="4" rx="1" className={shared.bar} />
        <rect x="28" y="72" width="48" height="4" rx="1" className={shared.bar} />
        <rect x="28" y="84" width="48" height="4" rx="1" className={shared.bar} />
        <rect x="28" y="96" width="48" height="4" rx="1" className={shared.bar} />
        <rect
          x="96"
          y="36"
          width="168"
          height="132"
          rx="6"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="110" y="48" width="70" height="6" rx="2" className={shared.barDark} />
        <rect x="110" y="62" width="100" height="4" rx="1" className={shared.bar} />
        <rect
          x="110"
          y="78"
          width="66"
          height="20"
          rx="3"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="184"
          y="78"
          width="66"
          height="20"
          rx="3"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="110"
          y="106"
          width="140"
          height="20"
          rx="3"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect x="200" y="138" width="24" height="10" rx="3" className={shared.bar} />
        <rect x="230" y="138" width="24" height="10" rx="3" className="fill-primary/25" />
      </svg>
    ),
    "data-table-layout": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="280" height="24" className={shared.panel} />
        <rect
          x="16"
          y="32"
          width="248"
          height="24"
          rx="4"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="28" y="40" width="40" height="5" rx="2" className={shared.barDark} />
        <rect x="220" y="38" width="32" height="10" rx="3" className={shared.bar} />
        <rect
          x="16"
          y="62"
          width="248"
          height="18"
          rx="4"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect
          x="24"
          y="67"
          width="80"
          height="8"
          rx="3"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect x="112" y="67" width="32" height="8" rx="3" className={shared.bar} />
        <rect x="150" y="67" width="32" height="8" rx="3" className={shared.bar} />
        <rect
          x="16"
          y="86"
          width="248"
          height="86"
          rx="4"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="24" y="93" width="36" height="4" rx="1" className={shared.barDark} />
        <rect x="80" y="93" width="36" height="4" rx="1" className={shared.barDark} />
        <rect x="140" y="93" width="24" height="4" rx="1" className={shared.barDark} />
        <rect x="188" y="93" width="28" height="4" rx="1" className={shared.barDark} />
        <rect x="232" y="93" width="24" height="4" rx="1" className={shared.barDark} />
        <line x1="24" y1="102" x2="256" y2="102" className="stroke-outline-variant/15" strokeWidth="0.5" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect x="24" y={108 + i * 14} width="32" height="4" rx="1" className={shared.bar} />
            <rect x="80" y={108 + i * 14} width="40" height="4" rx="1" className={shared.bar} />
            <rect
              x="140"
              y={108 + i * 14}
              width="20"
              height="6"
              rx="2"
              className={i % 2 === 0 ? "fill-primary/15" : shared.bar}
            />
            <rect x="188" y={108 + i * 14} width="24" height="4" rx="1" className={shared.bar} />
            <rect x="232" y={108 + i * 14} width="20" height="4" rx="1" className={shared.bar} />
          </g>
        ))}
      </svg>
    ),
    "auth-minimal": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="280" height="180" className={shared.bg} rx="0" />
        <rect
          x="72"
          y="30"
          width="136"
          height="120"
          rx="8"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="92" y="48" width="48" height="7" rx="2" className={shared.barDark} />
        <rect x="92" y="62" width="80" height="4" rx="1" className={shared.bar} />
        <rect
          x="92"
          y="78"
          width="96"
          height="14"
          rx="3"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="92"
          y="98"
          width="96"
          height="14"
          rx="3"
          className="fill-background stroke-outline-variant/15"
          strokeWidth="0.5"
        />
        <rect
          x="92"
          y="120"
          width="96"
          height="14"
          rx="4"
          className="fill-primary/25 stroke-primary/30"
          strokeWidth="0.5"
        />
        <rect x="120" y="124" width="40" height="5" rx="2" className="fill-primary/40" />
      </svg>
    ),
    "marketing-public": (
      <svg viewBox="0 0 280 180" className="h-full w-full">
        <rect x="0" y="0" width="280" height="24" className={shared.panel} />
        <rect x="10" y="8" width="36" height="6" rx="2" className={shared.barDark} />
        <rect x="56" y="9" width="20" height="4" rx="1" className={shared.bar} />
        <rect x="82" y="9" width="20" height="4" rx="1" className={shared.bar} />
        <rect x="224" y="6" width="20" height="10" rx="3" className={shared.bar} />
        <rect x="250" y="6" width="22" height="10" rx="3" className="fill-primary/25" />
        <rect
          x="16"
          y="32"
          width="248"
          height="50"
          rx="6"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="30" y="42" width="120" height="7" rx="2" className={shared.barDark} />
        <rect x="30" y="56" width="180" height="4" rx="1" className={shared.bar} />
        <rect x="30" y="66" width="32" height="10" rx="3" className="fill-primary/25" />
        <rect x="68" y="66" width="32" height="10" rx="3" className={shared.bar} />
        <rect
          x="16"
          y="92"
          width="78"
          height="52"
          rx="4"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="26" y="102" width="40" height="5" rx="2" className={shared.barDark} />
        <rect x="26" y="114" width="58" height="4" rx="1" className={shared.bar} />
        <rect x="26" y="124" width="50" height="4" rx="1" className={shared.bar} />
        <rect
          x="102"
          y="92"
          width="78"
          height="52"
          rx="4"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="112" y="102" width="40" height="5" rx="2" className={shared.barDark} />
        <rect x="112" y="114" width="58" height="4" rx="1" className={shared.bar} />
        <rect x="112" y="124" width="50" height="4" rx="1" className={shared.bar} />
        <rect
          x="188"
          y="92"
          width="76"
          height="52"
          rx="4"
          className="fill-surface-high stroke-outline-variant/15"
          strokeWidth="1"
        />
        <rect x="198" y="102" width="40" height="5" rx="2" className={shared.barDark} />
        <rect x="198" y="114" width="56" height="4" rx="1" className={shared.bar} />
        <rect x="198" y="124" width="48" height="4" rx="1" className={shared.bar} />
        <rect x="0" y="154" width="280" height="26" className={shared.panel} />
        <rect x="16" y="164" width="30" height="4" rx="1" className={shared.bar} />
        <rect x="218" y="164" width="18" height="4" rx="1" className={shared.bar} />
        <rect x="242" y="164" width="18" height="4" rx="1" className={shared.bar} />
      </svg>
    ),
  };

  return (
    <div className="overflow-hidden rounded-md bg-surface-container/20 p-2">
      <div className="aspect-280/180">{wireframes[layoutId] ?? null}</div>
    </div>
  );
}

function LayoutGalleryPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-16 p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-lg font-semibold tracking-tight text-foreground">Layout Gallery</h1>
        <p className="mt-1 max-w-lg text-sm text-on-surface-variant">
          15 production-ready app shells built with shadcn sidebar variants. Pick a starting point
          for your next feature.
        </p>
      </div>

      {/* Legend + checklist */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pattern Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <LayoutPatternLegend />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Evaluation Checklist</CardTitle>
            <CardDescription>Use these when deciding which shell to start from.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {layoutPatternChecks.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-md bg-surface-high px-3 py-2"
              >
                <item.icon className="h-3.5 w-3.5 shrink-0 text-on-surface-variant" />
                <span className="text-xs text-foreground">{item.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      {categoryOrder.map((category) => {
        const examples = examplesByCategory[category];

        return (
          <section key={category} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-base font-semibold text-foreground">{category}</h2>
                <Badge variant="secondary">{examples.length}</Badge>
              </div>
              <p className="mt-1 text-xs text-on-surface-variant">{categoryDescriptions[category]}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {examples.map((example) => (
                <Link key={example.id} to={layoutGuidePathById[example.id]} className="group block">
                  <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
                    <div className="bg-surface-container/10 p-3 transition-colors group-hover:bg-surface-container/20">
                      <LayoutThumbnail layoutId={example.id} />
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm">{example.title}</CardTitle>
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <CardDescription className="text-xs">{example.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1">
                        {example.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
