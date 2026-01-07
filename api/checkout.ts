import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

interface CheckoutItem {
  productId: number;
  quantity: number;
  unitPrice: string;
  name: string;
}

interface CheckoutPayload {
  items: CheckoutItem[];
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  email?: string;
  name?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apenas POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload: CheckoutPayload = req.body;

    // Validar dados
    if (!payload.items || payload.items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    // Criar line items para Stripe
    const lineItems = payload.items.map(item => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.name,
          metadata: {
            productId: item.productId.toString(),
          },
        },
        unit_amount: Math.round(Number(item.unitPrice) * 100), // Stripe usa centavos
      },
      quantity: item.quantity,
    }));

    // Adicionar frete como line item
    if (Number(payload.shippingCost) > 0) {
      lineItems.push({
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'Frete',
          },
          unit_amount: Math.round(Number(payload.shippingCost) * 100),
        },
        quantity: 1,
      });
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.VERCEL_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VERCEL_URL || 'http://localhost:3000'}/checkout?canceled=true`,
      customer_email: payload.email,
      metadata: {
        subtotal: payload.subtotal,
        tax: payload.tax,
        total: payload.total,
        customer_name: payload.name || 'Customer',
      },
      allow_promotion_codes: true,
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout session',
    });
  }
}
