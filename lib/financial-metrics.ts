// Servicio de métricas financieras
export interface ProductoFinanciero {
  id: string
  nombre: string
  precioCosto: number
  precioVenta: number
  margenGanancia: number
  porcentajeMargen: number
  ventas: number
  ingresos: number
  costos: number
  gananciaNeta: number
}

export interface Egreso {
  id: string
  descripcion: string
  monto: number
  categoria: string
  fecha: Date
  tipo: 'operativo' | 'administrativo' | 'marketing' | 'otros'
}

export interface BalanceFinanciero {
  periodo: string
  fechaInicio: Date
  fechaFin: Date
  
  // Ingresos
  ingresosTotales: number
  ventasTotales: number
  
  // Costos
  costosTotales: number
  costosProductos: number
  
  // Egresos
  egresosTotales: number
  egresosOperativos: number
  egresosAdministrativos: number
  egresosMarketing: number
  egresosOtros: number
  
  // Resultados
  gananciaBruta: number
  gananciaNeta: number
  margenBruto: number
  margenNeto: number
  
  // Análisis temporal
  tendenciaIngresos: number
  tendenciaEgresos: number
  tendenciaGanancia: number
}

export interface MetricaFinanciera {
  valor: number
  cambio: number
  tipo: "aumento" | "disminucion"
  formato: "moneda" | "porcentaje" | "numero"
}

export interface MetricasFinancieras {
  gananciaNeta: MetricaFinanciera
  margenNeto: MetricaFinanciera
  egresosTotales: MetricaFinanciera
  rentabilidad: MetricaFinanciera
  flujoCaja: MetricaFinanciera
}

export class FinancialMetricsService {
  // Obtener productos con análisis financiero
  async getProductosFinancieros(fromDate?: Date, toDate?: Date): Promise<ProductoFinanciero[]> {
    // Mock data - en producción esto vendría de la base de datos
    return [
      {
        id: "1",
        nombre: "Nike Air Max 270",
        precioCosto: 45000,
        precioVenta: 75000,
        margenGanancia: 30000,
        porcentajeMargen: 66.67,
        ventas: 25,
        ingresos: 1875000,
        costos: 1125000,
        gananciaNeta: 750000
      },
      {
        id: "2",
        nombre: "Adidas Ultraboost 22",
        precioCosto: 52000,
        precioVenta: 89000,
        margenGanancia: 37000,
        porcentajeMargen: 71.15,
        ventas: 18,
        ingresos: 1602000,
        costos: 936000,
        gananciaNeta: 666000
      },
      {
        id: "3",
        nombre: "Jordan Air 1 Retro",
        precioCosto: 68000,
        precioVenta: 120000,
        margenGanancia: 52000,
        porcentajeMargen: 76.47,
        ventas: 12,
        ingresos: 1440000,
        costos: 816000,
        gananciaNeta: 624000
      }
    ]
  }

  // Obtener egresos por período
  async getEgresos(fromDate?: Date, toDate?: Date): Promise<Egreso[]> {
    // Mock data - en producción esto vendría de la base de datos
    return [
      {
        id: "1",
        descripcion: "Alquiler local comercial",
        monto: 150000,
        categoria: "Operativo",
        fecha: new Date(),
        tipo: "operativo"
      },
      {
        id: "2",
        descripcion: "Servicios públicos",
        monto: 45000,
        categoria: "Operativo",
        fecha: new Date(),
        tipo: "operativo"
      },
      {
        id: "3",
        descripcion: "Salarios empleados",
        monto: 300000,
        categoria: "Administrativo",
        fecha: new Date(),
        tipo: "administrativo"
      },
      {
        id: "4",
        descripcion: "Publicidad en redes sociales",
        monto: 80000,
        categoria: "Marketing",
        fecha: new Date(),
        tipo: "marketing"
      },
      {
        id: "5",
        descripcion: "Material de oficina",
        monto: 25000,
        categoria: "Administrativo",
        fecha: new Date(),
        tipo: "administrativo"
      }
    ]
  }

  // Calcular balance financiero
  async getBalanceFinanciero(fromDate?: Date, toDate?: Date): Promise<BalanceFinanciero> {
    const productos = await this.getProductosFinancieros(fromDate, toDate)
    const egresos = await this.getEgresos(fromDate, toDate)
    
    // Calcular totales
    const ingresosTotales = productos.reduce((sum, p) => sum + p.ingresos, 0)
    const costosProductos = productos.reduce((sum, p) => sum + p.costos, 0)
    const egresosTotales = egresos.reduce((sum, e) => sum + e.monto, 0)
    
    // Categorizar egresos
    const egresosOperativos = egresos
      .filter(e => e.tipo === 'operativo')
      .reduce((sum, e) => sum + e.monto, 0)
    
    const egresosAdministrativos = egresos
      .filter(e => e.tipo === 'administrativo')
      .reduce((sum, e) => sum + e.monto, 0)
    
    const egresosMarketing = egresos
      .filter(e => e.tipo === 'marketing')
      .reduce((sum, e) => sum + e.monto, 0)
    
    const egresosOtros = egresos
      .filter(e => e.tipo === 'otros')
      .reduce((sum, e) => sum + e.monto, 0)
    
    // Calcular ganancias
    const gananciaBruta = ingresosTotales - costosProductos
    const gananciaNeta = gananciaBruta - egresosTotales
    
    // Calcular márgenes
    const margenBruto = ingresosTotales > 0 ? (gananciaBruta / ingresosTotales) * 100 : 0
    const margenNeto = ingresosTotales > 0 ? (gananciaNeta / ingresosTotales) * 100 : 0
    
    return {
      periodo: "Período actual",
      fechaInicio: fromDate || new Date(),
      fechaFin: toDate || new Date(),
      ingresosTotales,
      ventasTotales: productos.reduce((sum, p) => sum + p.ventas, 0),
      costosTotales: costosProductos + egresosTotales,
      costosProductos,
      egresosTotales,
      egresosOperativos,
      egresosAdministrativos,
      egresosMarketing,
      egresosOtros,
      gananciaBruta,
      gananciaNeta,
      margenBruto,
      margenNeto,
      tendenciaIngresos: 15, // Mock data
      tendenciaEgresos: -8,  // Mock data
      tendenciaGanancia: 25  // Mock data
    }
  }

  // Obtener métricas financieras resumidas
  async getMetricasFinancieras(fromDate?: Date, toDate?: Date): Promise<MetricasFinancieras> {
    const balance = await this.getBalanceFinanciero(fromDate, toDate)
    
    return {
      gananciaNeta: {
        valor: balance.gananciaNeta,
        cambio: balance.tendenciaGanancia,
        tipo: balance.tendenciaGanancia >= 0 ? "aumento" : "disminucion",
        formato: "moneda"
      },
      margenNeto: {
        valor: balance.margenNeto,
        cambio: 5.2,
        tipo: "aumento",
        formato: "porcentaje"
      },
      egresosTotales: {
        valor: balance.egresosTotales,
        cambio: balance.tendenciaEgresos,
        tipo: balance.tendenciaEgresos >= 0 ? "aumento" : "disminucion",
        formato: "moneda"
      },
      rentabilidad: {
        valor: balance.gananciaNeta > 0 ? (balance.gananciaNeta / balance.ingresosTotales) * 100 : 0,
        cambio: 3.8,
        tipo: "aumento",
        formato: "porcentaje"
      },
      flujoCaja: {
        valor: balance.ingresosTotales - balance.egresosTotales,
        cambio: 12.5,
        tipo: "aumento",
        formato: "moneda"
      }
    }
  }

  // Obtener análisis de rentabilidad por categoría
  async getRentabilidadPorCategoria(fromDate?: Date, toDate?: Date): Promise<any[]> {
    // Mock data
    return [
      {
        categoria: "Running",
        ingresos: 1500000,
        costos: 900000,
        egresos: 200000,
        ganancia: 400000,
        margen: 26.67
      },
      {
        categoria: "Basketball",
        ingresos: 1800000,
        costos: 1080000,
        egresos: 180000,
        ganancia: 540000,
        margen: 30.00
      },
      {
        categoria: "Lifestyle",
        ingresos: 1600000,
        costos: 960000,
        egresos: 160000,
        ganancia: 480000,
        margen: 30.00
      }
    ]
  }
}

export const financialMetricsService = new FinancialMetricsService()
