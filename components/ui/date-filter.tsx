"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

export interface DateFilterProps {
  onDateRangeChange: (range: DateRange | undefined) => void
  onQuickFilterChange: (filter: string) => void
  selectedRange?: DateRange
  selectedQuickFilter: string
  className?: string
}

export function DateFilter({
  onDateRangeChange,
  onQuickFilterChange,
  selectedRange,
  selectedQuickFilter,
  className = ""
}: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleQuickFilter = (filter: string) => {
    onQuickFilterChange(filter)
    
    let range: DateRange | undefined
    
    switch (filter) {
      case "hoy":
        const hoy = new Date()
        range = {
          from: startOfDay(hoy),
          to: endOfDay(hoy)
        }
        break
      case "ayer":
        const ayer = subDays(new Date(), 1)
        range = {
          from: startOfDay(ayer),
          to: endOfDay(ayer)
        }
        break
      case "semana":
        const ahora = new Date()
        range = {
          from: startOfWeek(ahora, { weekStartsOn: 1 }),
          to: endOfWeek(ahora, { weekStartsOn: 1 })
        }
        break
      case "mes":
        const mesActual = new Date()
        range = {
          from: new Date(mesActual.getFullYear(), mesActual.getMonth(), 1),
          to: new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0)
        }
        break
      case "personalizado":
        setIsOpen(true)
        return
      default:
        range = undefined
    }
    
    onDateRangeChange(range)
  }

  const getQuickFilterLabel = (filter: string) => {
    switch (filter) {
      case "hoy": return "Hoy"
      case "ayer": return "Ayer"
      case "semana": return "Esta Semana"
      case "mes": return "Este Mes"
      case "personalizado": return "Personalizado"
      default: return filter
    }
  }

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 ${className}`}>
      {/* Botones de filtro rápido */}
      <div className="flex flex-wrap gap-2">
        {["hoy", "ayer", "semana", "mes"].map((filter) => (
          <Button
            key={filter}
            variant={selectedQuickFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter(filter)}
            className="text-xs"
          >
            {getQuickFilterLabel(filter)}
          </Button>
        ))}
        
        <Button
          variant={selectedQuickFilter === "personalizado" ? "default" : "outline"}
          size="sm"
          onClick={() => handleQuickFilter("personalizado")}
          className="text-xs"
        >
          Personalizado
        </Button>
      </div>

      {/* Selector de fechas personalizadas */}
      {selectedQuickFilter === "personalizado" && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-transparent">
              <Calendar className="mr-2 h-4 w-4" />
              {selectedRange?.from ? (
                selectedRange.to ? (
                  <>
                    {format(selectedRange.from, "dd/MM", { locale: es })} -{" "}
                    {format(selectedRange.to, "dd/MM", { locale: es })}
                  </>
                ) : (
                  format(selectedRange.from, "dd/MM/yyyy", { locale: es })
                )
              ) : (
                "Seleccionar fechas"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={selectedRange?.from}
              selected={selectedRange}
              onSelect={(range) => {
                onDateRangeChange(range)
                if (range?.from && range?.to) {
                  setIsOpen(false)
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
