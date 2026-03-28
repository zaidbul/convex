export type LayoutCategory = "Sidebar" | "Hybrid" | "Workspace" | "Specialized";

export type LayoutExampleDefinition = {
  id: string;
  title: string;
  summary: string;
  category: LayoutCategory;
  tags: readonly string[];
};

export const layoutExamples = [
  {
    id: "sidebar-left-icon",
    title: "Left Sidebar (Icon Collapse)",
    summary: "Standard dashboard shell with left sidebar that collapses to icon rail.",
    category: "Sidebar",
    tags: ["left", "sidebar", "icon-collapse"],
  },
  {
    id: "sidebar-left-offcanvas",
    title: "Left Sidebar (Offcanvas)",
    summary: "Sidebar can hide fully and slide back in when toggled.",
    category: "Sidebar",
    tags: ["left", "sidebar", "offcanvas"],
  },
  {
    id: "sidebar-left-floating-icon",
    title: "Floating Sidebar",
    summary: "Floating visual style with icon-collapse behavior.",
    category: "Sidebar",
    tags: ["left", "floating", "icon-collapse"],
  },
  {
    id: "sidebar-left-inset",
    title: "Inset Sidebar",
    summary: "Inset layout where content panel appears framed from the app background.",
    category: "Sidebar",
    tags: ["left", "inset", "dashboard"],
  },
  {
    id: "sidebar-right",
    title: "Right Sidebar",
    summary: "Navigation or tools move to the right side for alternate information flow.",
    category: "Sidebar",
    tags: ["right", "sidebar", "tools"],
  },
  {
    id: "sidebar-non-collapsible",
    title: "Fixed Sidebar",
    summary: "Permanent left sidebar for apps that require persistent nav visibility.",
    category: "Sidebar",
    tags: ["left", "fixed", "always-open"],
  },
  {
    id: "topnav-left-sidebar",
    title: "Top Nav + Sidebar",
    summary: "Two-level shell with global top navigation and workspace sidebar.",
    category: "Hybrid",
    tags: ["topnav", "sidebar", "hybrid"],
  },
  {
    id: "topnav-only",
    title: "Top Navigation Only",
    summary: "Simple app shell for products that avoid persistent side navigation.",
    category: "Hybrid",
    tags: ["topnav", "minimal", "content-first"],
  },
  {
    id: "leftnav-right-panel",
    title: "Left Nav + Right Context Panel",
    summary: "Main workspace with contextual inspector or metadata rail on the right.",
    category: "Workspace",
    tags: ["left-nav", "right-panel", "context"],
  },
  {
    id: "master-detail",
    title: "Master Detail",
    summary: "List/detail split for inboxes, tickets, and record browsing.",
    category: "Workspace",
    tags: ["split", "list", "detail"],
  },
  {
    id: "three-column-workspace",
    title: "Three Column Workspace",
    summary: "Navigation, intermediate list, and focused detail pane in one shell.",
    category: "Workspace",
    tags: ["three-column", "workspace", "ops"],
  },
  {
    id: "settings-sidebar",
    title: "Settings Sections",
    summary: "Settings IA with category list on left and forms on the right.",
    category: "Specialized",
    tags: ["settings", "forms", "sections"],
  },
  {
    id: "data-table-layout",
    title: "Data Table Workspace",
    summary: "Header + filters toolbar + large table region for data-heavy tools.",
    category: "Specialized",
    tags: ["table", "filters", "data"],
  },
  {
    id: "auth-minimal",
    title: "Auth Minimal",
    summary: "No app chrome, centered auth or onboarding card.",
    category: "Specialized",
    tags: ["auth", "minimal", "focused"],
  },
  {
    id: "marketing-public",
    title: "Public Marketing Shell",
    summary: "Header, hero/content flow, and footer for unauthenticated pages.",
    category: "Specialized",
    tags: ["marketing", "public", "landing"],
  },
] as const satisfies readonly LayoutExampleDefinition[];

export type LayoutExampleId = (typeof layoutExamples)[number]["id"];

const layoutExampleIdSet = new Set<string>(layoutExamples.map((layout) => layout.id));

export function isLayoutExampleId(value: string): value is LayoutExampleId {
  return layoutExampleIdSet.has(value);
}
