'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCart } from './CartContext'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showCartPreview, setShowCartPreview] = useState(false)
  const { cartItems, totalItems, removeFromCart, updateQuantity } = useCart()
  const router = useRouter()
  
  // Referencias para el modal y el botón del carrito
  const cartButtonRef = useRef<HTMLButtonElement>(null)
  const cartModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setShowHeader(false)
      } else {
        setShowHeader(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Efecto para manejar el hover y clicks fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartModalRef.current && 
        cartButtonRef.current &&
        !cartModalRef.current.contains(event.target as Node) &&
        !cartButtonRef.current.contains(event.target as Node)
      ) {
        setShowCartPreview(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCartClick = () => {
    router.push('/carrito')
  }

  const toggleCartPreview = () => {
    setShowCartPreview(!showCartPreview)
  }

  return (
    <header
      className={`w-full py-2 bg-[#0C1011] text-white font-[var(--font-geist-sans)] fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        showHeader ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-4">
          <img
            src="/images/logo-blanco.png"
            alt="Logo"
            className="h-10 w-48 object-cover object-center"
          />

          <div className="hidden sm:block">
            <input
              type="text"
              placeholder="Buscar..."
              className={`transition-all duration-300 ease-in-out bg-white text-black rounded px-3 py-1 text-sm focus:outline-none ${
                isSearchFocused ? 'w-60' : 'w-32'
              }`}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <div className="hidden sm:flex items-center gap-6">
          <nav>
            <ul className="flex gap-4 text-sm sm:text-base">
              <li><Link href="/" className="hover:text-red-500">Inicio</Link></li>
              <li><Link href="/sobrenosotros" className="hover:text-red-500">Sobre Nosotros</Link></li>
              <li><Link href="/menu/pizzas" className="hover:text-red-500">Menu</Link></li>
              <li><Link href="/desayunos" className="hover:text-red-500">Desayunos</Link></li>
              <li><Link href="/bebidas" className="hover:text-red-500">Bebidas</Link></li>
            </ul>
          </nav>
          
          

            {/* Botón de bolsa/carrito con preview */}
      <div className="relative">
        <button 
          ref={cartButtonRef}
          onClick={toggleCartPreview}
          onMouseEnter={() => setShowCartPreview(true)}
          className="relative p-2 text-white hover:text-red-500 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        </button>

        {/* Preview del carrito */}
        {showCartPreview && (
          <div 
            ref={cartModalRef}
            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg z-50 text-black p-4"
            onMouseEnter={() => setShowCartPreview(true)}
            onMouseLeave={() => setShowCartPreview(false)}
          >
            <h3 className="font-bold mb-2">Tu Carrito ({totalItems})</h3>
            <div className="max-h-60 overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className="text-sm py-2">Tu carrito está vacío</p>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center">
                      <img 
                        src={item.imagen} 
                        alt={item.titulo} 
                        className="w-10 h-10 object-cover rounded mr-2"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.titulo}</p>
                        <p className="text-xs">${item.precio.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          updateQuantity(item.id, item.cantidad - 1)
                        }}
                        className="text-xs px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="text-xs px-2 py-1 bg-gray-100">
                        {item.cantidad}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          updateQuantity(item.id, item.cantidad + 1)
                        }}
                        className="text-xs px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFromCart(item.id)
                        }}
                        className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cartItems.length > 0 && (
              <>
                <div className="flex justify-between font-bold mt-3 pt-2 border-t">
                  <span>Total:</span>
                  <span>${cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0).toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => {
                    setShowCartPreview(false)
                    router.push('/carrito')
                  }}
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm"
                >
                  Ver Carrito
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden px-4 pb-4">
          <div className="mb-2">
            <input
              type="text"
              placeholder="Buscar..."
              className={`transition-all duration-300 ease-in-out bg-white text-black rounded px-3 py-1 text-sm w-full focus:outline-none ${
                isSearchFocused ? 'scale-105' : ''
              }`}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          <nav className="mb-2">
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/" className="hover:text-red-500">Inicio</Link></li>
              <li><Link href="/sobrenosotros" className="hover:text-red-500">Sobre Nosotros</Link></li>
              <li><Link href="/menu/pizzas" className="hover:text-red-500">Menu</Link></li>
              <li><Link href="/desayunos" className="hover:text-red-500">Desayunos</Link></li>
              <li><Link href="/bebidas" className="hover:text-red-500">Bebidas</Link></li>
            </ul>
          </nav>
          <button 
            onClick={() => router.push('/carrito')}
            className="flex items-center gap-2 p-2 text-white hover:text-red-500 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>Carrito ({totalItems})</span>
          </button>
        </div>
      )}
    </header>
  )
}