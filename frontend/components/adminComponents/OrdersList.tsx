
// no sirve



type Order = {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: string;
};

export default function OrdersList({ orders }: { orders: Order[] }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pedidos Recientes</h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <div>
                  <span className="font-bold">{order.id}</span>
                  <span className="text-gray-600 ml-4">{order.customer}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'En preparación' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Pendiente' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="p-4 flex justify-between">
                <div className="text-sm text-gray-600">{order.items}</div>
                <div className="font-bold">S/. {order.total.toFixed(2)}</div>
              </div>
              <div className="px-4 py-2 bg-gray-50 border-t flex justify-end space-x-2">
                <button className="text-sm text-red-600 hover:text-red-800">Marcar como listo</button>
                <button className="text-sm text-gray-600 hover:text-gray-800">Ver detalles</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
