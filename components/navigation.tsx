"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Package, ShoppingCart, BarChart3, Zap, Settings, TrendingDown, Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Productos", href: "/productos", icon: Package },
  { name: "Ventas", href: "/ventas", icon: ShoppingCart },
  { name: "Egresos", href: "/egresos", icon: TrendingDown },
  { name: "Reportes", href: "/reportes", icon: BarChart3 },
  { name: "Configuración", href: "/configuracion", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Cerrar sidebar móvil al cambiar de ruta
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  if (isMobile) {
    return (
      <>
        {/* Header móvil */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-2">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h2 className="text-lg font-semibold">LDS Proyect</h2>
                      <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <nav className="flex-1 p-4">
                      <ul className="space-y-2">
                        {navigation.map((item) => {
                          const isActive = pathname === item.href
                          return (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={cn(
                                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                                onClick={() => setIsOpen(false)}
                              >
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </nav>
                    <div className="p-4 border-t">
                      <ThemeToggle />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="text-lg font-semibold">LDS Proyect</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Espaciador para el header móvil */}
        <div className="lg:hidden h-16" />
      </>
    )
  }

  // Navegación de escritorio
  return (
    <nav className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col bg-background border-r border-border">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-lg font-semibold">LDS Proyect</h1>
      </div>
      
      <div className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
      
      <div className="border-t border-border p-4">
        <ThemeToggle />
      </div>
    </nav>
  )
}
