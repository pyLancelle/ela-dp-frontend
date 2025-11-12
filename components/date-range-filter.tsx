"use client"

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"

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

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-card rounded-lg border">
      <span className="text-sm font-medium text-muted-foreground mr-2">
        Période :
      </span>

      <Button
        type="button"
        variant={selectedPreset === "allTime" ? "default" : "outline"}
        size="sm"
        onClick={() => handlePresetClick("allTime")}
        className="transition-all"
      >
        Tout
      </Button>

      <Button
        type="button"
        variant={selectedPreset === "yesterday" ? "default" : "outline"}
        size="sm"
        onClick={() => handlePresetClick("yesterday")}
        className="transition-all"
      >
        Hier
      </Button>

      <Button
        type="button"
        variant={selectedPreset === "7days" ? "default" : "outline"}
        size="sm"
        onClick={() => handlePresetClick("7days")}
        className="transition-all"
      >
        7 derniers jours
      </Button>

      <Button
        type="button"
        variant={selectedPreset === "30days" ? "default" : "outline"}
        size="sm"
        onClick={() => handlePresetClick("30days")}
        className="transition-all"
      >
        30 derniers jours
      </Button>

      <Button
        type="button"
        variant={selectedPreset === "thisYear" ? "default" : "outline"}
        size="sm"
        onClick={() => handlePresetClick("thisYear")}
        className="transition-all"
      >
        Cette année
      </Button>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant={selectedPreset === "custom" ? "default" : "outline"}
            size="sm"
            className={cn(
              "transition-all",
              selectedPreset === "custom" && "gap-2"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {selectedPreset === "custom" ? getCustomDateLabel() : "Personnalisé"}
          </Button>
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

      {selectedPreset !== "allTime" && (
        <Badge variant="secondary" className="ml-2">
          Filtre actif
        </Badge>
      )}
    </div>
  )
}
