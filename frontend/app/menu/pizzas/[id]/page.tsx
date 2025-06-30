'use client'

import React, { useState, useEffect } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'

const PizzaDetailPage = ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const params = use(paramsPromise)
  const router = useRouter()

  const [pizza, setPizza] = useState<any>(null)
  const [tamanios, setTamanios] = useState<any[]>([])
  const [sabores, setSabores] = useState<any[]>([])
  const [agregados, setAgregados] = useState<any[]>([])
  const [tamaniosAgregados, setTamaniosAgregados] = useState<any[]>([])
  const [tamaniosSabores, setTamaniosSabores] = useState<any[]>([])

  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<string>('1')
  const [saboresPrincipalesIds, setSaboresPrincipalesIds] = useState<string[]>([])
  const [agregadosSeleccionados, setAgregadosSeleccionados] = useState<string[]>([])
  const [precioFinal, setPrecioFinal] = useState(0)
  const [esCombinacion, setEsCombinacion] = useState(false)
  const [saborPrincipalId, setSaborPrincipalId] = useState<string>('')

  const [openSections, setOpenSections] = useState({
    tamanio: true,
    saboresClasicos: false,
    saboresEspeciales: false,
    agregados: false
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
        const [pizzaRes, tamaniosRes, saboresRes, agregadosRes, tamaniosAgregadosRes, tamaniosSaboresRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/productos/pizzas/${params.id}`),
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/tamanios/pizza`),
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/sabores/pizza`),
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/sabores/agregado`),
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/tamanios/agregado`),
          fetch(`${process.env.NEXT_PUBLIC_BACK_HOST}api/tamaniosabor`),
        ])

        const pizzaData = await pizzaRes.json()
        const tamaniosData = await tamaniosRes.json()
        const saboresData = await saboresRes.json()
        const agregadosData = await agregadosRes.json()
        const tamaniosAgregadosData = await tamaniosAgregadosRes.json()
        const tamaniosSaboresData = await tamaniosSaboresRes.json()

        setPizza(pizzaData)
        setTamanios(tamaniosData)
        setSabores(saboresData)
        setAgregados(agregadosData)
        setTamaniosAgregados(tamaniosAgregadosData)
        setTamaniosSabores(tamaniosSaboresData)

        const tieneCombinaciones = pizzaData.combinaciones?.length > 0
        setEsCombinacion(tieneCombinaciones)

        if (tieneCombinaciones) {
          const tamanioId = pizzaData.combinaciones[0]?.tamanio_sabor?.tamanio?.id?.toString() || '1'
          const saboresIds = pizzaData.combinaciones.map((c: any) => 
            c.tamanio_sabor?.sabor?.id?.toString()
          ).filter(Boolean)
          const precioInicial = pizzaData.precio || '0'

          setTamanoSeleccionado(tamanioId)
          setSaboresPrincipalesIds(saboresIds)
          setPrecioFinal(parseFloat(precioInicial))
          actualizarPrecio(tamanioId, saboresIds, [])
        } else {
          const tamanioId = pizzaData.unicos?.[0]?.tamanios_sabor?.tamanio?.id?.toString() || '1'
          const saborId = pizzaData.unicos?.[0]?.tamanios_sabor?.sabor?.id?.toString() || '1'
          const precioInicial = pizzaData.unicos?.[0]?.tamanios_sabor?.precio || '0'

          setTamanoSeleccionado(tamanioId)
          setSaborPrincipalId(saborId)
          setSaboresPrincipalesIds([saborId])
          setPrecioFinal(parseFloat(precioInicial))
          actualizarPrecio(tamanioId, [saborId], [])
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error)
      }
    }

    fetchData()
  }, [params.id])

  const esTamanioRegular = (tamanioId: string) => {
    return tamanioId === '1' || tamanioId === '2'
  }

  const onChangeTamano = (id: string) => {
    if (id === tamanoSeleccionado || esCombinacion) return
    
    const nuevosSabores = esTamanioRegular(id) 
      ? [saborPrincipalId] 
      : saboresPrincipalesIds.includes(saborPrincipalId) 
        ? [...saboresPrincipalesIds] 
        : [saborPrincipalId, ...saboresPrincipalesIds.filter(id => id !== saborPrincipalId).slice(0, 1)]
    
    setTamanoSeleccionado(id)
    setSaboresPrincipalesIds(nuevosSabores)
    actualizarPrecio(id, nuevosSabores, agregadosSeleccionados)
  }

  const onChangeSabor = (id: string) => {
    if (esCombinacion) return
    
    if (id === saborPrincipalId) return
    
    const yaSeleccionado = saboresPrincipalesIds.includes(id)
    let nuevosSabores = [...saboresPrincipalesIds]

    if (yaSeleccionado) {
      nuevosSabores = nuevosSabores.filter(s => s !== id)
    } else {
      if (!esTamanioRegular(tamanoSeleccionado) && nuevosSabores.length < 2) {
        nuevosSabores.push(id)
      }
    }

    setSaboresPrincipalesIds(nuevosSabores)
    actualizarPrecio(tamanoSeleccionado, nuevosSabores, agregadosSeleccionados)
  }

  const onChangeAgregado = (id: string) => {
    let nuevosAgregados = [...agregadosSeleccionados]
    if (nuevosAgregados.includes(id)) {
      nuevosAgregados = nuevosAgregados.filter(a => a !== id)
    } else {
      nuevosAgregados.push(id)
    }
    setAgregadosSeleccionados(nuevosAgregados)
    actualizarPrecio(tamanoSeleccionado, saboresPrincipalesIds, nuevosAgregados)
  }

  const actualizarPrecio = (
    tamanoId: string,
    saboresIds: string[],
    agregadosIds: string[]
  ) => {
    let precioSabores = 0

    if (esCombinacion) {
      precioSabores = pizza ? parseFloat(pizza.precio) : 0
    } else {
      if (saboresIds.length === 1) {
        const comb = tamaniosSabores.find(
          (ts: any) =>
            ts.tamanio_id.toString() === tamanoId &&
            ts.sabor_id.toString() === saboresIds[0]
        )
        precioSabores = comb ? parseFloat(comb.precio) : 0
      } else if (saboresIds.length === 2) {
        const precios = saboresIds.map((sid) => {
          const comb = tamaniosSabores.find(
            (ts: any) => ts.tamanio_id.toString() === tamanoId && ts.sabor_id.toString() === sid
          )
          return comb ? parseFloat(comb.precio) : 0
        })
        precioSabores = Math.max(...precios)
      }
    }

    const indiceTamanoPizza = tamanios.findIndex(t => t.id.toString() === tamanoId)
    
    const tamanoAgregadoCorrespondiente = tamaniosAgregados[indiceTamanoPizza]
    const tamanoAgregadoId = tamanoAgregadoCorrespondiente?.id?.toString() || ''

    const precioAgregados = agregadosIds.reduce((acc, aid) => {
      const combAgregado = tamaniosSabores.find(
        (ts: any) =>
          ts.tamanio_id.toString() === tamanoAgregadoId &&
          ts.sabor_id.toString() === aid
      )
      return acc + (combAgregado ? parseFloat(combAgregado.precio) : 0)
    }, 0)

    const nuevoPrecio = precioSabores + precioAgregados
    if (nuevoPrecio > 0) {
      setPrecioFinal(nuevoPrecio)
    }
  }

  const handleAddToCart = () => {
    const existingCart = sessionStorage.getItem('carrito')
    let cart = existingCart ? JSON.parse(existingCart) : []

    const nombresSabores = sabores
      .filter(s => saboresPrincipalesIds.includes(s.id.toString()))
      .map(s => s.nombre)

    const nombresAgregados = agregados
      .filter(a => agregadosSeleccionados.includes(a.id.toString()))
      .map(a => a.nombre)

    const tamanioSeleccionadoObj = tamanios.find(t => t.id.toString() === tamanoSeleccionado)
    const nombreTamanio = tamanioSeleccionadoObj?.nombre || ''

    const newItem = {
      id: pizza.id,
      titulo: pizza.nombre,
      imagen: pizza.imagen,
      precio: precioFinal.toFixed(2),
      tamanio: nombreTamanio,
      sabores: nombresSabores,
      agregados: nombresAgregados,
      itemId: Date.now() + Math.random().toString(36).substring(2, 9),
      productos: []
    }

    const updatedCart = [...cart, newItem]
    
    sessionStorage.setItem('carrito', JSON.stringify(updatedCart))
    
    router.push('/pedido')
  }

  if (!pizza || !tamanios.length || !sabores.length || !tamaniosSabores.length || !tamaniosAgregados.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando tu pizza perfecta...</p>
        </div>
      </div>
    )
  }

  const saboresEspeciales = sabores.filter(s => s.especial === true)
  const saboresClasicos = sabores.filter(s => !s.especial)

  const nombresSabores = sabores
    .filter(s => saboresPrincipalesIds.includes(s.id.toString()))
    .map(s => s.nombre)
    .join(', ')

  const indiceTamanoPizza = tamanios.findIndex(t => t.id.toString() === tamanoSeleccionado)
  const tamanoAgregadoCorrespondiente = tamaniosAgregados[indiceTamanoPizza]
  const tamanoAgregadoId = tamanoAgregadoCorrespondiente?.id?.toString() || ''
  
  const agregadosDisponibles = agregados.filter(a => {
    return tamaniosSabores.some(
      (ts: any) =>
        ts.tamanio_id.toString() === tamanoAgregadoId &&
        ts.sabor_id.toString() === a.id.toString()
    )
  })

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins']">
      {/* Header */}
      <div className="w-full bg-red-600 text-white py-6 px-6 shadow-md mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold tracking-tight">MAMMA PIZZA</h1>
          <p className="mt-2 text-red-100">Personaliza tu pizza al gusto</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Panel Izquierdo - Imagen y Precio */}
          <div className="xl:w-2/5 flex flex-col">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <img
                src={pizza.imagen}
                alt={pizza.nombre}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {nombresSabores || pizza.nombre}
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
                <h3 className="text-lg font-bold text-gray-800">Tamaño de Pizza</h3>
                <span className="text-gray-500">
                  {openSections.tamanio ? '−' : '+'}
                </span>
              </button>
              
              {openSections.tamanio && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {tamanios.map((t) => (
                      <label 
                        key={t.id} 
                        className={`relative flex items-center gap-2 p-3 rounded-lg border transition-all ${
                          tamanoSeleccionado === t.id.toString()
                            ? 'border-red-500 bg-red-50'
                            : esCombinacion
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
                          disabled={esCombinacion}
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
                        <span className={`text-sm ${
                          esCombinacion ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {t.nombre}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sabores Clásicos */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <button 
                onClick={() => toggleSection('saboresClasicos')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-gray-800">Sabores Clásicos</h3>
                <span className="text-gray-500">
                  {openSections.saboresClasicos ? '−' : '+'}
                </span>
              </button>
              
              {openSections.saboresClasicos && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {saboresClasicos.map((s) => {
                      const sid = s.id.toString()
                      const checked = saboresPrincipalesIds.includes(sid)
                      const esPrincipal = sid === saborPrincipalId
                      const esRegular = esTamanioRegular(tamanoSeleccionado)
                      const disabled = esCombinacion || 
                        (esPrincipal ? true : 
                          (esRegular || (saboresPrincipalesIds.length >= 2 && !checked)))

                      return (
                        <label 
                          key={sid} 
                          className={`relative flex items-center gap-2 p-3 rounded-lg border transition-all ${
                            esPrincipal 
                              ? 'border-red-400 bg-red-50'
                              : checked
                              ? 'border-green-400 bg-green-50'
                              : disabled
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                              : 'border-gray-200 hover:border-red-200 hover:bg-red-50'
                          }`}
                        >
                          <input
                            type={esPrincipal ? 'radio' : 'checkbox'}
                            name="sabor"
                            value={sid}
                            checked={checked}
                            onChange={() => onChangeSabor(sid)}
                            disabled={disabled}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 ${esPrincipal ? 'rounded-full' : 'rounded'} border-2 flex items-center justify-center ${
                            checked
                              ? esPrincipal
                                ? 'border-red-500 bg-red-500'
                                : 'border-green-500 bg-green-500'
                              : disabled && !esPrincipal
                              ? 'border-gray-300 bg-gray-100'
                              : 'border-gray-300'
                          }`}>
                            {checked && (
                              <div className={`${esPrincipal ? 'w-1.5 h-1.5 bg-white rounded-full' : 'text-white text-xs'}`}>
                                {!esPrincipal && '✓'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={`text-sm ${
                              disabled && !esPrincipal ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                              {s.nombre}
                            </span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sabores Especiales */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <button 
                onClick={() => toggleSection('saboresEspeciales')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-gray-800">Sabores Especiales</h3>
                <span className="text-gray-500">
                  {openSections.saboresEspeciales ? '−' : '+'}
                </span>
              </button>
              
              {openSections.saboresEspeciales && (
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {saboresEspeciales.map((s) => {
                      const sid = s.id.toString()
                      const checked = saboresPrincipalesIds.includes(sid)
                      const esPrincipal = sid === saborPrincipalId
                      const esRegular = esTamanioRegular(tamanoSeleccionado)
                      const disabled = esCombinacion || 
                        (esPrincipal ? true : 
                          (esRegular || (saboresPrincipalesIds.length >= 2 && !checked)))

                      return (
                        <label 
                          key={sid} 
                          className={`relative flex items-center gap-2 p-3 rounded-lg border transition-all ${
                            esPrincipal 
                              ? 'border-orange-400 bg-orange-50'
                              : checked
                              ? 'border-green-400 bg-green-50'
                              : disabled
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                              : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                          }`}
                        >
                          <input
                            type={esPrincipal ? 'radio' : 'checkbox'}
                            name="sabor"
                            value={sid}
                            checked={checked}
                            onChange={() => onChangeSabor(sid)}
                            disabled={disabled}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 ${esPrincipal ? 'rounded-full' : 'rounded'} border-2 flex items-center justify-center ${
                            checked
                              ? esPrincipal
                                ? 'border-orange-500 bg-orange-500'
                                : 'border-green-500 bg-green-500'
                              : disabled && !esPrincipal
                              ? 'border-gray-300 bg-gray-100'
                              : 'border-gray-300'
                          }`}>
                            {checked && (
                              <div className={`${esPrincipal ? 'w-1.5 h-1.5 bg-white rounded-full' : 'text-white text-xs'}`}>
                                {!esPrincipal && '✓'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={`text-sm ${
                              disabled && !esPrincipal ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                              {s.nombre}
                            </span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Agregados */}
            {agregadosDisponibles.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <button 
                  onClick={() => toggleSection('agregados')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-bold text-gray-800">Agregados Extra</h3>
                  <span className="text-gray-500">
                    {openSections.agregados ? '−' : '+'}
                  </span>
                </button>
                
                {openSections.agregados && (
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {agregadosDisponibles.map((a) => {
                        const aid = a.id.toString()
                        const checked = agregadosSeleccionados.includes(aid)
                        const combAgregado = tamaniosSabores.find(
                          (ts: any) =>
                            ts.tamanio_id.toString() === tamanoAgregadoId &&
                            ts.sabor_id.toString() === aid
                        )
                        const precioAgregado = combAgregado ? parseFloat(combAgregado.precio).toFixed(2) : '0.00'

                        return (
                          <label 
                            key={aid} 
                            className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                              checked
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              name="agregado"
                              value={aid}
                              checked={checked}
                              onChange={() => onChangeAgregado(aid)}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              checked
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300'
                            }`}>
                              {checked && <span className="text-white text-xs">✓</span>}
                            </div>
                            <div className="flex-1">
                              <span className="text-sm text-gray-700">{a.nombre}</span>
                              <span className="block text-xs text-green-600 font-semibold">+S/ {precioAgregado}</span>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PizzaDetailPage