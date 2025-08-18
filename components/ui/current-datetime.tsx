"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function CurrentDateTime() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
  }

  const formatTime = (date: Date) => {
    return format(date, "HH:mm:ss")
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span className="capitalize">{formatDate(currentDateTime)}</span>
      </div>
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="font-mono">{formatTime(currentDateTime)}</span>
      </div>
    </div>
  )
}
