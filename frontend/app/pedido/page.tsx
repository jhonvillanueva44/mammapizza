'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PedidoPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // CARGAR PEDIDO DESDE SESSION STORAGE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = sessionStorage.getItem('carrito')
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
      setIsMounted(true)
    }
  }, [])

  // GUARDAR LOS CAMBIOS DESPUES DE HABERSE CARGADO EL SESSION STORAGE
  useEffect(() => {
    if (isMounted && cartItems.length > 0) {
      sessionStorage.setItem('carrito', JSON.stringify(cartItems))
    }
  }, [cartItems, isMounted])

  // FUNCIONES PARA MANIPULAR EL PEDIDO
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id)
      return
    }
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, cantidad: newQuantity } : item
    )
    setCartItems(updated)
  }

  const removeFromCart = (id: number) => {
    const filtered = cartItems.filter(item => item.id !== id)
    setCartItems(filtered)
  }

  // TOTAL DEL PEDIDO
  const totalPrice = cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tu Pedido</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Tu pedido está vacío</p>
          <Link href="/menu/pizzas" className="text-red-600 hover:text-red-700 font-medium">
            Ver Menú
          </Link>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b">
                  <div className="flex items-center">
                    <img 
                      src={item.imagen} 
                      alt={item.titulo} 
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div>
                      <h3 className="font-medium">{item.titulo}</h3>
                      <p className="text-gray-600">S/{item.precio.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <button 
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 bg-gray-100">
                      {item.cantidad}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg h-fit">
              <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>S/{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div className="border-t my-4"></div>
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total:</span>
                <span>S/{totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setShowCheckoutModal(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium"
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
