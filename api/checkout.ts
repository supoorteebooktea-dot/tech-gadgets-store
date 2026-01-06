import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { items, customerEmail } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Carrinho vazio' });
    }

    // Criar line items para o Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe usa centavos
      },
      quantity: item.quantity || 1,
    }));

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
      customer_email: customerEmail,
      metadata: {
        orderItems: JSON.stringify(items.map((i: any) => ({ id: i.id, qty: i.quantity }))),
      },
    });

    return res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error: any) {
    console.error('Erro no checkout:', error);
    return res.status(500).json({ error: error.message || 'Erro ao processar checkout' });
  }
}
