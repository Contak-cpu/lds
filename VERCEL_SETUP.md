# 🚀 Configuración Automática de Vercel para "Los de Siempre Sneakers" CRM

Esta guía te ayudará a configurar la integración automática entre tu repositorio de GitHub y Vercel, con configuración automática de variables de entorno y despliegue automático.

## 📋 Prerrequisitos

- ✅ Repositorio en GitHub: `https://github.com/Contak-cpu/lds`
- ✅ Cuenta en Vercel: [https://vercel.com](https://vercel.com)
- ✅ Proyecto configurado con los archivos de Vercel

## 🔧 Paso 1: Conectar Repositorio en Vercel

### 1.1 Ir a Vercel Dashboard
1. Ve a [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Inicia sesión con tu cuenta

### 1.2 Importar Proyecto
1. Haz clic en **"New Project"**
2. Selecciona **"Import Git Repository"**
3. Busca y selecciona tu repositorio: `Contak-cpu/lds`
4. Haz clic en **"Import"**

### 1.3 Configuración Automática
Vercel detectará automáticamente:
- ✅ Framework: Next.js
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `.next`
- ✅ Install Command: `npm install`

## ⚙️ Paso 2: Configurar Variables de Entorno

### 2.1 Variables Automáticas
Las siguientes variables se configurarán automáticamente desde `vercel.json`:

```env
NEXT_PUBLIC_APP_NAME="Los de Siempre Sneakers CRM"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_ENVIRONMENT="production"
NEXT_PUBLIC_USE_MOCK_DATA="true"
NEXT_PUBLIC_MOCK_DATA_PERSISTENCE="localStorage"
NEXT_PUBLIC_NOTIFICATIONS_ENABLED="true"
NEXT_PUBLIC_TOAST_DURATION="5000"
NEXT_PUBLIC_DEFAULT_THEME="system"
NEXT_PUBLIC_THEME_PERSISTENCE="localStorage"
NEXT_PUBLIC_DEBUG_MODE="false"
```

### 2.2 Verificar Variables
1. En el dashboard de Vercel, ve a tu proyecto
2. Haz clic en **"Settings"** → **"Environment Variables"**
3. Verifica que todas las variables estén presentes
4. Si falta alguna, agrégalas manualmente

## 🔄 Paso 3: Configurar Despliegue Automático

### 3.1 Configuración de Git
1. En **"Settings"** → **"Git"**
2. Verifica que esté conectado a tu repositorio de GitHub
3. Habilita **"Auto Deploy"**

### 3.2 Configuración de Branches
- **Production Branch**: `main`
- **Preview Branches**: `develop`, `feature/*`
- **Auto Deploy**: ✅ Habilitado

## 🚀 Paso 4: Primer Despliegue

### 4.1 Despliegue Inicial
1. Haz clic en **"Deploy"**
2. Vercel construirá tu proyecto automáticamente
3. El proceso tomará 2-3 minutos

### 4.2 Verificar Despliegue
1. Espera a que termine el build
2. Haz clic en el enlace generado
3. Verifica que el CRM funcione correctamente

## 📱 Paso 5: Configurar Dominio Personalizado (Opcional)

### 5.1 Dominio Personalizado
1. En **"Settings"** → **"Domains"**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones de DNS

### 5.2 Subdominios
- **Production**: `crm.tudominio.com`
- **Preview**: `dev-crm.tudominio.com`

## 🔐 Paso 6: Configurar GitHub Actions (Opcional)

### 6.1 Secrets de GitHub
Si quieres usar GitHub Actions, configura estos secrets:

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Agrega los siguientes secrets:

```bash
VERCEL_TOKEN=tu_token_de_vercel
ORG_ID=tu_org_id_de_vercel
PROJECT_ID=tu_project_id_de_vercel
```

### 6.2 Obtener Credenciales de Vercel
1. En Vercel Dashboard, ve a **"Settings"** → **"Tokens"**
2. Crea un nuevo token
3. Copia el token generado

## 📊 Paso 7: Monitoreo y Analytics

### 7.1 Analytics de Vercel
1. **Analytics**: Métricas de rendimiento
2. **Speed Insights**: Análisis de velocidad
3. **Real Experience Score**: Puntuación de experiencia real

### 7.2 Logs y Debugging
1. **Functions**: Logs de funciones serverless
2. **Build Logs**: Logs de construcción
3. **Deployment Logs**: Logs de despliegue

## 🔧 Paso 8: Configuración Avanzada

### 8.1 Optimizaciones de Build
El archivo `next.config.mjs` incluye:
- ✅ Output standalone para Vercel
- ✅ Optimización de imports
- ✅ Headers de seguridad
- ✅ Redirecciones automáticas

### 8.2 Configuración de Edge Functions
```javascript
// En vercel.json
"functions": {
  "app/**/*.tsx": {
    "maxDuration": 30
  }
}
```

## 🚨 Solución de Problemas Comunes

### Problema: Build Falla
**Solución**: Verifica que todas las dependencias estén en `package.json`

### Problema: Variables de Entorno No Funcionan
**Solución**: Verifica que empiecen con `NEXT_PUBLIC_`

### Problema: Despliegue Lento
**Solución**: Optimiza el bundle con `next.config.mjs`

### Problema: Errores de TypeScript
**Solución**: Ejecuta `npm run build` localmente antes de hacer push

## 📈 Beneficios de la Configuración Automática

### ✅ **Despliegue Automático**
- Cada push a `main` despliega automáticamente
- Preview automático en pull requests
- Rollback instantáneo si algo falla

### ✅ **Variables de Entorno Automáticas**
- Configuración automática desde `vercel.json`
- Diferentes configuraciones por ambiente
- Sin necesidad de configurar manualmente

### ✅ **Optimizaciones Automáticas**
- Build optimizado para Vercel
- Edge functions automáticas
- CDN global automático

### ✅ **Monitoreo Automático**
- Analytics automáticos
- Logs automáticos
- Alertas automáticas

## 🎯 Próximos Pasos

1. **Conectar repositorio** en Vercel
2. **Verificar variables** de entorno
3. **Hacer primer despliegue**
4. **Configurar dominio** personalizado (opcional)
5. **Monitorear rendimiento**

## 📞 Soporte

- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: [https://github.com/Contak-cpu/lds/issues](https://github.com/Contak-cpu/lds/issues)
- **Vercel Support**: [https://vercel.com/support](https://vercel.com/support)

---

**¡Tu CRM de zapatillas estará funcionando en Vercel en menos de 10 minutos!** 🚀👟
