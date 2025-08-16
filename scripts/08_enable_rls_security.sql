-- Habilitar Row Level Security (RLS) en todas las tablas públicas
-- Este script soluciona los problemas de seguridad detectados por Supabase Security Advisor

-- 1. HABILITAR RLS EN TODAS LAS TABLAS
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venta_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.egresos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;

-- 2. CREAR POLÍTICAS DE SEGURIDAD BÁSICAS

-- Política para clientes: Solo usuarios autenticados pueden ver/editar sus propios datos
CREATE POLICY "Usuarios autenticados pueden gestionar clientes" ON public.clientes
    FOR ALL USING (auth.role() = 'authenticated');

-- Política para productos: Solo usuarios autenticados pueden gestionar productos
CREATE POLICY "Usuarios autenticados pueden gestionar productos" ON public.productos
    FOR ALL USING (auth.role() = 'authenticated');

-- Política para ventas: Solo usuarios autenticados pueden gestionar ventas
CREATE POLICY "Usuarios autenticados pueden gestionar ventas" ON public.ventas
    FOR ALL USING (auth.role() = 'authenticated');

-- Política para items de venta: Solo usuarios autenticados pueden gestionar items
CREATE POLICY "Usuarios autenticados pueden gestionar items de venta" ON public.venta_items
    FOR ALL USING (auth.role() = 'authenticated');

-- Política para egresos: Solo usuarios autenticados pueden gestionar egresos
CREATE POLICY "Usuarios autenticados pueden gestionar egresos" ON public.egresos
    FOR ALL USING (auth.role() = 'authenticated');

-- Política para configuración: Solo usuarios autenticados pueden ver/editar configuración
CREATE POLICY "Usuarios autenticados pueden gestionar configuración" ON public.configuracion
    FOR ALL USING (auth.role() = 'authenticated');

-- 3. VERIFICAR QUE RLS ESTÁ HABILITADO
-- Puedes ejecutar esto para confirmar:
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename IN ('clientes', 'productos', 'ventas', 'venta_items', 'egresos', 'configuracion');

-- 4. NOTA IMPORTANTE:
-- Si necesitas acceso desde tu aplicación sin autenticación (no recomendado para producción),
-- puedes crear políticas más específicas o usar un usuario de servicio.
-- Para desarrollo/pruebas, estas políticas básicas son suficientes.
