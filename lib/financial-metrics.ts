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
        precioVenta: 89999,
        margenGanancia: 44999,
        porcentajeMargen: 100.0,
        ventas: 3,
        ingresos: 269997,
        costos: 135000,
        gananciaNeta: 134997
      },
      {
        id: "2",
        nombre: "Nike LeBron 20",
        precioCosto: 80000,
        precioVenta: 159999,
        margenGanancia: 79999,
        porcentajeMargen: 100.0,
        ventas: 3,
        ingresos: 479997,
        costos: 240000,
        gananciaNeta: 239997
      },
      {
        id: "3",
        nombre: "Nike React Infinity Run 3",
        precioCosto: 55000,
        precioVenta: 109999,
        margenGanancia: 54999,
        porcentajeMargen: 100.0,
        ventas: 3,
        ingresos: 329997,
        costos: 165000,
        gananciaNeta: 164997
      },
      {
        id: "4",
        nombre: "Nike Air Jordan 38",
        precioCosto: 90000,
        precioVenta: 179999,
        margenGanancia: 89999,
        porcentajeMargen: 100.0,
        ventas: 3,
        ingresos: 539997,
        costos: 270000,
        gananciaNeta: 269997
      },
      {
        id: "5",
        nombre: "Adidas Ultraboost 22",
        precioCosto: 65000,
        precioVenta: 129999,
        margenGanancia: 64999,
        porcentajeMargen: 100.0,
        ventas: 3,
        ingresos: 389997,
        costos: 195000,
        gananciaNeta: 194997
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
        ingresos: 989994,
        costos: 495000,
        egresos: 600000,
        ganancia: -105006,
        margen: -10.6
      },
      {
        categoria: "Basketball",
        ingresos: 959994,
        costos: 480000,
        egresos: 300000,
        ganancia: 179994,
        margen: 18.8
      },
      {
        categoria: "Lifestyle",
        ingresos: 599994,
        costos: 300000,
        egresos: 200000,
        ganancia: 99994,
        margen: 16.7
      }
    ]
  }
}

export const financialMetricsService = new FinancialMetricsService()
