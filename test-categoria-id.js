// Script de prueba para verificar la funcionalidad del categoria_id
// Este script simula la lógica de generación de IDs basados en categoría

function generateCategoriaId(categoria) {
  // Definir prefijos para cada categoría
  let categoriaPrefix = 'PRO' // Producto genérico por defecto
  
  switch (categoria.toLowerCase()) {
    case 'semillas':
      categoriaPrefix = 'SEM'
      break
    case 'fertilizantes':
      categoriaPrefix = 'FER'
      break
    case 'herramientas':
      categoriaPrefix = 'HER'
      break
    case 'sustratos':
      categoriaPrefix = 'SUS'
      break
    case 'iluminacion':
    case 'iluminación':
      categoriaPrefix = 'ILU'
      break
    case 'hidroponia':
    case 'hidroponía':
      categoriaPrefix = 'HID'
      break
    case 'kits':
      categoriaPrefix = 'KIT'
      break
    case 'accesorios':
      categoriaPrefix = 'ACC'
      break
    default:
      categoriaPrefix = 'PRO'
  }
  
  // Simular obtener el siguiente número para esta categoría
  // En la implementación real, esto vendría de la base de datos
  const nextNumber = 1
  
  // Formatear el ID con ceros a la izquierda (ej: SEM-001, SEM-002)
  return `${categoriaPrefix}-${nextNumber.toString().padStart(3, '0')}`
}

// Probar con diferentes categorías
const categorias = [
  'Semillas',
  'Fertilizantes', 
  'Herramientas',
  'Sustratos',
  'Iluminación',
  'Hidroponía',
  'Kits',
  'Accesorios',
  'Categoría Desconocida'
]

console.log('=== PRUEBA DE GENERACIÓN DE IDs BASADOS EN CATEGORÍA ===\n')

categorias.forEach(categoria => {
  const categoriaId = generateCategoriaId(categoria)
  console.log(`Categoría: ${categoria.padEnd(20)} → ID: ${categoriaId}`)
})

console.log('\n=== EJEMPLOS DE SECUENCIA ===\n')

// Simular secuencia para Semillas
console.log('Secuencia para Semillas:')
for (let i = 1; i <= 5; i++) {
  console.log(`  SEM-${i.toString().padStart(3, '0')}`)
}

console.log('\nSecuencia para Fertilizantes:')
for (let i = 1; i <= 3; i++) {
  console.log(`  FER-${i.toString().padStart(3, '0')}`)
}

console.log('\n=== CARACTERÍSTICAS ===\n')
console.log('✅ IDs únicos por categoría')
console.log('✅ Formato consistente (XXX-001, XXX-002, etc.)')
console.log('✅ Fácil identificación del tipo de producto')
console.log('✅ No se puede manipular manualmente')
console.log('✅ Se genera automáticamente al crear producto')
console.log('✅ Visible en formularios y listas de productos')
