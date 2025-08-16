"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, Phone, Mail, MapPin, ShoppingBag, Edit, Eye } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"

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

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("todos")
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const { toast } = useToast()

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
      toast({
        title: "Error",
        description: "No se pudieron cargar los clientes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCliente = async () => {
    try {
      const { data, error } = await supabase
        .from("clientes")
        .insert([
          {
            ...newClienteForm,
            fecha_registro: new Date().toISOString().split("T")[0],
            estado: "Activo", // Assuming default estado is "Activo"
          },
        ])
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
        toast({
          title: "Cliente agregado",
          description: "El cliente se ha agregado exitosamente",
        })
      }
    } catch (error) {
      console.error("Error adding cliente:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el cliente",
        variant: "destructive",
      })
    }
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
  }

  const handleNewClienteFormChange = (field: string, value: string): void => {
    setNewClienteForm((prev) => ({
      ...prev,
      [field]: value,
    }))
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
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingCliente) return

    try {
      const { data, error } = await supabase.from("clientes").update(editForm).eq("id", editingCliente.id).select()

      if (error) throw error

      if (data) {
        setClientes((prev: Cliente[]) =>
          prev.map((cliente: Cliente) => (cliente.id === editingCliente.id ? data[0] : cliente)),
        )
        setIsEditDialogOpen(false)
        setEditingCliente(null)
        toast({
          title: "Cliente actualizado",
          description: "Los cambios se han guardado exitosamente",
        })
      }
    } catch (error) {
      console.error("Error updating cliente:", error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      })
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
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navigation />

      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-green-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Gestión de Clientes</h1>
                  <p className="text-sm text-blue-600">Administra tu base de clientes</p>
                </div>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Cliente
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Clientes</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{clientes.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Clientes Activos</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredClientes.filter((c: Cliente) => c.estado === "Activo").length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Nuevos Este Mes</CardTitle>
                <ShoppingBag className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
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

            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">Registrados Hoy</CardTitle>
                <ShoppingBag className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
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
          <Card className="mb-6 bg-white border-green-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
          <Card className="bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Lista de Clientes ({filteredClientes.length})
              </CardTitle>
              <CardDescription>Gestiona la información de tus clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClientes.map((cliente: Cliente) => (
                  <div
                    key={cliente.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{cliente.nombre}</h3>
                          {getEstadoBadge(cliente.estado)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{cliente.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{cliente.telefono}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
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
                                <Label className="text-sm font-medium text-gray-600">Información Personal</Label>
                                <div className="mt-2 space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{cliente.email}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{cliente.telefono}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{cliente.direccion}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Notas</Label>
                                <p className="text-sm text-gray-700 mt-1">{cliente.notas}</p>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Información Comercial</Label>
                                <div className="mt-2 space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Estado:</span>
                                    {getEstadoBadge(cliente.estado)}
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Registro:</span>
                                    <span className="text-sm">{cliente.fecha_registro}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Ciudad:</span>
                                    <span className="text-sm">{cliente.ciudad}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Provincia:</span>
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
                      placeholder="Ej: María González"
                      value={newClienteForm.nombre}
                      onChange={(e) => handleNewClienteFormChange("nombre", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="cliente@email.com"
                      value={newClienteForm.email}
                      onChange={(e) => handleNewClienteFormChange("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      placeholder="+54 11 1234-5678"
                      value={newClienteForm.telefono}
                      onChange={(e) => handleNewClienteFormChange("telefono", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input
                      id="ciudad"
                      placeholder="Buenos Aires"
                      value={newClienteForm.ciudad}
                      onChange={(e) => handleNewClienteFormChange("ciudad", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Textarea
                      id="direccion"
                      placeholder="Ej: Av. Corrientes 1234"
                      value={newClienteForm.direccion}
                      onChange={(e) => handleNewClienteFormChange("direccion", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="provincia">Provincia</Label>
                    <Input
                      id="provincia"
                      placeholder="Buenos Aires"
                      value={newClienteForm.provincia}
                      onChange={(e) => handleNewClienteFormChange("provincia", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="codigo_postal">Código Postal</Label>
                    <Input
                      id="codigo_postal"
                      placeholder="1000"
                      value={newClienteForm.codigo_postal}
                      onChange={(e) => handleNewClienteFormChange("codigo_postal", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea
                      id="notas"
                      placeholder="Información adicional sobre el cliente"
                      value={newClienteForm.notas}
                      onChange={(e) => handleNewClienteFormChange("notas", e.target.value)}
                    />
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
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleEditFormChange("email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-telefono">Teléfono</Label>
                      <Input
                        id="edit-telefono"
                        value={editForm.telefono}
                        onChange={(e) => handleEditFormChange("telefono", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-ciudad">Ciudad</Label>
                      <Input
                        id="edit-ciudad"
                        value={editForm.ciudad}
                        onChange={(e) => handleEditFormChange("ciudad", e.target.value)}
                      />
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
                    </div>
                    <div>
                      <Label htmlFor="edit-provincia">Provincia</Label>
                      <Input
                        id="edit-provincia"
                        value={editForm.provincia}
                        onChange={(e) => handleEditFormChange("provincia", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-codigo_postal">Código Postal</Label>
                      <Input
                        id="edit-codigo_postal"
                        value={editForm.codigo_postal}
                        onChange={(e) => handleEditFormChange("codigo_postal", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-notas">Notas</Label>
                      <Textarea
                        id="edit-notas"
                        value={editForm.notas}
                        onChange={(e) => handleEditFormChange("notas", e.target.value)}
                      />
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
        </main>
      </div>
    </div>
  )
}
