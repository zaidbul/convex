import React from "react"
import {
  createFileRoute,
  redirect,
  Link,
} from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { auth } from "@clerk/tanstack-react-start/server"
import { useSignUp } from "@clerk/tanstack-react-start"
import { useForm } from "@tanstack/react-form"
import { ChevronLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { hardNavigate } from "@/lib/auth-routing"

const fetchAuthForRedirect = createServerFn({ method: "GET" }).handler(
  async () => {
    const { userId, orgSlug } = await auth()
    return { userId: userId ?? null, orgSlug: orgSlug ?? null }
  }
)

export const Route = createFileRoute("/sign-up")({
  beforeLoad: async () => {
    const authState = await fetchAuthForRedirect()
    if (authState.userId && authState.orgSlug) {
      throw redirect({
        to: "/$slug/tickets/dashboard",
        params: { slug: authState.orgSlug },
        search: {},
      })
    }
    if (authState.userId) {
      throw redirect({ to: "/org-select", search: { intent: undefined } })
    }
  },
  component: SignUpPage,
})

type AuthMethod = "google" | "email"

export function SignUpPage() {
  const { signUp, errors } = useSignUp()
  const [clerkError, setClerkError] = React.useState<string | null>(null)
  const [step, setStep] = React.useState<"email" | "password" | "verifying">(
    "email"
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [verificationCode, setVerificationCode] = React.useState("")
  const [lastUsedMethod, setLastUsedMethod] =
    React.useState<AuthMethod | null>(null)

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(
        "lastUsedAuthMethod"
      ) as AuthMethod | null
      if (stored) setLastUsedMethod(stored)
    }
  }, [])

  // Surface Clerk signal errors
  React.useEffect(() => {
    if (errors?.global) {
      setClerkError(
        errors.global[0]?.longMessage ||
          errors.global[0]?.message ||
          "Something went wrong."
      )
    }
  }, [errors])

  const saveLastUsedMethod = (method: AuthMethod) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lastUsedAuthMethod", method)
    }
  }

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async (data) => {
      setClerkError(null)

      if (step === "email") {
        const email = data.value.email.trim()
        if (!email) {
          setClerkError("Please enter your email address")
          return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setClerkError("Please enter a valid email address")
          return
        }
        setStep("password")
        return
      }

      if (step === "password") {
        const password = data.value.password
        if (!password || password.length < 8) {
          setClerkError("Password must be at least 8 characters long")
          return
        }

        setIsSubmitting(true)
        try {
          const { error } = await signUp.password({
            emailAddress: data.value.email,
            password,
          })

          if (error) {
            setClerkError(
              error.longMessage ||
                error.message ||
                "Something went wrong. Please try again."
            )
            return
          }

          // Check if email verification is required
          if (
            signUp.status === "missing_requirements" &&
            signUp.unverifiedFields?.includes("email_address")
          ) {
            const sendResult =
              await signUp.verifications.sendEmailCode()
            if (sendResult.error) {
              setClerkError(
                sendResult.error.longMessage ||
                  sendResult.error.message ||
                  "Failed to send verification code."
              )
              return
            }
            setStep("verifying")
            return
          }

          if (signUp.status === "complete") {
            saveLastUsedMethod("email")
            await signUp.finalize()
            hardNavigate("/org-select")
            return
          }

          setClerkError("Failed to create account.")
        } catch (err: unknown) {
          const e = err as { errors?: { long_message?: string }[]; message?: string }
          setClerkError(
            e.errors?.[0]?.long_message ||
              e.message ||
              "Something went wrong. Please try again."
          )
        } finally {
          setIsSubmitting(false)
        }
        return
      }

      if (step === "verifying") {
        if (!verificationCode || verificationCode.length < 6) {
          setClerkError("Please enter the 6-digit verification code")
          return
        }

        setIsSubmitting(true)
        try {
          const { error } =
            await signUp.verifications.verifyEmailCode({
              code: verificationCode,
            })

          if (error) {
            setClerkError(
              error.longMessage ||
                error.message ||
                "Invalid verification code."
            )
            return
          }

          if (signUp.status === "complete") {
            saveLastUsedMethod("email")
            await signUp.finalize()
            hardNavigate("/org-select")
            return
          }

          setClerkError("Verification failed. Please try again.")
        } catch (err: any) {
          setClerkError(
            err.message || "Invalid verification code. Please try again."
          )
        } finally {
          setIsSubmitting(false)
        }
      }
    },
  })

  const handleGoogleSignUp = async () => {
    setClerkError(null)
    saveLastUsedMethod("google")

    try {
      const { error } = await signUp.sso({
        strategy: "oauth_google",
        redirectUrl: "/sign-in/sso-callback",
        redirectCallbackUrl: "/org-select",
      })
      if (error) {
        setClerkError(
          error.longMessage ||
            error.message ||
            "Something went wrong. Please try again."
        )
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again."
      setClerkError(message)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Left Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground font-display">
              Create your account
            </h1>
          </div>

          {clerkError && (
            <div className="bg-destructive/10 rounded-xl p-3 mb-6">
              <p className="text-destructive text-sm">{clerkError}</p>
            </div>
          )}

          {/* Google OAuth — shown only on email step */}
          {step === "email" && (
            <>
              <div className="w-full">
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full h-11 ${lastUsedMethod === "google" ? "border-primary" : ""}`}
                    onClick={handleGoogleSignUp}
                  >
                    <svg
                      className="mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 600 600"
                    >
                      <path
                        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                        fill="#4285f4"
                      />
                      <path
                        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                        fill="#34a853"
                      />
                      <path
                        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                        fill="#fbbc04"
                      />
                      <path
                        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                        fill="#ea4335"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                  {lastUsedMethod === "google" && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      Last used
                    </span>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-6 w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-4 text-muted-foreground uppercase text-xs">
                    or
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Email/Password Form */}
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="w-full"
          >
            {step === "email" && (
              <div className="space-y-4">
                <form.Field name="email">
                  {(field) => (
                    <div className="w-full">
                      <Label className="mb-2">
                        Email
                      </Label>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={field.state.value}
                        className="h-11"
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoFocus
                      />
                    </div>
                  )}
                </form.Field>

                <Button type="submit" className="w-full h-11">
                  Continue
                </Button>
              </div>
            )}

            {step === "password" && (
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1 px-0 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setStep("email")
                    setClerkError(null)
                  }}
                >
                  <ChevronLeft className="size-4" />
                  {form.state.values.email}
                </Button>

                <form.Field name="password">
                  {(field) => (
                    <div className="w-full">
                      <Label className="mb-2">
                        Password
                      </Label>
                      <Input
                        type="password"
                        placeholder="Password (min 8 characters)"
                        value={field.state.value}
                        className="h-11"
                        onChange={(e) => field.handleChange(e.target.value)}
                        autoFocus
                      />
                    </div>
                  )}
                </form.Field>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </div>
            )}

            {step === "verifying" && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    We've sent a verification code to
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {form.state.values.email}
                  </p>
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Verification code
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    className="h-11 text-center tracking-widest"
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    autoFocus
                    maxLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11"
                >
                  {isSubmitting ? "Verifying..." : "Verify email"}
                </Button>

                <Button
                  type="button"
                  variant="link"
                  className="w-full text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setStep("email")
                    setClerkError(null)
                    setVerificationCode("")
                  }}
                >
                  Use a different email
                </Button>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="text-foreground underline hover:no-underline font-medium"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel — Branding */}
      <div className="flex-1 relative overflow-hidden bg-surface-low hidden lg:block">
        <div className="flex flex-col items-center justify-center h-full p-12">
          <img
            src="/logos/SVG/icon_dark.svg"
            alt="cnvx"
            className="w-32 h-32 mb-6 dark:hidden"
          />
          <img
            src="/logos/SVG/icon_light.svg"
            alt="cnvx"
            className="w-32 h-32 mb-6 hidden dark:block"
          />
          <h2 className="text-2xl font-bold text-foreground font-display">
            cnvx
          </h2>
        </div>
      </div>
    </div>
  )
}
