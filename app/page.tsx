import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Package, TrendingUp, ShoppingCart, Leaf, Droplets, Sun } from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navigation />

      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-green-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard de Ventas</h1>
                <p className="text-sm text-green-600">Gestiona tu negocio de cultivo de manera eficiente</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  Activo
                </Badge>
                <Link href="/configuracion">
                  <Button variant="outline" size="sm">
                    Configuración
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ventas Hoy</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">$284.700 ARS</div>
                <p className="text-xs text-green-600 mt-1">+12% desde ayer</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Clientes Activos</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">156</div>
                <p className="text-xs text-blue-600 mt-1">+8 nuevos esta semana</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Productos en Stock</CardTitle>
                <Package className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">89</div>
                <p className="text-xs text-amber-600 mt-1">12 productos con stock bajo</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pedidos Pendientes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">23</div>
                <p className="text-xs text-purple-600 mt-1">5 requieren atención</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="lg:col-span-1 bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Acciones Rápidas</CardTitle>
                <CardDescription>Gestiona tu negocio eficientemente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/clientes">
                  <Button className="w-full justify-start bg-green-600 hover:bg-green-700" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Gestionar Clientes
                  </Button>
                </Link>
                <Link href="/productos">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700" size="sm">
                    <Package className="mr-2 h-4 w-4" />
                    Catálogo de Productos
                  </Button>
                </Link>
                <Link href="/ventas">
                  <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Nueva Venta
                  </Button>
                </Link>
                <Link href="/reportes">
                  <Button className="w-full justify-start bg-amber-600 hover:bg-amber-700" size="sm">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Ver Reportes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2 bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Actividad Reciente</CardTitle>
                <CardDescription>Últimas transacciones y eventos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="bg-green-600 p-2 rounded-full">
                      <ShoppingCart className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Nueva venta - Producto</p>
                      <p className="text-xs text-gray-500">Cliente: - $0 ARS</p>
                    </div>
                    <span className="text-xs text-gray-400">Reciente</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="bg-blue-600 p-2 rounded-full">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Nuevo cliente registrado</p>
                      <p className="text-xs text-gray-500">Carlos Ruiz - Cultivador principiante</p>
                    </div>
                    <span className="text-xs text-gray-400">Hace 15 min</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                    <div className="bg-amber-600 p-2 rounded-full">
                      <Package className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Stock bajo - Fertilizante Orgánico</p>
                      <p className="text-xs text-gray-500">Quedan 5 unidades</p>
                    </div>
                    <span className="text-xs text-gray-400">Hace 1 hora</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="mt-6 bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Productos Más Vendidos</CardTitle>
              <CardDescription>Los favoritos de tus clientes este mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="bg-green-600 p-3 rounded-lg">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Producto</h4>
                    <p className="text-sm text-gray-600">0 ventas - $0 ARS</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Droplets className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Producto 4</h4>
                    <p className="text-sm text-gray-600">0 ventas - $0 ARS</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <div className="bg-amber-600 p-3 rounded-lg">
                    <Sun className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Lámpara LED Grow</h4>
                    <p className="text-sm text-gray-600">28 ventas - $784.000 ARS</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
