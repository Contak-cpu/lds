# 🚀 Configuración Automática de Vercel - Paso a Paso

## 📋 Pasos para Importar el Repositorio

### 1. **Ir a Vercel Dashboard**
- Ve a [https://vercel.com/dashboard](https://vercel.com/dashboard)
- Inicia sesión con tu cuenta

### 2. **Crear Nuevo Proyecto**
- Haz clic en **"New Project"**
- Selecciona **"Import Git Repository"**

### 3. **Seleccionar Repositorio**
- Busca: `Contak-cpu/lds`
- Haz clic en **"Import"**

### 4. **Configuración Automática**
Vercel detectará automáticamente:
- ✅ **Framework:** Next.js
- ✅ **Build Command:** `npm run build`
- ✅ **Output Directory:** `.next`
- ✅ **Install Command:** `npm install`
- ✅ **Variables de Entorno:** Configuradas automáticamente

### 5. **Verificar Configuración**
En la pantalla de configuración, deberías ver:
```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 6. **Hacer Deploy**
- Haz clic en **"Deploy"**
- Espera 2-3 minutos para el build

## 🔧 Variables de Entorno Automáticas

Estas variables se configuran automáticamente desde `vercel.json`:

```env
NEXT_PUBLIC_APP_NAME=Los de Siempre Sneakers CRM
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENVIRONMENT=production
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_MOCK_DATA_PERSISTENCE=localStorage
NEXT_PUBLIC_NOTIFICATIONS_ENABLED=true
NEXT_PUBLIC_TOAST_DURATION=5000
NEXT_PUBLIC_DEFAULT_THEME=system
NEXT_PUBLIC_THEME_PERSISTENCE=localStorage
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_key_for_build
```

## 🚨 Si Algo No Funciona

### Problema: No detecta Next.js
**Solución:** Verifica que `package.json` tenga:
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "scripts": {
    "build": "next build",
    "dev": "next dev"
  }
}
```

### Problema: Build falla
**Solución:** Verifica que todas las dependencias estén en `package.json`

### Problema: Variables no se configuran
**Solución:** Verifica que `vercel.json` esté en la raíz del proyecto

## 📱 Después del Deploy

### 1. **Verificar Funcionamiento**
- Navega por todas las páginas
- Verifica que los datos mock funcionen
- Prueba el tema oscuro/claro

### 2. **Configurar Dominio (Opcional)**
- Ve a **Settings** → **Domains**
- Agrega tu dominio personalizado

### 3. **Configurar Auto-Deploy**
- Ve a **Settings** → **Git**
- Verifica que **Auto Deploy** esté habilitado

## 🎯 Resultado Esperado

Después de seguir estos pasos:
- ✅ **Build exitoso** en Vercel
- ✅ **Variables configuradas** automáticamente
- ✅ **CRM funcionando** con datos mock
- ✅ **Auto-deploy** configurado
- ✅ **Sin configuración manual** requerida

---

**¡Tu CRM se configurará automáticamente en Vercel!** 🚀👟
