# Solución para Dashboard que Muestra 0 Constante

## 🔍 Problema Identificado

El dashboard está mostrando 0 en todas las métricas porque:
1. **No hay conexión a Supabase** - Variables de entorno no configuradas
2. **Base de datos vacía** - No hay datos en las tablas
3. **Errores de conexión** - Problemas de configuración

## 🛠️ Solución Paso a Paso

### Paso 1: Configurar Variables de Entorno

**IMPORTANTE:** Necesitas obtener las credenciales reales de tu proyecto Supabase.

1. Ve a [supabase.com](https://supabase.com) y accede a tu proyecto
2. Ve a **Settings** → **API**
3. Copia la **Project URL** y **anon public** key
4. Edita el archivo `.env.local` y reemplaza los valores:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-real.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_real_aqui
```

### Paso 2: Verificar la Base de Datos

1. **Ejecuta el script principal** en tu base de datos Supabase:
   ```sql
   -- Ve a SQL Editor en Supabase y ejecuta:
   -- scripts/01_create_tables.sql
   ```

2. **Ejecuta el script de corrección**:
   ```sql
   -- scripts/06_fix_ventas_structure.sql
   ```

3. **Ejecuta el script de datos de prueba**:
   ```sql
   -- scripts/insert_test_data.sql
   ```

### Paso 3: Verificar la Conexión

1. **Reinicia el servidor de desarrollo**:
   ```bash
   # Detén el servidor (Ctrl+C)
   npm run dev
   ```

2. **Abre la consola del navegador** (F12) y ve a la página de ventas
3. **Verifica los logs** - deberías ver:
   ```
   Clientes cargados: 5
   Productos cargados: 8
   Productos activos: 8
   Ventas cargadas: 4
   ```

### Paso 4: Si Sigue Mostrando 0

1. **Verifica que las variables de entorno estén cargadas**:
   - Abre la consola del navegador
   - Escribe: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
   - Debería mostrar tu URL de Supabase

2. **Verifica la conexión a Supabase**:
   - Ve a la consola del navegador
   - Busca errores de red o conexión
   - Verifica que no haya errores de CORS

## 🧪 Datos de Prueba Incluidos

El script `insert_test_data.sql` inserta:

- **5 clientes** con información completa
- **8 productos** de diferentes categorías
- **4 ventas** con estados variados
- **Items de venta** para cada venta

## 🔧 Troubleshooting

### Error: "Supabase environment variables are not configured"
- **Solución**: Verifica que `.env.local` existe y tiene las credenciales correctas
- **Reinicia** el servidor después de cambiar las variables

### Error: "relation does not exist"
- **Solución**: Ejecuta primero `01_create_tables.sql`
- **Verifica** que las tablas se crearon correctamente

### Error: "permission denied"
- **Solución**: Verifica que tu clave anónima tenga permisos de lectura
- **Revisa** las políticas RLS en Supabase

### Dashboard sigue en 0
- **Verifica** que hay datos en las tablas
- **Revisa** la consola del navegador para errores
- **Confirma** que las variables de entorno están cargadas

## 📊 Verificación Final

Después de seguir todos los pasos, deberías ver:

- **Ventas Hoy**: $0 (si no hay ventas hoy)
- **Pedidos Pendientes**: 1 (venta de Carlos López)
- **Procesando**: 0
- **Completadas**: 3 (ventas completadas)

## 🆘 Si Nada Funciona

1. **Verifica la URL de Supabase** - debe ser válida
2. **Verifica la clave anónima** - debe tener permisos de lectura
3. **Revisa las políticas RLS** en Supabase
4. **Verifica que las tablas existan** y tengan datos
5. **Revisa la consola del navegador** para errores específicos

## 📞 Contacto

Si sigues teniendo problemas:
1. Revisa los logs en la consola del navegador
2. Verifica la configuración de Supabase
3. Confirma que las tablas tienen datos
4. Revisa que las variables de entorno estén cargadas 