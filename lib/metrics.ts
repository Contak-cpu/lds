// Servicio de métricas usando datos mockeados
import { mockDataService, type MetricasDashboard, type ProductoMasVendido } from './mock-data'

export class MetricsService {
  async getMetricasDashboard(fromDate?: Date, toDate?: Date): Promise<MetricasDashboard> {
    return mockDataService.getMetricasDashboard(fromDate, toDate)
  }

  async getProductosMasVendidos(fromDate?: Date, toDate?: Date): Promise<ProductoMasVendido[]> {
    return mockDataService.getProductosMasVendidos(fromDate, toDate)
  }
}

export const metricsService = new MetricsService()

export type { MetricasDashboard, ProductoMasVendido } 