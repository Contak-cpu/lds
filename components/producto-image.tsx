"use client"

import Image from "next/image"
import { CategoriaIcon } from "./categoria-icon"

interface ProductoImageProps {
  imagenUrl?: string | null
  categoria: string
  nombre: string
  size?: number
  className?: string
  showFallback?: boolean
}

export function ProductoImage({ 
  imagenUrl, 
  categoria, 
  nombre, 
  size = 200, 
  className = "",
  showFallback = true
}: ProductoImageProps) {
  // Si no hay imagen URL o está vacía, mostrar el icono de categoría
  if (!imagenUrl || imagenUrl.trim() === "" || imagenUrl.includes("placeholder")) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <CategoriaIcon 
          categoria={categoria} 
          size={size * 0.4} 
          className="opacity-80"
        />
      </div>
    )
  }

  // Si hay imagen URL válida, mostrarla
  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={imagenUrl}
        alt={nombre}
        fill
        className="object-cover"
        sizes={`${size}px`}
        onError={(e) => {
          // Si la imagen falla, mostrar el icono de categoría
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent && showFallback) {
            const fallback = document.createElement('div')
            fallback.className = 'flex items-center justify-center bg-muted rounded-lg w-full h-full'
            fallback.innerHTML = `
              <div class="flex items-center justify-center rounded-lg" style="width: ${size * 0.4}px; height: ${size * 0.4}px; background-color: #6B728020; color: #6B7280;">
                <svg width="${size * 0.24}" height="${size * 0.24}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
            `
            parent.appendChild(fallback)
          }
        }}
      />
    </div>
  )
}

// Componente para mostrar solo el icono de categoría (sin contenedor de imagen)
export function ProductoIcon({ 
  categoria, 
  nombre, 
  size = 24, 
  className = "" 
}: Omit<ProductoImageProps, 'imagenUrl' | 'showFallback'>) {
  return (
    <CategoriaIcon 
      categoria={categoria} 
      size={size} 
      className={className}
    />
  )
}

// Componente para mostrar la imagen con overlay de categoría
export function ProductoImageWithOverlay({ 
  imagenUrl, 
  categoria, 
  nombre, 
  size = 200, 
  className = "" 
}: Omit<ProductoImageProps, 'showFallback'>) {
  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{ width: size, height: size }}
    >
      {imagenUrl && imagenUrl.trim() !== "" && !imagenUrl.includes("placeholder") ? (
        <>
          <Image
            src={imagenUrl}
            alt={nombre}
            fill
            className="object-cover"
            sizes={`${size}px`}
          />
          {/* Overlay con icono de categoría */}
          <div className="absolute top-2 right-2">
            <CategoriaIcon 
              categoria={categoria} 
              size={24} 
              className="shadow-lg"
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center bg-muted rounded-lg w-full h-full">
          <CategoriaIcon 
            categoria={categoria} 
            size={size * 0.4} 
            className="opacity-80"
          />
        </div>
      )}
    </div>
  )
}
