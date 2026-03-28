import { createFileRoute, redirect } from "@tanstack/react-router";

import { isLayoutExampleId } from "@/components/layout-examples/layout-catalog";

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
} as const;

export const Route = createFileRoute("/style-guide/layouts/$layoutId")({
  beforeLoad: ({ params }) => {
    const to = isLayoutExampleId(params.layoutId)
      ? layoutGuidePathById[params.layoutId]
      : "/layout-guides";

    throw redirect({ to });
  },
});
