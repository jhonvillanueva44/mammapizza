'use client';

import { useState } from 'react';
import HeaderAdmin from '@/components/adminComponents/HeaderAdmin';
import Topbar from '@/components/adminComponents/Topbar';
import StockTable from '@/components/adminComponents/StockTable';
import AddProductModal from '@/components/adminComponents/AddProductModal';

export default function StockPage() {
  const [showAddProduct, setShowAddProduct] = useState(false);

  const [products, setProducts] = useState([
    { id: 1, name: 'Pizza Margherita', category: 'Pizzas', price: 12.99, stock: 24, status: 'Disponible' },
    { id: 2, name: 'Pizza Pepperoni', category: 'Pizzas', price: 14.99, stock: 18, status: 'Disponible' },
    { id: 3, name: 'Pizza Hawaiana', category: 'Pizzas', price: 15.99, stock: 5, status: 'Últimas unidades' },
    { id: 4, name: 'Pizza 4 Quesos', category: 'Pizzas', price: 16.99, stock: 0, status: 'Agotado' },
    { id: 5, name: 'Refresco 1L', category: 'Bebidas', price: 5.50, stock: 32, status: 'Disponible' },
    { id: 6, name: 'Ensalada César', category: 'Acompañamientos', price: 8.99, stock: 12, status: 'Disponible' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <HeaderAdmin />
      <div className="flex-1 overflow-auto">
        <Topbar title="Gestión de Stock" />
        <main className="p-6">
          <StockTable products={products} setProducts={setProducts} onAddProduct={() => setShowAddProduct(true)} />
          {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} />}
        </main>
      </div>
    </div>
  );
}
