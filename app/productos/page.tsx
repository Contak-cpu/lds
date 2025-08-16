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
import { toast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
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

interface CategoriaInfo {
  value: string
  label: string
  icon: ComponentType<{ className?: string }>
}

const categorias: CategoriaInfo[] = [
  { value: "todas", label: "Todas las categorías", icon: Package },
  { value: "Kits", label: "Kits", icon: Package },
  { value: "Semillas", label: "Semillas", icon: Leaf },
  { value: "Fertilizantes", label: "Fertilizantes", icon: Droplets },
  { value: "Iluminación", label: "Iluminación", icon: Lightbulb },
  { value: "Hidroponía", label: "Hidroponía", icon: Thermometer },
  { value: "Herramientas", label: "Herramientas", icon: Scissors },
]

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoria, setFilterCategoria] = useState("todas")
  const [filterStock, setFilterStock] = useState("todos")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [productos, setProductos] = useState<Producto[]>([])
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const [previewCategoriaId, setPreviewCategoriaId] = useState<string>("")

  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("productos").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setProductos(data || [])
    } catch (error) {
      console.error("Error cargando productos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof ProductoFormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
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

  const generateSKU = async (categoria: string): Promise<string> => {
    try {
      const supabase = createClient()
      
      // Obtener el último SKU numérico de la base de datos
      const { data: lastProduct, error } = await supabase
        .from("productos")
        .select("sku")
        .order("sku", { ascending: false })
        .limit(1)
      
      if (error) throw error
      
      let nextNumber = 1
      
      if (lastProduct && lastProduct.length > 0) {
        // Extraer el número del último SKU (asumiendo formato numérico)
        const lastSKU = lastProduct[0].sku
        const lastNumber = parseInt(lastSKU) || 0
        nextNumber = lastNumber + 1
      }
      
      // Verificar que el SKU no exista (por si acaso)
      let skuExists = true
      let attempts = 0
      const maxAttempts = 100
      
      while (skuExists && attempts < maxAttempts) {
        const testSKU = nextNumber.toString()
        
        const { data: existingProduct } = await supabase
          .from("productos")
          .select("id")
          .eq("sku", testSKU)
          .single()
        
        if (!existingProduct) {
          skuExists = false
        } else {
          nextNumber++
          attempts++
        }
      }
      
      if (attempts >= maxAttempts) {
        throw new Error("No se pudo generar un SKU único después de múltiples intentos")
      }
      
      return nextNumber.toString()
    } catch (error) {
      console.error("Error generando SKU:", error)
      // Fallback: usar timestamp como SKU
      return Date.now().toString()
    }
  }

  const generateCategoriaId = async (categoria: string): Promise<string> => {
    try {
      const supabase = createClient()
      
      // Definir prefijos para cada categoría
      let categoriaPrefix = 'PRO' // Producto genérico por defecto
      
      switch (categoria.toLowerCase()) {
        case 'semillas':
          categoriaPrefix = 'SEM'
          break
        case 'fertilizantes':
          categoriaPrefix = 'FER'
          break
        case 'herramientas':
          categoriaPrefix = 'HER'
          break
        case 'sustratos':
          categoriaPrefix = 'SUS'
          break
        case 'iluminacion':
        case 'iluminación':
          categoriaPrefix = 'ILU'
          break
        case 'hidroponia':
        case 'hidroponía':
          categoriaPrefix = 'HID'
          break
        case 'kits':
          categoriaPrefix = 'KIT'
          break
        case 'accesorios':
          categoriaPrefix = 'ACC'
          break
        default:
          categoriaPrefix = 'PRO'
      }
      
      // Obtener el último número para esta categoría
      const { data: lastProduct, error } = await supabase
        .from("productos")
        .select("categoria_id")
        .like("categoria_id", `${categoriaPrefix}-%`)
        .order("categoria_id", { ascending: false })
        .limit(1)
      
      if (error) throw error
      
      let nextNumber = 1
      
      if (lastProduct && lastProduct.length > 0) {
        // Extraer el número del último categoria_id (ej: SEM-001 -> 1)
        const lastCategoriaId = lastProduct[0].categoria_id
        const match = lastCategoriaId.match(new RegExp(`${categoriaPrefix}-(\\d+)`))
        if (match) {
          nextNumber = parseInt(match[1]) + 1
        }
      }
      
      // Formatear el ID con ceros a la izquierda (ej: SEM-001, SEM-002)
      return `${categoriaPrefix}-${nextNumber.toString().padStart(3, '0')}`
    } catch (error) {
      console.error("Error generando categoria_id:", error)
      // Fallback: usar timestamp como categoria_id
      return `PRO-${Date.now().toString().slice(-3)}`
    }
  }

  const handleCategoriaChange = (categoria: string) => {
    handleInputChange("categoria", categoria)
    
    // Generar preview del categoria_id que se creará
    let categoriaPrefix = 'PRO'
    switch (categoria.toLowerCase()) {
      case 'semillas':
        categoriaPrefix = 'SEM'
        break
      case 'fertilizantes':
        categoriaPrefix = 'FER'
        break
      case 'herramientas':
        categoriaPrefix = 'HER'
        break
      case 'sustratos':
        categoriaPrefix = 'SUS'
        break
      case 'iluminacion':
      case 'iluminación':
        categoriaPrefix = 'ILU'
        break
      case 'hidroponia':
      case 'hidroponía':
        categoriaPrefix = 'HID'
        break
      case 'kits':
        categoriaPrefix = 'KIT'
        break
      case 'accesorios':
        categoriaPrefix = 'ACC'
        break
      default:
        categoriaPrefix = 'PRO'
    }
    
    // Actualizar el campo categoria_id en el formulario para mostrar el preview
    setPreviewCategoriaId(`${categoriaPrefix}-001`)
  }

  const handleAddProduct = async () => {
    if (!formData.nombre || !formData.precio || !formData.costo || !formData.categoria) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    try {
      const supabase = createClient()
      
      // Generar SKU único y categoria_id automáticamente
      const [sku, categoriaId] = await Promise.all([
        generateSKU(formData.categoria),
        generateCategoriaId(formData.categoria)
      ])
      
      const { data, error } = await supabase
        .from("productos")
        .insert([
          {
            sku: sku,
            categoria_id: categoriaId,
            nombre: formData.nombre,
            descripcion: formData.descripcion || null,
            categoria: formData.categoria,
            precio: parseFloat(formData.precio),
            costo: parseFloat(formData.costo),
            stock: parseInt(formData.stock) || 0,
            stock_minimo: parseInt(formData.stock_minimo) || 5,
            imagen_url: formData.imagen_url || null,
            activo: true,
          },
        ])
        .select()

      if (error) throw error

      if (data) {
        setProductos((prev: Producto[]) => [data[0], ...prev])
        resetForm()
        toast({
          title: "Producto agregado",
          description: "El producto se ha agregado exitosamente",
        })
      }
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto",
        variant: "destructive",
      })
    }
  }

  const handleEditProduct = (product: Producto) => {
    setEditingProduct(product)
    setFormData({
      nombre: product.nombre,
      categoria: product.categoria,
      precio: product.precio.toString(),
      costo: product.costo.toString(),
      stock: product.stock.toString(),
      stock_minimo: product.stock_minimo.toString(),
      descripcion: product.descripcion || "",
      imagen_url: product.imagen_url || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingProduct) return

    if (!formData.nombre || !formData.precio || !formData.costo || !formData.categoria) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("productos")
        .update({
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          categoria: formData.categoria,
          precio: parseFloat(formData.precio),
          costo: parseFloat(formData.costo),
          stock: parseInt(formData.stock) || 0,
          stock_minimo: parseInt(formData.stock_minimo) || 5,
          imagen_url: formData.imagen_url || null,
        })
        .eq("id", editingProduct.id)
        .select()

      if (error) throw error

      if (data) {
        setProductos((prev: Producto[]) =>
          prev.map((producto: Producto) => (producto.id === editingProduct.id ? data[0] : producto)),
        )
        setIsEditDialogOpen(false)
        setEditingProduct(null)
        toast({
          title: "Producto actualizado",
          description: "Los cambios se han guardado exitosamente",
        })
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("productos").delete().eq("id", productId)

      if (error) throw error

      // Actualizar la lista local
      setProductos(productos.filter((producto: Producto) => producto.id !== productId))
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado del catálogo",
      })
    } catch (error) {
      console.error("Error eliminando producto:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      })
    }
  }

  const filteredProductos = productos.filter((producto: Producto) => {
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (producto.categoria_id && producto.categoria_id.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategoria = filterCategoria === "todas" || producto.categoria === filterCategoria
    const matchesStock =
      filterStock === "todos" ||
      (filterStock === "disponible" && producto.stock > 0) ||
      (filterStock === "bajo" && producto.stock > 0 && producto.stock <= producto.stock_minimo) ||
      (filterStock === "agotado" && producto.stock === 0)

    return matchesSearch && matchesCategoria && matchesStock
  })

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
      <div className="flex h-screen bg-gray-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navigation />

      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-green-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-600 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Catálogo de Productos</h1>
                  <p className="text-sm text-amber-600">Gestiona tu inventario de cultivo</p>
                </div>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Productos</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{productos.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Stock Bajo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {productos.filter((p: Producto) => p.stock <= p.stock_minimo && p.stock > 0).length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Agotados</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {productos.filter((p: Producto) => p.stock === 0).length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Valor Inventario</CardTitle>
                <Package className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${productos.reduce((sum: number, p: Producto) => sum + p.precio * p.stock, 0).toLocaleString()}
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
              <Card key={producto.id} className="bg-white border-green-200 hover:shadow-lg transition-shadow">
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
                      <span className="text-xs text-gray-500">{producto.categoria}</span>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">{producto.sku}</span>
                      {producto.categoria_id && (
                        <span className="text-xs font-mono bg-blue-100 px-2 py-1 rounded text-blue-600">{producto.categoria_id}</span>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{producto.nombre}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{producto.descripcion}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-green-600">${producto.precio.toLocaleString()}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">Stock: {producto.stock}</div>
                      <div className="text-xs text-gray-500">Mín: {producto.stock_minimo}</div>
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
                              <Label className="text-sm font-medium text-gray-600">Información Básica</Label>
                              <div className="mt-2 space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">ID:</span>
                                  <span className="text-sm font-medium">{producto.id.slice(0, 8)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">ID de Categoría:</span>
                                  <span className="text-sm font-medium font-mono bg-blue-100 px-2 py-1 rounded">{producto.categoria_id || 'No asignado'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Categoría:</span>
                                  <span className="text-sm font-medium">{producto.categoria}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Precio de venta:</span>
                                  <span className="text-lg font-bold text-green-600">
                                    ${producto.precio.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Costo:</span>
                                  <span className="text-sm font-medium text-red-600">
                                    ${producto.costo.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Ganancia:</span>
                                  <span className="text-sm font-bold text-blue-600">
                                    ${calcularGanancia(producto.precio, producto.costo).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Margen:</span>
                                  <span className="text-sm font-bold text-blue-600">
                                    {calcularMargenGanancia(producto.precio, producto.costo)}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Stock actual:</span>
                                  <span className="text-sm font-medium">{producto.stock} unidades</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Stock mínimo:</span>
                                  <span className="text-sm font-medium">{producto.stock_minimo} unidades</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Estado:</span>
                                  {getStockBadge(producto)}
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Descripción</Label>
                              <p className="text-sm text-gray-700 mt-1">{producto.descripcion}</p>
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
            <Card className="bg-white border-green-200">
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
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
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoría *</Label>
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
                  </div>
                  <div>
                    <Label htmlFor="imagen_url">URL de imagen</Label>
                    <Input
                      id="imagen_url"
                      placeholder="URL de la imagen"
                      value={formData.imagen_url}
                      onChange={(e) => handleInputChange("imagen_url", e.target.value)}
                    />
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
                      value={formData.nombre}
                      onChange={(e) => handleInputChange("nombre", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-categoria">Categoría *</Label>
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
                        value={formData.precio}
                        onChange={(e) => handleInputChange("precio", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-costo">Costo ($) *</Label>
                      <Input
                        id="edit-costo"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={formData.costo}
                        onChange={(e) => handleInputChange("costo", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="edit-stock">Stock actual</Label>
                      <Input
                        id="edit-stock"
                        type="number"
                        placeholder="0"
                        value={formData.stock}
                        onChange={(e) => handleInputChange("stock", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-stock_minimo">Stock mínimo</Label>
                      <Input
                        id="edit-stock_minimo"
                        type="number"
                        placeholder="5"
                        value={formData.stock_minimo}
                        onChange={(e) => handleInputChange("stock_minimo", e.target.value)}
                      />
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
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange("descripcion", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-imagen_url">URL de imagen</Label>
                    <Input
                      id="edit-imagen_url"
                      placeholder="URL de la imagen"
                      value={formData.imagen_url}
                      onChange={(e) => handleInputChange("imagen_url", e.target.value)}
                    />
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
