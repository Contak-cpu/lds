-- Script de prueba para verificar que la inserción de productos funcione
-- Ejecutar después de ejecutar el script de corrección

-- 1. Verificar la estructura de la tabla
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'productos' 
ORDER BY ordinal_position;

-- 2. Verificar que no haya triggers problemáticos
SELECT 
  trigger_name,
  event_manipulation
FROM information_schema.triggers 
WHERE event_object_table = 'productos';

-- 3. Intentar insertar un producto de prueba
INSERT INTO productos (
  nombre,
  descripcion,
  categoria,
  precio,
  costo,
  stock,
  stock_minimo,
  imagen_url,
  activo
) VALUES (
  'Producto de Prueba',
  'Descripción de prueba para verificar que funciona',
  'Accesorios',
  99.99,
  50.00,
  10,
  2,
  NULL,
  true
);

-- 4. Verificar que se insertó correctamente
SELECT 
  id,
  nombre,
  categoria,
  precio,
  stock,
  sku,
  created_at
FROM productos 
WHERE nombre = 'Producto de Prueba'
ORDER BY created_at DESC
LIMIT 1;

-- 5. Limpiar el producto de prueba
DELETE FROM productos WHERE nombre = 'Producto de Prueba';

-- 6. Verificar que se eliminó
SELECT COUNT(*) as total_productos FROM productos WHERE nombre = 'Producto de Prueba';

-- Si todo funciona correctamente, deberías ver:
-- - La estructura de la tabla con tipos correctos
-- - Solo el trigger simple_sku_trigger
-- - El producto se inserta sin errores
-- - El producto se elimina correctamente
