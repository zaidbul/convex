import { Link } from "@tanstack/react-router"
import { ArrowRight, FlaskConical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DashboardMvpPreviewCardProps {
  slug: string
}

export function DashboardMvpPreviewCard({
  slug,
}: DashboardMvpPreviewCardProps) {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
            <FlaskConical
              className="size-4 text-primary"
              strokeWidth={1.75}
            />
          </div>
          <CardTitle className="text-sm font-medium">MVP Preview</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Explore a mock clinical trial management system built with your design
          system.
        </p>
        <Button
          variant="default"
          className="w-full gap-2"
          nativeButton={false}
          render={
            <Link
              to="/$slug/tickets/mvp-preview"
              params={{ slug }}
            />
          }
        >
          See MVP Preview
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
