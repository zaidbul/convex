import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateWorkspaceNameMutation } from "@/query/mutations/settings"
import { workspaceQueryOptions } from "@/query/options/tickets"

export const Route = createFileRoute("/_auth/$slug/settings/general")({
  component: GeneralSettingsPage,
})

function GeneralSettingsPage() {
  const { slug } = Route.useParams()
  const { data: workspace } = useSuspenseQuery(workspaceQueryOptions())
  const updateName = useUpdateWorkspaceNameMutation()

  const [name, setName] = useState(workspace?.name ?? "")
  const isDirty = name.trim() !== (workspace?.name ?? "")

  const handleSave = async () => {
    if (!name.trim()) return

    try {
      await updateName.mutateAsync({ name: name.trim() })
      toast.success("Workspace name updated")
    } catch {
      toast.error("Failed to update workspace name")
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">General</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your workspace settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>
            Your workspace name is visible to all members.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Name</Label>
            <Input
              id="workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Workspace name"
              className="max-w-sm rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label>Slug</Label>
            <p className="text-sm text-muted-foreground">/{slug}</p>
          </div>

          <Button
            onClick={handleSave}
            disabled={!isDirty || !name.trim() || updateName.isPending}
          >
            {updateName.isPending ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
