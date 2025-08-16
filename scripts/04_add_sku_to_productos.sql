-- Agregar campo SKU a la tabla productos
-- Este script agrega un campo SKU numérico único para cada producto

-- Agregar columna SKU como INTEGER
ALTER TABLE productos ADD COLUMN IF NOT EXISTS sku INTEGER UNIQUE;

-- Crear índice para mejorar búsquedas por SKU
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);

-- Crear secuencia para generar SKUs automáticamente
CREATE SEQUENCE IF NOT EXISTS productos_sku_seq START 1;

-- Crear función para generar SKU único automáticamente
CREATE OR REPLACE FUNCTION generate_unique_sku()
RETURNS INTEGER AS $$
DECLARE
  next_sku INTEGER;
  attempts INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
  LOOP
    -- Obtener el siguiente número de la secuencia
    next_sku := nextval('productos_sku_seq');
    
    -- Verificar que no exista
    IF NOT EXISTS (SELECT 1 FROM productos WHERE sku = next_sku) THEN
      RETURN next_sku;
    END IF;
    
    -- Si existe, intentar con el siguiente
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'No se pudo generar un SKU único después de % intentos', max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para asignar SKU automáticamente si no se proporciona
CREATE OR REPLACE FUNCTION assign_sku_if_null()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sku IS NULL THEN
    NEW.sku := generate_unique_sku();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
DROP TRIGGER IF EXISTS trigger_assign_sku ON productos;
CREATE TRIGGER trigger_assign_sku
  BEFORE INSERT ON productos
  FOR EACH ROW
  EXECUTE FUNCTION assign_sku_if_null(); 