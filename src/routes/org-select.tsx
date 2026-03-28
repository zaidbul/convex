import { useState } from "react"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { auth } from "@clerk/tanstack-react-start/server"
import {
  useUser,
  useOrganizationList,
  useClerk,
} from "@clerk/tanstack-react-start"
import { Plus, LogOut, Building2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"

const fetchAuthForOrgSelect = createServerFn({ method: "GET" }).handler(
  async () => {
    const { userId, orgSlug } = await auth()
    return { userId: userId ?? null, orgSlug: orgSlug ?? null }
  }
)

export const Route = createFileRoute("/org-select")({
  beforeLoad: async () => {
    const authState = await fetchAuthForOrgSelect()
    if (!authState.userId) {
      throw redirect({ to: "/sign-in" })
    }
    if (authState.orgSlug) {
      throw redirect({
        to: "/$slug/tickets",
        params: { slug: authState.orgSlug },
      })
    }
  },
  component: OrgSelectPage,
})

function OrgSelectPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { signOut } = useClerk()
  const { isLoaded, userMemberships, setActive, createOrganization } =
    useOrganizationList({
      userMemberships: { infinite: true },
    })

  const [showCreate, setShowCreate] = useState(false)
  const [newOrgName, setNewOrgName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isSwitching, setSwitching] = useState<string | null>(null)

  async function handleSelectOrg(orgId: string, orgSlug: string | null) {
    setSwitching(orgId)
    try {
      await setActive?.({ organization: orgId })
      if (orgSlug) {
        navigate({ to: "/$slug/tickets", params: { slug: orgSlug } })
      }
    } finally {
      setSwitching(null)
    }
  }

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault()
    if (!newOrgName.trim()) return
    setIsCreating(true)
    try {
      const org = await createOrganization?.({ name: newOrgName.trim() })
      if (org) {
        await setActive?.({ organization: org.id })
        navigate({
          to: "/$slug/tickets",
          params: { slug: org.slug! },
        })
      }
    } finally {
      setIsCreating(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate({ to: "/sign-in" })
  }

  const memberships = userMemberships?.data ?? []

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <img
            src="/logos/SVG/full_logo.svg"
            alt="Convex"
            className="h-7 dark:hidden"
          />
          <img
            src="/logos/SVG/full_logo_dark.svg"
            alt="Convex"
            className="hidden h-7 dark:block"
          />
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Select a workspace
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a workspace to continue
            {user?.firstName ? `, ${user.firstName}` : ""}
          </p>
        </div>

        {/* Workspace list */}
        <div className="space-y-2">
          {!isLoaded ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-5 text-muted-foreground" />
            </div>
          ) : memberships.length === 0 && !showCreate ? (
            <div className="rounded-xl bg-surface-low px-5 py-8 text-center">
              <Building2
                className="mx-auto mb-3 size-8 text-muted-foreground"
                strokeWidth={1.5}
              />
              <p className="text-sm font-medium text-foreground">
                No workspaces yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create one to get started
              </p>
              <Button
                className="mt-4"
                size="sm"
                onClick={() => setShowCreate(true)}
              >
                <Plus className="size-4" data-icon="inline-start" />
                Create workspace
              </Button>
            </div>
          ) : (
            <>
              {memberships.map((membership) => {
                const org = membership.organization
                const isSelecting = isSwitching === org.id
                return (
                  <button
                    key={org.id}
                    onClick={() => handleSelectOrg(org.id, org.slug)}
                    disabled={isSelecting}
                    className="group flex w-full items-center gap-3 rounded-xl bg-surface-low px-4 py-3 text-left transition-colors hover:bg-surface-high disabled:opacity-70"
                  >
                    <Avatar size="sm">
                      <AvatarImage src={org.imageUrl} alt={org.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                        {org.name[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {org.name}
                      </span>
                      {org.membersCount != null && (
                        <span className="text-xs text-muted-foreground">
                          {org.membersCount}{" "}
                          {org.membersCount === 1 ? "member" : "members"}
                        </span>
                      )}
                    </div>
                    {isSelecting ? (
                      <Spinner className="size-4 text-muted-foreground" />
                    ) : (
                      <ArrowRight
                        className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        strokeWidth={1.5}
                      />
                    )}
                  </button>
                )
              })}
            </>
          )}
        </div>

        {/* Create workspace form */}
        {showCreate ? (
          <form onSubmit={handleCreateOrg} className="mt-4 space-y-3">
            <Input
              placeholder="Workspace name"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              autoFocus
              disabled={isCreating}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setShowCreate(false)
                  setNewOrgName("")
                }}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="flex-1"
                disabled={isCreating || !newOrgName.trim()}
              >
                {isCreating ? (
                  <Spinner className="size-4" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        ) : (
          isLoaded &&
          memberships.length > 0 && (
            <button
              onClick={() => setShowCreate(true)}
              className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-surface-low hover:text-foreground"
            >
              <span className="flex size-6 items-center justify-center rounded-md bg-muted">
                <Plus className="size-3.5" strokeWidth={1.5} />
              </span>
              Create new workspace
            </button>
          )
        )}

        {/* Footer — user info + sign out */}
        <div className="mt-10 flex items-center justify-between">
          {user && (
            <div className="flex items-center gap-2 min-w-0">
              <Avatar size="sm">
                <AvatarImage
                  src={user.imageUrl}
                  alt={user.fullName ?? ""}
                />
                <AvatarFallback className="text-[10px]">
                  {(user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-xs text-muted-foreground">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="xs"
            className="text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="size-3" strokeWidth={1.5} />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
