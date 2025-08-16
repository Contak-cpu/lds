# Sistema de Notificaciones - Implementación

## Descripción
Este sistema proporciona notificaciones tipo popup (toast) para informar al usuario sobre el resultado de las operaciones CRUD en la aplicación.

## Características
- ✅ Notificaciones de éxito con iconos
- ❌ Notificaciones de error con estilo destructivo
- Mensajes personalizados para cada tipo de operación
- Integración automática con el sistema de toast existente

## Hook de Notificaciones

### Importación
```typescript
import { useNotifications } from "@/hooks/use-notifications"
```

### Uso en Componentes
```typescript
export default function MiComponente() {
  const { 
    showSuccess, 
    showError, 
    showProductoCreated,
    showClienteCreated,
    showVentaCreated,
    // ... otras funciones
  } = useNotifications()

  // ... resto del código
}
```

## Funciones Disponibles

### Notificaciones Genéricas
- `showSuccess(title, description?)` - Notificación de éxito
- `showError(title, description?)` - Notificación de error

### Notificaciones Específicas por Entidad

#### Productos
- `showProductoCreated()` - Producto creado exitosamente
- `showProductoUpdated()` - Producto actualizado exitosamente
- `showProductoDeleted()` - Producto eliminado exitosamente

#### Clientes
- `showClienteCreated()` - Cliente registrado exitosamente
- `showClienteUpdated()` - Cliente actualizado exitosamente
- `showClienteDeleted()` - Cliente eliminado exitosamente

#### Ventas
- `showVentaCreated()` - Venta registrada exitosamente
- `showVentaUpdated()` - Venta actualizada exitosamente
- `showVentaDeleted()` - Venta eliminada exitosamente

#### Egresos
- `showEgresoCreated()` - Egreso registrado exitosamente
- `showEgresoUpdated()` - Egreso actualizado exitosamente
- `showEgresoDeleted()` - Egreso eliminado exitosamente

#### Categorías
- `showCategoriaCreated()` - Categoría creada exitosamente
- `showCategoriaUpdated()` - Categoría actualizada exitosamente
- `showCategoriaDeleted()` - Categoría eliminada exitosamente

### Notificaciones Genéricas Personalizables
- `showGenericSuccess(operation, entity)` - Éxito genérico
- `showGenericError(operation, entity, error?)` - Error genérico

## Ejemplos de Implementación

### Crear un Producto
```typescript
const handleCreateProduct = async () => {
  try {
    // Lógica para crear producto
    const result = await createProduct(productData)
    
    if (result.success) {
      showProductoCreated() // ✅ Notificación automática
      // Cerrar modal, limpiar formulario, etc.
    }
  } catch (error) {
    showError("Error", "No se pudo crear el producto")
  }
}
```

### Actualizar un Cliente
```typescript
const handleUpdateClient = async () => {
  try {
    // Lógica para actualizar cliente
    const result = await updateClient(clientId, clientData)
    
    if (result.success) {
      showClienteUpdated() // ✅ Notificación automática
      // Cerrar modal, actualizar lista, etc.
    }
  } catch (error) {
    showError("Error", "No se pudo actualizar el cliente")
  }
}
```

### Eliminar una Venta
```typescript
const handleDeleteSale = async (saleId: string) => {
  try {
    // Lógica para eliminar venta
    const result = await deleteSale(saleId)
    
    if (result.success) {
      showVentaDeleted() // ✅ Notificación automática
      // Actualizar lista, etc.
    }
  } catch (error) {
    showError("Error", "No se pudo eliminar la venta")
  }
}
```

### Operación Genérica
```typescript
const handleCustomOperation = async () => {
  try {
    // Lógica personalizada
    const result = await customOperation()
    
    if (result.success) {
      showGenericSuccess("Procesamiento", "archivos")
    }
  } catch (error) {
    showGenericError("procesar", "archivos", error.message)
  }
}
```

## Configuración del Layout

El componente `Toaster` ya está incluido en el layout principal (`app/layout.tsx`) para que las notificaciones sean visibles en toda la aplicación.

## Personalización

### Agregar Nuevas Notificaciones
Para agregar nuevas notificaciones específicas, edita el archivo `hooks/use-notifications.ts`:

```typescript
const showNuevaOperacion = () => {
  showSuccess(
    "✅ Nueva operación exitosa",
    "Descripción de la operación"
  )
}

// Agregar al return del hook
return {
  // ... funciones existentes
  showNuevaOperacion,
}
```

### Modificar Mensajes
Los mensajes se pueden personalizar editando las funciones en `hooks/use-notifications.ts`:

```typescript
const showProductoCreated = () => {
  showSuccess(
    "🎉 ¡Producto agregado!",
    "El nuevo producto ya está disponible en tu inventario"
  )
}
```

## Ventajas del Sistema

1. **Consistencia**: Todas las notificaciones tienen el mismo estilo y comportamiento
2. **Mantenibilidad**: Centralizado en un solo hook
3. **Reutilización**: Fácil de usar en cualquier componente
4. **Personalización**: Mensajes específicos para cada tipo de operación
5. **UX Mejorada**: Feedback inmediato para el usuario

## Notas Importantes

- Las notificaciones se muestran automáticamente en la esquina superior derecha
- Se cierran automáticamente después de unos segundos
- El usuario puede cerrarlas manualmente haciendo clic en la X
- Las notificaciones de error tienen un estilo rojo distintivo
- Las notificaciones de éxito tienen un estilo verde con iconos ✅
