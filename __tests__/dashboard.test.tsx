"use client"

import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, it, expect, jest, beforeEach, vi } from "@jest/globals"

// Mock del servicio de métricas
const mockMetricsService = {
  getMetricasDashboard: jest.fn()
}

jest.mock("@/lib/metrics", () => ({
  metricsService: mockMetricsService
}))

// Mock del hook useToast
const mockToast = jest.fn()
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Componente de prueba que simula el dashboard
const Dashboard = () => {
  const [metricas, setMetricas] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const cargarMetricas = async () => {
      try {
        setLoading(true)
        const data = await mockMetricsService.getMetricasDashboard()
        setMetricas(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
        setMetricas(null)
      } finally {
        setLoading(false)
      }
    }

    cargarMetricas()
  }, [])

  if (loading) {
    return (
      <div data-testid="dashboard-loading">
        <h2>Cargando métricas...</h2>
        <div className="loading-spinner">⏳</div>
      </div>
    )
  }

  if (error) {
    return (
      <div data-testid="dashboard-error">
        <h2>Error en el Dashboard</h2>
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    )
  }

  if (!metricas) {
    return (
      <div data-testid="dashboard-no-data">
        <h2>No hay datos disponibles</h2>
        <p>No se pudieron cargar las métricas del dashboard</p>
      </div>
    )
  }

  return (
    <div data-testid="dashboard" className="dashboard">
      <h1>Dashboard de GrowShop</h1>
      
      <div className="metrics-grid">
        <div className="metric-card" data-testid="metric-ventas-hoy">
          <h3>Ventas de Hoy</h3>
          <div className="metric-value">${metricas.ventasHoy?.toFixed(2) || "0.00"}</div>
          <div className="metric-label">Total de ventas del día</div>
        </div>

        <div className="metric-card" data-testid="metric-ventas-ayer">
          <h3>Ventas de Ayer</h3>
          <div className="metric-value">${metricas.ventasAyer?.toFixed(2) || "0.00"}</div>
          <div className="metric-label">Total de ventas del día anterior</div>
        </div>

        <div className="metric-card" data-testid="metric-clientes-activos">
          <h3>Clientes Activos</h3>
          <div className="metric-value">{metricas.clientesActivos || 0}</div>
          <div className="metric-label">Total de clientes registrados</div>
        </div>

        <div className="metric-card" data-testid="metric-productos-stock">
          <h3>Productos en Stock</h3>
          <div className="metric-value">{metricas.productosStock || 0}</div>
          <div className="metric-label">Productos disponibles</div>
        </div>

        <div className="metric-card" data-testid="metric-stock-bajo">
          <h3>Stock Bajo</h3>
          <div className="metric-value">{metricas.productosStockBajo || 0}</div>
          <div className="metric-label">Productos con stock mínimo</div>
        </div>

        <div className="metric-card" data-testid="metric-egresos-semana">
          <h3>Egresos de la Semana</h3>
          <div className="metric-value">${metricas.egresosSemana?.toFixed(2) || "0.00"}</div>
          <div className="metric-label">Total de gastos semanales</div>
        </div>
      </div>

      <div className="dashboard-summary">
        <h2>Resumen del Negocio</h2>
        <div className="summary-stats">
          <div className="summary-item">
            <span className="label">Balance Neto:</span>
            <span className="value" data-testid="balance-neto">
              ${((metricas.ventasHoy || 0) - (metricas.egresosSemana || 0)).toFixed(2)}
            </span>
          </div>
          <div className="summary-item">
            <span className="label">Productividad:</span>
            <span className="value" data-testid="productividad">
              {metricas.productosStock > 0 ? Math.round((metricas.productosStock / (metricas.productosStock + (metricas.productosStockBajo || 0))) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

describe("📊 Dashboard - Validación Completa", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockToast.mockClear()
    mockMetricsService.getMetricasDashboard.mockClear()
  })

  describe("🎯 Renderizado del Dashboard", () => {
    it("debe mostrar el estado de carga inicialmente", () => {
      mockMetricsService.getMetricasDashboard.mockImplementation(() => 
        new Promise(() => {}) // Promise que nunca se resuelve para simular loading
      )

      render(<Dashboard />)

      expect(screen.getByTestId("dashboard-loading")).toBeInTheDocument()
      expect(screen.getByText("Cargando métricas...")).toBeInTheDocument()
      expect(screen.getByText("⏳")).toBeInTheDocument()
    })

    it("debe mostrar el dashboard cuando se cargan las métricas correctamente", async () => {
      const mockMetricas = {
        ventasHoy: 1250.50,
        ventasAyer: 980.25,
        clientesActivos: 45,
        productosStock: 120,
        productosStockBajo: 8,
        egresosSemana: 450.75
      }

      mockMetricsService.getMetricasDashboard.mockResolvedValue(mockMetricas)

      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByTestId("dashboard")).toBeInTheDocument()
      })

      expect(screen.getByText("Dashboard de GrowShop")).toBeInTheDocument()
      expect(screen.getByText("Resumen del Negocio")).toBeInTheDocument()
    })
  })

  describe("📈 Métricas del Dashboard", () => {
    it("debe mostrar todas las métricas principales correctamente", async () => {
      const mockMetricas = {
        ventasHoy: 2500.00,
        ventasAyer: 1800.50,
        clientesActivos: 67,
        productosStock: 89,
        productosStockBajo: 12,
        egresosSemana: 750.25
      }

      mockMetricsService.getMetricasDashboard.mockResolvedValue(mockMetricas)

      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByTestId("dashboard")).toBeInTheDocument()
      })

      // Verificar métricas individuales
      expect(screen.getByTestId("metric-ventas-hoy")).toBeInTheDocument()
      expect(screen.getByTestId("metric-ventas-ayer")).toBeInTheDocument()
      expect(screen.getByTestId("metric-clientes-activos")).toBeInTheDocument()
      expect(screen.getByTestId("metric-productos-stock")).toBeInTheDocument()
      expect(screen.getByTestId("metric-stock-bajo")).toBeInTheDocument()
      expect(screen.getByTestId("metric-egresos-semana")).toBeInTheDocument()

      // Verificar valores
      expect(screen.getByText("$2500.00")).toBeInTheDocument()
      expect(screen.getByText("$1800.50")).toBeInTheDocument()
      expect(screen.getByText("67")).toBeInTheDocument()
      expect(screen.getByText("89")).toBeInTheDocument()
      expect(screen.getByText("12")).toBeInTheDocument()
      expect(screen.getByText("$750.25")).toBeInTheDocument()
    })

    it("debe mostrar métricas con valores en cero cuando no hay datos", async () => {
      const mockMetricas = {
        ventasHoy: 0,
        ventasAyer: 0,
        clientesActivos: 0,
        productosStock: 0,
        productosStockBajo: 0,
        egresosSemana: 0
      }

      mockMetricsService.getMetricasDashboard.mockResolvedValue(mockMetricas)

      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByTestId("dashboard")).toBeInTheDocument()
      })

      // Verificar que se muestren ceros
      expect(screen.getAllByText("$0.00")).toHaveLength(4) // 4 métricas con valor $0.00 (incluye balance neto)
      expect(screen.getAllByText("0")).toHaveLength(3) // 3 métricas con valor 0 (clientes, productos, stock bajo)
    })

    it("debe calcular correctamente el balance neto", async () => {
      const mockMetricas = {
        ventasHoy: 3000.00,
        ventasAyer: 2000.00,
        clientesActivos: 50,
        productosStock: 100,
        productosStockBajo: 5,
        egresosSemana: 1200.00
      }

      mockMetricsService.getMetricasDashboard.mockResolvedValue(mockMetricas)

      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByTestId("dashboard")).toBeInTheDocument()
      })

      // Balance neto = ventasHoy - egresosSemana = 3000 - 1200 = 1800
      expect(screen.getByTestId("balance-neto")).toHaveTextContent("$1800.00")
    })

    it("debe calcular correctamente la productividad del inventario", async () => {
      const mockMetricas = {
        ventasHoy: 1000.00,
        ventasAyer: 800.00,
        clientesActivos: 30,
        productosStock: 80,
        productosStockBajo: 20,
        egresosSemana: 400.00
      }

      mockMetricsService.getMetricasDashboard.mockResolvedValue(mockMetricas)

      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByTestId("dashboard")).toBeInTheDocument()
      })

      // Productividad = (productosStock / (productosStock + productosStockBajo)) * 100
      // = (80 / (80 + 20)) * 100 = (80 / 100) * 100 = 80%
      expect(screen.getByTestId("productividad")).toHaveTextContent("80%")
    })
  })

  describe("🚨 Manejo de Errores", () => {
    it("debe mostrar error cuando falla la carga de métricas", async () => {
      const errorMessage = "Error al obtener métricas del dashboard"
      mockMetricsService.getMetricasDashboard.mockRejectedValue(new Error(errorMessage))

      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByTestId("dashboard-error")).toBeInTheDocument()
      })

      expect(screen.getByText("Error en el Dashboard")).toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
      expect(screen.getByText("Reintentar")).toBeInTheDocument()
    })

    it("debe mostrar mensaje cuando no hay datos disponibles", async () => {
      mockMetricsService.getMetricasDashboard.mockResolvedValue(null)

      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByTestId("dashboard-no-data")).toBeInTheDocument()
      })

      expect(screen.getByText("No hay datos disponibles")).toBeInTheDocument()
      expect(screen.getByText("No se pudieron cargar las métricas del dashboard")).toBeInTheDocument()
    })
  })

  describe("🔢 Cálculos Matemáticos", () => {
    it("debe manejar decimales correctamente en los cálculos", async () => {
      const mockMetricas = {
        ventasHoy: 1234.567,
        ventasAyer: 987.654,
        clientesActivos: 42,
        productosStock: 67,
        productosStockBajo: 3,
        egresosSemana: 456.789
      }

      mockMetricsService.getMetricasDashboard.mockResolvedValue(mockMetricas)

      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByTestId("dashboard")).toBeInTheDocument()
      })

      // Verificar que los decimales se muestren correctamente
      expect(screen.getByText("$1234.57")).toBeInTheDocument() // Redondeado a 2 decimales
      expect(screen.getByText("$987.65")).toBeInTheDocument()
      expect(screen.getByText("$456.79")).toBeInTheDocument()

      // Balance neto = 1234.567 - 456.789 = 777.778 ≈ 777.78
      expect(screen.getByTestId("balance-neto")).toHaveTextContent("$777.78")
    })

    it("debe manejar valores muy grandes correctamente", async () => {
      const mockMetricas = {
        ventasHoy: 999999.99,
        ventasAyer: 888888.88,
        clientesActivos: 9999,
        productosStock: 99999,
        productosStockBajo: 999,
        egresosSemana: 777777.77
      }

      mockMetricsService.getMetricasDashboard.mockResolvedValue(mockMetricas)

      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByTestId("dashboard")).toBeInTheDocument()
      })

      // Verificar que se muestren correctamente
      expect(screen.getByText("$999999.99")).toBeInTheDocument()
      expect(screen.getByText("$888888.88")).toBeInTheDocument()
      expect(screen.getByText("9999")).toBeInTheDocument()
      expect(screen.getByText("99999")).toBeInTheDocument()
      expect(screen.getByText("999")).toBeInTheDocument()
      expect(screen.getByText("$777777.77")).toBeInTheDocument()

      // Balance neto = 999999.99 - 777777.77 = 222222.22
      expect(screen.getByTestId("balance-neto")).toHaveTextContent("$222222.22")
    })
  })

  describe("🎨 Interfaz de Usuario", () => {
    it("debe tener una estructura visual organizada", async () => {
      const mockMetricas = {
        ventasHoy: 1000.00,
        ventasAyer: 800.00,
        clientesActivos: 25,
        productosStock: 50,
        productosStockBajo: 5,
        egresosSemana: 300.00
      }

      mockMetricsService.getMetricasDashboard.mockResolvedValue(mockMetricas)

      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByTestId("dashboard")).toBeInTheDocument()
      })

      // Verificar estructura del dashboard
      expect(screen.getByText("Dashboard de GrowShop")).toBeInTheDocument()
      expect(screen.getByText("Resumen del Negocio")).toBeInTheDocument()

      // Verificar que haya 6 tarjetas de métricas
      const metricCards = screen.getAllByTestId(/^metric-/)
      expect(metricCards).toHaveLength(6)
    })

    it("debe mostrar etiquetas descriptivas para cada métrica", async () => {
      const mockMetricas = {
        ventasHoy: 1500.00,
        ventasAyer: 1200.00,
        clientesActivos: 40,
        productosStock: 75,
        productosStockBajo: 10,
        egresosSemana: 500.00
      }

      mockMetricsService.getMetricasDashboard.mockResolvedValue(mockMetricas)

      render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByTestId("dashboard")).toBeInTheDocument()
      })

      // Verificar etiquetas descriptivas
      expect(screen.getByText("Total de ventas del día")).toBeInTheDocument()
      expect(screen.getByText("Total de ventas del día anterior")).toBeInTheDocument()
      expect(screen.getByText("Total de clientes registrados")).toBeInTheDocument()
      expect(screen.getByText("Productos disponibles")).toBeInTheDocument()
      expect(screen.getByText("Productos con stock mínimo")).toBeInTheDocument()
      expect(screen.getByText("Total de gastos semanales")).toBeInTheDocument()
    })
  })

  describe("🔄 Recarga y Persistencia", () => {
    it("debe mantener el estado después de cambios en las métricas", async () => {
      const mockMetricas1 = {
        ventasHoy: 1000.00,
        ventasAyer: 800.00,
        clientesActivos: 25,
        productosStock: 50,
        productosStockBajo: 5,
        egresosSemana: 300.00
      }

      mockMetricsService.getMetricasDashboard.mockResolvedValue(mockMetricas1)

      const { rerender } = render(<Dashboard />)

      await waitFor(() => {
        expect(screen.getByTestId("dashboard")).toBeInTheDocument()
      })

      // Cambiar métricas
      const mockMetricas2 = {
        ventasHoy: 2000.00,
        ventasAyer: 1000.00,
        clientesActivos: 30,
        productosStock: 60,
        productosStockBajo: 8,
        egresosSemana: 400.00
      }

      mockMetricsService.getMetricasDashboard.mockResolvedValue(mockMetricas2)

      // Simular recarga
      rerender(<Dashboard />)

      // Verificar que se muestren las métricas originales (el componente no se recarga automáticamente)
      expect(screen.getByText("$1000.00")).toBeInTheDocument()
      expect(screen.getByText("25")).toBeInTheDocument()
      expect(screen.getByText("50")).toBeInTheDocument()
      expect(screen.getByText("5")).toBeInTheDocument()
      expect(screen.getByText("$300.00")).toBeInTheDocument()
    })
  })
})
