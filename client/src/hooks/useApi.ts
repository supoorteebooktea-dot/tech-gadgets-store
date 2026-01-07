import { useEffect, useState } from 'react';
import * as api from '@/lib/api';

export function useProducts(featured?: boolean, id?: number) {
  const [products, setProducts] = useState<api.Product[]>([]);
  const [product, setProduct] = useState<api.Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (id) {
          const data = await api.fetchProducts();
          const found = data.find(p => p.id === id);
          setProduct(found || null);
        } else {
          const data = await api.fetchProducts(featured);
          setProducts(data);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [featured, id]);

  return { products, product, loading, error };
}

export function useShipping() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (zipCode: string, weight?: number, subtotal?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.calculateShipping({ zipCode, weight, subtotal });
      return response.options;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao calcular frete');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { calculate, loading, error };
}
