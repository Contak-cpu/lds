"use client"

import { getCategoriaConfig } from "@/lib/categoria-config"

interface CategoriaIconProps {
  categoria: string
  size?: number
  className?: string
  color?: string
}

export function CategoriaIcon({ 
  categoria, 
  size = 24, 
  className = "", 
  color 
}: CategoriaIconProps) {
  // Obtener la configuración de la categoría
  const config = getCategoriaConfig(categoria)
  
  // Usar el color personalizado o el de la configuración
  const iconColor = color || config.color
  
  return (
    <div 
      className={`flex items-center justify-center rounded-lg ${className}`}
      style={{ 
        width: size, 
        height: size,
        backgroundColor: `${iconColor}20`, // Color con transparencia
        color: iconColor 
      }}
    >
      <config.icono size={size * 0.6} />
    </div>
  )
}

// Componente para mostrar solo el icono sin contenedor
export function CategoriaIconOnly({ 
  categoria, 
  size = 24, 
  className = "", 
  color 
}: CategoriaIconProps) {
  const config = getCategoriaConfig(categoria)
  const iconColor = color || config.color
  
  return (
    <config.icono 
      size={size} 
      className={className}
      style={{ color: iconColor }}
    />
  )
}

// Componente para mostrar el icono con etiqueta
export function CategoriaIconWithLabel({ 
  categoria, 
  size = 24, 
  className = "", 
  color,
  showLabel = true,
  labelClassName = ""
}: CategoriaIconProps & { showLabel?: boolean; labelClassName?: string }) {
  const config = getCategoriaConfig(categoria)
  const iconColor = color || config.color
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CategoriaIcon 
        categoria={categoria} 
        size={size} 
        color={iconColor}
      />
      {showLabel && (
        <span 
          className={`text-sm font-medium ${labelClassName}`}
          style={{ color: iconColor }}
        >
          {config.nombre}
        </span>
      )}
    </div>
  )
}
