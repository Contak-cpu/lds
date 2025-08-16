-- Eliminar completamente la función duplicada update_updated_at_column
-- Este script resuelve el problema de funciones duplicadas

-- 1. ELIMINAR TODAS LAS VERSIONES DE update_updated_at_column
-- Primero eliminamos todas las versiones existentes
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

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

-- 3. RECREAR TODOS LOS TRIGGERS QUE DEPENDÍAN DE ESTA FUNCIÓN
-- Trigger para clientes
CREATE TRIGGER update_clientes_updated_at 
  BEFORE UPDATE ON public.clientes 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para productos
CREATE TRIGGER update_productos_updated_at 
  BEFORE UPDATE ON public.productos 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para ventas
CREATE TRIGGER update_ventas_updated_at 
  BEFORE UPDATE ON public.ventas 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para egresos
CREATE TRIGGER update_egresos_updated_at 
  BEFORE UPDATE ON public.egresos 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para configuración
CREATE TRIGGER update_configuracion_updated_at 
  BEFORE UPDATE ON public.configuracion 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- 4. VERIFICAR QUE SOLO EXISTE UNA VERSIÓN DE update_updated_at_column
-- Ejecuta esto para confirmar:
-- SELECT proname, COUNT(*) as cantidad 
-- FROM pg_proc 
-- WHERE proname = 'update_updated_at_column'
-- GROUP BY proname;

-- 5. VERIFICAR QUE TODAS LAS FUNCIONES TIENEN search_path EXPLÍCITO
-- Ejecuta esto para confirmar:
-- SELECT proname, prosrc LIKE '%SET search_path = public%' as tiene_search_path
-- FROM pg_proc 
-- WHERE proname IN ('generate_sku', 'generate_categoria_id', 'assign_categoria_id_if_null', 'generate_unique_sku', 'assign_sku_if_null', 'update_updated_at_column');

-- 6. VERIFICAR QUE TODOS LOS TRIGGERS ESTÁN FUNCIONANDO
-- Ejecuta esto para confirmar:
-- SELECT 
--   trigger_name,
--   event_object_table,
--   action_statement
-- FROM information_schema.triggers 
-- WHERE trigger_name LIKE 'update_%_updated_at';

-- 7. RESULTADO ESPERADO:
-- Después de ejecutar este script, el Security Advisor debería mostrar 0 warnings
