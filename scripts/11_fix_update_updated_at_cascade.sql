-- Corregir la función update_updated_at_column sin romper los triggers
-- Este script recrea la función correctamente manteniendo todos los triggers

-- 1. RECREAR LA FUNCIÓN update_updated_at_column CON search_path EXPLÍCITO
-- No necesitamos DROP, CREATE OR REPLACE es suficiente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Establecer search_path explícitamente
  SET search_path = public;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- 2. VERIFICAR QUE LA FUNCIÓN SE ACTUALIZÓ CORRECTAMENTE
-- Ejecuta esto para confirmar:
-- SELECT proname, prosrc FROM pg_proc WHERE proname = 'update_updated_at_column';

-- 3. VERIFICAR QUE TODOS LOS TRIGGERS SIGUEN FUNCIONANDO
-- Ejecuta esto para confirmar:
-- SELECT 
--   trigger_name,
--   event_object_table,
--   action_statement
-- FROM information_schema.triggers 
-- WHERE trigger_name LIKE 'update_%_updated_at';

-- 4. VERIFICAR QUE TODAS LAS FUNCIONES TIENEN search_path EXPLÍCITO
-- Ejecuta esto para confirmar:
-- SELECT proname, prosrc LIKE '%SET search_path = public%' as tiene_search_path
-- FROM pg_proc 
-- WHERE proname IN ('generate_categoria_id', 'assign_categoria_id_if_null', 'generate_unique_sku', 'assign_sku_if_null', 'update_updated_at_column');

-- 5. VERIFICAR QUE TODAS LAS FUNCIONES TIENEN SECURITY DEFINER
-- Ejecuta esto para confirmar:
-- SELECT proname, prosecdef as security_definer
-- FROM pg_proc 
-- WHERE proname IN ('generate_categoria_id', 'assign_categoria_id_if_null', 'generate_unique_sku', 'assign_sku_if_null', 'update_updated_at_column');

-- 6. VERIFICAR QUE SOLO EXISTE UNA VERSIÓN DE CADA FUNCIÓN
-- Ejecuta esto para confirmar:
-- SELECT proname, COUNT(*) as cantidad 
-- FROM pg_proc 
-- WHERE proname IN ('generate_categoria_id', 'assign_categoria_id_if_null', 'generate_unique_sku', 'assign_sku_if_null', 'update_updated_at_column')
-- GROUP BY proname;
