# Los de Siempre Sneakers CRM 🏃‍♂️👟

Sistema CRM especializado para tiendas de zapatillas deportivas, desarrollado con Next.js, TypeScript y Supabase.

## 🎯 Descripción del Proyecto

**Los de Siempre Sneakers CRM** es una solución completa de gestión empresarial diseñada específicamente para tiendas de zapatillas deportivas. El sistema permite gestionar inventario, ventas, clientes, egresos y reportes de manera eficiente y profesional.

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
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Despliegue**: Vercel
- **Estado**: React Hooks, Context API

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
├── hooks/                # Hooks personalizados
├── scripts/              # Scripts SQL y datos de prueba
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
- Cuenta de Supabase

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd ldsproyect/lds
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp env.example .env.local
```

Editar `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
```

### 4. Ejecutar migraciones de base de datos
```bash
# Ejecutar scripts SQL en Supabase SQL Editor
# 1. 01_create_tables.sql
# 2. 23_create_categorias_table.sql
# 3. run_sneakers_data.sql (para datos de prueba)
```

### 5. Ejecutar el proyecto
```bash
npm run dev
```

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

## 🎯 Casos de Uso

### Para Vendedores
- Consulta rápida de stock
- Proceso de venta simplificado
- Información de clientes al alcance
- Reportes de rendimiento

### Para Gerentes
- Dashboard ejecutivo completo
- Análisis de rentabilidad
- Control de inventario
- Seguimiento de gastos

### Para Administrativos
- Gestión completa de clientes
- Control de proveedores
- Reportes detallados
- Mantenimiento de datos

## 🔧 Personalización

El sistema está diseñado para ser completamente personalizable:

- **Colores y branding**: Modificar variables CSS en `globals.css`
- **Categorías**: Agregar nuevas categorías de productos
- **Campos personalizados**: Extender modelos de datos
- **Reportes**: Crear nuevos tipos de reportes
- **Integraciones**: Conectar con sistemas externos

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio de GitHub
2. Configurar variables de entorno
3. Despliegue automático en cada push

### Otros proveedores
- Netlify
- Railway
- Heroku
- AWS Amplify

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] Sistema de reservas online
- [ ] Integración con redes sociales
- [ ] App móvil nativa
- [ ] Sistema de fidelización
- [ ] Integración con marketplaces
- [ ] Análisis predictivo de ventas

### Mejoras Técnicas
- [ ] PWA (Progressive Web App)
- [ ] Cache inteligente
- [ ] Optimización de rendimiento
- [ ] Tests automatizados
- [ ] CI/CD pipeline

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
- Email: [tu-email@ejemplo.com]
- GitHub Issues: [link-al-repositorio]

---

**Los de Siempre Sneakers CRM** - Tu solución completa para la gestión de tiendas de zapatillas deportivas 🏃‍♂️👟
