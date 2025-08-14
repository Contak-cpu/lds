-- Crear tabla de configuración para el CRM
CREATE TABLE IF NOT EXISTS public.configuracion (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clave VARCHAR(255) UNIQUE NOT NULL,
    valor JSONB NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índice para búsquedas rápidas por clave
CREATE INDEX IF NOT EXISTS idx_configuracion_clave ON public.configuracion(clave);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_configuracion_updated_at 
    BEFORE UPDATE ON public.configuracion 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar configuración por defecto
INSERT INTO public.configuracion (clave, valor, descripcion) VALUES
('negocio', '{"nombre": "Mi Growshop", "direccion": "Av. Corrientes 1234, CABA", "cuit": "20-12345678-9", "telefono": "+54 11 1234-5678", "email": "info@migrowshop.com", "sitioWeb": "www.migrowshop.com"}', 'Información del negocio'),
('ventas', '{"moneda": "ARS", "iva": 21, "descuentoMaximo": 50, "stockMinimo": 5}', 'Configuración de ventas'),
('notificaciones', '{"stockBajo": true, "ventasNuevas": true, "clientesNuevos": false, "reportesDiarios": true}', 'Configuración de notificaciones'),
('sistema', '{"tema": "claro", "idioma": "es", "timezone": "America/Argentina/Buenos_Aires", "backupAutomatico": true}', 'Configuración del sistema')
ON CONFLICT (clave) DO NOTHING;
