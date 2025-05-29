'use client'

import { useState } from 'react'
import { FaPizzaSlice, FaMotorcycle, FaWhatsapp } from 'react-icons/fa'
import { useCart } from './CartContext'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cartItems, totalPrice } = useCart()
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup')
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    reference: ''
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos obligatorios
    if (!formData.name || (deliveryMethod === 'delivery' && !formData.address)) {
      alert('Por favor complete los campos obligatorios')
      return
    }

    // Crear mensaje para WhatsApp
    let message = `*Nuevo Pedido*%0A%0A`
    message += `*Cliente:* ${formData.name}%0A`
    message += `*Método de entrega:* ${deliveryMethod === 'pickup' ? 'Recojo en tienda' : 'Delivery a domicilio'}%0A`
    
    if (deliveryMethod === 'delivery') {
      message += `*Dirección:* ${formData.address}%0A`
      if (formData.reference) {
        message += `*Referencia:* ${formData.reference}%0A`
      }
    }
    
    message += `%0A*Pedido:*%0A`
    cartItems.forEach(item => {
      message += `- ${item.titulo} (x${item.cantidad}) - S/${item.precio.toFixed(2)}%0A`
    })
    
    message += `%0A*Total:* S/${totalPrice.toFixed(2)}`
    
    // Abrir WhatsApp
    window.open(`https://wa.me/51929302775?text=${message}`, '_blank')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Confirmar Pedido</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Campo Nombre */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nombre completo *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          {/* Método de entrega */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Método de entrega *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                  deliveryMethod === 'pickup' 
                    ? 'border-red-500 bg-red-50 text-red-600' 
                    : 'border-gray-300 hover:border-red-300'
                }`}
              >
                <FaPizzaSlice className="text-2xl mb-2" />
                <span>Recojo en tienda</span>
              </button>
              
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`p-4 border rounded-lg flex flex-col items-center transition-all ${
                  deliveryMethod === 'delivery' 
                    ? 'border-red-500 bg-red-50 text-red-600' 
                    : 'border-gray-300 hover:border-red-300'
                }`}
              >
                <FaMotorcycle className="text-2xl mb-2" />
                <span>Delivery a casa</span>
              </button>
            </div>
          </div>

          {/* Campos de dirección (solo para delivery) */}
          {deliveryMethod === 'delivery' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Dirección *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Referencia</label>
                <textarea
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Resumen del pedido */}
          <div className="border-t pt-4 mb-6">
            <h3 className="font-bold mb-2">Resumen del Pedido</h3>
            <div className="max-h-40 overflow-y-auto mb-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between py-1">
                  <span>{item.titulo} x{item.cantidad}</span>
                  <span>S/{item.precio.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total:</span>
              <span>S/{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <FaWhatsapp />
              Hacer pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}