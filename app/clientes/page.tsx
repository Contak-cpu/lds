"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, Phone, Mail, MapPin, ShoppingBag, Edit, Eye, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { createClient } from "@/lib/supabase/client"
import { useNotifications } from "@/hooks/use-notifications"

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
  estado: string
}

interface ClienteFormData {
  nombre: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  provincia: string
  codigo_postal: string
  notas: string
}

interface ClienteFormErrors {
  nombre?: string
  email?: string
  telefono?: string
  direccion?: string
  ciudad?: string
  provincia?: string
  codigo_postal?: string
  notas?: string
}

// Función de validación
const validateClienteForm = (formData: ClienteFormData): ClienteFormErrors => {
  const errors: ClienteFormErrors = {}

  // Validar nombre
  if (!formData.nombre.trim()) {
    errors.nombre = "El nombre es obligatorio"
  } else if (formData.nombre.trim().length < 2) {
    errors.nombre = "El nombre debe tener al menos 2 caracteres"
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre.trim())) {
    errors.nombre = "El nombre solo puede contener letras y espacios"
  }

  // Validar email
  if (!formData.email.trim()) {
    errors.email = "El email es obligatorio"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = "Formato de email inválido"
  }

  // Validar teléfono
  if (!formData.telefono.trim()) {
    errors.telefono = "El teléfono es obligatorio"
  } else if (!/^[\+]?[0-9\s\-\(\)]+$/.test(formData.telefono.trim())) {
    errors.telefono = "El teléfono solo puede contener números, espacios, guiones y paréntesis"
  } else if (formData.telefono.trim().replace(/[\s\-\(\)]/g, '').length < 8) {
    errors.telefono = "El teléfono debe tener al menos 8 dígitos"
  }

  // Validar dirección
  if (!formData.direccion.trim()) {
    errors.direccion = "La dirección es obligatoria"
  } else if (formData.direccion.trim().length < 5) {
    errors.direccion = "La dirección debe tener al menos 5 caracteres"
  }

  // Validar ciudad
  if (!formData.ciudad.trim()) {
    errors.ciudad = "La ciudad es obligatoria"
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.ciudad.trim())) {
    errors.ciudad = "La ciudad solo puede contener letras y espacios"
  }

  // Validar provincia
  if (!formData.provincia.trim()) {
    errors.provincia = "La provincia es obligatoria"
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.provincia.trim())) {
    errors.provincia = "La provincia solo puede contener letras y espacios"
  }

  // Validar código postal
  if (!formData.codigo_postal.trim()) {
    errors.codigo_postal = "El código postal es obligatorio"
  } else if (!/^\d{4,5}$/.test(formData.codigo_postal.trim())) {
    errors.codigo_postal = "El código postal debe tener 4 o 5 dígitos numéricos"
  }

  return errors
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("todos")
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [formErrors, setFormErrors] = useState<ClienteFormErrors>({})
  const [editFormErrors, setEditFormErrors] = useState<ClienteFormErrors>({})
  const { showError, showClienteCreated, showClienteUpdated, showClienteDeleted } = useNotifications()

  const [newClienteForm, setNewClienteForm] = useState<ClienteFormData>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    codigo_postal: "",
    notas: "",
  })

  const [editForm, setEditForm] = useState<ClienteFormData>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    codigo_postal: "",
    notas: "",
  })

  const supabase = createClient()

  const loadClientes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setClientes(data || [])
    } catch (error) {
      console.error("Error loading clientes:", error)
      showError("Error", "No se pudieron cargar los clientes")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCliente = async () => {
    try {
      // Validar formulario
      const errors = validateClienteForm(newClienteForm)
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        showError("Error de validación", "Por favor, corrige los errores en el formulario")
        return
      }

      // Limpiar errores previos
      setFormErrors({})

      const clienteData = {
        nombre: newClienteForm.nombre.trim(),
        email: newClienteForm.email.trim() || null,
        telefono: newClienteForm.telefono.trim() || null,
        direccion: newClienteForm.direccion.trim() || null,
        ciudad: newClienteForm.ciudad.trim() || null,
        provincia: newClienteForm.provincia.trim() || null,
        codigo_postal: newClienteForm.codigo_postal.trim() || null,
        notas: newClienteForm.notas.trim() || null,
        fecha_registro: new Date().toISOString(),
        estado: "Activo",
      }

      console.log("Datos del cliente a insertar:", clienteData)

      const { data, error } = await supabase
        .from("clientes")
        .insert([clienteData])
        .select()

      if (error) throw error

      if (data) {
        setClientes((prev: Cliente[]) => [data[0], ...prev])
        setNewClienteForm({
          nombre: "",
          email: "",
          telefono: "",
          direccion: "",
          ciudad: "",
          provincia: "",
          codigo_postal: "",
          notas: "",
        })
        setIsAddDialogOpen(false)
        showClienteCreated()
      }
    } catch (error) {
      console.error("Error adding cliente:", error)
      
      // Mostrar error más específico
      let errorMessage = "No se pudo agregar el cliente"
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as any).message)
      }
      
      showError("Error", errorMessage)
    }
  }

  const handleDeleteCliente = async (clienteId: string) => {
    try {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", clienteId)

      if (error) throw error

      setClientes((prev: Cliente[]) => prev.filter((c: Cliente) => c.id !== clienteId))
      setIsDeleteDialogOpen(false)
      setClienteToDelete(null)
      showClienteDeleted()
    } catch (error) {
      console.error("Error deleting cliente:", error)
      showError("Error", "No se pudo eliminar el cliente")
    }
  }

  const confirmDeleteCliente = (cliente: Cliente) => {
    setClienteToDelete(cliente)
    setIsDeleteDialogOpen(true)
  }

  useEffect(() => {
    loadClientes()
  }, [])

  const filteredClientes = clientes.filter((cliente: Cliente) => {
    const matchesSearch =
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getEstadoBadge = (estado: string) => {
    return estado === "Activo" ? (
      <Badge className="bg-green-100 text-green-800 border-green-300">Activo</Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    )
  }

  const handleEditFormChange = (field: string, value: string): void => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (editFormErrors[field as keyof ClienteFormErrors]) {
      setEditFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleNewClienteFormChange = (field: string, value: string): void => {
    setNewClienteForm((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[field as keyof ClienteFormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setEditForm({
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      ciudad: cliente.ciudad,
      provincia: cliente.provincia,
      codigo_postal: cliente.codigo_postal,
      notas: cliente.notas,
    })
    // Limpiar errores previos
    setEditFormErrors({})
    setIsEditDialogOpen(true)
  }

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true)
    // Limpiar errores previos
    setFormErrors({})
  }

  const handleSaveEdit = async () => {
    if (!editingCliente) return

    try {
      // Validar formulario de edición
      const errors = validateClienteForm(editForm)
      
      if (Object.keys(errors).length > 0) {
        setEditFormErrors(errors)
        showError("Error de validación", "Por favor, corrige los errores en el formulario")
        return
      }

      // Limpiar errores previos
      setEditFormErrors({})

      const { data, error } = await supabase.from("clientes").update(editForm).eq("id", editingCliente.id).select()

      if (error) throw error

      if (data) {
        setClientes((prev: Cliente[]) =>
          prev.map((cliente: Cliente) => (cliente.id === editingCliente.id ? data[0] : cliente)),
        )
        setIsEditDialogOpen(false)
        setEditingCliente(null)
        showClienteUpdated()
      }
    } catch (error) {
      console.error("Error updating cliente:", error)
      showError("Error", "No se pudieron guardar los cambios")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando clientes...</p>
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
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-card-foreground">Gestión de Clientes</h1>
                  <p className="text-sm text-blue-600">Administra tu base de clientes</p>
                </div>
              </div>
              <Button onClick={handleOpenAddDialog} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Cliente
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Clientes</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{clientes.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Activos</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {filteredClientes.filter((c: Cliente) => c.estado === "Activo").length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Nuevos Este Mes</CardTitle>
                <ShoppingBag className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {
                    clientes.filter((c: Cliente) => {
                      const fechaRegistro = new Date(c.fecha_registro)
                      const ahora = new Date()
                      return (
                        fechaRegistro.getMonth() === ahora.getMonth() &&
                        fechaRegistro.getFullYear() === ahora.getFullYear()
                      )
                    }).length
                  }
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Registrados Hoy</CardTitle>
                <ShoppingBag className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  {
                    clientes.filter((c: Cliente) => {
                      const fechaRegistro = new Date(c.fecha_registro)
                      const hoy = new Date()
                      return fechaRegistro.toDateString() === hoy.toDateString()
                    }).length
                  }
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
                      placeholder="Buscar por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clients List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-card-foreground">
                Lista de Clientes ({filteredClientes.length})
              </CardTitle>
              <CardDescription>Gestiona la información de tus clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClientes.map((cliente: Cliente) => (
                  <div
                    key={cliente.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-card-foreground">{cliente.nombre}</h3>
                          {getEstadoBadge(cliente.estado)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{cliente.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{cliente.telefono}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {cliente.ciudad}, {cliente.provincia}
                            </span>
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
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalles del Cliente</DialogTitle>
                            <DialogDescription>Información completa de {cliente.nombre}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Información Personal</Label>
                                <div className="mt-2 space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{cliente.email}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{cliente.telefono}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{cliente.direccion}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Notas</Label>
                                <p className="text-sm text-card-foreground mt-1">{cliente.notas}</p>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Información Comercial</Label>
                                <div className="mt-2 space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Estado:</span>
                                    {getEstadoBadge(cliente.estado)}
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Registro:</span>
                                    <span className="text-sm">{cliente.fecha_registro}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Ciudad:</span>
                                    <span className="text-sm">{cliente.ciudad}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Provincia:</span>
                                    <span className="text-sm">{cliente.provincia}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => handleEditCliente(cliente)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => confirmDeleteCliente(cliente)}>
                        <Trash className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Client Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nuevo Cliente</DialogTitle>
                <DialogDescription>Añade un nuevo cliente a tu base de datos</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <Input
                      id="nombre"
                                              placeholder="Nombre completo"
                      value={newClienteForm.nombre}
                      onChange={(e) => handleNewClienteFormChange("nombre", e.target.value)}
                    />
                    {formErrors.nombre && <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                                              placeholder="Email del cliente"
                      value={newClienteForm.email}
                      onChange={(e) => handleNewClienteFormChange("email", e.target.value)}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      placeholder="+54 11 1234-5678"
                      value={newClienteForm.telefono}
                      onChange={(e) => handleNewClienteFormChange("telefono", e.target.value)}
                    />
                    {formErrors.telefono && <p className="text-red-500 text-xs mt-1">{formErrors.telefono}</p>}
                  </div>
                  <div>
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                      id="ciudad"
                      placeholder="Ciudad"
                      value={newClienteForm.ciudad}
                      onChange={(e) => handleNewClienteFormChange("ciudad", e.target.value)}
                    />
                    {formErrors.ciudad && <p className="text-red-500 text-xs mt-1">{formErrors.ciudad}</p>}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Textarea
                      id="direccion"
                                              placeholder="Dirección completa"
                      value={newClienteForm.direccion}
                      onChange={(e) => handleNewClienteFormChange("direccion", e.target.value)}
                    />
                    {formErrors.direccion && <p className="text-red-500 text-xs mt-1">{formErrors.direccion}</p>}
                  </div>
                  <div>
                    <Label htmlFor="provincia">Provincia</Label>
                    <Input
                      id="provincia"
                      placeholder="Provincia"
                      value={newClienteForm.provincia}
                      onChange={(e) => handleNewClienteFormChange("provincia", e.target.value)}
                    />
                    {formErrors.provincia && <p className="text-red-500 text-xs mt-1">{formErrors.provincia}</p>}
                  </div>
                  <div>
                    <Label htmlFor="codigo_postal">Código Postal</Label>
                    <Input
                      id="codigo_postal"
                      placeholder="1000"
                      value={newClienteForm.codigo_postal}
                      onChange={(e) => handleNewClienteFormChange("codigo_postal", e.target.value)}
                    />
                    {formErrors.codigo_postal && <p className="text-red-500 text-xs mt-1">{formErrors.codigo_postal}</p>}
                  </div>
                  <div>
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea
                      id="notas"
                      placeholder="Información adicional sobre el cliente"
                      value={newClienteForm.notas}
                      onChange={(e) => handleNewClienteFormChange("notas", e.target.value)}
                    />
                    {formErrors.notas && <p className="text-red-500 text-xs mt-1">{formErrors.notas}</p>}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddCliente}>
                  Guardar Cliente
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Client Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Cliente</DialogTitle>
                <DialogDescription>Modifica la información de {editingCliente?.nombre}</DialogDescription>
              </DialogHeader>
              {editingCliente && (
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-nombre">Nombre completo</Label>
                      <Input
                        id="edit-nombre"
                        value={editForm.nombre}
                        onChange={(e) => handleEditFormChange("nombre", e.target.value)}
                      />
                      {editFormErrors.nombre && <p className="text-red-500 text-xs mt-1">{editFormErrors.nombre}</p>}
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleEditFormChange("email", e.target.value)}
                      />
                      {editFormErrors.email && <p className="text-red-500 text-xs mt-1">{editFormErrors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="edit-telefono">Teléfono</Label>
                      <Input
                        id="edit-telefono"
                        value={editForm.telefono}
                        onChange={(e) => handleEditFormChange("telefono", e.target.value)}
                      />
                      {editFormErrors.telefono && <p className="text-red-500 text-xs mt-1">{editFormErrors.telefono}</p>}
                    </div>
                    <div>
                      <Label htmlFor="edit-ciudad">Ciudad</Label>
                      <Input
                        id="edit-ciudad"
                        value={editForm.ciudad}
                        onChange={(e) => handleEditFormChange("ciudad", e.target.value)}
                      />
                      {editFormErrors.ciudad && <p className="text-red-500 text-xs mt-1">{editFormErrors.ciudad}</p>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-direccion">Dirección</Label>
                      <Textarea
                        id="edit-direccion"
                        value={editForm.direccion}
                        onChange={(e) => handleEditFormChange("direccion", e.target.value)}
                      />
                      {editFormErrors.direccion && <p className="text-red-500 text-xs mt-1">{editFormErrors.direccion}</p>}
                    </div>
                    <div>
                      <Label htmlFor="edit-provincia">Provincia</Label>
                      <Input
                        id="edit-provincia"
                        value={editForm.provincia}
                        onChange={(e) => handleEditFormChange("provincia", e.target.value)}
                      />
                      {editFormErrors.provincia && <p className="text-red-500 text-xs mt-1">{editFormErrors.provincia}</p>}
                    </div>
                    <div>
                      <Label htmlFor="edit-codigo_postal">Código Postal</Label>
                      <Input
                        id="edit-codigo_postal"
                        value={editForm.codigo_postal}
                        onChange={(e) => handleEditFormChange("codigo_postal", e.target.value)}
                      />
                      {editFormErrors.codigo_postal && <p className="text-red-500 text-xs mt-1">{editFormErrors.codigo_postal}</p>}
                    </div>
                    <div>
                      <Label htmlFor="edit-notas">Notas</Label>
                      <Textarea
                        id="edit-notas"
                        value={editForm.notas}
                        onChange={(e) => handleEditFormChange("notas", e.target.value)}
                      />
                      {editFormErrors.notas && <p className="text-red-500 text-xs mt-1">{editFormErrors.notas}</p>}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveEdit}>
                  Guardar Cambios
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que quieres eliminar al cliente "{clienteToDelete?.nombre}"? 
                  Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => clienteToDelete && handleDeleteCliente(clienteToDelete.id)}
                >
                  Eliminar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
