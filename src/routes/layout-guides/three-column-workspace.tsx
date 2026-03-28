import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/layout-guides/three-column-workspace")({
  component: ThreeColumnWorkspaceRoutePage,
});

function ThreeColumnWorkspaceRoutePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[220px_320px_1fr]">
        <aside className="bg-surface-low p-3">
          <p className="px-2 pb-3 text-xs font-medium text-on-surface-variant">Spaces</p>
          <nav className="space-y-1">
            {["Support", "Product", "Growth", "Infra"].map((item, index) => (
              <a
                key={item}
                href="#"
                className={cn(
                  "block rounded-md px-2 py-1.5 text-xs",
                  index === 0
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-foreground",
                )}
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        <aside className="bg-surface-container p-3">
          <p className="px-2 pb-3 text-xs font-medium text-on-surface-variant">Conversations</p>
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card
                key={`thread-${index}`}
                size="sm"
                className={cn(index === 0 ? "ring-primary/30" : "")}
              >
                <CardHeader>
                  <CardTitle>Thread #{index + 1}</CardTitle>
                  <CardDescription>2 unread messages</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </aside>

        <main className="min-w-0">
          {/* TanStack Router <Outlet /> should render here. Keep this main slot unpadded. */}
          <div className="space-y-4 p-4">
            <Card>
              <CardHeader>
                <CardTitle>Thread #1 — Account billing discrepancy</CardTitle>
                <CardDescription>
                  Customer reports incorrect charges on their monthly invoice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md bg-surface-high p-3">
                    <p className="text-[10px] text-on-surface-variant">Owner</p>
                    <p className="text-xs font-medium">Maria Garcia</p>
                  </div>
                  <div className="rounded-md bg-surface-high p-3">
                    <p className="text-[10px] text-on-surface-variant">Priority</p>
                    <p className="text-xs font-medium">Urgent</p>
                  </div>
                  <div className="rounded-md bg-surface-high p-3">
                    <p className="text-[10px] text-on-surface-variant">SLA</p>
                    <p className="text-xs font-medium">2h remaining</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    sender: "Customer",
                    name: "John Doe",
                    message:
                      "Hi, I noticed my last invoice shows $249 but I'm on the $99/mo plan. Can you look into this? I've been on this plan since January and this is the first time I've seen an overcharge.",
                    time: "Today, 9:15 AM",
                    isCustomer: true,
                  },
                  {
                    sender: "Agent",
                    name: "Maria Garcia",
                    message:
                      "Hi John, thank you for reaching out. I can see your account and I'll investigate the billing discrepancy right away. Let me pull up your invoice history.",
                    time: "Today, 9:22 AM",
                    isCustomer: false,
                  },
                  {
                    sender: "Agent",
                    name: "Maria Garcia",
                    message:
                      "I've reviewed your account. It looks like there was an accidental plan upgrade triggered on Feb 18th when you visited the billing settings page. This appears to be a known UI bug we're tracking (BILL-847). I'm going to revert your plan and issue a refund for the difference.",
                    time: "Today, 9:35 AM",
                    isCustomer: false,
                  },
                  {
                    sender: "Customer",
                    name: "John Doe",
                    message:
                      "Oh interesting, I did visit that page to download my invoice PDF. So that triggered an upgrade? That seems like a pretty bad bug.",
                    time: "Today, 9:41 AM",
                    isCustomer: true,
                  },
                  {
                    sender: "Agent",
                    name: "Maria Garcia",
                    message:
                      "You're absolutely right, and I apologize for the inconvenience. The engineering team is already working on a fix for this. In the meantime, I've:\n\n1. Reverted your plan to $99/mo\n2. Issued a refund of $150 to your card ending in 4242\n3. Added a credit of $25 to your account for the trouble\n\nThe refund should appear within 3-5 business days.",
                    time: "Today, 9:48 AM",
                    isCustomer: false,
                  },
                  {
                    sender: "Customer",
                    name: "John Doe",
                    message:
                      "That's great, thank you for the quick resolution and the account credit. Much appreciated!",
                    time: "Today, 9:52 AM",
                    isCustomer: true,
                  },
                  {
                    sender: "Agent",
                    name: "Maria Garcia",
                    message:
                      "Happy to help! I'll also flag your account so this won't happen again even before the bug fix goes out. Is there anything else I can help you with?",
                    time: "Today, 9:55 AM",
                    isCustomer: false,
                  },
                  {
                    sender: "Customer",
                    name: "John Doe",
                    message: "Nope, that's everything. Thanks again!",
                    time: "Today, 9:58 AM",
                    isCustomer: true,
                  },
                ].map((msg, index) => (
                  <div
                    key={`msg-${index}`}
                    className={cn(
                      "rounded-md p-3",
                      msg.isCustomer
                        ? "bg-surface-container"
                        : "bg-primary/5",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">{msg.name}</p>
                      <span className="text-[10px] text-on-surface-variant">{msg.time}</span>
                    </div>
                    <p className="mt-1.5 whitespace-pre-line text-xs text-on-surface-variant">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    author: "Maria Garcia",
                    note: "Confirmed this is related to BILL-847. The billing settings page has a button that triggers a plan change on click instead of on confirm. Customer was affected but is now resolved.",
                    time: "Today, 9:50 AM",
                  },
                  {
                    author: "System",
                    note: "Refund of $150.00 processed. Transaction ID: ref_2xK9mN4pQ",
                    time: "Today, 9:49 AM",
                  },
                  {
                    author: "System",
                    note: "Account credit of $25.00 applied.",
                    time: "Today, 9:49 AM",
                  },
                  {
                    author: "Maria Garcia",
                    note: "Added account flag SKIP_PLAN_AUTO_UPGRADE to prevent recurrence. Engineering ETA for BILL-847 fix is March 5.",
                    time: "Today, 9:56 AM",
                  },
                ].map((note, index) => (
                  <div
                    key={`note-${index}`}
                    className="rounded-md bg-surface-high p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">{note.author}</p>
                      <span className="text-[10px] text-on-surface-variant">{note.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-on-surface-variant">{note.note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
