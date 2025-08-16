# Sistema de Temas - GrowShop CRM

## Descripción

Se ha implementado un sistema completo de cambio de temas (claro/oscuro) en la aplicación GrowShop CRM utilizando `next-themes` y variables CSS personalizadas.

## Características

### 🎨 Temas Disponibles
- **Claro**: Tema tradicional con colores claros
- **Oscuro**: Tema oscuro para uso nocturno
- **Sistema**: Se adapta automáticamente a la preferencia del sistema operativo

### 🔧 Componentes Implementados

#### 1. ThemeProvider (`components/theme-provider.tsx`)
- Wrapper de `next-themes` para gestionar el estado del tema
- Configurado en el layout principal de la aplicación

#### 2. ThemeToggle (`components/theme-toggle.tsx`)
- Botón de toggle con iconos de sol y luna
- Dropdown con opciones de tema
- Animaciones suaves entre estados

#### 3. Variables CSS (`app/globals.css`)
- Variables CSS personalizadas para ambos temas
- Colores semánticos (primary, secondary, muted, etc.)
- Colores específicos para la barra lateral

## Uso

### Cambiar Tema
1. **Desde la Navegación**: Usar el toggle en la barra lateral
2. **Opciones Disponibles**:
   - Claro
   - Oscuro  
   - Sistema (automático)

### Acceso Rápido
- **URL de Prueba**: `/test-tema` - Página para probar todos los colores del tema

## Implementación Técnica

### Layout Principal (`app/layout.tsx`)
```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### Variables CSS
```css
:root {
  --background: oklch(1 0 0);        /* Tema claro */
  --foreground: oklch(0.145 0 0);
  /* ... más variables */
}

.dark {
  --background: oklch(0.145 0 0);    /* Tema oscuro */
  --foreground: oklch(0.985 0 0);
  /* ... más variables */
}
```

### Clases Tailwind
- `bg-background` - Fondo principal
- `text-foreground` - Texto principal
- `bg-card` - Fondo de tarjetas
- `text-card-foreground` - Texto de tarjetas
- `border-border` - Bordes
- `text-muted-foreground` - Texto silenciado

## Archivos Modificados

1. **`app/layout.tsx`** - Agregado ThemeProvider
2. **`components/navigation.tsx`** - Integrado toggle de tema
3. **`app/page.tsx`** - Actualizado para usar variables del tema
4. **`components/theme-toggle.tsx`** - Nuevo componente
5. **`app/globals.css`** - Variables CSS del tema (ya existían)

## Beneficios

### 🚀 Rendimiento
- Cambio instantáneo de tema
- Sin recarga de página
- Transiciones suaves

### 🎯 Accesibilidad
- Soporte para preferencias del sistema
- Iconos descriptivos
- Texto alternativo para lectores de pantalla

### 🔧 Mantenibilidad
- Variables CSS centralizadas
- Fácil personalización de colores
- Consistencia en toda la aplicación

## Personalización

### Agregar Nuevos Colores
1. Definir variables en `app/globals.css`
2. Agregar clases correspondientes en Tailwind
3. Usar en componentes

### Modificar Colores Existentes
1. Cambiar valores en las variables CSS
2. Los cambios se aplican automáticamente

## Compatibilidad

- ✅ Next.js 15+
- ✅ React 19+
- ✅ Tailwind CSS 4+
- ✅ TypeScript
- ✅ Navegadores modernos

## Próximos Pasos

- [ ] Agregar más temas (ej: tema verde, tema azul)
- [ ] Persistencia de preferencias por usuario
- [ ] Animaciones más elaboradas
- [ ] Temas estacionales
