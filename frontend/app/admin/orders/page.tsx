'use client';
// hola
import { useState } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import OrdersList from '@/components/adminComponents/OrdersList';

export default function OrdersPage() {
  const [orders] = useState([
    { id: '#001', customer: 'Juan Pérez', items: 'Pizza Hawaiana, Refresco', total: 21.49, status: 'En preparación' },
    { id: '#002', customer: 'María García', items: 'Pizza 4 Quesos', total: 16.99, status: 'Pendiente' },
    { id: '#003', customer: 'Carlos López', items: 'Pizza Pepperoni, Ensalada', total: 23.98, status: 'Listo' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HeaderAdmin />
      <div className="flex-1 overflow-auto">
        <Topbar title="Pedidos" />
        <main className="p-6">
          <OrdersList orders={orders} />
        </main>
      </div>
    </div>
  );
}
