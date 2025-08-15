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
          email: string
          telefono: string
          direccion: string
          ciudad: string
          provincia: string
          codigo_postal: string
          fecha_registro: string
          notas: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          email?: string
          telefono?: string
          direccion?: string
          ciudad?: string
          provincia?: string
          codigo_postal?: string
          fecha_registro?: string
          notas?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          email?: string
          telefono?: string
          direccion?: string
          ciudad?: string
          provincia?: string
          codigo_postal?: string
          fecha_registro?: string
          notas?: string
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
          cliente_casual: string | null
          tipo_venta: string
          subtotal: number
          descuento: number
          total: number
          estado: string
          metodo_pago: string
          notas: string | null
          fecha_venta: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cliente_id?: string | null
          cliente_nombre?: string | null
          cliente_casual?: string | null
          tipo_venta?: string
          subtotal: number
          descuento?: number
          total: number
          estado?: string
          metodo_pago: string
          notas?: string | null
          fecha_venta?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string | null
          cliente_nombre?: string | null
          cliente_casual?: string | null
          tipo_venta?: string
          subtotal?: number
          descuento?: number
          total?: number
          estado?: string
          metodo_pago?: string
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
          updated_at: string
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
          updated_at?: string
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
          updated_at?: string
        }
      }
      egresos: {
        Row: {
          id: string
          descripcion: string
          categoria: string
          monto: number
          proveedor: string
          metodo_pago: string
          fecha_egreso: string
          notas: string
          comprobante_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          descripcion: string
          categoria: string
          monto: number
          proveedor: string
          metodo_pago: string
          fecha_egreso?: string
          notas?: string
          comprobante_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          descripcion?: string
          categoria?: string
          monto?: number
          proveedor?: string
          metodo_pago?: string
          fecha_egreso?: string
          notas?: string
          comprobante_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      configuracion: {
        Row: {
          id: string
          clave: string
          valor: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clave: string
          valor: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clave?: string
          valor?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
