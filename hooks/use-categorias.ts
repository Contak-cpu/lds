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
      
      // Cargar categorías desde localStorage (modo mock)
      const categoriasMock: Categoria[] = [
        {
          id: "1",
          nombre: "Running",
          descripcion: "Zapatillas para correr y entrenar",
          icono: "Zap",
          color: "#3B82F6",
          activo: true,
          orden: 1,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        },
        {
          id: "2",
          nombre: "Basketball",
          descripcion: "Zapatillas de básquet profesionales",
          icono: "Target",
          color: "#F59E0B",
          activo: true,
          orden: 2,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        },
        {
          id: "3",
          nombre: "Lifestyle",
          descripcion: "Zapatillas casuales para el día a día",
          icono: "Heart",
          color: "#10B981",
          activo: true,
          orden: 3,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z"
        }
      ]
      
      const categoriasSaved = localStorage.getItem('categorias-sneakers')
      const categoriasData = categoriasSaved ? JSON.parse(categoriasSaved) : categoriasMock
      
      setCategorias(categoriasData.filter((cat: Categoria) => cat.activo))
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
      // Generar nuevo ID y orden
      const newId = Date.now().toString()
      const nextOrden = Math.max(...categorias.map(c => c.orden), 0) + 1
      
      const newCategoria: Categoria = {
        ...categoriaData,
        id: newId,
        orden: nextOrden,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Guardar en localStorage
      const updatedCategorias = [...categorias, newCategoria]
      localStorage.setItem('categorias-sneakers', JSON.stringify(updatedCategorias))
      
      // Actualizar el estado local
      setCategorias(updatedCategorias)
      return newCategoria
    } catch (err) {
      console.error("Error agregando categoría:", err)
      throw err
    }
  }

  const actualizarCategoria = async (id: string, categoriaData: Partial<Categoria>) => {
    try {
      // Actualizar categoria local
      const updatedCategorias = categorias.map(cat => 
        cat.id === id 
          ? { ...cat, ...categoriaData, updated_at: new Date().toISOString() }
          : cat
      )
      
      // Guardar en localStorage
      localStorage.setItem('categorias-sneakers', JSON.stringify(updatedCategorias))
      
      // Actualizar el estado local
      setCategorias(updatedCategorias)
      
      return updatedCategorias.find(cat => cat.id === id)!
    } catch (err) {
      console.error("Error actualizando categoría:", err)
      throw err
    }
  }

  const eliminarCategoria = async (id: string) => {
    try {
      // Filtrar categoria eliminada
      const updatedCategorias = categorias.filter(cat => cat.id !== id)
      
      // Guardar en localStorage
      localStorage.setItem('categorias-sneakers', JSON.stringify(updatedCategorias))
      
      // Actualizar el estado local
      setCategorias(updatedCategorias)
    } catch (err) {
      console.error("Error eliminando categoría:", err)
      throw err
    }
  }

  const toggleActivo = async (id: string, activo: boolean) => {
    try {
      // Actualizar estado activo
      const updatedCategorias = categorias.map(cat => 
        cat.id === id 
          ? { ...cat, activo, updated_at: new Date().toISOString() }
          : cat
      )
      
      // Guardar en localStorage
      localStorage.setItem('categorias-sneakers', JSON.stringify(updatedCategorias))
      
      // Actualizar el estado local
      setCategorias(updatedCategorias.filter(cat => cat.activo))
      
      return updatedCategorias.find(cat => cat.id === id)!
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
