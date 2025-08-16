# Sistema de Validación de Formularios - GrowShop CRM

## 🎯 **Objetivo**
Implementar validación en tiempo real para todos los formularios de la aplicación, mostrando mensajes de error específicos debajo de cada campo cuando hay problemas de validación.

## 🔧 **Componentes Implementados**

### 1. **Utilidades de Validación** (`lib/validation.ts`)
- Funciones reutilizables para validar diferentes tipos de campos
- Mensajes de error en español
- Validaciones específicas para cada tipo de dato

### 2. **Componente FormField** (`components/ui/form-field.tsx`)
- Campo de formulario reutilizable con validación
- Soporte para Input, Textarea y Select
- Indicador visual de errores (borde rojo)
- Mensaje de error con icono de advertencia

## 📋 **Tipos de Validación Implementados**

### **Campos de Texto (Nombres, Ciudades, Provincias)**
- ✅ Obligatorio
- ✅ Mínimo 2 caracteres
- ✅ Solo letras y espacios (incluye acentos)
- ❌ No permite números ni caracteres especiales

### **Email**
- ✅ Obligatorio
- ✅ Formato válido de email
- ❌ No permite espacios ni caracteres inválidos

### **Teléfono**
- ✅ Obligatorio
- ✅ Mínimo 8 dígitos
- ✅ Permite: números, espacios, guiones, paréntesis, +
- ❌ No permite letras ni caracteres especiales

### **Dirección**
- ✅ Obligatoria
- ✅ Mínimo 5 caracteres
- ✅ Permite cualquier carácter (direcciones complejas)

### **Código Postal**
- ✅ Obligatorio
- ✅ Exactamente 4 o 5 dígitos numéricos
- ❌ No permite letras ni caracteres especiales

### **Precio**
- ✅ Obligatorio
- ✅ Número válido con máximo 2 decimales
- ✅ No puede ser negativo
- ❌ No permite letras ni caracteres especiales

### **Stock**
- ✅ Obligatorio
- ✅ Número entero
- ✅ No puede ser negativo
- ❌ No permite decimales ni letras

### **SKU**
- ✅ Obligatorio
- ✅ Mínimo 3 caracteres
- ✅ Solo mayúsculas, números, guiones y guiones bajos
- ❌ No permite minúsculas ni caracteres especiales

## 🚀 **Cómo Implementar en Otros Formularios**

### **Paso 1: Importar Utilidades**
```typescript
import { 
  validateEmail, 
  validatePhone, 
  validateName, 
  validatePrice,
  validateStock,
  validateSKU 
} from "@/lib/validation"
```

### **Paso 2: Crear Interfaz de Errores**
```typescript
interface FormErrors {
  nombre?: string
  email?: string
  precio?: string
  // ... otros campos
}
```

### **Paso 3: Agregar Estado de Errores**
```typescript
const [formErrors, setFormErrors] = useState<FormErrors>({})
```

### **Paso 4: Crear Función de Validación**
```typescript
const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {}
  
  // Validar cada campo
  const emailError = validateEmail(formData.email)
  if (emailError) errors.email = emailError
  
  const priceError = validatePrice(formData.precio)
  if (priceError) errors.precio = priceError
  
  return errors
}
```

### **Paso 5: Validar Antes de Enviar**
```typescript
const handleSubmit = async () => {
  const errors = validateForm(formData)
  
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors)
    toast({
      title: "Error de validación",
      description: "Por favor, corrige los errores en el formulario",
      variant: "destructive",
    })
    return
  }
  
  // Continuar con el envío...
}
```

### **Paso 6: Mostrar Errores en el Formulario**
```typescript
<FormField
  label="Email"
  name="email"
  type="email"
  value={formData.email}
  onChange={(value) => handleFieldChange("email", value)}
  error={formErrors.email}
  required
/>
```

## 🎨 **Características Visuales**

### **Indicadores de Error**
- **Borde rojo** en campos con error
- **Mensaje rojo** debajo del campo
- **Icono de advertencia** (⚠️) en cada mensaje
- **Asterisco rojo** (*) en campos obligatorios

### **Comportamiento del Usuario**
- **Errores se limpian** cuando el usuario empieza a escribir
- **Validación en tiempo real** al enviar el formulario
- **Toast de error** si hay problemas de validación
- **Prevención de envío** hasta que se corrijan los errores

## 📱 **Formularios Pendientes de Implementar**

### **✅ Completados**
- [x] Formulario de Clientes
- [x] Utilidades de Validación
- [x] Componente FormField

### **🔄 En Progreso**
- [ ] Formulario de Productos
- [ ] Formulario de Ventas
- [ ] Formulario de Egresos

### **⏳ Pendientes**
- [ ] Formulario de Reportes
- [ ] Formulario de Configuración
- [ ] Cualquier otro formulario nuevo

## 🔍 **Ejemplos de Mensajes de Error**

### **Cliente - Nombre**
- ❌ "El nombre es obligatorio"
- ❌ "El nombre debe tener al menos 2 caracteres"
- ❌ "El nombre solo puede contener letras y espacios"

### **Cliente - Email**
- ❌ "El email es obligatorio"
- ❌ "Formato de email inválido"

### **Cliente - Teléfono**
- ❌ "El teléfono es obligatorio"
- ❌ "El teléfono solo puede contener números, espacios, guiones y paréntesis"
- ❌ "El teléfono debe tener al menos 8 dígitos"

### **Producto - Precio**
- ❌ "El precio es obligatorio"
- ❌ "El precio debe ser un número válido (máximo 2 decimales)"
- ❌ "El precio no puede ser negativo"

## 🎯 **Beneficios de la Implementación**

1. **Mejor UX**: El usuario sabe exactamente qué está mal
2. **Prevención de Errores**: Se evitan envíos con datos inválidos
3. **Consistencia**: Mismo estilo de validación en toda la app
4. **Mantenibilidad**: Código reutilizable y fácil de mantener
5. **Accesibilidad**: Mensajes claros para todos los usuarios

## 🚀 **Próximos Pasos**

1. **Implementar en Productos** usando el componente FormField
2. **Implementar en Ventas** con validaciones específicas
3. **Implementar en Egresos** para campos monetarios
4. **Crear validaciones personalizadas** para casos específicos
5. **Agregar validación en tiempo real** (opcional)
