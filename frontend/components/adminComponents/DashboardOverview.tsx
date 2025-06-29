
// no sirve
//hola

type Product = {
  id: number;
  name: string;
  stock: number;
};

type Order = {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: string;
};

export default function DashboardOverview({ products, orders }: { products: Product[]; orders: Order[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen del Día</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pedidos hoy</span>
              <span className="text-2xl font-bold text-red-600">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ingresos</span>
              <span className="text-2xl font-bold text-green-600">S/. 1,250</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nuevos clientes</span>
              <span className="text-2xl font-bold text-blue-600">5</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Crítico</h3>
          <div className="space-y-3">
            {products.filter(p => p.stock <= 5).map(product => (
              <div key={product.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="font-medium">{product.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {product.stock === 0 ? 'Agotado' : `${product.stock} unidades`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pedidos Recientes</h3>
          <div className="space-y-3">
            {orders.slice(0, 3).map(order => (
              <div key={order.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between">
                  <span className="font-medium">{order.id}</span>
                  <span className="text-gray-600 text-sm">{order.customer}</span>
                </div>
                <div className="text-sm text-gray-500 truncate">{order.items}</div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="font-medium">S/. {order.total.toFixed(2)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    order.status === 'En preparación' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Pendiente' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {[{ action: 'Nuevo pedido registrado', details: '#004 - Pizza Vegetariana', time: 'Hace 15 minutos' },
            { action: 'Producto actualizado', details: 'Pizza Margherita - Stock: 24', time: 'Hace 1 hora' },
            { action: 'Pedido completado', details: '#001 - Pizza Hawaiana', time: 'Hace 2 horas' },
          ].map((item, i) => (
            <div key={i} className="flex items-start">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <span className="text-red-600">🍕</span>
              </div>
              <div className="flex-1">
                <div className="font-medium">{item.action}</div>
                <div className="text-sm text-gray-600">{item.details}</div>
              </div>
              <div className="text-sm text-gray-500">{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
