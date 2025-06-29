'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) {
    return null
  }

  const [isOpen, setIsOpen] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
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

  // MANEJADORES PARA EL CARRITO
  const handleAddDuplicate = (itemId: string) => {
    const itemToAdd = cartItems.find(item => item.itemId === itemId)
    if (itemToAdd) {
      const newItem = {
        ...itemToAdd,
        itemId: Date.now() + Math.random().toString(36).substring(2, 9)
      }
      const updatedItems = [...cartItems, newItem]
      setCartItems(updatedItems)
      sessionStorage.setItem('carrito', JSON.stringify(updatedItems))
    }
  }

  const handleRemoveOne = (itemId: string) => {
    const itemIndex = cartItems.findIndex(item => item.itemId === itemId)
    if (itemIndex !== -1) {
      const updatedItems = [...cartItems]
      updatedItems.splice(itemIndex, 1)
      setCartItems(updatedItems)
      sessionStorage.setItem('carrito', JSON.stringify(updatedItems))
    }
  }

  const handleRemoveAll = (itemId: string) => {
    const updatedItems = cartItems.filter(item => item.itemId !== itemId)
    setCartItems(updatedItems)
    sessionStorage.setItem('carrito', JSON.stringify(updatedItems))
  }

  // Función para agrupar items similares
  const groupedCartItems = cartItems.reduce((acc, item) => {
    const key = `${item.id}-${item.tamanio}-${JSON.stringify(item.sabores)}-${JSON.stringify(item.agregados)}`
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

  return (
    <header className={`w-full bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white font-['Open_Sans'] fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b border-red-500/20 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
      {/* Línea decorativa */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
      
      {/* Patrón de fondo */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.3) 1px, transparent 1px)`,
        backgroundSize: '30px 30px'
      }}></div>

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20 relative z-10">
        {/* LOGO */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group cursor-pointer transition-all duration-300 hover:scale-105">
            <img 
              src="/images/logo-blanco.png" 
              alt="Logo" 
              className="h-12 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-lg group-hover:brightness-110" 
            />
          </Link>
        </div>

        {/* BOTÓN DE MENÚ HAMBURGUESA (MOBILE) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative p-3 text-white focus:outline-none group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <svg className="w-6 h-6 relative z-10 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* MENÚ DESKTOP */}
        <div className="hidden md:flex items-center gap-8">
          {/* ENLACES DE NAVEGACIÓN */}
          <nav>
            <ul className="flex gap-8 text-sm lg:text-base font-medium">
              <li>
                <Link href="/" className="relative group py-2 px-1 transition-all duration-300 hover:text-red-400">
                  Inicio
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link href="/sobrenosotros" className="relative group py-2 px-1 transition-all duration-300 hover:text-red-400">
                  Sobre Nosotros
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link href="/menu/pizzas" className="relative group py-2 px-1 transition-all duration-300 hover:text-red-400">
                  Menú
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link href="/bebidas" className="relative group py-2 px-1 transition-all duration-300 hover:text-red-400">
                  Bebidas
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* ICONO DEL CARRITO */}
          <div className="relative">
            <button
              ref={cartButtonRef}
              onClick={() => setShowCartModal((prev) => !prev)}
              onMouseEnter={() => setShowCartModal(true)}
              className="relative p-3 text-white hover:text-red-400 focus:outline-none group transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14l1 12H4L5 8zm7-5a3 3 0 00-3 3v1h6V6a3 3 0 00-3-3z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* MODAL DEL CARRITO - DISEÑO MEJORADO */}
            {showCartModal && (
              <div
                ref={cartRef}
                onMouseLeave={() => setShowCartModal(false)}
                className="absolute right-0 mt-4 w-96 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl shadow-2xl border border-red-500/20 backdrop-blur-md z-50 overflow-hidden"
              >
                {/* Encabezado del modal */}
                <div className="bg-gradient-to-r from-red-600/20 to-red-700/20 p-4 border-b border-red-500/20">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg font-['Playfair_Display'] text-red-200">Tu Pedido</h3>
                    <span className="text-xs bg-red-500/20 text-red-200 px-2 py-1 rounded-full">
                      {Object.keys(groupedCartItems).length} {Object.keys(groupedCartItems).length === 1 ? 'ítem' : 'ítems'}
                    </span>
                  </div>
                </div>
                
                {/* Contenido del carrito */}
                <div className="p-4">
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="text-gray-400">Tu pedido está vacío</p>
                      </div>
                    ) : (
                      Object.values(groupedCartItems).map((group: any) => (
                        <div key={group.itemId} className="mb-3 last:mb-0 pb-3 border-b border-gray-700/50 last:border-0">
                          <div className="flex gap-3">
                            {/* Imagen del producto */}
                            <div className="relative">
                              <img 
                                src={group.imagen} 
                                alt={group.titulo} 
                                className="w-16 h-16 object-cover rounded-lg shadow-md flex-shrink-0 border border-gray-600/30" 
                              />
                              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {group.count}
                              </span>
                            </div>
                            
                            {/* Detalles del producto */}
                            <div className="flex-1 min-w-0">
                              {/* Nombre y precio */}
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-medium text-white truncate">
                                  {group.titulo}
                                </h4>
                                <span className="text-red-400 font-semibold whitespace-nowrap">
                                  S/ {(parseFloat(group.precio) * group.count).toFixed(2)}
                                </span>
                              </div>
                              
                              {/* Precio unitario */}
                              <p className="text-xs text-gray-400 mt-0.5">
                                S/ {parseFloat(group.precio).toFixed(2)} c/u
                              </p>

                              {/* Tamaño y variantes */}
                              <div className="mt-1.5">
                                {group.tamanio && (
                                  <span className="inline-block text-xs bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded-full mr-1 mb-1">
                                    {group.tamanio}
                                  </span>
                                )}
                                {group.sabores?.map((sabor: string, i: number) => (
                                  <span key={i} className="inline-block text-xs bg-red-900/30 text-red-200 px-2 py-0.5 rounded-full mr-1 mb-1">
                                    {sabor}
                                  </span>
                                ))}
                                {group.agregados?.map((extra: string, i: number) => (
                                  <span key={i} className="inline-block text-xs bg-amber-900/30 text-amber-200 px-2 py-0.5 rounded-full mr-1 mb-1">
                                    +{extra}
                                  </span>
                                ))}
                              </div>

                              {/* Controles de cantidad */}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1 bg-gray-700/50 rounded-full p-0.5">
                                  <button
                                    onClick={() => handleRemoveOne(group.items[0].itemId)}
                                    className="w-6 h-6 bg-gray-600 hover:bg-red-600 rounded-full text-xs transition-all duration-300 flex items-center justify-center"
                                    aria-label="Quitar uno"
                                  >
                                    -
                                  </button>
                                  <button
                                    onClick={() => handleAddDuplicate(group.items[0].itemId)}
                                    className="w-6 h-6 bg-gray-600 hover:bg-red-600 rounded-full text-xs transition-all duration-300 flex items-center justify-center"
                                    aria-label="Añadir otro"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleRemoveAll(group.items[0].itemId)}
                                  className="text-xs text-red-400 hover:text-white hover:bg-red-500/20 px-2 py-1 rounded transition-all duration-300"
                                  aria-label="Eliminar todos"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Resumen y botón de pago */}
                  {cartItems.length > 0 && (
                    <>
                      <div className="pt-4 border-t border-red-500/20 mt-2">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span className="text-red-200">Total:</span>
                          <span className="text-red-400">
                            S/ {cartItems.reduce((total, item) => total + parseFloat(item.precio), 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowCartModal(false)
                          router.push('/pedido')
                        }}
                        className="mt-4 cursor-pointer w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14l1 12H4L5 8zm7-5a3 3 0 00-3 3v1h6V6a3 3 0 00-3-3z" />
                        </svg>
                        Ver Pedido Completo
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-md border-t border-red-500/20">
          <div className="px-6 py-4">
            {/* Enlaces móvil */}
            <nav className="mb-4">
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="block py-3 px-4 hover:bg-red-500/20 rounded-lg transition-all duration-300 hover:text-red-400">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/sobrenosotros" className="block py-3 px-4 hover:bg-red-500/20 rounded-lg transition-all duration-300 hover:text-red-400">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/menu/pizzas" className="block py-3 px-4 hover:bg-red-500/20 rounded-lg transition-all duration-300 hover:text-red-400">
                    Menú
                  </Link>
                </li>
                <li>
                  <Link href="/bebidas" className="block py-3 px-4 hover:bg-red-500/20 rounded-lg transition-all duration-300 hover:text-red-400">
                    Bebidas
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Botón de pedido móvil */}
            {cartItems.length > 0 && (
              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push('/pedido')
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14l1 12H4L5 8zm7-5a3 3 0 00-3 3v1h6V6a3 3 0 00-3-3z" />
                </svg>
                Ver Pedido ({cartItems.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Estilos personalizados para la barra de desplazamiento */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(239, 68, 68, 0.5) transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(239, 68, 68, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(239, 68, 68, 0.7);
        }
      `}</style>
    </header>
  )
}