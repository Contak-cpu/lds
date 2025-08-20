"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { Plus, Search, Filter, DollarSign, TrendingDown, Calendar, Receipt, User, Eye, Edit, Trash } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { mockDataService, type Egreso } from "@/lib/mock-data"
import { DateFilter } from "@/components/ui/date-filter"
import { useDateFilter } from "@/hooks/use-date-filter"

interface EgresoFormData {
  descripcion: string
  categoria: string
  monto: string
  proveedor: string
  metodo_pago: string
  notas?: string
}

interface EgresoFormErrors {
  descripcion?: string
  categoria?: string
  monto?: string
  proveedor?: string
  metodo_pago?: string
  notas?: string
}

const validateEgresoForm = (formData: EgresoFormData): EgresoFormErrors => {
  const errors: EgresoFormErrors = {}

  if (!formData.descripcion.trim()) {
    errors.descripcion = "La descripción es obligatoria"
  } else if (formData.descripcion.trim().length < 5) {
    errors.descripcion = "La descripción debe tener al menos 5 caracteres"
  }

  if (!formData.categoria.trim()) {
    errors.categoria = "La categoría es obligatoria"
  }

  if (!formData.monto.trim()) {
    errors.monto = "El monto es obligatorio"
  } else if (!/^\d+(\.\d{1,2})?$/.test(formData.monto.trim())) {
    errors.monto = "El monto debe ser un número válido (máximo 2 decimales)"
  } else if (parseFloat(formData.monto) <= 0) {
    errors.monto = "El monto debe ser mayor a 0"
  }

  if (!formData.proveedor.trim()) {
    errors.proveedor = "El proveedor es obligatorio"
  } else if (formData.proveedor.trim().length < 2) {
    errors.proveedor = "El proveedor debe tener al menos 2 caracteres"
  }

  if (!formData.metodo_pago.trim()) {
    errors.metodo_pago = "El método de pago es obligatorio"
  }

  return errors
}

const categorias = [
  "Proveedores",
  "Alquiler",
  "Servicios",
  "Impuestos",
  "Sueldos",
  "Marketing",
  "Mantenimiento",
  "Transporte",
  "Otros",
]

const metodosPago = ["Efectivo", "Transferencia", "Débito", "Crédito", "Cheque"]

export default function EgresosPage() {
  const [egresos, setEgresos] = useState<Egreso[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos")
  const [busqueda, setBusqueda] = useState("")
  const [dialogAbierto, setDialogAbierto] = useState(false)
  const dateFilter = useDateFilter("todos")
  const [editandoEgreso, setEditandoEgreso] = useState<Egreso | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formErrors, setFormErrors] = useState<EgresoFormErrors>({})
  const [editFormErrors, setEditFormErrors] = useState<EgresoFormErrors>({})
  const { showError, showEgresoCreated, showEgresoUpdated, showEgresoDeleted } = useNotifications()

  const [formData, setFormData] = useState<EgresoFormData>({
    descripcion: "",
    categoria: "",
    monto: "",
    proveedor: "",
    metodo_pago: "",
    notas: "",
  })

  const [editFormData, setEditFormData] = useState<EgresoFormData>({
    descripcion: "",
    categoria: "",
    monto: "",
    proveedor: "",
    metodo_pago: "",
    notas: "",
  })

  useEffect(() => {
    cargarEgresos()
  }, [])

  useEffect(() => {
    cargarEgresos()
  }, [dateFilter.selectedQuickFilter, dateFilter.selectedRange])

  const cargarEgresos = async () => {
    try {
      const dateRange = dateFilter.getFilteredDateRange()
      let egresosData = await mockDataService.getEgresos()
      
      if (dateRange?.from && dateRange?.to) {
        egresosData = egresosData.filter(egreso => {
          const fechaEgreso = new Date(egreso.fecha_egreso)
          if (dateRange.from && dateRange.to) {
            return fechaEgreso >= dateRange.from && fechaEgreso <= dateRange.to
          }
          return true
        })
      }
      
      egresosData.sort((a, b) => new Date(b.fecha_egreso).getTime() - new Date(a.fecha_egreso).getTime())
      setEgresos(egresosData)
    } catch (error) {
      console.error("Error cargando egresos:", error)
      showError("Error", "No se pudieron cargar los egresos")
    } finally {
      setIsLoading(false)
    }
  }

  const egresosFiltrados = egresos.filter((egreso: Egreso) => {
    const coincideBusqueda =
      egreso.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      egreso.proveedor.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = filtroCategoria === "todos" || egreso.categoria === filtroCategoria
    return coincideBusqueda && coincideCategoria
  })

  const totalEgresos = egresos.reduce((sum: number, egreso: Egreso) => sum + (egreso.monto || 0), 0)
  const egresosMesActual = egresos.filter((egreso: Egreso) => {
    const fechaEgreso = new Date(egreso.fecha_egreso)
    const ahora = new Date()
    return fechaEgreso.getMonth() === ahora.getMonth() && fechaEgreso.getFullYear() === ahora.getFullYear()
  })
  const totalMesActual = egresosMesActual.reduce((sum: number, egreso: Egreso) => sum + (egreso.monto || 0), 0)
  const promedioDiario = new Date().getDate() > 0 ? totalMesActual / new Date().getDate() : 0
  const mayorEgreso = egresos.length > 0 ? Math.max(...egresos.map((e: Egreso) => e.monto || 0)) : 0

  const handleInputChange = (field: keyof EgresoFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleEditInputChange = (field: keyof EgresoFormData, value: string): void => {
    setEditFormData((prev) => ({ ...prev, [field]: value }))
    if (editFormErrors[field]) {
      setEditFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleOpenDialog = () => {
    setDialogAbierto(true)
    setFormErrors({})
  }

  const handleOpenEditDialog = (egreso: Egreso) => {
    setEditandoEgreso(egreso)
    setFormData({
      descripcion: egreso.descripcion,
      categoria: egreso.categoria,
      monto: egreso.monto.toString(),
      proveedor: egreso.proveedor,
      metodo_pago: egreso.metodo_pago,
      notas: egreso.notas || "",
    })
    setFormErrors({})
    setDialogAbierto(true)
  }

  const agregarEgreso = async (): Promise<void> => {
    try {
      const errors = validateEgresoForm(formData)
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        showError("Error de validación", "Por favor, corrige los errores en el formulario")
        return
      }

      setFormErrors({})

      const newEgreso = await mockDataService.createEgreso({
        fecha_egreso: new Date().toISOString().split("T")[0],
        descripcion: formData.descripcion.trim(),
        categoria: formData.categoria,
        monto: Number.parseFloat(formData.monto),
        proveedor: formData.proveedor.trim(),
        metodo_pago: formData.metodo_pago,
        notas: formData.notas?.trim() || undefined,
      })

      setEgresos([newEgreso, ...egresos])

      setFormData({
        descripcion: "",
        categoria: "",
        monto: "",
        proveedor: "",
        metodo_pago: "",
        notas: "",
      })

      setDialogAbierto(false)
      showEgresoCreated()
    } catch (error) {
      console.error("Error agregando egreso:", error)
      showError("Error", "No se pudo agregar el egreso")
    }
  }

  const editarEgreso = async (): Promise<void> => {
    if (!editandoEgreso) return

    try {
      const updatedEgreso = await mockDataService.updateEgreso(editandoEgreso.id, {
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        monto: Number.parseFloat(formData.monto),
        proveedor: formData.proveedor,
        metodo_pago: formData.metodo_pago,
        notas: formData.notas,
      })

      if (updatedEgreso) {
        setEgresos(egresos.map((egreso: Egreso) => (egreso.id === editandoEgreso.id ? updatedEgreso : egreso)))
      }

      setEditandoEgreso(null)
      setDialogAbierto(false)
      showEgresoUpdated()
    } catch (error) {
      console.error("Error editando egreso:", error)
      showError("Error", "No se pudieron guardar los cambios")
    }
  }

  const abrirEdicion = (egreso: Egreso): void => {
    setEditandoEgreso(egreso)
    setFormData({
      descripcion: egreso.descripcion,
      categoria: egreso.categoria,
      monto: egreso.monto.toString(),
      proveedor: egreso.proveedor,
      metodo_pago: egreso.metodo_pago,
      notas: egreso.notas || "",
    })
    setDialogAbierto(true)
  }

  const eliminarEgreso = async (id: number): Promise<void> => {
    try {
      const success = await mockDataService.deleteEgreso(id)

      if (success) {
        setEgresos(egresos.filter((egreso: Egreso) => egreso.id !== id))
        showEgresoDeleted()
      } else {
        showError("Error", "No se pudo eliminar el egreso")
      }
    } catch (error) {
      console.error("Error eliminando egreso:", error)
      showError("Error", "No se pudo eliminar el egreso")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="ml-64">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Cargando egresos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="lg:ml-64">
        <div className="container mx-auto p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Gestión de Egresos</h1>
            <p className="text-muted-foreground">Controla y registra todos los gastos de tu negocio</p>
          </div>

          {/* Controles superiores */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar egresos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las categorías</SelectItem>
                  {categorias.map((categoria: string) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Egreso
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editandoEgreso ? "Editar Egreso" : "Nuevo Egreso"}</DialogTitle>
                    <DialogDescription>
                      {editandoEgreso ? "Modifica los datos del egreso" : "Registra un nuevo gasto del negocio"}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="descripcion">Concepto *</Label>
                      <Input
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => handleInputChange("descripcion", e.target.value)}
                        placeholder="Concepto del egreso"
                      />
                      {formErrors.descripcion && <p className="text-xs text-red-500 mt-1">{formErrors.descripcion}</p>}
                    </div>

                    <div>
                      <Label htmlFor="categoria">Categoría *</Label>
                      <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((categoria: string) => (
                            <SelectItem key={categoria} value={categoria}>
                              {categoria}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.categoria && <p className="text-xs text-red-500 mt-1">{formErrors.categoria}</p>}
                    </div>

                    <div>
                      <Label htmlFor="monto">Monto *</Label>
                      <Input
                        id="monto"
                        type="number"
                        value={formData.monto}
                        onChange={(e) => handleInputChange("monto", e.target.value)}
                        placeholder="0"
                      />
                      {formErrors.monto && <p className="text-xs text-red-500 mt-1">{formErrors.monto}</p>}
                    </div>

                    <div>
                      <Label htmlFor="proveedor">Proveedor/Destinatario *</Label>
                      <Input
                        id="proveedor"
                        value={formData.proveedor}
                        onChange={(e) => handleInputChange("proveedor", e.target.value)}
                        placeholder="Nombre del proveedor"
                      />
                      {formErrors.proveedor && <p className="text-xs text-red-500 mt-1">{formErrors.proveedor}</p>}
                    </div>

                    <div>
                      <Label htmlFor="metodo_pago">Método de Pago *</Label>
                      <Select
                        value={formData.metodo_pago}
                        onValueChange={(value) => handleInputChange("metodo_pago", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona método" />
                        </SelectTrigger>
                        <SelectContent>
                          {metodosPago.map((metodo: string) => (
                            <SelectItem key={metodo} value={metodo}>
                              {metodo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.metodo_pago && <p className="text-xs text-red-500 mt-1">{formErrors.metodo_pago}</p>}
                    </div>

                    <div>
                      <Label htmlFor="notas">Descripción</Label>
                      <Textarea
                        id="notas"
                        value={formData.notas}
                        onChange={(e) => handleInputChange("notas", e.target.value)}
                        placeholder="Detalles adicionales..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogAbierto(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={editandoEgreso ? editarEgreso : agregarEgreso}>
                      {editandoEgreso ? "Guardar Cambios" : "Agregar Egreso"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Resumen de egresos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Total Egresos</span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  ${totalEgresos.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Este Mes</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ${totalMesActual.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Receipt className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Total Registros</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {egresosFiltrados.length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Promedio Diario</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  ${promedioDiario.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de egresos */}
          <div className="space-y-4">
            {egresosFiltrados.map((egreso: Egreso) => (
              <Card key={egreso.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <Receipt className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{egreso.descripcion}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-medium text-red-600">${egreso.monto.toLocaleString("es-AR")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(egreso.fecha_egreso).toLocaleDateString("es-AR")}</span>
                            </div>
                            {egreso.categoria && (
                              <Badge variant="outline">{egreso.categoria}</Badge>
                            )}
                          </div>
                          {egreso.notas && (
                            <p className="text-sm text-muted-foreground mt-2">{egreso.notas}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirEdicion(egreso)}
                        className="w-full sm:w-auto"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarEgreso(egreso.id)}
                        className="w-full sm:w-auto text-destructive hover:text-destructive"
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {egresosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No se encontraron egresos</h3>
              <p className="text-muted-foreground">No hay egresos que coincidan con los filtros aplicados</p>
            </div>
          )}
        </div>
      </div>

      {/* Diálogo de edición */}
      <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Egreso</DialogTitle>
            <DialogDescription>
              Modifica la información del egreso
            </DialogDescription>
          </DialogHeader>
          {editandoEgreso && (
            <form onSubmit={editarEgreso} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-descripcion">Descripción *</Label>
                  <Input
                    id="edit-descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange("descripcion", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-monto">Monto *</Label>
                  <Input
                    id="edit-monto"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.monto}
                    onChange={(e) => handleInputChange("monto", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-categoria">Categoría *</Label>
                  <Select value={formData.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria: string) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-fecha">Fecha *</Label>
                  <Input
                    id="edit-fecha"
                    type="date"
                    value={formData.fecha_egreso}
                    onChange={(e) => handleInputChange("fecha_egreso", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-notas">Notas</Label>
                <Textarea
                  id="edit-notas"
                  value={formData.notas}
                  onChange={(e) => handleInputChange("notas", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogAbierto(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
