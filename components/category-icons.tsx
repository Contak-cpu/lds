"use client"

import { 
  Package, 
  Zap, 
  Leaf, 
  Lightbulb, 
  Droplets, 
  Scissors, 
  Thermometer,
  Target,
  Heart,
  Shirt,
  Watch,
  Headphones,
  Camera,
  Gamepad2,
  BookOpen,
  Car,
  Home,
  Utensils,
  ShoppingBag,
  Gift
} from "lucide-react"

interface CategoryIconProps {
  categoria: string
  size?: number
  className?: string
}

// Mapa de colores por categoría
const categoryColorMap: Record<string, { bg: string; icon: string; border: string }> = {
  // Categorías de Sneakers
  "Running": { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" },
  "Basketball": { bg: "bg-orange-50", icon: "text-orange-600", border: "border-orange-200" },
  "Lifestyle": { bg: "bg-green-50", icon: "text-green-600", border: "border-green-200" },
  "Training": { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-200" },
  "Soccer": { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-200" },
  "Tennis": { bg: "bg-red-50", icon: "text-red-600", border: "border-red-200" },
  "Skateboarding": { bg: "bg-violet-50", icon: "text-violet-600", border: "border-violet-200" },
  "Hiking": { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-200" },
  
  // Categorías de Cannabis/Hidroponía (mantener compatibilidad)
  "Semillas": { bg: "bg-green-50", icon: "text-green-600", border: "border-green-200" },
  "Fertilizantes": { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" },
  "Iluminación": { bg: "bg-yellow-50", icon: "text-yellow-600", border: "border-yellow-200" },
  "Sustratos": { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-200" },
  "Herramientas": { bg: "bg-gray-50", icon: "text-gray-600", border: "border-gray-200" },
  "Control Climático": { bg: "bg-cyan-50", icon: "text-cyan-600", border: "border-cyan-200" },
  "Hidroponía": { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" },
  "Accesorios": { bg: "bg-indigo-50", icon: "text-indigo-600", border: "border-indigo-200" },
  
  // Categorías generales
  "Ropa": { bg: "bg-pink-50", icon: "text-pink-600", border: "border-pink-200" },
  "Accesorios": { bg: "bg-slate-50", icon: "text-slate-600", border: "border-slate-200" },
  "Electrónicos": { bg: "bg-sky-50", icon: "text-sky-600", border: "border-sky-200" },
  "Fotografía": { bg: "bg-rose-50", icon: "text-rose-600", border: "border-rose-200" },
  "Gaming": { bg: "bg-fuchsia-50", icon: "text-fuchsia-600", border: "border-fuchsia-200" },
  "Libros": { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-200" },
  "Automotriz": { bg: "bg-red-50", icon: "text-red-600", border: "border-red-200" },
  "Hogar": { bg: "bg-orange-50", icon: "text-orange-600", border: "border-orange-200" },
  "Cocina": { bg: "bg-yellow-50", icon: "text-yellow-600", border: "border-yellow-200" },
  "Deportes": { bg: "bg-green-50", icon: "text-green-600", border: "border-green-200" },
  "Moda": { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-200" },
  "Regalos": { bg: "bg-pink-50", icon: "text-pink-600", border: "border-pink-200" },
  
  // Fallback
  "default": { bg: "bg-gray-50", icon: "text-gray-600", border: "border-gray-200" }
}



const categoryIconMap: Record<string, React.ComponentType<any>> = {
  // Categorías de Sneakers
  "Running": Zap,
  "Basketball": Target,
  "Lifestyle": Heart,
  "Training": Package,
  "Soccer": Target,
  "Tennis": Target,
  "Golf": Target,
  "Skateboarding": Package,
  "Hiking": Package,
  "Dance": Heart,
  
  // Categorías de Cannabis/Hidroponía (mantener compatibilidad)
  "Semillas": Leaf,
  "Fertilizantes": Droplets,
  "Iluminación": Lightbulb,
  "Sustratos": Package,
  "Herramientas": Scissors,
  "Control Climático": Thermometer,
  "Hidroponía": Droplets,
  "Accesorios": Package,
  
  // Categorías generales
  "Ropa": Shirt,
  "Accesorios": Watch,
  "Electrónicos": Headphones,
  "Fotografía": Camera,
  "Gaming": Gamepad2,
  "Libros": BookOpen,
  "Automotriz": Car,
  "Hogar": Home,
  "Cocina": Utensils,
  "Deportes": Target,
  "Moda": ShoppingBag,
  "Regalos": Gift,
  
  // Fallback
  "default": Package
}

export function CategoryIcon({ categoria, size = 24, className = "" }: CategoryIconProps) {
  // Normalizar el nombre de la categoría
  const normalizedCategoria = categoria.trim()
  
  // Buscar el icono y colores correspondientes
  const IconComponent = categoryIconMap[normalizedCategoria] || Package
  const colors = categoryColorMap[normalizedCategoria] || categoryColorMap["default"]
  
  return (
    <div className={`flex items-center justify-center rounded-lg p-3 border ${colors.bg} ${colors.border} ${className}`}>
      <IconComponent size={size} className={colors.icon} />
    </div>
  )
}

// Componente específico para productos sin imagen
export function ProductImagePlaceholder({ 
  categoria, 
  size = "w-24 h-24", 
  className = "" 
}: { 
  categoria: string
  size?: string
  className?: string 
}) {
  // Normalizar el nombre de la categoría
  const normalizedCategoria = categoria.trim()
  
  // Buscar el icono y colores correspondientes
  const IconComponent = categoryIconMap[normalizedCategoria] || Package
  const colors = categoryColorMap[normalizedCategoria] || categoryColorMap["default"]
  
  return (
    <div className={`${size} bg-gradient-to-br ${colors.bg} to-white dark:to-gray-800 rounded-lg border ${colors.border} flex items-center justify-center ${className}`}>
      <div className="text-center">
        <IconComponent size={48} className={`${colors.icon} mb-2`} />
        <p className={`text-xs font-medium ${colors.icon} capitalize`}>
          {normalizedCategoria}
        </p>
      </div>
    </div>
  )
}

// Componente para mostrar el icono de la categoría en listas
export function CategoryIconSmall({ categoria, className?: string }: { categoria: string, className?: string }) {
  // Normalizar el nombre de la categoría
  const normalizedCategoria = categoria.trim()
  
  // Buscar el icono y colores correspondientes
  const IconComponent = categoryIconMap[normalizedCategoria] || Package
  const colors = categoryColorMap[normalizedCategoria] || categoryColorMap["default"]
  
  return (
    <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${colors.bg} ${colors.border} ${className}`}>
      <IconComponent size={16} className={colors.icon} />
    </div>
  )
}

// Componente para mostrar el icono de la categoría con etiqueta
export function CategoryIconWithLabel({ categoria, className?: string }: { categoria: string, className?: string }) {
  // Normalizar el nombre de la categoría
  const normalizedCategoria = categoria.trim()
  
  // Buscar el icono y colores correspondientes
  const IconComponent = categoryIconMap[normalizedCategoria] || Package
  const colors = categoryColorMap[normalizedCategoria] || categoryColorMap["default"]
  
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${colors.bg} ${colors.border} ${className}`}>
      <IconComponent size={16} className={colors.icon} />
      <span className={`text-xs font-medium ${colors.icon} capitalize`}>
        {normalizedCategoria}
      </span>
    </div>
  )
}
