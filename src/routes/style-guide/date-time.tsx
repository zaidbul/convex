import { createFileRoute } from "@tanstack/react-router";
import {
  addDays,
  format,
  formatDistanceToNow,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subWeeks,
} from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/date-time")({
  component: DateTimePage,
});

// ============================================================================
// EXAMPLE 1: Basic Calendar Component
// ============================================================================

function CalendarExample() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar Component</CardTitle>
        <CardDescription>Standalone calendar for inline date selection</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md bg-surface-high" />
        <p className="text-sm text-on-surface-variant">
          Selected:{" "}
          <span className="font-medium text-foreground">{date ? format(date, "PPP") : "None"}</span>
        </p>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 2: Date Picker (Single)
// ============================================================================

function DatePickerExample() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date Picker (Single)</CardTitle>
        <CardDescription>Popover-based date picker for form inputs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select a date</Label>
          <DatePicker selectedDate={date} onDateSelect={setDate} />
        </div>
        {date && (
          <p className="text-sm text-on-surface-variant">
            You selected:{" "}
            <span className="font-medium text-foreground">{format(date, "PPPP")}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 3: Date Range Picker
// ============================================================================

function DateRangePickerExample() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date Range Picker</CardTitle>
        <CardDescription>Select a start and end date range</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal sm:w-[300px]",
                  !dateRange && "text-on-surface-variant",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              className="rounded-md bg-surface-high"
            />
          </PopoverContent>
        </Popover>
        {dateRange?.from && dateRange?.to && (
          <p className="text-sm text-on-surface-variant">
            Duration:{" "}
            <span className="font-medium text-foreground">
              {Math.ceil(
                (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24),
              )}{" "}
              days
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 4: Time Picker
// ============================================================================

function TimePickerExample() {
  const [hours, setHours] = useState("09");
  const [minutes, setMinutes] = useState("00");
  const [period, setPeriod] = useState("AM");

  const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Picker</CardTitle>
        <CardDescription>Select time using dropdown selectors (12-hour format)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-on-surface-variant" />
          <Select
            value={hours}
            onValueChange={(value) => {
              if (value !== null) setHours(value);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="HH" />
            </SelectTrigger>
            <SelectContent>
              {hourOptions.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-on-surface-variant">:</span>
          <Select
            value={minutes}
            onValueChange={(value) => {
              if (value !== null) setMinutes(value);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="MM" />
            </SelectTrigger>
            <SelectContent>
              {minuteOptions.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={period}
            onValueChange={(value) => {
              if (value !== null) setPeriod(value);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-on-surface-variant">
          Selected time:{" "}
          <span className="font-medium text-foreground">
            {hours}:{minutes} {period}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 5: Date + Time Picker Combined
// ============================================================================

function DateTimePickerExample() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const getFullDateTime = () => {
    if (!date) return null;
    const [hours, minutes] = time.split(":").map(Number);
    const fullDate = new Date(date);
    fullDate.setHours(hours, minutes);
    return fullDate;
  };

  const fullDateTime = getFullDateTime();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date + Time Picker</CardTitle>
        <CardDescription>Combined date and time selection for scheduling</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal sm:w-[200px]",
                      !date && "text-on-surface-variant",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md bg-surface-high"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
              <Input
                type="time"
                value={time}
                onChange={handleTimeChange}
                className="w-full pl-9 sm:w-[140px]"
              />
            </div>
          </div>
        </div>
        {fullDateTime && (
          <div className="rounded-md bg-surface-container p-3">
            <p className="text-sm">
              <span className="text-on-surface-variant">Scheduled for: </span>
              <span className="font-medium">{format(fullDateTime, "PPPP 'at' p")}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 6: Relative Date Display
// ============================================================================

function RelativeDateExample() {
  const now = new Date();
  const dates = [
    { label: "Just now", date: subMinutes(now, 2) },
    { label: "30 minutes ago", date: subMinutes(now, 30) },
    { label: "2 hours ago", date: subHours(now, 2) },
    { label: "Yesterday", date: subDays(now, 1) },
    { label: "3 days ago", date: subDays(now, 3) },
    { label: "Last week", date: subWeeks(now, 1) },
    { label: "Last month", date: subMonths(now, 1) },
    { label: "3 months ago", date: subMonths(now, 3) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relative Date Display</CardTitle>
        <CardDescription>Human-readable relative timestamps using date-fns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dates.map(({ label, date }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-md bg-surface-high px-4 py-2"
            >
              <span className="text-sm text-on-surface-variant">{label}</span>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {formatDistanceToNow(date, { addSuffix: true })}
                </p>
                <p className="text-xs text-on-surface-variant">{format(date, "PPp")}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 7: Date Presets
// ============================================================================

function DatePresetsExample() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const presets = [
    {
      label: "Today",
      value: "today",
      range: { from: new Date(), to: new Date() },
    },
    {
      label: "Yesterday",
      value: "yesterday",
      range: { from: subDays(new Date(), 1), to: subDays(new Date(), 1) },
    },
    {
      label: "Last 7 days",
      value: "last7",
      range: { from: subDays(new Date(), 6), to: new Date() },
    },
    {
      label: "Last 14 days",
      value: "last14",
      range: { from: subDays(new Date(), 13), to: new Date() },
    },
    {
      label: "Last 30 days",
      value: "last30",
      range: { from: subDays(new Date(), 29), to: new Date() },
    },
    {
      label: "This month",
      value: "thisMonth",
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      },
    },
    {
      label: "Last month",
      value: "lastMonth",
      range: {
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      },
    },
  ];

  const handlePresetClick = (preset: (typeof presets)[0]) => {
    setSelectedPreset(preset.value);
    setDateRange(preset.range);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date Presets</CardTitle>
        <CardDescription>Quick selection buttons for common date ranges</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.value}
              variant={selectedPreset === preset.value ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetClick(preset)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        {dateRange?.from && (
          <div className="rounded-md bg-surface-container p-3">
            <p className="text-sm">
              <span className="text-on-surface-variant">Selected range: </span>
              <span className="font-medium">
                {format(dateRange.from, "PPP")}
                {dateRange.to && dateRange.from.getTime() !== dateRange.to.getTime() && (
                  <> - {format(dateRange.to, "PPP")}</>
                )}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 8: Calendar with Multiple Selection
// ============================================================================

function MultiSelectCalendarExample() {
  const [dates, setDates] = useState<Date[] | undefined>([
    new Date(),
    addDays(new Date(), 2),
    addDays(new Date(), 5),
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Select Calendar</CardTitle>
        <CardDescription>Select multiple individual dates (great for scheduling)</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Calendar
          mode="multiple"
          selected={dates}
          onSelect={setDates}
          className="rounded-md bg-surface-high"
        />
        <div className="w-full">
          <p className="text-sm text-on-surface-variant mb-2">
            Selected dates ({dates?.length || 0}):
          </p>
          {dates && dates.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {dates.map((date) => (
                <span
                  key={date.toISOString()}
                  className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  {format(date, "MMM d")}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">No dates selected</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function DateTimePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-high/80 backdrop-blur-[20px] sticky top-0 z-10">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-display font-bold tracking-tight">Date & Time Patterns</h1>
          <p className="text-on-surface-variant mt-1">
            Calendar, date pickers, time inputs, and relative dates
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="py-8 px-8 space-y-16">
        <CalendarExample />
        <DatePickerExample />
        <DateRangePickerExample />
        <TimePickerExample />
        <DateTimePickerExample />
        <RelativeDateExample />
        <DatePresetsExample />
        <MultiSelectCalendarExample />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
