import { createFileRoute } from "@tanstack/react-router";
import { PreviewPanel } from "@/components/preview";

export const Route = createFileRoute("/preview")({
  component: PreviewPage,
});

function PreviewPage() {
  return <PreviewPanel />;
}
