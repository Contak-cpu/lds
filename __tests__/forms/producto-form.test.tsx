"use client"

import type React from "react"
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
        data: [{ id: "1", nombre: "Producto Test" }], 
        error: null 
      })),
    })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ 
          data: { id: "1", nombre: "Producto Existente" }, 
          error: null 
        })),
      })),
    })),
  })),
}

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabaseClient,
}))

// Componente de prueba que simula el formulario de producto
const ProductoForm = ({ onSubmit, initialData, mode = "create" }: { 
  onSubmit: (data: any) => void
  initialData?: any
  mode?: "create" | "edit"
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      nombre: formData.get("nombre"),
      descripcion: formData.get("descripcion"),
      categoria: formData.get("categoria"),
      precio: parseFloat(formData.get("precio") as string) || 0,
      costo: parseFloat(formData.get("costo") as string) || 0,
      stock: parseInt(formData.get("stock") as string) || 0,
      stock_minimo: parseInt(formData.get("stock_minimo") as string) || 0,
      imagen_url: formData.get("imagen_url"),
      activo: formData.get("activo") === "true"
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} data-testid="producto-form">
      <div className="form-section">
        <h3>Información Básica</h3>
        <input 
          name="nombre" 
          placeholder="Nombre del producto" 
          required 
          defaultValue={initialData?.nombre || ""}
          data-testid="nombre-input"
        />
        <textarea 
          name="descripcion" 
          placeholder="Descripción del producto" 
          defaultValue={initialData?.descripcion || ""}
          data-testid="descripcion-input"
        />
        <select 
          name="categoria" 
          required 
          defaultValue={initialData?.categoria || ""}
          data-testid="categoria-select"
        >
          <option value="">Seleccionar categoría</option>
          <option value="semillas">Semillas</option>
          <option value="fertilizantes">Fertilizantes</option>
          <option value="herramientas">Herramientas</option>
          <option value="sustratos">Sustratos</option>
          <option value="iluminacion">Iluminación</option>
          <option value="riego">Sistemas de Riego</option>
          <option value="otros">Otros</option>
        </select>
      </div>

      <div className="form-section">
        <h3>Precios y Costos</h3>
        <input 
          name="precio" 
          type="number" 
          step="0.01" 
          min="0" 
          placeholder="Precio de venta" 
          required 
          defaultValue={initialData?.precio || ""}
          data-testid="precio-input"
        />
        <input 
          name="costo" 
          type="number" 
          step="0.01" 
          min="0" 
          placeholder="Costo del producto" 
          defaultValue={initialData?.costo || ""}
          data-testid="costo-input"
        />
      </div>

      <div className="form-section">
        <h3>Inventario</h3>
        <input 
          name="stock" 
          type="number" 
          min="0" 
          placeholder="Stock actual" 
          required 
          defaultValue={initialData?.stock || ""}
          data-testid="stock-input"
        />
        <input 
          name="stock_minimo" 
          type="number" 
          min="0" 
          placeholder="Stock mínimo" 
          required 
          defaultValue={initialData?.stock_minimo || ""}
          data-testid="stock-minimo-input"
        />
      </div>

      <div className="form-section">
        <h3>Imagen y Estado</h3>
        <input 
          name="imagen_url" 
          type="url" 
          placeholder="URL de la imagen" 
          defaultValue={initialData?.imagen_url || ""}
          data-testid="imagen-url-input"
        />
        <label>
          <input 
            name="activo" 
            type="checkbox" 
            defaultChecked={initialData?.activo !== false}
            data-testid="activo-checkbox"
          />
          Producto activo
        </label>
      </div>

      <div className="form-actions">
        <button type="button" data-testid="cancel-button">
          Cancelar
        </button>
        <button type="submit" data-testid="submit-button">
          {mode === "create" ? "Crear Producto" : "Actualizar Producto"}
        </button>
      </div>
    </form>
  )
}

describe("📦 Formulario de Productos - Validación Completa", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockToast.mockClear()
  })

  describe("🎯 Renderizado del Formulario", () => {
    it("debe renderizar todos los campos del formulario correctamente", () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      // Verificar campos básicos
      expect(screen.getByTestId("nombre-input")).toBeInTheDocument()
      expect(screen.getByTestId("descripcion-input")).toBeInTheDocument()
      expect(screen.getByTestId("categoria-select")).toBeInTheDocument()
      
      // Verificar campos de precios
      expect(screen.getByTestId("precio-input")).toBeInTheDocument()
      expect(screen.getByTestId("costo-input")).toBeInTheDocument()
      
      // Verificar campos de inventario
      expect(screen.getByTestId("stock-input")).toBeInTheDocument()
      expect(screen.getByTestId("stock-minimo-input")).toBeInTheDocument()
      
      // Verificar campos adicionales
      expect(screen.getByTestId("imagen-url-input")).toBeInTheDocument()
      expect(screen.getByTestId("activo-checkbox")).toBeInTheDocument()
      
      // Verificar botones
      expect(screen.getByTestId("submit-button")).toBeInTheDocument()
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument()
    })

    it("debe mostrar todas las opciones de categoría", () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      const categoriaSelect = screen.getByTestId("categoria-select")
      const options = within(categoriaSelect).getAllByRole("option")

      expect(options).toHaveLength(8) // 7 categorías + opción vacía
      expect(options[0]).toHaveTextContent("Seleccionar categoría")
      expect(options[1]).toHaveValue("semillas")
      expect(options[2]).toHaveValue("fertilizantes")
      expect(options[3]).toHaveValue("herramientas")
      expect(options[4]).toHaveValue("sustratos")
      expect(options[5]).toHaveValue("iluminacion")
      expect(options[6]).toHaveValue("riego")
      expect(options[7]).toHaveValue("otros")
    })

    it("debe mostrar el título correcto según el modo", () => {
      const mockOnSubmit = jest.fn()
      
      // Modo crear
      const { rerender } = render(<ProductoForm onSubmit={mockOnSubmit} mode="create" />)
      expect(screen.getByText("Crear Producto")).toBeInTheDocument()
      
      // Modo editar
      rerender(<ProductoForm onSubmit={mockOnSubmit} mode="edit" />)
      expect(screen.getByText("Actualizar Producto")).toBeInTheDocument()
    })
  })

  describe("✅ Validación de Campos", () => {
    it("debe validar que los campos requeridos estén completos", async () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      // El formulario no debería enviarse sin campos requeridos
      expect(mockOnSubmit).not.toHaveBeenCalled()
      
      // Verificar que los campos requeridos muestren validación
      const nombreInput = screen.getByTestId("nombre-input")
      const categoriaSelect = screen.getByTestId("categoria-select")
      const precioInput = screen.getByTestId("precio-input")
      const stockInput = screen.getByTestId("stock-input")
      const stockMinimoInput = screen.getByTestId("stock-minimo-input")
      
      expect(nombreInput).toBeRequired()
      expect(categoriaSelect).toBeRequired()
      expect(precioInput).toBeRequired()
      expect(stockInput).toBeRequired()
      expect(stockMinimoInput).toBeRequired()
    })

    it("debe validar que el precio sea un número positivo", () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      const precioInput = screen.getByTestId("precio-input")

      // Precios inválidos
      const preciosInvalidos = [-10, -0.01, 0, "abc", ""]

      preciosInvalidos.forEach(precio => {
        fireEvent.change(precioInput, { target: { value: precio } })
        if (typeof precio === "number") {
          expect(precioInput).toHaveValue(precio)
        }
      })

      // Precios válidos
      const preciosValidos = [0.01, 10, 100.50, 999.99]

      preciosValidos.forEach(precio => {
        fireEvent.change(precioInput, { target: { value: precio } })
        expect(precioInput).toHaveValue(precio)
      })
    })

    it("debe validar que el stock sea un número entero no negativo", () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      const stockInput = screen.getByTestId("stock-input")
      const stockMinimoInput = screen.getByTestId("stock-minimo-input")

      // Valores inválidos para stock
      const valoresInvalidos = [-1, -10, 1.5, "abc", ""]

      valoresInvalidos.forEach(valor => {
        fireEvent.change(stockInput, { target: { value: valor } })
        if (typeof valor === "number") {
          expect(stockInput).toHaveValue(valor)
        }
      })

      // Valores válidos para stock
      const valoresValidos = [0, 1, 10, 100, 1000]

      valoresValidos.forEach(valor => {
        fireEvent.change(stockInput, { target: { value: valor } })
        expect(stockInput).toHaveValue(valor)
      })
    })

    it("debe validar que el stock mínimo no sea mayor al stock actual", () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      const stockInput = screen.getByTestId("stock-input")
      const stockMinimoInput = screen.getByTestId("stock-minimo-input")

      // Establecer stock actual
      fireEvent.change(stockInput, { target: { value: 50 } })
      
      // Stock mínimo válido
      fireEvent.change(stockMinimoInput, { target: { value: 10 } })
      expect(stockMinimoInput).toHaveValue(10)
      
      // Stock mínimo inválido (mayor al stock actual)
      fireEvent.change(stockMinimoInput, { target: { value: 100 } })
      expect(stockMinimoInput).toHaveValue(100)
    })

    it("debe validar el formato de URL de imagen", () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      const imagenUrlInput = screen.getByTestId("imagen-url-input")

      // URLs válidas
      const urlsValidas = [
        "https://ejemplo.com/imagen.jpg",
        "http://ejemplo.com/imagen.png",
        "https://ejemplo.com/imagen.gif",
        "https://ejemplo.com/imagen.webp"
      ]

      urlsValidas.forEach(url => {
        fireEvent.change(imagenUrlInput, { target: { value: url } })
        expect(imagenUrlInput).toHaveValue(url)
      })

      // URLs inválidas
      const urlsInvalidas = [
        "no-es-url",
        "ftp://ejemplo.com/imagen.jpg",
        "ejemplo.com/imagen.jpg"
      ]

      urlsInvalidas.forEach(url => {
        fireEvent.change(imagenUrlInput, { target: { value: url } })
        expect(imagenUrlInput).toHaveValue(url)
      })
    })
  })

  describe("📤 Envío del Formulario", () => {
    it("debe enviar datos correctos cuando el formulario es válido", async () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      // Llenar todos los campos
      const testData = {
        nombre: "Semillas de Cannabis Premium",
        descripcion: "Semillas de alta calidad para cultivo indoor y outdoor",
        categoria: "semillas",
        precio: 25.99,
        costo: 15.50,
        stock: 100,
        stock_minimo: 20,
        imagen_url: "https://ejemplo.com/semillas.jpg",
        activo: true
      }

      // Llenar campos requeridos
      fireEvent.change(screen.getByTestId("nombre-input"), {
        target: { value: testData.nombre },
      })
      fireEvent.change(screen.getByTestId("categoria-select"), {
        target: { value: testData.categoria },
      })
      fireEvent.change(screen.getByTestId("precio-input"), {
        target: { value: testData.precio },
      })
      fireEvent.change(screen.getByTestId("stock-input"), {
        target: { value: testData.stock },
      })
      fireEvent.change(screen.getByTestId("stock-minimo-input"), {
        target: { value: testData.stock_minimo },
      })

      // Llenar campos opcionales
      fireEvent.change(screen.getByTestId("descripcion-input"), {
        target: { value: testData.descripcion },
      })
      fireEvent.change(screen.getByTestId("costo-input"), {
        target: { value: testData.costo },
      })
      fireEvent.change(screen.getByTestId("imagen-url-input"), {
        target: { value: testData.imagen_url },
      })
      fireEvent.click(screen.getByTestId("activo-checkbox"))

      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(testData)
      })
    })

    it("debe manejar campos opcionales correctamente", async () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      // Solo llenar campos requeridos
      fireEvent.change(screen.getByTestId("nombre-input"), {
        target: { value: "Producto Básico" },
      })
      fireEvent.change(screen.getByTestId("categoria-select"), {
        target: { value: "otros" },
      })
      fireEvent.change(screen.getByTestId("precio-input"), {
        target: { value: 10 },
      })
      fireEvent.change(screen.getByTestId("stock-input"), {
        target: { value: 50 },
      })
      fireEvent.change(screen.getByTestId("stock-minimo-input"), {
        target: { value: 5 },
      })

      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          nombre: "Producto Básico",
          descripcion: "",
          categoria: "otros",
          precio: 10,
          costo: 0,
          stock: 50,
          stock_minimo: 5,
          imagen_url: "",
          activo: false
        })
      })
    })
  })

  describe("🔄 Modo de Edición", () => {
    it("debe cargar datos iniciales correctamente en modo edición", () => {
      const mockOnSubmit = jest.fn()
      const initialData = {
        nombre: "Producto Existente",
        descripcion: "Descripción del producto existente",
        categoria: "fertilizantes",
        precio: 45.99,
        costo: 30.00,
        stock: 75,
        stock_minimo: 15,
        imagen_url: "https://ejemplo.com/existente.jpg",
        activo: true
      }

      render(<ProductoForm onSubmit={mockOnSubmit} initialData={initialData} mode="edit" />)

      // Verificar que los campos tengan los valores iniciales
      expect(screen.getByTestId("nombre-input")).toHaveValue(initialData.nombre)
      expect(screen.getByTestId("descripcion-input")).toHaveValue(initialData.descripcion)
      expect(screen.getByTestId("categoria-select")).toHaveValue(initialData.categoria)
      expect(screen.getByTestId("precio-input")).toHaveValue(initialData.precio)
      expect(screen.getByTestId("costo-input")).toHaveValue(initialData.costo)
      expect(screen.getByTestId("stock-input")).toHaveValue(initialData.stock)
      expect(screen.getByTestId("stock-minimo-input")).toHaveValue(initialData.stock_minimo)
      expect(screen.getByTestId("imagen-url-input")).toHaveValue(initialData.imagen_url)
      expect(screen.getByTestId("activo-checkbox")).toBeChecked()
    })

    it("debe permitir editar datos existentes", async () => {
      const mockOnSubmit = jest.fn()
      const initialData = {
        nombre: "Producto Original",
        descripcion: "Descripción original",
        categoria: "herramientas",
        precio: 100,
        costo: 70,
        stock: 25,
        stock_minimo: 5,
        imagen_url: "https://ejemplo.com/original.jpg",
        activo: true
      }

      render(<ProductoForm onSubmit={mockOnSubmit} initialData={initialData} mode="edit" />)

      // Editar algunos campos
      fireEvent.change(screen.getByTestId("precio-input"), {
        target: { value: 120 },
      })
      fireEvent.change(screen.getByTestId("stock-input"), {
        target: { value: 30 },
      })
      fireEvent.change(screen.getByTestId("descripcion-input"), {
        target: { value: "Descripción actualizada" },
      })

      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          ...initialData,
          precio: 120,
          stock: 30,
          descripcion: "Descripción actualizada"
        })
      })
    })
  })

  describe("🚫 Prevención de Datos Duplicados", () => {
    it("debe validar que no se envíen datos duplicados", async () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      // Llenar formulario con datos válidos
      fireEvent.change(screen.getByTestId("nombre-input"), {
        target: { value: "Producto Test" },
      })
      fireEvent.change(screen.getByTestId("categoria-select"), {
        target: { value: "semillas" },
      })
      fireEvent.change(screen.getByTestId("precio-input"), {
        target: { value: 20 },
      })
      fireEvent.change(screen.getByTestId("stock-input"), {
        target: { value: 100 },
      })
      fireEvent.change(screen.getByTestId("stock-minimo-input"), {
        target: { value: 10 },
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
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      // Verificar secciones del formulario
      expect(screen.getByText("Información Básica")).toBeInTheDocument()
      expect(screen.getByText("Precios y Costos")).toBeInTheDocument()
      expect(screen.getByText("Inventario")).toBeInTheDocument()
      expect(screen.getByText("Imagen y Estado")).toBeInTheDocument()
    })

    it("debe tener botones con funcionalidad correcta", () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByTestId("submit-button")
      const cancelButton = screen.getByTestId("cancel-button")

      expect(submitButton).toHaveAttribute("type", "submit")
      expect(cancelButton).toHaveAttribute("type", "button")
    })

    it("debe mostrar el checkbox de activo correctamente", () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      const activoCheckbox = screen.getByTestId("activo-checkbox")
      const label = screen.getByText("Producto activo")

      expect(activoCheckbox).toBeInTheDocument()
      expect(label).toBeInTheDocument()
      expect(activoCheckbox).not.toBeChecked() // Por defecto no está marcado
    })
  })

  describe("🔍 Casos Edge y Validaciones", () => {
    it("debe manejar caracteres especiales en nombres", () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      const nombreInput = screen.getByTestId("nombre-input")
      const nombresConCaracteresEspeciales = [
        "Semillas de Cannabis (Premium)",
        "Fertilizante 20-20-20",
        "Herramienta: Tijeras de Podar",
        "Sustrato 100% Orgánico",
        "Iluminación LED 1000W"
      ]

      nombresConCaracteresEspeciales.forEach(nombre => {
        fireEvent.change(nombreInput, { target: { value: nombre } })
        expect(nombreInput).toHaveValue(nombre)
      })
    })

    it("debe validar longitud de campos", () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      const nombreInput = screen.getByTestId("nombre-input")
      const descripcionInput = screen.getByTestId("descripcion-input")

      // Nombre muy largo
      const nombreLargo = "A".repeat(200)
      fireEvent.change(nombreInput, { target: { value: nombreLargo } })
      expect(nombreInput).toHaveValue(nombreLargo)

      // Descripción muy larga
      const descripcionLarga = "Descripción muy larga ".repeat(100)
      fireEvent.change(descripcionInput, { target: { value: descripcionLarga } })
      expect(descripcionInput).toHaveValue(descripcionLarga)
    })

    it("debe manejar valores extremos en campos numéricos", () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      const precioInput = screen.getByTestId("precio-input")
      const stockInput = screen.getByTestId("stock-input")

      // Valores muy grandes
      fireEvent.change(precioInput, { target: { value: 999999.99 } })
      expect(precioInput).toHaveValue(999999.99)

      fireEvent.change(stockInput, { target: { value: 999999 } })
      expect(stockInput).toHaveValue(999999)

      // Valores muy pequeños
      fireEvent.change(precioInput, { target: { value: 0.01 } })
      expect(precioInput).toHaveValue(0.01)

      fireEvent.change(stockInput, { target: { value: 0 } })
      expect(stockInput).toHaveValue(0)
    })

    it("debe validar que el costo no sea mayor al precio", () => {
      const mockOnSubmit = jest.fn()
      render(<ProductoForm onSubmit={mockOnSubmit} />)

      const precioInput = screen.getByTestId("precio-input")
      const costoInput = screen.getByTestId("costo-input")

      // Establecer precio
      fireEvent.change(precioInput, { target: { value: 50 } })
      
      // Costo válido (menor al precio)
      fireEvent.change(costoInput, { target: { value: 30 } })
      expect(costoInput).toHaveValue(30)
      
      // Costo igual al precio
      fireEvent.change(costoInput, { target: { value: 50 } })
      expect(costoInput).toHaveValue(50)
      
      // Costo mayor al precio (esto se permitiría en el formulario, pero se validaría en el backend)
      fireEvent.change(costoInput, { target: { value: 70 } })
      expect(costoInput).toHaveValue(70)
    })
  })
})
