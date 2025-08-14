"use client"

import type React from "react"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, it, expect, jest, beforeEach } from "@jest/globals"

const EgresoForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      descripcion: formData.get("descripcion"),
      categoria: formData.get("categoria"),
      monto: Number(formData.get("monto")),
      proveedor: formData.get("proveedor"),
      metodo_pago: formData.get("metodo_pago"),
      notas: formData.get("notas"),
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} data-testid="egreso-form">
      <input name="descripcion" placeholder="Concepto" required />
      <select name="categoria" required>
        <option value="">Seleccionar categoría</option>
        <option value="Proveedores">Proveedores</option>
        <option value="Alquiler">Alquiler</option>
        <option value="Servicios">Servicios</option>
        <option value="Impuestos">Impuestos</option>
      </select>
      <input name="monto" type="number" placeholder="Monto" required min="0" step="0.01" />
      <input name="proveedor" placeholder="Proveedor/Destinatario" required />
      <select name="metodo_pago" required>
        <option value="">Método de pago</option>
        <option value="Efectivo">Efectivo</option>
        <option value="Transferencia">Transferencia</option>
        <option value="Débito">Débito</option>
        <option value="Crédito">Crédito</option>
      </select>
      <textarea name="notas" placeholder="Descripción adicional" />
      <button type="submit">Registrar Egreso</button>
    </form>
  )
}

describe("EgresoForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renderiza todos los campos del formulario", () => {
    const mockOnSubmit = jest.fn()
    render(<EgresoForm onSubmit={mockOnSubmit} />)

    expect(screen.getByPlaceholderText("Concepto")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Seleccionar categoría")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Monto")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Proveedor/Destinatario")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Método de pago")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Descripción adicional")).toBeInTheDocument()
    expect(screen.getByText("Registrar Egreso")).toBeInTheDocument()
  })

  it("valida campos requeridos", async () => {
    const mockOnSubmit = jest.fn()
    render(<EgresoForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByText("Registrar Egreso")
    fireEvent.click(submitButton)

    // El formulario no debería enviarse sin campos requeridos
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it("valida que el monto sea positivo", () => {
    const mockOnSubmit = jest.fn()
    render(<EgresoForm onSubmit={mockOnSubmit} />)

    const montoInput = screen.getByPlaceholderText("Monto")

    // Intentar ingresar monto negativo
    fireEvent.change(montoInput, { target: { value: "-100" } })
    expect(montoInput).toBeInvalid()

    // Monto válido
    fireEvent.change(montoInput, { target: { value: "100" } })
    expect(montoInput).toBeValid()
  })

  it("envía datos correctos cuando el formulario es válido", async () => {
    const mockOnSubmit = jest.fn()
    render(<EgresoForm onSubmit={mockOnSubmit} />)

    // Llenar todos los campos requeridos
    fireEvent.change(screen.getByPlaceholderText("Concepto"), {
      target: { value: "Compra de productos" },
    })
    fireEvent.change(screen.getByDisplayValue("Seleccionar categoría"), {
      target: { value: "Proveedores" },
    })
    fireEvent.change(screen.getByPlaceholderText("Monto"), {
      target: { value: "15000" },
    })
    fireEvent.change(screen.getByPlaceholderText("Proveedor/Destinatario"), {
      target: { value: "Proveedor ABC" },
    })
    fireEvent.change(screen.getByDisplayValue("Método de pago"), {
      target: { value: "Transferencia" },
    })
    fireEvent.change(screen.getByPlaceholderText("Descripción adicional"), {
      target: { value: "Compra mensual de stock" },
    })

    const submitButton = screen.getByText("Registrar Egreso")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        descripcion: "Compra de productos",
        categoria: "Proveedores",
        monto: 15000,
        proveedor: "Proveedor ABC",
        metodo_pago: "Transferencia",
        notas: "Compra mensual de stock",
      })
    })
  })

  it("permite categorías específicas de growshop", () => {
    const mockOnSubmit = jest.fn()
    render(<EgresoForm onSubmit={mockOnSubmit} />)

    const categoriaSelect = screen.getByDisplayValue("Seleccionar categoría")

    expect(screen.getByText("Proveedores")).toBeInTheDocument()
    expect(screen.getByText("Alquiler")).toBeInTheDocument()
    expect(screen.getByText("Servicios")).toBeInTheDocument()
    expect(screen.getByText("Impuestos")).toBeInTheDocument()
  })
})
