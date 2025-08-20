// Servicio de datos mockeados para "Los de Siempre Sneakers" CRM
// Simula una base de datos local sin necesidad de Supabase

export interface Categoria {
  id: number
  nombre: string
  descripcion: string
  color: string
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria_id: number
  sku: string
  marca: string
  modelo: string
  talles_disponibles: string[]
  created_at?: string
  updated_at?: string
}

export interface Cliente {
  id: number
  nombre: string
  email: string
  telefono: string
  direccion: string
  estado: 'activo' | 'inactivo'
  created_at?: string
  updated_at?: string
}

export interface Venta {
  id: number
  cliente_id: number
  fecha_venta: string
  total: number
  metodo_pago: string
  estado: 'completada' | 'pendiente' | 'cancelada'
  notas?: string
  created_at?: string
  updated_at?: string
}

export interface VentaDetalle {
  id: number
  venta_id: number
  producto_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export interface Egreso {
  id: number
  fecha_egreso: string
  descripcion: string
  categoria: string
  monto: number
  proveedor: string
  metodo_pago: string
  notas?: string
  created_at?: string
  updated_at?: string
}

export interface MetricasDashboard {
  ventasHoy: number
  clientesActivos: number
  totalProductos: number
  stockTotal: number
  pedidosPendientes: number
  cambioVentasHoy: number
  nuevosClientesSemana: number
  productosStockBajo: number
  pedidosRequierenAtencion: number
}

export interface ProductoMasVendido {
  id: number
  nombre: string
  ventas: number
  ingresos: number
}

// Datos mockeados iniciales
const categoriasMock: Categoria[] = [
  { id: 1, nombre: 'Running', descripcion: 'Zapatillas para correr y entrenamiento', color: '#22c55e' },
  { id: 2, nombre: 'Basketball', descripcion: 'Zapatillas para baloncesto', color: '#3b82f6' },
  { id: 3, nombre: 'Lifestyle', descripcion: 'Zapatillas casuales y urbanas', color: '#8b5cf6' },
  { id: 4, nombre: 'Training', descripcion: 'Zapatillas para entrenamiento funcional', color: '#f59e0b' },
  { id: 5, nombre: 'Soccer', descripcion: 'Botines de fútbol', color: '#ef4444' },
  { id: 6, nombre: 'Skate', descripcion: 'Zapatillas para skateboarding', color: '#06b6d4' },
  { id: 7, nombre: 'Tennis', descripcion: 'Zapatillas para tenis', color: '#84cc16' },
  { id: 8, nombre: 'Golf', descripcion: 'Zapatillas para golf', color: '#10b981' }
]

const productosMock: Producto[] = [
  // Nike Running
  { id: 1, nombre: 'Nike Air Zoom Pegasus 40', descripcion: 'Zapatilla de running con tecnología Air Zoom para máximo confort', precio: 89999, stock: 25, categoria_id: 1, sku: 'NIKE-PEG40-001', marca: 'Nike', modelo: 'Air Zoom Pegasus 40', talles_disponibles: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'] },
  { id: 2, nombre: 'Nike React Infinity Run 3', descripcion: 'Zapatilla de running con tecnología React para estabilidad', precio: 109999, stock: 18, categoria_id: 1, sku: 'NIKE-REACT3-002', marca: 'Nike', modelo: 'React Infinity Run 3', talles_disponibles: ['7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5'] },
  { id: 3, nombre: 'Nike ZoomX Vaporfly 3', descripcion: 'Zapatilla de competición con tecnología ZoomX', precio: 189999, stock: 12, categoria_id: 1, sku: 'NIKE-VAPOR3-003', marca: 'Nike', modelo: 'ZoomX Vaporfly 3', talles_disponibles: ['8', '8.5', '9', '9.5', '10', '10.5', '11'] },
  
  // Nike Basketball
  { id: 4, nombre: 'Nike LeBron 20', descripcion: 'Zapatilla de baloncesto signature de LeBron James', precio: 159999, stock: 15, categoria_id: 2, sku: 'NIKE-LEBRON20-004', marca: 'Nike', modelo: 'LeBron 20', talles_disponibles: ['8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'] },
  { id: 5, nombre: 'Nike KD 16', descripcion: 'Zapatilla de baloncesto signature de Kevin Durant', precio: 139999, stock: 20, categoria_id: 2, sku: 'NIKE-KD16-005', marca: 'Nike', modelo: 'KD 16', talles_disponibles: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5'] },
  { id: 6, nombre: 'Nike Air Jordan 38', descripcion: 'Zapatilla de baloncesto legendaria Air Jordan', precio: 179999, stock: 22, categoria_id: 2, sku: 'NIKE-AJ38-006', marca: 'Nike', modelo: 'Air Jordan 38', talles_disponibles: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'] },
  
  // Nike Lifestyle
  { id: 7, nombre: 'Nike Air Force 1', descripcion: 'Zapatilla clásica de estilo urbano', precio: 99999, stock: 35, categoria_id: 3, sku: 'NIKE-AF1-007', marca: 'Nike', modelo: 'Air Force 1', talles_disponibles: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'] },
  { id: 8, nombre: 'Nike Dunk Low', descripcion: 'Zapatilla retro de skateboarding', precio: 89999, stock: 28, categoria_id: 3, sku: 'NIKE-DUNK-008', marca: 'Nike', modelo: 'Dunk Low', talles_disponibles: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'] },
  { id: 9, nombre: 'Nike Blazer Mid', descripcion: 'Zapatilla vintage de estilo retro', precio: 79999, stock: 30, categoria_id: 3, sku: 'NIKE-BLAZER-009', marca: 'Nike', modelo: 'Blazer Mid', talles_disponibles: ['7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5'] },
  
  // Adidas Running
  { id: 10, nombre: 'Adidas Ultraboost 22', descripcion: 'Zapatilla de running con tecnología Boost', precio: 129999, stock: 20, categoria_id: 1, sku: 'ADIDAS-UB22-010', marca: 'Adidas', modelo: 'Ultraboost 22', talles_disponibles: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'] },
  { id: 11, nombre: 'Adidas Solarboost 4', descripcion: 'Zapatilla de running con estabilidad mejorada', precio: 99999, stock: 18, categoria_id: 1, sku: 'ADIDAS-SOLAR4-011', marca: 'Adidas', modelo: 'Solarboost 4', talles_disponibles: ['7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5'] },
  { id: 12, nombre: 'Adidas Adizero Adios Pro 3', descripcion: 'Zapatilla de competición ultraligera', precio: 169999, stock: 14, categoria_id: 1, sku: 'ADIDAS-ADIOS3-012', marca: 'Adidas', modelo: 'Adizero Adios Pro 3', talles_disponibles: ['8', '8.5', '9', '9.5', '10', '10.5', '11'] },
  
  // Adidas Basketball
  { id: 13, nombre: 'Adidas Harden Vol. 7', descripcion: 'Zapatilla de baloncesto signature de James Harden', precio: 149999, stock: 16, categoria_id: 2, sku: 'ADIDAS-HARDEN7-013', marca: 'Adidas', modelo: 'Harden Vol. 7', talles_disponibles: ['8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'] },
  { id: 14, nombre: 'Adidas Dame 8', descripcion: 'Zapatilla de baloncesto signature de Damian Lillard', precio: 119999, stock: 19, categoria_id: 2, sku: 'ADIDAS-DAME8-014', marca: 'Adidas', modelo: 'Dame 8', talles_disponibles: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5'] },
  { id: 15, nombre: 'Adidas Trae Young 2', descripcion: 'Zapatilla de baloncesto signature de Trae Young', precio: 129999, stock: 17, categoria_id: 2, sku: 'ADIDAS-TRAE2-015', marca: 'Adidas', modelo: 'Trae Young 2', talles_disponibles: ['8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'] },
  
  // Adidas Lifestyle
  { id: 16, nombre: 'Adidas Stan Smith', descripcion: 'Zapatilla clásica de tenis', precio: 69999, stock: 40, categoria_id: 3, sku: 'ADIDAS-STAN-016', marca: 'Adidas', modelo: 'Stan Smith', talles_disponibles: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'] },
  { id: 17, nombre: 'Adidas Superstar', descripcion: 'Zapatilla icónica con puntera de concha', precio: 79999, stock: 32, categoria_id: 3, sku: 'ADIDAS-SUPER-017', marca: 'Adidas', modelo: 'Superstar', talles_disponibles: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'] },
  { id: 18, nombre: 'Adidas Gazelle', descripcion: 'Zapatilla retro de estilo vintage', precio: 69999, stock: 25, categoria_id: 3, sku: 'ADIDAS-GAZELLE-018', marca: 'Adidas', modelo: 'Gazelle', talles_disponibles: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5'] },
  
  // Otras marcas
  { id: 19, nombre: 'Puma RS-X', descripcion: 'Zapatilla retro con estilo chunky', precio: 89999, stock: 22, categoria_id: 3, sku: 'PUMA-RSX-019', marca: 'Puma', modelo: 'RS-X', talles_disponibles: ['7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5'] },
  { id: 20, nombre: 'New Balance 574', descripcion: 'Zapatilla clásica de running', precio: 79999, stock: 28, categoria_id: 1, sku: 'NB-574-020', marca: 'New Balance', modelo: '574', talles_disponibles: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'] },
  { id: 21, nombre: 'Converse Chuck Taylor All Star', descripcion: 'Zapatilla canvas legendaria', precio: 59999, stock: 45, categoria_id: 3, sku: 'CONVERSE-CHUCK-021', marca: 'Converse', modelo: 'Chuck Taylor All Star', talles_disponibles: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13'] },
  { id: 22, nombre: 'Vans Old Skool', descripcion: 'Zapatilla de skate con franja lateral', precio: 69999, stock: 30, categoria_id: 6, sku: 'VANS-OLDSKOOL-022', marca: 'Vans', modelo: 'Old Skool', talles_disponibles: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'] },
  { id: 23, nombre: 'Reebok Classic Leather', descripcion: 'Zapatilla retro de cuero', precio: 69999, stock: 25, categoria_id: 3, sku: 'REEBOK-CLASSIC-023', marca: 'Reebok', modelo: 'Classic Leather', talles_disponibles: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5'] },
  { id: 24, nombre: 'Asics Gel-Kayano 30', descripcion: 'Zapatilla de running con tecnología Gel', precio: 119999, stock: 20, categoria_id: 1, sku: 'ASICS-KAYANO30-024', marca: 'Asics', modelo: 'Gel-Kayano 30', talles_disponibles: ['7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'] }
]

const clientesMock: Cliente[] = [
  { id: 1, nombre: 'Juan Carlos Rodríguez', email: 'juan.rodriguez@email.com', telefono: '+54 11 1234-5678', direccion: 'Av. Corrientes 1234, CABA', estado: 'activo' },
  { id: 2, nombre: 'María González', email: 'maria.gonzalez@email.com', telefono: '+54 11 2345-6789', direccion: 'Calle Florida 567, CABA', estado: 'activo' },
  { id: 3, nombre: 'Carlos López', email: 'carlos.lopez@email.com', telefono: '+54 11 3456-7890', direccion: 'Av. Santa Fe 890, CABA', estado: 'activo' },
  { id: 4, nombre: 'Ana Martínez', email: 'ana.martinez@email.com', telefono: '+54 11 4567-8901', direccion: 'Calle Lavalle 234, CABA', estado: 'activo' },
  { id: 5, nombre: 'Roberto Silva', email: 'roberto.silva@email.com', telefono: '+54 11 5678-9012', direccion: 'Av. Córdoba 456, CABA', estado: 'activo' },
  { id: 6, nombre: 'Laura Fernández', email: 'laura.fernandez@email.com', telefono: '+54 11 6789-0123', direccion: 'Calle Sarmiento 789, CABA', estado: 'activo' },
  { id: 7, nombre: 'Diego Morales', email: 'diego.morales@email.com', telefono: '+54 11 7890-1234', direccion: 'Av. Callao 123, CABA', estado: 'activo' },
  { id: 8, nombre: 'Patricia Ruiz', email: 'patricia.ruiz@email.com', telefono: '+54 11 8901-2345', direccion: 'Calle Tucumán 456, CABA', estado: 'activo' },
  { id: 9, nombre: 'Fernando Torres', email: 'fernando.torres@email.com', telefono: '+54 11 9012-3456', direccion: 'Av. 9 de Julio 789, CABA', estado: 'activo' },
  { id: 10, nombre: 'Silvia Vargas', email: 'silvia.vargas@email.com', telefono: '+54 11 0123-4567', direccion: 'Calle San Martín 012, CABA', estado: 'activo' }
]

const ventasMock: Venta[] = [
  { id: 1, cliente_id: 1, fecha_venta: '2024-01-15', total: 89999, metodo_pago: 'tarjeta', estado: 'completada', notas: 'Venta de Nike Air Force 1' },
  { id: 2, cliente_id: 2, fecha_venta: '2024-01-16', total: 159999, metodo_pago: 'efectivo', estado: 'completada', notas: 'Venta de Nike LeBron 20' },
  { id: 3, cliente_id: 3, fecha_venta: '2024-01-17', total: 129999, metodo_pago: 'transferencia', estado: 'completada', notas: 'Venta de Adidas Ultraboost 22' },
  { id: 4, cliente_id: 4, fecha_venta: '2024-01-18', total: 79999, metodo_pago: 'tarjeta', estado: 'completada', notas: 'Venta de Nike Blazer Mid' },
  { id: 5, cliente_id: 5, fecha_venta: '2024-01-19', total: 109999, metodo_pago: 'efectivo', estado: 'completada', notas: 'Venta de Nike React Infinity Run 3' },
  { id: 6, cliente_id: 6, fecha_venta: '2024-01-20', total: 69999, metodo_pago: 'tarjeta', estado: 'completada', notas: 'Venta de Adidas Stan Smith' },
  { id: 7, cliente_id: 7, fecha_venta: '2024-01-21', total: 179999, metodo_pago: 'transferencia', estado: 'completada', notas: 'Venta de Nike Air Jordan 38' },
  { id: 8, cliente_id: 8, fecha_venta: '2024-01-22', total: 89999, metodo_pago: 'efectivo', estado: 'completada', notas: 'Venta de Nike Dunk Low' },
  { id: 9, cliente_id: 9, fecha_venta: '2024-01-23', total: 149999, metodo_pago: 'tarjeta', estado: 'completada', notas: 'Venta de Adidas Harden Vol. 7' },
  { id: 10, cliente_id: 10, fecha_venta: '2024-01-24', total: 69999, metodo_pago: 'efectivo', estado: 'completada', notas: 'Venta de Converse Chuck Taylor' }
]

const ventasDetalleMock: VentaDetalle[] = [
  { id: 1, venta_id: 1, producto_id: 7, cantidad: 1, precio_unitario: 89999, subtotal: 89999 },
  { id: 2, venta_id: 2, producto_id: 4, cantidad: 1, precio_unitario: 159999, subtotal: 159999 },
  { id: 3, venta_id: 3, producto_id: 10, cantidad: 1, precio_unitario: 129999, subtotal: 129999 },
  { id: 4, venta_id: 4, producto_id: 9, cantidad: 1, precio_unitario: 79999, subtotal: 79999 },
  { id: 5, venta_id: 5, producto_id: 2, cantidad: 1, precio_unitario: 109999, subtotal: 109999 },
  { id: 6, venta_id: 6, producto_id: 16, cantidad: 1, precio_unitario: 69999, subtotal: 69999 },
  { id: 7, venta_id: 7, producto_id: 6, cantidad: 1, precio_unitario: 179999, subtotal: 179999 },
  { id: 8, venta_id: 8, producto_id: 8, cantidad: 1, precio_unitario: 89999, subtotal: 89999 },
  { id: 9, venta_id: 9, producto_id: 13, cantidad: 1, precio_unitario: 149999, subtotal: 149999 },
  { id: 10, venta_id: 10, producto_id: 21, cantidad: 1, precio_unitario: 59999, subtotal: 59999 }
]

const egresosMock: Egreso[] = [
  { id: 1, fecha_egreso: '2024-01-10', descripcion: 'Compra de stock Nike Air Force 1', categoria: 'Proveedores', monto: 450000, proveedor: 'Nike Argentina', metodo_pago: 'transferencia', notas: 'Compra de 5 pares' },
  { id: 2, fecha_egreso: '2024-01-12', descripcion: 'Compra de stock Adidas Ultraboost 22', categoria: 'Proveedores', monto: 520000, proveedor: 'Adidas Argentina', metodo_pago: 'transferencia', notas: 'Compra de 4 pares' },
  { id: 3, fecha_egreso: '2024-01-14', descripcion: 'Alquiler local comercial', categoria: 'Alquiler', monto: 150000, proveedor: 'Propietario Local', metodo_pago: 'transferencia', notas: 'Alquiler mensual' },
  { id: 4, fecha_egreso: '2024-01-15', descripcion: 'Servicios públicos', categoria: 'Servicios', monto: 25000, proveedor: 'EDESUR', metodo_pago: 'débito', notas: 'Electricidad y gas' },
  { id: 5, fecha_egreso: '2024-01-16', descripcion: 'Mantenimiento aire acondicionado', categoria: 'Mantenimiento', monto: 35000, proveedor: 'Clima Service', metodo_pago: 'efectivo', notas: 'Limpieza y revisión' },
  { id: 6, fecha_egreso: '2024-01-17', descripcion: 'Compra de stock Nike LeBron 20', categoria: 'Proveedores', monto: 800000, proveedor: 'Nike Argentina', metodo_pago: 'transferencia', notas: 'Compra de 5 pares' },
  { id: 7, fecha_egreso: '2024-01-18', descripcion: 'Marketing digital', categoria: 'Marketing', monto: 45000, proveedor: 'Agencia Digital', metodo_pago: 'transferencia', notas: 'Campaña Instagram y Facebook' },
  { id: 8, fecha_egreso: '2024-01-19', descripcion: 'Seguro local', categoria: 'Seguros', monto: 28000, proveedor: 'Seguros La Caja', metodo_pago: 'débito', notas: 'Seguro mensual' },
  { id: 9, fecha_egreso: '2024-01-20', descripcion: 'Compra de stock Adidas Stan Smith', categoria: 'Proveedores', monto: 280000, proveedor: 'Adidas Argentina', metodo_pago: 'transferencia', notas: 'Compra de 4 pares' },
  { id: 10, fecha_egreso: '2024-01-21', descripcion: 'Limpieza local', categoria: 'Servicios', monto: 15000, proveedor: 'Limpieza Express', metodo_pago: 'efectivo', notas: 'Limpieza semanal' }
]

// Clase para manejar los datos mockeados
class MockDataService {
  private categorias: Categoria[] = [...categoriasMock]
  private productos: Producto[] = [...productosMock]
  private clientes: Cliente[] = [...clientesMock]
  private ventas: Venta[] = [...ventasMock]
  private ventasDetalle: VentaDetalle[] = [...ventasDetalleMock]
  private egresos: Egreso[] = [...egresosMock]

  // Métodos para categorías
  async getCategorias(): Promise<Categoria[]> {
    return Promise.resolve(this.categorias)
  }

  async createCategoria(categoria: Omit<Categoria, 'id'>): Promise<Categoria> {
    const newCategoria: Categoria = {
      ...categoria,
      id: Math.max(...this.categorias.map(c => c.id)) + 1
    }
    this.categorias.push(newCategoria)
    return Promise.resolve(newCategoria)
  }

  // Métodos para productos
  async getProductos(): Promise<Producto[]> {
    return Promise.resolve(this.productos)
  }

  async getProductoById(id: number): Promise<Producto | null> {
    const producto = this.productos.find(p => p.id === id)
    return Promise.resolve(producto || null)
  }

  async createProducto(producto: Omit<Producto, 'id'>): Promise<Producto> {
    const newProducto: Producto = {
      ...producto,
      id: Math.max(...this.productos.map(p => p.id)) + 1
    }
    this.productos.push(newProducto)
    return Promise.resolve(newProducto)
  }

  async updateProducto(id: number, producto: Partial<Producto>): Promise<Producto | null> {
    const index = this.productos.findIndex(p => p.id === id)
    if (index === -1) return Promise.resolve(null)
    
    this.productos[index] = { ...this.productos[index], ...producto }
    return Promise.resolve(this.productos[index])
  }

  async deleteProducto(id: number): Promise<boolean> {
    const index = this.productos.findIndex(p => p.id === id)
    if (index === -1) return Promise.resolve(false)
    
    this.productos.splice(index, 1)
    return Promise.resolve(true)
  }

  // Métodos para clientes
  async getClientes(): Promise<Cliente[]> {
    return Promise.resolve(this.clientes)
  }

  async getClienteById(id: number): Promise<Cliente | null> {
    const cliente = this.clientes.find(c => c.id === id)
    return Promise.resolve(cliente || null)
  }

  async createCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    const newCliente: Cliente = {
      ...cliente,
      id: Math.max(...this.clientes.map(c => c.id)) + 1
    }
    this.clientes.push(newCliente)
    return Promise.resolve(newCliente)
  }

  async updateCliente(id: number, cliente: Partial<Cliente>): Promise<Cliente | null> {
    const index = this.clientes.findIndex(c => c.id === id)
    if (index === -1) return Promise.resolve(null)
    
    this.clientes[index] = { ...this.clientes[index], ...cliente }
    return Promise.resolve(this.clientes[index])
  }

  async deleteCliente(id: number): Promise<boolean> {
    const index = this.clientes.findIndex(c => c.id === id)
    if (index === -1) return Promise.resolve(false)
    
    this.clientes.splice(index, 1)
    return Promise.resolve(true)
  }

  // Métodos para ventas
  async getVentas(): Promise<Venta[]> {
    return Promise.resolve(this.ventas)
  }

  async getVentaById(id: number): Promise<Venta | null> {
    const venta = this.ventas.find(v => v.id === id)
    return Promise.resolve(venta || null)
  }

  async createVenta(venta: Omit<Venta, 'id'>): Promise<Venta> {
    const newVenta: Venta = {
      ...venta,
      id: Math.max(...this.ventas.map(v => v.id)) + 1
    }
    this.ventas.push(newVenta)
    return Promise.resolve(newVenta)
  }

  // Métodos para egresos
  async getEgresos(): Promise<Egreso[]> {
    return Promise.resolve(this.egresos)
  }

  async getEgresoById(id: number): Promise<Egreso | null> {
    const egreso = this.egresos.find(e => e.id === id)
    return Promise.resolve(egreso || null)
  }

  async createEgreso(egreso: Omit<Egreso, 'id'>): Promise<Egreso> {
    const newEgreso: Egreso = {
      ...egreso,
      id: Math.max(...this.egresos.map(e => e.id)) + 1
    }
    this.egresos.push(newEgreso)
    return Promise.resolve(newEgreso)
  }

  async updateEgreso(id: number, egreso: Partial<Egreso>): Promise<Egreso | null> {
    const index = this.egresos.findIndex(e => e.id === id)
    if (index === -1) return Promise.resolve(null)
    
    this.egresos[index] = { ...this.egresos[index], ...egreso }
    return Promise.resolve(this.egresos[index])
  }

  async deleteEgreso(id: number): Promise<boolean> {
    const index = this.egresos.findIndex(e => e.id === id)
    if (index === -1) return Promise.resolve(false)
    
    this.egresos.splice(index, 1)
    return Promise.resolve(true)
  }

  // Métodos para métricas del dashboard
  async getMetricasDashboard(fromDate?: Date, toDate?: Date): Promise<MetricasDashboard> {
    const hoy = new Date()
    const ayer = new Date(hoy)
    ayer.setDate(ayer.getDate() - 1)
    
    const ventasHoy = this.ventas.filter(v => v.fecha_venta === hoy.toISOString().split('T')[0])
      .reduce((sum, v) => sum + v.total, 0)
    
    const ventasAyer = this.ventas.filter(v => v.fecha_venta === ayer.toISOString().split('T')[0])
      .reduce((sum, v) => sum + v.total, 0)
    
    const cambioVentasHoy = ventasAyer > 0 ? ((ventasHoy - ventasAyer) / ventasAyer) * 100 : 0
    
    const clientesActivos = this.clientes.filter(c => c.estado === 'activo').length
    
    const totalProductos = this.productos.length
    const stockTotal = this.productos.reduce((sum, p) => sum + p.stock, 0)
    
    const productosStockBajo = this.productos.filter(p => p.stock < 10).length
    
    const pedidosPendientes = this.ventas.filter(v => v.estado === 'pendiente').length
    const pedidosRequierenAtencion = this.ventas.filter(v => v.estado === 'pendiente').length
    
    // Simular nuevos clientes esta semana
    const nuevosClientesSemana = Math.floor(Math.random() * 5) + 1

    return Promise.resolve({
      ventasHoy,
      clientesActivos,
      totalProductos,
      stockTotal,
      pedidosPendientes,
      cambioVentasHoy,
      nuevosClientesSemana,
      productosStockBajo,
      pedidosRequierenAtencion
    })
  }

  async getProductosMasVendidos(fromDate?: Date, toDate?: Date): Promise<ProductoMasVendido[]> {
    // Simular productos más vendidos basado en las ventas existentes
    const productosVendidos = this.ventasDetalle.map(vd => {
      const producto = this.productos.find(p => p.id === vd.producto_id)
      return {
        id: vd.producto_id,
        nombre: producto?.nombre || 'Producto desconocido',
        ventas: vd.cantidad,
        ingresos: vd.subtotal
      }
    })

    // Agrupar por producto y sumar ventas
    const productosAgrupados = productosVendidos.reduce((acc, pv) => {
      const existing = acc.find(p => p.id === pv.id)
      if (existing) {
        existing.ventas += pv.ventas
        existing.ingresos += pv.ingresos
      } else {
        acc.push({ ...pv })
      }
      return acc
    }, [] as ProductoMasVendido[])

    // Ordenar por ventas y retornar top 5
    return Promise.resolve(
      productosAgrupados
        .sort((a, b) => b.ventas - a.ventas)
        .slice(0, 5)
    )
  }
}

// Exportar instancia única del servicio
export const mockDataService = new MockDataService()

// Los tipos ya están exportados individualmente arriba
