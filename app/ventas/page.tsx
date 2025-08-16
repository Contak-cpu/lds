"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Search,
  Plus,
  Eye,
  Package,
  User,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserX,
  Zap,
  Trash2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

interface Cliente {
  id: string
  nombre: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  provincia: string
  codigo_postal: string
  fecha_registro: string
  notas: string
  created_at: string
  updated_at: string
}

interface Producto {
  id: string
  sku: string
  nombre: string
  descripcion: string | null
  categoria: string
  precio: number
  costo: number
  stock: number
  stock_minimo: number
  imagen_url: string | null
  activo: boolean
  created_at: string
  updated_at: string
}

interface VentaItem {
  id?: string
  venta_id?: string
  producto_id?: string
  producto_nombre: string
  cantidad: number
  precio_unitario: number
  subtotal?: number
  created_at?: string
  updated_at?: string
  categoria: string
  descripcion: string
  imagen_url: string | null
}

interface Venta {
  id: string
  numeroVenta: string
  cliente: string
  clienteEmail: string
  fecha: string
  estado: string
  total: number
  metodoPago: string
  notas: string
  esCasual: boolean
  productos: VentaItem[]
}

interface VentaSupabase {
  id: string
  cliente_id: string | null
  cliente_nombre: string | null
  cliente_casual: string | null
  tipo_venta: string
  estado: string
  subtotal: number
  descuento: number
  total: number
  metodo_pago: string
  notas: string | null
  fecha_venta: string
  created_at: string
  updated_at: string
  venta_items: VentaItem[]
}

interface ProductoCarrito extends Producto {
  cantidad: number
  esPersonalizado?: boolean
}

interface VentaFormErrors {
  clienteSeleccionado?: string
  clienteCasual?: string
  productoPersonalizado?: {
    nombre?: string
    precio?: string
  }
  metodoPago?: string
  carrito?: string
}

// Función de validación para ventas
const validateVentaForm = (
  carrito: ProductoCarrito[],
  clienteSeleccionado: string,
  clienteCasual: string,
  productoPersonalizado: { nombre: string; precio: string },
  metodoPago: string,
  tipoVenta: string
): VentaFormErrors => {
  const errors: VentaFormErrors = {}

  // Validar carrito
  if (carrito.length === 0) {
    errors.carrito = "Debe agregar al menos un producto al carrito"
  }

  // Validar cliente según el tipo de venta
  if (tipoVenta === "registrada") {
    if (!clienteSeleccionado.trim()) {
      errors.clienteSeleccionado = "Debe seleccionar un cliente registrado"
    }
  } else {
    if (!clienteCasual.trim()) {
      errors.clienteCasual = "Debe ingresar el nombre del cliente casual"
    } else if (clienteCasual.trim().length < 2) {
      errors.clienteCasual = "El nombre del cliente debe tener al menos 2 caracteres"
    }
  }

  // Validar producto personalizado si existe
  if (carrito.some(item => item.esPersonalizado)) {
    if (!productoPersonalizado.nombre.trim()) {
      errors.productoPersonalizado = { ...errors.productoPersonalizado, nombre: "El nombre del producto personalizado es obligatorio" }
    }
    if (!productoPersonalizado.precio.trim()) {
      errors.productoPersonalizado = { ...errors.productoPersonalizado, precio: "El precio del producto personalizado es obligatorio" }
    } else if (!/^\d+(\.\d{1,2})?$/.test(productoPersonalizado.precio.trim())) {
      errors.productoPersonalizado = { ...errors.productoPersonalizado, precio: "El precio debe ser un número válido (máximo 2 decimales)" }
    } else if (parseFloat(productoPersonalizado.precio) < 0) {
      errors.productoPersonalizado = { ...errors.productoPersonalizado, precio: "El precio no puede ser negativo" }
    }
  }

  // Validar método de pago
  if (!metodoPago.trim()) {
    errors.metodoPago = "Debe seleccionar un método de pago"
  }

  return errors
}

interface ProductoSupabase {
  id: string
  sku?: string
  nombre: string
  descripcion: string | null
  categoria: string
  precio: number
  costo: number
  stock: number
  stock_minimo: number
  imagen_url: string | null
  activo: boolean
  created_at: string
  updated_at: string
}

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState("")
  const [searchProducto, setSearchProducto] = useState("")
  const [tipoVenta, setTipoVenta] = useState("registrada")
  const [clienteCasual, setClienteCasual] = useState("")
  const [productoPersonalizado, setProductoPersonalizado] = useState({ nombre: "", precio: "" })
  const [metodoPago, setMetodoPago] = useState("")
  const [notasVenta, setNotasVenta] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [isNewSaleDialogOpen, setIsNewSaleDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [formErrors, setFormErrors] = useState<VentaFormErrors>({})

  const supabase = createClient()

  const totalCarrito = carrito.reduce((sum: number, item: ProductoCarrito) => sum + item.precio * item.cantidad, 0)

  const cargarDatos = async () => {
    try {
      setLoading(true)

      const [ventasResponse, productosResponse, clientesResponse] = await Promise.all([
        supabase
          .from("ventas")
          .select(`
            *,
            venta_items (
              id,
              venta_id,
              producto_id,
              producto_nombre,
              cantidad,
              precio_unitario,
              subtotal,
              categoria,
              descripcion,
              imagen_url,
              created_at,
              updated_at
            )
          `)
          .order("created_at", { ascending: false }),

        supabase.from("productos").select("*").eq("activo", true).order("nombre"),

        supabase.from("clientes").select("*").order("nombre"),
      ])

      if (ventasResponse.error) {
        console.error("Error cargando ventas:", ventasResponse.error)
        throw ventasResponse.error
      }
      if (productosResponse.error) {
        console.error("Error cargando productos:", productosResponse.error)
        throw productosResponse.error
      }
      if (clientesResponse.error) {
        console.error("Error cargando clientes:", clientesResponse.error)
        throw clientesResponse.error
      }

      const ventasTransformadas: Venta[] =
        ventasResponse.data?.map((venta: VentaSupabase, index: number) => {
          const fecha = new Date(venta.created_at)
          const numeroSecuencial = ventasResponse.data!.length - index
          const numeroVenta = `V-${fecha.getFullYear()}-${String(numeroSecuencial).padStart(3, "0")}`

          return {
            id: venta.id,
            numeroVenta: numeroVenta,
            cliente: venta.cliente_id
              ? clientesResponse.data?.find((c: Cliente) => c.id === venta.cliente_id)?.nombre ||
                venta.cliente_nombre ||
                "Cliente sin nombre"
              : venta.cliente_casual || "Cliente sin nombre",
            clienteEmail: venta.cliente_id
              ? clientesResponse.data?.find((c: Cliente) => c.id === venta.cliente_id)?.email || ""
              : "",
            fecha: fecha.toISOString().split("T")[0],
            estado: venta.estado || "Pendiente",
            total: venta.total || 0,
            metodoPago: venta.metodo_pago || "No especificado",
            notas: venta.notas || "",
            esCasual: venta.cliente_id === null,
            productos:
              venta.venta_items?.map(
                (item): VentaItem => ({
                  id: item.id || undefined,
                  venta_id: item.venta_id || undefined,
                  producto_id: item.producto_id || undefined,
                  producto_nombre: item.producto_nombre || "Producto sin nombre",
                  cantidad: item.cantidad || 0,
                  precio_unitario: item.precio_unitario || 0,
                  subtotal: item.subtotal || (item.cantidad || 0) * (item.precio_unitario || 0),
                  created_at: item.created_at || undefined,
                  updated_at: item.updated_at || undefined,
                  categoria: item.categoria || "Sin categoría",
                  descripcion: item.descripcion || "",
                  imagen_url: item.imagen_url || null,
                }),
              ) || [],
          }
        }) || []

      console.log("Ventas cargadas:", ventasResponse.data?.length || 0)
      setVentas(ventasTransformadas)

      const productosTransformados: Producto[] =
        productosResponse.data?.map((producto: ProductoSupabase) => ({
          id: producto.id,
          sku: producto.sku || `SKU-${producto.id.slice(0, 8)}`,
          nombre: producto.nombre,
          precio: producto.precio,
          stock: producto.stock,
          descripcion: producto.descripcion,
          categoria: producto.categoria,
          costo: producto.costo,
          stock_minimo: producto.stock_minimo,
          imagen_url: producto.imagen_url,
          activo: producto.activo,
          created_at: producto.created_at,
          updated_at: producto.updated_at,
        })) || []

      console.log("Productos cargados:", productosResponse.data?.length || 0)
      console.log("Productos activos:", productosTransformados.filter(p => p.activo).length)
      setProductos(productosTransformados)
      
      console.log("Clientes cargados:", clientesResponse.data?.length || 0)
      setClientes(clientesResponse.data || [])
    } catch (error) {
      console.error("Error cargando datos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const agregarAlCarrito = (producto: Producto): void => {
    if (!producto.nombre || producto.precio <= 0) {
      toast({
        title: "Error",
        description: "Producto inválido",
        variant: "destructive",
      })
      return
    }

    const productoExistente = carrito.find((item: ProductoCarrito) => item.id === producto.id)
    if (productoExistente) {
      if (productoExistente.cantidad >= producto.stock) {
        toast({
          title: "Stock insuficiente",
          description: `Solo hay ${producto.stock} unidades disponibles`,
          variant: "destructive",
        })
        return
      }
      actualizarCantidad(producto.id, productoExistente.cantidad + 1)
    } else {
      const nuevoItem: ProductoCarrito = {
        id: producto.id,
        sku: producto.sku,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        stock: producto.stock,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        costo: producto.costo,
        stock_minimo: producto.stock_minimo,
        imagen_url: producto.imagen_url,
        activo: producto.activo,
        created_at: producto.created_at,
        updated_at: producto.updated_at,
      }
      setCarrito([...carrito, nuevoItem])
    }
  }

  const actualizarCantidad = (productoId: string, nuevaCantidad: number): void => {
    if (nuevaCantidad <= 0) {
      removerDelCarrito(productoId)
      return
    }

    const producto = productos.find((p) => p.id === productoId)
    if (producto && nuevaCantidad > producto.stock) {
      toast({
        title: "Stock insuficiente",
        description: `Solo hay ${producto.stock} unidades disponibles`,
        variant: "destructive",
      })
      return
    }

    setCarrito((prev: ProductoCarrito[]) =>
      prev.map((item: ProductoCarrito) => (item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item)),
    )
  }

  const removerDelCarrito = (productoId: string): void => {
    setCarrito((prev: ProductoCarrito[]) => prev.filter((item: ProductoCarrito) => item.id !== productoId))
  }

  const agregarProductoPersonalizado = (): void => {
    const { nombre, precio: precioStr } = productoPersonalizado

    if (!nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre del producto es requerido",
        variant: "destructive",
      })
      return
    }

    const precio = Number.parseFloat(precioStr)
    if (isNaN(precio) || precio <= 0) {
      toast({
        title: "Error",
        description: "El precio debe ser un número válido mayor a 0",
        variant: "destructive",
      })
      return
    }

    const nuevoProducto: Producto = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sku: `CUSTOM-${Date.now()}`,
      nombre: nombre,
      descripcion: "Producto personalizado",
      categoria: "Personalizado",
      precio: precio,
      costo: precio * 0.7, // Asumir 30% de margen
      stock: 999,
      stock_minimo: 0,
      imagen_url: null,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const nuevoItemPersonalizado: ProductoCarrito = {
      ...nuevoProducto,
      cantidad: 1,
      esPersonalizado: true,
    }

    setCarrito([...carrito, nuevoItemPersonalizado])
    setProductoPersonalizado({ nombre: "", precio: "" })
  }

  const eliminarVenta = async (ventaId: string): Promise<void> => {
    try {
      // Primero eliminar los items de venta (se eliminan automáticamente por CASCADE)
      const { error: itemsError } = await supabase
        .from("venta_items")
        .delete()
        .eq("venta_id", ventaId)

      if (itemsError) {
        console.error("Error eliminando items de venta:", itemsError)
        throw new Error(`Error al eliminar los items: ${itemsError.message}`)
      }

      // Luego eliminar la venta
      const { error: ventaError } = await supabase
        .from("ventas")
        .delete()
        .eq("id", ventaId)

      if (ventaError) {
        console.error("Error eliminando venta:", ventaError)
        throw new Error(`Error al eliminar la venta: ${ventaError.message}`)
      }

      // Recargar datos
      await cargarDatos()

      toast({
        title: "Venta eliminada exitosamente",
        description: "La venta y todos sus items han sido eliminados",
      })
    } catch (error) {
      console.error("Error eliminando venta:", error)
      toast({
        title: "Error al eliminar la venta",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      })
    }
  }

  const getEstadoBadge = (estado: "Completado" | "Procesando" | "Pendiente" | "Cancelado" | string) => {
    const badges = {
      Completado: (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completado
        </Badge>
      ),
      Procesando: (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
          <Clock className="w-3 h-3 mr-1" />
          Procesando
        </Badge>
      ),
      Pendiente: (
        <Badge className="bg-amber-100 text-amber-800 border-amber-300">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pendiente
        </Badge>
      ),
      Cancelado: (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelado
        </Badge>
      ),
    }
    return badges[estado as keyof typeof badges] || badges.Pendiente
  }

  const filteredVentas = ventas.filter((venta) => {
    const matchesSearch =
      (venta.numeroVenta || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (venta.cliente || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = filterEstado === "todos" || (venta.estado || "").toLowerCase() === filterEstado
    return matchesSearch && matchesEstado
  })

  const productosFiltrados = productos.filter((producto) =>
    (producto.nombre || "").toLowerCase().includes(searchProducto.toLowerCase()),
  )

  const crearVenta = async () => {
    try {
      // Validar formulario
      const errors = validateVentaForm(
        carrito,
        clienteSeleccionado,
        clienteCasual,
        productoPersonalizado,
        metodoPago,
        tipoVenta
      )
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        toast({
          title: "Error de validación",
          description: "Por favor, corrige los errores en el formulario",
          variant: "destructive",
        })
        return
      }

      // Limpiar errores previos
      setFormErrors({})

      // Validar stock disponible antes de procesar
      for (const item of carrito) {
        if (!item.esPersonalizado) {
          const productoActual = productos.find((p) => p.id === item.id)
          if (!productoActual) {
            toast({
              title: "Error",
              description: `Producto ${item.nombre} no encontrado`,
              variant: "destructive",
            })
            return
          }

          if (productoActual.stock < item.cantidad) {
            toast({
              title: "Error de stock",
              description: `Stock insuficiente para ${item.nombre}. Disponible: ${productoActual.stock}`,
              variant: "destructive",
            })
            return
          }
        }
      }

      // Continuar con la creación de la venta...
      // Obtener datos del cliente
      let clienteNombre = ""
      let clienteId = null

      if (tipoVenta === "casual") {
        clienteNombre = `${clienteCasual.trim()} (Casual)`
      } else {
        const cliente = clientes.find((c) => c.id === clienteSeleccionado)
        if (!cliente) {
          toast({
            title: "Error",
            description: "Cliente seleccionado no válido",
            variant: "destructive",
          })
          return
        }
        clienteNombre = cliente.nombre
        clienteId = cliente.id
      }

      const ventaData = {
        cliente_id: clienteId,
        cliente_casual: tipoVenta === "casual" ? clienteCasual.trim() : null,
        cliente_nombre: tipoVenta === "registrada" ? clienteNombre : null,
        total: totalCarrito,
        subtotal: totalCarrito,
        descuento: 0,
        estado: "Completado",
        metodo_pago: metodoPago,
        notas: notasVenta.trim() || null,
        tipo_venta: tipoVenta,
        fecha_venta: new Date().toISOString(),
      }

      console.log("Creando venta con datos:", ventaData)
      
      const { data: ventaCreada, error: ventaError } = await supabase.from("ventas").insert(ventaData).select().single()

      if (ventaError) {
        console.error("Error creando venta:", ventaError)
        throw new Error(`Error al crear la venta: ${ventaError.message}`)
      }

      if (!ventaCreada) {
        throw new Error("No se pudo crear la venta")
      }

      console.log("Venta creada exitosamente:", ventaCreada)

      // Crear items de venta con validación
      const ventaItems = carrito.map((item: ProductoCarrito) => ({
        venta_id: ventaCreada.id,
        producto_id: item.esPersonalizado ? null : item.id,
        producto_nombre: item.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        subtotal: item.precio * item.cantidad,
        categoria: item.categoria || "Sin categoría",
        descripcion: item.descripcion || "",
        imagen_url: item.imagen_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      console.log("Creando items de venta:", ventaItems)
      
      const { error: itemsError } = await supabase.from("venta_items").insert(ventaItems)

      if (itemsError) {
        console.error("Error creando items:", itemsError)
        throw new Error(`Error al crear los items: ${itemsError.message}`)
      }

      console.log("Items de venta creados exitosamente")

      // Actualizar stock de productos (solo para productos no personalizados)
      const stockUpdates = []
      for (const item of carrito) {
        if (!item.esPersonalizado) {
          const productoActual = productos.find((p) => p.id === item.id)
          if (productoActual) {
            const nuevoStock = productoActual.stock - item.cantidad
            stockUpdates.push(supabase.from("productos").update({ stock: nuevoStock }).eq("id", item.id))
          }
        }
      }

      // Ejecutar actualizaciones de stock
      if (stockUpdates.length > 0) {
        const stockResults = await Promise.all(stockUpdates)
        const stockErrors = stockResults.filter((result) => result.error)

        if (stockErrors.length > 0) {
          console.error("Errores actualizando stock:", stockErrors)
          // No fallar la venta por errores de stock, solo advertir
          toast({
            title: "Advertencia",
            description: "Venta creada pero hubo problemas actualizando el stock",
            variant: "destructive",
          })
        }
      }

      // Generar número de venta
      const fecha = new Date(ventaCreada.created_at)
      const numeroVenta = `V-${fecha.getFullYear()}-${ventaCreada.id.slice(-6).toUpperCase()}`

      // Limpiar formulario
      setCarrito([])
      setClienteSeleccionado("")
      setClienteCasual("")
      setMetodoPago("")
      setNotasVenta("")
      setTipoVenta("registrada")
      setProductoPersonalizado({ nombre: "", precio: "" })
      setSearchProducto("")
      setIsNewSaleDialogOpen(false)

      // Recargar datos
      await cargarDatos()

      toast({
        title: "¡Venta creada exitosamente!",
        description: `${numeroVenta} por $${totalCarrito.toLocaleString()}`,
      })
    } catch (error) {
      console.error("Error creando venta:", error)
      toast({
        title: "Error al crear la venta",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive",
      })
    }
  }

  const handleClienteSeleccionadoChange = (value: string) => {
    setClienteSeleccionado(value)
    // Limpiar error del cliente seleccionado
    if (formErrors.clienteSeleccionado) {
      setFormErrors(prev => ({ ...prev, clienteSeleccionado: undefined }))
    }
  }

  const handleClienteCasualChange = (value: string) => {
    setClienteCasual(value)
    // Limpiar error del cliente casual
    if (formErrors.clienteCasual) {
      setFormErrors(prev => ({ ...prev, clienteCasual: undefined }))
    }
  }

  const handleProductoPersonalizadoChange = (field: 'nombre' | 'precio', value: string) => {
    setProductoPersonalizado(prev => ({ ...prev, [field]: value }))
    // Limpiar error del producto personalizado
    if (formErrors.productoPersonalizado?.[field]) {
      setFormErrors(prev => ({
        ...prev,
        productoPersonalizado: {
          ...prev.productoPersonalizado,
          [field]: undefined
        }
      }))
    }
  }

  const handleMetodoPagoChange = (value: string) => {
    setMetodoPago(value)
    // Limpiar error del método de pago
    if (formErrors.metodoPago) {
      setFormErrors(prev => ({ ...prev, metodoPago: undefined }))
    }
  }

  const handleTipoVentaChange = (value: string) => {
    setTipoVenta(value)
    // Limpiar errores relacionados con clientes
    setFormErrors(prev => ({
      ...prev,
      clienteSeleccionado: undefined,
      clienteCasual: undefined
    }))
  }

  const handleOpenNewSaleDialog = () => {
    setIsNewSaleDialogOpen(true)
    // Limpiar errores previos
    setFormErrors({})
  }

  // Mostrar error del carrito si existe
  const carritoError = formErrors.carrito && (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-sm text-red-600 flex items-center">
        <AlertCircle className="w-4 h-4 mr-2" />
        {formErrors.carrito}
      </p>
    </div>
  )

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Cargando ventas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />

      <div className="flex-1">
        {/* Header */}
        <header className="bg-card border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-card-foreground">Gestión de Ventas</h1>
                  <p className="text-sm text-purple-600">Administra las transacciones de tu negocio</p>
                </div>
              </div>
              <Button onClick={handleOpenNewSaleDialog} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Venta
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ventas Hoy</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  $
                  {ventas
                    .filter((v) => v.fecha === new Date().toISOString().split("T")[0])
                    .reduce((sum, v) => sum + v.total, 0)
                    .toLocaleString()}
                </div>
                <p className="text-xs text-green-600 mt-1">Datos en tiempo real</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pedidos Pendientes</CardTitle>
                <Clock className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {ventas.filter((v) => v.estado === "Pendiente").length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Procesando</CardTitle>
                <AlertCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {ventas.filter((v) => v.estado === "Procesando").length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completadas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {ventas.filter((v) => v.estado === "Completado").length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6 bg-white border-green-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por número de venta o cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterEstado} onValueChange={setFilterEstado}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="procesando">Procesando</SelectItem>
                      <SelectItem value="completado">Completado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sales List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-card-foreground">
                Lista de Ventas ({filteredVentas.length})
              </CardTitle>
              <CardDescription>Gestiona todas las transacciones de tu negocio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVentas.map((venta) => (
                  <div
                    key={venta.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-full">
                        <ShoppingCart className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-card-foreground">{venta.numeroVenta}</h3>
                          {getEstadoBadge(venta.estado)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{venta.cliente}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{venta.fecha}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Package className="h-3 w-3" />
                            <span>{venta.productos.length} productos</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span className="font-semibold">${venta.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Detalles de la Venta</DialogTitle>
                            <DialogDescription>Información completa de {venta.numeroVenta}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-6 py-4">
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Información de la Venta</Label>
                                <div className="mt-2 space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Número:</span>
                                    <span className="text-sm font-medium">{venta.numeroVenta}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Fecha:</span>
                                    <span className="text-sm font-medium">{venta.fecha}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Estado:</span>
                                    {getEstadoBadge(venta.estado)}
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Método de pago:</span>
                                    <span className="text-sm font-medium">{venta.metodoPago}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Total:</span>
                                    <span className="text-lg font-bold text-green-600">
                                      ${venta.total.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Cliente</Label>
                                <div className="mt-2 space-y-1">
                                  <div className="text-sm font-medium">{venta.cliente}</div>
                                  <div className="text-sm text-muted-foreground">{venta.clienteEmail}</div>
                                </div>
                              </div>
                              {venta.notas && (
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Notas</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{venta.notas}</p>
                                </div>
                              )}
                            </div>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Productos</Label>
                                <div className="mt-2 space-y-2">
                                  {venta.productos.map((producto, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                    >
                                      <div>
                                        <div className="text-sm font-medium">{producto.producto_nombre}</div>
                                        <div className="text-xs text-muted-foreground">Cantidad: {producto.cantidad}</div>
                                      </div>
                                      <div className="text-sm font-semibold">
                                        ${(producto.precio_unitario * producto.cantidad).toLocaleString()}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Select defaultValue={venta.estado.toLowerCase()}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="procesando">Procesando</SelectItem>
                          <SelectItem value="completado">Completado</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => eliminarVenta(venta.id)}
                        className="hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Dialog open={isNewSaleDialogOpen} onOpenChange={setIsNewSaleDialogOpen}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nueva Venta</DialogTitle>
                <DialogDescription>Crea una nueva venta registrada o casual</DialogDescription>
              </DialogHeader>

              {carritoError}

              <div className="space-y-6 py-4">
                <div className="flex gap-4">
                  <Card
                    className={`flex-1 cursor-pointer transition-all ${tipoVenta === "registrada" ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"}`}
                    onClick={() => setTipoVenta("registrada")}
                  >
                    <CardContent className="p-4 text-center">
                      <User className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h3 className="font-semibold">Venta Registrada</h3>
                      <p className="text-sm text-gray-600">Cliente registrado en el sistema</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`flex-1 cursor-pointer transition-all ${tipoVenta === "casual" ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-gray-50"}`}
                    onClick={() => setTipoVenta("casual")}
                  >
                    <CardContent className="p-4 text-center">
                      <UserX className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                      <h3 className="font-semibold">Venta Casual</h3>
                      <p className="text-sm text-gray-600">Cliente sin registrar</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Cliente y Carrito */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cliente">
                        {tipoVenta === "registrada" ? "Cliente Registrado" : "Nombre del Cliente"}
                      </Label>
                      {tipoVenta === "registrada" ? (
                        <Select value={clienteSeleccionado} onValueChange={handleClienteSeleccionadoChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cliente registrado" />
                          </SelectTrigger>
                          <SelectContent>
                            {clientes.map((cliente) => (
                              <SelectItem key={cliente.id} value={cliente.id}>
                                {cliente.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          placeholder="Nombre del cliente"
                          value={clienteCasual}
                          onChange={(e) => handleClienteCasualChange(e.target.value)}
                        />
                      )}
                      {formErrors.clienteSeleccionado && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.clienteSeleccionado}</p>
                      )}
                      {formErrors.clienteCasual && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.clienteCasual}</p>
                      )}
                    </div>

                    {/* Carrito de Compras */}
                    <div>
                      <Label>Carrito de Compras</Label>
                      <Card className="mt-2">
                        <CardContent className="p-4">
                          {carrito.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No hay productos en el carrito</p>
                          ) : (
                            <div className="space-y-2">
                              {carrito.map((item: ProductoCarrito) => (
                                <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">
                                      {item.nombre}
                                      {item.esPersonalizado && (
                                        <Badge variant="secondary" className="ml-2 text-xs">
                                          Personalizado
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-600">${item.precio.toLocaleString()} c/u</div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                                    >
                                      -
                                    </Button>
                                    <span className="text-sm font-medium w-8 text-center">{item.cantidad}</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                                    >
                                      +
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => removerDelCarrito(item.id)}>
                                      ×
                                    </Button>
                                  </div>
                                </div>
                              ))}
                              <Separator />
                              <div className="flex justify-between items-center font-semibold">
                                <span>Total:</span>
                                <span className="text-green-600">${totalCarrito.toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Método de Pago */}
                    <div>
                      <Label htmlFor="metodoPago">Método de Pago *</Label>
                      <Select value={metodoPago} onValueChange={handleMetodoPagoChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar método" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="efectivo">Efectivo</SelectItem>
                          <SelectItem value="tarjeta">Tarjeta de Débito/Crédito</SelectItem>
                          <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                          <SelectItem value="mercadopago">Mercado Pago</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.metodoPago && (
                        <p className="text-sm text-red-500 mt-1">{formErrors.metodoPago}</p>
                      )}
                    </div>

                    {/* Notas */}
                    <div>
                      <Label htmlFor="notas">Notas (Opcional)</Label>
                      <Textarea
                        placeholder="Observaciones, instrucciones especiales, etc."
                        value={notasVenta}
                        onChange={(e) => setNotasVenta(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Productos Disponibles */}
                  <div className="space-y-4">
                    <div>
                      <Label>Productos Disponibles</Label>
                      <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Buscar productos..."
                          value={searchProducto}
                          onChange={(e) => setSearchProducto(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {productosFiltrados.map((producto) => (
                        <div
                          key={producto.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium">{producto.nombre}</div>
                            <div className="text-xs text-gray-600">
                              ${producto.precio.toLocaleString()} - Stock: {producto.stock}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => agregarAlCarrito(producto)}
                            disabled={producto.stock === 0}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Card className="border-dashed border-2 border-orange-300 bg-orange-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <Zap className="h-4 w-4 mr-2 text-orange-600" />
                          Venta Rápida / Producto Personalizado
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Para ventas rápidas sin registrar productos específicos
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label htmlFor="nombrePersonalizado" className="text-xs">
                            Descripción
                          </Label>
                          <Input
                            id="nombrePersonalizado"
                            placeholder="Descripción del producto personalizado"
                            value={productoPersonalizado.nombre}
                            onChange={(e) => handleProductoPersonalizadoChange('nombre', e.target.value)}
                            className="text-sm"
                          />
                          {formErrors.productoPersonalizado?.nombre && (
                            <p className="text-sm text-red-500 mt-1">{formErrors.productoPersonalizado.nombre}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="precioPersonalizado" className="text-xs">
                            Precio Total
                          </Label>
                          <Input
                            id="precioPersonalizado"
                            type="number"
                            placeholder="15000"
                            value={productoPersonalizado.precio}
                            onChange={(e) => handleProductoPersonalizadoChange('precio', e.target.value)}
                            className="text-sm"
                          />
                          {formErrors.productoPersonalizado?.precio && (
                            <p className="text-sm text-red-500 mt-1">{formErrors.productoPersonalizado.precio}</p>
                          )}
                        </div>
                        <Button
                          onClick={agregarProductoPersonalizado}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-sm"
                          size="sm"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Agregar al Carrito
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsNewSaleDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={crearVenta}
                  disabled={carrito.length === 0}
                >
                  Crear Venta - ${totalCarrito.toLocaleString()}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
