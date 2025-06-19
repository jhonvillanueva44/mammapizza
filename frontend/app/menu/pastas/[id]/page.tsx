'use client'

import React, { useState, useEffect } from 'react'
import { use } from 'react'

// Interfaces para tipar correctamente
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

  const [pasta, setPasta] = useState<Pasta | null>(null)
  const [tamanios, setTamanios] = useState<Tamanio[]>([])
  const [sabores, setSabores] = useState<Sabor[]>([])
  const [tamaniosSabores, setTamaniosSabores] = useState<TamanioSabor[]>([])

  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<string>('')
  const [precioFinal, setPrecioFinal] = useState(0)
  const [saborPrincipalId, setSaborPrincipalId] = useState<string>('')
  const [esLazagna, setEsLazagna] = useState<boolean>(false)
  const [tamaniosDisponibles, setTamaniosDisponibles] = useState<Tamanio[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pastaRes, tamaniosRes, saboresRes, tamaniosSaboresRes] = await Promise.all([
          fetch(`http://localhost:4000/api/productos/pastas/${params.id}`),
          fetch('http://localhost:4000/api/tamanios/pasta'),
          fetch('http://localhost:4000/api/sabores/pasta'),
          fetch('http://localhost:4000/api/tamaniosabor'),
        ])

        const pastaData = await pastaRes.json()
        const tamaniosData = await tamaniosRes.json()
        const saboresData = await saboresRes.json()
        const tamaniosSaboresData = await tamaniosSaboresRes.json()

        setPasta(pastaData)
        setTamanios(tamaniosData)
        setSabores(saboresData)
        setTamaniosSabores(tamaniosSaboresData)

        // Obtener datos principales del producto
        const tamanioId = pastaData.unicos?.[0]?.tamanios_sabor?.tamanio?.id?.toString() || ''
        const saborId = pastaData.unicos?.[0]?.tamanios_sabor?.sabor?.id?.toString() || ''
        const precioInicial = pastaData.unicos?.[0]?.tamanios_sabor?.precio || '0'

        // Buscar el ID del tamaño 'Lazagna'
        const tamanoLazagna = tamaniosData.find((t: Tamanio) => t.nombre.toLowerCase() === 'lazagna')
        const idLazagna = tamanoLazagna?.id?.toString() || ''

        // Verificar si el producto tiene el tamaño Lazagna
        const tieneIdLazagna = tamanioId === idLazagna

        // Determinar tamaños disponibles
        let tamaniosParaMostrar: Tamanio[] = []
        if (tieneIdLazagna) {
          // Si tiene Lazagna, solo mostrar ese tamaño
          tamaniosParaMostrar = tamaniosData.filter((t: Tamanio) => t.id.toString() === idLazagna)
          setEsLazagna(true)
        } else {
          // Si no tiene Lazagna, mostrar todos menos Lazagna
          tamaniosParaMostrar = tamaniosData.filter((t: Tamanio) => t.id.toString() !== idLazagna)
          setEsLazagna(false)
        }

        setTamaniosDisponibles(tamaniosParaMostrar)
        setTamanoSeleccionado(tamanioId)
        setSaborPrincipalId(saborId)
        setPrecioFinal(parseFloat(precioInicial))
        
        // Actualizar precio inicial
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
    // Precio base de la pasta (tamaño + sabor principal)
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

  if (!pasta || !tamanios.length || !sabores.length || !tamaniosSabores.length || !tamaniosDisponibles.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando tu pasta perfecta...</p>
        </div>
      </div>
    )
  }

  // Obtener nombre del sabor principal
  const nombreSaborPrincipal = sabores.find(s => s.id.toString() === saborPrincipalId)?.nombre || ''

  // Determinar el título a mostrar
  const tituloProducto = esLazagna ? pasta.nombre : `Pasta ${nombreSaborPrincipal || pasta.nombre}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 font-[Poppins]">
      {/* Header */}
      <div className="relative w-full bg-gradient-to-r from-red-600 via-red-700 to-orange-600 text-white py-8 px-6 mt-20 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide flex items-center justify-center gap-3">
            <span className="text-4xl">🍝</span>
            Personalizar Pasta
          </h1>
          <p className="text-red-100 mt-2 text-lg">Crea tu pasta perfecta con ingredientes frescos</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Panel Izquierdo - Imagen y Precio */}
          <div className="xl:w-2/5 flex flex-col">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-red-100 sticky top-24">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-orange-200 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <img
                  src={pasta.imagen}
                  alt={pasta.nombre}
                  className="relative w-full max-w-md mx-auto rounded-2xl shadow-xl object-cover border-4 border-white transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="text-center mt-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  {tituloProducto}
                </h2>
                
                <div className="bg-gradient-to-r from-green-500 to-green-500 text-white rounded-2xl p-4 shadow-lg">
                  <p className="text-sm font-medium opacity-90 mb-1">Precio Total</p>
                  <p className="text-3xl sm:text-4xl font-bold">${precioFinal.toFixed(2)}</p>
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                  <span className="text-xl">🛒</span>
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Opciones */}
          <div className="xl:w-3/5 space-y-6">
            {/* Tamaños */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📏</span>
                <h3 className="text-xl font-bold text-gray-800">Tamaño de Pasta</h3>
                {esLazagna && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    Tamaño Fijo
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tamaniosDisponibles.map((t: Tamanio) => (
                  <label 
                    key={t.id} 
                    className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
                      tamanoSeleccionado === t.id.toString()
                        ? 'border-red-500 bg-red-50 shadow-md'
                        : esLazagna
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50 hover:shadow-md'
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
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      tamanoSeleccionado === t.id.toString()
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300 group-hover:border-red-400'
                    }`}>
                      {tamanoSeleccionado === t.id.toString() && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className={`font-medium ${
                      esLazagna ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {t.nombre}
                    </span>
                    {esLazagna && tamanoSeleccionado === t.id.toString() && (
                      <span className="text-xs text-blue-600 font-medium ml-auto">✓ Seleccionado</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Sabores */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🍅</span>
                <h3 className="text-xl font-bold text-gray-800">Sabor de Pasta</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  Sabor Fijo
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <label className="relative flex items-center gap-3 p-4 rounded-xl border-2 border-red-400 bg-red-50 shadow-md">
                  <input
                    type="radio"
                    name="saborPrincipal"
                    checked={true}
                    readOnly
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded-full border-2 border-red-500 bg-red-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">
                      {nombreSaborPrincipal}
                    </span>
                    <span className="block text-xs text-red-600 font-medium">Principal • Obligatorio</span>
                  </div>
                  <span className="text-red-500 text-lg">👑</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PastaDetailPage