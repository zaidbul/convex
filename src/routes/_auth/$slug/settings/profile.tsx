import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { demoUser } from "@/lib/demo"

export const Route = createFileRoute("/_auth/$slug/settings/profile")({
  component: ProfileSettingsPage,
})

function ProfileSettingsPage() {
  const user = demoUser
  const { theme, setTheme } = useTheme()

  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [isSaving, setIsSaving] = useState(false)

  const isDirty =
    firstName.trim() !== user.firstName ||
    lastName.trim() !== user.lastName

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Demo mode: simulate save
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const initials =
    (firstName?.[0] ?? "") +
    (lastName?.[0] ?? "")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal account settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>
            Your name and email displayed across the app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src={user.imageUrl ?? undefined} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {user.fullName}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.primaryEmailAddress.emailAddress}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-sm text-muted-foreground">
              {user.primaryEmailAddress.emailAddress}
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Choose how the app looks for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(["light", "dark", "system"] as const).map((value) => (
              <Button
                key={value}
                variant={theme === value ? "secondary" : "outline"}
                size="sm"
                onClick={() => setTheme(value)}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
