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
import { Plus, Search, Filter, DollarSign, TrendingDown, Calendar, Receipt } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

interface Egreso {
  id: string
  fecha_egreso: string
  descripcion: string
  categoria: string
  monto: number
  proveedor: string
  metodo_pago: string
  notas: string
  comprobante_url?: string
  created_at?: string
  updated_at?: string
}

interface EgresoFormData {
  descripcion: string
  categoria: string
  monto: string
  proveedor: string
  metodo_pago: string
  notas: string
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
  const [editandoEgreso, setEditandoEgreso] = useState<Egreso | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Estado del formulario
  const [formData, setFormData] = useState<EgresoFormData>({
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

  const cargarEgresos = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("egresos").select("*").order("fecha_egreso", { ascending: false })

      if (error) throw error

      setEgresos(data || [])
    } catch (error) {
      console.error("Error cargando egresos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los egresos",
        variant: "destructive",
      })
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
  const totalEgresos = egresos.reduce((sum: number, egreso: Egreso) => sum + egreso.monto, 0)
  const egresosMesActual = egresos.filter((egreso: Egreso) => {
    const fechaEgreso = new Date(egreso.fecha_egreso)
    const ahora = new Date()
    return fechaEgreso.getMonth() === ahora.getMonth() && fechaEgreso.getFullYear() === ahora.getFullYear()
  })
  const totalMesActual = egresosMesActual.reduce((sum: number, egreso: Egreso) => sum + egreso.monto, 0)

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof EgresoFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const agregarEgreso = async (): Promise<void> => {
    if (
      !formData.descripcion ||
      !formData.categoria ||
      !formData.monto ||
      !formData.proveedor ||
      !formData.metodo_pago
    ) {
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
        .from("egresos")
        .insert([
          {
            fecha_egreso: new Date().toISOString().split("T")[0],
            descripcion: formData.descripcion,
            categoria: formData.categoria,
            monto: Number.parseFloat(formData.monto),
            proveedor: formData.proveedor,
            metodo_pago: formData.metodo_pago,
            notas: formData.notas,
          },
        ])
        .select()

      if (error) throw error

      // Actualizar la lista local
      if (data && data[0]) {
        setEgresos([data[0], ...egresos])
      }

      // Limpiar formulario
      setFormData({
        descripcion: "",
        categoria: "",
        monto: "",
        proveedor: "",
        metodo_pago: "",
        notas: "",
      })

      setDialogAbierto(false)
      toast({
        title: "Egreso agregado",
        description: "El egreso se registró correctamente",
      })
    } catch (error) {
      console.error("Error agregando egreso:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el egreso",
        variant: "destructive",
      })
    }
  }

  const editarEgreso = async (): Promise<void> => {
    if (!editandoEgreso) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("egresos")
        .update({
          descripcion: formData.descripcion,
          categoria: formData.categoria,
          monto: Number.parseFloat(formData.monto),
          proveedor: formData.proveedor,
          metodo_pago: formData.metodo_pago,
          notas: formData.notas,
        })
        .eq("id", editandoEgreso.id)
        .select()

      if (error) throw error

      // Actualizar la lista local
      if (data && data[0]) {
        setEgresos(egresos.map((egreso: Egreso) => (egreso.id === editandoEgreso.id ? data[0] : egreso)))
      }

      setEditandoEgreso(null)
      setDialogAbierto(false)
      toast({
        title: "Egreso actualizado",
        description: "Los cambios se guardaron correctamente",
      })
    } catch (error) {
      console.error("Error editando egreso:", error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      })
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
      notas: egreso.notas,
    })
    setDialogAbierto(true)
  }

  const eliminarEgreso = async (id: string): Promise<void> => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("egresos").delete().eq("id", id)

      if (error) throw error

      // Actualizar la lista local
      setEgresos(egresos.filter((egreso: Egreso) => egreso.id !== id))

      toast({
        title: "Egreso eliminado",
        description: "El egreso se eliminó correctamente",
      })
    } catch (error) {
      console.error("Error eliminando egreso:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el egreso",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando egresos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Egresos</h1>
              <p className="text-gray-600">Gestiona todos los gastos del negocio</p>
            </div>

            <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditandoEgreso(null)
                    setFormData({
                      descripcion: "",
                      categoria: "",
                      monto: "",
                      proveedor: "",
                      metodo_pago: "",
                      notas: "",
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Egreso
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md">
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
                      placeholder="Ej: Compra de productos"
                    />
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
                  </div>

                  <div>
                    <Label htmlFor="proveedor">Proveedor/Destinatario *</Label>
                    <Input
                      id="proveedor"
                      value={formData.proveedor}
                      onChange={(e) => handleInputChange("proveedor", e.target.value)}
                      placeholder="Nombre del proveedor"
                    />
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
        </header>

        <main className="flex-1 overflow-auto p-6">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Egresos</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${totalEgresos.toLocaleString("es-AR")}</div>
                <p className="text-xs text-gray-600">{egresos.length} registros</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">${totalMesActual.toLocaleString("es-AR")}</div>
                <p className="text-xs text-gray-600">{egresosMesActual.length} egresos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promedio Diario</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ${Math.round(totalMesActual / new Date().getDate()).toLocaleString("es-AR")}
                </div>
                <p className="text-xs text-gray-600">Basado en el mes actual</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mayor Egreso</CardTitle>
                <Receipt className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  ${Math.max(...egresos.map((e: Egreso) => e.monto), 0).toLocaleString("es-AR")}
                </div>
                <p className="text-xs text-gray-600">Registro más alto</p>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por concepto o proveedor..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-10"
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
          <Card>
            <CardHeader>
              <CardTitle>Registro de Egresos</CardTitle>
              <CardDescription>
                {egresosFiltrados.length} de {egresos.length} egresos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {egresosFiltrados.map((egreso: Egreso) => (
                  <div
                    key={egreso.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{egreso.descripcion}</h3>
                        <Badge variant="outline">{egreso.categoria}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <strong>Proveedor:</strong> {egreso.proveedor}
                        </p>
                        <p>
                          <strong>Fecha:</strong> {new Date(egreso.fecha_egreso).toLocaleDateString("es-AR")}
                        </p>
                        <p>
                          <strong>Método:</strong> {egreso.metodo_pago}
                        </p>
                        {egreso.notas && (
                          <p>
                            <strong>Descripción:</strong> {egreso.notas}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-red-600 mb-2">
                        -${egreso.monto.toLocaleString("es-AR")}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => abrirEdicion(egreso)}>
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => eliminarEgreso(egreso.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {egresosFiltrados.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron egresos que coincidan con los filtros
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
