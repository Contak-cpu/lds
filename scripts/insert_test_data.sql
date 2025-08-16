-- Script para insertar datos de prueba en la base de datos
-- Ejecuta este script después de crear las tablas para tener datos con los que trabajar

-- Insertar clientes de prueba
INSERT INTO clientes (nombre, email, telefono, ciudad, provincia, fecha_registro) VALUES
('Juan Pérez', 'juan.perez@email.com', '123456789', 'Buenos Aires', 'Buenos Aires', NOW()),
('María García', 'maria.garcia@email.com', '987654321', 'Córdoba', 'Córdoba', NOW()),
('Carlos López', 'carlos.lopez@email.com', '555666777', 'Rosario', 'Santa Fe', NOW()),
('Ana Martínez', 'ana.martinez@email.com', '111222333', 'Mendoza', 'Mendoza', NOW()),
('Luis Rodríguez', 'luis.rodriguez@email.com', '444555666', 'La Plata', 'Buenos Aires', NOW());

-- Insertar productos de prueba
INSERT INTO productos (nombre, descripcion, categoria, precio, costo, stock, stock_minimo, activo) VALUES
('Semillas de Cannabis Premium', 'Semillas de alta calidad para cultivo', 'Semillas', 5000, 2500, 100, 10, true),
('Sistema Hidropónico DWC', 'Sistema de cultivo hidropónico de aguas profundas', 'Equipos', 15000, 8000, 25, 5, true),
('Nutrientes Orgánicos', 'Nutrientes completos para todas las etapas del cultivo', 'Nutrientes', 3000, 1500, 50, 8, true),
('Tijeras de Poda Profesionales', 'Tijeras de alta precisión para poda', 'Herramientas', 2500, 1200, 30, 5, true),
('Lámpara LED 600W', 'Lámpara LED de alta eficiencia para cultivo indoor', 'Iluminación', 25000, 15000, 15, 3, true),
('Sustrato Premium', 'Sustrato orgánico de alta calidad', 'Sustratos', 2000, 1000, 80, 10, true),
('Medidor de pH Digital', 'Medidor preciso de pH para cultivo', 'Medidores', 8000, 4000, 20, 5, true),
('Ventilador de Extracción', 'Ventilador para control de temperatura y humedad', 'Ventilación', 12000, 7000, 12, 3, true);

-- Insertar algunas ventas de prueba
INSERT INTO ventas (cliente_id, cliente_nombre, tipo_venta, subtotal, descuento, total, estado, metodo_pago, fecha_venta) VALUES
((SELECT id FROM clientes WHERE nombre = 'Juan Pérez' LIMIT 1), 'Juan Pérez', 'registrada', 8000, 0, 8000, 'Completado', 'efectivo', NOW() - INTERVAL '2 days'),
((SELECT id FROM clientes WHERE nombre = 'María García' LIMIT 1), 'María García', 'registrada', 15000, 1000, 14000, 'Completado', 'tarjeta', NOW() - INTERVAL '1 day'),
(NULL, 'Cliente Casual', 'casual', 5000, 0, 5000, 'Completado', 'efectivo', NOW() - INTERVAL '12 hours'),
((SELECT id FROM clientes WHERE nombre = 'Carlos López' LIMIT 1), 'Carlos López', 'registrada', 30000, 0, 30000, 'Pendiente', 'transferencia', NOW() - INTERVAL '6 hours');

-- Insertar items de venta para las ventas creadas
INSERT INTO venta_items (venta_id, producto_id, producto_nombre, cantidad, precio_unitario, subtotal) VALUES
((SELECT id FROM ventas WHERE cliente_nombre = 'Juan Pérez' LIMIT 1), 
 (SELECT id FROM productos WHERE nombre = 'Semillas de Cannabis Premium' LIMIT 1),
 'Semillas de Cannabis Premium', 1, 5000, 5000),
((SELECT id FROM ventas WHERE cliente_nombre = 'Juan Pérez' LIMIT 1),
 (SELECT id FROM productos WHERE nombre = 'Nutrientes Orgánicos' LIMIT 1),
 'Nutrientes Orgánicos', 1, 3000, 3000),
((SELECT id FROM ventas WHERE cliente_nombre = 'María García' LIMIT 1),
 (SELECT id FROM productos WHERE nombre = 'Sistema Hidropónico DWC' LIMIT 1),
 'Sistema Hidropónico DWC', 1, 15000, 15000),
((SELECT id FROM ventas WHERE cliente_nombre = 'Cliente Casual' LIMIT 1),
 (SELECT id FROM productos WHERE nombre = 'Tijeras de Poda Profesionales' LIMIT 1),
 'Tijeras de Poda Profesionales', 2, 2500, 5000),
((SELECT id FROM ventas WHERE cliente_nombre = 'Carlos López' LIMIT 1),
 (SELECT id FROM productos WHERE nombre = 'Lámpara LED 600W' LIMIT 1),
 'Lámpara LED 600W', 1, 25000, 25000),
((SELECT id FROM ventas WHERE cliente_nombre = 'Carlos López' LIMIT 1),
 (SELECT id FROM productos WHERE nombre = 'Ventilador de Extracción' LIMIT 1),
 'Ventilador de Extracción', 1, 12000, 12000);

-- Verificar que los datos se insertaron correctamente
SELECT 'Clientes insertados:' as info, COUNT(*) as total FROM clientes
UNION ALL
SELECT 'Productos insertados:', COUNT(*) FROM productos
UNION ALL
SELECT 'Ventas insertadas:', COUNT(*) FROM ventas
UNION ALL
SELECT 'Items de venta insertados:', COUNT(*) FROM venta_items; 