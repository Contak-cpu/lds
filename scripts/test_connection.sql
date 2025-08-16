-- Script para probar la conexión y verificar la estructura de la base de datos
-- Ejecuta este script en tu base de datos para verificar que todo esté funcionando

-- 1. Verificar que las tablas existan
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('clientes', 'productos', 'ventas', 'venta_items')
ORDER BY table_name;

-- 2. Verificar la estructura de la tabla clientes
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'clientes'
ORDER BY ordinal_position;

-- 3. Verificar la estructura de la tabla productos
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'productos'
ORDER BY ordinal_position;

-- 4. Verificar la estructura de la tabla ventas
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'ventas'
ORDER BY ordinal_position;

-- 5. Verificar la estructura de la tabla venta_items
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'venta_items'
ORDER BY ordinal_position;

-- 6. Contar registros en cada tabla
SELECT 
    'clientes' as tabla,
    COUNT(*) as total_registros
FROM clientes
UNION ALL
SELECT 
    'productos' as tabla,
    COUNT(*) as total_registros
FROM productos
UNION ALL
SELECT 
    'ventas' as tabla,
    COUNT(*) as total_registros
FROM ventas
UNION ALL
SELECT 
    'venta_items' as tabla,
    COUNT(*) as total_registros
FROM venta_items;

-- 7. Verificar productos activos
SELECT 
    COUNT(*) as productos_activos,
    COUNT(CASE WHEN stock > 0 THEN 1 END) as productos_con_stock
FROM productos 
WHERE activo = true;

-- 8. Verificar clientes registrados
SELECT 
    COUNT(*) as total_clientes,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as clientes_con_email
FROM clientes; 