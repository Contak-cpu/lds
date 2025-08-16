-- Corregir Function Search Path Mutable en todas las funciones
-- Este script soluciona los warnings del Security Advisor de Supabase

-- 1. CORREGIR FUNCIÓN generate_categoria_id
CREATE OR REPLACE FUNCTION public.generate_categoria_id(categoria_input VARCHAR(100))
RETURNS VARCHAR(20) AS $$
DECLARE
  categoria_prefix VARCHAR(10);
  next_number INTEGER;
  categoria_id_result VARCHAR(20);
  attempts INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
  -- Establecer search_path explícitamente
  SET search_path = public;
  
  -- Definir prefijos para cada categoría
  CASE 
    WHEN LOWER(categoria_input) = 'semillas' THEN categoria_prefix := 'SEM';
    WHEN LOWER(categoria_input) = 'fertilizantes' THEN categoria_prefix := 'FER';
    WHEN LOWER(categoria_input) = 'herramientas' THEN categoria_prefix := 'HER';
    WHEN LOWER(categoria_input) = 'sustratos' THEN categoria_prefix := 'SUS';
    WHEN LOWER(categoria_input) = 'iluminacion' THEN categoria_prefix := 'ILU';
    WHEN LOWER(categoria_input) = 'hidroponia' THEN categoria_prefix := 'HID';
    WHEN LOWER(categoria_input) = 'kits' THEN categoria_prefix := 'KIT';
    WHEN LOWER(categoria_input) = 'accesorios' THEN categoria_prefix := 'ACC';
    ELSE categoria_prefix := 'PRO'; -- Producto genérico
  END CASE;
  
  LOOP
    -- Obtener el siguiente número para esta categoría
    SELECT COALESCE(MAX(CAST(SUBSTRING(categoria_id FROM LENGTH(categoria_prefix) + 2) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.productos 
    WHERE categoria_id LIKE categoria_prefix || '-%';
    
    -- Formatear el ID con ceros a la izquierda (ej: SEM-001, SEM-002)
    categoria_id_result := categoria_prefix || '-' || LPAD(next_number::TEXT, 3, '0');
    
    -- Verificar que no exista
    IF NOT EXISTS (SELECT 1 FROM public.productos WHERE categoria_id = categoria_id_result) THEN
      RETURN categoria_id_result;
    END IF;
    
    -- Si existe, intentar con el siguiente
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'No se pudo generar un ID único para la categoría % después de % intentos', categoria_input, max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. CORREGIR FUNCIÓN assign_categoria_id_if_null
CREATE OR REPLACE FUNCTION public.assign_categoria_id_if_null()
RETURNS TRIGGER AS $$
BEGIN
  -- Establecer search_path explícitamente
  SET search_path = public;
  
  IF NEW.categoria_id IS NULL THEN
    NEW.categoria_id := public.generate_categoria_id(NEW.categoria);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CORREGIR FUNCIÓN generate_unique_sku (si existe)
CREATE OR REPLACE FUNCTION public.generate_unique_sku()
RETURNS INTEGER AS $$
DECLARE
  next_sku INTEGER;
  attempts INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
  -- Establecer search_path explícitamente
  SET search_path = public;
  
  LOOP
    -- Obtener el siguiente número de la secuencia
    next_sku := nextval('public.productos_sku_seq');
    
    -- Verificar que no exista
    IF NOT EXISTS (SELECT 1 FROM public.productos WHERE sku = next_sku) THEN
      RETURN next_sku;
    END IF;
    
    -- Si existe, intentar con el siguiente
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'No se pudo generar un SKU único después de % intentos', max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. CORREGIR FUNCIÓN assign_sku_if_null (si existe)
CREATE OR REPLACE FUNCTION public.assign_sku_if_null()
RETURNS TRIGGER AS $$
BEGIN
  -- Establecer search_path explícitamente
  SET search_path = public;
  
  IF NEW.sku IS NULL THEN
    NEW.sku := public.generate_unique_sku();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. CORREGIR FUNCIÓN update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Establecer search_path explícitamente
  SET search_path = public;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- 6. VERIFICAR QUE LAS FUNCIONES SE CREARON CORRECTAMENTE
-- Puedes ejecutar esto para confirmar:
-- SELECT proname, prosrc FROM pg_proc WHERE proname IN ('generate_categoria_id', 'assign_categoria_id_if_null', 'generate_unique_sku', 'assign_sku_if_null', 'update_updated_at_column');

-- 7. NOTA IMPORTANTE:
-- SECURITY DEFINER significa que la función se ejecuta con los privilegios del usuario que la creó
-- Esto es necesario para que las funciones puedan acceder a las tablas incluso con RLS habilitado
