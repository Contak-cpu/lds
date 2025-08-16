"use client"

import { toast } from "@/hooks/use-toast"

export const useNotifications = () => {
  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
      className: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-50",
    })
  }

  const showProductoCreated = () => {
    toast({
      title: "✅ Producto creado exitosamente",
      description: "El producto ha sido agregado al inventario",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showProductoUpdated = () => {
    toast({
      title: "✅ Producto actualizado exitosamente",
      description: "Los cambios han sido guardados",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showProductoDeleted = () => {
    toast({
      title: "✅ Producto eliminado exitosamente",
      description: "El producto ha sido removido del inventario",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showClienteCreated = () => {
    toast({
      title: "✅ Cliente registrado exitosamente",
      description: "El cliente ha sido agregado a la base de datos",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showClienteUpdated = () => {
    toast({
      title: "✅ Cliente actualizado exitosamente",
      description: "Los datos del cliente han sido modificados",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showClienteDeleted = () => {
    toast({
      title: "✅ Cliente eliminado exitosamente",
      description: "El cliente ha sido removido de la base de datos",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showVentaCreated = () => {
    toast({
      title: "✅ Venta registrada exitosamente",
      description: "La venta ha sido procesada y registrada",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showVentaUpdated = () => {
    toast({
      title: "✅ Venta actualizada exitosamente",
      description: "Los cambios en la venta han sido guardados",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showVentaDeleted = () => {
    toast({
      title: "✅ Venta eliminada exitosamente",
      description: "La venta ha sido removida del sistema",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showEgresoCreated = () => {
    toast({
      title: "✅ Egreso registrado exitosamente",
      description: "El egreso ha sido agregado al sistema",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showEgresoUpdated = () => {
    toast({
      title: "✅ Egreso actualizado exitosamente",
      description: "Los cambios en el egreso han sido guardados",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showEgresoDeleted = () => {
    toast({
      title: "✅ Egreso eliminado exitosamente",
      description: "El egreso ha sido removido del sistema",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showCategoriaCreated = () => {
    toast({
      title: "✅ Categoría creada exitosamente",
      description: "La nueva categoría ha sido agregada",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showCategoriaUpdated = () => {
    toast({
      title: "✅ Categoría actualizada exitosamente",
      description: "Los cambios en la categoría han sido guardados",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showCategoriaDeleted = () => {
    toast({
      title: "✅ Categoría eliminada exitosamente",
      description: "La categoría ha sido removida del sistema",
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showGenericSuccess = (operation: string, entity: string) => {
    toast({
      title: `✅ ${operation} exitoso`,
      description: `La operación en ${entity} se completó correctamente`,
      className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-50",
    })
  }

  const showGenericError = (operation: string, entity: string, error?: string) => {
    toast({
      title: `❌ Error al ${operation}`,
      description: `No se pudo completar la operación en ${entity}${error ? `: ${error}` : ""}`,
      className: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-50",
    })
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
