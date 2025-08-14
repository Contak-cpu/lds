import { createBrowserClient } from "@supabase/ssr"

export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!supabaseInstance) {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase environment variables are not configured")
    }
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return supabaseInstance
}

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string
          nombre: string
          email: string | null
          telefono: string | null
          direccion: string | null
          ciudad: string | null
          provincia: string | null
          codigo_postal: string | null
          fecha_registro: string
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          ciudad?: string | null
          provincia?: string | null
          codigo_postal?: string | null
          fecha_registro?: string
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          ciudad?: string | null
          provincia?: string | null
          codigo_postal?: string | null
          fecha_registro?: string
          notas?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      productos: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          categoria: string
          precio: number
          costo: number
          stock: number
          stock_minimo: number
          imagen_url: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          categoria: string
          precio: number
          costo?: number
          stock?: number
          stock_minimo?: number
          imagen_url?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          categoria?: string
          precio?: number
          costo?: number
          stock?: number
          stock_minimo?: number
          imagen_url?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ventas: {
        Row: {
          id: string
          cliente_id: string | null
          cliente_nombre: string | null
          tipo_venta: string
          subtotal: number
          descuento: number
          total: number
          estado: string
          metodo_pago: string | null
          notas: string | null
          fecha_venta: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cliente_id?: string | null
          cliente_nombre?: string | null
          tipo_venta?: string
          subtotal: number
          descuento?: number
          total: number
          estado?: string
          metodo_pago?: string | null
          notas?: string | null
          fecha_venta?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string | null
          cliente_nombre?: string | null
          tipo_venta?: string
          subtotal?: number
          descuento?: number
          total?: number
          estado?: string
          metodo_pago?: string | null
          notas?: string | null
          fecha_venta?: string
          created_at?: string
          updated_at?: string
        }
      }
      venta_items: {
        Row: {
          id: string
          venta_id: string
          producto_id: string | null
          producto_nombre: string
          cantidad: number
          precio_unitario: number
          subtotal: number
          created_at: string
        }
        Insert: {
          id?: string
          venta_id: string
          producto_id?: string | null
          producto_nombre: string
          cantidad: number
          precio_unitario: number
          subtotal: number
          created_at?: string
        }
        Update: {
          id?: string
          venta_id?: string
          producto_id?: string | null
          producto_nombre?: string
          cantidad?: number
          precio_unitario?: number
          subtotal?: number
          created_at?: string
        }
      }
      egresos: {
        Row: {
          id: string
          descripcion: string
          categoria: string
          monto: number
          proveedor: string | null
          metodo_pago: string | null
          fecha_egreso: string
          notas: string | null
          comprobante_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          descripcion: string
          categoria: string
          monto: number
          proveedor?: string | null
          metodo_pago?: string | null
          fecha_egreso: string
          notas?: string | null
          comprobante_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          descripcion?: string
          categoria?: string
          monto?: number
          proveedor?: string | null
          metodo_pago?: string | null
          fecha_egreso?: string
          notas?: string | null
          comprobante_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
