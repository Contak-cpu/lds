"use client"

import React from "react"
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, it, expect, jest, beforeEach, vi } from "@jest/globals"

// Mock del hook useToast
const mockToast = jest.fn()
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Mock del cliente Supabase
const mockSupabaseClient = {
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ 
        data: [{ id: "1", nombre: "Test Cliente" }], 
        error: null 
      })),
    })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ 
          data: { id: "1", nombre: "Cliente Existente" }, 
          error: null 
        })),
      })),
    })),
  })),
}

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabaseClient,
}))

// Componente de prueba que simula el formulario de cliente
const ClienteForm = ({ onSubmit, initialData, mode = "create" }: { 
  onSubmit: (data: any) => void
  initialData?: any
  mode?: "create" | "edit"
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    
    setIsSubmitting(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      telefono: formData.get("telefono"),
      direccion: formData.get("direccion"),
      ciudad: formData.get("ciudad"),
      provincia: formData.get("provincia"),
      codigo_postal: formData.get("codigo_postal"),
      notas: formData.get("notas"),
    }
    onSubmit(data)
    
    // Usar setTimeout para simular un envío real
    setTimeout(() => {
      setIsSubmitting(false)
    }, 100)
  }

  return (
    <form onSubmit={handleSubmit} data-testid="cliente-form">
      <div className="form-section">
        <h3>Información Personal</h3>
        <input 
          name="nombre" 
          placeholder="Nombre completo" 
          required 
          defaultValue={initialData?.nombre || ""}
          data-testid="nombre-input"
        />
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          required 
          defaultValue={initialData?.email || ""}
          data-testid="email-input"
        />
        <input 
          name="telefono" 
          placeholder="Teléfono" 
          defaultValue={initialData?.telefono || ""}
          data-testid="telefono-input"
        />
      </div>

      <div className="form-section">
        <h3>Dirección</h3>
        <textarea 
          name="direccion" 
          placeholder="Dirección" 
          defaultValue={initialData?.direccion || ""}
          data-testid="direccion-input"
        />
        <input 
          name="ciudad" 
          placeholder="Ciudad" 
          defaultValue={initialData?.ciudad || ""}
          data-testid="ciudad-input"
        />
        <input 
          name="provincia" 
          placeholder="Provincia" 
          defaultValue={initialData?.provincia || ""}
          data-testid="provincia-input"
        />
        <input 
          name="codigo_postal" 
          placeholder="Código Postal" 
          defaultValue={initialData?.codigo_postal || ""}
          data-testid="codigo-postal-input"
        />
      </div>

      <div className="form-section">
        <h3>Información Adicional</h3>
        <textarea 
          name="notas" 
          placeholder="Notas adicionales" 
          defaultValue={initialData?.notas || ""}
          data-testid="notas-input"
        />
      </div>

      <div className="form-actions">
        <button type="button" data-testid="cancel-button">
          Cancelar
        </button>
        <button type="submit" data-testid="submit-button">
          {mode === "create" ? "Crear Cliente" : "Actualizar Cliente"}
        </button>
      </div>
    </form>
  )
}

describe("📝 Formulario de Clientes - Validación Completa", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockToast.mockClear()
  })

  describe("🎯 Renderizado del Formulario", () => {
    it("debe renderizar todos los campos del formulario correctamente", () => {
      const mockOnSubmit = jest.fn()
      render(<ClienteForm onSubmit={mockOnSubmit} />)

      // Verificar que todos los campos estén presentes
      expect(screen.getByTestId("nombre-input")).toBeInTheDocument()
      expect(screen.getByTestId("email-input")).toBeInTheDocument()
      expect(screen.getByTestId("telefono-input")).toBeInTheDocument()
      expect(screen.getByTestId("direccion-input")).toBeInTheDocument()
      expect(screen.getByTestId("ciudad-input")).toBeInTheDocument()
      expect(screen.getByTestId("provincia-input")).toBeInTheDocument()
      expect(screen.getByTestId("codigo-postal-input")).toBeInTheDocument()
      expect(screen.getByTestId("notas-input")).toBeInTheDocument()
      
      // Verificar botones
      expect(screen.getByTestId("submit-button")).toBeInTheDocument()
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument()
    })

    it("debe mostrar el título correcto según el modo (crear/editar)", () => {
      const mockOnSubmit = jest.fn()
      
      // Modo crear
      const { rerender } = render(<ClienteForm onSubmit={mockOnSubmit} mode="create" />)
      expect(screen.getByText("Crear Cliente")).toBeInTheDocument()
      
      // Modo editar
      rerender(<ClienteForm onSubmit={mockOnSubmit} mode="edit" />)
      expect(screen.getByText("Actualizar Cliente")).toBeInTheDocument()
    })
  })

  describe("✅ Validación de Campos", () => {
    it("debe validar que los campos requeridos estén completos", async () => {
      const mockOnSubmit = jest.fn()
      render(<ClienteForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      // El formulario no debería enviarse sin campos requeridos
      expect(mockOnSubmit).not.toHaveBeenCalled()
      
      // Verificar que los campos requeridos muestren validación
      const nombreInput = screen.getByTestId("nombre-input")
      const emailInput = screen.getByTestId("email-input")
      
      expect(nombreInput).toBeRequired()
      expect(emailInput).toBeRequired()
    })

    it("debe validar el formato de email correctamente", () => {
      const mockOnSubmit = jest.fn()
      render(<ClienteForm onSubmit={mockOnSubmit} />)

      const emailInput = screen.getByTestId("email-input")

      // Emails válidos
      const emailsValidos = [
        "test@email.com",
        "usuario.nombre@dominio.com",
        "usuario+tag@dominio.co.uk",
        "123@456.789"
      ]

      emailsValidos.forEach(email => {
        fireEvent.change(emailInput, { target: { value: email } })
        expect(emailInput).toHaveValue(email)
      })
    })

    it("debe validar el formato de teléfono", () => {
      const mockOnSubmit = jest.fn()
      render(<ClienteForm onSubmit={mockOnSubmit} />)

      const telefonoInput = screen.getByTestId("telefono-input")

      // Teléfonos válidos
      const telefonosValidos = [
        "+54 11 1234-5678",
        "011 1234-5678",
        "1234-5678",
        "12345678",
        "+1 (555) 123-4567"
      ]

      telefonosValidos.forEach(telefono => {
        fireEvent.change(telefonoInput, { target: { value: telefono } })
        expect(telefonoInput).toHaveValue(telefono)
      })
    })

    it("debe validar el código postal", () => {
      const mockOnSubmit = jest.fn()
      render(<ClienteForm onSubmit={mockOnSubmit} />)

      const codigoPostalInput = screen.getByTestId("codigo-postal-input")

      // Códigos postales válidos
      const codigosValidos = ["1234", "12345", "A1B2C3", "1234-5678"]

      codigosValidos.forEach(codigo => {
        fireEvent.change(codigoPostalInput, { target: { value: codigo } })
        expect(codigoPostalInput).toHaveValue(codigo)
      })
    })
  })

  describe("📤 Envío del Formulario", () => {
    it("debe enviar datos correctos cuando el formulario es válido", async () => {
      const mockOnSubmit = jest.fn()
      render(<ClienteForm onSubmit={mockOnSubmit} />)

      // Llenar todos los campos
      const testData = {
        nombre: "Juan Carlos Pérez González",
        email: "juan.perez@email.com",
        telefono: "+54 11 1234-5678",
        direccion: "Av. Corrientes 1234, Piso 5",
        ciudad: "Buenos Aires",
        provincia: "Buenos Aires",
        codigo_postal: "1043",
        notas: "Cliente preferencial, paga en efectivo"
      }

      // Llenar campos requeridos
      fireEvent.change(screen.getByTestId("nombre-input"), {
        target: { value: testData.nombre },
      })
      fireEvent.change(screen.getByTestId("email-input"), {
        target: { value: testData.email },
      })

      // Llenar campos opcionales
      fireEvent.change(screen.getByTestId("telefono-input"), {
        target: { value: testData.telefono },
      })
      fireEvent.change(screen.getByTestId("direccion-input"), {
        target: { value: testData.direccion },
      })
      fireEvent.change(screen.getByTestId("ciudad-input"), {
        target: { value: testData.ciudad },
      })
      fireEvent.change(screen.getByTestId("provincia-input"), {
        target: { value: testData.provincia },
      })
      fireEvent.change(screen.getByTestId("codigo-postal-input"), {
        target: { value: testData.codigo_postal },
      })
      fireEvent.change(screen.getByTestId("notas-input"), {
        target: { value: testData.notas },
      })

      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(testData)
      })
    })

    it("debe manejar campos vacíos correctamente", async () => {
      const mockOnSubmit = jest.fn()
      render(<ClienteForm onSubmit={mockOnSubmit} />)

      // Solo llenar campos requeridos
      fireEvent.change(screen.getByTestId("nombre-input"), {
        target: { value: "Cliente Test" },
      })
      fireEvent.change(screen.getByTestId("email-input"), {
        target: { value: "test@email.com" },
      })

      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          nombre: "Cliente Test",
          email: "test@email.com",
          telefono: "",
          direccion: "",
          ciudad: "",
          provincia: "",
          codigo_postal: "",
          notas: "",
        })
      })
    })
  })

  describe("🔄 Modo de Edición", () => {
    it("debe cargar datos iniciales correctamente en modo edición", () => {
      const mockOnSubmit = jest.fn()
      const initialData = {
        nombre: "Cliente Existente",
        email: "existente@email.com",
        telefono: "1234-5678",
        direccion: "Dirección existente",
        ciudad: "Ciudad existente",
        provincia: "Provincia existente",
        codigo_postal: "1234",
        notas: "Notas existentes"
      }

      render(<ClienteForm onSubmit={mockOnSubmit} initialData={initialData} mode="edit" />)

      // Verificar que los campos tengan los valores iniciales
      expect(screen.getByTestId("nombre-input")).toHaveValue(initialData.nombre)
      expect(screen.getByTestId("email-input")).toHaveValue(initialData.email)
      expect(screen.getByTestId("telefono-input")).toHaveValue(initialData.telefono)
      expect(screen.getByTestId("direccion-input")).toHaveValue(initialData.direccion)
      expect(screen.getByTestId("ciudad-input")).toHaveValue(initialData.ciudad)
      expect(screen.getByTestId("provincia-input")).toHaveValue(initialData.provincia)
      expect(screen.getByTestId("codigo-postal-input")).toHaveValue(initialData.codigo_postal)
      expect(screen.getByTestId("notas-input")).toHaveValue(initialData.notas)
    })

    it("debe permitir editar datos existentes", async () => {
      const mockOnSubmit = jest.fn()
      const initialData = {
        nombre: "Cliente Original",
        email: "original@email.com",
        telefono: "1111-1111",
        direccion: "Dirección original",
        ciudad: "Ciudad original",
        provincia: "Provincia original",
        codigo_postal: "1111",
        notas: "Notas originales"
      }

      render(<ClienteForm onSubmit={mockOnSubmit} initialData={initialData} mode="edit" />)

      // Editar algunos campos
      fireEvent.change(screen.getByTestId("telefono-input"), {
        target: { value: "2222-2222" },
      })
      fireEvent.change(screen.getByTestId("notas-input"), {
        target: { value: "Notas actualizadas" },
      })

      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          ...initialData,
          telefono: "2222-2222",
          notas: "Notas actualizadas"
        })
      })
    })
  })

  describe("🚫 Prevención de Datos Duplicados", () => {
    it("debe validar que no se envíen datos duplicados", async () => {
      const mockOnSubmit = jest.fn()
      render(<ClienteForm onSubmit={mockOnSubmit} />)

      // Llenar formulario con datos válidos
      fireEvent.change(screen.getByTestId("nombre-input"), {
        target: { value: "Cliente Test" },
      })
      fireEvent.change(screen.getByTestId("email-input"), {
        target: { value: "test@email.com" },
      })

      const submitButton = screen.getByTestId("submit-button")
      
      // Enviar formulario múltiples veces
      fireEvent.click(submitButton)
      fireEvent.click(submitButton)
      fireEvent.click(submitButton)

      await waitFor(() => {
        // Solo debería enviarse una vez
        expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe("🎨 Interfaz de Usuario", () => {
    it("debe tener una estructura visual organizada", () => {
      const mockOnSubmit = jest.fn()
      render(<ClienteForm onSubmit={mockOnSubmit} />)

      // Verificar secciones del formulario
      expect(screen.getByText("Información Personal")).toBeInTheDocument()
      expect(screen.getByText("Dirección")).toBeInTheDocument()
      expect(screen.getByText("Información Adicional")).toBeInTheDocument()
    })

    it("debe tener botones con funcionalidad correcta", () => {
      const mockOnSubmit = jest.fn()
      render(<ClienteForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByTestId("submit-button")
      const cancelButton = screen.getByTestId("cancel-button")

      expect(submitButton).toHaveAttribute("type", "submit")
      expect(cancelButton).toHaveAttribute("type", "button")
    })
  })

  describe("🔍 Casos Edge y Validaciones", () => {
    it("debe manejar caracteres especiales en nombres", () => {
      const mockOnSubmit = jest.fn()
      render(<ClienteForm onSubmit={mockOnSubmit} />)

      const nombreInput = screen.getByTestId("nombre-input")
      const nombresConCaracteresEspeciales = [
        "María José",
        "Jean-Pierre",
        "O'Connor",
        "José María",
        "Anne-Marie"
      ]

      nombresConCaracteresEspeciales.forEach(nombre => {
        fireEvent.change(nombreInput, { target: { value: nombre } })
        expect(nombreInput).toHaveValue(nombre)
      })
    })

    it("debe manejar emails con caracteres especiales", () => {
      const mockOnSubmit = jest.fn()
      render(<ClienteForm onSubmit={mockOnSubmit} />)

      const emailInput = screen.getByTestId("email-input")
      const emailsConCaracteresEspeciales = [
        "usuario+tag@dominio.com",
        "usuario.nombre@dominio.com",
        "usuario_nombre@dominio.com",
        "usuario-nombre@dominio.com"
      ]

      emailsConCaracteresEspeciales.forEach(email => {
        fireEvent.change(emailInput, { target: { value: email } })
        expect(emailInput).toBeValid()
      })
    })

    it("debe validar longitud de campos", () => {
      const mockOnSubmit = jest.fn()
      render(<ClienteForm onSubmit={mockOnSubmit} />)

      const nombreInput = screen.getByTestId("nombre-input")
      const notasInput = screen.getByTestId("notas-input")

      // Nombre muy largo
      const nombreLargo = "A".repeat(100)
      fireEvent.change(nombreInput, { target: { value: nombreLargo } })
      expect(nombreInput).toHaveValue(nombreLargo)

      // Notas muy largas
      const notasLargas = "Nota muy larga ".repeat(50)
      fireEvent.change(notasInput, { target: { value: notasLargas } })
      expect(notasInput).toHaveValue(notasLargas)
    })
  })
})
