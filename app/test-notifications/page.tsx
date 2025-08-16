"use client"

import { Button } from "@/components/ui/button"
import { useNotifications } from "@/hooks/use-notifications"
import { Navigation } from "@/components/navigation"

export default function TestNotificationsPage() {
  const { 
    showSuccess, 
    showError, 
    showProductoCreated,
    showClienteCreated,
    showVentaCreated,
    showEgresoCreated
  } = useNotifications()

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Prueba de Notificaciones</h1>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => showSuccess("✅ Éxito", "Esta es una notificación de éxito")}
              className="bg-green-600 hover:bg-green-700"
            >
              Mostrar Éxito
            </Button>
            
            <Button 
              onClick={() => showError("❌ Error", "Esta es una notificación de error")}
              variant="destructive"
            >
              Mostrar Error
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={showProductoCreated}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Producto Creado
            </Button>
            
            <Button 
              onClick={showClienteCreated}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Cliente Creado
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={showVentaCreated}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Venta Creada
            </Button>
            
            <Button 
              onClick={showEgresoCreated}
              className="bg-red-600 hover:bg-red-700"
            >
              Egreso Creado
            </Button>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Instrucciones:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Haz clic en cualquier botón para probar las notificaciones</li>
            <li>Las notificaciones deberían aparecer en la esquina superior derecha</li>
            <li>Verifica que se muestren tanto el título como la descripción</li>
            <li>El texto debería ser claramente visible en ambos temas (claro y oscuro)</li>
            <li>Las notificaciones deberían cerrarse automáticamente después de 5 segundos</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
