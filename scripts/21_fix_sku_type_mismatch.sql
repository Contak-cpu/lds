-- Script para corregir el error de tipos incompatibles en SKU
-- Error: "COALESCE types text and integer cannot be matched"

-- 1. Verificar el tipo actual de la columna SKU
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'productos' AND column_name = 'sku';

-- 2. Eliminar el trigger problemático
DROP TRIGGER IF EXISTS simple_sku_trigger ON productos;
DROP FUNCTION IF EXISTS simple_assign_sku() CASCADE;

-- 3. Corregir el tipo de la columna SKU
-- Si es text, convertirla a integer
ALTER TABLE productos ALTER COLUMN sku TYPE INTEGER USING 
  CASE 
    WHEN sku IS NULL THEN NULL
    WHEN sku = '' THEN NULL
    ELSE sku::INTEGER 
  END;

-- 4. Crear una función más robusta para asignar SKU
CREATE OR REPLACE FUNCTION assign_sku_safe()
RETURNS TRIGGER AS $$
DECLARE
  next_sku INTEGER;
BEGIN
  -- Si ya tiene SKU, no hacer nada
  IF NEW.sku IS NOT NULL THEN
    RETURN NEW;
  END IF;
  
  -- Obtener el siguiente SKU disponible
  SELECT COALESCE(MAX(sku), 0) + 1 INTO next_sku
  FROM productos 
  WHERE sku IS NOT NULL AND sku > 0;
  
  -- Asignar el SKU
  NEW.sku := next_sku;
  
  RETURN NEW;
EXCEPTION
  -- Si hay algún error, asignar un SKU por defecto
  WHEN OTHERS THEN
    NEW.sku := 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Crear el trigger
CREATE TRIGGER trigger_assign_sku_safe
  BEFORE INSERT ON productos
  FOR EACH ROW
  EXECUTE FUNCTION assign_sku_safe();

-- 6. Actualizar productos existentes sin SKU
UPDATE productos 
SET sku = COALESCE((SELECT MAX(sku) FROM productos WHERE sku IS NOT NULL), 0) + ROW_NUMBER() OVER (ORDER BY created_at)
WHERE sku IS NULL OR sku = 0;

-- 7. Verificar que todo funcione
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'productos' AND column_name = 'sku';

-- 8. Verificar triggers activos
SELECT 
  trigger_name,
  event_manipulation
FROM information_schema.triggers 
WHERE event_object_table = 'productos';
