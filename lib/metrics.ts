import { createClient } from "@/lib/supabase/client"

export interface MetricasDashboard {
  ventasHoy: number
  clientesActivos: number
  productosEnStock: number
  pedidosPendientes: number
  cambioVentasHoy: number
  nuevosClientesSemana: number
  productosStockBajo: number
  pedidosRequierenAtencion: number
}

export interface VentaPorPeriodo {
  periodo: string
  ventas: number
  pedidos: number
}

export interface ProductoMasVendido {
  nombre: string
  ventas: number
  ingresos: number
  color: string
}

export interface CategoriaVenta {
  categoria: string
  valor: number
  color: string
}

export interface VentaPorMes {
  mes: string
  ventas: number
  clientes: number
}

export class MetricsService {
  private supabase = createClient()

  async getMetricasDashboard(fechaInicio?: Date, fechaFin?: Date): Promise<MetricasDashboard> {
    try {
      const hoy = new Date()
      const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      const ayer = new Date(inicioHoy.getTime() - 24 * 60 * 60 * 1000)
      const inicioSemana = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)

      // Si se proporcionan fechas personalizadas, usarlas para el cálculo
      let fechaInicioCalculo = fechaInicio || inicioHoy
      let fechaFinCalculo = fechaFin || new Date(inicioHoy.getTime() + 24 * 60 * 60 * 1000)

      // Ventas del período seleccionado
      const { data: ventasPeriodo, error: errorVentasPeriodo } = await this.supabase
        .from("ventas")
        .select("total")
        .gte("fecha_venta", fechaInicioCalculo.toISOString())
        .lt("fecha_venta", fechaFinCalculo.toISOString())

      if (errorVentasPeriodo) {
        throw new Error(`Error en ventas del período: ${errorVentasPeriodo.message}`)
      }

      // Ventas de ayer para comparación (si no es el período seleccionado)
      let ventasAyer = 0
      if (!fechaInicio || fechaInicio.toDateString() !== ayer.toDateString()) {
        const { data: ventasAyerData, error: errorVentasAyer } = await this.supabase
          .from("ventas")
          .select("total")
          .gte("fecha_venta", ayer.toISOString())
          .lt("fecha_venta", inicioHoy.toISOString())

        if (errorVentasAyer) {
          throw new Error(`Error en ventas de ayer: ${errorVentasAyer.message}`)
        }
        ventasAyer = ventasAyerData?.reduce((sum: number, v: { total: number | null }) => sum + (v.total || 0), 0) || 0
      }

      // Clientes activos (con ventas en los últimos 30 días)
      const { data: clientesActivos, error: errorClientes } = await this.supabase
        .from("ventas")
        .select("cliente_id")
        .gte("fecha_venta", new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .not("cliente_id", "is", null)

      if (errorClientes) {
        throw new Error(`Error en clientes activos: ${errorClientes.message}`)
      }

      // Productos en stock
      const { data: productosStock, error: errorProductos } = await this.supabase
        .from("productos")
        .select("stock")
        .eq("activo", true)

      if (errorProductos) {
        throw new Error(`Error en productos: ${errorProductos.message}`)
      }

      // Calcular métricas
      const ventasPeriodoTotal = ventasPeriodo?.reduce((sum: number, v: { total: number | null }) => sum + (v.total || 0), 0) || 0
      const cambioVentas = ventasAyer > 0 ? ((ventasPeriodoTotal - ventasAyer) / ventasAyer) * 100 : 0

      const resultado = {
        ventasHoy: ventasPeriodoTotal,
        clientesActivos: new Set(clientesActivos?.map((v: { cliente_id: string }) => v.cliente_id)).size || 0,
        productosEnStock: productosStock?.reduce((sum: number, p: { stock: number | null }) => sum + (p.stock || 0), 0) || 0,
        pedidosPendientes: 0, // Por implementar
        cambioVentasHoy: cambioVentas,
        nuevosClientesSemana: 0, // Por implementar
        productosStockBajo: productosStock?.filter((p: { stock: number | null }) => (p.stock || 0) < 10).length || 0,
        pedidosRequierenAtencion: 0, // Por implementar
      }

      return resultado
    } catch (error) {
      console.error("Error obteniendo métricas del dashboard:", error)
      return {
        ventasHoy: 0,
        clientesActivos: 0,
        productosEnStock: 0,
        pedidosPendientes: 0,
        cambioVentasHoy: 0,
        nuevosClientesSemana: 0,
        productosStockBajo: 0,
        pedidosRequierenAtencion: 0,
      }
    }
  }

  async getVentasPorPeriodo(periodo: "hoy" | "semana" | "mes" | "año", fechaInicio?: Date, fechaFin?: Date): Promise<VentaPorPeriodo[]> {
    try {
      let query = this.supabase.from("ventas").select("total, fecha_venta")
      
      // Si se proporcionan fechas personalizadas, usarlas
      if (fechaInicio && fechaFin) {
        query = query
          .gte("fecha_venta", fechaInicio.toISOString())
          .lte("fecha_venta", fechaFin.toISOString())
      } else {
        // Usar el período predefinido
        const hoy = new Date()
        let fechaInicioPeriodo: Date
        let formatoPeriodo: string

        switch (periodo) {
          case "hoy":
            fechaInicioPeriodo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
            formatoPeriodo = "HH:mm"
            break
          case "semana":
            fechaInicioPeriodo = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)
            formatoPeriodo = "EEE"
            break
          case "mes":
            fechaInicioPeriodo = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
            formatoPeriodo = "dd"
            break
          case "año":
            fechaInicioPeriodo = new Date(hoy.getFullYear(), 0, 1)
            formatoPeriodo = "MMM"
            break
          default:
            fechaInicioPeriodo = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)
            formatoPeriodo = "EEE"
        }
        
        query = query.gte("fecha_venta", fechaInicioPeriodo.toISOString())
      }

      const { data: ventas, error } = await query

      if (error) throw error

      const ventasPorPeriodo = new Map<string, { ventas: number; pedidos: number }>()

      ventas?.forEach((venta: { total: number | null; fecha_venta: string }) => {
        const fecha = new Date(venta.fecha_venta)
        let periodoFormateado: string

        if (fechaInicio && fechaFin) {
          // Para fechas personalizadas, usar el día
          periodoFormateado = fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" })
        } else {
          // Para períodos predefinidos, usar el formato original
          switch (periodo) {
            case "hoy":
              periodoFormateado = fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
              break
            case "semana":
              periodoFormateado = fecha.toLocaleDateString("es-ES", { weekday: "short" })
              break
            case "mes":
              periodoFormateado = fecha.toLocaleDateString("es-ES", { day: "2-digit" })
              break
            case "año":
              periodoFormateado = fecha.toLocaleDateString("es-ES", { month: "short" })
              break
            default:
              periodoFormateado = fecha.toLocaleDateString("es-ES", { weekday: "short" })
          }
        }

        const actual = ventasPorPeriodo.get(periodoFormateado) || { ventas: 0, pedidos: 0 }
        actual.ventas += venta.total || 0
        actual.pedidos += 1
        ventasPorPeriodo.set(periodoFormateado, actual)
      })

      return Array.from(ventasPorPeriodo.entries()).map(([periodo, datos]: [string, { ventas: number; pedidos: number }]) => ({
        periodo,
        ventas: datos.ventas,
        pedidos: datos.pedidos,
      }))
    } catch (error) {
      console.error("Error obteniendo ventas por período:", error)
      return []
    }
  }

  async getProductosMasVendidos(fechaInicio?: Date, fechaFin?: Date): Promise<ProductoMasVendido[]> {
    try {
      let query = this.supabase
        .from("venta_items")
        .select("producto_nombre, cantidad, precio_unitario, created_at")

      // Si se proporcionan fechas, filtrar por ellas
      if (fechaInicio && fechaFin) {
        query = query
          .gte("created_at", fechaInicio.toISOString())
          .lte("created_at", fechaFin.toISOString())
      } else {
        // Por defecto, últimos 30 días
        query = query.gte("created_at", new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString())
      }

      const { data: ventaItems, error } = await query

      if (error) throw error

      const productosMap = new Map<string, { ventas: number; ingresos: number }>()

      ventaItems?.forEach((item: { producto_nombre: string; cantidad: number; precio_unitario: number }) => {
        const actual = productosMap.get(item.producto_nombre) || { ventas: 0, ingresos: 0 }
        actual.ventas += item.cantidad
        actual.ingresos += item.cantidad * item.precio_unitario
        productosMap.set(item.producto_nombre, actual)
      })

      const colores = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"]

      return Array.from(productosMap.entries())
        .map(([nombre, datos]: [string, { ventas: number; ingresos: number }], index: number) => ({
          nombre,
          ventas: datos.ventas,
          ingresos: datos.ingresos,
          color: colores[index % colores.length],
        }))
        .sort((a, b) => b.ventas - a.ventas)
        .slice(0, 5)
    } catch (error) {
      console.error("Error obteniendo productos más vendidos:", error)
      return []
    }
  }

  async getVentasPorCategoria(fechaInicio?: Date, fechaFin?: Date): Promise<CategoriaVenta[]> {
    try {
      let query = this.supabase
        .from("venta_items")
        .select(`
          cantidad,
          precio_unitario,
          productos!inner(categoria),
          created_at
        `)

      // Si se proporcionan fechas, filtrar por ellas
      if (fechaInicio && fechaFin) {
        query = query
          .gte("created_at", fechaInicio.toISOString())
          .lte("created_at", fechaFin.toISOString())
      } else {
        // Por defecto, últimos 30 días
        query = query.gte("created_at", new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString())
      }

      const { data: ventaItems, error } = await query

      if (error) throw error

      const categoriasMap = new Map<string, number>()

      ventaItems?.forEach((item: { cantidad: number; precio_unitario: number; productos: { categoria: string } | null }) => {
        const categoria = item.productos?.categoria || "Sin categoría"
        const actual = categoriasMap.get(categoria) || 0
        categoriasMap.set(categoria, actual + (item.cantidad * item.precio_unitario))
      })

      const total = Array.from(categoriasMap.values()).reduce((sum: number, valor: number) => sum + valor, 0)
      const colores = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"]

      return Array.from(categoriasMap.entries())
        .map(([categoria, valor]: [string, number], index: number) => ({
          categoria,
          valor: Math.round((valor / total) * 100),
          color: colores[index % colores.length],
        }))
        .sort((a, b) => b.valor - a.valor)
    } catch (error) {
      console.error("Error obteniendo ventas por categoría:", error)
      return []
    }
  }

  async getVentasPorMes(fechaInicio?: Date, fechaFin?: Date): Promise<VentaPorMes[]> {
    try {
      let query = this.supabase
        .from("ventas")
        .select("total, fecha_venta, cliente_id")

      // Si se proporcionan fechas, filtrar por ellas
      if (fechaInicio && fechaFin) {
        query = query
          .gte("fecha_venta", fechaInicio.toISOString())
          .lte("fecha_venta", fechaFin.toISOString())
      } else {
        // Por defecto, año actual
        query = query.gte("fecha_venta", new Date(new Date().getFullYear(), 0, 1).toISOString())
      }

      const { data: ventas, error } = await query.order("fecha_venta", { ascending: true })

      if (error) throw error

      const ventasPorMes = new Map<string, { ventas: number; clientes: Set<string> }>()

      ventas?.forEach((venta: { total: number | null; fecha_venta: string; cliente_id: string | null }) => {
        const fecha = new Date(venta.fecha_venta)
        const mes = fecha.toLocaleDateString("es-ES", { month: "long" })
        
        const actual = ventasPorMes.get(mes) || { ventas: 0, clientes: new Set<string>() }
        actual.ventas += venta.total || 0
        if (venta.cliente_id) {
          actual.clientes.add(venta.cliente_id)
        }
        ventasPorMes.set(mes, actual)
      })

      return Array.from(ventasPorMes.entries()).map(([mes, datos]: [string, { ventas: number; clientes: Set<string> }]) => ({
        mes,
        ventas: datos.ventas,
        clientes: datos.clientes.size,
      }))
    } catch (error) {
      console.error("Error obteniendo ventas por mes:", error)
      return []
    }
  }

  async getMetricasReporte(periodo: "hoy" | "semana" | "mes" | "año", fechaInicio?: Date, fechaFin?: Date): Promise<{
    ventasTotales: { valor: number; cambio: number; tipo: "aumento" | "disminucion" }
    pedidos: { valor: number; cambio: number; tipo: "aumento" | "disminucion" }
    clientesNuevos: { valor: number; cambio: number; tipo: "aumento" | "disminucion" }
    ticketPromedio: { valor: number; cambio: number; tipo: "aumento" | "disminucion" }
    tasaConversion: { valor: number; cambio: number; tipo: "aumento" | "disminucion" }
  }> {
    try {
      let fechaInicioPeriodo: Date
      let fechaFinPeriodo: Date
      let fechaInicioAnterior: Date
      let fechaFinAnterior: Date

      if (fechaInicio && fechaFin) {
        // Usar fechas personalizadas
        fechaInicioPeriodo = fechaInicio
        fechaFinPeriodo = fechaFin
        
        // Calcular período anterior de la misma duración
        const duracionPeriodo = fechaFin.getTime() - fechaInicio.getTime()
        fechaFinAnterior = fechaInicio
        fechaInicioAnterior = new Date(fechaInicio.getTime() - duracionPeriodo)
      } else {
        // Usar períodos predefinidos
        const hoy = new Date()
        const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
        const ayer = new Date(inicioHoy.getTime() - 24 * 60 * 60 * 1000)
        const inicioSemana = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)

        switch (periodo) {
          case "hoy":
            fechaInicioPeriodo = inicioHoy
            fechaFinPeriodo = new Date(inicioHoy.getTime() + 24 * 60 * 60 * 1000)
            fechaInicioAnterior = ayer
            fechaFinAnterior = inicioHoy
            break
          case "semana":
            fechaInicioPeriodo = inicioSemana
            fechaFinPeriodo = hoy
            fechaInicioAnterior = new Date(inicioSemana.getTime() - 7 * 24 * 60 * 60 * 1000)
            fechaFinAnterior = inicioSemana
            break
          case "mes":
            fechaInicioPeriodo = inicioMes
            fechaFinPeriodo = hoy
            fechaInicioAnterior = inicioMesAnterior
            fechaFinAnterior = inicioMes
            break
          case "año":
            fechaInicioPeriodo = new Date(hoy.getFullYear(), 0, 1)
            fechaFinPeriodo = hoy
            fechaInicioAnterior = new Date(hoy.getFullYear() - 1, 0, 1)
            fechaFinAnterior = new Date(hoy.getFullYear(), 0, 1)
            break
          default:
            fechaInicioPeriodo = inicioSemana
            fechaFinPeriodo = hoy
            fechaInicioAnterior = new Date(inicioSemana.getTime() - 7 * 24 * 60 * 60 * 1000)
            fechaFinAnterior = inicioSemana
        }
      }

      // Ventas del período actual vs anterior
      const [ventasPeriodoActual, ventasPeriodoAnterior] = await Promise.all([
        this.supabase
          .from("ventas")
          .select("total")
          .gte("fecha_venta", fechaInicioPeriodo.toISOString())
          .lte("fecha_venta", fechaFinPeriodo.toISOString()),
        this.supabase
          .from("ventas")
          .select("total")
          .gte("fecha_venta", fechaInicioAnterior.toISOString())
          .lte("fecha_venta", fechaFinAnterior.toISOString()),
      ])

      // Clientes nuevos del período actual vs anterior
      const [clientesPeriodoActual, clientesPeriodoAnterior] = await Promise.all([
        this.supabase
          .from("clientes")
          .select("id")
          .gte("fecha_registro", fechaInicioPeriodo.toISOString())
          .lte("fecha_registro", fechaFinPeriodo.toISOString()),
        this.supabase
          .from("clientes")
          .select("id")
          .gte("fecha_registro", fechaInicioAnterior.toISOString())
          .lte("fecha_registro", fechaFinAnterior.toISOString()),
      ])

      // Calcular totales y cambios
      const totalVentasActual = ventasPeriodoActual.data?.reduce((sum: number, v: { total: number | null }) => sum + (v.total || 0), 0) || 0
      const totalVentasAnterior = ventasPeriodoAnterior.data?.reduce((sum: number, v: { total: number | null }) => sum + (v.total || 0), 0) || 0
      const cambioVentas = totalVentasAnterior > 0 ? ((totalVentasActual - totalVentasAnterior) / totalVentasAnterior) * 100 : 0

      const totalClientesActual = clientesPeriodoActual.data?.length || 0
      const totalClientesAnterior = clientesPeriodoAnterior.data?.length || 0
      const cambioClientes = totalClientesAnterior > 0 ? ((totalClientesActual - totalClientesAnterior) / totalClientesAnterior) * 100 : 0

      // Ticket promedio
      const ticketPromedio = ventasPeriodoActual.data?.length > 0 ? totalVentasActual / ventasPeriodoActual.data.length : 0
      const ticketPromedioAnterior = ventasPeriodoAnterior.data?.length > 0 ? totalVentasAnterior / ventasPeriodoAnterior.data.length : 0
      const cambioTicket = ticketPromedioAnterior > 0 ? ((ticketPromedio - ticketPromedioAnterior) / ticketPromedioAnterior) * 100 : 0

      return {
        ventasTotales: {
          valor: totalVentasActual,
          cambio: Math.round(cambioVentas * 100) / 100,
          tipo: cambioVentas >= 0 ? "aumento" : "disminucion",
        },
        pedidos: {
          valor: ventasPeriodoActual.data?.length || 0,
          cambio: Math.round(cambioVentas * 100) / 100,
          tipo: cambioVentas >= 0 ? "aumento" : "disminucion",
        },
        clientesNuevos: {
          valor: totalClientesActual,
          cambio: Math.round(cambioClientes * 100) / 100,
          tipo: cambioClientes >= 0 ? "aumento" : "disminucion",
        },
        ticketPromedio: {
          valor: Math.round(ticketPromedio * 100) / 100,
          cambio: Math.round(cambioTicket * 100) / 100,
          tipo: cambioTicket >= 0 ? "aumento" : "disminucion",
        },
        tasaConversion: {
          valor: 0, // Por implementar
          cambio: 0,
          tipo: "aumento",
        },
      }
    } catch (error) {
      console.error("Error obteniendo métricas del reporte:", error)
      return {
        ventasTotales: { valor: 0, cambio: 0, tipo: "aumento" },
        pedidos: { valor: 0, cambio: 0, tipo: "aumento" },
        clientesNuevos: { valor: 0, cambio: 0, tipo: "aumento" },
        ticketPromedio: { valor: 0, cambio: 0, tipo: "aumento" },
        tasaConversion: { valor: 0, cambio: 0, tipo: "aumento" },
      }
    }
  }
}

export const metricsService = new MetricsService() 