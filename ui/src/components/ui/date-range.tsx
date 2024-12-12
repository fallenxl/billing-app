"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Eraser } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (from: Date | undefined, to: Date | undefined) => void;
}

export default function DatePickerWithRange({
  className,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  
  // Estado para determinar el número de meses que se muestra
  const [numberOfMonths, setNumberOfMonths] = React.useState(2);

  React.useEffect(() => {
    const updateMonths = () => {
      setNumberOfMonths(window.innerWidth < 768 ? 1 : 2);
    };

    updateMonths();
    window.addEventListener("resize", updateMonths);

    return () => window.removeEventListener("resize", updateMonths);
  }, []);

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate?.from, newDate?.to);
    }
  };

  return (
    <div className={cn("grid gap-2 w-full", className)}>
      <Popover>
        <PopoverTrigger className="w-full" asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full md:w-[300px]  justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 overflow-auto" align="start">
          <div className="overflow-auto">
            <div className="flex justify-end p-2 w-full">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleDateChange(undefined)}
              >
                <Eraser className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={numberOfMonths}
              classNames={{
                months: "flex flex-col md:flex-row gap-2",
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
