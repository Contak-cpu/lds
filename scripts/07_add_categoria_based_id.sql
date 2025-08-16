-- Agregar campo ID basado en categoría a la tabla productos
-- Este script crea un sistema de ID automático basado en la categoría del producto

-- Agregar columna categoria_id como VARCHAR
ALTER TABLE productos ADD COLUMN IF NOT EXISTS categoria_id VARCHAR(20) UNIQUE;

-- Crear índice para mejorar búsquedas por categoria_id
CREATE INDEX IF NOT EXISTS idx_productos_categoria_id ON productos(categoria_id);

-- Crear función para generar ID basado en categoría
CREATE OR REPLACE FUNCTION generate_categoria_id(categoria_input VARCHAR(100))
RETURNS VARCHAR(20) AS $$
DECLARE
  categoria_prefix VARCHAR(10);
  next_number INTEGER;
  categoria_id_result VARCHAR(20);
  attempts INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
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
    FROM productos 
    WHERE categoria_id LIKE categoria_prefix || '-%';
    
    -- Formatear el ID con ceros a la izquierda (ej: SEM-001, SEM-002)
    categoria_id_result := categoria_prefix || '-' || LPAD(next_number::TEXT, 3, '0');
    
    -- Verificar que no exista
    IF NOT EXISTS (SELECT 1 FROM productos WHERE categoria_id = categoria_id_result) THEN
      RETURN categoria_id_result;
    END IF;
    
    -- Si existe, intentar con el siguiente
    attempts := attempts + 1;
    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'No se pudo generar un ID único para la categoría % después de % intentos', categoria_input, max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para asignar categoria_id automáticamente si no se proporciona
CREATE OR REPLACE FUNCTION assign_categoria_id_if_null()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.categoria_id IS NULL THEN
    NEW.categoria_id := generate_categoria_id(NEW.categoria);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
DROP TRIGGER IF EXISTS trigger_assign_categoria_id ON productos;
CREATE TRIGGER trigger_assign_categoria_id
  BEFORE INSERT ON productos
  FOR EACH ROW
  EXECUTE FUNCTION assign_categoria_id_if_null();

-- Actualizar productos existentes con IDs basados en categoría
UPDATE productos 
SET categoria_id = generate_categoria_id(categoria)
WHERE categoria_id IS NULL;
