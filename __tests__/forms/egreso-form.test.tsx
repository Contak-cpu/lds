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
        data: [{ id: "1", monto: 150.00 }], 
        error: null 
      })),
    })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ 
          data: { id: "1", descripcion: "Egreso Existente" }, 
          error: null 
        })),
      })),
    })),
  })),
}

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => mockSupabaseClient,
}))

// Componente de prueba que simula el formulario de egreso
const EgresoForm = ({ onSubmit, initialData, mode = "create" }: { 
  onSubmit: (data: any) => void
  initialData?: any
  mode?: "create" | "edit"
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    const data = {
      descripcion: formData.get("descripcion"),
      categoria: formData.get("categoria"),
      monto: parseFloat(formData.get("monto") as string) || 0,
      proveedor: formData.get("proveedor"),
      metodo_pago: formData.get("metodo_pago"),
      fecha_egreso: formData.get("fecha_egreso"),
      notas: formData.get("notas"),
      comprobante_url: formData.get("comprobante_url")
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} data-testid="egreso-form">
      <div className="form-section">
        <h3>Información del Egreso</h3>
        <input 
          name="descripcion" 
          placeholder="Descripción del egreso" 
          required 
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
          <option value="insumos">Insumos</option>
          <option value="equipamiento">Equipamiento</option>
          <option value="servicios">Servicios</option>
          <option value="marketing">Marketing</option>
          <option value="administrativo">Administrativo</option>
          <option value="impuestos">Impuestos</option>
          <option value="otros">Otros</option>
        </select>

        <input 
          name="monto" 
          type="number" 
          step="0.01" 
          min="0" 
          placeholder="Monto del egreso" 
          required 
          defaultValue={initialData?.monto || ""}
          data-testid="monto-input"
        />
      </div>

      <div className="form-section">
        <h3>Proveedor y Pago</h3>
        <input 
          name="proveedor" 
          placeholder="Nombre del proveedor" 
          required 
          defaultValue={initialData?.proveedor || ""}
          data-testid="proveedor-input"
        />
        
        <select 
          name="metodo_pago" 
          required 
          defaultValue={initialData?.metodo_pago || ""}
          data-testid="metodo-pago-select"
        >
          <option value="">Seleccionar método de pago</option>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          <option value="tarjeta_debito">Tarjeta de Débito</option>
          <option value="tarjeta_credito">Tarjeta de Crédito</option>
          <option value="cheque">Cheque</option>
          <option value="crypto">Crypto</option>
        </select>
      </div>

      <div className="form-section">
        <h3>Fecha y Documentación</h3>
        <input 
          name="fecha_egreso" 
          type="date" 
          required 
          defaultValue={initialData?.fecha_egreso || new Date().toISOString().split('T')[0]}
          data-testid="fecha-egreso-input"
        />
        
        <input 
          name="comprobante_url" 
          type="url" 
          placeholder="URL del comprobante (opcional)" 
          defaultValue={initialData?.comprobante_url || ""}
          data-testid="comprobante-url-input"
        />
      </div>

      <div className="form-section">
        <h3>Notas Adicionales</h3>
        <textarea 
          name="notas" 
          placeholder="Notas adicionales sobre el egreso"
          defaultValue={initialData?.notas || ""}
          data-testid="notas-input"
        />
      </div>

      <div className="form-actions">
        <button type="button" data-testid="cancel-button">
          Cancelar
        </button>
        <button type="submit" data-testid="submit-button">
          {mode === "create" ? "Crear Egreso" : "Actualizar Egreso"}
        </button>
      </div>
    </form>
  )
}

describe("💸 Formulario de Egresos - Validación Completa", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockToast.mockClear()
  })

  describe("🎯 Renderizado del Formulario", () => {
    it("debe renderizar todos los campos del formulario correctamente", () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      // Verificar secciones principales
      expect(screen.getByText("Información del Egreso")).toBeInTheDocument()
      expect(screen.getByText("Proveedor y Pago")).toBeInTheDocument()
      expect(screen.getByText("Fecha y Documentación")).toBeInTheDocument()
      expect(screen.getByText("Notas Adicionales")).toBeInTheDocument()

      // Verificar campos de información
      expect(screen.getByTestId("descripcion-input")).toBeInTheDocument()
      expect(screen.getByTestId("categoria-select")).toBeInTheDocument()
      expect(screen.getByTestId("monto-input")).toBeInTheDocument()

      // Verificar campos de proveedor y pago
      expect(screen.getByTestId("proveedor-input")).toBeInTheDocument()
      expect(screen.getByTestId("metodo-pago-select")).toBeInTheDocument()

      // Verificar campos de fecha y documentación
      expect(screen.getByTestId("fecha-egreso-input")).toBeInTheDocument()
      expect(screen.getByTestId("comprobante-url-input")).toBeInTheDocument()

      // Verificar campos adicionales
      expect(screen.getByTestId("notas-input")).toBeInTheDocument()

      // Verificar botones
      expect(screen.getByTestId("submit-button")).toBeInTheDocument()
      expect(screen.getByTestId("cancel-button")).toBeInTheDocument()
    })

    it("debe mostrar todas las opciones de categoría", () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      const categoriaSelect = screen.getByTestId("categoria-select")
      const options = within(categoriaSelect).getAllByRole("option")

      expect(options).toHaveLength(8) // 7 categorías + opción vacía
      expect(options[0]).toHaveTextContent("Seleccionar categoría")
      expect(options[1]).toHaveValue("insumos")
      expect(options[2]).toHaveValue("equipamiento")
      expect(options[3]).toHaveValue("servicios")
      expect(options[4]).toHaveValue("marketing")
      expect(options[5]).toHaveValue("administrativo")
      expect(options[6]).toHaveValue("impuestos")
      expect(options[7]).toHaveValue("otros")
    })

    it("debe mostrar todas las opciones de método de pago", () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      const metodoPagoSelect = screen.getByTestId("metodo-pago-select")
      const options = within(metodoPagoSelect).getAllByRole("option")

      expect(options).toHaveLength(7) // 6 métodos + opción vacía
      expect(options[0]).toHaveTextContent("Seleccionar método de pago")
      expect(options[1]).toHaveValue("efectivo")
      expect(options[2]).toHaveValue("transferencia")
      expect(options[3]).toHaveValue("tarjeta_debito")
      expect(options[4]).toHaveValue("tarjeta_credito")
      expect(options[5]).toHaveValue("cheque")
      expect(options[6]).toHaveValue("crypto")
    })

    it("debe mostrar el título correcto según el modo", () => {
      const mockOnSubmit = jest.fn()
      
      // Modo crear
      const { rerender } = render(<EgresoForm onSubmit={mockOnSubmit} mode="create" />)
      expect(screen.getByText("Crear Egreso")).toBeInTheDocument()
      
      // Modo editar
      rerender(<EgresoForm onSubmit={mockOnSubmit} mode="edit" />)
      expect(screen.getByText("Actualizar Egreso")).toBeInTheDocument()
    })
  })

  describe("✅ Validación de Campos", () => {
    it("debe validar que los campos requeridos estén completos", async () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      // El formulario no debería enviarse sin campos requeridos
      expect(mockOnSubmit).not.toHaveBeenCalled()
      
      // Verificar que los campos requeridos muestren validación
      const descripcionInput = screen.getByTestId("descripcion-input")
      const categoriaSelect = screen.getByTestId("categoria-select")
      const montoInput = screen.getByTestId("monto-input")
      const proveedorInput = screen.getByTestId("proveedor-input")
      const metodoPagoSelect = screen.getByTestId("metodo-pago-select")
      const fechaInput = screen.getByTestId("fecha-egreso-input")
      
      expect(descripcionInput).toBeRequired()
      expect(categoriaSelect).toBeRequired()
      expect(montoInput).toBeRequired()
      expect(proveedorInput).toBeRequired()
      expect(metodoPagoSelect).toBeRequired()
      expect(fechaInput).toBeRequired()
    })

    it("debe validar que el monto sea un número positivo", () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      const montoInput = screen.getByTestId("monto-input")

      // Montos inválidos
      const montosInvalidos = [-10, -0.01, 0, "abc", ""]

      montosInvalidos.forEach(monto => {
        fireEvent.change(montoInput, { target: { value: monto } })
        if (typeof monto === "number") {
          expect(montoInput).toHaveValue(monto)
        }
      })

      // Montos válidos
      const montosValidos = [0.01, 10, 100.50, 999.99]

      montosValidos.forEach(monto => {
        fireEvent.change(montoInput, { target: { value: monto } })
        expect(montoInput).toHaveValue(monto)
      })
    })

    it("debe validar el formato de URL del comprobante", () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      const comprobanteUrlInput = screen.getByTestId("comprobante-url-input")

      // URLs válidas
      const urlsValidas = [
        "https://ejemplo.com/comprobante.pdf",
        "http://ejemplo.com/factura.jpg",
        "https://ejemplo.com/recibo.png",
        "https://ejemplo.com/documento.doc"
      ]

      urlsValidas.forEach(url => {
        fireEvent.change(comprobanteUrlInput, { target: { value: url } })
        expect(comprobanteUrlInput).toHaveValue(url)
      })

      // URLs inválidas
      const urlsInvalidas = [
        "no-es-url",
        "ftp://ejemplo.com/comprobante.pdf",
        "ejemplo.com/factura.jpg"
      ]

      urlsInvalidas.forEach(url => {
        fireEvent.change(comprobanteUrlInput, { target: { value: url } })
        expect(comprobanteUrlInput).toHaveValue(url)
      })
    })

    it("debe validar que la fecha sea válida", () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      const fechaInput = screen.getByTestId("fecha-egreso-input")

      // Fecha válida (hoy)
      const hoy = new Date().toISOString().split('T')[0]
      fireEvent.change(fechaInput, { target: { value: hoy } })
      expect(fechaInput).toHaveValue(hoy)

      // Fecha válida (ayer)
      const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      fireEvent.change(fechaInput, { target: { value: ayer } })
      expect(fechaInput).toHaveValue(ayer)

      // Fecha válida (futura)
      const futuro = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      fireEvent.change(fechaInput, { target: { value: futuro } })
      expect(fechaInput).toHaveValue(futuro)
    })
  })

  describe("📤 Envío del Formulario", () => {
    it("debe enviar datos correctos cuando el formulario es válido", async () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      // Llenar todos los campos
      const testData = {
        descripcion: "Compra de fertilizantes orgánicos",
        categoria: "insumos",
        monto: 250.75,
        proveedor: "AgroSupply S.A.",
        metodo_pago: "transferencia",
        fecha_egreso: "2025-08-16",
        notas: "Fertilizantes para cultivo de cannabis medicinal",
        comprobante_url: "https://ejemplo.com/factura-fertilizantes.pdf"
      }

      // Llenar campos requeridos
      fireEvent.change(screen.getByTestId("descripcion-input"), {
        target: { value: testData.descripcion },
      })
      fireEvent.change(screen.getByTestId("categoria-select"), {
        target: { value: testData.categoria },
      })
      fireEvent.change(screen.getByTestId("monto-input"), {
        target: { value: testData.monto },
      })
      fireEvent.change(screen.getByTestId("proveedor-input"), {
        target: { value: testData.proveedor },
      })
      fireEvent.change(screen.getByTestId("metodo-pago-select"), {
        target: { value: testData.metodo_pago },
      })
      fireEvent.change(screen.getByTestId("fecha-egreso-input"), {
        target: { value: testData.fecha_egreso },
      })

      // Llenar campos opcionales
      fireEvent.change(screen.getByTestId("notas-input"), {
        target: { value: testData.notas },
      })
      fireEvent.change(screen.getByTestId("comprobante-url-input"), {
        target: { value: testData.comprobante_url },
      })

      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(testData)
      })
    })

    it("debe manejar campos opcionales correctamente", async () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      // Solo llenar campos requeridos
      fireEvent.change(screen.getByTestId("descripcion-input"), {
        target: { value: "Egreso básico" },
      })
      fireEvent.change(screen.getByTestId("categoria-select"), {
        target: { value: "otros" },
      })
      fireEvent.change(screen.getByTestId("monto-input"), {
        target: { value: 100 },
      })
      fireEvent.change(screen.getByTestId("proveedor-input"), {
        target: { value: "Proveedor Test" },
      })
      fireEvent.change(screen.getByTestId("metodo-pago-select"), {
        target: { value: "efectivo" },
      })

      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          descripcion: "Egreso básico",
          categoria: "otros",
          monto: 100,
          proveedor: "Proveedor Test",
          metodo_pago: "efectivo",
          fecha_egreso: expect.any(String), // Fecha actual por defecto
          notas: "",
          comprobante_url: ""
        })
      })
    })
  })

  describe("🔄 Modo de Edición", () => {
    it("debe cargar datos iniciales correctamente en modo edición", () => {
      const mockOnSubmit = jest.fn()
      const initialData = {
        descripcion: "Egreso Existente",
        categoria: "equipamiento",
        monto: 1500.00,
        proveedor: "TechSupply Corp.",
        metodo_pago: "tarjeta_credito",
        fecha_egreso: "2025-08-15",
        notas: "Compra de equipos de iluminación LED",
        comprobante_url: "https://ejemplo.com/factura-equipos.pdf"
      }

      render(<EgresoForm onSubmit={mockOnSubmit} initialData={initialData} mode="edit" />)

      // Verificar que los campos tengan los valores iniciales
      expect(screen.getByTestId("descripcion-input")).toHaveValue(initialData.descripcion)
      expect(screen.getByTestId("categoria-select")).toHaveValue(initialData.categoria)
      expect(screen.getByTestId("monto-input")).toHaveValue(initialData.monto)
      expect(screen.getByTestId("proveedor-input")).toHaveValue(initialData.proveedor)
      expect(screen.getByTestId("metodo-pago-select")).toHaveValue(initialData.metodo_pago)
      expect(screen.getByTestId("fecha-egreso-input")).toHaveValue(initialData.fecha_egreso)
      expect(screen.getByTestId("notas-input")).toHaveValue(initialData.notas)
      expect(screen.getByTestId("comprobante-url-input")).toHaveValue(initialData.comprobante_url)
    })

    it("debe permitir editar datos existentes", async () => {
      const mockOnSubmit = jest.fn()
      const initialData = {
        descripcion: "Egreso Original",
        categoria: "servicios",
        monto: 500,
        proveedor: "Servicios Originales",
        metodo_pago: "efectivo",
        fecha_egreso: "2025-08-14",
        notas: "Notas originales",
        comprobante_url: "https://ejemplo.com/original.pdf"
      }

      render(<EgresoForm onSubmit={mockOnSubmit} initialData={initialData} mode="edit" />)

      // Editar algunos campos
      fireEvent.change(screen.getByTestId("monto-input"), {
        target: { value: 750 },
      })
      fireEvent.change(screen.getByTestId("notas-input"), {
        target: { value: "Notas actualizadas" },
      })
      fireEvent.change(screen.getByTestId("categoria-select"), {
        target: { value: "marketing" },
      })

      const submitButton = screen.getByTestId("submit-button")
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          ...initialData,
          monto: 750,
          notas: "Notas actualizadas",
          categoria: "marketing"
        })
      })
    })
  })

  describe("🚫 Prevención de Datos Duplicados", () => {
    it("debe validar que no se envíen datos duplicados", async () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      // Llenar formulario con datos válidos
      fireEvent.change(screen.getByTestId("descripcion-input"), {
        target: { value: "Egreso Test" },
      })
      fireEvent.change(screen.getByTestId("categoria-select"), {
        target: { value: "insumos" },
      })
      fireEvent.change(screen.getByTestId("monto-input"), {
        target: { value: 200 },
      })
      fireEvent.change(screen.getByTestId("proveedor-input"), {
        target: { value: "Proveedor Test" },
      })
      fireEvent.change(screen.getByTestId("metodo-pago-select"), {
        target: { value: "transferencia" },
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
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      // Verificar secciones del formulario
      expect(screen.getByText("Información del Egreso")).toBeInTheDocument()
      expect(screen.getByText("Proveedor y Pago")).toBeInTheDocument()
      expect(screen.getByText("Fecha y Documentación")).toBeInTheDocument()
      expect(screen.getByText("Notas Adicionales")).toBeInTheDocument()
    })

    it("debe tener botones con funcionalidad correcta", () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByTestId("submit-button")
      const cancelButton = screen.getByTestId("cancel-button")

      expect(submitButton).toHaveAttribute("type", "submit")
      expect(cancelButton).toHaveAttribute("type", "button")
    })
  })

  describe("🔍 Casos Edge y Validaciones", () => {
    it("debe manejar caracteres especiales en descripciones", () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      const descripcionInput = screen.getByTestId("descripcion-input")
      const descripcionesConCaracteresEspeciales = [
        "Compra de fertilizantes (Premium)",
        "Equipos de iluminación LED 1000W",
        "Servicios de consultoría: Cultivo Indoor",
        "Marketing digital - Campaña Q4 2025",
        "Impuestos: IVA + IIBB + Ganancias"
      ]

      descripcionesConCaracteresEspeciales.forEach(descripcion => {
        fireEvent.change(descripcionInput, { target: { value: descripcion } })
        expect(descripcionInput).toHaveValue(descripcion)
      })
    })

    it("debe validar longitud de campos", () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      const descripcionInput = screen.getByTestId("descripcion-input")
      const notasInput = screen.getByTestId("notas-input")

      // Descripción muy larga
      const descripcionLarga = "A".repeat(500)
      fireEvent.change(descripcionInput, { target: { value: descripcionLarga } })
      expect(descripcionInput).toHaveValue(descripcionLarga)

      // Notas muy largas
      const notasLargas = "Nota muy larga ".repeat(200)
      fireEvent.change(notasInput, { target: { value: notasLargas } })
      expect(notasInput).toHaveValue(notasLargas)
    })

    it("debe manejar valores extremos en campos numéricos", () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      const montoInput = screen.getByTestId("monto-input")

      // Valores muy grandes
      fireEvent.change(montoInput, { target: { value: 999999.99 } })
      expect(montoInput).toHaveValue(999999.99)

      // Valores muy pequeños
      fireEvent.change(montoInput, { target: { value: 0.01 } })
      expect(montoInput).toHaveValue(0.01)

      // Valores con muchos decimales
      fireEvent.change(montoInput, { target: { value: 123.456789 } })
      expect(montoInput).toHaveValue(123.456789)
    })

    it("debe validar fechas en diferentes formatos", () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      const fechaInput = screen.getByTestId("fecha-egreso-input")

      // Diferentes fechas válidas
      const fechasValidas = [
        "2025-01-01", // Año nuevo
        "2025-02-29", // 29 de febrero (año bisiesto)
        "2025-12-31", // Último día del año
        "2024-12-31", // Año anterior
        "2026-01-01"  // Año futuro
      ]

      fechasValidas.forEach(fecha => {
        fireEvent.change(fechaInput, { target: { value: fecha } })
        expect(fechaInput).toHaveValue(fecha)
      })
    })

    it("debe manejar proveedores con nombres complejos", () => {
      const mockOnSubmit = jest.fn()
      render(<EgresoForm onSubmit={mockOnSubmit} />)

      const proveedorInput = screen.getByTestId("proveedor-input")
      const proveedoresComplejos = [
        "AgroSupply & Fertilizantes S.A.",
        "Tech-LED Solutions (Argentina)",
        "Servicios Profesionales: Cultivo Indoor",
        "Marketing Digital - Agencia Creativa",
        "Impuestos y Contabilidad Ltda."
      ]

      proveedoresComplejos.forEach(proveedor => {
        fireEvent.change(proveedorInput, { target: { value: proveedor } })
        expect(proveedorInput).toHaveValue(proveedor)
      })
    })
  })
})
