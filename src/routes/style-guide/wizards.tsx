import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  CreditCard,
  MapPin,
  Package,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/wizards")({
  component: WizardsPage,
});

// ============================================================================
// WIZARD 1: Linear Stepper (Horizontal)
// ============================================================================

const linearSteps = [
  { id: 1, title: "Account", description: "Create your account" },
  { id: 2, title: "Profile", description: "Tell us about yourself" },
  { id: 3, title: "Preferences", description: "Customize your experience" },
  { id: 4, title: "Complete", description: "Review and finish" },
];

function LinearStepperWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linear Stepper Wizard</CardTitle>
        <CardDescription>
          Classic horizontal step indicator with numbered progression
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stepper */}
        <div className="flex items-center justify-between">
          {linearSteps.map((step, index) => (
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
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      currentStep >= step.id ? "text-foreground" : "text-on-surface-variant",
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
              {index < linearSteps.length - 1 && (
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

        <Separator />

        {/* Step Content */}
        <div className="min-h-[200px] py-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="Tell us about yourself..." />
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>How did you hear about us?</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="search">Search Engine</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="friend">Friend Referral</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="newsletter" />
                <Label htmlFor="newsletter" className="font-normal">
                  Subscribe to newsletter
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal">
                  I agree to the terms and conditions
                </Label>
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">All Done!</h3>
              <p className="mt-2 text-sm text-on-surface-variant">
                Your account has been created successfully.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep((s) => Math.min(linearSteps.length, s + 1))}
          disabled={currentStep === linearSteps.length}
        >
          {currentStep === linearSteps.length - 1 ? "Finish" : "Next"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// ============================================================================
// WIZARD 2: Sidebar Navigation Wizard
// ============================================================================

const sidebarSteps = [
  { id: "personal", icon: User, title: "Personal Info" },
  { id: "company", icon: Building2, title: "Company Details" },
  { id: "billing", icon: CreditCard, title: "Billing" },
  { id: "security", icon: Shield, title: "Security" },
];

function SidebarWizard() {
  const [activeStep, setActiveStep] = useState("personal");
  const currentIndex = sidebarSteps.findIndex((s) => s.id === activeStep);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sidebar Navigation Wizard</CardTitle>
        <CardDescription>Vertical step list with icon indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-48 shrink-0 space-y-1">
            {sidebarSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              const isCompleted = index < currentIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : isCompleted
                        ? "text-foreground hover:bg-surface-container"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                          ? "bg-success text-success-foreground"
                          : "bg-surface-container",
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="font-medium">{step.title}</span>
                </button>
              );
            })}
          </div>

          <Separator orientation="vertical" className="h-auto" />

          {/* Content */}
          <div className="flex-1 min-h-[280px]">
            {activeStep === "personal" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input type="tel" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            )}
            {activeStep === "company" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Company Details</h3>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Company Size</Label>
                  <RadioGroup defaultValue="small">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="small" />
                      <Label htmlFor="small" className="font-normal">
                        1-10 employees
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="font-normal">
                        11-50 employees
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="large" />
                      <Label htmlFor="large" className="font-normal">
                        50+ employees
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
            {activeStep === "billing" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Billing Information</h3>
                <div className="space-y-2">
                  <Label>Card Number</Label>
                  <Input placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label>CVC</Label>
                    <Input placeholder="123" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Billing Address</Label>
                  <Textarea placeholder="123 Main St, City, State, ZIP" />
                </div>
              </div>
            )}
            {activeStep === "security" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-md bg-surface-high p-4">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-on-surface-variant">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Checkbox />
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-surface-high p-4">
                    <div>
                      <p className="font-medium">Login Notifications</p>
                      <p className="text-sm text-on-surface-variant">Get notified on new logins</p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-md bg-surface-high p-4">
                    <div>
                      <p className="font-medium">Session Timeout</p>
                      <p className="text-sm text-on-surface-variant">Auto-logout after inactivity</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            const prevIndex = Math.max(0, currentIndex - 1);
            setActiveStep(sidebarSteps[prevIndex].id);
          }}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={() => {
            const nextIndex = Math.min(sidebarSteps.length - 1, currentIndex + 1);
            setActiveStep(sidebarSteps[nextIndex].id);
          }}
          disabled={currentIndex === sidebarSteps.length - 1}
        >
          {currentIndex === sidebarSteps.length - 2 ? "Finish" : "Continue"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// ============================================================================
// WIZARD 3: Progress Bar Wizard (Minimal)
// ============================================================================

const progressSteps = [
  { id: 1, title: "Shipping" },
  { id: 2, title: "Payment" },
  { id: 3, title: "Review" },
];

function ProgressBarWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const progress = ((currentStep - 1) / (progressSteps.length - 1)) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Bar Wizard</CardTitle>
        <CardDescription>Minimal design with smooth progress indicator</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Header */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              Step {currentStep} of {progressSteps.length}: {progressSteps[currentStep - 1].title}
            </span>
            <span className="text-on-surface-variant">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="min-h-[200px] py-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Street Address</Label>
                  <Input placeholder="123 Main Street" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input placeholder="San Francisco" />
                </div>
                <div className="space-y-2">
                  <Label>ZIP Code</Label>
                  <Input placeholder="94102" />
                </div>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </h3>
              <RadioGroup defaultValue="card" className="space-y-3">
                <div className="flex items-center space-x-3 rounded-md bg-surface-high p-4">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    <p className="font-medium">Credit Card</p>
                    <p className="text-sm text-on-surface-variant">Visa, Mastercard, Amex</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-md bg-surface-high p-4">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-on-surface-variant">Pay with your PayPal account</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Review
              </h3>
              <div className="rounded-md bg-surface-high space-y-2">
                <div className="flex justify-between p-4">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span>$99.00</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span>$9.99</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-on-surface-variant">Tax</span>
                  <span>$8.91</span>
                </div>
                <div className="flex justify-between p-4 font-semibold">
                  <span>Total</span>
                  <span>$117.90</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={() => setCurrentStep((s) => Math.min(progressSteps.length, s + 1))}
          disabled={currentStep === progressSteps.length}
        >
          {currentStep === progressSteps.length - 1 ? "Place Order" : "Continue"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// ============================================================================
// WIZARD 4: Card Selection Wizard
// ============================================================================

const planOptions = [
  {
    id: "starter",
    name: "Starter",
    price: "$9",
    description: "Perfect for individuals",
    features: ["5 projects", "1GB storage", "Basic support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    description: "For growing teams",
    features: ["Unlimited projects", "10GB storage", "Priority support"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    description: "For large organizations",
    features: ["Everything in Pro", "100GB storage", "24/7 support", "SLA"],
  },
];

function CardSelectionWizard() {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Selection Wizard</CardTitle>
        <CardDescription>Multi-step flow with card-based choices</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                step === s ? "w-6 bg-primary" : "bg-surface-container",
              )}
            />
          ))}
        </div>

        <div className="min-h-[320px]">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Choose Your Plan</h3>
                <p className="text-sm text-on-surface-variant">
                  Select the plan that best fits your needs
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {planOptions.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={cn(
                      "relative rounded-xl border-2 p-4 text-left transition-all hover:border-primary/50",
                      selectedPlan === plan.id ? "border-primary bg-primary/5" : "border-border",
                    )}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                        Popular
                      </span>
                    )}
                    <div className="text-2xl font-bold">{plan.price}</div>
                    <div className="text-sm text-on-surface-variant">/month</div>
                    <div className="mt-2 font-semibold">{plan.name}</div>
                    <div className="text-xs text-on-surface-variant">{plan.description}</div>
                    <ul className="mt-3 space-y-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-xs">
                          <Check className="h-3 w-3 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Billing Cycle</h3>
                <p className="text-sm text-on-surface-variant">Save 20% with annual billing</p>
              </div>
              <RadioGroup
                value={billingCycle}
                onValueChange={setBillingCycle}
                className="grid md:grid-cols-2 gap-4 max-w-md mx-auto"
              >
                <Label
                  htmlFor="monthly"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl border-2 p-6 cursor-pointer transition-all",
                    billingCycle === "monthly"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                  <span className="text-lg font-semibold">Monthly</span>
                  <span className="text-2xl font-bold mt-2">
                    {selectedPlan === "starter" ? "$9" : selectedPlan === "pro" ? "$29" : "$99"}
                  </span>
                  <span className="text-sm text-on-surface-variant">/month</span>
                </Label>
                <Label
                  htmlFor="annual"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl border-2 p-6 cursor-pointer transition-all relative",
                    billingCycle === "annual"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <RadioGroupItem value="annual" id="annual" className="sr-only" />
                  <span className="absolute -top-3 rounded-full bg-success px-2 py-0.5 text-xs font-medium text-success-foreground">
                    Save 20%
                  </span>
                  <span className="text-lg font-semibold">Annual</span>
                  <span className="text-2xl font-bold mt-2">
                    {selectedPlan === "starter" ? "$86" : selectedPlan === "pro" ? "$278" : "$950"}
                  </span>
                  <span className="text-sm text-on-surface-variant">/year</span>
                </Label>
              </RadioGroup>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                    <Sparkles className="h-8 w-8 text-success" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold">You're All Set!</h3>
                <p className="text-sm text-on-surface-variant">Your subscription is ready to go</p>
              </div>
              <div className="mx-auto max-w-sm rounded-md bg-surface-container p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-on-surface-variant">Plan</span>
                  <span className="font-medium capitalize">{selectedPlan}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-on-surface-variant">Billing</span>
                  <span className="font-medium capitalize">{billingCycle}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {billingCycle === "monthly"
                      ? selectedPlan === "starter"
                        ? "$9/mo"
                        : selectedPlan === "pro"
                          ? "$29/mo"
                          : "$99/mo"
                      : selectedPlan === "starter"
                        ? "$86/yr"
                        : selectedPlan === "pro"
                          ? "$278/yr"
                          : "$950/yr"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={() => setStep((s) => Math.min(3, s + 1))}
          disabled={step === 3 || (step === 1 && !selectedPlan)}
        >
          {step === 2 ? "Complete" : step === 3 ? "Done" : "Continue"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// ============================================================================
// WIZARD 5: Inline/Compact Wizard
// ============================================================================

function InlineWizard() {
  const [step, setStep] = useState(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inline Compact Wizard</CardTitle>
        <CardDescription>Minimal inline wizard for quick multi-step inputs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-surface-container p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "h-1.5 w-8 rounded-full transition-colors",
                    s <= step ? "bg-primary" : "bg-surface-container",
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-on-surface-variant">Step {step} of 3</span>
          </div>

          <div className="space-y-4">
            {step === 1 && (
              <>
                <Label>What's your email?</Label>
                <div className="flex gap-2">
                  <Input type="email" placeholder="you@example.com" className="flex-1" />
                  <Button onClick={() => setStep(2)}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <Label>Create a password</Label>
                <div className="flex gap-2">
                  <Input type="password" placeholder="••••••••" className="flex-1" />
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <Label>Choose your username</Label>
                <div className="flex gap-2">
                  <Input placeholder="@username" className="flex-1" />
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button>
                    <Check className="mr-2 h-4 w-4" />
                    Finish
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function WizardsPage() {
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
              <h1 className="font-display text-xl font-bold tracking-tight">Multi-Step Forms & Wizards</h1>
              <p className="text-on-surface-variant text-sm">
                Patterns for complex, multi-page form flows
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto py-8 px-6 space-y-16">
        <LinearStepperWizard />
        <SidebarWizard />
        <ProgressBarWizard />
        <CardSelectionWizard />
        <InlineWizard />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
