export function slugifyWorkspaceName(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "workspace"
  )
}

export function getOrganizationSlug(organization: {
  slug?: string | null
  name?: string | null
}): string {
  return organization.slug ?? slugifyWorkspaceName(organization.name ?? "workspace")
}

export function getOrganizationDashboardPath(slug: string): string {
  return `/${slug}/tickets/dashboard`
}

export function getDefaultWorkspaceName(user?: {
  fullName?: string | null
  firstName?: string | null
  lastName?: string | null
  primaryEmailAddress?: {
    emailAddress?: string | null
  } | null
} | null): string {
  const fullName = user?.fullName?.trim()
  if (fullName) {
    return fullName
  }

  const fallbackName = [user?.firstName, user?.lastName]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(" ")
    .trim()
  if (fallbackName) {
    return fallbackName
  }

  const emailPrefix = user?.primaryEmailAddress?.emailAddress?.split("@")[0]?.trim()
  if (emailPrefix) {
    return emailPrefix
  }

  return "My Workspace"
}

export function hardNavigate(url: string) {
  if (typeof window !== "undefined") {
    window.location.assign(url)
  }
}
