"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, subDays, startOfYear, endOfDay, startOfDay } from "date-fns"
import { fr } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type DateFilterPreset = "yesterday" | "7days" | "30days" | "thisYear" | "custom" | "allTime"

interface DateRangeFilterProps {
  selectedPreset: DateFilterPreset
  onFilterChange: (preset: DateFilterPreset, dateRange?: DateRange) => void
}

export function DateRangeFilter({ selectedPreset, onFilterChange }: DateRangeFilterProps) {
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handlePresetClick = (preset: DateFilterPreset) => {

    const now = new Date()
    let dateRange: DateRange | undefined

    switch (preset) {
      case "yesterday":
        const yesterday = subDays(now, 1)
        dateRange = {
          from: startOfDay(yesterday),
          to: endOfDay(yesterday),
        }
        break
      case "7days":
        dateRange = {
          from: startOfDay(subDays(now, 7)),
          to: endOfDay(now),
        }
        break
      case "30days":
        dateRange = {
          from: startOfDay(subDays(now, 30)),
          to: endOfDay(now),
        }
        break
      case "thisYear":
        dateRange = {
          from: startOfYear(now),
          to: endOfDay(now),
        }
        break
      case "allTime":
        dateRange = undefined
        break
      case "custom":
        // Will be handled by calendar selection
        return
    }

    onFilterChange(preset, dateRange)
  }

  const handleCustomDateSelect = (range: DateRange | undefined) => {
    setCustomDateRange(range)
    if (range?.from && range?.to) {
      onFilterChange("custom", {
        from: startOfDay(range.from),
        to: endOfDay(range.to),
      })
      setIsPopoverOpen(false)
    }
  }

  const getCustomDateLabel = () => {
    if (!customDateRange?.from) return "Personnalisé"
    if (!customDateRange.to) {
      return format(customDateRange.from, "dd MMM yyyy", { locale: fr })
    }
    return `${format(customDateRange.from, "dd MMM", { locale: fr })} - ${format(customDateRange.to, "dd MMM yyyy", { locale: fr })}`
  }

  const presets: { key: DateFilterPreset; label: string }[] = [
    { key: "allTime", label: "Tout" },
    { key: "yesterday", label: "Hier" },
    { key: "7days", label: "7 jours" },
    { key: "30days", label: "30 jours" },
    { key: "thisYear", label: "Cette année" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Liquid glass pill group */}
      <div className="liquid-glass-filter flex items-center gap-0.5 rounded-full p-1">
        {presets.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => handlePresetClick(key)}
            className={cn(
              "relative px-3.5 py-1.5 rounded-full text-sm font-medium select-none transition-colors duration-150",
              selectedPreset === key
                ? "text-foreground"
                : "text-foreground/50 hover:text-foreground/80"
            )}
          >
            {selectedPreset === key && (
              <motion.span
                layoutId="liquid-glass-indicator"
                className="liquid-glass-pill-active absolute inset-0 rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      {/* Custom date picker — même style liquid glass */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "liquid-glass-filter flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-250",
              selectedPreset === "custom"
                ? "text-foreground"
                : "text-foreground/50 hover:text-foreground/80"
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            {selectedPreset === "custom" ? getCustomDateLabel() : "Personnalisé"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={customDateRange}
            onSelect={handleCustomDateSelect}
            numberOfMonths={2}
            locale={fr}
            defaultMonth={customDateRange?.from}
            disabled={(date) => date > new Date()}
          />
          <div className="p-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setCustomDateRange(undefined)
                setIsPopoverOpen(false)
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
