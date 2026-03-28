import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AriaCalendar, today, getLocalTimeZone, CalendarDate } from "@/components/ui/aria-calendar";
import { AriaDatePicker } from "@/components/ui/aria-date-picker";
import { AriaRangeCalendar } from "@/components/ui/aria-range-calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduleCalendar, type ScheduleEvent } from "@/components/ui/schedule-calendar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/scheduling")({
  component: SchedulingPage,
});

// ============================================================================
// MOCK DATA
// ============================================================================

const mockEvents: ScheduleEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    start: new Date(new Date().setHours(9, 0, 0, 0)),
    end: new Date(new Date().setHours(9, 30, 0, 0)),
    color: "blue",
  },
  {
    id: "2",
    title: "Project Review",
    start: new Date(new Date().setHours(11, 0, 0, 0)),
    end: new Date(new Date().setHours(12, 0, 0, 0)),
    color: "green",
  },
  {
    id: "3",
    title: "Lunch Break",
    start: new Date(new Date().setHours(12, 30, 0, 0)),
    end: new Date(new Date().setHours(13, 30, 0, 0)),
    color: "yellow",
  },
  {
    id: "4",
    title: "Client Call",
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(15, 0, 0, 0)),
    color: "purple",
  },
  {
    id: "5",
    title: "Deep Work Block",
    start: new Date(new Date().setHours(15, 30, 0, 0)),
    end: new Date(new Date().setHours(17, 30, 0, 0)),
    color: "default",
  },
];

const timeSlots = [
  { time: "9:00 AM", available: true },
  { time: "9:30 AM", available: false },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "11:30 AM", available: true },
  { time: "2:00 PM", available: true },
  { time: "2:30 PM", available: true },
  { time: "3:00 PM", available: false },
  { time: "3:30 PM", available: true },
  { time: "4:00 PM", available: true },
  { time: "4:30 PM", available: true },
];

// ============================================================================
// MAIN PAGE
// ============================================================================

function SchedulingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-high/80 backdrop-blur-[20px] sticky top-0 z-10">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-display font-bold tracking-tight">Scheduling & Calendars</h1>
          <p className="text-on-surface-variant mt-1">
            React Aria calendar components with Tailwind styling
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="py-8 px-8 space-y-16">
        {/* Intro */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-on-surface-variant">
            These calendar components are built with <strong>React Aria</strong> primitives and{" "}
            <strong>@internationalized/date</strong> for robust internationalization, time zone
            handling, and accessibility. They follow the shadcn philosophy: headless primitives
            styled with Tailwind.
          </p>
        </div>

        {/* Basic Calendar */}
        <BasicCalendarExample />

        {/* Multi-Month Calendar */}
        <MultiMonthCalendarExample />

        {/* Range Calendar */}
        <RangeCalendarExample />

        {/* Date Picker */}
        <DatePickerExample />

        {/* Week View Schedule */}
        <WeekScheduleExample />

        {/* Day View Schedule */}
        <DayScheduleExample />

        {/* Time Slot Picker (Calendly-style) */}
        <TimeSlotPickerExample />

        {/* Availability Grid */}
        <AvailabilityGridExample />

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}

// ============================================================================
// BASIC CALENDAR EXAMPLE
// ============================================================================

function BasicCalendarExample() {
  const [date, setDate] = useState<CalendarDate | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Calendar</CardTitle>
        <CardDescription>
          Single date selection with React Aria. Supports keyboard navigation, screen readers, and
          13+ calendar systems.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-8 items-start">
          <AriaCalendar value={date} onChange={setDate} className="bg-surface-high rounded-md" />
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Date</p>
            <p className="text-sm text-on-surface-variant">
              {date
                ? date.toDate(getLocalTimeZone()).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "No date selected"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MULTI-MONTH CALENDAR EXAMPLE
// ============================================================================

function MultiMonthCalendarExample() {
  const [date, setDate] = useState<CalendarDate | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Month Calendar</CardTitle>
        <CardDescription>
          Display multiple months side-by-side for easier date browsing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AriaCalendar
          value={date}
          onChange={setDate}
          visibleMonths={2}
          className="bg-surface-high rounded-md"
        />
      </CardContent>
    </Card>
  );
}

// ============================================================================
// RANGE CALENDAR EXAMPLE
// ============================================================================

function RangeCalendarExample() {
  const [range, setRange] = useState<{
    start: CalendarDate;
    end: CalendarDate;
  } | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Range Calendar</CardTitle>
        <CardDescription>
          Select a date range with visual highlighting. Perfect for booking flows, vacation
          scheduling, or report date ranges.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-8 items-start">
          <AriaRangeCalendar value={range} onChange={setRange} className="bg-surface-high rounded-md" />
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Range</p>
            <p className="text-sm text-on-surface-variant">
              {range
                ? `${range.start.toDate(getLocalTimeZone()).toLocaleDateString()} - ${range.end.toDate(getLocalTimeZone()).toLocaleDateString()}`
                : "No range selected"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// DATE PICKER EXAMPLE
// ============================================================================

function DatePickerExample() {
  const [date, setDate] = useState<CalendarDate | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date Picker Input</CardTitle>
        <CardDescription>
          An input field with popover calendar. Features editable date segments for keyboard entry.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-8 items-start">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select a date</label>
            <AriaDatePicker value={date} onChange={setDate} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">With min/max constraints</p>
            <AriaDatePicker minValue={today(getLocalTimeZone())} placeholder="Future dates only" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// WEEK SCHEDULE EXAMPLE
// ============================================================================

function WeekScheduleExample() {
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Week View Schedule</CardTitle>
        <CardDescription>
          Google Calendar-style week view with time slots and events. Click a slot to create an
          event, or click an event to view details.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScheduleCalendar
          view="week"
          events={mockEvents}
          startHour={8}
          endHour={18}
          onSlotClick={(date) => setSelectedSlot(date)}
          onEventClick={(event) => setSelectedEvent(event)}
          className="h-[500px] rounded-b-lg"
        />
        {(selectedSlot || selectedEvent) && (
          <div className="p-4 bg-surface-container">
            {selectedSlot && (
              <p className="text-sm">
                <span className="font-medium">Clicked slot:</span> {selectedSlot.toLocaleString()}
              </p>
            )}
            {selectedEvent && (
              <p className="text-sm">
                <span className="font-medium">Clicked event:</span> {selectedEvent.title}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// DAY SCHEDULE EXAMPLE
// ============================================================================

function DayScheduleExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Day View Schedule</CardTitle>
        <CardDescription>
          Single day view for focused daily planning. Shows more detail per time slot.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScheduleCalendar
          view="day"
          events={mockEvents}
          startHour={8}
          endHour={18}
          className="h-[500px] rounded-b-lg"
        />
      </CardContent>
    </Card>
  );
}

// ============================================================================
// TIME SLOT PICKER EXAMPLE (Calendly-style)
// ============================================================================

function TimeSlotPickerExample() {
  const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Slot Picker</CardTitle>
        <CardDescription>
          Calendly-style appointment booking. Select a date, then choose from available time slots.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Calendar side */}
          <div>
            <h3 className="text-sm font-medium mb-3">Select a Date</h3>
            <AriaCalendar
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
              minValue={today(getLocalTimeZone())}
              className="bg-surface-high rounded-md"
            />
          </div>

          {/* Time slots side */}
          <div>
            <h3 className="text-sm font-medium mb-3">
              {selectedDate
                ? `Available times for ${selectedDate.toDate(getLocalTimeZone()).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}`
                : "Select a date to see times"}
            </h3>
            {selectedDate ? (
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-auto">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    size="sm"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className="justify-center"
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-on-surface-variant bg-surface-high rounded-md">
                Select a date to view available times
              </div>
            )}
          </div>
        </div>

        {/* Confirmation */}
        {selectedDate && selectedTime && (
          <div className="mt-6 p-4 bg-primary/5 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Your selection</p>
                <p className="text-sm text-on-surface-variant">
                  {selectedDate.toDate(getLocalTimeZone()).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {selectedTime}
                </p>
              </div>
              <Button>Confirm Booking</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// AVAILABILITY GRID EXAMPLE
// ============================================================================

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const hours = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"];

// Mock availability data (true = available)
const availabilityData: Record<string, Record<string, boolean>> = {
  Mon: {
    "9 AM": true,
    "10 AM": true,
    "11 AM": false,
    "12 PM": false,
    "1 PM": true,
    "2 PM": true,
    "3 PM": true,
    "4 PM": false,
    "5 PM": false,
  },
  Tue: {
    "9 AM": false,
    "10 AM": true,
    "11 AM": true,
    "12 PM": false,
    "1 PM": true,
    "2 PM": true,
    "3 PM": false,
    "4 PM": true,
    "5 PM": true,
  },
  Wed: {
    "9 AM": true,
    "10 AM": true,
    "11 AM": true,
    "12 PM": true,
    "1 PM": false,
    "2 PM": false,
    "3 PM": true,
    "4 PM": true,
    "5 PM": true,
  },
  Thu: {
    "9 AM": false,
    "10 AM": false,
    "11 AM": true,
    "12 PM": true,
    "1 PM": true,
    "2 PM": true,
    "3 PM": true,
    "4 PM": true,
    "5 PM": false,
  },
  Fri: {
    "9 AM": true,
    "10 AM": true,
    "11 AM": true,
    "12 PM": false,
    "1 PM": false,
    "2 PM": true,
    "3 PM": true,
    "4 PM": false,
    "5 PM": false,
  },
};

function AvailabilityGridExample() {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  const toggleSlot = (day: string, hour: string) => {
    const key = `${day}-${hour}`;
    const newSlots = new Set(selectedSlots);
    if (newSlots.has(key)) {
      newSlots.delete(key);
    } else {
      newSlots.add(key);
    }
    setSelectedSlots(newSlots);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Grid</CardTitle>
        <CardDescription>
          Weekly availability matrix. Green cells indicate available slots. Click to select multiple
          slots.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-16 p-2 text-left text-xs font-medium text-on-surface-variant" />
                {weekDays.map((day) => (
                  <th
                    key={day}
                    className="p-2 text-center text-xs font-medium text-on-surface-variant"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => (
                <tr key={hour}>
                  <td className="p-2 text-xs text-on-surface-variant whitespace-nowrap">{hour}</td>
                  {weekDays.map((day) => {
                    const isAvailable = availabilityData[day][hour];
                    const isSelected = selectedSlots.has(`${day}-${hour}`);
                    return (
                      <td key={`${day}-${hour}`} className="p-1">
                        <button
                          onClick={() => isAvailable && toggleSlot(day, hour)}
                          disabled={!isAvailable}
                          className={cn(
                            "w-full h-8 rounded-md transition-colors",
                            isAvailable
                              ? isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50"
                              : "bg-surface-container cursor-not-allowed",
                          )}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30" />
            <span className="text-on-surface-variant">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" />
            <span className="text-on-surface-variant">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-surface-container" />
            <span className="text-on-surface-variant">Unavailable</span>
          </div>
        </div>

        {selectedSlots.size > 0 && (
          <div className="mt-4 p-3 bg-surface-container rounded-md">
            <p className="text-sm font-medium">{selectedSlots.size} slot(s) selected</p>
            <p className="text-xs text-on-surface-variant mt-1">
              {Array.from(selectedSlots).join(", ")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
