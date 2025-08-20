import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Edit, Trash2, Settings } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"

interface Categoria {
  id: string
  nombre: string
  descripcion: string | null
  icono: string | null
  color: string
  activo: boolean
  orden: number
  created_at: string
  updated_at: string
}

interface CategoriaFormData {
  nombre: string
  descripcion: string
  icono: string
  color: string
}

interface CategoriaFormErrors {
  nombre?: string
  descripcion?: string
  icono?: string
  color?: string
}

// Iconos disponibles de Lucide
const iconosDisponibles = [
  { value: "Package", label: "Paquete", icon: "📦" },
  { value: "Leaf", label: "Hoja", icon: "🍃" },
  { value: "Droplets", label: "Gotas", icon: "💧" },
  { value: "Lightbulb", label: "Bombilla", icon: "💡" },
  { value: "Thermometer", label: "Termómetro", icon: "🌡️" },
  { value: "Scissors", label: "Tijeras", icon: "✂️" },
  { value: "Sprout", label: "Brote", icon: "🌱" },
  { value: "Settings", label: "Configuración", icon: "⚙️" },
  { value: "Seedling", label: "Plántula", icon: "🌿" },
  { value: "Flower", label: "Flor", icon: "🌸" },
  { value: "Tree", label: "Árbol", icon: "🌳" },
  { value: "Garden", label: "Jardín", icon: "🏡" },
]

// Colores predefinidos
const coloresPredefinidos = [
  "#3B82F6", // Azul
  "#10B981", // Verde
  "#F59E0B", // Amarillo
  "#EF4444", // Rojo
  "#8B5CF6", // Púrpura
  "#84CC16", // Verde lima
  "#06B6D4", // Cian
  "#F97316", // Naranja
  "#EC4899", // Rosa
  "#6B7280", // Gris
]

// Datos mock por defecto
const categoriasMock: Categoria[] = [
  {
    id: "1",
    nombre: "Semillas",
    descripcion: "Variedades de semillas de cannabis",
    icono: "🌱",
    color: "#10B981",
    activo: true,
    orden: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    nombre: "Fertilizantes",
    descripcion: "Nutrientes para el cultivo",
    icono: "🌿",
    color: "#059669",
    activo: true,
    orden: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    nombre: "Iluminación",
    descripcion: "Sistemas de iluminación LED",
    icono: "💡",
    color: "#F59E0B",
    activo: true,
    orden: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    nombre: "Sustratos",
    descripcion: "Tierras y mezclas especializadas",
    icono: "🪴",
    color: "#8B5CF6",
    activo: true,
    orden: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function CategoriasManager() {
  const { showError, showSuccess } = useNotifications()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [formData, setFormData] = useState<CategoriaFormData>({
    nombre: "",
    descripcion: "",
    icono: "Package",
    color: "#3B82F6",
  })
  const [editFormData, setEditFormData] = useState<CategoriaFormData>({
    nombre: "",
    descripcion: "",
    icono: "Package",
    color: "#3B82F6",
  })
  const [formErrors, setFormErrors] = useState<CategoriaFormErrors>({})
  const [editFormErrors, setEditFormErrors] = useState<CategoriaFormErrors>({})

  useEffect(() => {
    cargarCategorias()
  }, [])

  const cargarCategorias = async () => {
    try {
      // En modo mock, cargar desde localStorage o usar datos por defecto
      const categoriasGuardadas = localStorage.getItem('crm-categorias')
      if (categoriasGuardadas) {
        setCategorias(JSON.parse(categoriasGuardadas))
      } else {
        // Primera vez: guardar datos mock
        localStorage.setItem('crm-categorias', JSON.stringify(categoriasMock))
        setCategorias(categoriasMock)
      }
    } catch (error) {
      console.error("Error cargando categorías:", error)
      showError("Error al cargar categorías")
      // En caso de error, usar datos mock
      setCategorias(categoriasMock)
    } finally {
      setIsLoading(false)
    }
  }

  const validarFormulario = (data: CategoriaFormData): CategoriaFormErrors => {
    const errors: CategoriaFormErrors = {}

    if (!data.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio"
    }

    if (!data.descripcion.trim()) {
      errors.descripcion = "La descripción es obligatoria"
    }

    if (!data.icono) {
      errors.icono = "Selecciona un icono"
    }

    if (!data.color) {
      errors.color = "Selecciona un color"
    }

    return errors
  }

  const agregarCategoria = async () => {
    const errors = validarFormulario(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      // Generar ID único
      const id = Date.now().toString()
      const now = new Date().toISOString()
      
      // Obtener el siguiente orden
      const categoriasActuales = JSON.parse(localStorage.getItem('crm-categorias') || '[]')
      const lastCategoria = categoriasActuales[categoriasActuales.length - 1]
      const nextOrden = (lastCategoria?.orden || 0) + 1

      const nuevaCategoria: Categoria = {
        id,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        icono: formData.icono,
        color: formData.color,
        activo: true,
        orden: nextOrden,
        created_at: now,
        updated_at: now,
      }

      // Actualizar localStorage
      const categoriasActualizadas = [...categoriasActuales, nuevaCategoria]
      localStorage.setItem('crm-categorias', JSON.stringify(categoriasActualizadas))

      // Actualizar el estado local
      setCategorias(categoriasActualizadas)
      setFormData({
        nombre: "",
        descripcion: "",
        icono: "Package",
        color: "#3B82F6",
      })
      setFormErrors({})
      setIsAddDialogOpen(false)

      showSuccess("Categoría agregada correctamente")
    } catch (error) {
      console.error("Error agregando categoría:", error)
      showError("Error al agregar categoría")
    }
  }

  const editarCategoria = async () => {
    if (!editingCategoria) return

    const errors = validarFormulario(editFormData)
    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors)
      return
    }

    try {
      const now = new Date().toISOString()
      const categoriasActuales = JSON.parse(localStorage.getItem('crm-categorias') || '[]')
      
      const categoriaActualizada = categoriasActuales.map((cat: Categoria) => 
        cat.id === editingCategoria.id 
          ? { 
              ...cat, 
              nombre: editFormData.nombre,
              descripcion: editFormData.descripcion,
              icono: editFormData.icono,
              color: editFormData.color,
              updated_at: now 
            }
          : cat
      )

      // Actualizar localStorage
      localStorage.setItem('crm-categorias', JSON.stringify(categoriaActualizada))

      // Actualizar el estado local
      setCategorias(categoriaActualizada)
      setEditingCategoria(null)
      setIsEditDialogOpen(false)

      showSuccess("Categoría actualizada correctamente")
    } catch (error) {
      console.error("Error actualizando categoría:", error)
      showError("Error al actualizar categoría")
    }
  }

  const eliminarCategoria = async (id: string) => {
    try {
      // Verificar si hay productos usando esta categoría
      const productosGuardados = localStorage.getItem('crm-productos')
      if (productosGuardados) {
        const productos = JSON.parse(productosGuardados)
        const productosEnCategoria = productos.filter((prod: any) => prod.categoria_id === id)
        
        if (productosEnCategoria.length > 0) {
          showError("No se puede eliminar: hay productos usando esta categoría")
          return
        }
      }

      const categoriasActuales = JSON.parse(localStorage.getItem('crm-categorias') || '[]')
      const categoriasFiltradas = categoriasActuales.filter((cat: Categoria) => cat.id !== id)

      // Actualizar localStorage
      localStorage.setItem('crm-categorias', JSON.stringify(categoriasFiltradas))

      // Actualizar el estado local
      setCategorias(categoriasFiltradas)

      showSuccess("Categoría eliminada correctamente")
    } catch (error) {
      console.error("Error eliminando categoría:", error)
      showError("Error al eliminar categoría")
    }
  }

  const toggleActivo = async (id: string, activo: boolean) => {
    try {
      const now = new Date().toISOString()
      const categoriasActuales = JSON.parse(localStorage.getItem('crm-categorias') || '[]')
      
      const categoriaActualizada = categoriasActuales.map((cat: Categoria) => 
        cat.id === id 
          ? { ...cat, activo, updated_at: now }
          : cat
      )

      // Actualizar localStorage
      localStorage.setItem('crm-categorias', JSON.stringify(categoriaActualizada))

      // Actualizar el estado local
      setCategorias(categoriaActualizada)

      showSuccess(`Categoría ${activo ? 'activada' : 'desactivada'} correctamente`)
    } catch (error) {
      console.error("Error cambiando estado de categoría:", error)
      showError("Error al cambiar estado de categoría")
    }
  }

  const abrirDialogoEdicion = (categoria: Categoria) => {
    setEditingCategoria(categoria)
    setEditFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || "",
      icono: categoria.icono || "Package",
      color: categoria.color,
    })
    setEditFormErrors({})
    setIsEditDialogOpen(true)
  }

  const cerrarDialogoEdicion = () => {
    setEditingCategoria(null)
    setEditFormData({
      nombre: "",
      descripcion: "",
      icono: "Package",
      color: "#3B82F6",
    })
    setEditFormErrors({})
    setIsEditDialogOpen(false)
  }

  const resetearFormulario = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      icono: "Package",
      color: "#3B82F6",
    })
    setFormErrors({})
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Cargando categorías...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestión de Categorías</h2>
          <p className="text-muted-foreground">
            Administra las categorías de productos de tu growshop
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Lista de Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorias.map((categoria) => (
          <Card key={categoria.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{categoria.icono}</span>
                  <div>
                    <CardTitle className="text-lg">{categoria.nombre}</CardTitle>
                    <CardDescription className="text-sm">
                      {categoria.descripcion}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={categoria.activo ? "default" : "secondary"}
                  className={`${
                    categoria.activo
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-gray-100 text-gray-800 border-gray-300"
                  }`}
                >
                  {categoria.activo ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: categoria.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    Orden: {categoria.orden}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActivo(categoria.id, !categoria.activo)}
                    className="h-8 w-8 p-0"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => abrirDialogoEdicion(categoria)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarCategoria(categoria.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialogo Agregar Categoría */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nueva Categoría</DialogTitle>
            <DialogDescription>
              Crea una nueva categoría para organizar tus productos
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className={formErrors.nombre ? "border-red-500" : ""}
              />
              {formErrors.nombre && (
                <p className="text-sm text-red-500">{formErrors.nombre}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className={formErrors.descripcion ? "border-red-500" : ""}
              />
              {formErrors.descripcion && (
                <p className="text-sm text-red-500">{formErrors.descripcion}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icono">Icono *</Label>
              <Select
                value={formData.icono}
                onValueChange={(value) => setFormData({ ...formData, icono: value })}
              >
                <SelectTrigger className={formErrors.icono ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona un icono" />
                </SelectTrigger>
                <SelectContent>
                  {iconosDisponibles.map((icono) => (
                    <SelectItem key={icono.value} value={icono.value}>
                      <div className="flex items-center space-x-2">
                        <span>{icono.icon}</span>
                        <span>{icono.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.icono && (
                <p className="text-sm text-red-500">{formErrors.icono}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Color *</Label>
              <div className="grid grid-cols-5 gap-2">
                {coloresPredefinidos.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      formData.color === color
                        ? "border-gray-800 scale-110"
                        : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {formErrors.color && (
                <p className="text-sm text-red-500">{formErrors.color}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetearFormulario}>
              Resetear
            </Button>
            <Button onClick={agregarCategoria} className="bg-green-600 hover:bg-green-700">
              Crear Categoría
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogo Editar Categoría */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>
              Modifica los datos de la categoría seleccionada
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nombre">Nombre *</Label>
              <Input
                id="edit-nombre"
                value={editFormData.nombre}
                onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })}
                className={editFormErrors.nombre ? "border-red-500" : ""}
              />
              {editFormErrors.nombre && (
                <p className="text-sm text-red-500">{editFormErrors.nombre}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-descripcion">Descripción *</Label>
              <Textarea
                id="edit-descripcion"
                value={editFormData.descripcion}
                onChange={(e) => setEditFormData({ ...editFormData, descripcion: e.target.value })}
                className={editFormErrors.descripcion ? "border-red-500" : ""}
              />
              {editFormErrors.descripcion && (
                <p className="text-sm text-red-500">{editFormErrors.descripcion}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-icono">Icono *</Label>
              <Select
                value={editFormData.icono}
                onValueChange={(value) => setEditFormData({ ...editFormData, icono: value })}
              >
                <SelectTrigger className={editFormErrors.icono ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecciona un icono" />
                </SelectTrigger>
                <SelectContent>
                  {iconosDisponibles.map((icono) => (
                    <SelectItem key={icono.value} value={icono.value}>
                      <div className="flex items-center space-x-2">
                        <span>{icono.icon}</span>
                        <span>{icono.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editFormErrors.icono && (
                <p className="text-sm text-red-500">{editFormErrors.icono}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-color">Color *</Label>
              <div className="grid grid-cols-5 gap-2">
                {coloresPredefinidos.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      editFormData.color === color
                        ? "border-gray-800 scale-110"
                        : "border-gray-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {editFormErrors.color && (
                <p className="text-sm text-red-500">{editFormErrors.color}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cerrarDialogoEdicion}>
              Cancelar
            </Button>
            <Button onClick={editarCategoria} className="bg-green-600 hover:bg-green-700">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
