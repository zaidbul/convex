import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  Shield,
  Sparkles,
  User,
} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/auth")({
  component: AuthPage,
});

// ============================================================================
// SOCIAL LOGIN BUTTON COMPONENT
// ============================================================================

function SocialButton({
  icon: Icon,
  label,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
}) {
  return (
    <Button variant="outline" className={cn("h-11 flex-1", className)}>
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}

// ============================================================================
// GOOGLE ICON COMPONENT
// ============================================================================

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score: 20, label: "Weak", color: "bg-destructive" };
  if (score === 2) return { score: 40, label: "Fair", color: "bg-warning" };
  if (score === 3) return { score: 60, label: "Good", color: "bg-info" };
  if (score === 4) return { score: 80, label: "Strong", color: "bg-success" };
  return { score: 100, label: "Very Strong", color: "bg-success" };
}

// ============================================================================
// PASSWORD STRENGTH INDICATOR
// ============================================================================

function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-on-surface-variant">Password strength</span>
        <span
          className={cn(
            "font-medium",
            strength.score <= 40 ? "text-destructive" : "text-success-foreground",
          )}
        >
          {strength.label}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-surface-container overflow-hidden">
        <div
          className={cn("h-full transition-all duration-300 rounded-full", strength.color)}
          style={{ width: `${strength.score}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant">
        <div className="flex items-center gap-1">
          <Check
            className={cn(
              "h-3 w-3",
              password.length >= 8 ? "text-success" : "text-on-surface-variant/50",
            )}
          />
          8+ characters
        </div>
        <div className="flex items-center gap-1">
          <Check
            className={cn(
              "h-3 w-3",
              /[A-Z]/.test(password) ? "text-success" : "text-on-surface-variant/50",
            )}
          />
          Uppercase
        </div>
        <div className="flex items-center gap-1">
          <Check
            className={cn(
              "h-3 w-3",
              /\d/.test(password) ? "text-success" : "text-on-surface-variant/50",
            )}
          />
          Number
        </div>
        <div className="flex items-center gap-1">
          <Check
            className={cn(
              "h-3 w-3",
              /[^a-zA-Z0-9]/.test(password) ? "text-success" : "text-on-surface-variant/50",
            )}
          />
          Special char
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// OTP INPUT COMPONENT
// ============================================================================

function OTPInput({
  length = 6,
  value,
  onChange,
}: {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const handleChange = (index: number, char: string) => {
    const newValue = value.split("");
    newValue[index] = char;
    onChange(newValue.join(""));

    // Auto-focus next input
    if (char && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    onChange(pastedData);
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={cn(
            "h-12 w-12 rounded-lg border border-input bg-background text-center text-lg font-semibold",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "transition-all",
          )}
        />
      ))}
    </div>
  );
}

// ============================================================================
// PATTERN 1: SPLIT LAYOUT LOGIN
// ============================================================================

function SplitLayoutLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Split Layout Login</CardTitle>
        <CardDescription>
          Classic split-screen with decorative brand panel and login form
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-high overflow-hidden">
          <div className="flex min-h-[600px]">
            {/* Left Panel - Decorative */}
            <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 lg:flex lg:flex-col lg:justify-between lg:p-8">
              {/* Decorative Elements */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-accent-500/20 blur-3xl" />

              {/* Geometric Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Content */}
              <div className="relative">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="h-6 w-6" />
                  <span className="font-serif text-xl font-semibold">Acme</span>
                </div>
              </div>

              <div className="relative max-w-md space-y-6">
                <div className="h-1 w-16 rounded-full bg-surface-lowest/30" />
                <blockquote className="space-y-4">
                  <p className="font-serif text-2xl leading-relaxed text-white">
                    "This platform has transformed how we manage our business. The intuitive design
                    makes everything effortless."
                  </p>
                  <footer className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-surface-lowest/20" />
                    <div>
                      <p className="text-sm font-medium text-white">Sarah Chen</p>
                      <p className="text-xs text-white/70">CEO, TechStart Inc.</p>
                    </div>
                  </footer>
                </blockquote>
              </div>

              <div className="relative text-sm text-white/60">
                Trusted by 10,000+ companies worldwide
              </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex w-full flex-col justify-center bg-background px-6 py-12 lg:w-1/2 lg:px-12">
              {/* Mobile Logo */}
              <div className="mb-8 flex items-center gap-2 lg:hidden">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-serif text-lg font-semibold">Acme</span>
              </div>

              <div className="mx-auto w-full max-w-sm">
                <div className="mb-8">
                  <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
                    Welcome back
                  </p>
                  <h1 className="font-serif text-3xl font-medium tracking-tight">
                    Sign in to your account
                  </h1>
                  <p className="mt-2 text-on-surface-variant">Enter your credentials to continue</p>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <SocialButton icon={GoogleIcon} label="Google" />
                    <SocialButton icon={GithubIcon} label="GitHub" />
                  </div>
                </div>

                <div className="relative my-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-on-surface-variant">
                    or continue with email
                  </span>
                </div>

                {/* Form */}
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <a href="#" className="text-sm text-on-surface-variant hover:text-foreground">
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="h-11 pl-10 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm font-normal">
                      Remember me for 30 days
                    </Label>
                  </div>

                  <Button className="h-11 w-full">Sign in</Button>
                </form>

                <p className="mt-8 text-center text-sm text-on-surface-variant">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    Create one
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PATTERN 2: SPLIT LAYOUT REGISTER
// ============================================================================

function SplitLayoutRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Split Layout Register</CardTitle>
        <CardDescription>
          Registration form with password strength indicator and terms agreement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-high overflow-hidden">
          <div className="flex min-h-[700px]">
            {/* Left Panel - Decorative (Different Style) */}
            <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-accent-500 via-accent-600 to-accent-800 lg:flex lg:flex-col lg:justify-between lg:p-8">
              {/* Abstract Shapes */}
              <div className="absolute inset-0">
                <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-surface-lowest/10" />
                <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-surface-lowest/5" />
                <div className="absolute right-20 bottom-20 h-32 w-32 rounded-full bg-brand-500/30 blur-xl" />
              </div>

              {/* Wave Pattern */}
              <div className="absolute bottom-0 left-0 right-0 h-48 opacity-20">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full">
                  <path
                    d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                    fill="currentColor"
                    className="text-white"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="relative">
                <div className="flex items-center gap-2 text-white">
                  <Shield className="h-6 w-6" />
                  <span className="font-serif text-xl font-semibold">Acme</span>
                </div>
              </div>

              <div className="relative max-w-md space-y-6">
                <h2 className="font-serif text-3xl font-medium text-white">
                  Start your journey with us
                </h2>
                <p className="text-white/80">
                  Join thousands of professionals who trust our platform for their daily workflow.
                  Get started in minutes.
                </p>
                <div className="flex items-center gap-6 pt-4">
                  {[
                    { value: "10k+", label: "Active Users" },
                    { value: "99.9%", label: "Uptime" },
                    { value: "24/7", label: "Support" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-white/60">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative" />
            </div>

            {/* Right Panel - Form */}
            <div className="flex w-full flex-col justify-center bg-background px-6 py-12 lg:w-1/2 lg:px-12">
              {/* Mobile Logo */}
              <div className="mb-8 flex items-center gap-2 lg:hidden">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-serif text-lg font-semibold">Acme</span>
              </div>

              <div className="mx-auto w-full max-w-sm">
                <div className="mb-8">
                  <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
                    Get started
                  </p>
                  <h1 className="font-serif text-3xl font-medium tracking-tight">
                    Create your account
                  </h1>
                  <p className="mt-2 text-on-surface-variant">Start building something great today</p>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <SocialButton icon={GoogleIcon} label="Google" />
                    <SocialButton icon={GithubIcon} label="GitHub" />
                  </div>
                </div>

                <div className="relative my-6">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-on-surface-variant">
                    or continue with email
                  </span>
                </div>

                {/* Form */}
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Jane Smith"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="h-11 pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <PasswordStrengthIndicator password={password} />
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-sm font-normal leading-snug">
                      I agree to the{" "}
                      <a href="#" className="underline hover:text-primary">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="underline hover:text-primary">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>

                  <Button className="h-11 w-full" disabled={!agreedToTerms}>
                    Create account
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-on-surface-variant">
                  Already have an account?{" "}
                  <a
                    href="#"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PATTERN 3: CENTERED LOGIN (MINIMAL)
// ============================================================================

function CenteredLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Centered Login (Minimal)</CardTitle>
        <CardDescription>
          Clean, minimal centered card with subtle background pattern
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-high overflow-hidden min-h-[600px] relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30">
            <div className="absolute inset-0 opacity-[0.015]">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="dots"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2" cy="2" r="1" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="relative flex min-h-[600px] items-center justify-center p-6">
            <div className="w-full max-w-md">
              {/* Logo */}
              <div className="mb-8 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-on-surface-variant mt-1">Sign in to continue to Acme</p>
              </div>

              {/* Card */}
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="centered-email">Email</Label>
                      <Input
                        id="centered-email"
                        type="email"
                        placeholder="you@example.com"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="centered-password">Password</Label>
                        <a href="#" className="text-sm text-primary hover:underline">
                          Forgot?
                        </a>
                      </div>
                      <div className="relative">
                        <Input
                          id="centered-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button className="h-11 w-full">Sign in</Button>
                  </form>

                  <div className="relative my-6">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-high px-2 text-xs text-on-surface-variant">
                      or
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-11">
                      <GoogleIcon className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <Button variant="outline" className="h-11">
                      <GithubIcon className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="justify-center bg-surface-container py-4">
                  <p className="text-sm text-on-surface-variant">
                    Don't have an account?{" "}
                    <a href="#" className="text-primary hover:underline">
                      Sign up
                    </a>
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PATTERN 4: FORGOT PASSWORD
// ============================================================================

function ForgotPasswordDemo() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>Simple centered card with success state</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-high overflow-hidden min-h-[500px] bg-gradient-to-br from-muted/30 to-background">
          <div className="flex min-h-[500px] items-center justify-center p-6">
            <div className="w-full max-w-md">
              {!isSubmitted ? (
                <Card className="shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container">
                      <KeyRound className="h-6 w-6 text-on-surface-variant" />
                    </div>
                    <CardTitle>Forgot your password?</CardTitle>
                    <CardDescription>
                      Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setIsSubmitted(true);
                      }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">Email address</Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="you@example.com"
                          className="h-11"
                        />
                      </div>
                      <Button className="h-11 w-full">Send reset link</Button>
                    </form>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to login
                    </a>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                      <Mail className="h-6 w-6 text-success" />
                    </div>
                    <CardTitle>Check your email</CardTitle>
                    <CardDescription>
                      We've sent password reset instructions to your email address.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-sm text-on-surface-variant">
                      Didn't receive the email? Check your spam folder or{" "}
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="text-primary hover:underline"
                      >
                        try again
                      </button>
                    </p>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setIsSubmitted(false)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to login
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PATTERN 5: RESET PASSWORD
// ============================================================================

function ResetPasswordDemo() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          New password form with strength indicator and confirmation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-high overflow-hidden min-h-[550px] bg-gradient-to-br from-muted/30 to-background">
          <div className="flex min-h-[550px] items-center justify-center p-6">
            <div className="w-full max-w-md">
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Set new password</CardTitle>
                  <CardDescription>
                    Your new password must be different from previously used passwords.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="h-11 pr-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <PasswordStrengthIndicator password={password} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-new-password">Confirm password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-new-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          className={cn(
                            "h-11 pr-10",
                            confirmPassword &&
                              (passwordsMatch
                                ? "border-success focus-visible:ring-success"
                                : "border-destructive focus-visible:ring-destructive"),
                          )}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {confirmPassword && !passwordsMatch && (
                        <p className="text-sm text-destructive">Passwords don't match</p>
                      )}
                      {passwordsMatch && (
                        <p className="text-sm text-success flex items-center gap-1">
                          <Check className="h-4 w-4" />
                          Passwords match
                        </p>
                      )}
                    </div>

                    <Button
                      className="h-11 w-full"
                      disabled={!passwordsMatch || password.length < 8}
                    >
                      Reset password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PATTERN 6: VERIFY EMAIL / OTP
// ============================================================================

function VerifyEmailOTP() {
  const [otpValue, setOtpValue] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const handleResend = () => {
    setResendCountdown(60);
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Email / OTP</CardTitle>
        <CardDescription>Code input with individual boxes and resend functionality</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-high overflow-hidden min-h-[500px] bg-gradient-to-br from-muted/30 to-background">
          <div className="flex min-h-[500px] items-center justify-center p-6">
            <div className="w-full max-w-md">
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Verify your email</CardTitle>
                  <CardDescription>
                    We've sent a 6-digit verification code to{" "}
                    <span className="font-medium text-foreground">j***@example.com</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* OTP Input */}
                  <OTPInput length={6} value={otpValue} onChange={setOtpValue} />

                  <Button className="h-11 w-full" disabled={otpValue.length !== 6}>
                    Verify email
                  </Button>

                  {/* Resend */}
                  <div className="text-center">
                    <p className="text-sm text-on-surface-variant">
                      Didn't receive the code?{" "}
                      {resendCountdown > 0 ? (
                        <span className="text-foreground">Resend in {resendCountdown}s</span>
                      ) : (
                        <button
                          onClick={handleResend}
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Resend code
                        </button>
                      )}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4 bg-surface-container py-4">
                  <p className="text-sm text-on-surface-variant text-center">
                    Having trouble?{" "}
                    <a href="#" className="text-primary hover:underline">
                      Contact support
                    </a>
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function AuthPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-high/80 backdrop-blur-[20px] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/style-guide"
              className="flex items-center gap-2 text-on-surface-variant hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Style Guide</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight">Authentication Patterns</h1>
              <p className="text-on-surface-variant text-sm">
                Login, registration, and account recovery patterns
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto py-8 px-6 space-y-16">
        <SplitLayoutLogin />
        <SplitLayoutRegister />
        <CenteredLogin />
        <ForgotPasswordDemo />
        <ResetPasswordDemo />
        <VerifyEmailOTP />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
