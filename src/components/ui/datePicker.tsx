"use client";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  children: React.ReactElement;
  selected?: Date;
  onSelect?: (day: Date) => void;
}

export function DatePicker({ children, selected, onSelect }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelected = (day: Date | undefined) => {
    if (!day) return;
    onSelect?.(day);
    setOpen(() => false);
  };

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selected} onSelect={handleSelected} />
      </PopoverContent>
    </Popover>
  );
}
