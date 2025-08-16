"use client"

import { toast } from "@/hooks/use-toast"

export const useNotifications = () => {
  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    })
  }

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    })
  }

  const showProductoCreated = () => {
    showSuccess(
      "✅ Producto creado exitosamente",
      "El producto ha sido agregado al inventario"
    )
  }

  const showProductoUpdated = () => {
    showSuccess(
      "✅ Producto actualizado exitosamente",
      "Los cambios han sido guardados"
    )
  }

  const showProductoDeleted = () => {
    showSuccess(
      "✅ Producto eliminado exitosamente",
      "El producto ha sido removido del inventario"
    )
  }

  const showClienteCreated = () => {
    showSuccess(
      "✅ Cliente registrado exitosamente",
      "El cliente ha sido agregado a la base de datos"
    )
  }

  const showClienteUpdated = () => {
    showSuccess(
      "✅ Cliente actualizado exitosamente",
      "Los datos del cliente han sido modificados"
    )
  }

  const showClienteDeleted = () => {
    showSuccess(
      "✅ Cliente eliminado exitosamente",
      "El cliente ha sido removido de la base de datos"
    )
  }

  const showVentaCreated = () => {
    showSuccess(
      "✅ Venta registrada exitosamente",
      "La venta ha sido procesada y registrada"
    )
  }

  const showVentaUpdated = () => {
    showSuccess(
      "✅ Venta actualizada exitosamente",
      "Los cambios en la venta han sido guardados"
    )
  }

  const showVentaDeleted = () => {
    showSuccess(
      "✅ Venta eliminada exitosamente",
      "La venta ha sido removida del sistema"
    )
  }

  const showEgresoCreated = () => {
    showSuccess(
      "✅ Egreso registrado exitosamente",
      "El egreso ha sido agregado al sistema"
    )
  }

  const showEgresoUpdated = () => {
    showSuccess(
      "✅ Egreso actualizado exitosamente",
      "Los cambios en el egreso han sido guardados"
    )
  }

  const showEgresoDeleted = () => {
    showSuccess(
      "✅ Egreso eliminado exitosamente",
      "El egreso ha sido removido del sistema"
    )
  }

  const showCategoriaCreated = () => {
    showSuccess(
      "✅ Categoría creada exitosamente",
      "La nueva categoría ha sido agregada"
    )
  }

  const showCategoriaUpdated = () => {
    showSuccess(
      "✅ Categoría actualizada exitosamente",
      "Los cambios en la categoría han sido guardados"
    )
  }

  const showCategoriaDeleted = () => {
    showSuccess(
      "✅ Categoría eliminada exitosamente",
      "La categoría ha sido removida del sistema"
    )
  }

  const showGenericSuccess = (operation: string, entity: string) => {
    showSuccess(
      `✅ ${operation} exitoso`,
      `La operación en ${entity} se completó correctamente`
    )
  }

  const showGenericError = (operation: string, entity: string, error?: string) => {
    showError(
      `❌ Error al ${operation}`,
      `No se pudo completar la operación en ${entity}${error ? `: ${error}` : ""}`
    )
  }

  return {
    showSuccess,
    showError,
    showProductoCreated,
    showProductoUpdated,
    showProductoDeleted,
    showClienteCreated,
    showClienteUpdated,
    showClienteDeleted,
    showVentaCreated,
    showVentaUpdated,
    showVentaDeleted,
    showEgresoCreated,
    showEgresoUpdated,
    showEgresoDeleted,
    showCategoriaCreated,
    showCategoriaUpdated,
    showCategoriaDeleted,
    showGenericSuccess,
    showGenericError,
  }
}
