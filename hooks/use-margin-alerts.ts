import { useState, useEffect, useCallback } from 'react'
import { useToast } from './use-toast'

interface ProductoMargen {
  id: string
  nombre: string
  precio: number
  costo: number
  porcentajeMargen: number
  categoria: string
}

interface MargenAlert {
  id: string
  productoId: string
  productoNombre: string
  tipo: 'critical' | 'low' | 'warning'
  porcentajeMargen: number
  mensaje: string
  fecha: Date
  leida: boolean
}

export function useMarginAlerts() {
  const [alertas, setAlertas] = useState<MargenAlert[]>([])
  const [productosConAlerta, setProductosConAlerta] = useState<ProductoMargen[]>([])
  const { toast } = useToast()

  // Configuración de umbrales
  const UMBRALES = {
    CRITICO: 15,    // Menos del 15% es crítico
    BAJO: 25,       // Menos del 25% es bajo
    ADVERTENCIA: 35 // Menos del 35% es advertencia
  }

  // Generar alertas para productos
  const generarAlertas = useCallback((productos: ProductoMargen[]) => {
    const nuevasAlertas: MargenAlert[] = []
    const productosAlertados: ProductoMargen[] = []

    productos.forEach(producto => {
      let tipo: 'critical' | 'low' | 'warning' | null = null
      let mensaje = ''

      if (producto.porcentajeMargen < UMBRALES.CRITICO) {
        tipo = 'critical'
        mensaje = `¡ALERTA CRÍTICA! ${producto.nombre} tiene un margen de solo ${producto.porcentajeMargen.toFixed(1)}%`
      } else if (producto.porcentajeMargen < UMBRALES.BAJO) {
        tipo = 'low'
        mensaje = `Margen bajo: ${producto.nombre} tiene un margen de ${producto.porcentajeMargen.toFixed(1)}%`
      } else if (producto.porcentajeMargen < UMBRALES.ADVERTENCIA) {
        tipo = 'warning'
        mensaje = `Advertencia: ${producto.nombre} tiene un margen de ${producto.porcentajeMargen.toFixed(1)}%`
      }

      if (tipo) {
        const alerta: MargenAlert = {
          id: `alerta-${producto.id}-${Date.now()}`,
          productoId: producto.id,
          productoNombre: producto.nombre,
          tipo,
          porcentajeMargen: producto.porcentajeMargen,
          mensaje,
          fecha: new Date(),
          leida: false
        }

        nuevasAlertas.push(alerta)
        productosAlertados.push(producto)

        // Mostrar notificación toast
        toast({
          title: tipo === 'critical' ? '🚨 Margen Crítico' : 
                 tipo === 'low' ? '⚠️ Margen Bajo' : '⚠️ Advertencia',
          description: mensaje,
          variant: tipo === 'critical' ? 'destructive' : 'default',
          duration: tipo === 'critical' ? 8000 : 5000, // Alertas críticas duran más
        })
      }
    })

    // Agregar nuevas alertas al estado
    setAlertas(prev => [...nuevasAlertas, ...prev])
    setProductosConAlerta(productosAlertados)

    return { alertas: nuevasAlertas, productos: productosAlertados }
  }, [toast])

  // Marcar alerta como leída
  const marcarAlertaLeida = useCallback((alertaId: string) => {
    setAlertas(prev => 
      prev.map(alerta => 
        alerta.id === alertaId 
          ? { ...alerta, leida: true }
          : alerta
      )
    )
  }, [])

  // Marcar todas las alertas como leídas
  const marcarTodasLeidas = useCallback(() => {
    setAlertas(prev => 
      prev.map(alerta => ({ ...alerta, leida: true }))
    )
  }, [])

  // Eliminar alerta
  const eliminarAlerta = useCallback((alertaId: string) => {
    setAlertas(prev => prev.filter(alerta => alerta.id !== alertaId))
  }, [])

  // Limpiar alertas antiguas (más de 7 días)
  const limpiarAlertasAntiguas = useCallback(() => {
    const sieteDiasAtras = new Date()
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7)

    setAlertas(prev => 
      prev.filter(alerta => alerta.fecha > sieteDiasAtras)
    )
  }, [])

  // Obtener estadísticas de alertas
  const obtenerEstadisticas = useCallback(() => {
    const total = alertas.length
    const noLeidas = alertas.filter(a => !a.leida).length
    const criticas = alertas.filter(a => a.tipo === 'critical').length
    const bajas = alertas.filter(a => a.tipo === 'low').length
    const advertencias = alertas.filter(a => a.tipo === 'warning').length

    return {
      total,
      noLeidas,
      criticas,
      bajas,
      advertencias,
      tieneAlertas: total > 0,
      tieneAlertasCriticas: criticas > 0
    }
  }, [alertas])

  // Obtener alertas por tipo
  const obtenerAlertasPorTipo = useCallback((tipo: 'critical' | 'low' | 'warning') => {
    return alertas.filter(alerta => alerta.tipo === tipo)
  }, [alertas])

  // Obtener alertas no leídas
  const obtenerAlertasNoLeidas = useCallback(() => {
    return alertas.filter(alerta => !alerta.leida)
  }, [alertas])

  // Verificar si un producto tiene alertas
  const productoTieneAlertas = useCallback((productoId: string) => {
    return alertas.some(alerta => 
      alerta.productoId === productoId && !alerta.leida
    )
  }, [alertas])

  // Limpiar alertas automáticamente cada día
  useEffect(() => {
    const limpiarDiario = setInterval(() => {
      limpiarAlertasAntiguas()
    }, 24 * 60 * 60 * 1000) // 24 horas

    return () => clearInterval(limpiarDiario)
  }, [limpiarAlertasAntiguas])

  return {
    // Estado
    alertas,
    productosConAlerta,
    
    // Acciones
    generarAlertas,
    marcarAlertaLeida,
    marcarTodasLeidas,
    eliminarAlerta,
    limpiarAlertasAntiguas,
    
    // Consultas
    obtenerEstadisticas,
    obtenerAlertasPorTipo,
    obtenerAlertasNoLeidas,
    productoTieneAlertas,
    
    // Configuración
    UMBRALES
  }
}

