import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  id?: string;
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
}

export function DatePicker({ selectedDate, onDateSelect }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(selectedDate);

  const handleDateSelect = (nextDate: Date | undefined) => {
    setDate(nextDate);
    if (onDateSelect) {
      onDateSelect(nextDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
}
