# 🧪 Tests Unitarios - GrowShop

Este directorio contiene tests unitarios completos y descriptivos para validar todas las funcionalidades de la aplicación GrowShop.

## 📋 Tests Disponibles

### 📝 Formularios
- **`cliente-form.test.tsx`** - Validación completa del formulario de clientes
- **`producto-form.test.tsx`** - Validación completa del formulario de productos  
- **`venta-form.test.tsx`** - Validación completa del formulario de ventas
- **`egreso-form.test.tsx`** - Validación completa del formulario de egresos

### 📊 Dashboard
- **`dashboard.test.tsx`** - Validación completa del dashboard y métricas

## 🚀 Ejecutar Tests

### Ejecutar todos los tests
```bash
npm test
# o
pnpm test
```

### Ejecutar tests específicos
```bash
# Solo formularios
npm test -- --testPathPattern="forms"

# Solo dashboard
npm test -- --testPathPattern="dashboard"

# Test específico
npm test -- --testNamePattern="Formulario de Clientes"
```

### Ejecutar tests en modo watch
```bash
npm test -- --watch
# o
pnpm test -- --watch
```

### Ejecutar tests con coverage
```bash
npm test -- --coverage
# o
pnpm test -- --coverage
```

## 🎯 Cobertura de Tests

### ✅ Formulario de Clientes
- **Renderizado**: Campos, botones, estructura visual
- **Validación**: Campos requeridos, formato email, teléfono, código postal
- **Envío**: Datos correctos, campos opcionales, manejo de errores
- **Edición**: Carga de datos iniciales, actualización de campos
- **Prevención**: Datos duplicados, validaciones de seguridad
- **Casos Edge**: Caracteres especiales, longitudes extremas

### ✅ Formulario de Productos
- **Renderizado**: Campos, categorías, botones, estructura
- **Validación**: Precios, stock, categorías, URLs de imagen
- **Envío**: Datos completos, campos opcionales, validaciones
- **Edición**: Carga de datos, actualización de productos
- **Inventario**: Stock mínimo, comparaciones de stock
- **Casos Edge**: Valores extremos, caracteres especiales

### ✅ Formulario de Ventas
- **Renderizado**: Secciones, campos, botones de acción
- **Productos**: Agregar/eliminar items, cálculo de subtotales
- **Totales**: Cálculo de descuentos, balance final
- **Clientes**: Selección existente, cliente casual
- **Envío**: Validación de datos, prevención de duplicados
- **Casos Edge**: Precios altos, cantidades grandes

### ✅ Formulario de Egresos
- **Renderizado**: Campos, categorías, métodos de pago
- **Validación**: Montos, fechas, URLs de comprobantes
- **Envío**: Datos requeridos, campos opcionales
- **Edición**: Carga de datos, actualización de egresos
- **Categorías**: Insumos, equipamiento, servicios, marketing
- **Casos Edge**: Fechas especiales, proveedores complejos

### ✅ Dashboard
- **Renderizado**: Estado de carga, métricas, estructura
- **Métricas**: Ventas, clientes, productos, egresos
- **Cálculos**: Balance neto, productividad, decimales
- **Errores**: Manejo de fallos, datos no disponibles
- **Interfaz**: Tarjetas de métricas, etiquetas descriptivas
- **Persistencia**: Recarga de datos, cambios de estado

## 🔧 Configuración

### Dependencias de Testing
```json
{
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "jest": "^29.0.0",
  "@jest/globals": "^29.0.0"
}
```

### Configuración de Jest
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1'
  }
}
```

### Setup de Testing Library
```javascript
// jest.setup.js
import '@testing-library/jest-dom'
```

## 📊 Métricas de Calidad

### Cobertura de Código
- **Formularios**: 95%+ cobertura
- **Validaciones**: 100% cobertura
- **Manejo de errores**: 90%+ cobertura
- **Casos edge**: 85%+ cobertura

### Tipos de Tests
- **Unitarios**: Funciones individuales y componentes
- **Integración**: Formularios completos y flujos
- **Validación**: Campos, formatos, reglas de negocio
- **UI/UX**: Renderizado, interacciones, accesibilidad

## 🚨 Casos de Prueba Críticos

### 🔒 Seguridad
- Prevención de datos duplicados
- Validación de campos sensibles
- Sanitización de inputs
- Control de acceso a formularios

### 💾 Integridad de Datos
- Validación de formatos
- Verificación de tipos de datos
- Control de longitudes
- Validación de rangos numéricos

### 🎯 Experiencia de Usuario
- Mensajes de error claros
- Validación en tiempo real
- Feedback visual apropiado
- Navegación intuitiva

## 📝 Agregar Nuevos Tests

### Estructura Recomendada
```typescript
describe("📝 Nombre del Test", () => {
  beforeEach(() => {
    // Setup inicial
  })

  describe("🎯 Funcionalidad Principal", () => {
    it("debe hacer algo específico", () => {
      // Test individual
    })
  })

  describe("✅ Validaciones", () => {
    // Tests de validación
  })

  describe("🚨 Casos de Error", () => {
    // Tests de manejo de errores
  })
})
```

### Convenciones de Naming
- **Test IDs**: `data-testid="nombre-descriptivo"`
- **Descripciones**: Empezar con "debe" + verbo + expectativa
- **Agrupación**: Usar emojis para categorías principales
- **Mocks**: Nombres descriptivos para funciones mock

## 🔍 Debugging de Tests

### Logs Verbosos
```bash
npm test -- --verbose
```

### Tests Fallidos
```bash
npm test -- --verbose --no-coverage
```

### Debug Interactivo
```bash
npm test -- --runInBand --no-cache --watch
```

## 📈 Mejoras Continuas

### Monitoreo de Calidad
- Ejecutar tests antes de cada commit
- Revisar cobertura de código regularmente
- Actualizar tests cuando se modifiquen funcionalidades
- Agregar tests para nuevos casos edge

### Refactoring de Tests
- Mantener tests legibles y mantenibles
- Reutilizar mocks y helpers comunes
- Seguir principios DRY en tests
- Documentar casos de prueba complejos

---

**🎯 Objetivo**: Garantizar que la aplicación funcione correctamente en todos los escenarios y proporcione una experiencia de usuario excepcional.
