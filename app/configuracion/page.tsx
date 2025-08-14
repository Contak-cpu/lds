"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import {
  Settings,
  Store,
  Bell,
  Shield,
  Mail,
  Phone,
  MapPin,
  Save,
  User,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

export default function ConfiguracionPage() {
  const { toast } = useToast()
  const [hasChanges, setHasChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const supabase = createClient()

  const [configuracion, setConfiguracion] = useState({
    // Información del negocio
    nombreNegocio: "",
    direccion: "",
    telefono: "",
    email: "",
    cuit: "",
    descripcion: "",

    // Configuración de ventas
    moneda: "ARS",
    iva: "21",
    descuentoMaximo: "15",
    stockMinimo: "5",

    // Notificaciones
    notificarStockBajo: true,
    notificarNuevasVentas: true,
    notificarNuevosClientes: false,
    emailNotificaciones: true,

    // Configuración del sistema
    backupAutomatico: true,
    modoMantenimiento: false,
    registroActividad: true,
  })

  const [configuracionOriginal, setConfiguracionOriginal] = useState(configuracion)

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const { data, error } = await supabase.from("configuracion").select("clave, valor")

        if (error) {
          console.error("Error cargando configuración:", error)
          toast({
            title: "Error al cargar configuración",
            description: "Se usarán valores por defecto.",
            variant: "destructive",
          })
          return
        }

        if (data && data.length > 0) {
          const configCompleta = { ...configuracion }

          data.forEach((item) => {
            const valores = item.valor
            Object.assign(configCompleta, valores)
          })

          setConfiguracion(configCompleta)
          setConfiguracionOriginal(configCompleta)
        }
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error de conexión",
          description: "No se pudo cargar la configuración.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    cargarConfiguracion()
  }, [])

  useEffect(() => {
    const hayDiferencias = JSON.stringify(configuracion) !== JSON.stringify(configuracionOriginal)
    setHasChanges(hayDiferencias)
  }, [configuracion, configuracionOriginal])

  const handleInputChange = (campo: string, valor: string | boolean) => {
    setConfiguracion((prev) => ({
      ...prev,
      [campo]: valor,
    }))
  }

  const guardarConfiguracion = async () => {
    setIsLoading(true)

    // Validaciones
    if (!configuracion.nombreNegocio.trim()) {
      toast({
        title: "Error de validación",
        description: "El nombre del negocio es obligatorio.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!configuracion.email.includes("@")) {
      toast({
        title: "Error de validación",
        description: "El email no tiene un formato válido.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Preparar datos para Supabase
      const updates = [
        {
          clave: "negocio",
          valor: {
            nombreNegocio: configuracion.nombreNegocio,
            direccion: configuracion.direccion,
            telefono: configuracion.telefono,
            email: configuracion.email,
            cuit: configuracion.cuit,
            descripcion: configuracion.descripcion,
          },
        },
        {
          clave: "ventas",
          valor: {
            moneda: configuracion.moneda,
            iva: configuracion.iva,
            descuentoMaximo: configuracion.descuentoMaximo,
            stockMinimo: configuracion.stockMinimo,
          },
        },
        {
          clave: "notificaciones",
          valor: {
            notificarStockBajo: configuracion.notificarStockBajo,
            notificarNuevasVentas: configuracion.notificarNuevasVentas,
            notificarNuevosClientes: configuracion.notificarNuevosClientes,
            emailNotificaciones: configuracion.emailNotificaciones,
          },
        },
        {
          clave: "sistema",
          valor: {
            backupAutomatico: configuracion.backupAutomatico,
            modoMantenimiento: configuracion.modoMantenimiento,
            registroActividad: configuracion.registroActividad,
          },
        },
      ]

      for (const update of updates) {
        const { error } = await supabase.from("configuracion").upsert(
          {
            clave: update.clave,
            valor: update.valor,
          },
          {
            onConflict: "clave",
          },
        )

        if (error) {
          throw error
        }
      }

      setConfiguracionOriginal(configuracion)
      setHasChanges(false)

      toast({
        title: "Configuración guardada",
        description: "Los cambios se han aplicado correctamente.",
      })
    } catch (error) {
      console.error("Error guardando configuración:", error)
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetearConfiguracion = () => {
    const configDefault = {
      nombreNegocio: "GrowShop Buenos Aires",
      direccion: "Av. Corrientes 1234, CABA",
      telefono: "+54 11 4567-8900",
      email: "info@growshopba.com.ar",
      cuit: "20-12345678-9",
      descripcion: "Especialistas en cultivo indoor y outdoor. Productos de calidad para cultivadores.",
      moneda: "ARS",
      iva: "21",
      descuentoMaximo: "15",
      stockMinimo: "5",
      notificarStockBajo: true,
      notificarNuevasVentas: true,
      notificarNuevosClientes: false,
      emailNotificaciones: true,
      backupAutomatico: true,
      modoMantenimiento: false,
      registroActividad: true,
    }

    setConfiguracion(configDefault)
    toast({
      title: "Configuración restablecida",
      description: "Se han restaurado los valores por defecto.",
    })
  }

  const exportarConfiguracion = () => {
    const dataStr = JSON.stringify(configuracion, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "growshop-config.json"
    link.click()

    toast({
      title: "Configuración exportada",
      description: "El archivo se ha descargado correctamente.",
    })
  }

  const importarConfiguracion = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string)
        setConfiguracion(config)
        toast({
          title: "Configuración importada",
          description: "Los datos se han cargado correctamente.",
        })
      } catch (error) {
        toast({
          title: "Error al importar",
          description: "El archivo no tiene un formato válido.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  if (isLoadingData) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando configuración...</p>
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
                <Settings className="h-6 w-6 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Configuración</h1>
                  <p className="text-sm text-green-600">Personaliza tu CRM de growshop</p>
                </div>
                {hasChanges && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Cambios sin guardar
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={resetearConfiguracion}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Resetear
                </Button>
                <Button variant="outline" onClick={exportarConfiguracion}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <label className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Importar
                    </span>
                  </Button>
                  <input type="file" accept=".json" onChange={importarConfiguracion} className="hidden" />
                </label>
                <Button
                  onClick={guardarConfiguracion}
                  disabled={!hasChanges || isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información del Negocio */}
            <Card className="lg:col-span-2 bg-white border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Store className="h-5 w-5 text-green-600" />
                  <span>Información del Negocio</span>
                </CardTitle>
                <CardDescription>Datos básicos de tu growshop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombreNegocio">Nombre del Negocio *</Label>
                    <Input
                      id="nombreNegocio"
                      value={configuracion.nombreNegocio}
                      onChange={(e) => handleInputChange("nombreNegocio", e.target.value)}
                      className={!configuracion.nombreNegocio.trim() ? "border-red-300" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cuit">CUIT</Label>
                    <Input
                      id="cuit"
                      value={configuracion.cuit}
                      onChange={(e) => handleInputChange("cuit", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="direccion"
                      className="pl-10"
                      value={configuracion.direccion}
                      onChange={(e) => handleInputChange("direccion", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="telefono"
                        className="pl-10"
                        value={configuracion.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        className={`pl-10 ${!configuracion.email.includes("@") ? "border-red-300" : ""}`}
                        value={configuracion.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción del Negocio</Label>
                  <Textarea
                    id="descripcion"
                    rows={3}
                    value={configuracion.descripcion}
                    onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configuración de Ventas */}
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Configuración de Ventas</span>
                </CardTitle>
                <CardDescription>Parámetros comerciales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="moneda">Moneda</Label>
                  <Select value={configuracion.moneda} onValueChange={(value) => handleInputChange("moneda", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARS">Peso Argentino (ARS)</SelectItem>
                      <SelectItem value="USD">Dólar (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="iva">IVA (%)</Label>
                  <Input
                    id="iva"
                    type="number"
                    min="0"
                    max="100"
                    value={configuracion.iva}
                    onChange={(e) => handleInputChange("iva", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="descuentoMaximo">Descuento Máximo (%)</Label>
                  <Input
                    id="descuentoMaximo"
                    type="number"
                    min="0"
                    max="100"
                    value={configuracion.descuentoMaximo}
                    onChange={(e) => handleInputChange("descuentoMaximo", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="stockMinimo">Stock Mínimo (unidades)</Label>
                  <Input
                    id="stockMinimo"
                    type="number"
                    min="0"
                    value={configuracion.stockMinimo}
                    onChange={(e) => handleInputChange("stockMinimo", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notificaciones */}
            <Card className="lg:col-span-2 bg-white border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-amber-600" />
                  <span>Notificaciones</span>
                </CardTitle>
                <CardDescription>Configura las alertas del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notificarStockBajo">Notificar Stock Bajo</Label>
                    <p className="text-sm text-gray-500">Recibe alertas cuando el stock esté por debajo del mínimo</p>
                  </div>
                  <Switch
                    id="notificarStockBajo"
                    checked={configuracion.notificarStockBajo}
                    onCheckedChange={(checked) => handleInputChange("notificarStockBajo", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notificarNuevasVentas">Notificar Nuevas Ventas</Label>
                    <p className="text-sm text-gray-500">Recibe alertas por cada nueva venta realizada</p>
                  </div>
                  <Switch
                    id="notificarNuevasVentas"
                    checked={configuracion.notificarNuevasVentas}
                    onCheckedChange={(checked) => handleInputChange("notificarNuevasVentas", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notificarNuevosClientes">Notificar Nuevos Clientes</Label>
                    <p className="text-sm text-gray-500">Recibe alertas cuando se registre un nuevo cliente</p>
                  </div>
                  <Switch
                    id="notificarNuevosClientes"
                    checked={configuracion.notificarNuevosClientes}
                    onCheckedChange={(checked) => handleInputChange("notificarNuevosClientes", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotificaciones">Notificaciones por Email</Label>
                    <p className="text-sm text-gray-500">Enviar notificaciones también por correo electrónico</p>
                  </div>
                  <Switch
                    id="emailNotificaciones"
                    checked={configuracion.emailNotificaciones}
                    onCheckedChange={(checked) => handleInputChange("emailNotificaciones", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Configuración del Sistema */}
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span>Sistema</span>
                </CardTitle>
                <CardDescription>Configuración avanzada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="backupAutomatico">Backup Automático</Label>
                    <p className="text-sm text-gray-500">Respaldo diario de datos</p>
                  </div>
                  <Switch
                    id="backupAutomatico"
                    checked={configuracion.backupAutomatico}
                    onCheckedChange={(checked) => handleInputChange("backupAutomatico", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registroActividad">Registro de Actividad</Label>
                    <p className="text-sm text-gray-500">Guardar log de acciones</p>
                  </div>
                  <Switch
                    id="registroActividad"
                    checked={configuracion.registroActividad}
                    onCheckedChange={(checked) => handleInputChange("registroActividad", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="modoMantenimiento">Modo Mantenimiento</Label>
                    <p className="text-sm text-gray-500">Desactivar temporalmente</p>
                  </div>
                  <Switch
                    id="modoMantenimiento"
                    checked={configuracion.modoMantenimiento}
                    onCheckedChange={(checked) => handleInputChange("modoMantenimiento", checked)}
                  />
                </div>

                {configuracion.modoMantenimiento && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                        Mantenimiento Activo
                      </Badge>
                    </div>
                    <p className="text-sm text-amber-700 mt-1">
                      El sistema está en modo mantenimiento. Los usuarios no podrán acceder.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
