import { createFileRoute } from "@tanstack/react-router"
import { AuthenticateWithRedirectCallback } from "@clerk/tanstack-react-start"

export const Route = createFileRoute("/sign-in/$")({
  component: SSOCallback,
})

function SSOCallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/org-select"
        signUpFallbackRedirectUrl="/org-select"
      />
    </div>
  )
}
