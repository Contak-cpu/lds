"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestTema() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Prueba de Tema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-card-foreground">
              Esta es una página de prueba para verificar que el cambio de tema funcione correctamente.
            </p>
            
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
              <span className="text-card-foreground">Toggle de Tema:</span>
              <ThemeToggle />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary text-primary-foreground rounded-lg">
                <p className="font-semibold">Primary</p>
                <p className="text-sm opacity-90">Color primario del tema</p>
              </div>
              
              <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
                <p className="font-semibold">Secondary</p>
                <p className="text-sm opacity-90">Color secundario del tema</p>
              </div>
              
              <div className="p-4 bg-muted text-muted-foreground rounded-lg">
                <p className="font-semibold">Muted</p>
                <p className="text-sm opacity-90">Color silenciado del tema</p>
              </div>
              
              <div className="p-4 bg-accent text-accent-foreground rounded-lg">
                <p className="font-semibold">Accent</p>
                <p className="text-sm opacity-90">Color de acento del tema</p>
              </div>
            </div>
            
            <div className="p-4 bg-destructive text-destructive-foreground rounded-lg">
              <p className="font-semibold">Destructive</p>
              <p className="text-sm opacity-90">Color destructivo del tema</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
