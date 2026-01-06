import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'Assinatura do Stripe ausente' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Erro na verificação do webhook:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Processar eventos
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Pagamento concluído:', session.id);
      
      // Aqui você pode:
      // 1. Atualizar o status do pedido no banco de dados
      // 2. Enviar e-mail de confirmação
      // 3. Notificar o fornecedor
      
      break;
      
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent bem-sucedido:', paymentIntent.id);
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('Pagamento falhou:', failedPayment.id);
      break;
      
    default:
      console.log(`Evento não tratado: ${event.type}`);
  }

  return res.status(200).json({ received: true });
}
