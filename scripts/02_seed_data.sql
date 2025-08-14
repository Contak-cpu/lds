-- Insertar datos de ejemplo para clientes
INSERT INTO clientes (nombre, email, telefono, direccion, ciudad, provincia, codigo_postal, notas) VALUES
('Juan Pérez', 'juan.perez@email.com', '+54 11 1234-5678', 'Av. Corrientes 1234', 'Buenos Aires', 'CABA', '1043', 'Cliente frecuente'),
('María González', 'maria.gonzalez@email.com', '+54 11 2345-6789', 'Av. Santa Fe 5678', 'Buenos Aires', 'CABA', '1425', 'Interesada en hidroponía'),
('Carlos Rodríguez', 'carlos.rodriguez@email.com', '+54 11 3456-7890', 'Av. Rivadavia 9012', 'Buenos Aires', 'CABA', '1406', 'Cultivo interior'),
('Ana Martínez', 'ana.martinez@email.com', '+54 11 4567-8901', 'Av. Cabildo 3456', 'Buenos Aires', 'CABA', '1428', 'Cliente mayorista'),
('Luis Fernández', 'luis.fernandez@email.com', '+54 11 5678-9012', 'Av. Las Heras 7890', 'Buenos Aires', 'CABA', '1127', 'Cultivo exterior');

-- Insertar datos de ejemplo para productos
INSERT INTO productos (nombre, descripcion, categoria, precio, costo, stock, stock_minimo, activo) VALUES
('Kit Cultivo Indoor Básico', 'Kit completo para comenzar cultivo interior', 'Kits', 45000, 30000, 15, 5, true),
('Semillas Auto Northern Lights', 'Semillas autoflorecientes de alta calidad', 'Semillas', 8500, 5000, 50, 10, true),
('Fertilizante Crecimiento 1L', 'Fertilizante líquido para etapa vegetativa', 'Fertilizantes', 3200, 2000, 25, 8, true),
('LED Full Spectrum 300W', 'Lámpara LED para cultivo interior', 'Iluminación', 28000, 18000, 8, 3, true),
('Sistema DWC 4 Plantas', 'Sistema hidropónico de agua profunda', 'Hidroponía', 15500, 10000, 12, 4, true),
('Tijeras de Poda Profesional', 'Tijeras de acero inoxidable para poda', 'Herramientas', 4200, 2500, 20, 6, true),
('Macetas Textiles 20L', 'Macetas de tela transpirable', 'Macetas', 1800, 1000, 35, 12, true),
('pH Metro Digital', 'Medidor de pH digital con calibración', 'Medición', 6800, 4200, 10, 3, true);

-- Insertar datos de ejemplo para ventas
INSERT INTO ventas (cliente_id, tipo_venta, subtotal, descuento, total, estado, metodo_pago, notas, fecha_venta) VALUES
((SELECT id FROM clientes WHERE email = 'juan.perez@email.com'), 'registrada', 48200, 2200, 46000, 'completado', 'Efectivo', 'Venta con descuento por cliente frecuente', NOW() - INTERVAL '2 days'),
((SELECT id FROM clientes WHERE email = 'maria.gonzalez@email.com'), 'registrada', 15500, 0, 15500, 'completado', 'Transferencia', 'Primera compra de sistema hidropónico', NOW() - INTERVAL '1 day'),
(NULL, 'casual', 12000, 0, 12000, 'completado', 'Efectivo', 'Venta rápida - cliente ocasional', NOW());

-- Insertar items de venta
INSERT INTO venta_items (venta_id, producto_id, producto_nombre, cantidad, precio_unitario, subtotal) VALUES
((SELECT id FROM ventas WHERE total = 46000), (SELECT id FROM productos WHERE nombre = 'Kit Cultivo Indoor Básico'), 'Kit Cultivo Indoor Básico', 1, 45000, 45000),
((SELECT id FROM ventas WHERE total = 46000), (SELECT id FROM productos WHERE nombre = 'pH Metro Digital'), 'pH Metro Digital', 1, 6800, 6800),
((SELECT id FROM ventas WHERE total = 15500), (SELECT id FROM productos WHERE nombre = 'Sistema DWC 4 Plantas'), 'Sistema DWC 4 Plantas', 1, 15500, 15500),
((SELECT id FROM ventas WHERE total = 12000), NULL, 'Venta rápida - 3 cedas + 2 filtros + tabaco', 1, 12000, 12000);

-- Insertar datos de ejemplo para egresos
INSERT INTO egresos (descripcion, categoria, monto, proveedor, metodo_pago, fecha_egreso, notas) VALUES
('Alquiler local comercial', 'Alquiler', 180000, 'Inmobiliaria San Martín', 'Transferencia', CURRENT_DATE - INTERVAL '5 days', 'Alquiler mensual'),
('Compra stock fertilizantes', 'Proveedores', 85000, 'Distribuidora Verde SA', 'Transferencia', CURRENT_DATE - INTERVAL '3 days', 'Reposición stock'),
('Servicio de luz', 'Servicios', 25000, 'Edenor', 'Débito automático', CURRENT_DATE - INTERVAL '2 days', 'Factura mensual'),
('Compra semillas importadas', 'Proveedores', 120000, 'Seeds International', 'Transferencia', CURRENT_DATE - INTERVAL '1 day', 'Stock premium'),
('Mantenimiento equipos', 'Mantenimiento', 15000, 'Técnico Especializado', 'Efectivo', CURRENT_DATE, 'Reparación LED');
