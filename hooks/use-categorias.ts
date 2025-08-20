import { useState, useEffect } from "react"

export interface Categoria {
  id: string
  nombre: string
  descripcion: string | null
  icono: string | null
  color: string
  activo: boolean
  orden: number
  created_at: string
  updated_at: string
}

// Datos mock por defecto
const categoriasMock: Categoria[] = [
  {
    id: "1",
    nombre: "Semillas",
    descripcion: "Variedades de semillas de cannabis",
    icono: "🌱",
    color: "#10B981",
    activo: true,
    orden: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    nombre: "Fertilizantes",
    descripcion: "Nutrientes para el cultivo",
    icono: "🌿",
    color: "#059669",
    activo: true,
    orden: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    nombre: "Iluminación",
    descripcion: "Sistemas de iluminación LED",
    icono: "💡",
    color: "#F59E0B",
    activo: true,
    orden: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    nombre: "Sustratos",
    descripcion: "Tierras y mezclas especializadas",
    icono: "🪴",
    color: "#8B5CF6",
    activo: true,
    orden: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarCategorias = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // En modo mock, cargar desde localStorage o usar datos por defecto
      const categoriasGuardadas = localStorage.getItem('crm-categorias')
      if (categoriasGuardadas) {
        setCategorias(JSON.parse(categoriasGuardadas))
      } else {
        // Primera vez: guardar datos mock
        localStorage.setItem('crm-categorias', JSON.stringify(categoriasMock))
        setCategorias(categoriasMock)
      }
    } catch (err) {
      console.error("Error cargando categorías:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
      // En caso de error, usar datos mock
      setCategorias(categoriasMock)
    } finally {
      setIsLoading(false)
    }
  }

  const agregarCategoria = async (categoriaData: Omit<Categoria, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Generar ID único
      const id = Date.now().toString()
      const now = new Date().toISOString()
      
      // Obtener el siguiente orden
      const categoriasActuales = JSON.parse(localStorage.getItem('crm-categorias') || '[]')
      const lastCategoria = categoriasActuales[categoriasActuales.length - 1]
      const nextOrden = (lastCategoria?.orden || 0) + 1

      const nuevaCategoria: Categoria = {
        ...categoriaData,
        id,
        orden: nextOrden,
        created_at: now,
        updated_at: now,
      }

      // Actualizar localStorage
      const categoriasActualizadas = [...categoriasActuales, nuevaCategoria]
      localStorage.setItem('crm-categorias', JSON.stringify(categoriasActualizadas))

      // Actualizar el estado local
      setCategorias(categoriasActualizadas)
      return nuevaCategoria
    } catch (err) {
      console.error("Error agregando categoría:", err)
      throw err
    }
  }

  const actualizarCategoria = async (id: string, categoriaData: Partial<Categoria>) => {
    try {
      const now = new Date().toISOString()
      const categoriasActuales = JSON.parse(localStorage.getItem('crm-categorias') || '[]')
      
      const categoriaActualizada = categoriasActuales.map((cat: Categoria) => 
        cat.id === id 
          ? { ...cat, ...categoriaData, updated_at: now }
          : cat
      )

      // Actualizar localStorage
      localStorage.setItem('crm-categorias', JSON.stringify(categoriaActualizada))

      // Actualizar el estado local
      setCategorias(categoriaActualizada)
      
      return categoriaActualizada.find(cat => cat.id === id)
    } catch (err) {
      console.error("Error actualizando categoría:", err)
      throw err
    }
  }

  const eliminarCategoria = async (id: string) => {
    try {
      const categoriasActuales = JSON.parse(localStorage.getItem('crm-categorias') || '[]')
      const categoriasFiltradas = categoriasActuales.filter((cat: Categoria) => cat.id !== id)

      // Actualizar localStorage
      localStorage.setItem('crm-categorias', JSON.stringify(categoriasFiltradas))

      // Actualizar el estado local
      setCategorias(categoriasFiltradas)
    } catch (err) {
      console.error("Error eliminando categoría:", err)
      throw err
    }
  }

  const toggleActivo = async (id: string, activo: boolean) => {
    try {
      const now = new Date().toISOString()
      const categoriasActuales = JSON.parse(localStorage.getItem('crm-categorias') || '[]')
      
      const categoriaActualizada = categoriasActuales.map((cat: Categoria) => 
        cat.id === id 
          ? { ...cat, activo, updated_at: now }
          : cat
      )

      // Actualizar localStorage
      localStorage.setItem('crm-categorias', JSON.stringify(categoriaActualizada))

      // Actualizar el estado local
      setCategorias(categoriaActualizada)
      
      return categoriaActualizada.find(cat => cat.id === id)
    } catch (err) {
      console.error("Error cambiando estado de categoría:", err)
      throw err
    }
  }

  useEffect(() => {
    cargarCategorias()
  }, [])

  return {
    categorias,
    isLoading,
    error,
    cargarCategorias,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria,
    toggleActivo,
  }
}
