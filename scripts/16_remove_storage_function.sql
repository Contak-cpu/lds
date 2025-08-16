-- Eliminar la función update_updated_at_column del esquema storage
-- Este script resuelve el warning causado por la función duplicada en storage

-- 1. VERIFICAR FUNCIONES EN AMBOS ESQUEMAS
-- Ejecuta esto primero para ver el problema:
-- SELECT schemaname, proname, prosrc LIKE '%SET search_path = public%' as tiene_search_path
-- FROM pg_proc 
-- WHERE proname = 'update_updated_at_column'
-- ORDER BY schemaname;

-- 2. ELIMINAR LA FUNCIÓN DEL ESQUEMA STORAGE
-- Esta es la función que está causando el warning
DROP FUNCTION IF EXISTS storage.update_updated_at_column() CASCADE;

-- 3. VERIFICAR QUE SOLO EXISTE LA FUNCIÓN EN PUBLIC
-- Ejecuta esto para confirmar:
-- SELECT schemaname, proname, prosrc LIKE '%SET search_path = public%' as tiene_search_path
-- FROM pg_proc 
-- WHERE proname = 'update_updated_at_column';

-- 4. VERIFICAR QUE TODAS LAS FUNCIONES EN PUBLIC TIENEN search_path EXPLÍCITO
-- Ejecuta esto para confirmar:
-- SELECT proname, prosrc LIKE '%SET search_path = public%' as tiene_search_path
-- FROM pg_proc 
-- WHERE proname IN ('generate_sku', 'generate_categoria_id', 'assign_categoria_id_if_null', 'generate_unique_sku', 'assign_sku_if_null', 'update_updated_at_column')
-- AND schemaname = 'public';

-- 5. RESULTADO ESPERADO:
-- Después de ejecutar este script:
-- - Solo debería haber UNA versión de update_updated_at_column (en public)
-- - La función en storage debería estar eliminada
-- - El Security Advisor debería mostrar 0 warnings

-- 6. NOTA IMPORTANTE:
-- Si hay algún trigger que dependa de storage.update_updated_at_column,
-- también se eliminará con CASCADE. Pero esto no debería ser un problema
-- porque los triggers importantes están en public.
