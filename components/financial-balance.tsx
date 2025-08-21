"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Minus, Plus, Target, PieChart } from "lucide-react"
import type { BalanceFinanciero } from "@/lib/financial-metrics"

interface FinancialBalanceProps {
  balance: BalanceFinanciero
}

export function FinancialBalance({ balance }: FinancialBalanceProps) {
  const getTrendIcon = (valor: number) => {
    return valor >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getTrendColor = (valor: number) => {
    return valor >= 0 ? "text-green-600" : "text-red-600"
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      {/* Resumen Ejecutivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Ganancia Neta</CardTitle>
            <CardDescription className="text-green-100">Después de todos los gastos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{formatCurrency(balance.gananciaNeta)}</div>
                <div className="text-sm text-green-100">
                  {balance.gananciaNeta >= 0 ? '+' : ''}{balance.tendenciaGanancia}% vs anterior
                </div>
              </div>
              <DollarSign className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Margen Neto</CardTitle>
            <CardDescription className="text-blue-100">Porcentaje de ganancia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{formatPercentage(balance.margenNeto)}</div>
                <div className="text-sm text-blue-100">
                  {balance.margenBruto.toFixed(2)}% bruto
                </div>
              </div>
              <Target className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Flujo de Caja</CardTitle>
            <CardDescription className="text-purple-100">Ingresos - Egresos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {formatCurrency(balance.ingresosTotales - balance.egresosTotales)}
                </div>
                <div className="text-sm text-purple-100">
                  {balance.tendenciaIngresos}% vs anterior
                </div>
              </div>
              <PieChart className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalle del Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingresos y Costos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Ingresos y Costos</CardTitle>
            <CardDescription>Desglose de ingresos y costos de productos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-green-600" />
                <span className="font-medium">Ingresos Totales</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(balance.ingresosTotales)}
                </div>
                <div className={`text-sm flex items-center ${getTrendColor(balance.tendenciaIngresos)}`}>
                  {getTrendIcon(balance.tendenciaIngresos)}
                  <span className="ml-1">
                    {balance.tendenciaIngresos >= 0 ? '+' : ''}{balance.tendenciaIngresos}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Minus className="h-5 w-5 text-red-600" />
                <span className="font-medium">Costos de Productos</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-600">
                  {formatCurrency(balance.costosProductos)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatPercentage((balance.costosProductos / balance.ingresosTotales) * 100)} de ingresos
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Ganancia Bruta</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(balance.gananciaBruta)}
                </div>
                <div className="text-sm text-gray-500">
                  Margen: {formatPercentage(balance.margenBruto)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Egresos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Egresos por Categoría</CardTitle>
            <CardDescription>Desglose de gastos operativos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    Operativo
                  </Badge>
                  <span className="text-sm">Alquiler, servicios, etc.</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(balance.egresosOperativos)}</div>
                  <div className="text-xs text-gray-500">
                    {formatPercentage((balance.egresosOperativos / balance.egresosTotales) * 100)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Administrativo
                  </Badge>
                  <span className="text-sm">Salarios, oficina, etc.</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(balance.egresosAdministrativos)}</div>
                  <div className="text-xs text-gray-500">
                    {formatPercentage((balance.egresosAdministrativos / balance.egresosTotales) * 100)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    Marketing
                  </Badge>
                  <span className="text-sm">Publicidad, promociones</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(balance.egresosMarketing)}</div>
                  <div className="text-xs text-gray-500">
                    {formatPercentage((balance.egresosMarketing / balance.egresosTotales) * 100)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Otros
                  </Badge>
                  <span className="text-sm">Gastos varios</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(balance.egresosOtros)}</div>
                  <div className="text-xs text-gray-500">
                    {formatPercentage((balance.egresosOtros / balance.egresosTotales) * 100)}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total Egresos</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">
                    {formatCurrency(balance.egresosTotales)}
                  </div>
                  <div className={`text-sm flex items-center ${getTrendColor(balance.tendenciaEgresos)}`}>
                    {getTrendIcon(balance.tendenciaEgresos)}
                    <span className="ml-1">
                      {balance.tendenciaEgresos >= 0 ? '+' : ''}{balance.tendenciaEgresos}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen Final */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Resumen del Período</CardTitle>
          <CardDescription className="text-gray-600">
            {balance.periodo} - {balance.fechaInicio.toLocaleDateString('es-AR')} a {balance.fechaFin.toLocaleDateString('es-AR')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(balance.ingresosTotales)}
              </div>
              <div className="text-sm text-gray-600">Ingresos Totales</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(balance.costosTotales)}
              </div>
              <div className="text-sm text-gray-600">Costos Totales</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(balance.gananciaBruta)}
              </div>
              <div className="text-sm text-gray-600">Ganancia Bruta</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(balance.gananciaNeta)}
              </div>
              <div className="text-sm text-gray-600">Ganancia Neta</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
