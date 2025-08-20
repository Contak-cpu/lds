# Los de Siempre Sneakers CRM 🏃‍♂️👟

Sistema CRM especializado para tiendas de zapatillas deportivas, desarrollado con Next.js, TypeScript y **datos mockeados locales** - **sin necesidad de base de datos externa**.

## 🎯 Descripción del Proyecto

**Los de Siempre Sneakers CRM** es una solución completa de gestión empresarial diseñada específicamente para tiendas de zapatillas deportivas. El sistema funciona completamente de forma local con datos simulados, permitiendo gestionar inventario, ventas, clientes, egresos y reportes de manera eficiente y profesional.

## ✨ Características Principales

### 🏪 Gestión de Productos
- **Catálogo completo de zapatillas**: Nike, Adidas, Puma, New Balance, Converse, Vans, Reebok, Asics
- **Categorías especializadas**: Running, Basketball, Lifestyle, Training, Soccer, Skate, Tennis, Golf
- **Control de stock**: Seguimiento de inventario con alertas de stock bajo
- **Gestión de talles**: Sistema de talles disponibles por producto
- **SKUs únicos**: Identificación automática de productos

### 👥 Gestión de Clientes
- Base de datos de clientes con información completa
- Historial de compras
- Estado de cliente (activo/inactivo)
- Sistema de contactos integrado

### 💰 Gestión de Ventas
- Registro de transacciones
- Múltiples métodos de pago
- Seguimiento de estado de ventas
- Historial detallado de transacciones

### 📊 Reportes y Analytics
- Dashboard en tiempo real
- Métricas de ventas diarias/mensuales
- Análisis de productos más vendidos
- Reportes de rentabilidad

### 💸 Control de Egresos
- Registro de gastos operativos
- Categorización de egresos
- Control de proveedores
- Análisis de costos

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Base de Datos**: **Datos mockeados locales** (sin Supabase)
- **Estado**: React Hooks, Context API
- **Despliegue**: Vercel (opcional)

## 📁 Estructura del Proyecto

```
lds/
├── app/                    # Páginas de la aplicación
│   ├── clientes/          # Gestión de clientes
│   ├── productos/         # Catálogo de productos
│   ├── ventas/           # Sistema de ventas
│   ├── egresos/          # Control de gastos
│   ├── reportes/         # Reportes y analytics
│   └── configuracion/    # Configuración del sistema
├── components/            # Componentes reutilizables
├── lib/                  # Utilidades y configuración
│   ├── mock-data.ts      # Servicio de datos mockeados
│   └── metrics.ts        # Servicio de métricas
├── hooks/                # Hooks personalizados
├── scripts/              # Scripts SQL (para referencia)
└── styles/               # Estilos globales
```

## 🎨 Datos de Prueba Incluidos

El sistema incluye datos de prueba completos para simular una tienda real:

### 🏷️ Categorías de Productos
- **Running**: Zapatillas para correr y entrenamiento
- **Basketball**: Zapatillas para baloncesto
- **Lifestyle**: Zapatillas casuales y urbanas
- **Training**: Zapatillas para entrenamiento funcional
- **Soccer**: Botines de fútbol
- **Skate**: Zapatillas para skateboarding
- **Tennis**: Zapatillas para tenis
- **Golf**: Zapatillas para golf

### 👟 Productos de Prueba
- **Nike**: Air Force 1, LeBron 20, Air Jordan 38, Pegasus 40, React Infinity Run 3
- **Adidas**: Ultraboost 22, Stan Smith, Superstar, Harden Vol. 7, Dame 8
- **Otras marcas**: Puma RS-X, New Balance 574, Converse Chuck Taylor, Vans Old Skool

### 👥 Clientes de Prueba
- 10 clientes con información completa
- Direcciones de Buenos Aires
- Teléfonos y emails realistas

### 💰 Ventas de Prueba
- 10 transacciones de ejemplo
- Diferentes métodos de pago
- Productos variados de diferentes categorías

### 💸 Egresos de Prueba
- Compras de stock a proveedores
- Gastos operativos (alquiler, servicios, marketing)
- Categorización completa de gastos

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- **NO se requiere Supabase ni base de datos externa**

### 1. Clonar el repositorio
```bash
git clone https://github.com/Contak-cpu/lds.git
cd lds
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno (opcional)
```bash
cp env.local.example .env.local
```

**Nota**: Las variables de entorno son opcionales ya que el sistema funciona completamente con datos mockeados.

### 4. Ejecutar el proyecto
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

## 📊 Uso del Sistema

### Dashboard Principal
- Vista general de métricas clave
- Filtros de fecha para análisis temporal
- Acceso rápido a todas las funcionalidades

### Gestión de Productos
- Agregar nuevos productos con información completa
- Editar productos existentes
- Control de stock en tiempo real
- Búsqueda y filtrado avanzado

### Sistema de Ventas
- Crear nuevas ventas
- Seleccionar productos y cantidades
- Calcular totales automáticamente
- Registrar método de pago

### Control de Egresos
- Registrar gastos operativos
- Categorizar gastos
- Seguimiento de proveedores
- Análisis de costos

## 🔧 Ventajas de la Versión Local

### ✅ **Sin Dependencias Externas**
- No requiere configuración de base de datos
- No necesita credenciales de Supabase
- Funciona completamente offline

### ✅ **Fácil de Implementar**
- Instalación en 2 minutos
- Configuración mínima
- Ideal para demostraciones y pruebas

### ✅ **Datos Realistas**
- Catálogo completo de zapatillas deportivas
- Clientes y ventas de ejemplo
- Egresos operativos típicos

### ✅ **Funcionalidad Completa**
- Todas las características del CRM
- Dashboard funcional
- Gestión completa de datos

## 🎯 Casos de Uso

### Para Desarrolladores
- Prototipado rápido de CRMs
- Demostración de funcionalidades
- Base para proyectos personalizados

### Para Emprendedores
- Evaluación de sistemas CRM
- Planificación de funcionalidades
- Presentación a inversores

### Para Estudiantes
- Aprendizaje de Next.js y React
- Estudio de patrones de UI/UX
- Proyecto de portfolio

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio de GitHub
2. Configurar variables de entorno (opcional)
3. Despliegue automático en cada push

### Otros proveedores
- Netlify
- Railway
- Heroku
- AWS Amplify

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] Persistencia de datos en localStorage
- [ ] Exportación de datos a CSV/Excel
- [ ] Sistema de respaldo local
- [ ] Modo offline completo

### Mejoras Técnicas
- [ ] PWA (Progressive Web App)
- [ ] Cache inteligente
- [ ] Optimización de rendimiento
- [ ] Tests automatizados

## 🔄 Migración a Base de Datos Real

Cuando estés listo para usar una base de datos real:

1. **Configurar Supabase**:
   - Crear proyecto en Supabase
   - Ejecutar scripts SQL de `scripts/`
   - Configurar variables de entorno

2. **Reemplazar servicios**:
   - Cambiar `mock-data.ts` por servicios de Supabase
   - Actualizar imports en componentes
   - Mantener la misma interfaz de datos

3. **Migrar datos**:
   - Exportar datos mockeados
   - Importar en Supabase
   - Verificar integridad

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Desarrollado por

**pictoN** - Desarrollador Full Stack especializado en soluciones CRM

## 📞 Soporte

Para soporte técnico o consultas:
- GitHub Issues: [https://github.com/Contak-cpu/lds/issues](https://github.com/Contak-cpu/lds/issues)

---

**Los de Siempre Sneakers CRM - Versión Local** - Tu solución completa para la gestión de tiendas de zapatillas deportivas, sin complicaciones de base de datos 🏃‍♂️👟

## 🚀 Comenzar Ahora

```bash
# Clonar y ejecutar en menos de 2 minutos
git clone https://github.com/Contak-cpu/lds.git
cd lds
npm install
npm run dev
```

¡Y listo! Tu CRM de zapatillas estará funcionando en `http://localhost:3000` 🎉
