'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // Bajando: ocultar header
        setShowHeader(false)
      } else {
        // Subiendo: mostrar header
        setShowHeader(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

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
              <li><Link href="/menu" className="hover:text-red-500">Menu</Link></li>
              <li><Link href="/desayunos" className="hover:text-red-500">Desayunos</Link></li>
              <li><Link href="/bebidas" className="hover:text-red-500">Bebidas</Link></li>
            </ul>
          </nav>
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
              <li><Link href="/menu" className="hover:text-red-500">Menu</Link></li>
              <li><Link href="/desayunos" className="hover:text-red-500">Desayunos</Link></li>
              <li><Link href="/bebidas" className="hover:text-red-500">Bebidas</Link></li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
