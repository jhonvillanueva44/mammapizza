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

interface Bebida {
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

const BebidaDetailPage = ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const params = use(paramsPromise)
  const router = useRouter()

  const [bebida, setBebida] = useState<Bebida | null>(null)
  const [tamanios, setTamanios] = useState<Tamanio[]>([])
  const [sabores, setSabores] = useState<Sabor[]>([])
  const [tamaniosSabores, setTamaniosSabores] = useState<TamanioSabor[]>([])

  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<string>('')
  const [precioFinal, setPrecioFinal] = useState(0)
  const [saborPrincipalId, setSaborPrincipalId] = useState<string>('')
  const [esFanta, setEsFanta] = useState<boolean>(false)
  const [esChichaOMaracuya, setEsChichaOMaracuya] = useState<boolean>(false)
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
        const [bebidaRes, tamaniosRes, saboresRes, tamaniosSaboresRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/productos/bebidas/${params.id}`),
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/tamanios/bebida`),
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/sabores/bebida`),
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/tamaniosabor`),
        ])

        const bebidaData = await bebidaRes.json()
        const tamaniosData = await tamaniosRes.json()
        const saboresData = await saboresRes.json()
        const tamaniosSaboresData = await tamaniosSaboresRes.json()

        setBebida(bebidaData)
        setTamanios(tamaniosData)
        setSabores(saboresData)
        setTamaniosSabores(tamaniosSaboresData)

        const tamanioId = bebidaData.unicos?.[0]?.tamanios_sabor?.tamanio?.id?.toString() || ''
        const saborId = bebidaData.unicos?.[0]?.tamanios_sabor?.sabor?.id?.toString() || ''
        const precioInicial = bebidaData.unicos?.[0]?.tamanios_sabor?.precio || '0'

        // Verificar si es Fanta
        const esFantaCheck = bebidaData.nombre.toLowerCase().includes('fanta')
        setEsFanta(esFantaCheck)

        // Verificar si es Chicha o Maracuyá
        const nombreBebida = bebidaData.nombre.toLowerCase()
        const esChichaOMaracuyaCheck = nombreBebida.includes('chicha') || nombreBebida.includes('maracuya')
        setEsChichaOMaracuya(esChichaOMaracuyaCheck)

        let tamaniosParaMostrar: Tamanio[] = []
        if (esFantaCheck) {
          // Si es Fanta, mostrar solo el primer tamaño
          tamaniosParaMostrar = tamaniosData.filter((t: Tamanio) => t.id.toString() === tamanioId)
        } else if (esChichaOMaracuyaCheck) {
          // Si es Chicha o Maracuyá, ocultar el último tamaño
          if (tamaniosData.length > 0) {
            tamaniosParaMostrar = tamaniosData.slice(0, -1) // Todos excepto el último
          } else {
            tamaniosParaMostrar = tamaniosData
          }
        } else {
          // Si no es Fanta, Chicha ni Maracuyá, mostrar todos los tamaños
          tamaniosParaMostrar = tamaniosData
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
    if (id === tamanoSeleccionado || esFanta) return
    
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
    // Obtener el carrito actual del sessionStorage
    const existingCart = sessionStorage.getItem('carrito')
    let cart = existingCart ? JSON.parse(existingCart) : []

    // Obtener el nombre del sabor principal
    const nombreSaborPrincipal = sabores.find(s => s.id.toString() === saborPrincipalId)?.nombre || ''

    // Obtener el tamaño seleccionado
    const tamanioSeleccionadoObj = tamaniosDisponibles.find(t => t.id.toString() === tamanoSeleccionado)
    const nombreTamanio = tamanioSeleccionadoObj?.nombre || ''

    // Crear el nuevo ítem del carrito
    const newItem = {
      id: bebida?.id,
      titulo: bebida?.nombre || '',
      imagen: bebida?.imagen || '',
      precio: precioFinal.toFixed(2),
      tamanio: nombreTamanio,
      sabores: nombreSaborPrincipal ? [nombreSaborPrincipal] : [],
      agregados: [], // Lista vacía como solicitado
      itemId: Date.now() + Math.random().toString(36).substring(2, 9) // ID único para este ítem
    }

    // Añadir el nuevo ítem al carrito
    const updatedCart = [...cart, newItem]
    
    // Guardar en sessionStorage
    sessionStorage.setItem('carrito', JSON.stringify(updatedCart))
    
    // Redirigir al carrito
    router.push('/pedido')
  }

  if (!bebida || !tamanios.length || !sabores.length || !tamaniosSabores.length || !tamaniosDisponibles.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando tu bebida refrescante...</p>
        </div>
      </div>
    )
  }

  const nombreSaborPrincipal = sabores.find(s => s.id.toString() === saborPrincipalId)?.nombre || ''

  const tituloProducto = bebida.nombre

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins']">
      {/* Header */}
      <div className="w-full bg-red-600 text-white py-6 px-6 shadow-md mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold tracking-tight">MAMMA PIZZA</h1>
          <p className="mt-2 text-red-100">Personaliza tu bebida al gusto</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Panel Izquierdo - Imagen y Precio */}
          <div className="xl:w-2/5 flex flex-col">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <img
                src={bebida.imagen}
                alt={bebida.nombre}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {tituloProducto}
                </h2>
                
                <div className="bg-red-600 text-white rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium mb-1">PRECIO TOTAL</p>
                  <p className="text-3xl font-bold">S/ {precioFinal.toFixed(2)}</p>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow transition-colors duration-300 hover:scale-105"
                >
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
                <h3 className="text-lg font-bold text-gray-800">Tamaño de Bebida</h3>
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
                            : esFanta
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
                          disabled={esFanta}
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
                            esFanta ? 'text-gray-500' : 'text-gray-700'
                          }`}>
                            {t.nombre}
                          </span>
                          {esFanta && tamanoSeleccionado === t.id.toString() && (
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
                <h3 className="text-lg font-bold text-gray-800">Sabor de Bebida</h3>
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

export default BebidaDetailPage