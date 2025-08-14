"use client"

import React from "react"

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, it, expect, jest, beforeEach } from "@jest/globals"

const mockToast = jest.fn()
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}))

const VentaForm = ({
  onSubmit,
  productos = [],
  clientes = [],
}: {
  onSubmit: (data: any) => void
  productos?: any[]
  clientes?: any[]
}) => {
  const [tipoVenta, setTipoVenta] = React.useState("registrada")
  const [carrito, setCarrito] = React.useState<any[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      tipoVenta,
      cliente: formData.get("cliente"),
      clienteNombre: formData.get("clienteNombre"),
      metodoPago: formData.get("metodoPago"),
      carrito,
      total: carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    }
    onSubmit(data)
  }

  const agregarProducto = (producto: any) => {
    setCarrito([...carrito, { ...producto, cantidad: 1 }])
  }

  return (
    <form onSubmit={handleSubmit} data-testid="venta-form">
      <div>
        <label>
          <input
            type="radio"
            value="registrada"
            checked={tipoVenta === "registrada"}
            onChange={(e) => setTipoVenta(e.target.value)}
          />
          Venta Registrada
        </label>
        <label>
          <input
            type="radio"
            value="casual"
            checked={tipoVenta === "casual"}
            onChange={(e) => setTipoVenta(e.target.value)}
          />
          Venta Casual
        </label>
      </div>

      {tipoVenta === "registrada" ? (
        <select name="cliente" required>
          <option value="">Seleccionar cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      ) : (
        <input name="clienteNombre" placeholder="Nombre del cliente" required />
      )}

      <select name="metodoPago" required>
        <option value="">Método de pago</option>
        <option value="Efectivo">Efectivo</option>
        <option value="Tarjeta">Tarjeta</option>
        <option value="Transferencia">Transferencia</option>
      </select>

      <div data-testid="productos-disponibles">
        {productos.map((producto) => (
          <button
            key={producto.id}
            type="button"
            onClick={() => agregarProducto(producto)}
            data-testid={`agregar-${producto.id}`}
          >
            Agregar {producto.nombre}
          </button>
        ))}
      </div>

      <div data-testid="carrito">
        {carrito.map((item, index) => (
          <div key={index}>
            {item.nombre} - ${item.precio} x {item.cantidad}
          </div>
        ))}
      </div>

      <div data-testid="total">Total: ${carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)}</div>

      <button type="submit" disabled={carrito.length === 0}>
        Crear Venta
      </button>
    </form>
  )
}

describe("VentaForm", () => {
  const mockProductos = [
    { id: "1", nombre: "Kit Básico", precio: 1000, stock: 10 },
    { id: "2", nombre: "Fertilizante", precio: 500, stock: 5 },
  ]

  const mockClientes = [
    { id: "1", nombre: "Juan Pérez" },
    { id: "2", nombre: "María González" },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renderiza formulario de venta registrada por defecto", () => {
    const mockOnSubmit = jest.fn()
    render(<VentaForm onSubmit={mockOnSubmit} productos={mockProductos} clientes={mockClientes} />)

    expect(screen.getByDisplayValue("registrada")).toBeChecked()
    expect(screen.getByDisplayValue("Seleccionar cliente")).toBeInTheDocument()
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument()
    expect(screen.getByText("María González")).toBeInTheDocument()
  })

  it("cambia a venta casual correctamente", () => {
    const mockOnSubmit = jest.fn()
    render(<VentaForm onSubmit={mockOnSubmit} productos={mockProductos} clientes={mockClientes} />)

    const ventaCasualRadio = screen.getByDisplayValue("casual")
    fireEvent.click(ventaCasualRadio)

    expect(ventaCasualRadio).toBeChecked()
    expect(screen.getByPlaceholderText("Nombre del cliente")).toBeInTheDocument()
    expect(screen.queryByDisplayValue("Seleccionar cliente")).not.toBeInTheDocument()
  })

  it("agrega productos al carrito", () => {
    const mockOnSubmit = jest.fn()
    render(<VentaForm onSubmit={mockOnSubmit} productos={mockProductos} clientes={mockClientes} />)

    const agregarButton = screen.getByTestId("agregar-1")
    fireEvent.click(agregarButton)

    expect(screen.getByText("Kit Básico - $1000 x 1")).toBeInTheDocument()
    expect(screen.getByTestId("total")).toHaveTextContent("Total: $1000")
  })

  it("calcula total correctamente con múltiples productos", () => {
    const mockOnSubmit = jest.fn()
    render(<VentaForm onSubmit={mockOnSubmit} productos={mockProductos} clientes={mockClientes} />)

    fireEvent.click(screen.getByTestId("agregar-1"))
    fireEvent.click(screen.getByTestId("agregar-2"))

    expect(screen.getByTestId("total")).toHaveTextContent("Total: $1500")
  })

  it("deshabilita botón de crear venta cuando carrito está vacío", () => {
    const mockOnSubmit = jest.fn()
    render(<VentaForm onSubmit={mockOnSubmit} productos={mockProductos} clientes={mockClientes} />)

    const crearVentaButton = screen.getByText("Crear Venta")
    expect(crearVentaButton).toBeDisabled()

    // Agregar producto
    fireEvent.click(screen.getByTestId("agregar-1"))
    expect(crearVentaButton).not.toBeDisabled()
  })

  it("envía datos correctos para venta registrada", async () => {
    const mockOnSubmit = jest.fn()
    render(<VentaForm onSubmit={mockOnSubmit} productos={mockProductos} clientes={mockClientes} />)

    // Seleccionar cliente
    fireEvent.change(screen.getByDisplayValue("Seleccionar cliente"), {
      target: { value: "1" },
    })

    // Seleccionar método de pago
    fireEvent.change(screen.getByDisplayValue("Método de pago"), {
      target: { value: "Efectivo" },
    })

    // Agregar producto
    fireEvent.click(screen.getByTestId("agregar-1"))

    // Enviar formulario
    fireEvent.click(screen.getByText("Crear Venta"))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        tipoVenta: "registrada",
        cliente: "1",
        clienteNombre: null,
        metodoPago: "Efectivo",
        carrito: [{ id: "1", nombre: "Kit Básico", precio: 1000, stock: 10, cantidad: 1 }],
        total: 1000,
      })
    })
  })
})
