-- Agregar campo estado a la tabla clientes
-- Este script agrega un campo estado para gestionar clientes activos/inactivos

-- Agregar columna estado
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS estado VARCHAR(50) DEFAULT 'Activo';

-- Crear índice para mejorar búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_clientes_estado ON clientes(estado);

-- Actualizar clientes existentes con estado 'Activo' por defecto
UPDATE clientes SET estado = 'Activo' WHERE estado IS NULL;

-- Hacer el campo estado NOT NULL después de poblarlo
ALTER TABLE clientes ALTER COLUMN estado SET NOT NULL; 