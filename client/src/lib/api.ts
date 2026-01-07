/**
 * Serviço de API para consumir as Serverless Functions da Vercel
 * Este arquivo centraliza todas as chamadas às APIs
 */

const API_BASE = typeof window !== 'undefined' ? window.location.origin : '';

// ============= PRODUTOS =============

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  imageUrl?: string;
  category?: string;
  stock: number;
  featured: boolean;
}

export async function fetchProducts(featured?: boolean): Promise<Product[]> {
  try {
    const url = new URL(`${API_BASE}/api/products`);
    if (featured) {
      url.searchParams.append('featured', 'true');
    }

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch products');

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// ============= CHECKOUT =============

export interface CheckoutItem {
  productId: number;
  quantity: number;
  unitPrice: string;
  name: string;
}

export interface CheckoutPayload {
  items: CheckoutItem[];
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  email?: string;
  name?: string;
}

export interface CheckoutResponse {
  success: boolean;
  sessionId: string;
  url: string;
}

export async function createCheckoutSession(
  payload: CheckoutPayload
): Promise<CheckoutResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to create checkout session');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// ============= PIX =============

export interface PixPayload {
  amount: string;
  description?: string;
  orderId?: string;
}

export interface PixResponse {
  success: boolean;
  pixQRCode: string;
  amount: number;
  description: string;
  orderId?: string;
  expiresIn: number;
}

export async function generatePixQRCode(payload: PixPayload): Promise<PixResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/pix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to generate Pix QR Code');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating Pix QR Code:', error);
    throw error;
  }
}

// ============= E-MAIL =============

export interface EmailPayload {
  to: string;
  subject: string;
  template: 'order-confirmation' | 'payment-received' | 'shipping' | 'contact';
  data?: Record<string, any>;
}

export interface EmailResponse {
  success: boolean;
  messageId: string;
  message: string;
}

export async function sendEmail(payload: EmailPayload): Promise<EmailResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to send email');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// ============= FRETE =============

export interface ShippingPayload {
  zipCode: string;
  weight?: number;
  subtotal?: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: string;
  estimatedDays: number;
}

export interface ShippingResponse {
  success: boolean;
  zipCode: string;
  options: ShippingOption[];
}

export async function calculateShipping(
  payload: ShippingPayload
): Promise<ShippingResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/shipping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Failed to calculate shipping');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calculating shipping:', error);
    throw error;
  }
}

// ============= UTILITÁRIOS =============

/**
 * Formata um número como moeda brasileira
 */
export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
}

/**
 * Calcula o total com impostos e frete
 */
export function calculateTotal(
  subtotal: number,
  shippingCost: number,
  taxRate: number = 0.1
): {
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
} {
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingCost;

  return {
    subtotal,
    tax,
    shippingCost,
    total,
  };
}
