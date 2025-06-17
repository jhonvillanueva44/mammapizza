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
    return <div>Cargando...</div>
  }

  const saboresEspeciales = sabores.filter(s => s.especial === true)
  const saboresClasicos = sabores.filter(s => !s.especial)

  // Obtener nombres de sabores para mostrar
  const nombresSabores = sabores
    .filter(s => saboresPrincipalesIds.includes(s.id.toString()))
    .map(s => s.nombre)
    .join(', ')

  return (
    <div className="font-[Poppins]">
      <div className="w-full bg-red-600 text-white py-4 px-6 mt-20 shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide">🍕 Personalizar Pizza</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-4 sm:p-6">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <img
            src={pizza.imagen}
            alt={pizza.nombre}
            className="w-full max-w-sm rounded-xl shadow-xl object-cover"
          />
          <h2 className="mt-5 text-3xl font-bold text-center text-[#333]">
            Pizza {nombresSabores || pizza.nombre}
          </h2>
          <p className="text-2xl font-bold text-red-600 mt-4">${precioFinal.toFixed(2)}</p>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-6 bg-[#FDFDFD] p-4 rounded-xl border-2 border-red-500 shadow-sm">
          <div>
            <h3 className="text-md font-semibold mb-2 text-gray-800">Tamaño:</h3>
            <div className="flex flex-col gap-2">
              {tamanios.map((t) => (
                <label key={t.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${esCombinacion ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'} border-gray-200`}>
                  <input
                    type="radio"
                    name="tamano"
                    value={t.id}
                    checked={tamanoSeleccionado === t.id.toString()}
                    onChange={() => onChangeTamano(t.id.toString())}
                    disabled={esCombinacion}
                    className="accent-red-600 w-4 h-4"
                  />
                  <span className={`text-sm ${esCombinacion ? 'text-gray-500' : 'text-gray-700'}`}>
                    {t.nombre}
                    {esCombinacion && tamanoSeleccionado === t.id.toString() && (
                      <span className="text-xs text-gray-500 ml-1">(Seleccionado)</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2 text-gray-800">Sabores Clásicos:</h3>
            <div className="flex flex-col gap-2">
              {saboresClasicos.map((s) => {
                const sid = s.id.toString()
                const checked = saboresPrincipalesIds.includes(sid)
                const esPrincipal = sid === saborPrincipalId
                const esRegular = esTamanioRegular(tamanoSeleccionado)
                const disabled = esCombinacion || 
                  (esPrincipal ? true : // Deshabilitar la interacción para el sabor principal (solo lectura)
                    (esRegular || (saboresPrincipalesIds.length >= 2 && !checked)))

                return (
                  <label key={sid} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${esPrincipal ? 'border-red-300 bg-red-50' : esCombinacion ? 'bg-gray-100' : 'bg-white'} border-gray-200`}>
                    <input
                      type={esPrincipal ? 'radio' : 'checkbox'}
                      name="sabor"
                      value={sid}
                      checked={checked}
                      onChange={() => onChangeSabor(sid)}
                      disabled={disabled}
                      className={`accent-red-600 w-4 h-4 ${esPrincipal ? 'cursor-default' : ''}`}
                    />
                    <span className={`text-sm ${disabled && !esPrincipal ? 'text-gray-400' : 'text-gray-700'}`}>
                      {s.nombre}
                      {esPrincipal && <span className="text-xs text-gray-500 ml-1">(Principal - Obligatorio)</span>}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2 text-gray-800">Sabores Especiales:</h3>
            <div className="flex flex-col gap-2">
              {saboresEspeciales.map((s) => {
                const sid = s.id.toString()
                const checked = saboresPrincipalesIds.includes(sid)
                const esPrincipal = sid === saborPrincipalId
                const esRegular = esTamanioRegular(tamanoSeleccionado)
                const disabled = esCombinacion || 
                  (esPrincipal ? true : // Deshabilitar la interacción para el sabor principal (solo lectura)
                    (esRegular || (saboresPrincipalesIds.length >= 2 && !checked)))

                return (
                  <label key={sid} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${esPrincipal ? 'border-red-300 bg-red-50' : esCombinacion ? 'bg-gray-100' : 'bg-white'} border-gray-200`}>
                    <input
                      type={esPrincipal ? 'radio' : 'checkbox'}
                      name="sabor"
                      value={sid}
                      checked={checked}
                      onChange={() => onChangeSabor(sid)}
                      disabled={disabled}
                      className={`accent-red-600 w-4 h-4 ${esPrincipal ? 'cursor-default' : ''}`}
                    />
                    <span className={`text-sm ${disabled && !esPrincipal ? 'text-gray-400' : 'text-gray-700'}`}>
                      {s.nombre}
                      {esPrincipal && <span className="text-xs text-gray-500 ml-1">(Principal - Obligatorio)</span>}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2 text-gray-800">Tamaño de Agregados:</h3>
            <div className="flex flex-col gap-2">
              {tamaniosAgregados.map((t) => (
                <label key={t.id} className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="tamanoAgregado"
                    value={t.id}
                    checked={tamanoAgregadoSeleccionado === t.id.toString()}
                    onChange={() => onChangeTamanoAgregado(t.id.toString())}
                    className="accent-red-600 w-4 h-4"
                  />
                  <span className="text-gray-700 text-sm">{t.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2 text-gray-800">Agregados:</h3>
            <div className="flex flex-col gap-2">
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
                  <label key={aid} className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      name="agregado"
                      value={aid}
                      checked={checked}
                      onChange={() => onChangeAgregado(aid)}
                      className="accent-red-600 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{a.nombre} (+${precioAgregado})</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PizzaDetailPage