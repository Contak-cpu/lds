-- Corregir la función generate_sku faltante
-- Este script elimina el último warning del Security Advisor

-- 1. CORREGIR FUNCIÓN generate_sku (que falta)
-- Esta función debe ser diferente de generate_unique_sku
CREATE OR REPLACE FUNCTION public.generate_sku(categoria_input VARCHAR(100))
RETURNS VARCHAR(20) AS $$
DECLARE
  next_number INTEGER;
  sku_result VARCHAR(20);
  attempts INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
  -- Establecer search_path explícitamente
  SET search_path = public;
  
  LOOP
    -- Obtener el siguiente número para SKU
    SELECT COALESCE(MAX(CAST(sku AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.productos 
    WHERE sku ~ '^[0-9]+$'; -- Solo SKUs numéricos
    
    -- Formatear el SKU
    sku_result := next_number::TEXT;
    
    -- Verificar que no exista
    IF NOT EXISTS (SELECT 1 FROM public.productos WHERE sku = sku_result) THEN
      RETURN sku_result;
    END IF;
    
    -- Si existe, intentar con el siguiente
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'No se pudo generar un SKU único después de % intentos', max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. VERIFICAR QUE TODAS LAS FUNCIONES TIENEN search_path EXPLÍCITO
-- Ejecuta esto para confirmar:
-- SELECT proname, prosrc LIKE '%SET search_path = public%' as tiene_search_path
-- FROM pg_proc 
-- WHERE proname IN ('generate_sku', 'generate_categoria_id', 'assign_categoria_id_if_null', 'generate_unique_sku', 'assign_sku_if_null', 'update_updated_at_column');

-- 3. VERIFICAR QUE TODAS LAS FUNCIONES TIENEN SECURITY DEFINER
-- Ejecuta esto para confirmar:
-- SELECT proname, prosecdef as security_definer
-- FROM pg_proc 
-- WHERE proname IN ('generate_sku', 'generate_categoria_id', 'assign_categoria_id_if_null', 'generate_unique_sku', 'assign_sku_if_null', 'update_updated_at_column');

-- 4. VERIFICAR QUE SOLO EXISTE UNA VERSIÓN DE CADA FUNCIÓN
-- Ejecuta esto para confirmar:
-- SELECT proname, COUNT(*) as cantidad 
-- FROM pg_proc 
-- WHERE proname IN ('generate_sku', 'generate_categoria_id', 'assign_categoria_id_if_null', 'generate_unique_sku', 'assign_sku_if_null', 'update_updated_at_column')
-- GROUP BY proname;

-- 5. VERIFICAR QUE NO HAY MÁS WARNINGS
-- Después de ejecutar este script, el Security Advisor debería mostrar 0 warnings
