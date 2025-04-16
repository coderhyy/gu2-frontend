// components/ui/multi-select.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  className?: string;
  emptyText?: string;
  onChange: (selected: string[]) => void;
  options: Option[];
  placeholder?: string;
  selected: string[];
}

export function MultiSelect({
  className,
  emptyText = "No options found.",
  onChange,
  options,
  placeholder = "Please select an option...",
  selected,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (value: string) => {
      const updatedSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      onChange(updatedSelected);
    },
    [selected, onChange]
  );

  const selectedLabels = React.useMemo(
    () =>
      selected
        .map((value) => options.find((option) => option.value === value)?.label)
        .filter(Boolean)
        .join(", "),
    [selected, options]
  );

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          role="combobox"
          variant="outline"
        >
          <span className="truncate">
            {selected.length > 0 ? selectedLabels : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput className="h-9" placeholder="Search options..." />
          <CommandList className="w-full">
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup className="w-full">
              {options.map((option) => (
                <CommandItem
                  className="w-full"
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  value={option.value}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
