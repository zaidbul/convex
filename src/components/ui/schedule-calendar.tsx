"use client";

import { CalendarDate, getLocalTimeZone, today, startOfWeek } from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: "default" | "blue" | "green" | "red" | "yellow" | "purple";
}

export interface ScheduleCalendarProps {
  /** The currently focused date */
  value?: CalendarDate;
  /** Callback when date changes */
  onChange?: (date: CalendarDate) => void;
  /** View mode */
  view?: "day" | "week";
  /** Events to display */
  events?: ScheduleEvent[];
  /** Start hour of the day (0-23) */
  startHour?: number;
  /** End hour of the day (0-23) */
  endHour?: number;
  /** Time slot interval in minutes */
  slotInterval?: number;
  /** Callback when clicking on a time slot */
  onSlotClick?: (date: Date) => void;
  /** Callback when clicking on an event */
  onEventClick?: (event: ScheduleEvent) => void;
  /** Additional class name */
  className?: string;
}

// ============================================================================
// SCHEDULE CALENDAR
// ============================================================================

function ScheduleCalendar({
  value,
  onChange,
  view = "week",
  events = [],
  startHour = 0,
  endHour = 24,
  slotInterval = 60,
  onSlotClick,
  onEventClick,
  className,
}: ScheduleCalendarProps) {
  const { locale } = useLocale();
  const [focusedDate, setFocusedDate] = React.useState<CalendarDate>(
    value ?? today(getLocalTimeZone()),
  );

  // Update focused date when value prop changes
  React.useEffect(() => {
    if (value) {
      setFocusedDate(value);
    }
  }, [value]);

  const handleDateChange = (date: CalendarDate) => {
    setFocusedDate(date);
    onChange?.(date);
  };

  const navigatePrevious = () => {
    const newDate =
      view === "week" ? focusedDate.subtract({ weeks: 1 }) : focusedDate.subtract({ days: 1 });
    handleDateChange(newDate);
  };

  const navigateNext = () => {
    const newDate = view === "week" ? focusedDate.add({ weeks: 1 }) : focusedDate.add({ days: 1 });
    handleDateChange(newDate);
  };

  const goToToday = () => {
    handleDateChange(today(getLocalTimeZone()));
  };

  // Get dates for the current view
  const dates = React.useMemo(() => {
    if (view === "day") {
      return [focusedDate];
    }
    // Week view - get all days of the week
    const weekStart = startOfWeek(focusedDate, locale);
    return Array.from({ length: 7 }, (_, i) => weekStart.add({ days: i }));
  }, [focusedDate, view, locale]);

  // Generate time slots
  const timeSlots = React.useMemo(() => {
    const slots: number[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotInterval) {
        slots.push(hour * 60 + minute);
      }
    }
    return slots;
  }, [startHour, endHour, slotInterval]);

  // Format header title
  const headerTitle = React.useMemo(() => {
    if (view === "day") {
      return focusedDate.toDate(getLocalTimeZone()).toLocaleDateString(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    const weekStart = dates[0];
    const weekEnd = dates[dates.length - 1];
    const startMonth = weekStart
      .toDate(getLocalTimeZone())
      .toLocaleDateString(locale, { month: "short" });
    const endMonth = weekEnd
      .toDate(getLocalTimeZone())
      .toLocaleDateString(locale, { month: "short" });
    const year = weekStart.year;

    if (startMonth === endMonth) {
      return `${startMonth} ${weekStart.day} - ${weekEnd.day}, ${year}`;
    }
    return `${startMonth} ${weekStart.day} - ${endMonth} ${weekEnd.day}, ${year}`;
  }, [dates, focusedDate, view, locale]);

  return (
    <div className={cn("flex flex-col bg-background rounded-lg border", className)}>
      {/* Header */}
      <ScheduleHeader
        title={headerTitle}
        onPrevious={navigatePrevious}
        onNext={navigateNext}
        onToday={goToToday}
        view={view}
      />

      {/* Day headers */}
      <div className="flex border-b">
        {/* Time gutter spacer */}
        <div className="w-16 shrink-0 border-r" />
        {/* Day columns */}
        <div
          className="flex-1 grid"
          style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}
        >
          {dates.map((date) => (
            <ScheduleDayHeader key={date.toString()} date={date} locale={locale} />
          ))}
        </div>
      </div>

      {/* Time grid */}
      <div className="flex flex-1 overflow-auto">
        {/* Time gutter */}
        <div className="w-16 shrink-0 border-r">
          {timeSlots.map((minutes) => (
            <TimeGutterCell key={minutes} minutes={minutes} slotInterval={slotInterval} />
          ))}
        </div>

        {/* Day columns with time slots */}
        <div
          className="flex-1 grid relative"
          style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}
        >
          {dates.map((date) => (
            <ScheduleDayColumn
              key={date.toString()}
              date={date}
              timeSlots={timeSlots}
              slotInterval={slotInterval}
              events={events}
              startHour={startHour}
              endHour={endHour}
              onSlotClick={onSlotClick}
              onEventClick={onEventClick}
            />
          ))}
          {/* Current time indicator */}
          <CurrentTimeIndicator dates={dates} startHour={startHour} endHour={endHour} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SCHEDULE HEADER
// ============================================================================

interface ScheduleHeaderProps {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  view: "day" | "week";
}

function ScheduleHeader({ title, onPrevious, onNext, onToday, view: _view }: ScheduleHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
        <div className="flex items-center">
          <Button variant="ghost" size="icon-sm" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="w-24" /> {/* Spacer for balance */}
    </div>
  );
}

// ============================================================================
// SCHEDULE DAY HEADER
// ============================================================================

interface ScheduleDayHeaderProps {
  date: CalendarDate;
  locale: string;
}

function ScheduleDayHeader({ date, locale }: ScheduleDayHeaderProps) {
  const isToday = date.compare(today(getLocalTimeZone())) === 0;
  const jsDate = date.toDate(getLocalTimeZone());
  const dayName = jsDate.toLocaleDateString(locale, { weekday: "short" });
  const dayNumber = date.day;

  return (
    <div className="flex flex-col items-center py-2 border-r last:border-r-0">
      <span className="text-xs text-muted-foreground uppercase">{dayName}</span>
      <span
        className={cn(
          "flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full mt-1",
          isToday && "bg-primary text-primary-foreground",
        )}
      >
        {dayNumber}
      </span>
    </div>
  );
}

// ============================================================================
// TIME GUTTER CELL
// ============================================================================

interface TimeGutterCellProps {
  minutes: number;
  slotInterval: number;
}

function TimeGutterCell({ minutes, slotInterval: _slotInterval }: TimeGutterCellProps) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  // Only show label at the top of each hour
  if (minute !== 0) {
    return <div className="h-12 border-b border-dashed" />;
  }

  const timeString = new Date(0, 0, 0, hour).toLocaleTimeString([], {
    hour: "numeric",
    hour12: true,
  });

  return (
    <div className="h-12 border-b relative">
      <span className="absolute -top-2.5 right-2 text-xs text-muted-foreground">{timeString}</span>
    </div>
  );
}

// ============================================================================
// SCHEDULE DAY COLUMN
// ============================================================================

interface ScheduleDayColumnProps {
  date: CalendarDate;
  timeSlots: number[];
  slotInterval: number;
  events: ScheduleEvent[];
  startHour: number;
  endHour: number;
  onSlotClick?: (date: Date) => void;
  onEventClick?: (event: ScheduleEvent) => void;
}

function ScheduleDayColumn({
  date,
  timeSlots,
  slotInterval: _slotInterval,
  events,
  startHour,
  endHour,
  onSlotClick,
  onEventClick,
}: ScheduleDayColumnProps) {
  const jsDate = date.toDate(getLocalTimeZone());
  const dateString = jsDate.toDateString();

  // Filter events for this day
  const dayEvents = events.filter((event) => {
    const eventDate = event.start.toDateString();
    return eventDate === dateString;
  });

  const handleSlotClick = (minutes: number) => {
    if (!onSlotClick) return;
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const clickedDate = new Date(jsDate);
    clickedDate.setHours(hour, minute, 0, 0);
    onSlotClick(clickedDate);
  };

  return (
    <div className="relative border-r last:border-r-0">
      {/* Time slots */}
      {timeSlots.map((minutes) => (
        <div
          key={minutes}
          className={cn(
            "h-12 border-b cursor-pointer hover:bg-accent/50 transition-colors",
            minutes % 60 !== 0 && "border-dashed",
          )}
          onClick={() => handleSlotClick(minutes)}
        />
      ))}

      {/* Events */}
      {dayEvents.map((event) => (
        <ScheduleEvent
          key={event.id}
          event={event}
          startHour={startHour}
          endHour={endHour}
          onClick={onEventClick}
        />
      ))}
    </div>
  );
}

// ============================================================================
// SCHEDULE EVENT
// ============================================================================

interface ScheduleEventProps {
  event: ScheduleEvent;
  startHour: number;
  endHour: number;
  onClick?: (event: ScheduleEvent) => void;
}

const eventColors = {
  default: "bg-primary/90 text-primary-foreground border-primary",
  blue: "bg-blue-500/90 text-white border-blue-600",
  green: "bg-green-500/90 text-white border-green-600",
  red: "bg-red-500/90 text-white border-red-600",
  yellow: "bg-yellow-500/90 text-black border-yellow-600",
  purple: "bg-purple-500/90 text-white border-purple-600",
};

function ScheduleEvent({ event, startHour, endHour, onClick }: ScheduleEventProps) {
  const startMinutes = event.start.getHours() * 60 + event.start.getMinutes();
  const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();

  const dayStartMinutes = startHour * 60;
  const dayEndMinutes = endHour * 60;
  const totalMinutes = dayEndMinutes - dayStartMinutes;

  // Calculate position
  const top = ((startMinutes - dayStartMinutes) / totalMinutes) * 100;
  const height = ((endMinutes - startMinutes) / totalMinutes) * 100;

  // Format time
  const timeString = `${event.start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} - ${event.end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;

  return (
    <div
      className={cn(
        "absolute left-1 right-1 rounded-md px-2 py-1 text-xs overflow-hidden cursor-pointer border-l-2",
        "hover:opacity-90 transition-opacity",
        eventColors[event.color ?? "default"],
      )}
      style={{
        top: `${top}%`,
        height: `${height}%`,
        minHeight: "20px",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="opacity-80 truncate">{timeString}</div>
    </div>
  );
}

// ============================================================================
// CURRENT TIME INDICATOR
// ============================================================================

interface CurrentTimeIndicatorProps {
  dates: CalendarDate[];
  startHour: number;
  endHour: number;
}

function CurrentTimeIndicator({ dates, startHour, endHour }: CurrentTimeIndicatorProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Update time every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Check if today is in the visible dates
  const todayIndex = dates.findIndex((date) => date.compare(today(getLocalTimeZone())) === 0);

  if (todayIndex === -1) return null;

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const dayStartMinutes = startHour * 60;
  const dayEndMinutes = endHour * 60;

  // Check if current time is within visible range
  if (currentMinutes < dayStartMinutes || currentMinutes > dayEndMinutes) {
    return null;
  }

  const totalMinutes = dayEndMinutes - dayStartMinutes;
  const top = ((currentMinutes - dayStartMinutes) / totalMinutes) * 100;
  const left = (todayIndex / dates.length) * 100;
  const width = (1 / dates.length) * 100;

  return (
    <div
      className="absolute pointer-events-none z-10"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: `${width}%`,
      }}
    >
      <div className="relative">
        <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-red-500 rounded-full" />
        <div className="h-0.5 bg-red-500" />
      </div>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ScheduleCalendar, ScheduleHeader, ScheduleEvent };

// Re-export date utilities
export { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
