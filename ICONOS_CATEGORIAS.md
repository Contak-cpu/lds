# 🎨 Sistema de Iconos de Categorías

## Descripción

Este sistema reemplaza las imágenes genéricas de productos (como la pinza) con iconos SVG personalizados por categoría. Cada categoría tiene su propio icono y color, proporcionando una experiencia visual más rica y consistente.

## 🚀 Características

- **Iconos SVG personalizados**: Cada categoría tiene un icono único de Lucide React
- **Colores temáticos**: Colores específicos para cada tipo de categoría
- **Fallback automático**: Si no hay imagen, se muestra el icono de categoría
- **Configuración centralizada**: Fácil personalización desde un solo archivo
- **Responsivo**: Iconos que se adaptan a diferentes tamaños de pantalla

## 📁 Archivos del Sistema

### 1. `lib/categoria-config.ts`
Configuración centralizada de todas las categorías con sus iconos y colores.

### 2. `components/categoria-icon.tsx`
Componentes para mostrar iconos de categoría en diferentes formatos.

### 3. `components/producto-image.tsx`
Componente principal que decide si mostrar imagen o icono de categoría.

## 🎯 Categorías Disponibles

### Cultivo
- **Kits** 📦 - Verde (#10B981)
- **Semillas** 🍃 - Verde oscuro (#059669)
- **Fertilizantes** 💧 - Azul (#3B82F6)
- **Iluminación** 💡 - Amarillo (#F59E0B)
- **Hidroponía** 🌡️ - Púrpura (#8B5CF6)
- **Herramientas** ✂️ - Rojo (#EF4444)
- **Sustratos** 🌱 - Verde lima (#84CC16)
- **Accesorios** ⚙️ - Gris (#6B7280)

### Sneakers/Ropa
- **Sneakers** ⚡ - Naranja (#F97316)
- **Zapatillas** ⚡ - Naranja (#F97316)
- **Calzado** ⚡ - Naranja (#F97316)
- **Ropa** 👕 - Púrpura (#8B5CF6)
- **Camisetas** 👕 - Púrpura (#8B5CF6)
- **Pantalones** 👕 - Púrpura (#8B5CF6)
- **Hoodies** 👕 - Púrpura (#8B5CF6)
- **Sudaderas** 👕 - Púrpura (#8B5CF6)
- **Gorras** ⭐ - Amarillo (#F59E0B)
- **Mochilas** 📦 - Azul (#3B82F6)

### General
- **Electrónicos** ⚡ - Azul (#3B82F6)
- **Tecnología** ⚡ - Azul (#3B82F6)
- **Deportes** ⚡ - Verde (#10B981)
- **Fitness** ⚡ - Verde (#10B981)
- **Salud** ❤️ - Rojo (#EF4444)
- **Belleza** ⭐ - Rosa (#EC4899)
- **Hogar** 🏠 - Púrpura (#8B5CF6)
- **Cocina** ☕ - Naranja (#F97316)
- **Automóviles** 🚗 - Gris (#6B7280)
- **Motos** 🚲 - Gris (#6B7280)
- **Fotografía** 📷 - Púrpura (#8B5CF6)
- **Música** 🎵 - Rosa (#EC4899)
- **Libros** 📚 - Amarillo (#F59E0B)
- **Juguetes** ⭐ - Amarillo (#F59E0B)
- **Videojuegos** ⚡ - Púrpura (#8B5CF6)

### Alimentos
- **Alimentos** 🍕 - Naranja (#F97316)
- **Bebidas** 🍷 - Púrpura (#8B5CF6)
- **Postres** 🍦 - Rosa (#EC4899)
- **Snacks** ⭐ - Amarillo (#F59E0B)

## 🛠️ Uso

### Componente Básico
```tsx
import { CategoriaIcon } from "@/components/categoria-icon"

// Icono con contenedor
<CategoriaIcon categoria="Semillas" size={32} />

// Solo el icono
<CategoriaIconOnly categoria="Semillas" size={24} />

// Icono con etiqueta
<CategoriaIconWithLabel categoria="Semillas" size={32} showLabel={true} />
```

### Componente de Imagen de Producto
```tsx
import { ProductoImage } from "@/components/producto-image"

// Imagen con fallback a icono
<ProductoImage
  imagenUrl={producto.imagen_url}
  categoria={producto.categoria}
  nombre={producto.nombre}
  size={200}
/>

// Solo icono
<ProductoIcon
  categoria={producto.categoria}
  nombre={producto.nombre}
  size={24}
/>
```

## 🔧 Personalización

### Agregar Nueva Categoría
1. Edita `lib/categoria-config.ts`
2. Agrega la nueva categoría al array `CATEGORIAS_CONFIG`
3. Especifica icono, color y descripción

```tsx
{
  nombre: 'Nueva Categoría',
  icono: NewIcon,
  color: '#FF0000',
  descripcion: 'Descripción de la nueva categoría',
  orden: 38
}
```

### Cambiar Icono Existente
1. Importa el nuevo icono de Lucide React
2. Actualiza la configuración en `categoria-config.ts`

### Cambiar Colores
1. Edita el campo `color` en la configuración
2. Usa códigos hexadecimales (#RRGGBB)

## 📱 Responsividad

Los iconos se adaptan automáticamente a diferentes tamaños:
- **Móvil**: 16px - 24px
- **Tablet**: 24px - 32px
- **Desktop**: 32px - 48px
- **Grande**: 48px+

## 🎨 Temas

El sistema es compatible con temas claro/oscuro:
- Los iconos mantienen sus colores temáticos
- Los contenedores se adaptan al tema actual
- Las transparencias se ajustan automáticamente

## 🔄 Migración

### Antes (Imágenes Genéricas)
```tsx
<img
  src={producto.imagen_url || "/professional-pruning-scissors.png"}
  alt={producto.nombre}
  className="w-full h-full object-cover"
/>
```

### Después (Iconos de Categoría)
```tsx
<ProductoImage
  imagenUrl={producto.imagen_url}
  categoria={producto.categoria}
  nombre={producto.nombre}
  size={200}
  className="w-full h-full"
/>
```

## 🚀 Beneficios

1. **Mejor UX**: Iconos más relevantes y atractivos
2. **Consistencia**: Apariencia uniforme en toda la aplicación
3. **Rendimiento**: No más carga de imágenes genéricas
4. **Mantenibilidad**: Configuración centralizada y fácil de modificar
5. **Escalabilidad**: Fácil agregar nuevas categorías
6. **Accesibilidad**: Iconos SVG más claros y legibles

## 🐛 Solución de Problemas

### Icono no se muestra
- Verifica que la categoría esté en `categoria-config.ts`
- Asegúrate de que el nombre coincida exactamente
- Revisa la consola del navegador para errores

### Color incorrecto
- Verifica el código hexadecimal en la configuración
- Asegúrate de que el formato sea #RRGGBB

### Tamaño incorrecto
- El tamaño se calcula automáticamente
- Para personalizar, usa la prop `size`

## 📚 Referencias

- [Lucide React Icons](https://lucide.dev/icons/)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [Next.js Image Component](https://nextjs.org/docs/api-reference/next/image)
