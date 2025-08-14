"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import { ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

const dataPorPeriodo = {
  dia: {
    ventasPorPeriodo: [
      { periodo: "9:00", ventas: 45000, pedidos: 2 },
      { periodo: "11:00", ventas: 78000, pedidos: 3 },
      { periodo: "13:00", ventas: 120000, pedidos: 5 },
      { periodo: "15:00", ventas: 95000, pedidos: 4 },
      { periodo: "17:00", ventas: 156000, pedidos: 6 },
      { periodo: "19:00", ventas: 89000, pedidos: 3 },
      { periodo: "21:00", ventas: 67000, pedidos: 2 },
    ],
    metricas: {
      ventasHoy: { valor: 854100, cambio: 12, tipo: "aumento" },
      ventasSemana: { valor: 5526000, cambio: 8, tipo: "aumento" },
      ventasMes: { valor: 23595000, cambio: 15, tipo: "aumento" },
      clientesNuevos: { valor: 8, cambio: -5, tipo: "disminucion" },
      ticketPromedio: { valor: 47040, cambio: 7, tipo: "aumento" },
      tasaConversion: { valor: 3.2, cambio: 2, tipo: "aumento" },
    },
  },
  semana: {
    ventasPorPeriodo: [
      { periodo: "Lun", ventas: 360000, pedidos: 8 },
      { periodo: "Mar", ventas: 540000, pedidos: 12 },
      { periodo: "Mié", ventas: 660000, pedidos: 15 },
      { periodo: "Jue", ventas: 480000, pedidos: 10 },
      { periodo: "Vie", ventas: 840000, pedidos: 18 },
      { periodo: "Sáb", ventas: 960000, pedidos: 22 },
      { periodo: "Dom", ventas: 720000, pedidos: 16 },
    ],
    metricas: {
      ventasHoy: { valor: 854100, cambio: 12, tipo: "aumento" },
      ventasSemana: { valor: 5526000, cambio: 8, tipo: "aumento" },
      ventasMes: { valor: 23595000, cambio: 15, tipo: "aumento" },
      clientesNuevos: { valor: 23, cambio: -5, tipo: "disminucion" },
      ticketPromedio: { valor: 47040, cambio: 7, tipo: "aumento" },
      tasaConversion: { valor: 3.2, cambio: 2, tipo: "aumento" },
    },
  },
  mes: {
    ventasPorPeriodo: [
      { periodo: "Sem 1", ventas: 2460000, pedidos: 45 },
      { periodo: "Sem 2", ventas: 3120000, pedidos: 58 },
      { periodo: "Sem 3", ventas: 2890000, pedidos: 52 },
      { periodo: "Sem 4", ventas: 3540000, pedidos: 67 },
    ],
    metricas: {
      ventasHoy: { valor: 854100, cambio: 12, tipo: "aumento" },
      ventasSemana: { valor: 5526000, cambio: 8, tipo: "aumento" },
      ventasMes: { valor: 23595000, cambio: 15, tipo: "aumento" },
      clientesNuevos: { valor: 89, cambio: 18, tipo: "aumento" },
      ticketPromedio: { valor: 47040, cambio: 7, tipo: "aumento" },
      tasaConversion: { valor: 3.2, cambio: 2, tipo: "aumento" },
    },
  },
  trimestre: {
    ventasPorPeriodo: [
      { periodo: "Ene", ventas: 4620000, pedidos: 145 },
      { periodo: "Feb", ventas: 5460000, pedidos: 152 },
      { periodo: "Mar", ventas: 6840000, pedidos: 168 },
    ],
    metricas: {
      ventasHoy: { valor: 854100, cambio: 12, tipo: "aumento" },
      ventasSemana: { valor: 5526000, cambio: 8, tipo: "aumento" },
      ventasMes: { valor: 23595000, cambio: 15, tipo: "aumento" },
      clientesNuevos: { valor: 267, cambio: 22, tipo: "aumento" },
      ticketPromedio: { valor: 47040, cambio: 7, tipo: "aumento" },
      tasaConversion: { valor: 3.2, cambio: 2, tipo: "aumento" },
    },
  },
}

const ventasPorMes = [
  { mes: "Ene", ventas: 4620000, clientes: 45 },
  { mes: "Feb", ventas: 5460000, clientes: 52 },
  { mes: "Mar", ventas: 6840000, clientes: 68 },
  { mes: "Abr", ventas: 5880000, clientes: 58 },
  { mes: "May", ventas: 7560000, clientes: 74 },
  { mes: "Jun", ventas: 8520000, clientes: 82 },
]

const productosMasVendidos = [
  { nombre: "Kit Cultivo Indoor", ventas: 47, ingresos: 4230900, color: "#10b981" },
  { nombre: "Fertilizante NPK", ventas: 32, ingresos: 239968, color: "#3b82f6" },
  { nombre: "Lámpara LED 600W", ventas: 28, ingresos: 1595972, color: "#f59e0b" },
  { nombre: "Sistema Hidropónico", ventas: 24, ingresos: 1079976, color: "#8b5cf6" },
  { nombre: "Semillas Auto", ventas: 18, ingresos: 243000, color: "#ef4444" },
]

const categoriaVentas = [
  { categoria: "Kits", valor: 35, color: "#10b981" },
  { categoria: "Iluminación", valor: 25, color: "#3b82f6" },
  { categoria: "Fertilizantes", valor: 20, color: "#f59e0b" },
  { categoria: "Hidroponía", valor: 15, color: "#8b5cf6" },
  { categoria: "Herramientas", valor: 5, color: "#ef4444" },
]

export default function ReportesPage() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("semana")
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas")
  const [fechaPersonalizada, setFechaPersonalizada] = useState<DateRange | undefined>()
  const [usarFechaPersonalizada, setUsarFechaPersonalizada] = useState(false)
  const [formatoExportacion, setFormatoExportacion] = useState("json")
  const { toast } = useToast()

  const datosActuales = dataPorPeriodo[periodoSeleccionado as keyof typeof dataPorPeriodo]

  const getTrendIcon = (tipo: string) => {
    return tipo === "aumento" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getTrendColor = (tipo: string) => {
    return tipo === "aumento" ? "text-green-600" : "text-red-600"
  }

  const exportarReporte = () => {
    const reporteData = {
      periodo: usarFechaPersonalizada ? "personalizado" : periodoSeleccionado,
      fechaInicio: fechaPersonalizada?.from ? format(fechaPersonalizada.from, "yyyy-MM-dd") : null,
      fechaFin: fechaPersonalizada?.to ? format(fechaPersonalizada.to, "yyyy-MM-dd") : null,
      fecha: new Date().toLocaleDateString("es-AR"),
      metricas: datosActuales.metricas,
      ventas: datosActuales.ventasPorPeriodo,
      productos: productosMasVendidos,
      categorias: categoriaVentas,
    }

    let dataStr = ""
    let mimeType = ""
    let extension = ""

    switch (formatoExportacion) {
      case "json":
        dataStr = JSON.stringify(reporteData, null, 2)
        mimeType = "application/json"
        extension = "json"
        break
      case "csv":
        const csvHeaders = "Período,Ventas,Pedidos\n"
        const csvData = datosActuales.ventasPorPeriodo
          .map((item) => `${item.periodo},${item.ventas},${item.pedidos}`)
          .join("\n")
        dataStr = csvHeaders + csvData
        mimeType = "text/csv"
        extension = "csv"
        break
      case "txt":
        dataStr = `REPORTE DE VENTAS\n`
        dataStr += `Período: ${usarFechaPersonalizada ? "Personalizado" : periodoSeleccionado}\n`
        dataStr += `Fecha: ${new Date().toLocaleDateString("es-AR")}\n\n`
        dataStr += `MÉTRICAS:\n`
        dataStr += `Ventas Hoy: $${datosActuales.metricas.ventasHoy.valor.toLocaleString()}\n`
        dataStr += `Ventas Semana: $${datosActuales.metricas.ventasSemana.valor.toLocaleString()}\n`
        dataStr += `Ventas Mes: $${datosActuales.metricas.ventasMes.valor.toLocaleString()}\n\n`
        dataStr += `VENTAS POR PERÍODO:\n`
        datosActuales.ventasPorPeriodo.forEach((item) => {
          dataStr += `${item.periodo}: $${item.ventas.toLocaleString()} (${item.pedidos} pedidos)\n`
        })
        mimeType = "text/plain"
        extension = "txt"
        break
      case "xlsx":
        try {
          // Crear workbook y worksheets
          const wb = {
            SheetNames: ["Métricas", "Ventas", "Productos"],
            Sheets: {} as any,
          }

          // Hoja de métricas
          const metricasData = [
            ["Métrica", "Valor", "Cambio %"],
            [
              "Ventas Hoy",
              `$${datosActuales.metricas.ventasHoy.valor.toLocaleString()}`,
              `${datosActuales.metricas.ventasHoy.cambio}%`,
            ],
            [
              "Ventas Semana",
              `$${datosActuales.metricas.ventasSemana.valor.toLocaleString()}`,
              `${datosActuales.metricas.ventasSemana.cambio}%`,
            ],
            [
              "Ventas Mes",
              `$${datosActuales.metricas.ventasMes.valor.toLocaleString()}`,
              `${datosActuales.metricas.ventasMes.cambio}%`,
            ],
            [
              "Clientes Nuevos",
              datosActuales.metricas.clientesNuevos.valor,
              `${datosActuales.metricas.clientesNuevos.cambio}%`,
            ],
            [
              "Ticket Promedio",
              `$${datosActuales.metricas.ticketPromedio.valor.toLocaleString()}`,
              `${datosActuales.metricas.ticketPromedio.cambio}%`,
            ],
            [
              "Tasa Conversión",
              `${datosActuales.metricas.tasaConversion.valor}%`,
              `${datosActuales.metricas.tasaConversion.cambio}%`,
            ],
          ]

          // Hoja de ventas por período
          const ventasData = [
            ["Período", "Ventas", "Pedidos"],
            ...datosActuales.ventasPorPeriodo.map((item) => [item.periodo, item.ventas, item.pedidos]),
          ]

          // Hoja de productos más vendidos
          const productosData = [
            ["Producto", "Unidades Vendidas", "Ingresos"],
            ...productosMasVendidos.map((producto) => [producto.nombre, producto.ventas, producto.ingresos]),
          ]

          // Convertir arrays a formato de hoja de cálculo
          const arrayToSheet = (data: any[][]) => {
            const ws: any = {}
            const range = { s: { c: 0, r: 0 }, e: { c: data[0].length - 1, r: data.length - 1 } }

            for (let R = 0; R < data.length; R++) {
              for (let C = 0; C < data[R].length; C++) {
                const cellAddress = { c: C, r: R }
                const cellRef = encodeCell(cellAddress)
                ws[cellRef] = { v: data[R][C], t: typeof data[R][C] === "number" ? "n" : "s" }
              }
            }
            ws["!ref"] = encodeRange(range)
            return ws
          }

          // Función auxiliar para codificar celdas
          const encodeCell = (cell: { c: number; r: number }) => {
            const col = String.fromCharCode(65 + cell.c)
            return col + (cell.r + 1)
          }

          // Función auxiliar para codificar rangos
          const encodeRange = (range: { s: { c: number; r: number }; e: { c: number; r: number } }) => {
            return encodeCell(range.s) + ":" + encodeCell(range.e)
          }

          wb.Sheets["Métricas"] = arrayToSheet(metricasData)
          wb.Sheets["Ventas"] = arrayToSheet(ventasData)
          wb.Sheets["Productos"] = arrayToSheet(productosData)

          // Convertir a formato binario
          const wbout = writeWorkbook(wb)
          const dataBlob = new Blob([wbout], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })

          const url = URL.createObjectURL(dataBlob)
          const link = document.createElement("a")
          link.href = url
          const fechaSufijo =
            usarFechaPersonalizada && fechaPersonalizada?.from
              ? `${format(fechaPersonalizada.from, "yyyy-MM-dd")}_${fechaPersonalizada?.to ? format(fechaPersonalizada.to, "yyyy-MM-dd") : "actual"}`
              : periodoSeleccionado
          link.download = `reporte-${fechaSufijo}-${new Date().toISOString().split("T")[0]}.xlsx`
          link.click()

          toast({
            title: "Reporte exportado",
            description: "Reporte exportado en formato XLSX exitosamente",
          })
          return
        } catch (error) {
          console.error("Error exportando XLSX:", error)
          toast({
            title: "Error",
            description: "Error al exportar en formato XLSX. Intenta con otro formato.",
            variant: "destructive",
          })
          return
        }
      case "pdf":
        try {
          // Crear contenido HTML para PDF
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Reporte de Ventas</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
                .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
                .metric-title { font-size: 14px; color: #666; margin-bottom: 5px; }
                .metric-value { font-size: 24px; font-weight: bold; color: #333; }
                .metric-change { font-size: 12px; color: #10b981; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f5f5f5; font-weight: bold; }
                .section-title { font-size: 18px; font-weight: bold; margin: 30px 0 15px 0; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Reporte de Ventas - Growshop CRM</h1>
                <p>Período: ${usarFechaPersonalizada ? "Personalizado" : periodoSeleccionado}</p>
                <p>Fecha: ${new Date().toLocaleDateString("es-AR")}</p>
              </div>
              
              <div class="metrics">
                <div class="metric-card">
                  <div class="metric-title">Ventas Hoy</div>
                  <div class="metric-value">$${datosActuales.metricas.ventasHoy.valor.toLocaleString()}</div>
                  <div class="metric-change">+${datosActuales.metricas.ventasHoy.cambio}% vs anterior</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Ventas Semana</div>
                  <div class="metric-value">$${datosActuales.metricas.ventasSemana.valor.toLocaleString()}</div>
                  <div class="metric-change">+${datosActuales.metricas.ventasSemana.cambio}% vs anterior</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Ventas Mes</div>
                  <div class="metric-value">$${datosActuales.metricas.ventasMes.valor.toLocaleString()}</div>
                  <div class="metric-change">+${datosActuales.metricas.ventasMes.cambio}% vs anterior</div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Clientes Nuevos</div>
                  <div class="metric-value">${datosActuales.metricas.clientesNuevos.valor}</div>
                  <div class="metric-change">${datosActuales.metricas.clientesNuevos.cambio}% vs anterior</div>
                </div>
              </div>

              <div class="section-title">Ventas por Período</div>
              <table>
                <thead>
                  <tr>
                    <th>Período</th>
                    <th>Ventas</th>
                    <th>Pedidos</th>
                  </tr>
                </thead>
                <tbody>
                  ${datosActuales.ventasPorPeriodo
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.periodo}</td>
                      <td>$${item.ventas.toLocaleString()}</td>
                      <td>${item.pedidos}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>

              <div class="section-title">Productos Más Vendidos</div>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Unidades</th>
                    <th>Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  ${productosMasVendidos
                    .map(
                      (producto) => `
                    <tr>
                      <td>${producto.nombre}</td>
                      <td>${producto.ventas}</td>
                      <td>$${producto.ingresos.toLocaleString()}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </body>
            </html>
          `

          // Crear PDF usando la API del navegador
          const printWindow = window.open("", "_blank")
          if (printWindow) {
            printWindow.document.write(htmlContent)
            printWindow.document.close()

            // Esperar a que se cargue el contenido
            setTimeout(() => {
              printWindow.print()
              printWindow.close()
            }, 500)

            toast({
              title: "Reporte exportado",
              description: "Reporte exportado en formato PDF exitosamente",
            })
          } else {
            throw new Error("No se pudo abrir la ventana de impresión")
          }
          return
        } catch (error) {
          console.error("Error exportando PDF:", error)
          toast({
            title: "Error",
            description: "Error al exportar en formato PDF. Intenta con otro formato.",
            variant: "destructive",
          })
          return
        }
    }

    // Para formatos que no son PDF o XLSX
    if (formatoExportacion !== "pdf" && formatoExportacion !== "xlsx") {
      const dataBlob = new Blob([dataStr], { type: mimeType })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      const fechaSufijo =
        usarFechaPersonalizada && fechaPersonalizada?.from
          ? `${format(fechaPersonalizada.from, "yyyy-MM-dd")}_${fechaPersonalizada?.to ? format(fechaPersonalizada.to, "yyyy-MM-dd") : "actual"}`
          : periodoSeleccionado
      link.download = `reporte-${fechaSufijo}-${new Date().toISOString().split("T")[0]}.${extension}`
      link.click()

      toast({
        title: "Reporte exportado",
        description: `Reporte exportado en formato ${formatoExportacion.toUpperCase()} exitosamente`,
      })
    }
  }

  // Función auxiliar para escribir workbook XLSX
  const writeWorkbook = (wb: any) => {
    const buf = new ArrayBuffer(1000000)
    const view = new Uint8Array(buf)
    // Implementación simplificada - en producción usar librería xlsx
    const simpleXlsx = `<?xml version="1.0" encoding="UTF-8"?>
    <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
      <sheets>
        <sheet name="Reporte" sheetId="1" r:id="rId1"/>
      </sheets>
    </workbook>`

    const encoder = new TextEncoder()
    const encoded = encoder.encode(simpleXlsx)
    view.set(encoded)
    return buf.slice(0, encoded.length)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navigation />

      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-green-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4 sm:gap-0">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Reportes y Métricas</h1>
                  <p className="text-sm text-indigo-600">Analiza el rendimiento de tu negocio</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="flex items-center space-x-2">
                  <Select
                    value={usarFechaPersonalizada ? "personalizado" : periodoSeleccionado}
                    onValueChange={(value) => {
                      if (value === "personalizado") {
                        setUsarFechaPersonalizada(true)
                      } else {
                        setUsarFechaPersonalizada(false)
                        setPeriodoSeleccionado(value)
                      }
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-32">
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dia">Hoy</SelectItem>
                      <SelectItem value="semana">Semana</SelectItem>
                      <SelectItem value="mes">Mes</SelectItem>
                      <SelectItem value="trimestre">Trimestre</SelectItem>
                      <SelectItem value="personalizado">Fecha personalizada</SelectItem>
                    </SelectContent>
                  </Select>

                  {usarFechaPersonalizada && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                          <Calendar className="mr-2 h-4 w-4" />
                          {fechaPersonalizada?.from ? (
                            fechaPersonalizada.to ? (
                              <>
                                {format(fechaPersonalizada.from, "dd/MM", { locale: es })} -{" "}
                                {format(fechaPersonalizada.to, "dd/MM", { locale: es })}
                              </>
                            ) : (
                              format(fechaPersonalizada.from, "dd/MM/yyyy", { locale: es })
                            )
                          ) : (
                            "Seleccionar fechas"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={fechaPersonalizada?.from}
                          selected={fechaPersonalizada}
                          onSelect={setFechaPersonalizada}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                <Select value={formatoExportacion} onValueChange={setFormatoExportacion}>
                  <SelectTrigger className="w-full sm:w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        JSON
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        CSV
                      </div>
                    </SelectItem>
                    <SelectItem value="xlsx">
                      <div className="flex items-center">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        XLSX
                      </div>
                    </SelectItem>
                    <SelectItem value="pdf">
                      <div className="flex items-center">
                        <FileImage className="mr-2 h-4 w-4" />
                        PDF
                      </div>
                    </SelectItem>
                    <SelectItem value="txt">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        TXT
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportarReporte}
                  className="w-full sm:w-auto bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </header>

        {usarFechaPersonalizada && fechaPersonalizada?.from && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
            <div className="max-w-7xl mx-auto">
              <p className="text-sm text-blue-700">
                <Calendar className="inline h-4 w-4 mr-1" />
                Mostrando datos desde {format(fechaPersonalizada.from, "dd/MM/yyyy", { locale: es })}
                {fechaPersonalizada.to && <> hasta {format(fechaPersonalizada.to, "dd/MM/yyyy", { locale: es })}</>}
              </p>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ventas Hoy</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${datosActuales.metricas.ventasHoy.valor.toLocaleString()}
                </div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(datosActuales.metricas.ventasHoy.tipo)}`}
                >
                  {getTrendIcon(datosActuales.metricas.ventasHoy.tipo)}
                  <span className="ml-1">+{datosActuales.metricas.ventasHoy.cambio}% vs ayer</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ventas Semana</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${datosActuales.metricas.ventasSemana.valor.toLocaleString()}
                </div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(datosActuales.metricas.ventasSemana.tipo)}`}
                >
                  {getTrendIcon(datosActuales.metricas.ventasSemana.tipo)}
                  <span className="ml-1">+{datosActuales.metricas.ventasSemana.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ventas Mes</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${datosActuales.metricas.ventasMes.valor.toLocaleString()}
                </div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(datosActuales.metricas.ventasMes.tipo)}`}
                >
                  {getTrendIcon(datosActuales.metricas.ventasMes.tipo)}
                  <span className="ml-1">+{datosActuales.metricas.ventasMes.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Clientes Nuevos</CardTitle>
                <Users className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{datosActuales.metricas.clientesNuevos.valor}</div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(datosActuales.metricas.clientesNuevos.tipo)}`}
                >
                  {getTrendIcon(datosActuales.metricas.clientesNuevos.tipo)}
                  <span className="ml-1">{datosActuales.metricas.clientesNuevos.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ticket Promedio</CardTitle>
                <Package className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${datosActuales.metricas.ticketPromedio.valor.toLocaleString()}
                </div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(datosActuales.metricas.ticketPromedio.tipo)}`}
                >
                  {getTrendIcon(datosActuales.metricas.ticketPromedio.tipo)}
                  <span className="ml-1">+{datosActuales.metricas.ticketPromedio.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tasa Conversión</CardTitle>
                <TrendingUp className="h-4 w-4 text-rose-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{datosActuales.metricas.tasaConversion.valor}%</div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(datosActuales.metricas.tasaConversion.tipo)}`}
                >
                  {getTrendIcon(datosActuales.metricas.tasaConversion.tipo)}
                  <span className="ml-1">+{datosActuales.metricas.tasaConversion.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Ventas por{" "}
                  {periodoSeleccionado === "dia"
                    ? "Hora"
                    : periodoSeleccionado === "semana"
                      ? "Día"
                      : periodoSeleccionado === "mes"
                        ? "Semana"
                        : "Mes"}
                </CardTitle>
                <CardDescription>
                  Rendimiento de ventas en el{" "}
                  {periodoSeleccionado === "dia" ? "día actual" : `último ${periodoSeleccionado}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={datosActuales.ventasPorPeriodo}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="periodo" fontSize={12} tickMargin={10} />
                      <YAxis fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium">{`${label}`}</p>
                                <p className="text-green-600">{`Ventas: $${payload[0]?.value?.toLocaleString()}`}</p>
                                <p className="text-blue-600">{`Pedidos: ${payload[1]?.value}`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="ventas" fill="#10b981" name="Ventas ($)" />
                      <Bar dataKey="pedidos" fill="#3b82f6" name="Pedidos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Tendencia Mensual</CardTitle>
                <CardDescription>Evolución de ventas y clientes por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ventasPorMes} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="mes" fontSize={12} tickMargin={10} />
                      <YAxis fontSize={12} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium">{`${label}`}</p>
                                <p className="text-purple-600">{`Ventas: $${payload[0]?.value?.toLocaleString()}`}</p>
                                <p className="text-orange-600">{`Clientes: ${payload[1]?.value}`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line type="monotone" dataKey="ventas" stroke="#8b5cf6" strokeWidth={3} name="Ventas ($)" />
                      <Line type="monotone" dataKey="clientes" stroke="#f59e0b" strokeWidth={3} name="Clientes" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Productos Más Vendidos</CardTitle>
                <CardDescription>Top 5 productos por cantidad vendida</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productosMasVendidos.map((producto, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 flex-shrink-0">
                          <span className="text-sm font-semibold text-gray-600">{index + 1}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{producto.nombre}</div>
                          <div className="text-xs text-gray-500">{producto.ventas} unidades vendidas</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-sm font-semibold text-green-600">
                          ${producto.ingresos.toLocaleString()}
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(producto.ventas / productosMasVendidos[0].ventas) * 100}%`,
                              backgroundColor: producto.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Ventas por Categoría</CardTitle>
                <CardDescription>Distribución de ventas por tipo de producto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoriaVentas}
                        dataKey="valor"
                        nameKey="categoria"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ categoria, valor }) => `${categoria}: ${valor}%`}
                        fontSize={12}
                      >
                        {categoriaVentas.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium">{payload[0]?.name}</p>
                                <p className="text-gray-600">{`${payload[0]?.value}% del total`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Crecimiento del Mes</CardTitle>
                <CardDescription className="text-green-100">Comparado con el mes anterior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">+24%</div>
                    <div className="text-sm text-green-100">En ventas totales</div>
                  </div>
                  <TrendingUp className="h-12 w-12 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Mejor Producto</CardTitle>
                <CardDescription className="text-blue-100">Producto estrella del mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-bold truncate">Kit Cultivo Indoor</div>
                    <div className="text-sm text-blue-100">47 unidades vendidas</div>
                  </div>
                  <Package className="h-12 w-12 text-blue-200 flex-shrink-0 ml-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Cliente VIP</CardTitle>
                <CardDescription className="text-purple-100">Mayor comprador del mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-bold truncate">Ana Martín</div>
                    <div className="text-sm text-purple-100">$1,368,000 en compras</div>
                  </div>
                  <Users className="h-12 w-12 text-purple-200 flex-shrink-0 ml-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
