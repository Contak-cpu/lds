import { 
  Package, 
  Leaf, 
  Droplets, 
  Lightbulb, 
  Thermometer, 
  Scissors, 
  Sprout, 
  Settings,
  Flower,
  Trees,
  Zap,
  Sun,
  Cloud,
  Mountain,
  Home,
  Car,
  Bike,
  Camera,
  Music,
  Book,
  Heart,
  Star,
  Moon,
  Coffee,
  Pizza,
  Wine,
  Beer,
  IceCream,
  Shirt,
  type LucideIcon
} from "lucide-react"

export interface CategoriaConfig {
  nombre: string
  icono: LucideIcon
  color: string
  descripcion?: string
  orden?: number
}

// Configuración centralizada de categorías
export const CATEGORIAS_CONFIG: CategoriaConfig[] = [
  // Categorías de cultivo
  {
    nombre: 'Kits',
    icono: Package,
    color: '#10B981',
    descripcion: 'Kits completos de cultivo',
    orden: 1
  },
  {
    nombre: 'Semillas',
    icono: Leaf,
    color: '#059669',
    descripcion: 'Semillas de cannabis y otras plantas',
    orden: 2
  },
  {
    nombre: 'Fertilizantes',
    icono: Droplets,
    color: '#3B82F6',
    descripcion: 'Nutrientes y fertilizantes para plantas',
    orden: 3
  },
  {
    nombre: 'Iluminación',
    icono: Lightbulb,
    color: '#F59E0B',
    descripcion: 'Sistemas de iluminación para cultivo',
    orden: 4
  },
  {
    nombre: 'Hidroponía',
    icono: Thermometer,
    color: '#8B5CF6',
    descripcion: 'Sistemas hidropónicos',
    orden: 5
  },
  {
    nombre: 'Herramientas',
    icono: Scissors,
    color: '#EF4444',
    descripcion: 'Herramientas para cultivo y mantenimiento',
    orden: 6
  },
  {
    nombre: 'Sustratos',
    icono: Sprout,
    color: '#84CC16',
    descripcion: 'Sustratos y medios de cultivo',
    orden: 7
  },
  {
    nombre: 'Accesorios',
    icono: Settings,
    color: '#6B7280',
    descripcion: 'Accesorios varios para cultivo',
    orden: 8
  },
  
  // Categorías de sneakers/ropa
  {
    nombre: 'Sneakers',
    icono: Zap,
    color: '#F97316',
    descripcion: 'Zapatillas deportivas',
    orden: 9
  },
  {
    nombre: 'Zapatillas',
    icono: Zap,
    color: '#F97316',
    descripcion: 'Calzado deportivo',
    orden: 10
  },
  {
    nombre: 'Calzado',
    icono: Zap,
    color: '#F97316',
    descripcion: 'Todo tipo de calzado',
    orden: 11
  },
  {
    nombre: 'Ropa',
    icono: Shirt,
    color: '#8B5CF6',
    descripcion: 'Ropa deportiva y casual',
    orden: 12
  },
  {
    nombre: 'Camisetas',
    icono: Shirt,
    color: '#8B5CF6',
    descripcion: 'Camisetas deportivas',
    orden: 13
  },
  {
    nombre: 'Pantalones',
    icono: Shirt,
    color: '#8B5CF6',
    descripcion: 'Pantalones deportivos',
    orden: 14
  },
  {
    nombre: 'Hoodies',
    icono: Shirt,
    color: '#8B5CF6',
    descripcion: 'Sudaderas con capucha',
    orden: 15
  },
  {
    nombre: 'Sudaderas',
    icono: Shirt,
    color: '#8B5CF6',
    descripcion: 'Sudaderas deportivas',
    orden: 16
  },
  {
    nombre: 'Gorras',
    icono: Star,
    color: '#F59E0B',
    descripcion: 'Gorras deportivas',
    orden: 17
  },
  {
    nombre: 'Mochilas',
    icono: Package,
    color: '#3B82F6',
    descripcion: 'Mochilas deportivas',
    orden: 18
  },
  
  // Categorías generales
  {
    nombre: 'Electrónicos',
    icono: Zap,
    color: '#3B82F6',
    descripcion: 'Productos electrónicos',
    orden: 19
  },
  {
    nombre: 'Tecnología',
    icono: Zap,
    color: '#3B82F6',
    descripcion: 'Productos tecnológicos',
    orden: 20
  },
  {
    nombre: 'Deportes',
    icono: Zap,
    color: '#10B981',
    descripcion: 'Equipamiento deportivo',
    orden: 21
  },
  {
    nombre: 'Fitness',
    icono: Zap,
    color: '#10B981',
    descripcion: 'Productos de fitness',
    orden: 22
  },
  {
    nombre: 'Salud',
    icono: Heart,
    color: '#EF4444',
    descripcion: 'Productos de salud',
    orden: 23
  },
  {
    nombre: 'Belleza',
    icono: Star,
    color: '#EC4899',
    descripcion: 'Productos de belleza',
    orden: 24
  },
  {
    nombre: 'Hogar',
    icono: Home,
    color: '#8B5CF6',
    descripcion: 'Productos para el hogar',
    orden: 25
  },
  {
    nombre: 'Cocina',
    icono: Coffee,
    color: '#F97316',
    descripcion: 'Productos de cocina',
    orden: 26
  },
  {
    nombre: 'Automóviles',
    icono: Car,
    color: '#6B7280',
    descripcion: 'Productos para automóviles',
    orden: 27
  },
  {
    nombre: 'Motos',
    icono: Bike,
    color: '#6B7280',
    descripcion: 'Productos para motos',
    orden: 28
  },
  {
    nombre: 'Fotografía',
    icono: Camera,
    color: '#8B5CF6',
    descripcion: 'Productos de fotografía',
    orden: 29
  },
  {
    nombre: 'Música',
    icono: Music,
    color: '#EC4899',
    descripcion: 'Productos musicales',
    orden: 30
  },
  {
    nombre: 'Libros',
    icono: Book,
    color: '#F59E0B',
    descripcion: 'Libros y publicaciones',
    orden: 31
  },
  {
    nombre: 'Juguetes',
    icono: Star,
    color: '#F59E0B',
    descripcion: 'Juguetes y entretenimiento',
    orden: 32
  },
  {
    nombre: 'Videojuegos',
    icono: Zap,
    color: '#8B5CF6',
    descripcion: 'Productos de videojuegos',
    orden: 33
  },
  
  // Categorías de alimentos
  {
    nombre: 'Alimentos',
    icono: Pizza,
    color: '#F97316',
    descripcion: 'Productos alimenticios',
    orden: 34
  },
  {
    nombre: 'Bebidas',
    icono: Wine,
    color: '#8B5CF6',
    descripcion: 'Bebidas y líquidos',
    orden: 35
  },
  {
    nombre: 'Postres',
    icono: IceCream,
    color: '#EC4899',
    descripcion: 'Postres y dulces',
    orden: 36
  },
  {
    nombre: 'Snacks',
    icono: Star,
    color: '#F59E0B',
    descripcion: 'Snacks y aperitivos',
    orden: 37
  },
  
  // Categorías por defecto
  {
    nombre: 'Otros',
    icono: Package,
    color: '#6B7280',
    descripcion: 'Otros productos',
    orden: 999
  },
  {
    nombre: 'General',
    icono: Package,
    color: '#6B7280',
    descripcion: 'Productos generales',
    orden: 1000
  },
  {
    nombre: 'Sin categoría',
    icono: Package,
    color: '#6B7280',
    descripcion: 'Productos sin categoría',
    orden: 1001
  },
]

// Función para obtener la configuración de una categoría
export function getCategoriaConfig(nombre: string): CategoriaConfig {
  const categoriaNormalizada = nombre?.trim() || 'General'
  return CATEGORIAS_CONFIG.find(cat => cat.nombre === categoriaNormalizada) || 
         CATEGORIAS_CONFIG.find(cat => cat.nombre === 'General')!
}

// Función para obtener el icono de una categoría
export function getCategoriaIcon(nombre: string): LucideIcon {
  return getCategoriaConfig(nombre).icono
}

// Función para obtener el color de una categoría
export function getCategoriaColor(nombre: string): string {
  return getCategoriaConfig(nombre).color
}

// Función para obtener todas las categorías ordenadas
export function getCategoriasOrdenadas(): CategoriaConfig[] {
  return [...CATEGORIAS_CONFIG].sort((a, b) => (a.orden || 0) - (b.orden || 0))
}

// Función para obtener solo los nombres de las categorías
export function getNombresCategorias(): string[] {
  return CATEGORIAS_CONFIG.map(cat => cat.nombre)
}
