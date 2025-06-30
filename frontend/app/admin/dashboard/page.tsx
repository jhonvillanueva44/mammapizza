// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/adminComponents/ProtectedRoute';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

type ProductosPorCategoria = { categoria: string; cantidad: number };
type StockPorCategoria = { categoria: string; stock: number };
type PreciosPromedio = { categoria: string; precio_promedio: number };

interface Stats {
  productosPorCategoria: ProductosPorCategoria[];
  stockPorCategoria: StockPorCategoria[];
  preciosPromedio: PreciosPromedio[];
}

const backendUrl = process.env.NEXT_PUBLIC_BACK_HOST;

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ¡ESTE ES EL useEffect FALTANTE!
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);        
        const response = await fetch(`${backendUrl}api/estadisticas/productos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          const filteredData = {
            productosPorCategoria: data.data.productosPorCategoria?.filter((item: { categoria: any; cantidad: null | undefined; }) => 
              item.categoria && 
              item.cantidad !== null && 
              item.cantidad !== undefined &&
              !['Promociones', 'Agregados'].includes(item.categoria)
            ) || [],
            stockPorCategoria: data.data.stockPorCategoria?.filter((item: { categoria: any; stock: number | null | undefined; }) => 
              item.categoria && item.stock !== null && item.stock !== undefined && item.stock > 0
            ) || [],
            preciosPromedio: data.data.preciosPromedio?.filter((item: { categoria: any; precio_promedio: null | undefined; }) => 
              item.categoria && item.precio_promedio !== null && item.precio_promedio !== undefined
            ) || []
          };
          setStats(filteredData);
        } else {
          setError(data.message || 'Error al obtener los datos');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); 

  const formatPriceTooltip = (value: number, name: string) => {
    return [`S/.${value.toFixed(2)}`, name];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <HeaderAdmin />
        <div className="flex-1 overflow-auto">
          <Topbar title="Dashboard" />
          <main className="p-6">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando estadísticas...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <HeaderAdmin />
        <div className="flex-1 overflow-auto">
          <Topbar title="Dashboard" />
          <main className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold">Error</h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        <HeaderAdmin />
        <div className="flex-1 overflow-auto">
          <Topbar title="Dashboard" />
          <main className="p-6">
            <h1 className="text-2xl font-bold mb-6">Estadísticas de Productos</h1>

            {stats && (
              <div className="space-y-6">
                {/* Estadísticas generales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Categorías</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.productosPorCategoria.length}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Productos</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.productosPorCategoria.reduce((acc, item) => acc + item.cantidad, 0)}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Stock Total</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats.stockPorCategoria.reduce((acc, item) => acc + item.stock, 0)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gráfico 1: Productos por categoría */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Productos por Categoría</h2>
                    {stats.productosPorCategoria.length > 0 ? (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={stats.productosPorCategoria}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="categoria"
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              fontSize={12}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="cantidad"
                              fill="#3B82F6"
                              name="Cantidad de productos"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-500">
                        No hay datos disponibles
                      </div>
                    )}
                  </div>

                  {/* Gráfico 2: Stock por categoría */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Distribución de Stock</h2>
                    {stats.stockPorCategoria.length > 0 ? (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.stockPorCategoria}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="stock"
                              nameKey="categoria"
                              label={({ categoria, percent }) =>
                                percent > 0.05 ? `${categoria}: ${(percent * 100).toFixed(0)}%` : ''
                              }
                            >
                              {stats.stockPorCategoria.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} unidades`, 'Stock']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-500">
                        No hay datos de stock disponibles
                      </div>
                    )}
                  </div>

                  {/* Gráfico 3: Precio promedio */}
                  <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Precio Promedio por Categoría</h2>
                    {stats.preciosPromedio.length > 0 ? (
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={stats.preciosPromedio}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="categoria"
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              fontSize={12}
                            />
                            <YAxis
                              tickFormatter={(value: number) => `S/.${value.toFixed(0)}`}
                            />
                            <Tooltip
                              formatter={formatPriceTooltip}
                              labelStyle={{ color: '#374151' }}
                            />
                            <Legend />
                            <Bar
                              dataKey="precio_promedio"
                              fill="#10B981"
                              name="Precio promedio"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-500">
                        No hay datos de precios disponibles
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      </ProtectedRoute>
  );
}