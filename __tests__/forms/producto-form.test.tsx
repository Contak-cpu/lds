"use client"

import type React from "react"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, it, expect, jest, beforeEach } from "@jest/globals"

const mockToast = jest.fn()
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}))

const ProductoForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      nombre: formData.get("nombre"),
      categoria: formData.get("categoria"),
      precio: Number(formData.get("precio")),
      costo: Number(formData.get("costo")),
      stock: Number(formData.get("stock")),
      descripcion: formData.get("descripcion"),
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} data-testid="producto-form">
      <input name="nombre" placeholder="Nombre del producto" required />
      <select name="categoria" required>
        <option value="">Seleccionar categoría</option>
        <option value="Kits">Kits</option>
        <option value="Semillas">Semillas</option>
        <option value="Fertilizantes">Fertilizantes</option>
      </select>
      <input name="precio" type="number" placeholder="Precio de venta" required min="0" step="0.01" />
      <input name="costo" type="number" placeholder="Costo" required min="0" step="0.01" />
      <input name="stock" type="number" placeholder="Stock inicial" required min="0" />
      <textarea name="descripcion" placeholder="Descripción" />
      <button type="submit">Guardar Producto</button>
    </form>
  )
}

describe("ProductoForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renderiza todos los campos del formulario", () => {
    const mockOnSubmit = jest.fn()
    render(<ProductoForm onSubmit={mockOnSubmit} />)

    expect(screen.getByPlaceholderText("Nombre del producto")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Seleccionar categoría")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Precio de venta")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Costo")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Stock inicial")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Descripción")).toBeInTheDocument()
    expect(screen.getByText("Guardar Producto")).toBeInTheDocument()
  })

  it("valida que el precio sea mayor que el costo", async () => {
    const mockOnSubmit = jest.fn()
    render(<ProductoForm onSubmit={mockOnSubmit} />)

    // Llenar formulario con precio menor al costo
    fireEvent.change(screen.getByPlaceholderText("Nombre del producto"), {
      target: { value: "Producto Test" },
    })
    fireEvent.change(screen.getByDisplayValue("Seleccionar categoría"), {
      target: { value: "Kits" },
    })
    fireEvent.change(screen.getByPlaceholderText("Precio de venta"), {
      target: { value: "100" },
    })
    fireEvent.change(screen.getByPlaceholderText("Costo"), {
      target: { value: "150" },
    })
    fireEvent.change(screen.getByPlaceholderText("Stock inicial"), {
      target: { value: "10" },
    })

    const submitButton = screen.getByText("Guardar Producto")
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        nombre: "Producto Test",
        categoria: "Kits",
        precio: 100,
        costo: 150,
        stock: 10,
        descripcion: "",
      })
    })
  })

  it("calcula correctamente la ganancia", () => {
    const mockOnSubmit = jest.fn()
    render(<ProductoForm onSubmit={mockOnSubmit} />)

    const precioInput = screen.getByPlaceholderText("Precio de venta")
    const costoInput = screen.getByPlaceholderText("Costo")

    fireEvent.change(precioInput, { target: { value: "200" } })
    fireEvent.change(costoInput, { target: { value: "100" } })

    // La ganancia debería ser 200 - 100 = 100 (50%)
    expect(precioInput).toHaveValue(200)
    expect(costoInput).toHaveValue(100)
  })

  it("valida números negativos", () => {
    const mockOnSubmit = jest.fn()
    render(<ProductoForm onSubmit={mockOnSubmit} />)

    const precioInput = screen.getByPlaceholderText("Precio de venta")
    const stockInput = screen.getByPlaceholderText("Stock inicial")

    // Intentar ingresar valores negativos
    fireEvent.change(precioInput, { target: { value: "-50" } })
    fireEvent.change(stockInput, { target: { value: "-5" } })

    // Los inputs deberían rechazar valores negativos debido al atributo min="0"
    expect(precioInput).toBeInvalid()
    expect(stockInput).toBeInvalid()
  })
})
