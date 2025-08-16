-- Corregir políticas de RLS para permitir acceso a datos existentes
-- Este script soluciona el problema de que los datos no son visibles después de habilitar RLS

-- 1. VERIFICAR EL ESTADO ACTUAL DE RLS
-- Ejecuta esto para ver qué tablas tienen RLS habilitado:
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename IN ('clientes', 'productos', 'ventas', 'venta_items', 'egresos', 'configuracion');

-- 2. ELIMINAR POLÍTICAS RESTRICTIVAS EXISTENTES
-- Eliminar políticas que solo permiten usuarios autenticados
DROP POLICY IF EXISTS "Usuarios autenticados pueden gestionar clientes" ON public.clientes;
DROP POLICY IF EXISTS "Usuarios autenticados pueden gestionar productos" ON public.productos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden gestionar ventas" ON public.ventas;
DROP POLICY IF EXISTS "Usuarios autenticados pueden gestionar items de venta" ON public.venta_items;
DROP POLICY IF EXISTS "Usuarios autenticados pueden gestionar egresos" ON public.egresos;
DROP POLICY IF EXISTS "Usuarios autenticados pueden gestionar configuración" ON public.configuracion;

-- 3. CREAR POLÍTICAS MÁS PERMISIVAS PARA DESARROLLO
-- Política para clientes: Permitir acceso completo (temporal para desarrollo)
CREATE POLICY "Acceso completo a clientes" ON public.clientes
    FOR ALL USING (true);

-- Política para productos: Permitir acceso completo (temporal para desarrollo)
CREATE POLICY "Acceso completo a productos" ON public.productos
    FOR ALL USING (true);

-- Política para ventas: Permitir acceso completo (temporal para desarrollo)
CREATE POLICY "Acceso completo a ventas" ON public.ventas
    FOR ALL USING (true);

-- Política para items de venta: Permitir acceso completo (temporal para desarrollo)
CREATE POLICY "Acceso completo a items de venta" ON public.venta_items
    FOR ALL USING (true);

-- Política para egresos: Permitir acceso completo (temporal para desarrollo)
CREATE POLICY "Acceso completo a egresos" ON public.egresos
    FOR ALL USING (true);

-- Política para configuración: Permitir acceso completo (temporal para desarrollo)
CREATE POLICY "Acceso completo a configuración" ON public.configuracion
    FOR ALL USING (true);

-- 4. VERIFICAR QUE LAS POLÍTICAS SE CREARON
-- Ejecuta esto para confirmar:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies 
-- WHERE schemaname = 'public';

-- 5. NOTA IMPORTANTE:
-- Estas políticas permiten acceso COMPLETO a todos los datos.
-- Para PRODUCCIÓN, deberías implementar autenticación real y políticas más restrictivas.
-- Para DESARROLLO/PRUEBAS, estas políticas son suficientes.

-- 6. RESULTADO ESPERADO:
-- Después de ejecutar este script:
-- - Los clientes existentes deberían ser visibles nuevamente
-- - Los productos existentes deberían ser visibles nuevamente
-- - Todas las demás tablas deberían funcionar normalmente
-- - RLS sigue habilitado pero no bloquea el acceso
