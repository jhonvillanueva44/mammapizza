'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function Header() {



const pathname = usePathname()
if (pathname.startsWith('/admin')) {
  return null
}


  // ESTAS CONSTANTES SON PARA EL SEARCH
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // ESTAS CONSTANTES SON PARA EL PEDIDO
  const [showCartModal, setShowCartModal] = useState(false)
  const cartRef = useRef<HTMLDivElement>(null)
  const cartButtonRef = useRef<HTMLButtonElement>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const router = useRouter()

  // CARGA EL PEDIDO AL MONTAR
  useEffect(() => {
    const storedCart = sessionStorage.getItem('carrito')
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [showCartModal])

  // SINCRONIZA EL PEDIDO CON SESSION STORAGE
  useEffect(() => {
    const interval = setInterval(() => {
      const storedCart = sessionStorage.getItem('carrito')
      if (storedCart) {
        const parsed = JSON.parse(storedCart)
        if (JSON.stringify(parsed) !== JSON.stringify(cartItems)) {
          setCartItems(parsed)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [cartItems])

  // CERRAR EL MODAL DEL CARRITO AL HACER CLICK FUERA
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target as Node) &&
        !cartButtonRef.current?.contains(event.target as Node)
      ) {
        setShowCartModal(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // MOSTRAR Y OCULTAR EL HEADER AL HACER SCROLL
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

  // MANEJADORES PARA AUMENTAR, DISMINUIR Y ELIMINAR ITEMS DEL CARRITO
  const handleIncrease = (id: number) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    )
    setCartItems(updatedItems)
    sessionStorage.setItem('carrito', JSON.stringify(updatedItems))
  }

  const handleDecrease = (id: number) => {
    let updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
    )
    updatedItems = updatedItems.filter(item => item.cantidad > 0)
    setCartItems(updatedItems)
    sessionStorage.setItem('carrito', JSON.stringify(updatedItems))
  }

  const handleRemove = (id: number) => {
    const updatedItems = cartItems.filter(item => item.id !== id)
    setCartItems(updatedItems)
    sessionStorage.setItem('carrito', JSON.stringify(updatedItems))
  }

  return (
    <header className={`w-full py-2 bg-[#0C1011] text-white font-[var(--font-geist-sans)] fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        {/* SEARCH */}
        <div className="flex items-center gap-4">
          <img src="/images/logo-blanco.png" alt="Logo" className="h-10 w-48 object-cover object-center " />
          <div className="hidden sm:block">
            <input
              type="text"
              placeholder="Buscar..."
              className={`transition-all duration-300 ease-in-out bg-white text-black rounded px-3 py-1 text-sm focus:outline-none ${isSearchFocused ? 'w-60' : 'w-32'}`}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>

        {/* BOTON DE MENU HAMBURGUESA */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* MENÚ DESKTOP */}
        <div className="hidden sm:flex items-center gap-6">
          {/* ENLACES DE NAVEGACION */}
          <nav>
            <ul className="flex gap-4 text-sm sm:text-base">
              <li><Link href="/" className="hover:text-red-500">Inicio</Link></li>
              <li><Link href="/sobrenosotros" className="hover:text-red-500">Sobre Nosotros</Link></li>
              <li><Link href="/menu/pizzas" className="hover:text-red-500">Menu</Link></li>
              <li><Link href="/bebidas" className="hover:text-red-500">Bebidas</Link></li>
            </ul>
          </nav>

          {/* PEDIDO */}
          <div className="relative">
            <button
              ref={cartButtonRef}
              onClick={() => setShowCartModal((prev) => !prev)}
              onMouseEnter={() => setShowCartModal(true)}
              className="relative p-2 text-white hover:text-red-500 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14l1 12H4L5 8zm7-5a3 3 0 00-3 3v1h6V6a3 3 0 00-3-3z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.reduce((sum, item) => sum + item.cantidad, 0)}
              </span>
            </button>

            {/* MODAL DEL CARRITO */}
            {showCartModal && (
              <div
                ref={cartRef}
                onMouseLeave={() => setShowCartModal(false)}
                className="absolute right-0 mt-2 w-90 bg-white text-black rounded shadow-lg p-4 z-50"
              >
                <h3 className="font-bold mb-2">Tu Pedido</h3>
                <div className="max-h-60 overflow-y-auto text-sm">
                  {cartItems.length === 0 ? (
                    <p>Tu pedido está vacío.</p>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b gap-3">
                        <img src={item.imagen} alt={item.titulo} className="w-14 h-14 object-cover rounded" />
                        <div className="flex-1 flex flex-col mr-4">
                          <p
                            className="font-medium overflow-hidden"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineClamp: 2,
                            }}
                          >
                            {item.titulo}
                          </p>
                          <span className="text-sm text-gray-700">${(item.precio * item.cantidad).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDecrease(item.id)}
                            className="px-2 py-0.5 bg-gray-300 rounded text-sm"
                            aria-label={`Disminuir cantidad de ${item.titulo}`}
                          >
                            -
                          </button>
                          <span>{item.cantidad}</span>
                          <button
                            onClick={() => handleIncrease(item.id)}
                            className="px-2 py-0.5 bg-gray-300 rounded text-sm"
                            aria-label={`Aumentar cantidad de ${item.titulo}`}
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-red-600 hover:text-red-800 text-lg font-bold"
                            aria-label={`Eliminar ${item.titulo}`}
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
                    <div className="pt-3 border-t mt-3 text-sm font-bold flex justify-between">
                      <span>Total:</span>
                      <span>
                        ${cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowCartModal(false)
                        router.push('/pedido')
                      }}
                      className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm"
                    >
                      Ver Pedido
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="sm:hidden px-4 pb-4">
          <div className="mb-2">
            <input
              type="text"
              placeholder="Buscar..."
              className={`transition-all duration-300 ease-in-out bg-white text-black rounded px-3 py-1 text-sm w-full focus:outline-none ${isSearchFocused ? 'scale-105' : ''}`}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          <nav className="mb-2">
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/" className="hover:text-red-500">Inicio</Link></li>
              <li><Link href="/sobrenosotros" className="hover:text-red-500">Sobre Nosotros</Link></li>
              <li><Link href="/menu/pizzas" className="hover:text-red-500">Menu</Link></li>
              <li><Link href="/bebidas" className="hover:text-red-500">Bebidas</Link></li>
            </ul>
          </nav>

          {cartItems.length > 0 && (
            <button
              onClick={() => {
                setIsOpen(false)
                router.push('/pedido')
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm"
            >
              Ver Pedido
            </button>
          )}
        </div>
      )}
    </header>
  )
}
