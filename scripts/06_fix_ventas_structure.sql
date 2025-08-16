-- Script para corregir la estructura de las tablas de ventas
-- Ejecutar este script después de crear las tablas básicas

-- Agregar columna cliente_casual a la tabla ventas si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ventas' AND column_name = 'cliente_casual') THEN
        ALTER TABLE ventas ADD COLUMN cliente_casual VARCHAR(255);
    END IF;
END $$;

-- Agregar columnas faltantes a venta_items si no existen
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'venta_items' AND column_name = 'categoria') THEN
        ALTER TABLE venta_items ADD COLUMN categoria VARCHAR(100) DEFAULT 'Sin categoría';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'venta_items' AND column_name = 'descripcion') THEN
        ALTER TABLE venta_items ADD COLUMN descripcion TEXT DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'venta_items' AND column_name = 'imagen_url') THEN
        ALTER TABLE venta_items ADD COLUMN imagen_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'venta_items' AND column_name = 'updated_at') THEN
        ALTER TABLE venta_items ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Agregar columna sku a productos si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'productos' AND column_name = 'sku') THEN
        ALTER TABLE productos ADD COLUMN sku VARCHAR(100) UNIQUE;
    END IF;
END $$;

-- Crear índices adicionales para mejorar performance
CREATE INDEX IF NOT EXISTS idx_venta_items_venta_id ON venta_items(venta_id);
CREATE INDEX IF NOT EXISTS idx_venta_items_producto_id ON venta_items(producto_id);
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);

-- Actualizar productos existentes con SKU si no tienen
UPDATE productos 
SET sku = CONCAT('SKU-', LPAD(id::text, 8, '0'))
WHERE sku IS NULL OR sku = '';

-- Verificar que las tablas tengan la estructura correcta
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('ventas', 'venta_items', 'productos', 'clientes')
ORDER BY table_name, ordinal_position; 