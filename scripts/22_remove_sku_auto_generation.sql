-- Script para eliminar completamente la funcionalidad de SKU automático
-- Esto resolverá el error de tipos incompatibles

-- 1. Eliminar todos los triggers relacionados con SKU
DROP TRIGGER IF EXISTS trigger_assign_sku ON productos;
DROP TRIGGER IF EXISTS trigger_assign_sku_safe ON productos;
DROP TRIGGER IF EXISTS simple_sku_trigger ON productos;
DROP TRIGGER IF EXISTS trigger_assign_categoria_id ON productos;

-- 2. Eliminar todas las funciones relacionadas con SKU
DROP FUNCTION IF EXISTS assign_sku() CASCADE;
DROP FUNCTION IF EXISTS assign_sku_safe() CASCADE;
DROP FUNCTION IF EXISTS simple_assign_sku() CASCADE;
DROP FUNCTION IF EXISTS assign_sku_if_null() CASCADE;
DROP FUNCTION IF EXISTS assign_categoria_id_if_null() CASCADE;
DROP FUNCTION IF EXISTS generate_unique_sku() CASCADE;
DROP FUNCTION IF EXISTS generate_categoria_id(VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS generate_sku() CASCADE;

-- 3. Eliminar secuencias
DROP SEQUENCE IF EXISTS productos_sku_seq;

-- 4. Hacer la columna SKU nullable y sin restricciones
ALTER TABLE productos ALTER COLUMN sku DROP NOT NULL;
ALTER TABLE productos DROP CONSTRAINT IF EXISTS productos_sku_key;

-- 5. Verificar que no haya triggers activos
SELECT 
  trigger_name,
  event_manipulation
FROM information_schema.triggers 
WHERE event_object_table = 'productos';

-- 6. Verificar que no haya funciones relacionadas
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_name LIKE '%sku%' 
   OR routine_name LIKE '%categoria%'
   OR routine_name LIKE '%producto%';

-- 7. Ahora deberías poder insertar productos sin problemas
-- La columna SKU será opcional y no se generará automáticamente
