"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
  { value: "Package", label: "Zapatilla", icon: "👟" },
  { value: "ShoppingBag", label: "Bolsa", icon: "🛍️" },
  { value: "Star", label: "Estrella", icon: "⭐" },
  { value: "Zap", label: "Rayo", icon: "⚡" },
  { value: "Crown", label: "Corona", icon: "👑" },
  { value: "Award", label: "Premio", icon: "🏆" },
  { value: "Target", label: "Objetivo", icon: "🎯" },
  { value: "Settings", label: "Configuración", icon: "⚙️" },
  { value: "Flame", label: "Fuego", icon: "🔥" },
  { value: "Heart", label: "Corazón", icon: "❤️" },
  { value: "Diamond", label: "Diamante", icon: "💎" },
  { value: "Rocket", label: "Cohete", icon: "🚀" },
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
      // Cargar categorías desde localStorage (modo mock)
      const categoriasMock: Categoria[] = [
        {
          id: "1",
          nombre: "Running",
          descripcion: "Zapatillas para correr y entrenar",
          icono: "Zap",
          color: "#3B82F6",
          activo: true,
          orden: 1,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        },
        {
          id: "2",
          nombre: "Basketball",
          descripcion: "Zapatillas de básquet profesionales",
          icono: "Target",
          color: "#F59E0B",
          activo: true,
          orden: 2,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        },
        {
          id: "3",
          nombre: "Lifestyle",
          descripcion: "Zapatillas casuales para el día a día",
          icono: "Heart",
          color: "#10B981",
          activo: true,
          orden: 3,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        }
      ]
      
      const categoriasSaved = localStorage.getItem('categorias-sneakers')
      const categoriasData = categoriasSaved ? JSON.parse(categoriasSaved) : categoriasMock
      
      setCategorias(categoriasData)
    } catch (error) {
      console.error("Error cargando categorías:", error)
      showError("Error", "No se pudieron cargar las categorías")
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = (data: CategoriaFormData): CategoriaFormErrors => {
    const errors: CategoriaFormErrors = {}

    if (!data.nombre.trim()) {
      errors.nombre = "El nombre de la categoría es obligatorio"
    } else if (data.nombre.trim().length < 2) {
      errors.nombre = "El nombre debe tener al menos 2 caracteres"
    }

    if (data.descripcion.trim().length > 500) {
      errors.descripcion = "La descripción no puede exceder 500 caracteres"
    }

    if (!data.icono) {
      errors.icono = "Debe seleccionar un icono"
    }

    if (!data.color) {
      errors.color = "Debe seleccionar un color"
    }

    return errors
  }

  const handleInputChange = (field: keyof CategoriaFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleEditInputChange = (field: keyof CategoriaFormData, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (editFormErrors[field]) {
      setEditFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      icono: "Package",
      color: "#3B82F6",
    })
    setFormErrors({})
  }

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true)
    resetForm()
  }

  const handleOpenEditDialog = (categoria: Categoria) => {
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

  const handleSubmit = async () => {
    const errors = validateForm(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      // Verificar si la categoría ya existe
      const existingCategoria = categorias.find(cat => 
        cat.nombre.toLowerCase() === formData.nombre.trim().toLowerCase()
      )

      if (existingCategoria) {
        showError("Error", "Ya existe una categoría con ese nombre")
        return
      }

      // Obtener el siguiente orden
      const nextOrden = Math.max(...categorias.map(cat => cat.orden), 0) + 1

      // Crear nueva categoría
      const nuevaCategoria: Categoria = {
        id: Date.now().toString(),
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        icono: formData.icono,
        color: formData.color,
        activo: true,
        orden: nextOrden,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Guardar en localStorage
      const categoriasActualizadas = [...categorias, nuevaCategoria]
      localStorage.setItem('categorias-sneakers', JSON.stringify(categoriasActualizadas))
      setCategorias(categoriasActualizadas)

      showSuccess("Éxito", "Categoría creada correctamente")
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creando categoría:", error)
      showError("Error", "No se pudo crear la categoría")
    }
  }

  const handleEdit = async () => {
    const errors = validateForm(editFormData)
    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors)
      return
    }

    if (!editingCategoria) return

    try {
      // Verificar si la categoría ya existe (excluyendo la actual)
      const existingCategoria = categorias.find(cat => 
        cat.nombre.toLowerCase() === editFormData.nombre.trim().toLowerCase() &&
        cat.id !== editingCategoria.id
      )

      if (existingCategoria) {
        showError("Error", "Ya existe una categoría con ese nombre")
        return
      }

      // Actualizar categoría
      const categoriasActualizadas = categorias.map(cat => 
        cat.id === editingCategoria.id 
          ? {
              ...cat,
              nombre: editFormData.nombre.trim(),
              descripcion: editFormData.descripcion.trim() || null,
              icono: editFormData.icono,
              color: editFormData.color,
              updated_at: new Date().toISOString(),
            }
          : cat
      )

      // Guardar en localStorage
      localStorage.setItem('categorias-sneakers', JSON.stringify(categoriasActualizadas))
      setCategorias(categoriasActualizadas)

      showSuccess("Éxito", "Categoría actualizada correctamente")
      setIsEditDialogOpen(false)
      setEditingCategoria(null)
    } catch (error) {
      console.error("Error actualizando categoría:", error)
      showError("Error", "No se pudo actualizar la categoría")
    }
  }

  const handleDelete = async (categoria: Categoria) => {
    try {
      // Verificar si hay productos usando esta categoría
      const productosGuardados = localStorage.getItem('productos-sneakers')
      const productos = productosGuardados ? JSON.parse(productosGuardados) : []
      const productosCount = productos.filter((p: any) => p.categoria === categoria.nombre)

      if (productosCount.length > 0) {
        showError(
          "Error", 
          `No se puede eliminar la categoría porque hay ${productosCount.length} producto(s) que la utilizan`
        )
        return
      }

      // Eliminar categoría
      const categoriasActualizadas = categorias.filter(cat => cat.id !== categoria.id)
      localStorage.setItem('categorias-sneakers', JSON.stringify(categoriasActualizadas))
      setCategorias(categoriasActualizadas)

      showSuccess("Éxito", "Categoría eliminada correctamente")
    } catch (error) {
      console.error("Error eliminando categoría:", error)
      showError("Error", "No se pudo eliminar la categoría")
    }
  }

  const toggleActivo = async (categoria: Categoria) => {
    try {
      // Actualizar estado activo
      const categoriasActualizadas = categorias.map(cat => 
        cat.id === categoria.id 
          ? {
              ...cat,
              activo: !cat.activo,
              updated_at: new Date().toISOString(),
            }
          : cat
      )

      // Guardar en localStorage
      localStorage.setItem('categorias-sneakers', JSON.stringify(categoriasActualizadas))
      setCategorias(categoriasActualizadas)

      showSuccess("Éxito", `Categoría ${categoria.activo ? "desactivada" : "activada"} correctamente`)
    } catch (error) {
      console.error("Error cambiando estado de categoría:", error)
      showError("Error", "No se pudo cambiar el estado de la categoría")
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando categorías...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Categorías</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Categoría</DialogTitle>
              <DialogDescription>
                Agrega una nueva categoría para organizar mejor tus productos.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre *
                </Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  className="col-span-3"
                  placeholder="Ej: Accesorios"
                />
                {formErrors.nombre && (
                  <span className="col-span-3 text-sm text-red-500">
                    {formErrors.nombre}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="descripcion" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  className="col-span-3"
                  placeholder="Descripción opcional de la categoría"
                  rows={3}
                />
                {formErrors.descripcion && (
                  <span className="col-span-3 text-sm text-red-500">
                    {formErrors.descripcion}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icono" className="text-right">
                  Icono *
                </Label>
                <Select value={formData.icono} onValueChange={(value) => handleInputChange("icono", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconosDisponibles.map((icono) => (
                      <SelectItem key={icono.value} value={icono.value}>
                        <span className="mr-2">{icono.icon}</span>
                        {icono.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.icono && (
                  <span className="col-span-3 text-sm text-red-500">
                    {formErrors.icono}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color *
                </Label>
                <div className="col-span-3 flex gap-2 items-center">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                    className="w-16 h-10 flex-shrink-0"
                  />
                  <div className="flex gap-1 flex-wrap max-w-48">
                    {coloresPredefinidos.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 flex-shrink-0"
                        style={{ backgroundColor: color }}
                        onClick={() => handleInputChange("color", color)}
                      />
                    ))}
                  </div>
                </div>
                {formErrors.color && (
                  <span className="col-span-3 text-sm text-red-500">
                    {formErrors.color}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Crear Categoría</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categorias.map((categoria) => (
          <Card key={categoria.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-white"
                    style={{ backgroundColor: categoria.color }}
                  >
                    {iconosDisponibles.find(i => i.value === categoria.icono)?.icon || "📦"}
                  </div>
                  {categoria.nombre}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEditDialog(categoria)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Estás seguro de que quieres eliminar la categoría "{categoria.nombre}"? 
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(categoria)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {categoria.descripcion && (
                <p className="text-sm text-gray-600 mb-3">{categoria.descripcion}</p>
              )}
              <div className="flex items-center justify-between">
                <Badge variant={categoria.activo ? "default" : "secondary"}>
                  {categoria.activo ? "Activa" : "Inactiva"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleActivo(categoria)}
                >
                  {categoria.activo ? "Desactivar" : "Activar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog para editar categoría */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>
              Modifica los datos de la categoría seleccionada.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-nombre" className="text-right">
                Nombre *
              </Label>
              <Input
                id="edit-nombre"
                value={editFormData.nombre}
                onChange={(e) => handleEditInputChange("nombre", e.target.value)}
                className="col-span-3"
              />
              {editFormErrors.nombre && (
                <span className="col-span-3 text-sm text-red-500">
                  {editFormErrors.nombre}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-descripcion" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="edit-descripcion"
                value={editFormData.descripcion}
                onChange={(e) => handleEditInputChange("descripcion", e.target.value)}
                className="col-span-3"
                rows={3}
              />
              {editFormErrors.descripcion && (
                <span className="col-span-3 text-sm text-red-500">
                  {editFormErrors.descripcion}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-icono" className="text-right">
                Icono *
              </Label>
              <Select value={editFormData.icono} onValueChange={(value) => handleEditInputChange("icono", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconosDisponibles.map((icono) => (
                    <SelectItem key={icono.value} value={icono.value}>
                      <span className="mr-2">{icono.icon}</span>
                      {icono.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editFormErrors.icono && (
                <span className="col-span-3 text-sm text-red-500">
                  {editFormErrors.icono}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-color" className="text-right">
                Color *
              </Label>
              <div className="col-span-3 flex gap-2 items-center">
                <Input
                  id="edit-color"
                  type="color"
                  value={editFormData.color}
                  onChange={(e) => handleEditInputChange("color", e.target.value)}
                  className="w-16 h-10 flex-shrink-0"
                />
                <div className="flex gap-1 flex-wrap max-w-48">
                  {coloresPredefinidos.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 flex-shrink-0"
                      style={{ backgroundColor: color }}
                      onClick={() => handleEditInputChange("color", color)}
                    />
                  ))}
                </div>
              </div>
              {editFormErrors.color && (
                <span className="col-span-3 text-sm text-red-500">
                  {editFormErrors.color}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>Actualizar Categoría</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
