//pizza
'use client'

import React, { useState, useEffect } from 'react'
import { use } from 'react'

const PizzaDetailPage = ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const params = use(paramsPromise)

  const [pizza, setPizza] = useState<any>(null)
  const [tamanios, setTamanios] = useState<any[]>([])
  const [sabores, setSabores] = useState<any[]>([])
  const [agregados, setAgregados] = useState<any[]>([])
  const [tamaniosAgregados, setTamaniosAgregados] = useState<any[]>([])
  const [tamaniosSabores, setTamaniosSabores] = useState<any[]>([])

  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<string>('1')
  const [tamanoAgregadoSeleccionado, setTamanoAgregadoSeleccionado] = useState<string>('11')
  const [saboresPrincipalesIds, setSaboresPrincipalesIds] = useState<string[]>([])
  const [agregadosSeleccionados, setAgregadosSeleccionados] = useState<string[]>([])
  const [precioFinal, setPrecioFinal] = useState(0)
  const [esCombinacion, setEsCombinacion] = useState(false)
  const [saborPrincipalId, setSaborPrincipalId] = useState<string>('') // Nuevo estado para el sabor principal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pizzaRes, tamaniosRes, saboresRes, agregadosRes, tamaniosAgregadosRes, tamaniosSaboresRes] = await Promise.all([
          fetch(`http://localhost:4000/api/productos/pizzas/${params.id}`),
          fetch('http://localhost:4000/api/tamanios/pizza'),
          fetch('http://localhost:4000/api/sabores/pizza'),
          fetch('http://localhost:4000/api/sabores/agregado'),
          fetch('http://localhost:4000/api/tamanios/agregado'),
          fetch('http://localhost:4000/api/tamaniosabor'),
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

        // Determinar si es combinación
        const tieneCombinaciones = pizzaData.combinaciones?.length > 0
        setEsCombinacion(tieneCombinaciones)

        if (tieneCombinaciones) {
          // Para combinaciones: obtener ambos sabores principales y el tamaño
          const tamanioId = pizzaData.combinaciones[0]?.tamanio_sabor?.tamanio?.id?.toString() || '1'
          const saboresIds = pizzaData.combinaciones.map((c: any) => 
            c.tamanio_sabor?.sabor?.id?.toString()
          ).filter(Boolean)
          const precioInicial = pizzaData.precio || '0'

          setTamanoSeleccionado(tamanioId)
          setSaboresPrincipalesIds(saboresIds)
          setPrecioFinal(parseFloat(precioInicial))
          actualizarPrecio(tamanioId, saboresIds, [], '11')
        } else {
          // Para unicos: mantener lógica original
          const tamanioId = pizzaData.unicos?.[0]?.tamanios_sabor?.tamanio?.id?.toString() || '1'
          const saborId = pizzaData.unicos?.[0]?.tamanios_sabor?.sabor?.id?.toString() || '1'
          const precioInicial = pizzaData.unicos?.[0]?.tamanios_sabor?.precio || '0'

          setTamanoSeleccionado(tamanioId)
          setSaborPrincipalId(saborId) // Establecer el sabor principal
          setSaboresPrincipalesIds([saborId])
          setPrecioFinal(parseFloat(precioInicial))
          actualizarPrecio(tamanioId, [saborId], [], '11')
        }
      } catch (error) {
        console.error('Error al cargar los datos:', error)
      }
    }

    fetchData()
  }, [params.id])

  const esTamanioRegular = (tamanioId: string) => {
    return tamanioId === '1'
  }

  const onChangeTamano = (id: string) => {
    if (id === tamanoSeleccionado || esCombinacion) return
    
    // Al cambiar el tamaño, mantener el sabor principal y ajustar el secundario si es necesario
    const nuevosSabores = esTamanioRegular(id) 
      ? [saborPrincipalId] 
      : saboresPrincipalesIds.includes(saborPrincipalId) 
        ? [...saboresPrincipalesIds] 
        : [saborPrincipalId, ...saboresPrincipalesIds.filter(id => id !== saborPrincipalId).slice(0, 1)]
    
    setTamanoSeleccionado(id)
    setSaboresPrincipalesIds(nuevosSabores)
    actualizarPrecio(id, nuevosSabores, agregadosSeleccionados, tamanoAgregadoSeleccionado)
  }

  const onChangeTamanoAgregado = (id: string) => {
    setTamanoAgregadoSeleccionado(id)
    actualizarPrecio(tamanoSeleccionado, saboresPrincipalesIds, agregadosSeleccionados, id)
  }

  const onChangeSabor = (id: string) => {
    if (esCombinacion) return // No permitir cambios en sabores para combinaciones
    
    // Si es el sabor principal, no hacer nada (no se puede deseleccionar)
    if (id === saborPrincipalId) return
    
    const yaSeleccionado = saboresPrincipalesIds.includes(id)
    let nuevosSabores = [...saboresPrincipalesIds]

    if (yaSeleccionado) {
      // Quitar el sabor secundario
      nuevosSabores = nuevosSabores.filter(s => s !== id)
    } else {
      // Agregar un nuevo sabor solo si no es regular y no hay más de 1 sabor adicional
      if (!esTamanioRegular(tamanoSeleccionado) && nuevosSabores.length < 2) {
        nuevosSabores.push(id)
      }
    }

    setSaboresPrincipalesIds(nuevosSabores)
    actualizarPrecio(tamanoSeleccionado, nuevosSabores, agregadosSeleccionados, tamanoAgregadoSeleccionado)
  }

  const onChangeAgregado = (id: string) => {
    let nuevosAgregados = [...agregadosSeleccionados]
    if (nuevosAgregados.includes(id)) {
      nuevosAgregados = nuevosAgregados.filter(a => a !== id)
    } else {
      nuevosAgregados.push(id)
    }
    setAgregadosSeleccionados(nuevosAgregados)
    actualizarPrecio(tamanoSeleccionado, saboresPrincipalesIds, nuevosAgregados, tamanoAgregadoSeleccionado)
  }

  const actualizarPrecio = (
    tamanoId: string,
    saboresIds: string[],
    agregadosIds: string[],
    tamanoAgregadoId: string
  ) => {
    let precioSabores = 0

    if (esCombinacion) {
      // Para combinaciones, usar el precio directamente del producto
      precioSabores = pizza ? parseFloat(pizza.precio) : 0
    } else {
      // Lógica original para unicos
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

  if (!pizza || !tamanios.length || !sabores.length || !tamaniosSabores.length || !tamaniosAgregados.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Cargando tu pizza perfecta...</p>
        </div>
      </div>
    )
  }

  const saboresEspeciales = sabores.filter(s => s.especial === true)
  const saboresClasicos = sabores.filter(s => !s.especial)

  // Obtener nombres de sabores para mostrar
  const nombresSabores = sabores
    .filter(s => saboresPrincipalesIds.includes(s.id.toString()))
    .map(s => s.nombre)
    .join(', ')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 font-[Poppins]">
      {/* Header */}
      <div className="relative w-full bg-gradient-to-r from-red-600 via-red-700 to-orange-600 text-white py-8 px-6 mt-20 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide flex items-center gap-3">
            <span className="text-4xl">🍕</span>
            Personalizar Pizza
          </h1>
          <p className="text-red-100 mt-2 text-lg">Crea tu pizza perfecta con ingredientes frescos</p>
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
                  src={pizza.imagen}
                  alt={pizza.nombre}
                  className="relative w-full max-w-md mx-auto rounded-2xl shadow-xl object-cover border-4 border-white transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="text-center mt-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Pizza {nombresSabores || pizza.nombre}
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
                <h3 className="text-xl font-bold text-gray-800">Tamaño de Pizza</h3>
                {esCombinacion && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    Combinación Fija
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tamanios.map((t) => (
                  <label 
                    key={t.id} 
                    className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
                      tamanoSeleccionado === t.id.toString()
                        ? 'border-red-500 bg-red-50 shadow-md'
                        : esCombinacion
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
                      disabled={esCombinacion}
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
                      esCombinacion ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {t.nombre}
                    </span>
                    {esCombinacion && tamanoSeleccionado === t.id.toString() && (
                      <span className="text-xs text-blue-600 font-medium ml-auto">✓ Seleccionado</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Sabores Clásicos */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🍅</span>
                <h3 className="text-xl font-bold text-gray-800">Sabores Clásicos</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        esPrincipal 
                          ? 'border-red-400 bg-red-50 shadow-md'
                          : checked
                          ? 'border-green-400 bg-green-50 shadow-md cursor-pointer'
                          : disabled
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          : 'border-gray-200 bg-white hover:border-red-200 hover:bg-red-50 cursor-pointer'
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
                      <div className={`w-5 h-5 rounded ${esPrincipal ? 'rounded-full' : 'rounded-md'} border-2 flex items-center justify-center ${
                        checked
                          ? esPrincipal
                            ? 'border-red-500 bg-red-500'
                            : 'border-green-500 bg-green-500'
                          : disabled && !esPrincipal
                          ? 'border-gray-300 bg-gray-100'
                          : 'border-gray-300'
                      }`}>
                        {checked && (
                          <div className={`${esPrincipal ? 'w-2 h-2 bg-white rounded-full' : 'text-white text-xs'}`}>
                            {!esPrincipal && '✓'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`font-medium ${
                          disabled && !esPrincipal ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          {s.nombre}
                        </span>
                        {esPrincipal && (
                          <span className="block text-xs text-red-600 font-medium">Principal • Obligatorio</span>
                        )}
                      </div>
                      {esPrincipal && <span className="text-red-500 text-lg">👑</span>}
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Sabores Especiales */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⭐</span>
                <h3 className="text-xl font-bold text-gray-800">Sabores Especiales</h3>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                  PREMIUM
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        esPrincipal 
                          ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-md'
                          : checked
                          ? 'border-green-400 bg-green-50 shadow-md cursor-pointer'
                          : disabled
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                          : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 cursor-pointer'
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
                      <div className={`w-5 h-5 rounded ${esPrincipal ? 'rounded-full' : 'rounded-md'} border-2 flex items-center justify-center ${
                        checked
                          ? esPrincipal
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-green-500 bg-green-500'
                          : disabled && !esPrincipal
                          ? 'border-gray-300 bg-gray-100'
                          : 'border-gray-300'
                      }`}>
                        {checked && (
                          <div className={`${esPrincipal ? 'w-2 h-2 bg-white rounded-full' : 'text-white text-xs'}`}>
                            {!esPrincipal && '✓'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`font-medium ${
                          disabled && !esPrincipal ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          {s.nombre}
                        </span>
                        {esPrincipal && (
                          <span className="block text-xs text-orange-600 font-medium">Principal • Obligatorio</span>
                        )}
                      </div>
                      {esPrincipal && <span className="text-orange-500 text-lg">👑</span>}
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Tamaño de Agregados */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📐</span>
                <h3 className="text-xl font-bold text-gray-800">Tamaño de Agregados</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {tamaniosAgregados.map((t) => (
                  <label 
                    key={t.id} 
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      tamanoAgregadoSeleccionado === t.id.toString()
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tamanoAgregado"
                      value={t.id}
                      checked={tamanoAgregadoSeleccionado === t.id.toString()}
                      onChange={() => onChangeTamanoAgregado(t.id.toString())}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      tamanoAgregadoSeleccionado === t.id.toString()
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {tamanoAgregadoSeleccionado === t.id.toString() && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-700 font-medium">{t.nombre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Agregados */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-red-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🧀</span>
                <h3 className="text-xl font-bold text-gray-800">Agregados Extra</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  Opcional
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agregados.map((a) => {
                  const aid = a.id.toString()
                  const checked = agregadosSeleccionados.includes(aid)
                  const combAgregado = tamaniosSabores.find(
                    (ts: any) =>
                      ts.tamanio_id.toString() === tamanoAgregadoSeleccionado &&
                      ts.sabor_id.toString() === aid
                  )
                  const precioAgregado = combAgregado ? parseFloat(combAgregado.precio).toFixed(2) : '0.00'

                  return (
                    <label 
                      key={aid} 
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        checked
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
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
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                        checked
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {checked && <span className="text-white text-xs">✓</span>}
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-700 font-medium">{a.nombre}</span>
                        <span className="block text-sm text-green-600 font-semibold">+${precioAgregado}</span>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PizzaDetailPage