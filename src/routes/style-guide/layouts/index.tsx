import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/style-guide/layouts/")({
  beforeLoad: () => {
    throw redirect({ to: "/layout-guides" });
  },
});
