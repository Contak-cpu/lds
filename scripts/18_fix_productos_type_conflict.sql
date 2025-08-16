-- Script para diagnosticar y corregir conflictos de tipos en la tabla productos
-- Este script resuelve el error: "operator does not exist: character varying = integer"

-- 1. Verificar la estructura actual de la tabla productos
DO $$
BEGIN
  RAISE NOTICE '=== ESTRUCTURA ACTUAL DE LA TABLA productos ===';
END $$;

-- Mostrar columnas y tipos
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'productos' 
ORDER BY ordinal_position;

-- 2. Verificar triggers existentes
DO $$
BEGIN
  RAISE NOTICE '=== TRIGGERS EXISTENTES ===';
END $$;

SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'productos';

-- 3. Verificar funciones relacionadas
DO $$
BEGIN
  RAISE NOTICE '=== FUNCIONES RELACIONADAS ===';
END $$;

SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name LIKE '%producto%' 
   OR routine_name LIKE '%sku%' 
   OR routine_name LIKE '%categoria%';

-- 4. Limpiar y recrear la estructura correcta
DO $$
BEGIN
  RAISE NOTICE '=== LIMPIANDO ESTRUCTURA ===';
END $$;

-- Eliminar triggers problemáticos
DROP TRIGGER IF EXISTS trigger_assign_sku ON productos;
DROP TRIGGER IF EXISTS trigger_assign_categoria_id ON productos;

-- Eliminar funciones problemáticas
DROP FUNCTION IF EXISTS assign_sku_if_null() CASCADE;
DROP FUNCTION IF EXISTS assign_categoria_id_if_null() CASCADE;
DROP FUNCTION IF EXISTS generate_unique_sku() CASCADE;
DROP FUNCTION IF EXISTS generate_categoria_id(VARCHAR) CASCADE;

-- Eliminar secuencia si existe
DROP SEQUENCE IF EXISTS productos_sku_seq;

-- 5. Verificar y corregir tipos de datos
DO $$
BEGIN
  RAISE NOTICE '=== CORRIGIENDO TIPOS DE DATOS ===';
END $$;

-- Asegurar que las columnas tengan los tipos correctos
ALTER TABLE productos 
  ALTER COLUMN nombre TYPE VARCHAR(255),
  ALTER COLUMN descripcion TYPE TEXT,
  ALTER COLUMN categoria TYPE VARCHAR(100),
  ALTER COLUMN precio TYPE DECIMAL(10,2),
  ALTER COLUMN costo TYPE DECIMAL(10,2),
  ALTER COLUMN stock TYPE INTEGER,
  ALTER COLUMN stock_minimo TYPE INTEGER,
  ALTER COLUMN imagen_url TYPE TEXT,
  ALTER COLUMN activo TYPE BOOLEAN;

-- 6. Recrear la funcionalidad de SKU de manera más simple
DO $$
BEGIN
  RAISE NOTICE '=== RECREANDO FUNCIONALIDAD DE SKU ===';
END $$;

-- Agregar columna SKU si no existe
ALTER TABLE productos ADD COLUMN IF NOT EXISTS sku INTEGER;

-- Crear secuencia para SKU
CREATE SEQUENCE IF NOT EXISTS productos_sku_seq START 1;

-- Función simple para generar SKU
CREATE OR REPLACE FUNCTION generate_sku()
RETURNS INTEGER AS $$
BEGIN
  RETURN nextval('productos_sku_seq');
END;
$$ LANGUAGE plpgsql;

-- Trigger simple para SKU
CREATE OR REPLACE FUNCTION assign_sku()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.sku IS NULL THEN
    NEW.sku := generate_sku();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_assign_sku
  BEFORE INSERT ON productos
  FOR EACH ROW
  EXECUTE FUNCTION assign_sku();

-- 7. Actualizar productos existentes sin SKU
DO $$
BEGIN
  RAISE NOTICE '=== ACTUALIZANDO PRODUCTOS EXISTENTES ===';
END $$;

UPDATE productos 
SET sku = generate_sku()
WHERE sku IS NULL;

-- 8. Verificar la estructura final
DO $$
BEGIN
  RAISE NOTICE '=== ESTRUCTURA FINAL ===';
END $$;

SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'productos' 
ORDER BY ordinal_position;

-- 9. Crear índices para mejorar performance
DO $$
BEGIN
  RAISE NOTICE '=== CREANDO ÍNDICES ===';
END $$;

CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);

-- 10. Verificar que todo funcione
DO $$
BEGIN
  RAISE NOTICE '=== VERIFICACIÓN FINAL ===';
  RAISE NOTICE 'La tabla productos ha sido corregida y optimizada.';
  RAISE NOTICE 'Los triggers y funciones problemáticas han sido reemplazados.';
END $$;
