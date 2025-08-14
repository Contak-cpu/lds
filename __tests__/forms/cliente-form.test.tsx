"use client"

import type React from "react"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, it, expect, jest, beforeEach } from "@jest/globals"

// Mock del hook useToast
const mockToast = jest.fn()
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Mock del cliente Supabase
const mockSupabaseClient = {
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [{ id: "1", nombre: "Test Cliente" }], error: null })),
    })),
  })),
}

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabaseClient,
}))

// Componente de prueba que simula el formulario de cliente
const ClienteForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
  }

  return (
    <form onSubmit={handleSubmit} data-testid="cliente-form">
      <input name="nombre" placeholder="Nombre completo" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="telefono" placeholder="Teléfono" />
      <textarea name="direccion" placeholder="Dirección" />
      <input name="ciudad" placeholder="Ciudad" />
      <input name="provincia" placeholder="Provincia" />
      <input name="codigo_postal" placeholder="Código Postal" />
      <textarea name="notas" placeholder="Notas" />
      <button type="submit">Guardar Cliente</button>
    </form>
  )
}

describe("ClienteForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renderiza todos los campos del formulario", () => {
    const mockOnSubmit = jest.fn()
    render(<ClienteForm onSubmit={mockOnSubmit} />)

    expect(screen.getByPlaceholderText("Nombre completo")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Teléfono")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Dirección")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Ciudad")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Provincia")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Código Postal")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Notas")).toBeInTheDocument()
    expect(screen.getByText("Guardar Cliente")).toBeInTheDocument()
  })

  it("valida campos requeridos", async () => {
    const mockOnSubmit = jest.fn()
    render(<ClienteForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByText("Guardar Cliente")
    fireEvent.click(submitButton)

    // El formulario no debería enviarse sin campos requeridos
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it("envía datos correctos cuando el formulario es válido", async () => {
    const mockOnSubmit = jest.fn()
    render(<ClienteForm onSubmit={mockOnSubmit} />)

    // Llenar campos requeridos
    fireEvent.change(screen.getByPlaceholderText("Nombre completo"), {
      target: { value: "Juan Pérez" },
    })
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "juan@email.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Teléfono"), {
      target: { value: "+54 11 1234-5678" },
    })
    fireEvent.change(screen.getByPlaceholderText("Ciudad"), {
      target: { value: "Buenos Aires" },
    })

    const submitButton = screen.getByText("Guardar Cliente")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        nombre: "Juan Pérez",
        email: "juan@email.com",
        telefono: "+54 11 1234-5678",
        direccion: "",
        ciudad: "Buenos Aires",
        provincia: "",
        codigo_postal: "",
        notas: "",
      })
    })
  })

  it("valida formato de email", () => {
    const mockOnSubmit = jest.fn()
    render(<ClienteForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByPlaceholderText("Email")

    // Email inválido
    fireEvent.change(emailInput, { target: { value: "email-invalido" } })
    expect(emailInput).toBeInvalid()

    // Email válido
    fireEvent.change(emailInput, { target: { value: "test@email.com" } })
    expect(emailInput).toBeValid()
  })
})
