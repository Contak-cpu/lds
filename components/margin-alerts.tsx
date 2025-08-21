"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, DollarSign, Package, Target } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductoConMargen {
  id: string
  nombre: string
  precio: number
  costo: number
  margenGanancia: number
  porcentajeMargen: number
  stock: number
  categoria: string
}

interface MarginAlertsProps {
  productos: ProductoConMargen[]
  onProductClick?: (producto: ProductoConMargen) => void
}

export function MarginAlerts({ productos, onProductClick }: MarginAlertsProps) {
  // Configuración de alertas
  const MARGEN_CRITICO = 15 // Menos del 15% es crítico
  const MARGEN_BAJO = 25    // Menos del 25% es bajo
  const MARGEN_ADVERTENCIA = 35 // Menos del 35% es advertencia

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getMargenSeverity = (porcentaje: number) => {
    if (porcentaje < MARGEN_CRITICO) return "critical"
    if (porcentaje < MARGEN_BAJO) return "low"
    if (porcentaje < MARGEN_ADVERTENCIA) return "warning"
    return "normal"
  }

  const getMargenColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200"
      case "low":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "warning":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-green-50 text-green-700 border-green-200"
    }
  }

  const getMargenIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "low":
        return <TrendingDown className="h-4 w-4 text-orange-600" />
      case "warning":
        return <Target className="h-4 w-4 text-yellow-600" />
      default:
        return <Package className="h-4 w-4 text-green-600" />
    }
  }

  const getMargenTitle = (severity: string) => {
    switch (severity) {
      case "critical":
        return "MARGEN CRÍTICO"
      case "low":
        return "MARGEN BAJO"
      case "warning":
        return "MARGEN ADVERTENCIA"
      default:
        return "MARGEN NORMAL"
    }
  }

  // Filtrar productos por severidad
  const productosCriticos = productos.filter(p => p.porcentajeMargen < MARGEN_CRITICO)
  const productosBajos = productos.filter(p => p.porcentajeMargen >= MARGEN_CRITICO && p.porcentajeMargen < MARGEN_BAJO)
  const productosAdvertencia = productos.filter(p => p.porcentajeMargen >= MARGEN_BAJO && p.porcentajeMargen < MARGEN_ADVERTENCIA)

  // Calcular estadísticas
  const totalProductos = productos.length
  const productosConAlerta = productosCriticos.length + productosBajos.length + productosAdvertencia.length
  const margenPromedio = productos.reduce((sum, p) => sum + p.porcentajeMargen, 0) / totalProductos

  if (productosConAlerta === 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Márgenes Saludables</span>
          </CardTitle>
          <CardDescription className="text-green-600">
            Todos los productos tienen márgenes de ganancia saludables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(margenPromedio)}
            </div>
            <div className="text-sm text-green-600">Margen promedio del negocio</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumen de Alertas */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6" />
            <span>Alertas de Márgenes</span>
          </CardTitle>
          <CardDescription className="text-red-600">
            {productosConAlerta} de {totalProductos} productos requieren atención
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {productosCriticos.length}
              </div>
              <div className="text-sm text-red-600">Críticos</div>
              <div className="text-xs text-red-500">{"<"} {MARGEN_CRITICO}%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {productosBajos.length}
              </div>
              <div className="text-sm text-orange-600">Bajos</div>
              <div className="text-xs text-orange-500">{MARGEN_CRITICO}-{MARGEN_BAJO}%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {productosAdvertencia.length}
              </div>
              <div className="text-sm text-yellow-600">Advertencia</div>
              <div className="text-xs text-yellow-500">{MARGEN_BAJO}-{MARGEN_ADVERTENCIA}%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(margenPromedio)}
              </div>
              <div className="text-sm text-green-600">Promedio</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Productos Críticos */}
      {productosCriticos.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Productos con Margen Crítico</span>
            </CardTitle>
            <CardDescription className="text-red-600">
              Estos productos tienen márgenes menores al {MARGEN_CRITICO}% - Requieren acción inmediata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productosCriticos.map((producto) => (
                <div key={producto.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200 hover:bg-red-25 transition-colors">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {producto.nombre}
                      </div>
                      <div className="text-xs text-gray-500">
                        {producto.categoria} • Stock: {producto.stock}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-semibold text-red-600">
                      {formatPercentage(producto.porcentajeMargen)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Margen crítico
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(producto.precio)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Precio venta
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(producto.costo)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Costo
                    </div>
                  </div>
                  {onProductClick && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onProductClick(producto)}
                      className="ml-4 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    >
                      Revisar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Productos con Margen Bajo */}
      {productosBajos.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center space-x-2">
              <TrendingDown className="h-5 w-5" />
              <span>Productos con Margen Bajo</span>
            </CardTitle>
            <CardDescription className="text-orange-600">
              Estos productos tienen márgenes entre {MARGEN_CRITICO}% y {MARGEN_BAJO}% - Monitorear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productosBajos.map((producto) => (
                <div key={producto.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 hover:bg-orange-25 transition-colors">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 flex-shrink-0">
                      <TrendingDown className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {producto.nombre}
                      </div>
                      <div className="text-xs text-gray-500">
                        {producto.categoria} • Stock: {producto.stock}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-semibold text-orange-600">
                      {formatPercentage(producto.porcentajeMargen)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Margen bajo
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(producto.precio)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Precio venta
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(producto.costo)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Costo
                    </div>
                  </div>
                  {onProductClick && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onProductClick(producto)}
                      className="ml-4 bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                    >
                      Revisar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Productos con Advertencia */}
      {productosAdvertencia.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Productos con Advertencia</span>
            </CardTitle>
            <CardDescription className="text-yellow-600">
              Estos productos tienen márgenes entre {MARGEN_BAJO}% y {MARGEN_ADVERTENCIA}% - Atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productosAdvertencia.map((producto) => (
                <div key={producto.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200 hover:bg-yellow-25 transition-colors">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 flex-shrink-0">
                      <Target className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {producto.nombre}
                      </div>
                      <div className="text-xs text-gray-500">
                        {producto.categoria} • Stock: {producto.stock}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-semibold text-yellow-600">
                      {formatPercentage(producto.porcentajeMargen)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Margen bajo
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(producto.precio)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Precio venta
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(producto.costo)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Costo
                    </div>
                  </div>
                  {onProductClick && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onProductClick(producto)}
                      className="ml-4 bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                    >
                      Revisar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recomendaciones */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Recomendaciones para Mejorar Márgenes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">Acciones Inmediatas:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Revisar precios de venta vs costos</li>
                <li>• Negociar mejores precios con proveedores</li>
                <li>• Considerar descuentos por volumen</li>
                <li>• Analizar competencia y ajustar precios</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800">Estrategias a Largo Plazo:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Optimizar cadena de suministro</li>
                <li>• Buscar alternativas de proveedores</li>
                <li>• Implementar control de inventario</li>
                <li>• Desarrollar productos de mayor margen</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
