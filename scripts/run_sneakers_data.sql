-- Script para ejecutar datos de prueba de "Los de Siempre Sneakers" CRM
-- Ejecutar este script después de crear las tablas base

-- Limpiar datos existentes (opcional - solo si quieres empezar desde cero)
-- DELETE FROM ventas_detalle;
-- DELETE FROM ventas;
-- DELETE FROM egresos;
-- DELETE FROM productos;
-- DELETE FROM clientes;
-- DELETE FROM categorias;

-- Insertar categorías de zapatillas
INSERT INTO categorias (nombre, descripcion, color) VALUES
('Running', 'Zapatillas para correr y entrenamiento', '#22c55e'),
('Basketball', 'Zapatillas para baloncesto', '#3b82f6'),
('Lifestyle', 'Zapatillas casuales y urbanas', '#8b5cf6'),
('Training', 'Zapatillas para entrenamiento funcional', '#f59e0b'),
('Soccer', 'Botines de fútbol', '#ef4444'),
('Skate', 'Zapatillas para skateboarding', '#06b6d4'),
('Tennis', 'Zapatillas para tenis', '#84cc16'),
('Golf', 'Zapatillas para golf', '#10b981')
ON CONFLICT (id) DO NOTHING;

-- Insertar productos (zapatillas)
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, sku, marca, modelo, talles_disponibles) VALUES
-- Nike Running
('Nike Air Zoom Pegasus 40', 'Zapatilla de running con tecnología Air Zoom para máximo confort', 89999, 25, 1, 'NIKE-PEG40-001', 'Nike', 'Air Zoom Pegasus 40', '{"7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"}'),
('Nike React Infinity Run 3', 'Zapatilla de running con tecnología React para estabilidad', 109999, 18, 1, 'NIKE-REACT3-002', 'Nike', 'React Infinity Run 3', '{"7", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5"}'),
('Nike ZoomX Vaporfly 3', 'Zapatilla de competición con tecnología ZoomX', 189999, 12, 1, 'NIKE-VAPOR3-003', 'Nike', 'ZoomX Vaporfly 3', '{"8", "8.5", "9", "9.5", "10", "10.5", "11"}'),

-- Nike Basketball
('Nike LeBron 20', 'Zapatilla de baloncesto signature de LeBron James', 159999, 15, 2, 'NIKE-LEBRON20-004', 'Nike', 'LeBron 20', '{"8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"}'),
('Nike KD 16', 'Zapatilla de baloncesto signature de Kevin Durant', 139999, 20, 2, 'NIKE-KD16-005', 'Nike', 'KD 16', '{"7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5"}'),
('Nike Air Jordan 38', 'Zapatilla de baloncesto legendaria Air Jordan', 179999, 22, 2, 'NIKE-AJ38-006', 'Nike', 'Air Jordan 38', '{"7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"}'),

-- Nike Lifestyle
('Nike Air Force 1', 'Zapatilla clásica de estilo urbano', 99999, 35, 3, 'NIKE-AF1-007', 'Nike', 'Air Force 1', '{"6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"}'),
('Nike Dunk Low', 'Zapatilla retro de skateboarding', 89999, 28, 3, 'NIKE-DUNK-008', 'Nike', 'Dunk Low', '{"7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"}'),
('Nike Blazer Mid', 'Zapatilla vintage de estilo retro', 79999, 30, 3, 'NIKE-BLAZER-009', 'Nike', 'Blazer Mid', '{"7", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5"}'),

-- Adidas Running
('Adidas Ultraboost 22', 'Zapatilla de running con tecnología Boost', 129999, 20, 1, 'ADIDAS-UB22-010', 'Adidas', 'Ultraboost 22', '{"7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"}'),
('Adidas Solarboost 4', 'Zapatilla de running con estabilidad mejorada', 99999, 18, 1, 'ADIDAS-SOLAR4-011', 'Adidas', 'Solarboost 4', '{"7", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5"}'),
('Adidas Adizero Adios Pro 3', 'Zapatilla de competición ultraligera', 169999, 14, 1, 'ADIDAS-ADIOS3-012', 'Adidas', 'Adizero Adios Pro 3', '{"8", "8.5", "9", "9.5", "10", "10.5", "11"}'),

-- Adidas Basketball
('Adidas Harden Vol. 7', 'Zapatilla de baloncesto signature de James Harden', 149999, 16, 2, 'ADIDAS-HARDEN7-013', 'Adidas', 'Harden Vol. 7', '{"8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"}'),
('Adidas Dame 8', 'Zapatilla de baloncesto signature de Damian Lillard', 119999, 19, 2, 'ADIDAS-DAME8-014', 'Adidas', 'Dame 8', '{"7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5"}'),
('Adidas Trae Young 2', 'Zapatilla de baloncesto signature de Trae Young', 129999, 17, 2, 'ADIDAS-TRAE2-015', 'Adidas', 'Trae Young 2', '{"8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"}'),

-- Adidas Lifestyle
('Adidas Stan Smith', 'Zapatilla clásica de tenis', 69999, 40, 3, 'ADIDAS-STAN-016', 'Adidas', 'Stan Smith', '{"6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"}'),
('Adidas Superstar', 'Zapatilla icónica con puntera de concha', 79999, 32, 3, 'ADIDAS-SUPER-017', 'Adidas', 'Superstar', '{"6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"}'),
('Adidas Gazelle', 'Zapatilla retro de estilo vintage', 69999, 25, 3, 'ADIDAS-GAZELLE-018', 'Adidas', 'Gazelle', '{"7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5"}'),

-- Otras marcas populares
('Puma RS-X', 'Zapatilla retro con estilo chunky', 89999, 22, 3, 'PUMA-RSX-019', 'Puma', 'RS-X', '{"7", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5"}'),
('New Balance 574', 'Zapatilla clásica de running', 79999, 28, 1, 'NB-574-020', 'New Balance', '574', '{"7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"}'),
('Converse Chuck Taylor All Star', 'Zapatilla canvas legendaria', 59999, 45, 3, 'CONVERSE-CHUCK-021', 'Converse', 'Chuck Taylor All Star', '{"6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"}'),
('Vans Old Skool', 'Zapatilla de skate con franja lateral', 69999, 30, 6, 'VANS-OLDSKOOL-022', 'Vans', 'Old Skool', '{"6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"}'),
('Reebok Classic Leather', 'Zapatilla retro de cuero', 69999, 25, 3, 'REEBOK-CLASSIC-023', 'Reebok', 'Classic Leather', '{"7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5"}'),
('Asics Gel-Kayano 30', 'Zapatilla de running con tecnología Gel', 119999, 20, 1, 'ASICS-KAYANO30-024', 'Asics', 'Gel-Kayano 30', '{"7", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"}')
ON CONFLICT (id) DO NOTHING;

-- Insertar clientes de prueba
INSERT INTO clientes (nombre, email, telefono, direccion, estado) VALUES
('Juan Carlos Rodríguez', 'juan.rodriguez@email.com', '+54 11 1234-5678', 'Av. Corrientes 1234, CABA', 'activo'),
('María González', 'maria.gonzalez@email.com', '+54 11 2345-6789', 'Calle Florida 567, CABA', 'activo'),
('Carlos López', 'carlos.lopez@email.com', '+54 11 3456-7890', 'Av. Santa Fe 890, CABA', 'activo'),
('Ana Martínez', 'ana.martinez@email.com', '+54 11 4567-8901', 'Calle Lavalle 234, CABA', 'activo'),
('Roberto Silva', 'roberto.silva@email.com', '+54 11 5678-9012', 'Av. Córdoba 456, CABA', 'activo'),
('Laura Fernández', 'laura.fernandez@email.com', '+54 11 6789-0123', 'Calle Sarmiento 789, CABA', 'activo'),
('Diego Morales', 'diego.morales@email.com', '+54 11 7890-1234', 'Av. Callao 123, CABA', 'activo'),
('Patricia Ruiz', 'patricia.ruiz@email.com', '+54 11 8901-2345', 'Calle Tucumán 456, CABA', 'activo'),
('Fernando Torres', 'fernando.torres@email.com', '+54 11 9012-3456', 'Av. 9 de Julio 789, CABA', 'activo'),
('Silvia Vargas', 'silvia.vargas@email.com', '+54 11 0123-4567', 'Calle San Martín 012, CABA', 'activo')
ON CONFLICT (id) DO NOTHING;

-- Insertar ventas de prueba
INSERT INTO ventas (cliente_id, fecha_venta, total, metodo_pago, estado, notas) VALUES
(1, '2024-01-15', 89999, 'tarjeta', 'completada', 'Venta de Nike Air Force 1'),
(2, '2024-01-16', 159999, 'efectivo', 'completada', 'Venta de Nike LeBron 20'),
(3, '2024-01-17', 129999, 'transferencia', 'completada', 'Venta de Adidas Ultraboost 22'),
(4, '2024-01-18', 79999, 'tarjeta', 'completada', 'Venta de Nike Blazer Mid'),
(5, '2024-01-19', 109999, 'efectivo', 'completada', 'Venta de Nike React Infinity Run 3'),
(6, '2024-01-20', 69999, 'tarjeta', 'completada', 'Venta de Adidas Stan Smith'),
(7, '2024-01-21', 179999, 'transferencia', 'completada', 'Venta de Nike Air Jordan 38'),
(8, '2024-01-22', 89999, 'efectivo', 'completada', 'Venta de Nike Dunk Low'),
(9, '2024-01-23', 149999, 'tarjeta', 'completada', 'Venta de Adidas Harden Vol. 7'),
(10, '2024-01-24', 69999, 'efectivo', 'completada', 'Venta de Converse Chuck Taylor')
ON CONFLICT (id) DO NOTHING;

-- Insertar detalles de ventas
INSERT INTO ventas_detalle (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 7, 1, 89999, 89999),
(2, 4, 1, 159999, 159999),
(3, 10, 1, 129999, 129999),
(4, 9, 1, 79999, 79999),
(5, 2, 1, 109999, 109999),
(6, 16, 1, 69999, 69999),
(7, 6, 1, 179999, 179999),
(8, 8, 1, 89999, 89999),
(9, 13, 1, 149999, 149999),
(10, 21, 1, 59999, 59999)
ON CONFLICT (id) DO NOTHING;

-- Insertar egresos de prueba
INSERT INTO egresos (fecha_egreso, descripcion, categoria, monto, proveedor, metodo_pago, notas) VALUES
('2024-01-10', 'Compra de stock Nike Air Force 1', 'Proveedores', 450000, 'Nike Argentina', 'transferencia', 'Compra de 5 pares'),
('2024-01-12', 'Compra de stock Adidas Ultraboost 22', 'Proveedores', 520000, 'Adidas Argentina', 'transferencia', 'Compra de 4 pares'),
('2024-01-14', 'Alquiler local comercial', 'Alquiler', 150000, 'Propietario Local', 'transferencia', 'Alquiler mensual'),
('2024-01-15', 'Servicios públicos', 'Servicios', 25000, 'EDESUR', 'débito', 'Electricidad y gas'),
('2024-01-16', 'Mantenimiento aire acondicionado', 'Mantenimiento', 35000, 'Clima Service', 'efectivo', 'Limpieza y revisión'),
('2024-01-17', 'Compra de stock Nike LeBron 20', 'Proveedores', 800000, 'Nike Argentina', 'transferencia', 'Compra de 5 pares'),
('2024-01-18', 'Marketing digital', 'Marketing', 45000, 'Agencia Digital', 'transferencia', 'Campaña Instagram y Facebook'),
('2024-01-19', 'Seguro local', 'Seguros', 28000, 'Seguros La Caja', 'débito', 'Seguro mensual'),
('2024-01-20', 'Compra de stock Adidas Stan Smith', 'Proveedores', 280000, 'Adidas Argentina', 'transferencia', 'Compra de 4 pares'),
('2024-01-21', 'Limpieza local', 'Servicios', 15000, 'Limpieza Express', 'efectivo', 'Limpieza semanal')
ON CONFLICT (id) DO NOTHING;

-- Mensaje de confirmación
SELECT 'Datos de prueba de "Los de Siempre Sneakers" CRM cargados exitosamente!' as mensaje;
