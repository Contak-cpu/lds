"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Calendar, FileText, PieChart } from "lucide-react"
import type { Egreso } from "@/lib/financial-metrics"

interface ExpensesBreakdownProps {
  egresos: Egreso[]
}

export function ExpensesBreakdown({ egresos }: ExpensesBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  const getExpenseTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'operativo':
        return "bg-orange-50 text-orange-700 border-orange-200"
      case 'administrativo':
        return "bg-blue-50 text-blue-700 border-blue-200"
      case 'marketing':
        return "bg-purple-50 text-purple-700 border-purple-200"
      case 'otros':
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getExpenseTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'operativo':
        return "🏪"
      case 'administrativo':
        return "👥"
      case 'marketing':
        return "📢"
      case 'otros':
        return "📋"
      default:
        return "📋"
    }
  }

  // Calcular totales por tipo
  const totalesPorTipo = egresos.reduce((acc, egreso) => {
    if (!acc[egreso.tipo]) {
      acc[egreso.tipo] = 0
    }
    acc[egreso.tipo] += egreso.monto
    return acc
  }, {} as Record<string, number>)

  const totalEgresos = egresos.reduce((sum, e) => sum + e.monto, 0)

  // Ordenar egresos por fecha (más reciente primero)
  const egresosOrdenados = [...egresos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  return (
    <div className="space-y-6">
      {/* Resumen de Egresos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Egresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalEgresos)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Egresos Operativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalesPorTipo.operativo || 0)}
            </div>
            <div className="text-sm text-orange-100">
              {formatPercentage((totalesPorTipo.operativo || 0) / totalEgresos * 100)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Egresos Administrativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalesPorTipo.administrativo || 0)}
            </div>
            <div className="text-sm text-blue-100">
              {formatPercentage((totalesPorTipo.administrativo || 0) / totalEgresos * 100)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Egresos Marketing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalesPorTipo.marketing || 0)}
            </div>
            <div className="text-sm text-purple-100">
              {formatPercentage((totalesPorTipo.marketing || 0) / totalEgresos * 100)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de Egresos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Egresos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Detalle de Egresos</span>
            </CardTitle>
            <CardDescription>Lista completa de gastos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {egresosOrdenados.map((egreso) => (
                <div key={egreso.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="text-2xl">{getExpenseTypeIcon(egreso.tipo)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {egreso.descripcion}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getExpenseTypeColor(egreso.tipo)}`}
                        >
                          {egreso.tipo.charAt(0).toUpperCase() + egreso.tipo.slice(1)}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(egreso.fecha)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-semibold text-red-600">
                      {formatCurrency(egreso.monto)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de Distribución */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Distribución por Tipo</span>
            </CardTitle>
            <CardDescription>Porcentaje de gastos por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(totalesPorTipo).map(([tipo, monto]) => (
                <div key={tipo} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getExpenseTypeIcon(tipo)}</span>
                      <span className="font-medium capitalize">{tipo}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(monto)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPercentage((monto / totalEgresos) * 100)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${(monto / totalEgresos) * 100}%`,
                        backgroundColor: tipo === 'operativo' ? '#f97316' :
                                       tipo === 'administrativo' ? '#3b82f6' :
                                       tipo === 'marketing' ? '#8b5cf6' : '#6b7280'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total General</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">
                    {formatCurrency(totalEgresos)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {egresos.length} egresos registrados
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis de Tendencias */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Análisis de Egresos</CardTitle>
          <CardDescription className="text-gray-600">
            Información clave sobre el gasto del negocio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(Math.max(...egresos.map(e => e.monto)))}
              </div>
              <div className="text-sm text-gray-600">Egreso Más Alto</div>
              <div className="text-xs text-gray-500 mt-1">
                {egresos.find(e => e.monto === Math.max(...egresos.map(e => e.monto)))?.descripcion}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalEgresos / egresos.length)}
              </div>
              <div className="text-sm text-gray-600">Promedio por Egreso</div>
              <div className="text-xs text-gray-500 mt-1">
                {egresos.length} egresos en total
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(totalesPorTipo).length}
              </div>
              <div className="text-sm text-gray-600">Tipos de Egresos</div>
              <div className="text-xs text-gray-500 mt-1">
                Categorías diferentes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}
