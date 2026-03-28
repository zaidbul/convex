import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const Route = createFileRoute("/style-guide/charts")({
  component: ChartsPage,
});

// ============================================================================
// SAMPLE DATA
// ============================================================================

const lineChartData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 2000, expenses: 9800 },
  { month: "Apr", revenue: 2780, expenses: 3908 },
  { month: "May", revenue: 1890, expenses: 4800 },
  { month: "Jun", revenue: 2390, expenses: 3800 },
  { month: "Jul", revenue: 3490, expenses: 4300 },
];

const areaChartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const barChartData = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 520 },
  { name: "Thu", value: 280 },
  { name: "Fri", value: 590 },
  { name: "Sat", value: 320 },
  { name: "Sun", value: 180 },
];

const horizontalBarData = [
  { category: "Electronics", sales: 4000 },
  { category: "Clothing", sales: 3000 },
  { category: "Home & Garden", sales: 2000 },
  { category: "Sports", sales: 2780 },
  { category: "Books", sales: 1890 },
];

const pieChartData = [
  { name: "Chrome", value: 400, fill: "var(--color-chrome)" },
  { name: "Safari", value: 300, fill: "var(--color-safari)" },
  { name: "Firefox", value: 200, fill: "var(--color-firefox)" },
  { name: "Edge", value: 100, fill: "var(--color-edge)" },
];

const donutChartData = [
  { name: "Completed", value: 63, fill: "var(--color-completed)" },
  { name: "In Progress", value: 25, fill: "var(--color-inProgress)" },
  { name: "Pending", value: 12, fill: "var(--color-pending)" },
];

const radialBarData = [{ name: "Progress", value: 75, fill: "var(--primary)" }];

const heatmapData = [
  { day: "Mon", hour: "9am", value: 20 },
  { day: "Mon", hour: "12pm", value: 45 },
  { day: "Mon", hour: "3pm", value: 80 },
  { day: "Mon", hour: "6pm", value: 30 },
  { day: "Tue", hour: "9am", value: 60 },
  { day: "Tue", hour: "12pm", value: 90 },
  { day: "Tue", hour: "3pm", value: 55 },
  { day: "Tue", hour: "6pm", value: 25 },
  { day: "Wed", hour: "9am", value: 35 },
  { day: "Wed", hour: "12pm", value: 70 },
  { day: "Wed", hour: "3pm", value: 85 },
  { day: "Wed", hour: "6pm", value: 40 },
  { day: "Thu", hour: "9am", value: 50 },
  { day: "Thu", hour: "12pm", value: 65 },
  { day: "Thu", hour: "3pm", value: 75 },
  { day: "Thu", hour: "6pm", value: 35 },
  { day: "Fri", hour: "9am", value: 55 },
  { day: "Fri", hour: "12pm", value: 95 },
  { day: "Fri", hour: "3pm", value: 60 },
  { day: "Fri", hour: "6pm", value: 15 },
];

const sparklineData = [
  { value: 10 },
  { value: 25 },
  { value: 15 },
  { value: 30 },
  { value: 20 },
  { value: 35 },
  { value: 28 },
  { value: 45 },
  { value: 38 },
  { value: 50 },
];

function getHeatmapColor(value: number) {
  if (value < 30) return "bg-primary/10";
  if (value < 50) return "bg-primary/30";
  if (value < 70) return "bg-primary/50";
  if (value < 90) return "bg-primary/70";
  return "bg-primary";
}

// ============================================================================
// CHART CONFIGS
// ============================================================================

const lineChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--destructive)",
  },
} satisfies ChartConfig;

const areaChartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--accent-600)",
  },
} satisfies ChartConfig;

const barChartConfig = {
  value: {
    label: "Value",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const pieChartConfig = {
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const donutChartConfig = {
  completed: {
    label: "Completed",
    color: "var(--success)",
  },
  inProgress: {
    label: "In Progress",
    color: "var(--primary)",
  },
  pending: {
    label: "Pending",
    color: "var(--muted)",
  },
} satisfies ChartConfig;

// ============================================================================
// LINE CHART
// ============================================================================

function LineChartExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart</CardTitle>
        <CardDescription>Track trends over time with smooth or stepped lines</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              dot={{ fill: "var(--color-revenue)", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="var(--color-expenses)"
              strokeWidth={2}
              dot={{ fill: "var(--color-expenses)", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// AREA CHART
// ============================================================================

function AreaChartExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>Filled areas show volume and cumulative data effectively</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={areaChartConfig} className="h-[300px] w-full">
          <AreaChart data={areaChartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="desktop"
              stackId="1"
              stroke="var(--color-desktop)"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
            />
            <Area
              type="monotone"
              dataKey="mobile"
              stackId="1"
              stroke="var(--color-mobile)"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// BAR CHARTS
// ============================================================================

function BarChartExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vertical Bar Chart</CardTitle>
        <CardDescription>Compare discrete categories with vertical bars</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={barChartConfig} className="h-[300px] w-full">
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function HorizontalBarChartExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Horizontal Bar Chart</CardTitle>
        <CardDescription>Better for long category labels and rankings</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={barChartConfig} className="h-[300px] w-full">
          <BarChart data={horizontalBarData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="sales" fill="var(--primary)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// PIE & DONUT CHARTS
// ============================================================================

function PieChartExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pie Chart</CardTitle>
        <CardDescription>Show parts of a whole with proportional slices</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {pieChartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"][
                      index % 4
                    ]
                  }
                />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function DonutChartExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Donut Chart</CardTitle>
        <CardDescription>Pie chart with center cutout for additional context</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={donutChartConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={donutChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
            >
              {donutChartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={["var(--success)", "var(--primary)", "var(--muted)"][index % 3]}
                />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            {/* Center label */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-2xl font-bold"
            >
              63%
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-sm"
            >
              Complete
            </text>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SPARKLINES
// ============================================================================

function SparklineExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sparklines</CardTitle>
        <CardDescription>Compact inline charts for quick trend visualization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Line Sparkline */}
          <div className="rounded-md bg-surface-high p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Revenue</span>
              <span className="text-sm text-success font-medium">+12.5%</span>
            </div>
            <div className="text-2xl font-bold mb-2">$48,352</div>
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--success)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Area Sparkline */}
          <div className="rounded-md bg-surface-high p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Users</span>
              <span className="text-sm text-primary font-medium">+8.2%</span>
            </div>
            <div className="text-2xl font-bold mb-2">2,847</div>
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--primary)"
                    fill="var(--primary)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Sparkline */}
          <div className="rounded-md bg-surface-high p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Orders</span>
              <span className="text-sm text-destructive font-medium">-3.1%</span>
            </div>
            <div className="text-2xl font-bold mb-2">1,234</div>
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sparklineData}>
                  <Bar dataKey="value" fill="var(--accent-600)" radius={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// GAUGE / RADIAL PROGRESS
// ============================================================================

function GaugeExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gauge / Radial Progress</CardTitle>
        <CardDescription>Circular progress indicators for goals and KPIs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Radial Bar */}
          <div className="flex flex-col items-center">
            <div className="h-40 w-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="100%"
                  barSize={12}
                  data={radialBarData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar background dataKey="value" cornerRadius={6} fill="var(--primary)" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">75%</span>
                <span className="text-xs text-on-surface-variant">Progress</span>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant mt-2">Sales Target</p>
          </div>

          {/* CSS-based gauge */}
          <div className="flex flex-col items-center">
            <div className="h-40 w-40 relative">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--muted)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="var(--success)"
                  strokeWidth="8"
                  strokeDasharray={`${63 * 2.51} ${100 * 2.51}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">63%</span>
                <span className="text-xs text-on-surface-variant">Complete</span>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant mt-2">Project Status</p>
          </div>

          {/* Semi-circle gauge */}
          <div className="flex flex-col items-center">
            <div className="h-40 w-40 relative">
              <svg viewBox="0 0 100 60" className="w-full">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="var(--warning)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="126 126"
                  strokeDashoffset={126 - 126 * 0.85}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                <span className="text-3xl font-bold">85%</span>
                <span className="text-xs text-on-surface-variant">Efficiency</span>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant mt-2">System Health</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// HEATMAP (Simplified)
// ============================================================================

function HeatmapExample() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const hours = ["9am", "12pm", "3pm", "6pm"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heatmap</CardTitle>
        <CardDescription>Visualize data density or intensity across two dimensions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[400px]">
            {/* Header row */}
            <div className="flex mb-2">
              <div className="w-16" />
              {hours.map((hour) => (
                <div key={hour} className="flex-1 text-center text-xs text-on-surface-variant">
                  {hour}
                </div>
              ))}
            </div>

            {/* Data rows */}
            {days.map((day) => (
              <div key={day} className="flex mb-1">
                <div className="w-16 text-sm text-on-surface-variant flex items-center">{day}</div>
                {hours.map((hour) => {
                  const dataPoint = heatmapData.find((d) => d.day === day && d.hour === hour);
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={`flex-1 h-10 mx-0.5 rounded flex items-center justify-center text-xs font-medium transition-colors ${getHeatmapColor(dataPoint?.value || 0)}`}
                      title={`${day} ${hour}: ${dataPoint?.value || 0}`}
                    >
                      {dataPoint?.value}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center justify-end mt-4 gap-2">
              <span className="text-xs text-on-surface-variant">Low</span>
              <div className="flex gap-0.5">
                <div className="w-4 h-4 rounded bg-primary/10" />
                <div className="w-4 h-4 rounded bg-primary/30" />
                <div className="w-4 h-4 rounded bg-primary/50" />
                <div className="w-4 h-4 rounded bg-primary/70" />
                <div className="w-4 h-4 rounded bg-primary" />
              </div>
              <span className="text-xs text-on-surface-variant">High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// CHART LEGENDS
// ============================================================================

function ChartLegendsExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart Legends</CardTitle>
        <CardDescription>Different legend styles and placements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Inline Legend */}
          <div className="rounded-md bg-surface-high p-4">
            <h4 className="text-sm font-medium mb-3">Inline Legend</h4>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-sm">Expenses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm">Profit</span>
              </div>
            </div>
            <div className="h-20 bg-surface-container rounded flex items-center justify-center text-sm text-on-surface-variant">
              Chart area
            </div>
          </div>

          {/* Stacked Legend */}
          <div className="rounded-md bg-surface-high p-4">
            <h4 className="text-sm font-medium mb-3">Stacked Legend</h4>
            <div className="flex gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-primary" />
                  <span className="text-sm">Chrome</span>
                  <span className="text-sm text-on-surface-variant ml-auto">40%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-accent-500" />
                  <span className="text-sm">Safari</span>
                  <span className="text-sm text-on-surface-variant ml-auto">30%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-warning" />
                  <span className="text-sm">Firefox</span>
                  <span className="text-sm text-on-surface-variant ml-auto">20%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-info" />
                  <span className="text-sm">Other</span>
                  <span className="text-sm text-on-surface-variant ml-auto">10%</span>
                </div>
              </div>
              <div className="flex-1 bg-surface-container rounded flex items-center justify-center text-sm text-on-surface-variant">
                Chart
              </div>
            </div>
          </div>

          {/* Interactive Legend */}
          <div className="rounded-md bg-surface-high p-4">
            <h4 className="text-sm font-medium mb-3">Interactive Legend</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              <button className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm hover:bg-primary/20 transition-colors">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Desktop
              </button>
              <button className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-container text-on-surface-variant line-through text-sm hover:bg-surface-container transition-colors">
                <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                Mobile
              </button>
              <button className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10 border border-success/20 text-sm hover:bg-success/20 transition-colors">
                <div className="h-2 w-2 rounded-full bg-success" />
                Tablet
              </button>
            </div>
            <div className="h-20 bg-surface-container rounded flex items-center justify-center text-sm text-on-surface-variant">
              Click legend items to toggle
            </div>
          </div>

          {/* Legend with Values */}
          <div className="rounded-md bg-surface-high p-4">
            <h4 className="text-sm font-medium mb-3">Legend with Values</h4>
            <div className="h-20 bg-surface-container rounded flex items-center justify-center text-sm text-on-surface-variant mb-3">
              Chart area
            </div>
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="text-sm font-medium">Revenue</span>
                </div>
                <span className="text-lg font-bold">$12,450</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
                  <span className="text-sm font-medium">Expenses</span>
                </div>
                <span className="text-lg font-bold">$8,230</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// RESPONSIVE CHARTS
// ============================================================================

function ResponsiveChartsExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Responsive Charts</CardTitle>
        <CardDescription>Charts that adapt to different container sizes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">
            All charts in this style guide use{" "}
            <code className="text-xs bg-surface-container px-1 py-0.5 rounded">ResponsiveContainer</code> from
            Recharts or <code className="text-xs bg-surface-container px-1 py-0.5 rounded">ChartContainer</code>{" "}
            from our chart component. This ensures charts automatically resize to fit their
            container.
          </p>

          {/* Demo responsive chart */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md bg-surface-high p-4">
              <h4 className="text-sm font-medium mb-2">Large Container</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Bar dataKey="value" fill="var(--primary)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-md bg-surface-high p-4">
              <h4 className="text-sm font-medium mb-2">Compact Container</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <Bar dataKey="value" fill="var(--primary)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Best practices */}
          <div className="rounded-lg bg-surface-container p-4">
            <h4 className="text-sm font-medium mb-2">Best Practices</h4>
            <ul className="text-sm text-on-surface-variant space-y-1">
              <li>- Use percentage widths with fixed or min-heights</li>
              <li>- Hide axis labels on small screens if needed</li>
              <li>- Consider simplified versions for mobile</li>
              <li>- Test at various breakpoints</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// CHART TOOLTIPS
// ============================================================================

function ChartTooltipsExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart Tooltips</CardTitle>
        <CardDescription>Interactive tooltips for detailed data exploration</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Default Tooltip */}
          <div className="rounded-md bg-surface-high p-4">
            <h4 className="text-sm font-medium mb-3">Default Tooltip</h4>
            <div className="h-48">
              <ChartContainer config={lineChartConfig} className="h-full w-full">
                <LineChart data={lineChartData.slice(0, 4)}>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    dot
                  />
                </LineChart>
              </ChartContainer>
            </div>
            <p className="text-xs text-on-surface-variant mt-2">
              Hover over data points to see tooltip
            </p>
          </div>

          {/* Tooltip Styles Preview */}
          <div className="rounded-md bg-surface-high p-4">
            <h4 className="text-sm font-medium mb-3">Tooltip Styles</h4>
            <div className="space-y-3">
              {/* Dot indicator */}
              <div className="rounded-md bg-background p-2.5 shadow-lg inline-block">
                <div className="text-xs font-medium mb-1">January</div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="text-xs text-on-surface-variant">Revenue</span>
                  <span className="text-xs font-mono font-medium ml-auto">$4,000</span>
                </div>
              </div>

              {/* Line indicator */}
              <div className="rounded-md bg-background p-2.5 shadow-lg inline-block">
                <div className="text-xs font-medium mb-1">February</div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 rounded bg-success" />
                  <span className="text-xs text-on-surface-variant">Profit</span>
                  <span className="text-xs font-mono font-medium ml-auto">$2,340</span>
                </div>
              </div>

              {/* Multiple values */}
              <div className="rounded-md bg-background p-2.5 shadow-lg inline-block">
                <div className="text-xs font-medium mb-1.5">March</div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    <span className="text-xs text-on-surface-variant">Revenue</span>
                    <span className="text-xs font-mono font-medium ml-2">$2,000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
                    <span className="text-xs text-on-surface-variant">Expenses</span>
                    <span className="text-xs font-mono font-medium ml-2">$9,800</span>
                  </div>
                </div>
              </div>
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

function ChartsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-high/80 backdrop-blur-[20px] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="font-display text-2xl font-bold tracking-tight">Charts & Data Visualization</h1>
          <p className="text-on-surface-variant mt-1">Patterns for visualizing data with Recharts</p>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto py-8 px-6 space-y-16">
        <LineChartExample />
        <AreaChartExample />

        <div className="grid gap-6 md:grid-cols-2">
          <BarChartExample />
          <HorizontalBarChartExample />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PieChartExample />
          <DonutChartExample />
        </div>

        <SparklineExample />
        <GaugeExample />
        <HeatmapExample />
        <ChartLegendsExample />
        <ResponsiveChartsExample />
        <ChartTooltipsExample />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
