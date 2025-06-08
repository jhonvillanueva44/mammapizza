import { useState, useEffect } from "react";
import { ProductoCardProps } from "@/components/ProductoCard";

type TransformFn = (data: any[]) => ProductoCardProps[];

export default function useFetchProductos(
  endpoint: string,
  transformar: TransformFn
) {
  const [productos, setProductos] = useState<ProductoCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        const productosTransformados = transformar(data);
        setProductos(productosTransformados);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("Error cargando productos");
      }
    }
    fetchData();
  }, [endpoint, transformar]);

  return { productos, error };
}
