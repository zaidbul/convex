import { createFileRoute } from "@tanstack/react-router";
import { Calendar, File, Filter, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/layout-guides/data-table-layout")({
  component: DataTableLayoutRoutePage,
});

function DataTableLayoutRoutePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl">
        {/* TanStack Router <Outlet /> should render here. Keep this main slot unpadded. */}
        <div className="space-y-4 px-4 py-5 sm:px-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>Data-heavy shell with table-centric workflow.</CardDescription>
                </div>
                <Button>
                  <File />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardContent className="grid gap-2 pt-4 md:grid-cols-[1fr_auto_auto_auto]">
              <Input placeholder="Search orders" />
              <Button variant="outline">
                <Filter />
                Status
              </Button>
              <Button variant="outline">
                <Calendar />
                Date range
              </Button>
              <Button variant="outline">
                <SlidersHorizontal />
                Columns
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="overflow-x-auto pt-4">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead className="text-on-surface-variant">
                  <tr className="border-b border-outline-variant/15">
                    <th className="pb-2 font-medium">Order</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 30 }).map((_, index) => {
                    const statuses = ["Paid", "Pending", "Refunded", "Failed"] as const;
                    const status = statuses[index % 4];
                    const customers = [
                      "Alice Martin",
                      "Bob Johnson",
                      "Carol Williams",
                      "Dave Brown",
                      "Eve Davis",
                      "Frank Miller",
                      "Grace Wilson",
                      "Henry Moore",
                      "Iris Taylor",
                      "Jack Anderson",
                    ];
                    const times = [
                      "12 min ago",
                      "1h ago",
                      "2h ago",
                      "4h ago",
                      "6h ago",
                      "8h ago",
                      "12h ago",
                      "1d ago",
                      "2d ago",
                      "3d ago",
                    ];
                    return (
                      <tr key={`row-${index}`} className="border-b border-outline-variant/15">
                        <td className="py-2">ORD-{1200 + index}</td>
                        <td className="py-2">{customers[index % 10]}</td>
                        <td className="py-2">
                          <Badge
                            variant={
                              status === "Paid"
                                ? "secondary"
                                : status === "Failed"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {status}
                          </Badge>
                        </td>
                        <td className="py-2">${((index + 2) * 120 + index * 37) % 9999}</td>
                        <td className="py-2 text-on-surface-variant">{times[index % 10]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
