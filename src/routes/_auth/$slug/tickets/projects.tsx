import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { FolderKanban } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { projectsQueryOptions } from "@/query/options/tickets"
import type { ProjectStatus } from "@/components/tickets/types"

export const Route = createFileRoute("/_auth/$slug/tickets/projects")({
  component: ProjectsPage,
})

const statusConfig: Record<
  ProjectStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  planned: { label: "Planned", variant: "outline" },
  active: { label: "Active", variant: "default" },
  paused: { label: "Paused", variant: "secondary" },
  completed: { label: "Completed", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

function ProjectsPage() {
  const { data: projects } = useSuspenseQuery(projectsQueryOptions())

  return (
    <div className="flex h-screen flex-col bg-surface-low">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-outline-variant/15 bg-surface-low px-4 py-2.5">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-display text-sm font-medium tracking-tight text-on-surface">
          Projects
        </h1>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6">
          <Empty className="max-w-xl border-outline-variant/30 bg-surface px-8 py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderKanban />
              </EmptyMedia>
              <EmptyTitle>No projects yet</EmptyTitle>
              <EmptyDescription>
                Projects help you group and track related issues across your
                workspace.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-3xl space-y-2">
            {projects.map((project) => {
              const config = statusConfig[project.status]
              return (
                <div
                  key={project.id}
                  className="flex items-start gap-3 rounded-lg border border-outline-variant/20 bg-surface px-4 py-3"
                >
                  <FolderKanban className="mt-0.5 size-4 shrink-0 text-on-surface-variant" strokeWidth={1.5} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-on-surface">
                        {project.name}
                      </span>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>
                    {project.description && (
                      <p className="mt-0.5 truncate text-xs text-on-surface-variant">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
