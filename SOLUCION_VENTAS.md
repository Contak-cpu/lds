# Solución para Problemas de Ventas

## Problemas Identificados

1. **Falta de archivo de configuración de entorno (.env.local)**
2. **Discrepancia en la estructura de la base de datos**
3. **Errores en la función crearVenta**
4. **Falta de logging para debugging**

## Pasos para Solucionar

### Paso 1: Configurar Variables de Entorno

1. Copia el archivo `env.example` a `.env.local`
2. Llena con tus credenciales de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
   ```

### Paso 2: Ejecutar Scripts SQL

1. **Ejecuta el script principal** (`scripts/01_create_tables.sql`) si no lo has hecho
2. **Ejecuta el script de corrección** (`scripts/06_fix_ventas_structure.sql`)
3. **Ejecuta el script de prueba** (`scripts/test_connection.sql`) para verificar

### Paso 3: Verificar la Base de Datos

Ejecuta este comando en tu base de datos para verificar que las tablas existan:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('clientes', 'productos', 'ventas', 'venta_items');
```

### Paso 4: Insertar Datos de Prueba

Si las tablas están vacías, inserta algunos datos de prueba:

```sql
-- Insertar cliente de prueba
INSERT INTO clientes (nombre, email, telefono, ciudad, provincia) 
VALUES ('Cliente Prueba', 'cliente@test.com', '123456789', 'Ciudad', 'Provincia');

-- Insertar producto de prueba
INSERT INTO productos (nombre, descripcion, categoria, precio, costo, stock, activo) 
VALUES ('Producto Prueba', 'Descripción del producto', 'General', 1000, 500, 10, true);
```

### Paso 5: Reiniciar la Aplicación

1. Detén el servidor de desarrollo (`Ctrl+C`)
2. Ejecuta `npm run dev` nuevamente

## Verificación

1. **Abre la consola del navegador** (F12)
2. **Ve a la página de ventas**
3. **Verifica los logs** - deberías ver:
   - "Clientes cargados: X"
   - "Productos cargados: X"
   - "Productos activos: X"

## Problemas Comunes y Soluciones

### No aparecen clientes ni productos

**Causa:** Las tablas están vacías o no existen
**Solución:** Ejecuta los scripts SQL y verifica que haya datos

### Error de conexión a Supabase

**Causa:** Variables de entorno incorrectas
**Solución:** Verifica que `.env.local` tenga las credenciales correctas

### Botón de crear venta no funciona

**Causa:** Validaciones fallando o errores en la base de datos
**Solución:** Revisa la consola del navegador para ver errores específicos

## Estructura de Base de Datos Requerida

### Tabla `clientes`
- id (UUID, PRIMARY KEY)
- nombre (VARCHAR)
- email (VARCHAR, UNIQUE)
- telefono (VARCHAR)
- direccion (TEXT)
- ciudad (VARCHAR)
- provincia (VARCHAR)
- codigo_postal (VARCHAR)
- fecha_registro (TIMESTAMP)
- notas (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Tabla `productos`
- id (UUID, PRIMARY KEY)
- sku (VARCHAR, UNIQUE)
- nombre (VARCHAR)
- descripcion (TEXT)
- categoria (VARCHAR)
- precio (DECIMAL)
- costo (DECIMAL)
- stock (INTEGER)
- stock_minimo (INTEGER)
- imagen_url (TEXT)
- activo (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Tabla `ventas`
- id (UUID, PRIMARY KEY)
- cliente_id (UUID, FOREIGN KEY)
- cliente_nombre (VARCHAR)
- cliente_casual (VARCHAR)
- tipo_venta (VARCHAR)
- subtotal (DECIMAL)
- descuento (DECIMAL)
- total (DECIMAL)
- estado (VARCHAR)
- metodo_pago (VARCHAR)
- notas (TEXT)
- fecha_venta (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Tabla `venta_items`
- id (UUID, PRIMARY KEY)
- venta_id (UUID, FOREIGN KEY)
- producto_id (UUID, FOREIGN KEY)
- producto_nombre (VARCHAR)
- cantidad (INTEGER)
- precio_unitario (DECIMAL)
- subtotal (DECIMAL)
- categoria (VARCHAR)
- descripcion (TEXT)
- imagen_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Contacto

Si sigues teniendo problemas después de seguir estos pasos, revisa:
1. Los logs en la consola del navegador
2. Los logs del servidor de desarrollo
3. La configuración de Supabase en tu dashboard 