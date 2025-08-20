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

// Datos mock por defecto
const clientesMock: Cliente[] = [
  {
    id: "1",
    nombre: "Juan Pérez",
    email: "juan.perez@email.com",
    telefono: "+54 11 1234-5678",
    direccion: "Av. Corrientes 1234",
    ciudad: "Buenos Aires",
    provincia: "Buenos Aires",
    codigo_postal: "1043",
    fecha_registro: new Date().toISOString(),
    notas: "Cliente frecuente, prefiere productos orgánicos",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estado: "Activo",
  },
  {
    id: "2",
    nombre: "María González",
    email: "maria.gonzalez@email.com",
    telefono: "+54 11 9876-5432",
    direccion: "Calle Florida 567",
    ciudad: "Buenos Aires",
    provincia: "Buenos Aires",
    codigo_postal: "1005",
    fecha_registro: new Date().toISOString(),
    notas: "Interesada en sistemas de iluminación LED",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estado: "Activo",
  },
  {
    id: "3",
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    telefono: "+54 11 5555-1234",
    direccion: "Rivadavia 890",
    ciudad: "Buenos Aires",
    provincia: "Buenos Aires",
    codigo_postal: "1033",
    fecha_registro: new Date().toISOString(),
    notas: "Cultivador experto, busca semillas premium",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estado: "Activo",
  },
]

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
  } else if (!/^[0-9]+$/.test(formData.codigo_postal.trim())) {
    errors.codigo_postal = "El código postal solo puede contener números"
  } else if (formData.codigo_postal.trim().length < 4) {
    errors.codigo_postal = "El código postal debe tener al menos 4 dígitos"
  }

  return errors
}

export default function ClientesPage() {
  const { showError, showSuccess } = useNotifications()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [viewingCliente, setViewingCliente] = useState<Cliente | null>(null)
  const [formErrors, setFormErrors] = useState<ClienteFormErrors>({})
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

  const loadClientes = async () => {
    try {
      setLoading(true)

      // Cargar clientes desde localStorage (modo mock)
      const clientesMock = [
        {
          id: "1",
          nombre: "Juan Pérez",
          email: "juan@email.com",
          telefono: "+54 11 1234-5678",
          direccion: "Av. Corrientes 1234",
          ciudad: "Buenos Aires",
          provincia: "CABA",
          codigo_postal: "C1043AAZ",
          fecha_registro: "2024-01-15",
          notas: "Cliente frecuente",
          estado: "activo",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z"
        },
        {
          id: "2", 
          nombre: "María González",
          email: "maria@email.com",
          telefono: "+54 11 9876-5432",
          direccion: "Av. Santa Fe 5678",
          ciudad: "Buenos Aires",
          provincia: "CABA",
          codigo_postal: "C1425FOD",
          fecha_registro: "2024-01-10",
          notas: "Prefiere zapatillas deportivas",
          estado: "activo",
          created_at: "2024-01-10T14:30:00Z",
          updated_at: "2024-01-10T14:30:00Z"
        }
      ]

      const clientesGuardados = localStorage.getItem('clientes-sneakers')
      const clientesData = clientesGuardados ? JSON.parse(clientesGuardados) : clientesMock

      setClientes(clientesData)
 main
    } catch (error) {
      console.error("Error loading clientes:", error)
      showError("Error al cargar clientes")
      // En caso de error, usar datos mock
      setClientes(clientesMock)
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
        id: Date.now().toString(),
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log("Datos del cliente a insertar:", clienteData)


      // Crear cliente (modo mock)
      const nuevoCliente = {
        id: Date.now().toString(),
        ...clienteData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Guardar en localStorage y actualizar estado
      const clientesActualizados = [nuevoCliente, ...clientes]
      localStorage.setItem('clientes-sneakers', JSON.stringify(clientesActualizados))
      setClientes(clientesActualizados)
      
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

      // Eliminar cliente (modo mock)
      const clientesActualizados = clientes.filter(c => c.id !== clienteId)
      localStorage.setItem('clientes-sneakers', JSON.stringify(clientesActualizados))
      setClientes(clientesActualizados)
      setIsDeleteDialogOpen(false)
      setClienteToDelete(null)
      showClienteDeleted()

    } catch (error) {
      console.error("Error deleting cliente:", error)
      showError("Error", "No se pudo eliminar el cliente")
    }
  }

  const handleEditCliente = async () => {
    if (!editingCliente) return

    try {
      // Validar formulario
      const errors = validateClienteForm(editForm)
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        showError("Error de validación", "Por favor, corrige los errores en el formulario")
        return
      }

      // Limpiar errores previos
      setFormErrors({})

      const clienteActualizado = {
        ...editingCliente,
        nombre: editForm.nombre.trim(),
        email: editForm.email.trim() || null,
        telefono: editForm.telefono.trim() || null,
        direccion: editForm.direccion.trim() || null,
        ciudad: editForm.ciudad.trim() || null,
        provincia: editForm.provincia.trim() || null,
        codigo_postal: editForm.codigo_postal.trim() || null,
        notas: editForm.notas.trim() || null,
        updated_at: new Date().toISOString(),
      }

      // Actualizar localStorage
      const clientesActuales = JSON.parse(localStorage.getItem('crm-clientes') || '[]')
      const clientesActualizados = clientesActuales.map((cliente: Cliente) => 
        cliente.id === editingCliente.id ? clienteActualizado : cliente
      )
      localStorage.setItem('crm-clientes', JSON.stringify(clientesActualizados))

      // Actualizar el estado local
      setClientes(clientesActualizados)
      setEditingCliente(null)
      setIsEditDialogOpen(false)

      showSuccess("Cliente actualizado correctamente")
    } catch (error) {
      console.error("Error updating cliente:", error)
      showError("Error", "No se pudo actualizar el cliente")
    }
  }

  const openEditDialog = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setEditForm({
      nombre: cliente.nombre,
      email: cliente.email || "",
      telefono: cliente.telefono || "",
      direccion: cliente.direccion || "",
      ciudad: cliente.ciudad || "",
      provincia: cliente.provincia || "",
      codigo_postal: cliente.codigo_postal || "",
      notas: cliente.notas || "",
    })
    setFormErrors({})
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (cliente: Cliente) => {
    setViewingCliente(cliente)
    setIsViewDialogOpen(true)
  }

  const closeEditDialog = () => {
    setEditingCliente(null)
    setEditForm({
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      provincia: "",
      codigo_postal: "",
      notas: "",
    })
    setFormErrors({})
    setIsEditDialogOpen(false)
  }


      // Actualizar cliente (modo mock)
      const clienteActualizado = {
        ...editingCliente,
        ...editForm,
        updated_at: new Date().toISOString()
      }

      // Guardar en localStorage y actualizar estado
      const clientesActualizados = clientes.map(cliente => 
        cliente.id === editingCliente.id ? clienteActualizado : cliente
      )
      localStorage.setItem('clientes-sneakers', JSON.stringify(clientesActualizados))
      setClientes(clientesActualizados)
      setIsEditDialogOpen(false)
      setEditingCliente(null)
      showClienteUpdated()
    } catch (error) {
      console.error("Error updating cliente:", error)
      showError("Error", "No se pudieron guardar los cambios")
    }
  }
 main

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Cargando clientes...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">
              Gestiona tu base de datos de clientes
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                <DialogDescription>
                  Completa la información del nuevo cliente
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      value={newClienteForm.nombre}
                      onChange={(e) => setNewClienteForm({ ...newClienteForm, nombre: e.target.value })}
                      className={formErrors.nombre ? "border-red-500" : ""}
                      placeholder="Nombre completo"
                    />
                    {formErrors.nombre && (
                      <p className="text-sm text-red-500">{formErrors.nombre}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newClienteForm.email}
                      onChange={(e) => setNewClienteForm({ ...newClienteForm, email: e.target.value })}
                      className={formErrors.email ? "border-red-500" : ""}
                      placeholder="email@ejemplo.com"
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-500">{formErrors.email}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono *</Label>
                    <Input
                      id="telefono"
                      value={newClienteForm.telefono}
                      onChange={(e) => setNewClienteForm({ ...newClienteForm, telefono: e.target.value })}
                      className={formErrors.telefono ? "border-red-500" : ""}
                      placeholder="+54 11 1234-5678"
                    />
                    {formErrors.telefono && (
                      <p className="text-sm text-red-500">{formErrors.telefono}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección *</Label>
                    <Input
                      id="direccion"
                      value={newClienteForm.direccion}
                      onChange={(e) => setNewClienteForm({ ...newClienteForm, direccion: e.target.value })}
                      className={formErrors.direccion ? "border-red-500" : ""}
                      placeholder="Dirección completa"
                    />
                    {formErrors.direccion && (
                      <p className="text-sm text-red-500">{formErrors.direccion}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ciudad">Ciudad *</Label>
                    <Input
                      id="ciudad"
                      value={newClienteForm.ciudad}
                      onChange={(e) => setNewClienteForm({ ...newClienteForm, ciudad: e.target.value })}
                      className={formErrors.ciudad ? "border-red-500" : ""}
                      placeholder="Ciudad"
                    />
                    {formErrors.ciudad && (
                      <p className="text-sm text-red-500">{formErrors.ciudad}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provincia">Provincia *</Label>
                    <Input
                      id="provincia"
                      value={newClienteForm.provincia}
                      onChange={(e) => setNewClienteForm({ ...newClienteForm, provincia: e.target.value })}
                      className={formErrors.provincia ? "border-red-500" : ""}
                      placeholder="Provincia"
                    />
                    {formErrors.provincia && (
                      <p className="text-sm text-red-500">{formErrors.provincia}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigo_postal">Código Postal *</Label>
                    <Input
                      id="codigo_postal"
                      value={newClienteForm.codigo_postal}
                      onChange={(e) => setNewClienteForm({ ...newClienteForm, codigo_postal: e.target.value })}
                      className={formErrors.codigo_postal ? "border-red-500" : ""}
                      placeholder="1234"
                    />
                    {formErrors.codigo_postal && (
                      <p className="text-sm text-red-500">{formErrors.codigo_postal}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notas">Notas</Label>
                  <Textarea
                    id="notas"
                    value={newClienteForm.notas}
                    onChange={(e) => setNewClienteForm({ ...newClienteForm, notas: e.target.value })}
                    placeholder="Información adicional del cliente"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddCliente} className="bg-green-600 hover:bg-green-700">
                  Crear Cliente
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes por nombre, email, teléfono o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Clientes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClientes.map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{cliente.nombre}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" />
                      {cliente.email}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={cliente.estado === "Activo" ? "default" : "secondary"}
                    className={`${
                      cliente.estado === "Activo"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-gray-100 text-gray-800 border-gray-300"
                    }`}
                  >
                    {cliente.estado}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {cliente.telefono}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {cliente.ciudad}, {cliente.provincia}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShoppingBag className="h-4 w-4" />
                  Registrado: {new Date(cliente.fecha_registro).toLocaleDateString()}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openViewDialog(cliente)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(cliente)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCliente(cliente.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredClientes.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Intenta con otros términos de búsqueda"
                : "Comienza agregando tu primer cliente"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Cliente
              </Button>
            )}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>
                Modifica la información del cliente
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nombre">Nombre *</Label>
                  <Input
                    id="edit-nombre"
                    value={editForm.nombre}
                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                    className={formErrors.nombre ? "border-red-500" : ""}
                  />
                  {formErrors.nombre && (
                    <p className="text-sm text-red-500">{formErrors.nombre}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-telefono">Teléfono *</Label>
                  <Input
                    id="edit-telefono"
                    value={editForm.telefono}
                    onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                    className={formErrors.telefono ? "border-red-500" : ""}
                  />
                  {formErrors.telefono && (
                    <p className="text-sm text-red-500">{formErrors.telefono}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-direccion">Dirección *</Label>
                  <Input
                    id="edit-direccion"
                    value={editForm.direccion}
                    onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
                    className={formErrors.direccion ? "border-red-500" : ""}
                  />
                  {formErrors.direccion && (
                    <p className="text-sm text-red-500">{formErrors.direccion}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-ciudad">Ciudad *</Label>
                  <Input
                    id="edit-ciudad"
                    value={editForm.ciudad}
                    onChange={(e) => setEditForm({ ...editForm, ciudad: e.target.value })}
                    className={formErrors.ciudad ? "border-red-500" : ""}
                  />
                  {formErrors.ciudad && (
                    <p className="text-sm text-red-500">{formErrors.ciudad}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-provincia">Provincia *</Label>
                  <Input
                    id="edit-provincia"
                    value={editForm.provincia}
                    onChange={(e) => setEditForm({ ...editForm, provincia: e.target.value })}
                    className={formErrors.provincia ? "border-red-500" : ""}
                  />
                  {formErrors.provincia && (
                    <p className="text-sm text-red-500">{formErrors.provincia}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-codigo_postal">Código Postal *</Label>
                  <Input
                    id="edit-codigo_postal"
                    value={editForm.codigo_postal}
                    onChange={(e) => setEditForm({ ...editForm, codigo_postal: e.target.value })}
                    className={formErrors.codigo_postal ? "border-red-500" : ""}
                  />
                  {formErrors.codigo_postal && (
                    <p className="text-sm text-red-500">{formErrors.codigo_postal}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notas">Notas</Label>
                <Textarea
                  id="edit-notas"
                  value={editForm.notas}
                  onChange={(e) => setEditForm({ ...editForm, notas: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeEditDialog}>
                Cancelar
              </Button>
              <Button onClick={handleEditCliente} className="bg-green-600 hover:bg-green-700">
                Guardar Cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalles del Cliente</DialogTitle>
              <DialogDescription>
                Información completa del cliente
              </DialogDescription>
            </DialogHeader>
            {viewingCliente && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                    <p className="text-sm">{viewingCliente.nombre}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-sm">{viewingCliente.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Teléfono</Label>
                    <p className="text-sm">{viewingCliente.telefono}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                    <Badge
                      variant={viewingCliente.estado === "Activo" ? "default" : "secondary"}
                      className={`${
                        viewingCliente.estado === "Activo"
                          ? "bg-green-100 text-green-800 border-green-300"
                          : "bg-gray-100 text-gray-800 border-gray-300"
                      }`}
                    >
                      {viewingCliente.estado}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Dirección</Label>
                  <p className="text-sm">
                    {viewingCliente.direccion}, {viewingCliente.ciudad}, {viewingCliente.provincia} {viewingCliente.codigo_postal}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Notas</Label>
                  <p className="text-sm">{viewingCliente.notas || "Sin notas"}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Fecha de Registro</Label>
                    <p className="text-sm">{new Date(viewingCliente.fecha_registro).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Última Actualización</Label>
                    <p className="text-sm">{new Date(viewingCliente.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
