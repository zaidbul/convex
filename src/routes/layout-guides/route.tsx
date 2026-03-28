import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/layout-guides")({
  component: LayoutGuidesRoute,
});

function LayoutGuidesRoute() {
  return <Outlet />;
}
