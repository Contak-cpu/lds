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
import { Plus, Search, Filter, DollarSign, TrendingDown, Calendar, Receipt, User, Eye } from "lucide-react"
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

// Función de validación para egresos
const validateEgresoForm = (formData: EgresoFormData): EgresoFormErrors => {
  const errors: EgresoFormErrors = {}

  // Validar descripción
  if (!formData.descripcion.trim()) {
    errors.descripcion = "La descripción es obligatoria"
  } else if (formData.descripcion.trim().length < 5) {
    errors.descripcion = "La descripción debe tener al menos 5 caracteres"
  }

  // Validar categoría
  if (!formData.categoria.trim()) {
    errors.categoria = "La categoría es obligatoria"
  }

  // Validar monto
  if (!formData.monto.trim()) {
    errors.monto = "El monto es obligatorio"
  } else if (!/^\d+(\.\d{1,2})?$/.test(formData.monto.trim())) {
    errors.monto = "El monto debe ser un número válido (máximo 2 decimales)"
  } else if (parseFloat(formData.monto) <= 0) {
    errors.monto = "El monto debe ser mayor a 0"
  }

  // Validar proveedor
  if (!formData.proveedor.trim()) {
    errors.proveedor = "El proveedor es obligatorio"
  } else if (formData.proveedor.trim().length < 2) {
    errors.proveedor = "El proveedor debe tener al menos 2 caracteres"
  }

  // Validar método de pago
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

  // Estado del formulario
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

  // Recargar datos cuando cambien los filtros de fechas
  useEffect(() => {
    cargarEgresos()
  }, [dateFilter.selectedQuickFilter, dateFilter.selectedRange])

  const cargarEgresos = async () => {
    try {
      // Obtener el rango de fechas del filtro
      const dateRange = dateFilter.getFilteredDateRange()
      
      // Obtener todos los egresos del servicio mock
      let egresosData = await mockDataService.getEgresos()
      
      // Aplicar filtro de fechas si está configurado
      if (dateRange?.from && dateRange?.to) {
        egresosData = egresosData.filter(egreso => {
          const fechaEgreso = new Date(egreso.fecha_egreso)
          // Verificar que las fechas sean válidas antes de comparar
          if (dateRange.from && dateRange.to) {
            return fechaEgreso >= dateRange.from && fechaEgreso <= dateRange.to
          }
          return true
        })
      }
      
      // Ordenar por fecha descendente
      egresosData.sort((a, b) => new Date(b.fecha_egreso).getTime() - new Date(a.fecha_egreso).getTime())
      
      setEgresos(egresosData)
    } catch (error) {
      console.error("Error cargando egresos:", error)
      showError("Error", "No se pudieron cargar los egresos")
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar egresos
  const egresosFiltrados = egresos.filter((egreso: Egreso) => {
    const coincideBusqueda =
      egreso.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      egreso.proveedor.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = filtroCategoria === "todos" || egreso.categoria === filtroCategoria
    return coincideBusqueda && coincideCategoria
  })

  // Calcular estadísticas
  const totalEgresos = egresos.reduce((sum: number, egreso: Egreso) => sum + (egreso.monto || 0), 0)
  const egresosMesActual = egresos.filter((egreso: Egreso) => {
    const fechaEgreso = new Date(egreso.fecha_egreso)
    const ahora = new Date()
    return fechaEgreso.getMonth() === ahora.getMonth() && fechaEgreso.getFullYear() === ahora.getFullYear()
  })
  const totalMesActual = egresosMesActual.reduce((sum: number, egreso: Egreso) => sum + (egreso.monto || 0), 0)
  
  // Calcular promedio diario (evitar división por cero)
  const promedioDiario = new Date().getDate() > 0 ? totalMesActual / new Date().getDate() : 0
  
  // Calcular mayor egreso (evitar array vacío)
  const mayorEgreso = egresos.length > 0 ? Math.max(...egresos.map((e: Egreso) => e.monto || 0)) : 0

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof EgresoFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleEditInputChange = (field: keyof EgresoFormData, value: string): void => {
    setEditFormData((prev) => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (editFormErrors[field]) {
      setEditFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleOpenDialog = () => {
    setDialogAbierto(true)
    // Limpiar errores previos
    setFormErrors({})
  }

  const handleOpenEditDialog = (egreso: Egreso) => {
    setEditandoEgreso(egreso)
    setEditFormData({
      descripcion: egreso.descripcion,
      categoria: egreso.categoria,
      monto: egreso.monto.toString(),
      proveedor: egreso.proveedor,
      metodo_pago: egreso.metodo_pago,
      notas: egreso.notas || "",
    })
    // Limpiar errores previos
    setEditFormErrors({})
    setDialogAbierto(true)
  }

  const agregarEgreso = async (): Promise<void> => {
    try {
      // Validar formulario
      const errors = validateEgresoForm(formData)
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        showError("Error de validación", "Por favor, corrige los errores en el formulario")
        return
      }

      // Limpiar errores previos
      setFormErrors({})

      // Crear nuevo egreso usando el servicio mock
      const newEgreso = await mockDataService.createEgreso({
        fecha_egreso: new Date().toISOString().split("T")[0],
        descripcion: formData.descripcion.trim(),
        categoria: formData.categoria,
        monto: Number.parseFloat(formData.monto),
        proveedor: formData.proveedor.trim(),
        metodo_pago: formData.metodo_pago,
        notas: formData.notas?.trim() || undefined,
      })

      // Actualizar la lista local
      setEgresos([newEgreso, ...egresos])

      // Limpiar formulario
      setFormData({
        descripcion: "",
        categoria: "",
        monto: "",
        proveedor: "",
        metodo_pago: "",
        notas: "",
      })

      // Cerrar diálogo
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
      // Actualizar egreso usando el servicio mock
      const updatedEgreso = await mockDataService.updateEgreso(editandoEgreso.id, {
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        monto: Number.parseFloat(formData.monto),
        proveedor: formData.proveedor,
        metodo_pago: formData.metodo_pago,
        notas: formData.notas,
      })

      if (updatedEgreso) {
        // Actualizar la lista local
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

  // Abrir diálogo de edición
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
      // Eliminar egreso usando el servicio mock
      const success = await mockDataService.deleteEgreso(id)

      if (success) {
        // Actualizar la lista local
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
        <div className="lg:ml-64 p-4 sm:p-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Cargando egresos...</p>
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
        <header className="bg-card border-b border-border shadow-sm px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Egresos</h1>
              <p className="text-muted-foreground">Gestiona todos los gastos del negocio</p>
            </div>

            <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleOpenDialog}
                  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Egreso
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={() => setDialogAbierto(false)} className="w-full sm:w-auto">
                    Cancelar
                  </Button>
                  <Button onClick={editandoEgreso ? editarEgreso : agregarEgreso} className="w-full sm:w-auto">
                    {editandoEgreso ? "Guardar Cambios" : "Agregar Egreso"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Filtro de fechas */}
        <div className="bg-muted/50 border-b border-border px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Filtrar por período:</h3>
              <DateFilter
                onDateRangeChange={dateFilter.setSelectedRange}
                onQuickFilterChange={dateFilter.setSelectedQuickFilter}
                selectedRange={dateFilter.selectedRange}
                selectedQuickFilter={dateFilter.selectedQuickFilter}
              />
            </div>
            {(() => {
              const range = dateFilter.getFilteredDateRange()
              return range?.from && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Período seleccionado:</span>{" "}
                  {range.from.toLocaleDateString("es-AR")}
                  {range.to && ` - ${range.to.toLocaleDateString("es-AR")}`}
                </div>
              )
            })()}
          </div>
        </div>

        {/* Indicador de filtro activo */}
        {(() => {
          const range = dateFilter.getFilteredDateRange()
          if (range?.from) {
            return (
              <div className="bg-green-50 border-b border-green-200 px-4 sm:px-6 py-2">
                <div className="max-w-7xl mx-auto">
                  <p className="text-sm text-green-700">
                    <span className="inline-block w-4 h-4 mr-1">📅</span>
                    Mostrando datos del período: <strong>
                      {dateFilter.selectedQuickFilter === "hoy" ? "Hoy" : 
                       dateFilter.selectedQuickFilter === "ayer" ? "Ayer" :
                       dateFilter.selectedQuickFilter === "semana" ? "Esta Semana" :
                       dateFilter.selectedQuickFilter === "mes" ? "Este Mes" :
                       dateFilter.selectedQuickFilter === "año" ? "Este Año" : 
                       dateFilter.selectedQuickFilter}</strong>
                    {range.from && (
                      <> desde {range.from.toLocaleDateString("es-AR")}
                      {range.to && <> hasta {range.to.toLocaleDateString("es-AR")}</>}</>
                    )}
                  </p>
                </div>
              </div>
            )
          }
          return null
        })()}

        <main className="p-4 sm:p-6">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Egresos</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ${totalEgresos.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">{egresos.length} registros</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Este Mes</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  ${totalMesActual.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">{egresosMesActual.length} egresos</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Promedio Diario</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ${promedioDiario.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Basado en el mes actual</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Mayor Egreso</CardTitle>
                <Receipt className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  ${mayorEgreso.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Registro más alto</p>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="mb-6 bg-card border-border shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por concepto o proveedor..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-10 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="sm:w-48">
                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Egresos */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-card-foreground">
                Lista de Egresos ({egresosFiltrados.length})
              </CardTitle>
              <CardDescription className="text-muted-foreground">Gestiona todos los gastos del negocio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {egresosFiltrados.map((egreso: Egreso) => (
                  <div
                    key={egreso.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors bg-card gap-4"
                  >
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-full shadow-sm flex-shrink-0">
                        <Receipt className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-1">
                          <h3 className="font-semibold text-card-foreground truncate">{egreso.descripcion}</h3>
                          <Badge variant="outline" className="flex-shrink-0">{egreso.categoria}</Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{egreso.proveedor}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span>{new Date(egreso.fecha_egreso).toLocaleDateString("es-AR")}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span>{egreso.metodo_pago}</span>
                          </div>
                          {egreso.notas && (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded truncate">
                                {egreso.notas}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                      <div className="text-right w-full sm:w-auto">
                        <div className="text-xl font-bold text-red-600 mb-1">
                          -${egreso.monto.toLocaleString("es-AR")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(egreso.fecha_egreso).toLocaleDateString("es-AR", { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent w-full sm:w-auto">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detalles del Egreso</DialogTitle>
                              <DialogDescription>Información completa del gasto</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Información del Egreso</Label>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Concepto:</span>
                                      <span className="text-sm font-medium">{egreso.descripcion}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Categoría:</span>
                                      <Badge variant="outline">{egreso.categoria}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Monto:</span>
                                      <span className="text-lg font-bold text-red-600">
                                        -${egreso.monto.toLocaleString("es-AR")}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Método de pago:</span>
                                      <span className="text-sm font-medium">{egreso.metodo_pago}</span>
                                    </div>
                                  </div>
                                </div>
                                {egreso.notas && (
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Notas</Label>
                                    <p className="text-sm text-card-foreground mt-1">{egreso.notas}</p>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Información Adicional</Label>
                                  <div className="mt-2 space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Proveedor:</span>
                                      <span className="text-sm font-medium">{egreso.proveedor}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">Fecha:</span>
                                      <span className="text-sm">{new Date(egreso.fecha_egreso).toLocaleDateString("es-AR")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">ID:</span>
                                      <span className="text-sm text-muted-foreground">{egreso.id}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm" onClick={() => abrirEdicion(egreso)} className="w-full sm:w-auto">
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => eliminarEgreso(egreso.id)}
                          className="border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 w-full sm:w-auto"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {egresosFiltrados.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium">No se encontraron egresos</p>
                    <p className="text-sm">No hay egresos que coincidan con los filtros aplicados</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
