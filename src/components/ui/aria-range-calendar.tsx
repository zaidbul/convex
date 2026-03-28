"use client";

import { createCalendar, getLocalTimeZone, getWeeksInMonth, today } from "@internationalized/date";
import type { CalendarDate } from "@internationalized/date";
import { useRangeCalendar, useCalendarCell, useCalendarGrid } from "@react-aria/calendar";
import type {
  AriaRangeCalendarProps as AriaRangeCalendarPropsBase,
  DateValue,
} from "@react-aria/calendar";
import { useLocale } from "@react-aria/i18n";
import { useRangeCalendarState } from "@react-stately/calendar";
import type { RangeCalendarState } from "@react-stately/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================================
// ARIA RANGE CALENDAR
// ============================================================================

interface AriaRangeCalendarProps<T extends DateValue> extends Omit<
  AriaRangeCalendarPropsBase<T>,
  "locale" | "createCalendar"
> {
  className?: string;
  visibleMonths?: number;
}

function AriaRangeCalendar<T extends DateValue>({
  className,
  visibleMonths = 2,
  ...props
}: AriaRangeCalendarProps<T>) {
  const { locale } = useLocale();
  const state = useRangeCalendarState({
    ...props,
    locale,
    createCalendar,
    visibleDuration: { months: visibleMonths },
  });

  const ref = React.useRef<HTMLDivElement>(null);
  const { calendarProps, prevButtonProps, nextButtonProps, title } = useRangeCalendar(
    props,
    state,
    ref,
  );

  return (
    <div {...calendarProps} ref={ref} className={cn("p-3 bg-background rounded-lg", className)}>
      <RangeCalendarHeader
        title={title}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />
      <div className="flex gap-8 mt-4">
        {[...Array(visibleMonths)].map((_, i) => (
          <RangeCalendarGrid key={i} state={state} offset={{ months: i }} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// RANGE CALENDAR HEADER
// ============================================================================

interface RangeCalendarHeaderProps {
  title: string;
  prevButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

function RangeCalendarHeader({
  title,
  prevButtonProps,
  nextButtonProps,
}: RangeCalendarHeaderProps) {
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
// RANGE CALENDAR GRID
// ============================================================================

interface RangeCalendarGridProps {
  state: RangeCalendarState;
  offset?: { months?: number };
}

function RangeCalendarGrid({ state, offset = {} }: RangeCalendarGridProps) {
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
                date ? <RangeCalendarCell key={i} state={state} date={date} /> : <td key={i} />,
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ============================================================================
// RANGE CALENDAR CELL
// ============================================================================

interface RangeCalendarCellProps {
  state: RangeCalendarState;
  date: CalendarDate;
}

function RangeCalendarCell({ state, date }: RangeCalendarCellProps) {
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

  // Range selection states
  const highlightedRange = state.highlightedRange;
  const isSelectionStart = highlightedRange?.start?.compare(date) === 0;
  const isSelectionEnd = highlightedRange?.end?.compare(date) === 0;
  const isInRange =
    highlightedRange?.start &&
    highlightedRange?.end &&
    date.compare(highlightedRange.start) > 0 &&
    date.compare(highlightedRange.end) < 0;

  return (
    <td {...cellProps} className="p-0 text-center relative">
      {/* Range background */}
      {(isInRange ||
        (isSelectionStart && !isSelectionEnd) ||
        (isSelectionEnd && !isSelectionStart)) && (
        <div
          className={cn(
            "absolute inset-y-0.5 bg-primary/15",
            isSelectionStart && "left-1/2 right-0 rounded-l-md",
            isSelectionEnd && "left-0 right-1/2 rounded-r-md",
            isInRange && "left-0 right-0",
          )}
        />
      )}
      <button
        {...buttonProps}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={cn(
          "relative z-10 w-9 h-9 text-sm rounded-md outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "hover:bg-accent hover:text-accent-foreground",
          // Today styling
          isToday && !isSelected && "bg-accent text-accent-foreground",
          // Range endpoints
          (isSelectionStart || isSelectionEnd) && "bg-primary text-primary-foreground",
          // In range but not endpoints
          isInRange && "text-foreground",
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

export { AriaRangeCalendar, RangeCalendarHeader, RangeCalendarGrid, RangeCalendarCell };
