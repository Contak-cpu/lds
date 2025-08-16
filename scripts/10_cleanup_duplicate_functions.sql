-- Limpiar funciones duplicadas y asegurar consistencia
-- Este script elimina versiones duplicadas de funciones

-- 1. ELIMINAR LA VERSIÓN ANTIGUA DE update_updated_at_column (sin search_path)
-- Primero verificamos cuál es la antigua
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- 2. RECREAR LA FUNCIÓN CORRECTA
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Establecer search_path explícitamente
  SET search_path = public;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- 3. VERIFICAR QUE SOLO EXISTE UNA VERSIÓN DE CADA FUNCIÓN
-- Ejecuta esto para confirmar:
-- SELECT proname, COUNT(*) as cantidad 
-- FROM pg_proc 
-- WHERE proname IN ('generate_categoria_id', 'assign_categoria_id_if_null', 'generate_unique_sku', 'assign_sku_if_null', 'update_updated_at_column')
-- GROUP BY proname;

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
