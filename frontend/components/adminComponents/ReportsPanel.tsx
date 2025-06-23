
// no sirve



export default function ReportsPanel() {
  const topProducts = ['Pizza Pepperoni', 'Pizza Margherita', 'Pizza Hawaiana', 'Refresco 1L', 'Ensalada César'];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Reportes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Ventas del Mes</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-gray-500">Gráfico de ventas (ejemplo)</span>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Productos Más Vendidos</h3>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 text-sm text-gray-500">{index + 1}.</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{product}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${100 - (index * 15)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm font-medium">{150 - (index * 25)} ventas</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Resumen Financiero</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-gray-500">Ventas Hoy</div>
            <div className="text-2xl font-bold text-green-600">S/. 1,250</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-gray-500">Ventas Semana</div>
            <div className="text-2xl font-bold text-green-600">S/. 8,745</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-gray-500">Ventas Mes</div>
            <div className="text-2xl font-bold text-green-600">S/. 32,150</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-gray-500">Ganancias</div>
            <div className="text-2xl font-bold text-green-600">S/. 12,860</div>
          </div>
        </div>
      </div>
    </div>
  );
}
