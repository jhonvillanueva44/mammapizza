'use client'

import React, { useState, useEffect } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'

interface Tamanio {
  id: number
  nombre: string
}

interface Sabor {
  id: number
  nombre: string
}

interface TamanioSabor {
  id: number
  tamanio_id: number
  sabor_id: number
  precio: string
}

interface Pasta {
  id: number
  nombre: string
  imagen: string
  unicos?: Array<{
    tamanios_sabor: {
      tamanio: { id: number }
      sabor: { id: number }
      precio: string
    }
  }>
}

const PastaDetailPage = ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const params = use(paramsPromise)
  const router = useRouter()

  const [pasta, setPasta] = useState<Pasta | null>(null)
  const [tamanios, setTamanios] = useState<Tamanio[]>([])
  const [sabores, setSabores] = useState<Sabor[]>([])
  const [tamaniosSabores, setTamaniosSabores] = useState<TamanioSabor[]>([])

  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<string>('')
  const [precioFinal, setPrecioFinal] = useState(0)
  const [saborPrincipalId, setSaborPrincipalId] = useState<string>('')
  const [esLazagna, setEsLazagna] = useState<boolean>(false)
  const [tamaniosDisponibles, setTamaniosDisponibles] = useState<Tamanio[]>([])

  const [openSections, setOpenSections] = useState({
    tamanio: true,
    sabor: true
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pastaRes, tamaniosRes, saboresRes, tamaniosSaboresRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/productos/pastas/${params.id}`),
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/tamanios/pasta`),
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/sabores/pasta`),
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/tamaniosabor`),
        ])

        const pastaData = await pastaRes.json()
        const tamaniosData = await tamaniosRes.json()
        const saboresData = await saboresRes.json()
        const tamaniosSaboresData = await tamaniosSaboresRes.json()

        setPasta(pastaData)
        setTamanios(tamaniosData)
        setSabores(saboresData)
        setTamaniosSabores(tamaniosSaboresData)

        const tamanioId = pastaData.unicos?.[0]?.tamanios_sabor?.tamanio?.id?.toString() || ''
        const saborId = pastaData.unicos?.[0]?.tamanios_sabor?.sabor?.id?.toString() || ''
        const precioInicial = pastaData.unicos?.[0]?.tamanios_sabor?.precio || '0'

        const tamanoLagsana = tamaniosData.find((t: Tamanio) => t.nombre.toLowerCase() === 'lagsana')
        const idLagsana = tamanoLagsana?.id?.toString() || ''

        const tieneIdLagsana = tamanioId === idLagsana

        let tamaniosParaMostrar: Tamanio[] = []
        if (tieneIdLagsana) {
          tamaniosParaMostrar = tamaniosData.filter((t: Tamanio) => t.id.toString() === idLagsana)
          setEsLazagna(true)
        } else {
          tamaniosParaMostrar = tamaniosData.filter((t: Tamanio) => t.id.toString() !== idLagsana)
          setEsLazagna(false)
        }

        setTamaniosDisponibles(tamaniosParaMostrar)
        setTamanoSeleccionado(tamanioId)
        setSaborPrincipalId(saborId)
        setPrecioFinal(parseFloat(precioInicial))
        
        actualizarPrecio(tamanioId, saborId, tamaniosSaboresData)
      } catch (error) {
        console.error('Error al cargar los datos:', error)
      }
    }

    fetchData()
  }, [params.id])

  const onChangeTamano = (id: string) => {
    if (id === tamanoSeleccionado || esLazagna) return
    
    setTamanoSeleccionado(id)
    actualizarPrecio(id, saborPrincipalId, tamaniosSabores)
  }

  const actualizarPrecio = (
    tamanoId: string,
    saborId: string,
    tamaniosSaboresData: TamanioSabor[]
  ) => {
    const combPrincipal = tamaniosSaboresData.find(
      (ts: TamanioSabor) =>
        ts.tamanio_id.toString() === tamanoId &&
        ts.sabor_id.toString() === saborId
    )
    const precioBase = combPrincipal ? parseFloat(combPrincipal.precio) : 0

    if (precioBase > 0) {
      setPrecioFinal(precioBase)
    }
  }

  const handleAddToCart = () => {
    const existingCart = sessionStorage.getItem('carrito')
    let cart = existingCart ? JSON.parse(existingCart) : []

    const nombreSaborPrincipal = sabores.find(s => s.id.toString() === saborPrincipalId)?.nombre || ''

    const tamanioSeleccionadoObj = tamaniosDisponibles.find(t => t.id.toString() === tamanoSeleccionado)
    const nombreTamanio = tamanioSeleccionadoObj?.nombre || ''

    const newItem = {
      id: pasta?.id,
      titulo: pasta?.nombre || '',
      imagen: pasta?.imagen || '',
      precio: precioFinal.toFixed(2),
      tamanio: nombreTamanio,
      sabores: nombreSaborPrincipal ? [nombreSaborPrincipal] : [],
      agregados: [],
      itemId: Date.now() + Math.random().toString(36).substring(2, 9),
      productos: []
    }

    const updatedCart = [...cart, newItem]
    
    sessionStorage.setItem('carrito', JSON.stringify(updatedCart))
    
    router.push('/pedido')
  }

  if (!pasta || !tamanios.length || !sabores.length || !tamaniosSabores.length || !tamaniosDisponibles.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando tu pasta perfecta...</p>
        </div>
      </div>
    )
  }

  const nombreSaborPrincipal = sabores.find(s => s.id.toString() === saborPrincipalId)?.nombre || ''

  const tituloProducto = esLazagna ? pasta.nombre : `Pasta ${nombreSaborPrincipal || pasta.nombre}`

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins']">
      {/* Header */}
      <div className="w-full bg-red-600 text-white py-6 px-6 shadow-md mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold tracking-tight">MAMMA PIZZA</h1>
          <p className="mt-2 text-red-100">Personaliza tu pasta al gusto</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Panel Izquierdo - Imagen y Precio */}
          <div className="xl:w-2/5 flex flex-col">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <img
                src={pasta.imagen}
                alt={pasta.nombre}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {tituloProducto}
                </h2>
                
                <div className="bg-green-600 text-white rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium mb-1">PRECIO TOTAL</p>
                  <p className="text-3xl font-bold">S/ {precioFinal.toFixed(2)}</p>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-colors duration-300 hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Añadir al Pedido
                </button>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Opciones */}
          <div className="xl:w-3/5 space-y-4">
            {/* Tamaños */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <button 
                onClick={() => toggleSection('tamanio')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-gray-800">Tipo de Pasta</h3>
                <span className="text-gray-500">
                  {openSections.tamanio ? '−' : '+'}
                </span>
              </button>
              
              {openSections.tamanio && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {tamaniosDisponibles.map((t: Tamanio) => (
                      <label 
                        key={t.id} 
                        className={`relative flex items-center gap-2 p-3 rounded-lg border transition-all ${
                          tamanoSeleccionado === t.id.toString()
                            ? 'border-red-500 bg-red-50'
                            : esLazagna
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="tamano"
                          value={t.id}
                          checked={tamanoSeleccionado === t.id.toString()}
                          onChange={() => onChangeTamano(t.id.toString())}
                          disabled={esLazagna}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          tamanoSeleccionado === t.id.toString()
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        }`}>
                          {tamanoSeleccionado === t.id.toString() && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className={`text-sm ${
                            esLazagna ? 'text-gray-500' : 'text-gray-700'
                          }`}>
                            {t.nombre}
                          </span>
                          {esLazagna && tamanoSeleccionado === t.id.toString() && (
                            <span className="block text-xs text-blue-600 font-medium">✓ Seleccionado</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sabores */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <button 
                onClick={() => toggleSection('sabor')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-gray-800">Sabor de Pasta</h3>
                <span className="text-gray-500">
                  {openSections.sabor ? '−' : '+'}
                </span>
              </button>
              
              {openSections.sabor && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 gap-2">
                    <label 
                      className={`relative flex items-center gap-2 p-3 rounded-lg border transition-all border-red-400 bg-red-50`}
                    >
                      <input
                        type="radio"
                        name="saborPrincipal"
                        checked={true}
                        readOnly
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center border-red-500 bg-red-500`}>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm text-gray-700">
                          {nombreSaborPrincipal}
                        </span>
                        <span className="block text-xs text-red-600 font-semibold">Sabor principal (no se puede cambiar)</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PastaDetailPage