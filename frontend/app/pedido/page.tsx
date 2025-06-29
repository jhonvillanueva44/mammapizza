'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'

export default function PedidoPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [deliveryOption, setDeliveryOption] = useState<'recoger' | 'delivery'>('recoger')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [customerName, setCustomerName] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = sessionStorage.getItem('carrito')
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      sessionStorage.setItem('carrito', JSON.stringify(cartItems))
    }
  }, [cartItems, isMounted])

  const handleAddDuplicate = (itemId: string) => {
    const itemToAdd = cartItems.find(item => item.itemId === itemId)
    if (itemToAdd) {
      const newItem = {
        ...itemToAdd,
        itemId: Date.now() + Math.random().toString(36).substring(2, 9)
      }
      const updatedItems = [...cartItems, newItem]
      setCartItems(updatedItems)
    }
  }

  const handleRemoveOne = (itemId: string) => {
    const itemIndex = cartItems.findIndex(item => item.itemId === itemId)
    if (itemIndex !== -1) {
      const updatedItems = [...cartItems]
      updatedItems.splice(itemIndex, 1)
      setCartItems(updatedItems)
    }
  }

  const handleRemoveAll = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.itemId !== itemId)
    setCartItems(updatedItems)
  }

  const groupedCartItems = cartItems.reduce((acc, item) => {
    const key = `${item.id}-${item.tamanio}-${JSON.stringify(item.sabores)}-${JSON.stringify(item.agregados)}-${JSON.stringify(item.productos)}`
    if (!acc[key]) {
      acc[key] = {
        ...item,
        count: 1,
        items: [item]
      }
    } else {
      acc[key].count += 1
      acc[key].items.push(item)
    }
    return acc
  }, {})

  const subtotal = cartItems.reduce((total, item) => total + parseFloat(item.precio), 0)
  const totalPrice = subtotal

  const generateWhatsAppMessage = () => {
    let message = `Hola MammaPizza, quiero realizar el siguiente pedido:\n\n`
    
    message += `*Nombre:* ${customerName}\n\n`
    
    Object.values(groupedCartItems).forEach((group: any) => {
      message += `*${group.titulo}* (${group.count}x)\n`
      
      const sizeLabel = group.titulo.toLowerCase().includes('pasta') || 
                        group.titulo.toLowerCase().includes('lagsana') ? 
                        'Tipo' : 'Tamaño'
      
      if (group.tamanio) {
        message += `- ${sizeLabel}: ${group.tamanio}\n`
      }
      
      if (group.sabores?.length > 0) {
        message += `- Sabores: ${group.sabores.join(', ')}\n`
      }
      if (group.agregados?.length > 0) {
        message += `- Extras: ${group.agregados.join(', ')}\n`
      }

      if (group.productos?.length > 0) {
        message += `- Incluye:\n`
        group.productos.forEach((prod: Record<number, [string, number]>) => {
          const [id, [nombre, cantidad]] = Object.entries(prod)[0]
          message += `  • ${nombre} (${cantidad}x)\n`
        })
      }

      message += `- Subtotal: S/ ${(parseFloat(group.precio) * group.count).toFixed(2)}\n\n`
    })

    message += `*Método de entrega:* ${deliveryOption === 'delivery' ? 'Delivery' : 'Recoger en local'}\n`
    if (deliveryOption === 'delivery' && deliveryAddress) {
      message += `*Dirección:* ${deliveryAddress}\n`
    }

    message += `\n*Resumen de pago:*\n`
    message += `- Subtotal: S/ ${subtotal.toFixed(2)}\n`
    message += `*Total a pagar: S/ ${totalPrice.toFixed(2)}*\n\n`
    message += `Por favor confirmen mi pedido. ¡Gracias!`

    return encodeURIComponent(message)
  }

  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`
  const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}&text=${generateWhatsAppMessage()}`

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (!customerName || (deliveryOption === 'delivery' && !deliveryAddress)) {
      return
    }

    // Generar mensaje antes de limpiar el carrito
    const message = generateWhatsAppMessage()
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    
    // Limpiar el carrito primero
    sessionStorage.removeItem('carrito')
    setCartItems([])

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    
    if (isMobile) {
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
    } else {
      const newWindow = window.open(`https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`, '_blank')
      
      setTimeout(() => {
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          if (confirm('¿No tienes WhatsApp Web abierto? ¿Deseas abrir WhatsApp en tu aplicación de escritorio?')) {
            window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
          }
        }
      }, 1000)
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando tu pedido...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">Detalles de tu Pedido</h1>
        <Link 
          href="/menu/pizzas" 
          className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Seguir comprando
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-xl font-medium text-gray-700 mb-2">Tu pedido está vacío</h2>
          <p className="text-gray-500 mb-6">Añade algunos productos para comenzar tu pedido</p>
          <Link 
            href="/menu/pizzas" 
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
          >
            Explorar Menú
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {Object.values(groupedCartItems).map((group: any) => (
              <div key={group.itemId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={group.imagen} 
                        alt={group.titulo} 
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        {group.count}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {group.titulo}
                        </h3>
                        <span className="text-lg font-bold text-red-600 whitespace-nowrap">
                          S/ {(parseFloat(group.precio) * group.count).toFixed(2)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">Precio unitario:</span> S/ {parseFloat(group.precio).toFixed(2)}
                      </p>

                      <div className="mt-3 space-y-2">
                        {group.tamanio && (
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 w-20">
                              {group.titulo.toLowerCase().includes('pasta') || 
                               group.titulo.toLowerCase().includes('lasaña') ? 
                               'Tipo:' : 'Tamaño:'}
                            </span>
                            <span className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                              {group.tamanio}
                            </span>
                          </div>
                        )}

                        {group.sabores?.length > 0 && (
                          <div className="flex items-start">
                            <span className="text-sm font-medium text-gray-700 w-20">Sabores:</span>
                            <div className="flex flex-wrap gap-2">
                              {group.sabores.map((sabor: string, i: number) => (
                                <span key={i} className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">
                                  {sabor}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {group.agregados?.length > 0 && (
                          <div className="flex items-start">
                            <span className="text-sm font-medium text-gray-700 w-20">Extras:</span>
                            <div className="flex flex-wrap gap-2">
                              {group.agregados.map((extra: string, i: number) => (
                                <span key={i} className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                                  +{extra}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {group.productos?.length > 0 && (
                          <div className="flex items-start">
                            <span className="text-sm font-medium text-gray-700 w-20">Incluye:</span>
                            <div className="flex flex-col gap-1">
                              {group.productos.map((prod: Record<number, [string, number]>, i: number) => {
                                const [id, [nombre, cantidad]] = Object.entries(prod)[0]
                                return (
                                  <span key={i} className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                    {nombre} ({cantidad}x)
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                          <button
                            onClick={() => handleRemoveOne(group.items[0].itemId)}
                            className="w-8 cursor-pointer h-8 bg-white hover:bg-red-50 rounded-full text-red-600 transition-all duration-300 flex items-center justify-center shadow-sm"
                            aria-label="Quitar uno"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <span className="w-8 text-center font-medium">{group.count}</span>
                          <button
                            onClick={() => handleAddDuplicate(group.items[0].itemId)}
                            className="w-8 h-8 cursor-pointer bg-white hover:bg-red-50 rounded-full text-red-600 transition-all duration-300 flex items-center justify-center shadow-sm"
                            aria-label="Añadir otro"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveAll(group.items[0].itemId)}
                          className="text-sm cursor-pointer text-red-600 hover:text-red-800 font-medium flex items-center gap-1 transition-colors duration-300"
                          aria-label="Eliminar todos"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
              <div className="p-5 sm:p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>
                
                <div className="mb-4">
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}):</span>
                    <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Método de entrega:</h3>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors">
                        <input
                          type="radio"
                          name="deliveryOption"
                          checked={deliveryOption === 'recoger'}
                          onChange={() => setDeliveryOption('recoger')}
                          className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">Recoger en local</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors">
                        <input
                          type="radio"
                          name="deliveryOption"
                          checked={deliveryOption === 'delivery'}
                          onChange={() => setDeliveryOption('delivery')}
                          className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">Delivery</span>
                      </label>
                    </div>

                    {deliveryOption === 'delivery' && (
                      <div className="mt-3">
                        <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección de entrega *
                        </label>
                        <input
                          type="text"
                          id="deliveryAddress"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                          placeholder="Ingresa tu dirección completa"
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-xl font-bold text-red-600">S/ {totalPrice.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleWhatsAppClick}
                  disabled={!customerName || (deliveryOption === 'delivery' && !deliveryAddress)}
                  className={`w-full cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-green-500/20 ${
                    !customerName || (deliveryOption === 'delivery' && !deliveryAddress)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <FaWhatsapp className="text-xl" />
                  Proceder con el Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}