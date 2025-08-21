"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, Target, X, Check, Bell, BellOff } from "lucide-react"
import { useMarginAlerts } from "@/hooks/use-margin-alerts"

interface AlertsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AlertsPanel({ isOpen, onClose }: AlertsPanelProps) {
  const [mostrarSoloNoLeidas, setMostrarSoloNoLeidas] = useState(true)
  
  const {
    alertas,
    marcarAlertaLeida,
    marcarTodasLeidas,
    eliminarAlerta,
    obtenerEstadisticas,
    obtenerAlertasPorTipo
  } = useMarginAlerts()

  const estadisticas = obtenerEstadisticas()
  const alertasFiltradas = mostrarSoloNoLeidas 
    ? alertas.filter(a => !a.leida)
    : alertas

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'low':
        return <TrendingDown className="h-5 w-5 text-orange-600" />
      case 'warning':
        return <Target className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getAlertColor = (tipo: string) => {
    switch (tipo) {
      case 'critical':
        return "border-red-200 bg-red-50"
      case 'low':
        return "border-orange-200 bg-orange-50"
      case 'warning':
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getAlertBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'critical':
        return "bg-red-100 text-red-800 border-red-200"
      case 'low':
        return "bg-orange-100 text-orange-800 border-orange-200"
      case 'warning':
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-6 w-6 text-red-600" />
              <div>
                <CardTitle className="text-red-800">Panel de Alertas de Márgenes</CardTitle>
                <CardDescription className="text-red-600">
                  {estadisticas.total} alerta{estadisticas.total !== 1 ? 's' : ''} • {estadisticas.noLeidas} pendiente{estadisticas.noLeidas !== 1 ? 's' : ''}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMostrarSoloNoLeidas(!mostrarSoloNoLeidas)}
                className="text-xs"
              >
                {mostrarSoloNoLeidas ? <BellOff className="h-4 w-4 mr-1" /> : <Bell className="h-4 w-4 mr-1" />}
                {mostrarSoloNoLeidas ? 'Mostrar Todas' : 'Solo Pendientes'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={marcarTodasLeidas}
                className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              >
                <Check className="h-4 w-4 mr-1" />
                Marcar Todas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="max-h-[70vh] overflow-y-auto">
            {alertasFiltradas.length === 0 ? (
              <div className="text-center py-12">
                <BellOff className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {mostrarSoloNoLeidas ? 'No hay alertas pendientes' : 'No hay alertas'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {alertasFiltradas.map((alerta) => (
                  <div
                    key={alerta.id}
                    className={`p-4 rounded-lg border ${getAlertColor(alerta.tipo)} ${
                      alerta.leida ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 mt-1">
                          {getAlertIcon(alerta.tipo)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getAlertBadgeColor(alerta.tipo)}`}
                            >
                              {alerta.tipo === 'critical' ? 'CRÍTICO' :
                               alerta.tipo === 'low' ? 'BAJO' : 'ADVERTENCIA'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDate(alerta.fecha)}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {alerta.productoNombre}
                          </p>
                          <p className="text-sm text-gray-600">
                            {alerta.mensaje}
                          </p>
                          <div className="mt-2 text-xs text-gray-500">
                            Margen: {alerta.porcentajeMargen.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!alerta.leida && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => marcarAlertaLeida(alerta.id)}
                            className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Leída
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => eliminarAlerta(alerta.id)}
                          className="text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

