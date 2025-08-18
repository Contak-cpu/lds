"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Settings } from "lucide-react"
import { useCategorias } from "@/hooks/use-categorias"
import { useNotifications } from "@/hooks/use-notifications"

interface CategoriaQuickAddProps {
  onCategoriaCreada: (nombre: string) => void
  trigger?: React.ReactNode
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

export function CategoriaQuickAdd({ onCategoriaCreada, trigger }: CategoriaQuickAddProps) {
  const { agregarCategoria } = useCategorias()
  const { showError, showSuccess } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CategoriaFormData>({
    nombre: "",
    descripcion: "",
    icono: "Package",
    color: "#3B82F6",
  })
  const [formErrors, setFormErrors] = useState<CategoriaFormErrors>({})

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

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      icono: "Package",
      color: "#3B82F6",
    })
    setFormErrors({})
  }

  const handleSubmit = async () => {
    const errors = validateForm(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      setIsSubmitting(true)
      
      await agregarCategoria({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || null,
        icono: formData.icono,
        color: formData.color,
        activo: true,
        orden: 0, // Se calculará automáticamente en el hook
      })

      showSuccess("Éxito", "Categoría creada correctamente")
      onCategoriaCreada(formData.nombre.trim())
      setIsOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error creando categoría:", error)
      if (error instanceof Error && error.message.includes("duplicate")) {
        showError("Error", "Ya existe una categoría con ese nombre")
      } else {
        showError("Error", "No se pudo crear la categoría")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetForm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Categoría
          </Button>
        )}
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear Categoría"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
