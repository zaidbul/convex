import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Gift,
  Lightbulb,
  PartyPopper,
  Rocket,
  Settings,
  Sparkles,
  Star,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/onboarding")({
  component: OnboardingPage,
});

// ============================================================================
// PATTERN 1: Welcome Screen with Hero and CTA
// ============================================================================

function WelcomeScreen() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Screen</CardTitle>
        <CardDescription>Hero welcome with compelling CTA for first-time users</CardDescription>
      </CardHeader>
      <CardContent>
        {showWelcome ? (
          <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8">
            {/* Decorative elements */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative space-y-6 text-center">
              {/* Icon */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <Rocket className="h-10 w-10 text-primary" />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold tracking-tight">Welcome to Acme Platform</h2>
                <p className="mx-auto max-w-md text-on-surface-variant">
                  Get started in minutes. We'll help you set up your workspace and discover powerful
                  features to boost your productivity.
                </p>
              </div>

              {/* Features preview */}
              <div className="mx-auto grid max-w-lg grid-cols-3 gap-4 pt-4">
                {[
                  { icon: Zap, label: "Fast Setup" },
                  { icon: Users, label: "Team Ready" },
                  { icon: Target, label: "Goal Tracking" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-lg bg-background/50 p-3"
                  >
                    <Icon className="h-5 w-5 text-on-surface-variant" />
                    <span className="text-xs font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row sm:justify-center">
                <Button size="lg" onClick={() => setShowWelcome(false)}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost" size="lg" onClick={() => setShowWelcome(false)}>
                  Skip for now
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="mb-4 h-12 w-12 text-success" />
            <p className="text-on-surface-variant">Welcome screen dismissed</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setShowWelcome(true)}
            >
              Show Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PATTERN 2: Feature Tour (Step-by-Step Highlights)
// ============================================================================

const tourSteps = [
  {
    id: 1,
    title: "Dashboard Overview",
    description:
      "Your central hub for all activities. View key metrics, recent updates, and quick actions at a glance.",
    icon: Target,
    position: "top-left",
  },
  {
    id: 2,
    title: "Team Collaboration",
    description:
      "Invite team members, assign tasks, and communicate seamlessly. Real-time updates keep everyone in sync.",
    icon: Users,
    position: "top-right",
  },
  {
    id: 3,
    title: "Smart Notifications",
    description:
      "Stay informed with intelligent alerts. Customize what you see and when you see it.",
    icon: Bell,
    position: "bottom-left",
  },
  {
    id: 4,
    title: "Powerful Settings",
    description:
      "Personalize your experience. From themes to integrations, make the platform truly yours.",
    icon: Settings,
    position: "bottom-right",
  },
];

function FeatureTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const step = tourSteps[currentStep];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Tour</CardTitle>
        <CardDescription>Step-by-step highlight tour for new features</CardDescription>
      </CardHeader>
      <CardContent>
        {isActive ? (
          <div className="relative">
            {/* Mock UI with highlight spots */}
            <div className="relative grid grid-cols-2 gap-4 rounded-md bg-surface-container p-6">
              {tourSteps.map((tourStep, index) => {
                const Icon = tourStep.icon;
                const isHighlighted = currentStep === index;

                return (
                  <div
                    key={tourStep.id}
                    className={cn(
                      "relative rounded-md bg-background p-4 transition-all",
                      isHighlighted && "ring-2 ring-primary ring-offset-2",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          isHighlighted ? "bg-primary text-primary-foreground" : "bg-surface-container",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tourStep.title}</p>
                        <p className="text-xs text-on-surface-variant">Feature {index + 1}</p>
                      </div>
                    </div>

                    {/* Pulse indicator */}
                    {isHighlighted && (
                      <div className="absolute -right-1 -top-1">
                        <span className="relative flex h-3 w-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tour tooltip */}
            <div className="mt-4 rounded-md bg-surface-high p-4 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  {step && <step.icon className="h-6 w-6 text-primary" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{step?.title}</h4>
                    <Badge variant="secondary">
                      {currentStep + 1} of {tourSteps.length}
                    </Badge>
                  </div>
                  <p className="text-sm text-on-surface-variant">{step?.description}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-4 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => setIsActive(false)}>
                  Skip Tour
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (currentStep === tourSteps.length - 1) {
                        setIsActive(false);
                      } else {
                        setCurrentStep((s) => s + 1);
                      }
                    }}
                  >
                    {currentStep === tourSteps.length - 1 ? (
                      <>
                        Finish
                        <Check className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="mb-4 h-12 w-12 text-success" />
            <p className="text-on-surface-variant">Tour completed!</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setCurrentStep(0);
                setIsActive(true);
              }}
            >
              Restart Tour
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PATTERN 3: Setup Checklist with Completion Tracking
// ============================================================================

const checklistItems = [
  {
    id: "profile",
    title: "Complete your profile",
    description: "Add your name, photo, and bio",
    icon: Users,
    time: "2 min",
  },
  {
    id: "team",
    title: "Invite team members",
    description: "Collaborate with your colleagues",
    icon: Users,
    time: "3 min",
  },
  {
    id: "project",
    title: "Create your first project",
    description: "Start organizing your work",
    icon: Target,
    time: "5 min",
  },
  {
    id: "notifications",
    title: "Set up notifications",
    description: "Choose how you want to be notified",
    icon: Bell,
    time: "1 min",
  },
  {
    id: "integrations",
    title: "Connect integrations",
    description: "Link your favorite tools",
    icon: Zap,
    time: "4 min",
  },
];

function SetupChecklist() {
  const [completed, setCompleted] = useState<Set<string>>(new Set(["profile"]));

  const toggleItem = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const completedCount = completed.size;
  const totalCount = checklistItems.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup Checklist</CardTitle>
        <CardDescription>Track onboarding progress with actionable items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress header */}
        <div className="rounded-md bg-surface-container p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium">Getting Started</p>
              <p className="text-sm text-on-surface-variant">
                {completedCount} of {totalCount} tasks completed
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{Math.round(progress)}%</p>
              <p className="text-xs text-on-surface-variant">Complete</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Checklist items */}
        <div className="space-y-2">
          {checklistItems.map((item) => {
            const Icon = item.icon;
            const isComplete = completed.has(item.id);

            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  "flex w-full items-center gap-4 rounded-md bg-surface-high p-4 text-left transition-all hover:bg-surface-container",
                  isComplete && "border-success/30 bg-success/5",
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
                    isComplete
                      ? "border-success bg-success text-success-foreground"
                      : "border-muted-foreground/30",
                  )}
                >
                  {isComplete && <Check className="h-3.5 w-3.5" />}
                </div>

                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    isComplete ? "bg-success/10" : "bg-surface-container",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isComplete ? "text-success-foreground" : "text-on-surface-variant",
                    )}
                  />
                </div>

                <div className="flex-1">
                  <p
                    className={cn(
                      "font-medium",
                      isComplete && "text-on-surface-variant line-through",
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="text-sm text-on-surface-variant">{item.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {item.time}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-on-surface-variant" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Completion message */}
        {progress === 100 && (
          <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/5 p-4">
            <PartyPopper className="h-5 w-5 text-success-foreground" />
            <div>
              <p className="font-medium text-success-foreground">All done! You're all set.</p>
              <p className="text-sm text-on-surface-variant">You've completed all setup tasks.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PATTERN 4: Progress Indicator for Multi-Step Onboarding
// ============================================================================

const onboardingSteps = [
  { id: 1, title: "Account", description: "Create your account" },
  { id: 2, title: "Workspace", description: "Set up workspace" },
  { id: 3, title: "Team", description: "Invite members" },
  { id: 4, title: "Preferences", description: "Customize settings" },
  { id: 5, title: "Complete", description: "Ready to go!" },
];

function ProgressIndicator() {
  const [currentStep, setCurrentStep] = useState(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Indicator</CardTitle>
        <CardDescription>Visual progress for multi-step onboarding flows</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Style 1: Horizontal Steps */}
        <div>
          <h4 className="text-sm font-medium mb-4">Horizontal Steps</h4>
          <div className="flex items-center justify-between">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                      currentStep > step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : currentStep === step.id
                          ? "border-primary text-primary"
                          : "border-muted text-on-surface-variant",
                    )}
                  >
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-xs font-medium",
                      currentStep >= step.id ? "text-foreground" : "text-on-surface-variant",
                    )}
                  >
                    {step.title}
                  </p>
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div
                    className={cn(
                      "mx-4 h-0.5 flex-1 transition-colors",
                      currentStep > step.id ? "bg-primary" : "bg-surface-container",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Style 2: Compact Progress Bar */}
        <div>
          <h4 className="text-sm font-medium mb-4">Compact Progress</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                Step {currentStep} of {onboardingSteps.length}:{" "}
                {onboardingSteps[currentStep - 1]?.title}
              </span>
              <span className="text-on-surface-variant">
                {Math.round(((currentStep - 1) / (onboardingSteps.length - 1)) * 100)}% complete
              </span>
            </div>
            <Progress
              value={((currentStep - 1) / (onboardingSteps.length - 1)) * 100}
              className="h-2"
            />
          </div>
        </div>

        <Separator />

        {/* Style 3: Dots Indicator */}
        <div>
          <h4 className="text-sm font-medium mb-4">Dots Indicator</h4>
          <div className="flex items-center justify-center gap-2">
            {onboardingSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  currentStep === step.id
                    ? "w-6 bg-primary"
                    : currentStep > step.id
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-surface-container",
                )}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Style 4: Segments */}
        <div>
          <h4 className="text-sm font-medium mb-4">Segmented Progress</h4>
          <div className="flex gap-1">
            {onboardingSteps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  currentStep >= step.id ? "bg-primary" : "bg-surface-container",
                )}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            size="sm"
            onClick={() => setCurrentStep((s) => Math.min(onboardingSteps.length, s + 1))}
            disabled={currentStep === onboardingSteps.length}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PATTERN 5: Skip Option with Confirmation
// ============================================================================

function SkipOption() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const handleSkip = () => {
    setSkipped(true);
    setShowConfirm(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skip Option</CardTitle>
        <CardDescription>Allow users to skip onboarding with a gentle confirmation</CardDescription>
      </CardHeader>
      <CardContent>
        {!skipped ? (
          <div className="rounded-md bg-surface-container p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-semibold">Quick Setup Guide</h4>
                  <p className="text-sm text-on-surface-variant">
                    We recommend completing the setup to get the most out of the platform. It only
                    takes about 5 minutes.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm">
                    Start Setup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowConfirm(true)}>
                    Skip for now
                  </Button>
                </div>
              </div>
            </div>

            {/* Skip Confirmation Dialog */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Skip Setup?</DialogTitle>
                  <DialogDescription>
                    You can always complete the setup later from your settings. However, some
                    features may be limited until you finish.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-4">
                  <p className="text-sm font-medium">You'll miss out on:</p>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    {[
                      "Personalized dashboard experience",
                      "Team collaboration features",
                      "Smart notification preferences",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <X className="h-4 w-4 text-destructive" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowConfirm(false)}>
                    Continue Setup
                  </Button>
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip Anyway
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-surface-container p-3 mb-4">
              <Check className="h-6 w-6 text-on-surface-variant" />
            </div>
            <p className="text-on-surface-variant">Setup skipped</p>
            <p className="text-xs text-on-surface-variant mt-1">
              You can complete setup anytime from Settings
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setSkipped(false)}>
              Show Skip Dialog
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PATTERN 6: Completion Celebration with Animation
// ============================================================================

function CompletionCelebration() {
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<
    Array<{
      id: number;
      x: number;
      delay: number;
      duration: number;
      color: string;
    }>
  >([]);

  const triggerCelebration = () => {
    // Generate confetti pieces
    const colors = ["bg-primary", "bg-success", "bg-warning", "bg-info", "bg-accent-500"];
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfettiPieces(pieces);
    setShowCelebration(true);

    // Clear confetti after animation
    setTimeout(() => {
      setConfettiPieces([]);
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Celebration</CardTitle>
        <CardDescription>Reward users with delightful animations upon completion</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-success/5 via-background to-primary/5 p-8">
          {/* Confetti */}
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className={cn("absolute h-2 w-2 rounded-full", piece.color)}
              style={{
                left: `${piece.x}%`,
                top: "-10px",
                animation: `fall ${piece.duration}s ease-out ${piece.delay}s forwards`,
              }}
            />
          ))}

          {showCelebration ? (
            <div className="relative space-y-6 text-center">
              {/* Animated success icon */}
              <div className="relative mx-auto">
                <div className="absolute inset-0 mx-auto flex h-24 w-24 items-center justify-center">
                  <div
                    className="absolute h-full w-full rounded-full bg-success/20"
                    style={{ animation: "pulse-ring 1.5s ease-out infinite" }}
                  />
                </div>
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success/20">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-success"
                    style={{ animation: "scale-in 0.5s ease-out" }}
                  >
                    <Check className="h-8 w-8 text-success-foreground" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <PartyPopper className="h-6 w-6 text-warning" />
                  <h2 className="font-display text-2xl font-bold tracking-tight">Congratulations!</h2>
                  <PartyPopper className="h-6 w-6 text-warning scale-x-[-1]" />
                </div>
                <p className="mx-auto max-w-md text-on-surface-variant">
                  You've successfully completed the setup. Your account is ready to use with all
                  features unlocked.
                </p>
              </div>

              {/* Achievement badges */}
              <div className="flex items-center justify-center gap-3 pt-4">
                {[
                  { icon: Star, label: "Early Adopter" },
                  { icon: Zap, label: "Quick Starter" },
                  { icon: Gift, label: "Welcome Bonus" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-full border bg-background px-4 py-2"
                    style={{ animation: "fade-in-up 0.5s ease-out" }}
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-4">
                <Button size="lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-container">
                <Sparkles className="h-10 w-10 text-on-surface-variant" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Ready to Celebrate?</h3>
                <p className="text-sm text-on-surface-variant">
                  Click the button below to see the completion celebration
                </p>
              </div>

              <Button onClick={triggerCelebration}>
                <PartyPopper className="mr-2 h-4 w-4" />
                Trigger Celebration
              </Button>
            </div>
          )}
        </div>

        {showCelebration && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" onClick={() => setShowCelebration(false)}>
              Reset Demo
            </Button>
          </div>
        )}
      </CardContent>

      {/* CSS Animations */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes fade-in-up {
          0% {
            transform: translateY(10px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-high/80 backdrop-blur-[20px] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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
              <h1 className="font-display text-xl font-bold tracking-tight">Onboarding Patterns</h1>
              <p className="text-on-surface-variant text-sm">
                User onboarding and welcome experience patterns
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto py-8 px-6 space-y-16">
        <WelcomeScreen />
        <FeatureTour />
        <SetupChecklist />
        <ProgressIndicator />
        <SkipOption />
        <CompletionCelebration />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
