import { useEffect, useState } from 'react';
import * as api from '@/lib/api';

/**
 * Hook para buscar produtos
 */
export function useProducts(featured?: boolean) {
  const [products, setProducts] = useState<api.Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.fetchProducts(featured);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [featured]);

  return { products, loading, error };
}

/**
 * Hook para calcular frete
 */
export function useShipping() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = async (zipCode: string, weight?: number, subtotal?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.calculateShipping({
        zipCode,
        weight,
        subtotal,
      });
      return response.options;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao calcular frete';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { calculate, loading, error };
}

/**
 * Hook para criar sessão de checkout
 */
export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async (payload: api.CheckoutPayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.createCheckoutSession(payload);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar sessão de checkout';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createSession, loading, error };
}

/**
 * Hook para gerar QR Code Pix
 */
export function usePix() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQRCode = async (amount: string, description?: string, orderId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.generatePixQRCode({
        amount,
        description,
        orderId,
      });
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao gerar QR Code Pix';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateQRCode, loading, error };
}

/**
 * Hook para enviar e-mails
 */
export function useEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (payload: api.EmailPayload) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.sendEmail(payload);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar e-mail';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error };
}
