"use client"

import { MobileNavigation } from "./mobile-navigation"
import { Zap } from "lucide-react"

export function MobileHeader() {
  return (
    <header className="lg:hidden bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="bg-green-600 p-2 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Los de Siempre Sneakers</h1>
            <p className="text-xs text-green-600">Tu estilo deportivo</p>
          </div>
        </div>
        <MobileNavigation />
      </div>
    </header>
  )
}
