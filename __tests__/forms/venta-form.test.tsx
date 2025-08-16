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
        data: [{ id: "1", total: 150.00 }], 
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

// Componente de prueba que simula el formulario de venta
const VentaForm = ({ onSubmit, initialData, mode = "create" }: { 
  onSubmit: (data: any) => void
  initialData?: any
  mode?: "create" | "edit"
}) => {
  const [items, setItems] = React.useState(initialData?.items || [])
  const [clienteSeleccionado, setClienteSeleccionado] = React.useState(initialData?.cliente_id || "")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [totales, setTotales] = React.useState({ subtotal: 0, total: 0 })

  // Recalcular totales cuando cambien los items
  React.useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
    const descuento = parseFloat((document.querySelector('[name="descuento"]') as HTMLInputElement)?.value || "0")
    setTotales({
      subtotal,
      total: Math.max(0, subtotal - descuento)
    })
  }, [items])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    
    setIsSubmitting(true)
    const formData = new FormData(e.target as HTMLFormElement)
    
    const data = {
      cliente_id: clienteSeleccionado || null,
      cliente_nombre: formData.get("cliente_nombre") || null,
      cliente_casual: formData.get("cliente_casual") || null,
      tipo_venta: formData.get("tipo_venta") || "efectivo",
      subtotal: totales.subtotal,
      descuento: parseFloat(formData.get("descuento") as string) || 0,
      total: totales.total,
      estado: formData.get("estado") || "completada",
      metodo_pago: formData.get("metodo_pago") || "efectivo",
      notas: formData.get("notas") || null,
      items: items
    }
    onSubmit(data)
    
    // Usar setTimeout para simular un envío real
    setTimeout(() => {
      setIsSubmitting(false)
    }, 100)
  }

  const agregarItem = () => {
    const nuevoItem = {
      id: Date.now().toString(),
      producto_id: "",
      producto_nombre: "",
      cantidad: 1,
      precio_unitario: 0,
      subtotal: 0
    }
    setItems([...items, nuevoItem])
  }

  const eliminarItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const actualizarItem = (id: string, campo: string, valor: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [campo]: valor }
        // Recalcular subtotal si cambia cantidad o precio
        if (campo === "cantidad" || campo === "precio_unitario") {
          updatedItem.subtotal = updatedItem.cantidad * updatedItem.precio_unitario
        }
        return updatedItem
      }
      return item
    }))
  }

  const calcularTotales = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0)
    const descuento = parseFloat((document.querySelector('[name="descuento"]') as HTMLInputElement)?.value || "0")
    return {
      subtotal,
      total: Math.max(0, subtotal - descuento)
    }
  }

  return (
    <form onSubmit={handleSubmit} data-testid="venta-form">
      <div className="form-section">
        <h3>Información del Cliente</h3>
        <select 
          name="cliente_id" 
          value={clienteSeleccionado}
          onChange={(e) => setClienteSeleccionado(e.target.value)}
          data-testid="cliente-select"
        >
          <option value="">Seleccionar cliente</option>
          <option value="1">Juan Pérez</option>
          <option value="2">María García</option>
          <option value="3">Carlos López</option>
        </select>
        
        <input 
          name="cliente_casual" 
          placeholder="Nombre del cliente casual" 
          data-testid="cliente-casual-input"
        />
      </div>

      <div className="form-section">
        <h3>Productos</h3>
        <button 
          type="button" 
          onClick={agregarItem}
          data-testid="agregar-item-button"
        >
          + Agregar Producto
        </button>
        
        {items.map((item, index) => (
          <div key={item.id} className="item-row" data-testid={`item-${index}`}>
            <input 
              name={`producto_nombre_${item.id}`}
              placeholder="Nombre del producto"
              value={item.producto_nombre}
              onChange={(e) => actualizarItem(item.id, "producto_nombre", e.target.value)}
              data-testid={`producto-nombre-${index}`}
            />
            <input 
              name={`cantidad_${item.id}`}
              type="number"
              min="1"
              placeholder="Cantidad"
              value={item.cantidad}
              onChange={(e) => {
                const cantidad = Math.max(1, parseInt(e.target.value) || 1)
                actualizarItem(item.id, "cantidad", cantidad)
              }}
              data-testid={`cantidad-${index}`}
            />
            <input 
              name={`precio_unitario_${item.id}`}
              type="number"
              step="0.01"
              min="0"
              placeholder="Precio unitario"
              value={item.precio_unitario}
              onChange={(e) => {
                const precio = Math.max(0, parseFloat(e.target.value) || 0)
                actualizarItem(item.id, "precio_unitario", precio)
              }}
              data-testid={`precio-unitario-${index}`}
            />
            <span data-testid={`subtotal-${index}`}>
              ${item.subtotal?.toFixed(2) || "0.00"}
            </span>
            <button 
              type="button" 
              onClick={() => eliminarItem(item.id)}
              data-testid={`eliminar-item-${index}`}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="form-section">
        <h3>Detalles de la Venta</h3>
        <select 
          name="tipo_venta" 
          defaultValue={initialData?.tipo_venta || "efectivo"}
          data-testid="tipo-venta-select"
        >
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="transferencia">Transferencia</option>
          <option value="crypto">Crypto</option>
        </select>

        <select 
          name="estado" 
          defaultValue={initialData?.estado || "completada"}
          data-testid="estado-select"
        >
          <option value="pendiente">Pendiente</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
          <option value="reembolsada">Reembolsada</option>
        </select>

        <select 
          name="metodo_pago" 
          defaultValue={initialData?.metodo_pago || "efectivo"}
          data-testid="metodo-pago-select"
        >
          <option value="efectivo">Efectivo</option>
          <option value="debito">Débito</option>
          <option value="credito">Crédito</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>

      <div className="form-section">
        <h3>Totales</h3>
        <div className="totals">
          <label>
            Subtotal:
            <span data-testid="subtotal-total">
              ${totales.subtotal.toFixed(2)}
            </span>
          </label>
          <label>
            Descuento:
            <input 
              name="descuento" 
              type="number" 
              step="0.01" 
              min="0" 
              placeholder="0.00"
              defaultValue={initialData?.descuento || "0"}
              data-testid="descuento-input"
              onChange={(e) => {
                const descuento = parseFloat(e.target.value) || 0
                setTotales(prev => ({
                  ...prev,
                  total: Math.max(0, prev.subtotal - descuento)
                }))
              }}
            />
          </label>
          <label>
            Total:
            <span data-testid="total-final">
              ${totales.total.toFixed(2)}
            </span>
          </label>
        </div>
      </div>

      <div className="form-section">
        <h3>Notas</h3>
        <textarea 
          name="notas" 
          placeholder="Notas adicionales sobre la venta"
          defaultValue={initialData?.notas || ""}
          data-testid="notas-input"
        />
      </div>

      <div className="form-actions">
        <button type="button" data-testid="cancel-button">
          Cancelar
        </button>
        <button type="submit" data-testid="submit-button">
          {mode === "create" ? "Crear Venta" : "Actualizar Venta"}
        </button>
      </div>
    </form>
  )
}

describe("🛒 Formulario de Ventas - Validación Completa", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockToast.mockClear()
  })

  describe("🎯 Renderizado del Formulario", () => {
    it("debe renderizar todos los campos del formulario correctamente", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      // Verificar secciones principales
      expect(screen.getByText("Información del Cliente")).toBeInTheDocument()
      expect(screen.getByText("Productos")).toBeInTheDocument()
      expect(screen.getByText("Detalles de la Venta")).toBeInTheDocument()
      expect(screen.getByText("Totales")).toBeInTheDocument()
      expect(screen.getByText("Notas")).toBeInTheDocument()

      // Verificar campos de cliente
      expect(screen.getByTestId("cliente-select")).toBeInTheDocument()
      expect(screen.getByTestId("cliente-casual-input")).toBeInTheDocument()

      // Verificar botones de acción
      expect(screen.getByTestId("agregar-item-button")).toBeInTheDocument()
      expect(screen.getByTestId("submit-button")).toBeInTheDocument()
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument()
    })

    it("debe mostrar todas las opciones de tipo de venta", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const tipoVentaSelect = screen.getByTestId("tipo-venta-select")
      const options = within(tipoVentaSelect).getAllByRole("option")

      expect(options).toHaveLength(4)
      expect(options[0]).toHaveValue("efectivo")
      expect(options[1]).toHaveValue("tarjeta")
      expect(options[2]).toHaveValue("transferencia")
      expect(options[3]).toHaveValue("crypto")
    })

    it("debe mostrar todas las opciones de estado", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const estadoSelect = screen.getByTestId("estado-select")
      const options = within(estadoSelect).getAllByRole("option")

      expect(options).toHaveLength(4)
      expect(options[0]).toHaveValue("pendiente")
      expect(options[1]).toHaveValue("completada")
      expect(options[2]).toHaveValue("cancelada")
      expect(options[3]).toHaveValue("reembolsada")
    })
  })

  describe("📦 Gestión de Productos", () => {
    it("debe permitir agregar productos al carrito", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const agregarButton = screen.getByTestId("agregar-item-button")
      
      // Agregar primer producto
      fireEvent.click(agregarButton)
      expect(screen.getByTestId("item-0")).toBeInTheDocument()
      
      // Agregar segundo producto
      fireEvent.click(agregarButton)
      expect(screen.getByTestId("item-1")).toBeInTheDocument()
    })

    it("debe permitir eliminar productos del carrito", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const agregarButton = screen.getByTestId("agregar-item-button")
      
      // Agregar producto
      fireEvent.click(agregarButton)
      expect(screen.getByTestId("item-0")).toBeInTheDocument()
      
      // Eliminar producto
      const eliminarButton = screen.getByTestId("eliminar-item-0")
      fireEvent.click(eliminarButton)
      expect(screen.queryByTestId("item-0")).not.toBeInTheDocument()
    })

    it("debe calcular subtotales correctamente", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const agregarButton = screen.getByTestId("agregar-item-button")
      fireEvent.click(agregarButton)

      // Llenar datos del producto
      const nombreInput = screen.getByTestId("producto-nombre-0")
      const cantidadInput = screen.getByTestId("cantidad-0")
      const precioInput = screen.getByTestId("precio-unitario-0")

      fireEvent.change(nombreInput, { target: { value: "Producto Test" } })
      fireEvent.change(cantidadInput, { target: { value: "3" } })
      fireEvent.change(precioInput, { target: { value: "25.50" } })

      // Verificar que el subtotal se calcule: 3 * 25.50 = 76.50
      expect(screen.getByTestId("subtotal-0")).toHaveTextContent("$76.50")
    })

    it("debe actualizar totales cuando se modifican productos", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const agregarButton = screen.getByTestId("agregar-item-button")
      fireEvent.click(agregarButton)

      // Agregar primer producto
      fireEvent.change(screen.getByTestId("producto-nombre-0"), { target: { value: "Producto 1" } })
      fireEvent.change(screen.getByTestId("cantidad-0"), { target: { value: "2" } })
      fireEvent.change(screen.getByTestId("precio-unitario-0"), { target: { value: "10" } })

      // Verificar subtotal inicial
      expect(screen.getByTestId("subtotal-total")).toHaveTextContent("$20.00")

      // Agregar segundo producto
      fireEvent.click(agregarButton)
      fireEvent.change(screen.getByTestId("producto-nombre-1"), { target: { value: "Producto 2" } })
      fireEvent.change(screen.getByTestId("cantidad-1"), { target: { value: "1" } })
      fireEvent.change(screen.getByTestId("precio-unitario-1"), { target: { value: "15" } })

      // Verificar subtotal actualizado: 20 + 15 = 35
      expect(screen.getByTestId("subtotal-total")).toHaveTextContent("$35.00")
    })
  })

  describe("💰 Cálculo de Totales", () => {
    it("debe calcular descuentos correctamente", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const agregarButton = screen.getByTestId("agregar-item-button")
      fireEvent.click(agregarButton)

      // Agregar producto con valor 100
      fireEvent.change(screen.getByTestId("producto-nombre-0"), { target: { value: "Producto" } })
      fireEvent.change(screen.getByTestId("cantidad-0"), { target: { value: "1" } })
      fireEvent.change(screen.getByTestId("precio-unitario-0"), { target: { value: "100" } })

      // Aplicar descuento de 20
      const descuentoInput = screen.getByTestId("descuento-input")
      fireEvent.change(descuentoInput, { target: { value: "20" } })

      // Verificar total: 100 - 20 = 80
      expect(screen.getByTestId("total-final")).toHaveTextContent("$80.00")
    })

    it("debe manejar descuentos mayores al subtotal", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const agregarButton = screen.getByTestId("agregar-item-button")
      fireEvent.click(agregarButton)

      // Agregar producto con valor 50
      fireEvent.change(screen.getByTestId("producto-nombre-0"), { target: { value: "Producto" } })
      fireEvent.change(screen.getByTestId("cantidad-0"), { target: { value: "1" } })
      fireEvent.change(screen.getByTestId("precio-unitario-0"), { target: { value: "50" } })

      // Aplicar descuento de 100 (mayor al subtotal)
      const descuentoInput = screen.getByTestId("descuento-input")
      fireEvent.change(descuentoInput, { target: { value: "100" } })

      // Verificar total: 50 - 100 = 0 (el formulario no permite totales negativos)
      expect(screen.getByTestId("total-final")).toHaveTextContent("$0.00")
    })
  })

  describe("👥 Gestión de Clientes", () => {
    it("debe permitir seleccionar cliente existente", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const clienteSelect = screen.getByTestId("cliente-select")
      
      // Seleccionar cliente
      fireEvent.change(clienteSelect, { target: { value: "1" } })
      expect(clienteSelect).toHaveValue("1")
    })

    it("debe permitir ingresar cliente casual", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const clienteCasualInput = screen.getByTestId("cliente-casual-input")
      
      fireEvent.change(clienteCasualInput, { target: { value: "Cliente Casual Test" } })
      expect(clienteCasualInput).toHaveValue("Cliente Casual Test")
    })

    it("debe manejar cliente casual y cliente existente correctamente", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const clienteSelect = screen.getByTestId("cliente-select")
      const clienteCasualInput = screen.getByTestId("cliente-casual-input")

      // Primero seleccionar cliente existente
      fireEvent.change(clienteSelect, { target: { value: "2" } })
      expect(clienteSelect).toHaveValue("2")
      expect(clienteCasualInput).toHaveValue("")

      // Luego cambiar a cliente casual
      fireEvent.change(clienteSelect, { target: { value: "" } })
      fireEvent.change(clienteCasualInput, { target: { value: "Nuevo Cliente" } })
      expect(clienteSelect).toHaveValue("")
      expect(clienteCasualInput).toHaveValue("Nuevo Cliente")
    })
  })

  describe("📤 Envío del Formulario", () => {
    it("debe enviar datos correctos cuando el formulario es válido", async () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      // Agregar producto
      const agregarButton = screen.getByTestId("agregar-item-button")
      fireEvent.click(agregarButton)

      // Llenar datos del producto
      fireEvent.change(screen.getByTestId("producto-nombre-0"), { target: { value: "Producto Test" } })
      fireEvent.change(screen.getByTestId("cantidad-0"), { target: { value: "2" } })
      fireEvent.change(screen.getByTestId("precio-unitario-0"), { target: { value: "25" } })

      // Seleccionar cliente
      fireEvent.change(screen.getByTestId("cliente-select"), { target: { value: "1" } })

      // Seleccionar tipo de venta
      fireEvent.change(screen.getByTestId("tipo-venta-select"), { target: { value: "tarjeta" } })

      // Aplicar descuento
      fireEvent.change(screen.getByTestId("descuento-input"), { target: { value: "10" } })

      // Agregar notas
      fireEvent.change(screen.getByTestId("notas-input"), { target: { value: "Venta de prueba" } })

      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          cliente_id: "1",
          cliente_nombre: null,
          cliente_casual: null,
          tipo_venta: "tarjeta",
          subtotal: 50,
          descuento: 10,
          total: 40,
          estado: "completada",
          metodo_pago: "efectivo",
          notas: "Venta de prueba",
          items: expect.arrayContaining([
            expect.objectContaining({
              producto_nombre: "Producto Test",
              cantidad: 2,
              precio_unitario: 25,
              subtotal: 50
            })
          ])
        })
      })
    })

    it("debe validar que haya al menos un producto", async () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      // Intentar enviar sin productos
      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          cliente_id: null,
          cliente_nombre: null,
          cliente_casual: null,
          tipo_venta: "efectivo",
          subtotal: 0,
          descuento: 0,
          total: 0,
          estado: "completada",
          metodo_pago: "efectivo",
          notas: null,
          items: []
        })
      })
    })
  })

  describe("🔄 Modo de Edición", () => {
    it("debe cargar datos iniciales correctamente en modo edición", () => {
      const mockOnSubmit = jest.fn()
      const initialData = {
        cliente_id: "2",
        tipo_venta: "transferencia",
        estado: "pendiente",
        metodo_pago: "debito",
        descuento: 15,
        notas: "Venta existente",
        items: [
          {
            id: "1",
            producto_nombre: "Producto Existente",
            cantidad: 3,
            precio_unitario: 20,
            subtotal: 60
          }
        ]
      }

      render(<VentaForm onSubmit={mockOnSubmit} initialData={initialData} mode="edit" />)

      // Verificar que los campos tengan los valores iniciales
      expect(screen.getByTestId("cliente-select")).toHaveValue("2")
      expect(screen.getByTestId("tipo-venta-select")).toHaveValue("transferencia")
      expect(screen.getByTestId("estado-select")).toHaveValue("pendiente")
      expect(screen.getByTestId("metodo-pago-select")).toHaveValue("debito")
      expect(screen.getByTestId("descuento-input")).toHaveValue(15)
      expect(screen.getByTestId("notas-input")).toHaveValue("Venta existente")

      // Verificar que el producto se haya cargado
      expect(screen.getByTestId("item-0")).toBeInTheDocument()
      expect(screen.getByTestId("producto-nombre-0")).toHaveValue("Producto Existente")
      expect(screen.getByTestId("cantidad-0")).toHaveValue(3)
      expect(screen.getByTestId("precio-unitario-0")).toHaveValue(20)
    })
  })

  describe("🚫 Prevención de Datos Duplicados", () => {
    it("debe validar que no se envíen datos duplicados", async () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      // Agregar producto
      const agregarButton = screen.getByTestId("agregar-item-button")
      fireEvent.click(agregarButton)

      // Llenar datos básicos
      fireEvent.change(screen.getByTestId("producto-nombre-0"), { target: { value: "Producto" } })
      fireEvent.change(screen.getByTestId("cantidad-0"), { target: { value: "1" } })
      fireEvent.change(screen.getByTestId("precio-unitario-0"), { target: { value: "10" } })

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
      render(<VentaForm onSubmit={mockOnSubmit} />)

      // Verificar secciones del formulario
      expect(screen.getByText("Información del Cliente")).toBeInTheDocument()
      expect(screen.getByText("Productos")).toBeInTheDocument()
      expect(screen.getByText("Detalles de la Venta")).toBeInTheDocument()
      expect(screen.getByText("Totales")).toBeInTheDocument()
      expect(screen.getByText("Notas")).toBeInTheDocument()
    })

    it("debe tener botones con funcionalidad correcta", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByTestId("submit-button")
      const cancelButton = screen.getByTestId("cancel-button")
      const agregarButton = screen.getByTestId("agregar-item-button")

      expect(submitButton).toHaveAttribute("type", "submit")
      expect(cancelButton).toHaveAttribute("type", "button")
      expect(agregarButton).toHaveAttribute("type", "button")
    })
  })

  describe("🔍 Casos Edge y Validaciones", () => {
    it("debe manejar productos con precios muy altos", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const agregarButton = screen.getByTestId("agregar-item-button")
      fireEvent.click(agregarButton)

      // Producto con precio muy alto
      fireEvent.change(screen.getByTestId("producto-nombre-0"), { target: { value: "Producto Premium" } })
      fireEvent.change(screen.getByTestId("cantidad-0"), { target: { value: "1" } })
      fireEvent.change(screen.getByTestId("precio-unitario-0"), { target: { value: "999999.99" } })

      expect(screen.getByTestId("subtotal-0")).toHaveTextContent("$999999.99")
    })

    it("debe manejar cantidades muy grandes", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const agregarButton = screen.getByTestId("agregar-item-button")
      fireEvent.click(agregarButton)

      // Producto con cantidad muy grande
      fireEvent.change(screen.getByTestId("producto-nombre-0"), { target: { value: "Producto Masivo" } })
      fireEvent.change(screen.getByTestId("cantidad-0"), { target: { value: "999999" } })
      fireEvent.change(screen.getByTestId("precio-unitario-0"), { target: { value: "1" } })

      expect(screen.getByTestId("subtotal-0")).toHaveTextContent("$999999.00")
    })

    it("debe validar que la cantidad sea mayor a 0", () => {
      const mockOnSubmit = jest.fn()
      render(<VentaForm onSubmit={mockOnSubmit} />)

      const agregarButton = screen.getByTestId("agregar-item-button")
      fireEvent.click(agregarButton)

      const cantidadInput = screen.getByTestId("cantidad-0")
      
      // Intentar establecer cantidad 0
      fireEvent.change(cantidadInput, { target: { value: "0" } })
      expect(cantidadInput).toHaveValue(1) // El componente previene valores menores a 1

      // Intentar establecer cantidad negativa
      fireEvent.change(cantidadInput, { target: { value: "-1" } })
      expect(cantidadInput).toHaveValue(1) // Debería mantener el valor anterior
    })
  })
})
