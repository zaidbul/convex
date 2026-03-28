"use client";

import {
  CalendarDate,
  createCalendar,
  getLocalTimeZone,
  getWeeksInMonth,
  today,
} from "@internationalized/date";
import { useCalendar, useCalendarCell, useCalendarGrid } from "@react-aria/calendar";
import type { AriaCalendarProps as AriaCalendarPropsBase, DateValue } from "@react-aria/calendar";
import { useLocale } from "@react-aria/i18n";
import { useCalendarState } from "@react-stately/calendar";
import type { CalendarState, RangeCalendarState } from "@react-stately/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================================
// ARIA CALENDAR
// ============================================================================

interface AriaCalendarProps<T extends DateValue> extends Omit<
  AriaCalendarPropsBase<T>,
  "locale" | "createCalendar"
> {
  className?: string;
  visibleMonths?: number;
}

function AriaCalendar<T extends DateValue>({
  className,
  visibleMonths = 1,
  ...props
}: AriaCalendarProps<T>) {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
    visibleDuration: { months: visibleMonths },
  });

  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(props, state);

  return (
    <div {...calendarProps} className={cn("p-3 bg-background rounded-lg", className)}>
      <CalendarHeader
        title={title}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />
      <div className="flex gap-4 mt-4">
        {[...Array(visibleMonths)].map((_, i) => (
          <CalendarGrid key={i} state={state} offset={{ months: i }} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CALENDAR HEADER
// ============================================================================

interface CalendarHeaderProps {
  title: string;
  prevButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

function CalendarHeader({ title, prevButtonProps, nextButtonProps }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        {...prevButtonProps}
        variant="ghost"
        size="icon-sm"
        disabled={prevButtonProps.disabled}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <h2 className="text-sm font-semibold">{title}</h2>
      <Button
        {...nextButtonProps}
        variant="ghost"
        size="icon-sm"
        disabled={nextButtonProps.disabled}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ============================================================================
// CALENDAR GRID
// ============================================================================

interface CalendarGridProps {
  state: CalendarState | RangeCalendarState;
  offset?: { months?: number };
}

function CalendarGrid({ state, offset = {} }: CalendarGridProps) {
  const { locale } = useLocale();
  const startDate = state.visibleRange.start.add(offset);
  const endDate = startDate.add({ months: 1 }).subtract({ days: 1 });

  const { gridProps, headerProps, weekDays } = useCalendarGrid({ startDate, endDate }, state);

  const weeksInMonth = getWeeksInMonth(startDate, locale);

  return (
    <table {...gridProps} className="w-full border-collapse">
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            <th key={index} className="text-muted-foreground text-xs font-normal pb-2 w-9">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(weeksInMonth)].map((_, weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex, startDate)
              .map((date, i) =>
                date ? <CalendarCell key={i} state={state} date={date} /> : <td key={i} />,
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============================================================================
// CALENDAR CELL
// ============================================================================

interface CalendarCellProps {
  state: CalendarState | RangeCalendarState;
  date: CalendarDate;
}

function CalendarCell({ state, date }: CalendarCellProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);

  const isToday = date.compare(today(getLocalTimeZone())) === 0;

  // Check if this is part of a range selection
  const isRangeSelection = "highlightedRange" in state;
  const isSelectionStart = isRangeSelection && state.highlightedRange?.start?.compare(date) === 0;
  const isSelectionEnd = isRangeSelection && state.highlightedRange?.end?.compare(date) === 0;
  const isInRange =
    isRangeSelection &&
    state.highlightedRange?.start &&
    state.highlightedRange?.end &&
    date.compare(state.highlightedRange.start) > 0 &&
    date.compare(state.highlightedRange.end) < 0;

  return (
    <td {...cellProps} className="p-0.5 text-center">
      <button
        {...buttonProps}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={cn(
          "relative w-9 h-9 text-sm rounded-md outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "hover:bg-accent hover:text-accent-foreground",
          // Today styling
          isToday && !isSelected && "bg-accent text-accent-foreground",
          // Selected single date
          isSelected && !isRangeSelection && "bg-primary text-primary-foreground",
          // Range selection
          isSelectionStart && "bg-primary text-primary-foreground rounded-l-md rounded-r-none",
          isSelectionEnd && "bg-primary text-primary-foreground rounded-r-md rounded-l-none",
          isInRange && "bg-primary/20 text-foreground rounded-none",
          // Both start and end (single day range)
          isSelectionStart && isSelectionEnd && "rounded-md",
          // Disabled/unavailable
          isDisabled && "text-muted-foreground opacity-50 cursor-not-allowed",
          isUnavailable && "text-destructive line-through opacity-50 cursor-not-allowed",
        )}
      >
        {formattedDate}
      </button>
    </td>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export { AriaCalendar, CalendarHeader, CalendarGrid, CalendarCell };

// Re-export useful date utilities
export { today, getLocalTimeZone, parseDate, CalendarDate } from "@internationalized/date";
