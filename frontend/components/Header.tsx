'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full py-2 bg-[#5E3527] text-white font-[var(--font-geist-sans)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
        
        <div className="flex items-center">
          <img
            src="/images/logo-blanco.png"
            alt="Logo"
            className="h-10 w-48 object-cover object-center"
          />
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
              <li><Link href="/" className="hover:underline">Inicio</Link></li>
              <li><Link href="/sobrenosotros" className="hover:underline">Sobre Nosotros</Link></li>
              <li><Link href="/menu" className="hover:underline">Menu</Link></li>
              <li><Link href="/desayunos" className="hover:underline">Desayunos</Link></li>
              <li><Link href="/bebidas" className="hover:underline">Bebidas</Link></li>
            </ul>
          </nav>

          {/*<div className="flex gap-2">
            <Link
              href="/ingresar"
              className="px-3 py-1 text-sm border rounded hover:bg-white hover:text-black transition"
            >
              Ingresar
            </Link>
            <Link
              href="/registrar"
              className="px-3 py-1 text-sm bg-white text-black rounded hover:bg-gray-300 transition"
            >
              Registrarse
            </Link>
          </div>*/}
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden px-4 pb-4">
          <nav className="mb-2">
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/" className="hover:underline">Inicio</Link></li>
              <li><Link href="/sobrenosotros" className="hover:underline">Sobre Nosotros</Link></li>
              <li><Link href="/menu" className="hover:underline">Menu</Link></li>
              <li><Link href="/desayunos" className="hover:underline">Desayunos</Link></li>
              <li><Link href="/bebidas" className="hover:underline">Bebidas</Link></li>
            </ul>
          </nav>

          {/*<div className="flex flex-col gap-2">
            <Link
              href="/ingresar"
              className="px-3 py-1 text-sm border rounded hover:bg-white hover:text-black transition text-center"
            >
              Ingresar
            </Link>
            <Link
              href="/registrar"
              className="px-3 py-1 text-sm bg-white text-black rounded hover:bg-gray-300 transition text-center"
            >
              Registrarse
            </Link>
          </div>*/}
        </div>
      )}
    </header>
  )
}
