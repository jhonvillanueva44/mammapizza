'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CartItem {
  id: string
  titulo: string
  precio: number
  imagen: string
  cantidad: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Omit<CartItem, 'cantidad'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (product: Omit<CartItem, 'cantidad'>) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      
      return [...prevItems, { ...product, cantidad: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, cantidad: quantity } : item
      )
    )
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.cantidad, 0)
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}