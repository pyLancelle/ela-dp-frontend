"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimeRangePickerProps {
  timeFrom?: string;
  timeTo?: string;
  onTimeChange: (timeFrom: string | undefined, timeTo: string | undefined) => void;
}

const TIME_OPTIONS = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

export function TimeRangePicker({ timeFrom, timeTo, onTimeChange }: TimeRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFrom, setLocalFrom] = useState(timeFrom || "");
  const [localTo, setLocalTo] = useState(timeTo || "");

  const handleApply = () => {
    onTimeChange(
      localFrom || undefined,
      localTo || undefined
    );
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalFrom("");
    setLocalTo("");
    onTimeChange(undefined, undefined);
    setIsOpen(false);
  };

  const getLabel = () => {
    if (timeFrom && timeTo) return `${timeFrom} - ${timeTo}`;
    if (timeFrom) return `Après ${timeFrom}`;
    if (timeTo) return `Avant ${timeTo}`;
    return "Plage horaire";
  };

  const hasFilter = timeFrom || timeTo;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasFilter ? "default" : "outline"}
          size="sm"
          className="gap-2"
        >
          <Clock className="h-4 w-4" />
          {getLabel()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Heure de début</label>
            <select
              value={localFrom}
              onChange={(e) => setLocalFrom(e.target.value)}
              className="w-full p-2 border rounded-md bg-background text-sm"
            >
              <option value="">Aucune</option>
              {TIME_OPTIONS.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Heure de fin</label>
            <select
              value={localTo}
              onChange={(e) => setLocalTo(e.target.value)}
              className="w-full p-2 border rounded-md bg-background text-sm"
            >
              <option value="">Aucune</option>
              {TIME_OPTIONS.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="flex-1">
              Réinitialiser
            </Button>
            <Button size="sm" onClick={handleApply} className="flex-1">
              Appliquer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
