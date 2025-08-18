-- Crear tabla de categorías para permitir gestión dinámica
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  icono VARCHAR(50), -- Nombre del icono de Lucide
  color VARCHAR(7) DEFAULT '#3B82F6', -- Color hexadecimal por defecto
  activo BOOLEAN DEFAULT TRUE,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_categorias_nombre ON categorias(nombre);
CREATE INDEX IF NOT EXISTS idx_categorias_activo ON categorias(activo);
CREATE INDEX IF NOT EXISTS idx_categorias_orden ON categorias(orden);

-- Insertar categorías por defecto
INSERT INTO categorias (nombre, descripcion, icono, color, orden) VALUES
  ('Kits', 'Kits completos de cultivo', 'Package', '#10B981', 1),
  ('Semillas', 'Semillas de cannabis y otras plantas', 'Leaf', '#059669', 2),
  ('Fertilizantes', 'Nutrientes y fertilizantes para plantas', 'Droplets', '#3B82F6', 3),
  ('Iluminación', 'Sistemas de iluminación para cultivo', 'Lightbulb', '#F59E0B', 4),
  ('Hidroponía', 'Sistemas hidropónicos', 'Thermometer', '#8B5CF6', 5),
  ('Herramientas', 'Herramientas para cultivo y mantenimiento', 'Scissors', '#EF4444', 6),
  ('Sustratos', 'Sustratos y medios de cultivo', 'Sprout', '#84CC16', 7),
  ('Accesorios', 'Accesorios varios para cultivo', 'Settings', '#6B7280', 8)
ON CONFLICT (nombre) DO NOTHING;

-- Crear trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_categorias_updated_at 
  BEFORE UPDATE ON categorias 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Agregar foreign key a la tabla productos (opcional, para mantener integridad referencial)
-- ALTER TABLE productos ADD CONSTRAINT fk_productos_categoria 
--   FOREIGN KEY (categoria) REFERENCES categorias(nombre) ON DELETE RESTRICT;
