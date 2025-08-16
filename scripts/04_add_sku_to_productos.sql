-- Agregar campo SKU a la tabla productos
-- Este script agrega un campo SKU personalizable para cada producto

-- Agregar columna SKU
ALTER TABLE productos ADD COLUMN IF NOT EXISTS sku VARCHAR(50) UNIQUE;

-- Crear índice para mejorar búsquedas por SKU
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);

-- Crear función para generar SKU automático basado en categoría
CREATE OR REPLACE FUNCTION generate_sku(categoria_producto VARCHAR(100))
RETURNS VARCHAR(50) AS $$
DECLARE
    next_number INTEGER;
    sku_generated VARCHAR(50);
    categoria_prefix VARCHAR(10);
BEGIN
    -- Definir prefijos por categoría
    CASE categoria_producto
        WHEN 'Semillas' THEN categoria_prefix := 'SEED';
        WHEN 'Fertilizantes' THEN categoria_prefix := 'FERT';
        WHEN 'Iluminación' THEN categoria_prefix := 'LIGHT';
        WHEN 'Hidroponía' THEN categoria_prefix := 'HYDRO';
        WHEN 'Herramientas' THEN categoria_prefix := 'TOOL';
        WHEN 'Kits' THEN categoria_prefix := 'KIT';
        ELSE categoria_prefix := 'PROD';
    END CASE;
    
    -- Obtener el siguiente número para esta categoría
    SELECT COALESCE(MAX(CAST(SUBSTRING(sku FROM LENGTH(categoria_prefix) + 2) AS INTEGER)), 0) + 1
    INTO next_number
    FROM productos 
    WHERE sku LIKE categoria_prefix || '-%' 
    AND sku ~ ('^' || categoria_prefix || '-[0-9]+$');
    
    -- Generar SKU con formato CATEGORIA-0001
    sku_generated := categoria_prefix || '-' || LPAD(next_number::TEXT, 4, '0');
    
    RETURN sku_generated;
END;
$$ LANGUAGE plpgsql;

-- Actualizar productos existentes con SKUs generados automáticamente
UPDATE productos 
SET sku = generate_sku(categoria) 
WHERE sku IS NULL;

-- Hacer el campo SKU NOT NULL después de poblarlo
ALTER TABLE productos ALTER COLUMN sku SET NOT NULL; 