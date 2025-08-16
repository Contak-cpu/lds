-- FORZAR eliminación de la función duplicada update_updated_at_column
-- Este script usa un enfoque más agresivo para resolver el problema

-- 1. VERIFICAR FUNCIONES DUPLICADAS ANTES
-- Ejecuta esto primero para ver el problema:
-- SELECT oid, proname, prosrc LIKE '%SET search_path = public%' as tiene_search_path, prosrc
-- FROM pg_proc 
-- WHERE proname = 'update_updated_at_column'
-- ORDER BY oid;

-- 2. ELIMINAR TODAS LAS VERSIONES DE update_updated_at_column POR OID
-- Esto elimina TODAS las versiones sin importar las dependencias
DO $$
DECLARE
    func_oid RECORD;
BEGIN
    FOR func_oid IN 
        SELECT oid FROM pg_proc 
        WHERE proname = 'update_updated_at_column'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || func_oid.oid::regprocedure || ' CASCADE';
    END LOOP;
END $$;

-- 3. RECREAR LA FUNCIÓN CORRECTA
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Establecer search_path explícitamente
  SET search_path = public;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- 4. RECREAR TODOS LOS TRIGGERS
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

-- 5. VERIFICAR QUE SOLO EXISTE UNA VERSIÓN
-- Ejecuta esto para confirmar:
-- SELECT oid, proname, prosrc LIKE '%SET search_path = public%' as tiene_search_path
-- FROM pg_proc 
-- WHERE proname = 'update_updated_at_column';

-- 6. VERIFICAR QUE TODAS LAS FUNCIONES TIENEN search_path EXPLÍCITO
-- Ejecuta esto para confirmar:
-- SELECT proname, prosrc LIKE '%SET search_path = public%' as tiene_search_path
-- FROM pg_proc 
-- WHERE proname IN ('generate_sku', 'generate_categoria_id', 'assign_categoria_id_if_null', 'generate_unique_sku', 'assign_sku_if_null', 'update_updated_at_column');

-- 7. RESULTADO ESPERADO:
-- Después de ejecutar este script, solo debería haber UNA versión de update_updated_at_column
-- y el Security Advisor debería mostrar 0 warnings
