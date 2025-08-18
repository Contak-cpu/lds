import { useState, useCallback } from "react"
import type { DateRange } from "react-day-picker"
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek } from "date-fns"

export interface DateFilterState {
  selectedRange: DateRange | undefined
  selectedQuickFilter: string
}

export interface DateFilterActions {
  setSelectedRange: (range: DateRange | undefined) => void
  setSelectedQuickFilter: (filter: string) => void
  getFilteredDateRange: () => DateRange | undefined
  resetFilter: () => void
}

export function useDateFilter(initialFilter: string = "todos"): DateFilterState & DateFilterActions {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()
  const [selectedQuickFilter, setSelectedQuickFilter] = useState(initialFilter)

  const getFilteredDateRange = useCallback((): DateRange | undefined => {
    if (selectedRange?.from) {
      return selectedRange
    }

    switch (selectedQuickFilter) {
      case "hoy":
        const hoy = new Date()
        return {
          from: startOfDay(hoy),
          to: endOfDay(hoy)
        }
      case "ayer":
        const ayer = subDays(new Date(), 1)
        return {
          from: startOfDay(ayer),
          to: endOfDay(ayer)
        }
      case "semana":
        const ahora = new Date()
        return {
          from: startOfWeek(ahora, { weekStartsOn: 1 }),
          to: endOfWeek(ahora, { weekStartsOn: 1 })
        }
      case "mes":
        const mesActual = new Date()
        return {
          from: new Date(mesActual.getFullYear(), mesActual.getMonth(), 1),
          to: new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0)
        }
      default:
        return undefined
    }
  }, [selectedRange, selectedQuickFilter])

  const resetFilter = useCallback(() => {
    setSelectedRange(undefined)
    setSelectedQuickFilter("todos")
  }, [])

  return {
    selectedRange,
    selectedQuickFilter,
    setSelectedRange,
    setSelectedQuickFilter,
    getFilteredDateRange,
    resetFilter
  }
}
