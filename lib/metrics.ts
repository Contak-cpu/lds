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

  async getMetricasDashboard(): Promise<MetricasDashboard> {
    try {
      const hoy = new Date()
      const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      const ayer = new Date(inicioHoy.getTime() - 24 * 60 * 60 * 1000)
      const inicioSemana = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)

      // Ventas de hoy
      const { data: ventasHoy, error: errorVentasHoy } = await this.supabase
        .from("ventas")
        .select("total")
        .gte("fecha_venta", inicioHoy.toISOString())
        .lt("fecha_venta", new Date(inicioHoy.getTime() + 24 * 60 * 60 * 1000).toISOString())

      // Ventas de ayer
      const { data: ventasAyer, error: errorVentasAyer } = await this.supabase
        .from("ventas")
        .select("total")
        .gte("fecha_venta", ayer.toISOString())
        .lt("fecha_venta", inicioHoy.toISOString())

      // Clientes activos (con ventas en los últimos 30 días)
      const { data: clientesActivos, error: errorClientes } = await this.supabase
        .from("ventas")
        .select("cliente_id")
        .gte("fecha_venta", new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .not("cliente_id", "is", null)

      // Productos en stock
      const { data: productosStock, error: errorProductos } = await this.supabase
        .from("productos")
        .select("stock")
        .eq("activo", true)

      // Productos con stock bajo
      const { data: productosStockBajo, error: errorStockBajo } = await this.supabase
        .from("productos")
        .select("stock, stock_minimo")
        .eq("activo", true)
        .lt("stock", "stock_minimo")

      // Nuevos clientes esta semana
      const { data: nuevosClientes, error: errorNuevosClientes } = await this.supabase
        .from("clientes")
        .select("id")
        .gte("fecha_registro", inicioSemana.toISOString())

      if (errorVentasHoy || errorVentasAyer || errorClientes || errorProductos || errorStockBajo || errorNuevosClientes) {
        throw new Error("Error al obtener métricas")
      }

      const totalVentasHoy = ventasHoy?.reduce((sum: number, v: { total: number | null }) => sum + (v.total || 0), 0) || 0
      const totalVentasAyer = ventasAyer?.reduce((sum: number, v: { total: number | null }) => sum + (v.total || 0), 0) || 0
      const cambioVentasHoy = totalVentasAyer > 0 ? ((totalVentasHoy - totalVentasAyer) / totalVentasAyer) * 100 : 0

      const clientesUnicos = new Set(clientesActivos?.map((v: { cliente_id: string | null }) => v.cliente_id).filter((id: string | null): id is string => Boolean(id)))
      const totalProductosStock = productosStock?.reduce((sum: number, p: { stock: number | null }) => sum + (p.stock || 0), 0) || 0

      return {
        ventasHoy: totalVentasHoy,
        clientesActivos: clientesUnicos.size,
        productosEnStock: totalProductosStock,
        pedidosPendientes: 0, // Por implementar
        cambioVentasHoy: Math.round(cambioVentasHoy * 100) / 100,
        nuevosClientesSemana: nuevosClientes?.length || 0,
        productosStockBajo: productosStockBajo?.length || 0,
        pedidosRequierenAtencion: 0, // Por implementar
      }
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

  async getVentasPorPeriodo(periodo: "hoy" | "semana" | "mes" | "año"): Promise<VentaPorPeriodo[]> {
    try {
      const hoy = new Date()
      let fechaInicio: Date
      let formatoPeriodo: string

      switch (periodo) {
        case "hoy":
          fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
          formatoPeriodo = "HH:mm"
          break
        case "semana":
          fechaInicio = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)
          formatoPeriodo = "EEE"
          break
        case "mes":
          fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate())
          formatoPeriodo = "'Sem' W"
          break
        case "año":
          fechaInicio = new Date(hoy.getFullYear(), 0, 1)
          formatoPeriodo = "MMM"
          break
        default:
          fechaInicio = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)
          formatoPeriodo = "EEE"
      }

      const { data: ventas, error } = await this.supabase
        .from("ventas")
        .select("total, fecha_venta")
        .gte("fecha_venta", fechaInicio.toISOString())
        .order("fecha_venta", { ascending: true })

      if (error) throw error

      // Agrupar ventas por período
      const ventasPorPeriodo = new Map<string, { ventas: number; pedidos: number }>()

      ventas?.forEach((venta: { total: number | null; fecha_venta: string }) => {
        const fecha = new Date(venta.fecha_venta)
        let periodoFormateado: string

        if (periodo === "hoy") {
          periodoFormateado = fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
        } else if (periodo === "semana") {
          periodoFormateado = fecha.toLocaleDateString("es-ES", { weekday: "short" })
        } else if (periodo === "mes") {
          const semana = Math.ceil((fecha.getDate() + fecha.getDay()) / 7)
          periodoFormateado = `Sem ${semana}`
        } else {
          periodoFormateado = fecha.toLocaleDateString("es-ES", { month: "short" })
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

  async getProductosMasVendidos(): Promise<ProductoMasVendido[]> {
    try {
      const { data: ventaItems, error } = await this.supabase
        .from("venta_items")
        .select("producto_nombre, cantidad, precio_unitario")
        .gte("created_at", new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString())

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

  async getVentasPorCategoria(): Promise<CategoriaVenta[]> {
    try {
      const { data: ventaItems, error } = await this.supabase
        .from("venta_items")
        .select(`
          cantidad,
          precio_unitario,
          productos!inner(categoria)
        `)
        .gte("created_at", new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString())

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

  async getVentasPorMes(): Promise<VentaPorMes[]> {
    try {
      const { data: ventas, error } = await this.supabase
        .from("ventas")
        .select("total, fecha_venta, cliente_id")
        .gte("fecha_venta", new Date(new Date().getFullYear(), 0, 1).toISOString())
        .order("fecha_venta", { ascending: true })

      if (error) throw error

      const ventasPorMes = new Map<string, { ventas: number; clientes: Set<string> }>()

      ventas?.forEach((venta: { total: number | null; fecha_venta: string; cliente_id: string | null }) => {
        const fecha = new Date(venta.fecha_venta)
        const mes = fecha.toLocaleDateString("es-ES", { month: "short" })
        
        const actual = ventasPorMes.get(mes) || { ventas: 0, clientes: new Set() }
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

  async getMetricasReporte(periodo: "hoy" | "semana" | "mes" | "año"): Promise<{
    ventasHoy: { valor: number; cambio: number; tipo: "aumento" | "disminucion" }
    ventasSemana: { valor: number; cambio: number; tipo: "aumento" | "disminucion" }
    ventasMes: { valor: number; cambio: number; tipo: "aumento" | "disminucion" }
    clientesNuevos: { valor: number; cambio: number; tipo: "aumento" | "disminucion" }
    ticketPromedio: { valor: number; cambio: number; tipo: "aumento" | "disminucion" }
    tasaConversion: { valor: number; cambio: number; tipo: "aumento" | "disminucion" }
  }> {
    try {
      const hoy = new Date()
      const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
      const ayer = new Date(inicioHoy.getTime() - 24 * 60 * 60 * 1000)
      const inicioSemana = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
      const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1)

      // Ventas de hoy vs ayer
      const [ventasHoy, ventasAyer] = await Promise.all([
        this.supabase
          .from("ventas")
          .select("total")
          .gte("fecha_venta", inicioHoy.toISOString())
          .lt("fecha_venta", new Date(inicioHoy.getTime() + 24 * 60 * 60 * 1000).toISOString()),
        this.supabase
          .from("ventas")
          .select("total")
          .gte("fecha_venta", ayer.toISOString())
          .lt("fecha_venta", inicioHoy.toISOString()),
      ])

      // Ventas de esta semana vs semana anterior
      const [ventasEstaSemana, ventasSemanaAnterior] = await Promise.all([
        this.supabase
          .from("ventas")
          .select("total")
          .gte("fecha_venta", inicioSemana.toISOString()),
        this.supabase
          .from("ventas")
          .select("total")
          .gte("fecha_venta", new Date(inicioSemana.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .lt("fecha_venta", inicioSemana.toISOString()),
      ])

      // Ventas de este mes vs mes anterior
      const [ventasEsteMes, ventasMesAnterior] = await Promise.all([
        this.supabase
          .from("ventas")
          .select("total")
          .gte("fecha_venta", inicioMes.toISOString()),
        this.supabase
          .from("ventas")
          .select("total")
          .gte("fecha_venta", inicioMesAnterior.toISOString())
          .lt("fecha_venta", inicioMes.toISOString()),
      ])

      // Clientes nuevos esta semana vs semana anterior
      const [clientesEstaSemana, clientesSemanaAnterior] = await Promise.all([
        this.supabase
          .from("clientes")
          .select("id")
          .gte("fecha_registro", inicioSemana.toISOString()),
        this.supabase
          .from("clientes")
          .select("id")
          .gte("fecha_registro", new Date(inicioSemana.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .lt("fecha_registro", inicioSemana.toISOString()),
      ])

      // Calcular totales y cambios
      const totalVentasHoy = ventasHoy.data?.reduce((sum: number, v: { total: number | null }) => sum + (v.total || 0), 0) || 0
      const totalVentasAyer = ventasAyer.data?.reduce((sum: number, v: { total: number | null }) => sum + (v.total || 0), 0) || 0
      const cambioVentasHoy = totalVentasAyer > 0 ? ((totalVentasHoy - totalVentasAyer) / totalVentasAyer) * 100 : 0

      const totalVentasEstaSemana = ventasEstaSemana.data?.reduce((sum: number, v: { total: number | null }) => sum + (v.total || 0), 0) || 0
      const totalVentasSemanaAnterior = ventasSemanaAnterior.data?.reduce((sum: number, v: { total: number | null }) => sum + (v.total || 0), 0) || 0
      const cambioVentasSemana = totalVentasSemanaAnterior > 0 ? ((totalVentasEstaSemana - totalVentasSemanaAnterior) / totalVentasSemanaAnterior) * 100 : 0

      const totalVentasEsteMes = ventasEsteMes.data?.reduce((sum: number, v: { total: number | null }) => sum + (v.total || 0), 0) || 0
      const totalVentasMesAnterior = ventasMesAnterior.data?.reduce((sum: number, v: { total: number | null }) => sum + (v.total || 0), 0) || 0
      const cambioVentasMes = totalVentasMesAnterior > 0 ? ((totalVentasEsteMes - totalVentasMesAnterior) / totalVentasMesAnterior) * 100 : 0

      const totalClientesEstaSemana = clientesEstaSemana.data?.length || 0
      const totalClientesSemanaAnterior = clientesSemanaAnterior.data?.length || 0
      const cambioClientes = totalClientesSemanaAnterior > 0 ? ((totalClientesEstaSemana - totalClientesSemanaAnterior) / totalClientesSemanaAnterior) * 100 : 0

      // Ticket promedio (simplificado)
      const ticketPromedio = totalVentasHoy > 0 ? totalVentasHoy / (ventasHoy.data?.length || 1) : 0
      const ticketPromedioAyer = totalVentasAyer > 0 ? totalVentasAyer / (ventasAyer.data?.length || 1) : 0
      const cambioTicket = ticketPromedioAyer > 0 ? ((ticketPromedio - ticketPromedioAyer) / ticketPromedioAyer) * 100 : 0

      return {
        ventasHoy: {
          valor: totalVentasHoy,
          cambio: Math.round(cambioVentasHoy * 100) / 100,
          tipo: cambioVentasHoy >= 0 ? "aumento" : "disminucion",
        },
        ventasSemana: {
          valor: totalVentasEstaSemana,
          cambio: Math.round(cambioVentasSemana * 100) / 100,
          tipo: cambioVentasSemana >= 0 ? "aumento" : "disminucion",
        },
        ventasMes: {
          valor: totalVentasEsteMes,
          cambio: Math.round(cambioVentasMes * 100) / 100,
          tipo: cambioVentasMes >= 0 ? "aumento" : "disminucion",
        },
        clientesNuevos: {
          valor: totalClientesEstaSemana,
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
        ventasHoy: { valor: 0, cambio: 0, tipo: "aumento" },
        ventasSemana: { valor: 0, cambio: 0, tipo: "aumento" },
        ventasMes: { valor: 0, cambio: 0, tipo: "aumento" },
        clientesNuevos: { valor: 0, cambio: 0, tipo: "aumento" },
        ticketPromedio: { valor: 0, cambio: 0, tipo: "aumento" },
        tasaConversion: { valor: 0, cambio: 0, tipo: "aumento" },
      }
    }
  }
}

export const metricsService = new MetricsService() 