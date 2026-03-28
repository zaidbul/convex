import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/layout-guides/auth-minimal")({
  component: AuthMinimalRoutePage,
});

function AuthMinimalRoutePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="grid min-h-screen place-items-center">
        {/* TanStack Router <Outlet /> should render here. Keep this main slot unpadded. */}
        <div className="w-full max-w-md p-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Focused, distraction-free auth shell.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-on-surface-variant">Email</label>
                <Input type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-on-surface-variant">Password</label>
                <Input type="password" placeholder="********" />
              </div>
              <Button className="w-full">
                <Lock />
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
