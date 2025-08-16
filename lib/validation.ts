// Utilidades de validación para formularios

export interface ValidationError {
  [key: string]: string
}

// Validación de email
export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return "El email es obligatorio"
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "Formato de email inválido"
  }
  return undefined
}

// Validación de teléfono
export const validatePhone = (phone: string): string | undefined => {
  if (!phone.trim()) {
    return "El teléfono es obligatorio"
  }
  if (!/^[\+]?[0-9\s\-\(\)]+$/.test(phone.trim())) {
    return "El teléfono solo puede contener números, espacios, guiones y paréntesis"
  }
  if (phone.trim().replace(/[\s\-\(\)]/g, '').length < 8) {
    return "El teléfono debe tener al menos 8 dígitos"
  }
  return undefined
}

// Validación de nombre (solo letras y espacios)
export const validateName = (name: string, fieldName: string = "campo"): string | undefined => {
  if (!name.trim()) {
    return `El ${fieldName} es obligatorio`
  }
  if (name.trim().length < 2) {
    return `El ${fieldName} debe tener al menos 2 caracteres`
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name.trim())) {
    return `El ${fieldName} solo puede contener letras y espacios`
  }
  return undefined
}

// Validación de dirección
export const validateAddress = (address: string): string | undefined => {
  if (!address.trim()) {
    return "La dirección es obligatoria"
  }
  if (address.trim().length < 5) {
    return "La dirección debe tener al menos 5 caracteres"
  }
  return undefined
}

// Validación de código postal
export const validatePostalCode = (postalCode: string): string | undefined => {
  if (!postalCode.trim()) {
    return "El código postal es obligatorio"
  }
  if (!/^\d{4,5}$/.test(postalCode.trim())) {
    return "El código postal debe tener 4 o 5 dígitos numéricos"
  }
  return undefined
}

// Validación de precio
export const validatePrice = (price: string): string | undefined => {
  if (!price.trim()) {
    return "El precio es obligatorio"
  }
  if (!/^\d+(\.\d{1,2})?$/.test(price.trim())) {
    return "El precio debe ser un número válido (máximo 2 decimales)"
  }
  if (parseFloat(price) < 0) {
    return "El precio no puede ser negativo"
  }
  return undefined
}

// Validación de stock
export const validateStock = (stock: string): string | undefined => {
  if (!stock.trim()) {
    return "El stock es obligatorio"
  }
  if (!/^\d+$/.test(stock.trim())) {
    return "El stock debe ser un número entero"
  }
  if (parseInt(stock) < 0) {
    return "El stock no puede ser negativo"
  }
  return undefined
}

// Validación de SKU
export const validateSKU = (sku: string): string | undefined => {
  if (!sku.trim()) {
    return "El SKU es obligatorio"
  }
  if (sku.trim().length < 3) {
    return "El SKU debe tener al menos 3 caracteres"
  }
  if (!/^[A-Z0-9\-_]+$/.test(sku.trim())) {
    return "El SKU solo puede contener letras mayúsculas, números, guiones y guiones bajos"
  }
  return undefined
}
