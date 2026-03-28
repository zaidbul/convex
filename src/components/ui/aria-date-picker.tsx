"use client";

import {
  createCalendar,
  getLocalTimeZone,
  getWeeksInMonth,
  today,
  type CalendarDate,
} from "@internationalized/date";
import { useCalendar, useCalendarCell, useCalendarGrid } from "@react-aria/calendar";
import { useDatePicker, useDateSegment, useDateField } from "@react-aria/datepicker";
import type {
  DateValue,
  AriaDatePickerProps as AriaDatePickerPropsBase,
  AriaDateFieldProps,
} from "@react-aria/datepicker";
import { useLocale } from "@react-aria/i18n";
import { useCalendarState } from "@react-stately/calendar";
import { useDatePickerState, useDateFieldState } from "@react-stately/datepicker";
import type { DateSegment as DateSegmentType } from "@react-stately/datepicker";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ============================================================================
// ARIA DATE PICKER
// ============================================================================

interface AriaDatePickerProps<T extends DateValue> extends AriaDatePickerPropsBase<T> {
  className?: string;
  placeholder?: string;
}

function AriaDatePicker<T extends DateValue>({
  className,
  placeholder = "Select date",
  ...props
}: AriaDatePickerProps<T>) {
  const state = useDatePickerState(props);

  const ref = React.useRef<HTMLDivElement>(null);
  const { groupProps, fieldProps, buttonProps, calendarProps } = useDatePicker(props, state, ref);
  const { isDisabled: isTriggerDisabled, ...triggerButtonProps } = buttonProps;

  return (
    <div className={cn("relative", className)}>
      <Popover
        open={state.isOpen}
        onOpenChange={(isOpen) => {
          state.setOpen(isOpen);
        }}
      >
        <div {...groupProps} ref={ref} className="flex">
          <DateField {...fieldProps} placeholder={placeholder} />
          <PopoverTrigger
            render={
              <button
                {...triggerButtonProps}
                disabled={isTriggerDisabled}
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "ml-1")}
              >
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </button>
            }
          />
        </div>
        <PopoverContent className="w-auto p-0" align="start">
          <DatePickerCalendar {...calendarProps} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ============================================================================
// DATE FIELD (Input display)
// ============================================================================

interface DateFieldProps {
  placeholder?: string;
}

function DateField({ placeholder, ...props }: DateFieldProps & AriaDateFieldProps<DateValue>) {
  const { locale } = useLocale();
  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });

  const ref = React.useRef<HTMLDivElement>(null);
  const { fieldProps } = useDateField(props, state, ref);

  return (
    <div
      {...fieldProps}
      ref={ref}
      className={cn(
        "flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        "min-w-[200px]",
      )}
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
      {state.value === null && <span className="text-muted-foreground">{placeholder}</span>}
    </div>
  );
}

// ============================================================================
// DATE SEGMENT
// ============================================================================

interface DateSegmentProps {
  segment: DateSegmentType;
  state: any;
}

function DateSegment({ segment, state }: DateSegmentProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={cn(
        "outline-none rounded-sm px-0.5",
        "focus:bg-primary focus:text-primary-foreground",
        segment.isPlaceholder && "text-muted-foreground",
      )}
    >
      {segment.text}
    </div>
  );
}

// ============================================================================
// DATE PICKER CALENDAR (Internal calendar for the popover)
// ============================================================================

function DatePickerCalendar(props: any) {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
  });

  const {
    calendarProps,
    prevButtonProps: prevAriaButtonProps,
    nextButtonProps: nextAriaButtonProps,
    title,
  } = useCalendar(props, state);
  const { isDisabled: isPrevDisabled, ...prevButtonProps } = prevAriaButtonProps;
  const { isDisabled: isNextDisabled, ...nextButtonProps } = nextAriaButtonProps;

  return (
    <div {...calendarProps} className="p-3">
      <div className="flex items-center justify-between mb-4">
        <button
          {...prevButtonProps}
          disabled={isPrevDisabled}
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-sm font-semibold">{title}</h2>
        <button
          {...nextButtonProps}
          disabled={isNextDisabled}
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <DatePickerGrid state={state} />
    </div>
  );
}

function DatePickerGrid({ state }: { state: any }) {
  const { locale } = useLocale();
  const { gridProps, headerProps, weekDays } = useCalendarGrid({}, state);
  const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

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
              .getDatesInWeek(weekIndex)
              .map((date: CalendarDate | null, i: number) =>
                date ? <DatePickerCell key={i} state={state} date={date} /> : <td key={i} />,
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DatePickerCell({ state, date }: { state: any; date: CalendarDate }) {
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

  return (
    <td {...cellProps} className="p-0.5 text-center">
      <button
        {...buttonProps}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={cn(
          "w-9 h-9 text-sm rounded-md outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring",
          "hover:bg-accent hover:text-accent-foreground",
          isToday && !isSelected && "bg-accent text-accent-foreground",
          isSelected && "bg-primary text-primary-foreground",
          isDisabled && "text-muted-foreground opacity-50 cursor-not-allowed",
          isUnavailable && "text-destructive line-through opacity-50",
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

export { AriaDatePicker, DateField, DateSegment };

// Re-export date utilities
export { today, getLocalTimeZone, parseDate, CalendarDate } from "@internationalized/date";
