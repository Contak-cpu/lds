"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Search,
  Plus,
  Edit,
  Eye,
  AlertTriangle,
  Leaf,
  Lightbulb,
  Droplets,
  Scissors,
  Thermometer,
  Trash2,
} from "lucide-react"
import { useCategorias } from "@/hooks/use-categorias"
import { CategoriaQuickAdd } from "@/components/categoria-quick-add"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { useNotifications } from "@/hooks/use-notifications"

main
import type { ComponentType } from "react"

interface Producto {
  id: string
  sku: string
  categoria_id: string
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

interface ProductoFormData {
  nombre: string
  categoria: string
  precio: string
  costo: string
  stock: string
  stock_minimo: string
  descripcion: string
  imagen_url: string
}

interface ProductoFormErrors {
  nombre?: string
  categoria?: string
  precio?: string
  costo?: string
  stock?: string
  stock_minimo?: string
  descripcion?: string
  imagen_url?: string
}

// Datos mock por defecto
const productosMock: Producto[] = [
  {
    id: "1",
    sku: "SEM-001",
    categoria_id: "1",
    nombre: "Semillas OG Kush Feminizadas",
    descripcion: "Semillas premium de cannabis OG Kush, variedad feminizada de alta calidad",
    categoria: "Semillas",
    precio: 2500,
    costo: 1500,
    stock: 50,
    stock_minimo: 10,
    imagen_url: "/public/cannabis-seeds-pack.png",
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    sku: "FERT-001",
    categoria_id: "2",
    nombre: "Fertilizante Orgánico Premium",
    descripcion: "Nutriente completo para todas las etapas del cultivo, 100% orgánico",
    categoria: "Fertilizantes",
    precio: 1800,
    costo: 900,
    stock: 25,
    stock_minimo: 5,
    imagen_url: "/public/placeholder-ivbba.png",
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    sku: "LED-001",
    categoria_id: "3",
    nombre: "Panel LED 600W Full Spectrum",
    descripcion: "Sistema de iluminación LED profesional para cultivo interior",
    categoria: "Iluminación",
    precio: 45000,
    costo: 30000,
    stock: 8,
    stock_minimo: 2,
    imagen_url: "/public/hydroponic-dwc-system.png",
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    sku: "SUST-001",
    categoria_id: "4",
    nombre: "Sustrato Premium Mix",
    descripcion: "Mezcla especializada de tierras para cultivo de cannabis",
    categoria: "Sustratos",
    precio: 1200,
    costo: 600,
    stock: 30,
    stock_minimo: 8,
    imagen_url: "/public/placeholder-s06h6.png",
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Función de validación para productos
const validateProductoForm = (formData: ProductoFormData): ProductoFormErrors => {
  const errors: ProductoFormErrors = {}

  // Validar nombre
  if (!formData.nombre.trim()) {
    errors.nombre = "El nombre del producto es obligatorio"
  } else if (formData.nombre.trim().length < 2) {
    errors.nombre = "El nombre debe tener al menos 2 caracteres"
  }

  // Validar categoría
  if (!formData.categoria.trim()) {
    errors.categoria = "La categoría es obligatoria"
  }

  // Validar precio
  if (!formData.precio.trim()) {
    errors.precio = "El precio es obligatorio"
  } else if (!/^\d+(\.\d{1,2})?$/.test(formData.precio.trim())) {
    errors.precio = "El precio debe ser un número válido (máximo 2 decimales)"
  } else if (parseFloat(formData.precio) < 0) {
    errors.precio = "El precio no puede ser negativo"
  }

  // Validar costo
  if (!formData.costo.trim()) {
    errors.costo = "El costo es obligatorio"
  } else if (!/^\d+(\.\d{1,2})?$/.test(formData.costo.trim())) {
    errors.costo = "El costo debe ser un número válido (máximo 2 decimales)"
  } else if (parseFloat(formData.costo) < 0) {
    errors.costo = "El costo no puede ser negativo"
  }

  // Validar stock
  if (!formData.stock.trim()) {
    errors.stock = "El stock es obligatorio"
  } else if (!/^\d+$/.test(formData.stock.trim())) {
    errors.stock = "El stock debe ser un número entero"
  } else if (parseInt(formData.stock) < 0) {
    errors.stock = "El stock no puede ser negativo"
  }

  // Validar stock mínimo
  if (!formData.stock_minimo.trim()) {
    errors.stock_minimo = "El stock mínimo es obligatorio"
  } else if (!/^\d+$/.test(formData.stock_minimo.trim())) {
    errors.stock_minimo = "El stock mínimo debe ser un número entero"
  } else if (parseInt(formData.stock_minimo) < 0) {
    errors.stock_minimo = "El stock mínimo no puede ser negativo"
  }

  // Validar descripción
  if (!formData.descripcion.trim()) {
    errors.descripcion = "La descripción es obligatoria"
  } else if (formData.descripcion.trim().length < 10) {
    errors.descripcion = "La descripción debe tener al menos 10 caracteres"
  }

  return errors
}

interface CategoriaInfo {
  value: string
  label: string
  icon: ComponentType<{ className?: string }>
}

export default function ProductosPage() {
  const { showError, showProductoCreated, showProductoUpdated, showProductoDeleted } = useNotifications()
  const { categorias: categoriasDB, cargarCategorias: recargarCategorias } = useCategorias()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState("todas")
  const [filterStock, setFilterStock] = useState("todos")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [productos, setProductos] = useState<Producto[]>([])
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formErrors, setFormErrors] = useState<ProductoFormErrors>({})
  const [editFormErrors, setEditFormErrors] = useState<ProductoFormErrors>({})

  // Convertir categorías de la base de datos al formato de la interfaz
  const categorias: CategoriaInfo[] = [
    { value: "todas", label: "Todas las categorías", icon: Package },
    ...categoriasDB.map(cat => ({
      value: cat.nombre,
      label: cat.nombre,
      icon: Package, // Icono por defecto, se puede mejorar después
    }))
  ]

  const [formData, setFormData] = useState<ProductoFormData>({
    nombre: "",
    categoria: "",
    precio: "",
    costo: "",
    stock: "",
    stock_minimo: "",
    descripcion: "",
    imagen_url: "",
  })

  const [editFormData, setEditFormData] = useState<ProductoFormData>({
    nombre: "",
    categoria: "",
    precio: "",
    costo: "",
    stock: "",
    stock_minimo: "",
    descripcion: "",
    imagen_url: "",
  })

  const [previewCategoriaId, setPreviewCategoriaId] = useState<string>("")

  useEffect(() => {
    cargarProductos()
  }, [])

  const handleCategoriaCreada = (nombreCategoria: string) => {
    // Recargar categorías y seleccionar la nueva
    recargarCategorias()
    setFormData(prev => ({ ...prev, categoria: nombreCategoria }))
    setEditFormData(prev => ({ ...prev, categoria: nombreCategoria }))
  }

  const cargarProductos = async () => {
    try {
      // Cargar productos desde localStorage (modo mock)
      const productosMock = [
        {
          id: "1",
          sku: "NK-AIR-001",
          nombre: "Nike Air Max 270",
          descripcion: "Zapatillas deportivas con amortiguación Air Max",
          categoria: "Running",
          marca: "Nike",
          precio: 89999,
          costo: 45000,
          stock: 15,
          stock_minimo: 5,
          activo: true,
          imagen_url: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        },
        {
          id: "2", 
          sku: "AD-UB-002",
          nombre: "Adidas Ultraboost 22",
          descripcion: "Zapatillas para running con tecnología Boost",
          categoria: "Running",
          marca: "Adidas",
          precio: 95999,
          costo: 48000,
          stock: 8,
          stock_minimo: 5,
          activo: true,
          imagen_url: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        },
        {
          id: "3",
          sku: "JD-1-003", 
          nombre: "Air Jordan 1 Mid",
          descripcion: "Zapatillas de basketball clásicas",
          categoria: "Basketball",
          marca: "Nike",
          precio: 119999,
          costo: 60000,
          stock: 12,
          stock_minimo: 5,
          activo: true,
          imagen_url: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        }
      ]
      
      const productosGuardados = localStorage.getItem('productos-sneakers')
      const productos = productosGuardados ? JSON.parse(productosGuardados) : productosMock
      
      console.log(`Productos cargados: ${productos.length}`)
      setProductos(productos)
        
main
    } catch (error) {
      console.error("Error cargando productos:", error)
      showError("Error al cargar productos")
      // En caso de error, usar datos mock
      setProductos(productosMock)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProductoFormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleEditInputChange = (field: keyof ProductoFormData, value: string): void => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (editFormErrors[field]) {
      setEditFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleCategoriaChange = (value: string): void => {
    setFormData((prev) => ({
      ...prev,
      categoria: value,
    }))
    // Limpiar error de categoría
    if (formErrors.categoria) {
      setFormErrors((prev) => ({
        ...prev,
        categoria: undefined,
      }))
    }
  }

  const handleEditCategoriaChange = (value: string): void => {
    setEditFormData((prev) => ({
      ...prev,
      categoria: value,
    }))
    // Limpiar error de categoría
    if (editFormErrors.categoria) {
      setEditFormErrors((prev) => ({
        ...prev,
        categoria: undefined,
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      categoria: "",
      precio: "",
      costo: "",
      stock: "",
      stock_minimo: "",
      descripcion: "",
      imagen_url: "",
    })
    setPreviewCategoriaId("")
  }

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true)
    // Limpiar errores previos
    setFormErrors({})
  }

  const generateSKU = async (categoria: string): Promise<string> => {
    try {
      // Generar SKU basado en categoría (modo mock)
      let prefix = 'SNK'
      
      switch (categoria.toLowerCase()) {
        case 'running':
          prefix = 'RUN'
          break
        case 'basketball':
          prefix = 'BSK'
          break
        case 'lifestyle':
          prefix = 'LST'
          break
        case 'football':
          prefix = 'FTB'
          break
        default:
          prefix = 'SNK'
          break
      }
      
      // Obtener siguiente número
      const productosActuales = productos.filter(p => p.sku.startsWith(prefix))
      let nextNumber = 1
      
      if (productosActuales.length > 0) {
        const numeros = productosActuales.map(p => {
          const match = p.sku.match(/-(\d+)$/)
          return match ? parseInt(match[1]) : 0
        })
        nextNumber = Math.max(...numeros) + 1
      }
      
      return `${prefix}-${nextNumber.toString().padStart(3, '0')}`
    } catch (error) {
      console.error("Error generando SKU:", error)
      return `SNK-${Date.now().toString().slice(-6)}`
    }
  }

  const generateCategoriaId = async (categoria: string): Promise<string> => {
    try {
      // Simplificado para modo mock
      return `${categoria.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-3)}`
    } catch (error) {
      console.error("Error generando categoria_id:", error)
      return `PRO-${Date.now().toString().slice(-3)}`
    }
  }

  const handleAddProduct = async () => {
    try {
      // Validar formulario
      const errors = validateProductoForm(formData)
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        showError("Error de validación", "Por favor, corrige los errores en el formulario")
        return
      }

      // Limpiar errores previos
      setFormErrors({})


      // Generar SKU automáticamente
      const sku = await generateSKU(formData.categoria)
      
      // Crear nuevo producto (modo mock)
      const nuevoProducto = {
        id: Date.now().toString(),
        sku,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        categoria: formData.categoria,
        marca: formData.marca || "Sin marca",
main
        precio: parseFloat(formData.precio),
        costo: parseFloat(formData.costo),
        stock: parseInt(formData.stock) || 0,
        stock_minimo: parseInt(formData.stock_minimo) || 5,
        imagen_url: formData.imagen_url.trim() || null,
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
        updated_at: new Date().toISOString(),
      }

      // Actualizar localStorage
      const productosActuales = JSON.parse(localStorage.getItem('crm-productos') || '[]')
      const productosActualizados = [nuevoProducto, ...productosActuales]
      localStorage.setItem('crm-productos', JSON.stringify(productosActualizados))

      // Actualizar el estado local
      setProductos(productosActualizados)
main
      resetForm()
      setIsAddDialogOpen(false)
      showProductoCreated()
    } catch (error) {
      console.error("Error adding product:", error)
      showError("Error al agregar producto")
    }
  }

  const handleEditProduct = (product: Producto) => {
    setEditingProduct(product)
    setEditFormData({
      nombre: product.nombre,
      categoria: product.categoria,
      precio: product.precio.toString(),
      costo: product.costo.toString(),
      stock: product.stock.toString(),
      stock_minimo: product.stock_minimo.toString(),
      descripcion: product.descripcion || "",
      imagen_url: product.imagen_url || "",
    })
    // Limpiar errores previos
    setEditFormErrors({})
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingProduct) return

    try {
      // Validar formulario de edición
      const errors = validateProductoForm(editFormData)
      
      if (Object.keys(errors).length > 0) {
        setEditFormErrors(errors)
        showError("Error de validación", "Por favor, corrige los errores en el formulario")
        return
      }

      // Limpiar errores previos
      setEditFormErrors({})


      // Actualizar producto (modo mock)
      const productoActualizado = {
        ...editingProduct,
        nombre: editFormData.nombre.trim(),
        descripcion: editFormData.descripcion.trim() || null,
        categoria: editFormData.categoria,
        precio: parseFloat(editFormData.precio),
        costo: parseFloat(editFormData.costo),
        stock: parseInt(editFormData.stock) || 0,
        stock_minimo: parseInt(editFormData.stock_minimo) || 5,
        imagen_url: editFormData.imagen_url.trim() || null,
        updated_at: new Date().toISOString()
      }

      // Actualizar en localStorage y estado
      const productosActualizados = productos.map(product => 
        product.id === editingProduct.id ? productoActualizado : product
      )
      localStorage.setItem('productos-sneakers', JSON.stringify(productosActualizados))
      setProductos(productosActualizados)
      

main
      setIsEditDialogOpen(false)
      setEditingProduct(null)
      showProductoUpdated()
    } catch (error) {
      console.error("Error updating product:", error)
      showError("Error", "No se pudieron guardar los cambios")
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
feature/fix
      // Eliminar producto (modo mock)
      const productosActualizados = productos.filter(producto => producto.id !== productId)
      localStorage.setItem('productos-sneakers', JSON.stringify(productosActualizados))
      setProductos(productosActualizados)
 main
      showProductoDeleted()
    } catch (error) {
      console.error("Error eliminando producto:", error)
      showError("Error al eliminar producto")
    }
  }

  const filteredProductos = productos.filter((producto: Producto) => {
    const matchesSearch =
      (producto.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (producto.sku?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (producto.categoria?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (producto.categoria_id && (producto.categoria_id.toLowerCase() || "").includes(searchTerm.toLowerCase()))
    const matchesCategoria = filterCategoria === "todas" || producto.categoria === filterCategoria
    const matchesStock =
      filterStock === "todos" ||
      (filterStock === "disponible" && producto.stock > 0) ||
      (filterStock === "bajo" && producto.stock > 0 && producto.stock <= producto.stock_minimo) ||
      (filterStock === "agotado" && producto.stock === 0)

    // Log para depuración
    if (searchTerm && (matchesSearch || !matchesSearch)) {
      console.log(`Búsqueda: "${searchTerm}" - Producto: "${producto.nombre}" - Coincide: ${matchesSearch}`)
    }

    return matchesSearch && matchesCategoria && matchesStock
  })

  useEffect(() => {
    console.log(`Estado de búsqueda - searchTerm: "${searchTerm}", productos: ${productos.length}, filtrados: ${filteredProductos.length}`)
  }, [searchTerm, productos, filteredProductos])

  const getCategoriaIcon = (categoria: string) => {
    const iconMap: Record<string, ComponentType<{ className?: string }>> = {
      Kits: Package,
      Semillas: Leaf,
      Fertilizantes: Droplets,
      Iluminación: Lightbulb,
      Hidroponía: Thermometer,
      Herramientas: Scissors,
    }
    const IconComponent = iconMap[categoria] || Package
    return <IconComponent className="h-4 w-4" />
  }

  const calcularGanancia = (precio: number, costo: number): number => {
    return precio - costo
  }

  const calcularMargenGanancia = (precio: number, costo: number): string => {
    return (((precio - costo) / precio) * 100).toFixed(1)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando productos...</p>
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
                <div className="bg-amber-600 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-card-foreground">Catálogo de Productos</h1>
                  <p className="text-sm text-amber-600">Gestiona tu inventario de zapatillas</p>
                </div>
              </div>
              <Button onClick={handleOpenAddDialog} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Productos</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{productos.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Stock Bajo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {productos.filter((p: Producto) => p.stock <= p.stock_minimo && p.stock > 0).length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Agotados</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {productos.filter((p: Producto) => p.stock === 0).length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Valor Inventario</CardTitle>
                <Package className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  ${productos.reduce((sum: number, p: Producto) => sum + p.precio * p.stock, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6 bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por nombre o SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat: CategoriaInfo) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center space-x-2">
                            <cat.icon className="h-4 w-4" />
                            <span>{cat.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStock} onValueChange={setFilterStock}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="bajo">Stock Bajo</SelectItem>
                      <SelectItem value="agotado">Agotado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProductos.map((producto: Producto) => (
              <Card key={producto.id} className="bg-card border-border hover:shadow-lg transition-shadow">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <img
                    src={producto.imagen_url || "/professional-pruning-scissors.png"}
                    alt={producto.nombre}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">{getStockBadge(producto)}</div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoriaIcon(producto.categoria)}
                      <span className="text-xs text-muted-foreground">{producto.categoria}</span>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">{producto.sku}</span>
                      {producto.categoria_id && (
                        <span className="text-xs font-mono bg-blue-100 px-2 py-1 rounded text-blue-600">{producto.categoria_id}</span>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-card-foreground line-clamp-2">{producto.nombre}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{producto.descripcion}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-green-600">${producto.precio.toLocaleString()}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium text-card-foreground">Stock: {producto.stock}</div>
                      <div className="text-xs text-muted-foreground">Mín: {producto.stock_minimo}</div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalles del Producto</DialogTitle>
                          <DialogDescription>Información completa de {producto.nombre}</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-6 py-4">
                          <div className="space-y-4">
                            <img
                              src={producto.imagen_url || "/professional-pruning-scissors.png"}
                              alt={producto.nombre}
                              className="w-full aspect-square object-cover rounded-lg"
                            />
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Información Básica</Label>
                              <div className="mt-2 space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">ID:</span>
                                  <span className="text-sm font-medium">{producto.id.slice(0, 8)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">ID de Categoría:</span>
                                  <span className="text-sm font-medium font-mono bg-blue-100 px-2 py-1 rounded">{producto.categoria_id || 'No asignado'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Categoría:</span>
                                  <span className="text-sm font-medium">{producto.categoria}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Precio de venta:</span>
                                  <span className="text-lg font-bold text-green-600">
                                    ${producto.precio.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Costo:</span>
                                  <span className="text-sm font-medium text-red-600">
                                    ${producto.costo.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Ganancia:</span>
                                  <span className="text-sm font-bold text-blue-600">
                                    ${calcularGanancia(producto.precio, producto.costo).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Margen:</span>
                                  <span className="text-sm font-bold text-blue-600">
                                    {calcularMargenGanancia(producto.precio, producto.costo)}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Stock actual:</span>
                                  <span className="text-sm font-medium">{producto.stock} unidades</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Stock mínimo:</span>
                                  <span className="text-sm font-medium">{producto.stock_minimo} unidades</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Estado:</span>
                                  {getStockBadge(producto)}
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Descripción</Label>
                              <p className="text-sm text-card-foreground mt-1">{producto.descripcion}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleEditProduct(producto)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="bg-transparent text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El producto "{producto.nombre}" será eliminado
                            permanentemente del catálogo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProduct(producto.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No products found message */}
          {filteredProductos.length === 0 && (
            <Card className="bg-card border-border">
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">No se encontraron productos</h3>
                <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
              </CardContent>
            </Card>
          )}

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Nuevo Producto</DialogTitle>
                <DialogDescription>Añade un nuevo producto a tu catálogo</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre del producto *</Label>
                    <Input
                      id="nombre"
                      placeholder="Nombre del producto"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange("nombre", e.target.value)}
                    />
                    {formErrors.nombre && <p className="text-xs text-red-500 mt-1">{formErrors.nombre}</p>}
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoría *</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select value={formData.categoria} onValueChange={(value) => handleCategoriaChange(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.map((cat: CategoriaInfo) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <CategoriaQuickAdd 
                        onCategoriaCreada={handleCategoriaCreada}
                        trigger={
                          <Button type="button" variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        }
                      />
                    </div>
                    {formErrors.categoria && <p className="text-xs text-red-500 mt-1">{formErrors.categoria}</p>}
                  </div>
                  <div>
                    <Label htmlFor="categoria-id">ID de Categoría</Label>
                    <Input
                      id="categoria-id"
                      value={previewCategoriaId ? `Se generará: ${previewCategoriaId}` : "Selecciona una categoría"}
                      disabled
                      className="bg-gray-100 cursor-not-allowed text-sm"
                      placeholder="Se genera automáticamente"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="precio">Precio de venta ($) *</Label>
                      <Input
                        id="precio"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={formData.precio}
                        onChange={(e) => handleInputChange("precio", e.target.value)}
                      />
                      {formErrors.precio && <p className="text-xs text-red-500 mt-1">{formErrors.precio}</p>}
                    </div>
                    <div>
                      <Label htmlFor="costo">Costo ($) *</Label>
                      <Input
                        id="costo"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={formData.costo}
                        onChange={(e) => handleInputChange("costo", e.target.value)}
                      />
                      {formErrors.costo && <p className="text-xs text-red-500 mt-1">{formErrors.costo}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="stock">Stock inicial</Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="0"
                        value={formData.stock}
                        onChange={(e) => handleInputChange("stock", e.target.value)}
                      />
                      {formErrors.stock && <p className="text-xs text-red-500 mt-1">{formErrors.stock}</p>}
                    </div>
                    <div>
                      <Label htmlFor="stock_minimo">Stock mínimo</Label>
                      <Input
                        id="stock_minimo"
                        type="number"
                        placeholder="5"
                        value={formData.stock_minimo}
                        onChange={(e) => handleInputChange("stock_minimo", e.target.value)}
                      />
                      {formErrors.stock_minimo && <p className="text-xs text-red-500 mt-1">{formErrors.stock_minimo}</p>}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      placeholder="Descripción detallada del producto"
                      className="h-32"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange("descripcion", e.target.value)}
                    />
                    {formErrors.descripcion && <p className="text-xs text-red-500 mt-1">{formErrors.descripcion}</p>}
                  </div>
                  <div>
                    <Label htmlFor="imagen_url">URL de imagen</Label>
                    <Input
                      id="imagen_url"
                      placeholder="URL de la imagen"
                      value={formData.imagen_url}
                      onChange={(e) => handleInputChange("imagen_url", e.target.value)}
                    />
                    {formErrors.imagen_url && <p className="text-xs text-red-500 mt-1">{formErrors.imagen_url}</p>}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddProduct}>
                  Guardar Producto
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Editar Producto</DialogTitle>
                <DialogDescription>Modifica la información del producto</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-nombre">Nombre del producto *</Label>
                    <Input
                      id="edit-nombre"
                      placeholder="Nombre del producto"
                      value={editFormData.nombre}
                      onChange={(e) => handleEditInputChange("nombre", e.target.value)}
                    />
                    {editFormErrors.nombre && <p className="text-xs text-red-500 mt-1">{editFormErrors.nombre}</p>}
                  </div>
                  <div>
                    <Label htmlFor="edit-categoria">Categoría *</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select value={editFormData.categoria} onValueChange={(value) => handleEditCategoriaChange(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.map((cat: CategoriaInfo) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <CategoriaQuickAdd 
                        onCategoriaCreada={handleCategoriaCreada}
                        trigger={
                          <Button type="button" variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        }
                      />
                    </div>
                    {editFormErrors.categoria && <p className="text-xs text-red-500 mt-1">{editFormErrors.categoria}</p>}
                  </div>
                  <div>
                    <Label htmlFor="edit-categoria-id">ID de Categoría</Label>
                    <Input
                      id="edit-categoria-id"
                      value={editingProduct?.categoria_id || ""}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                      placeholder="Se genera automáticamente"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="edit-precio">Precio de venta ($) *</Label>
                      <Input
                        id="edit-precio"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={editFormData.precio}
                        onChange={(e) => handleEditInputChange("precio", e.target.value)}
                      />
                      {editFormErrors.precio && <p className="text-xs text-red-500 mt-1">{editFormErrors.precio}</p>}
                    </div>
                    <div>
                      <Label htmlFor="edit-costo">Costo ($) *</Label>
                      <Input
                        id="edit-costo"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={editFormData.costo}
                        onChange={(e) => handleEditInputChange("costo", e.target.value)}
                      />
                      {editFormErrors.costo && <p className="text-xs text-red-500 mt-1">{editFormErrors.costo}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="edit-stock">Stock actual</Label>
                      <Input
                        id="edit-stock"
                        type="number"
                        placeholder="0"
                        value={editFormData.stock}
                        onChange={(e) => handleEditInputChange("stock", e.target.value)}
                      />
                      {editFormErrors.stock && <p className="text-xs text-red-500 mt-1">{editFormErrors.stock}</p>}
                    </div>
                    <div>
                      <Label htmlFor="edit-stock_minimo">Stock mínimo</Label>
                      <Input
                        id="edit-stock_minimo"
                        type="number"
                        placeholder="5"
                        value={editFormData.stock_minimo}
                        onChange={(e) => handleEditInputChange("stock_minimo", e.target.value)}
                      />
                      {editFormErrors.stock_minimo && <p className="text-xs text-red-500 mt-1">{editFormErrors.stock_minimo}</p>}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-descripcion">Descripción</Label>
                    <Textarea
                      id="edit-descripcion"
                      placeholder="Descripción detallada del producto"
                      className="h-32"
                      value={editFormData.descripcion}
                      onChange={(e) => handleEditInputChange("descripcion", e.target.value)}
                    />
                    {editFormErrors.descripcion && <p className="text-xs text-red-500 mt-1">{editFormErrors.descripcion}</p>}
                  </div>
                  <div>
                    <Label htmlFor="edit-imagen_url">URL de imagen</Label>
                    <Input
                      id="edit-imagen_url"
                      placeholder="URL de la imagen"
                      value={editFormData.imagen_url}
                      onChange={(e) => handleEditInputChange("imagen_url", e.target.value)}
                    />
                    {editFormErrors.imagen_url && <p className="text-xs text-red-500 mt-1">{editFormErrors.imagen_url}</p>}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false)
                    setEditingProduct(null)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveEdit}>
                  Guardar Cambios
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}

const getStockBadge = (producto: Producto) => {
  if (producto.stock === 0) {
    return <Badge variant="destructive">Agotado</Badge>
  } else if (producto.stock <= producto.stock_minimo) {
    return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Stock Bajo</Badge>
  } else {
    return <Badge className="bg-green-100 text-green-800 border-green-300">Disponible</Badge>
  }
}
