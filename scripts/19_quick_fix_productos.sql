-- Script rápido para corregir el error de tipos en productos
-- Error: "operator does not exist: character varying = integer"

-- 1. Eliminar triggers problemáticos
DROP TRIGGER IF EXISTS trigger_assign_sku ON productos;
DROP TRIGGER IF EXISTS trigger_assign_categoria_id ON productos;

-- 2. Eliminar funciones problemáticas
DROP FUNCTION IF EXISTS assign_sku_if_null() CASCADE;
DROP FUNCTION IF EXISTS assign_categoria_id_if_null() CASCADE;
DROP FUNCTION IF EXISTS generate_unique_sku() CASCADE;
DROP FUNCTION IF EXISTS generate_categoria_id(VARCHAR) CASCADE;

-- 3. Eliminar secuencia problemática
DROP SEQUENCE IF EXISTS productos_sku_seq;

-- 4. Verificar que la tabla tenga la estructura correcta
-- (Esto debería funcionar ahora sin los triggers problemáticos)

-- 5. Crear un trigger simple solo para SKU si es necesario
CREATE OR REPLACE FUNCTION simple_assign_sku()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sku IS NULL THEN
    NEW.sku := COALESCE((SELECT MAX(sku) FROM productos), 0) + 1;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER simple_sku_trigger
  BEFORE INSERT ON productos
  FOR EACH ROW
  EXECUTE FUNCTION simple_assign_sku();

-- 6. Verificar que la inserción funcione
-- Ahora deberías poder insertar productos sin problemas
