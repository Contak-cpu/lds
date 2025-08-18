import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

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

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarCategorias = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const supabase = createClient()
      const { data, error: supabaseError } = await supabase
        .from("categorias")
        .select("*")
        .eq("activo", true)
        .order("orden", { ascending: true })

      if (supabaseError) throw supabaseError

      setCategorias(data || [])
    } catch (err) {
      console.error("Error cargando categorías:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  const agregarCategoria = async (categoriaData: Omit<Categoria, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const supabase = createClient()
      
      // Obtener el siguiente orden
      const { data: lastCategoria } = await supabase
        .from("categorias")
        .select("orden")
        .order("orden", { ascending: false })
        .limit(1)

      const nextOrden = (lastCategoria?.[0]?.orden || 0) + 1

      const { data, error } = await supabase
        .from("categorias")
        .insert({
          ...categoriaData,
          orden: nextOrden,
        })
        .select()
        .single()

      if (error) throw error

      // Actualizar el estado local
      setCategorias(prev => [...prev, data])
      return data
    } catch (err) {
      console.error("Error agregando categoría:", err)
      throw err
    }
  }

  const actualizarCategoria = async (id: string, categoriaData: Partial<Categoria>) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("categorias")
        .update(categoriaData)
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // Actualizar el estado local
      setCategorias(prev => 
        prev.map(cat => cat.id === id ? data : cat)
      )
      
      return data
    } catch (err) {
      console.error("Error actualizando categoría:", err)
      throw err
    }
  }

  const eliminarCategoria = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id", id)

      if (error) throw error

      // Actualizar el estado local
      setCategorias(prev => prev.filter(cat => cat.id !== id))
    } catch (err) {
      console.error("Error eliminando categoría:", err)
      throw err
    }
  }

  const toggleActivo = async (id: string, activo: boolean) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("categorias")
        .update({ activo })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // Actualizar el estado local
      setCategorias(prev => 
        prev.map(cat => cat.id === id ? data : cat)
      )
      
      return data
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
