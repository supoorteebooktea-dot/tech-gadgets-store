import { VercelRequest, VercelResponse } from '@vercel/node';

interface PixPayload {
  amount: string;
  description?: string;
  orderId?: string;
}

/**
 * Gera um QR Code Pix para pagamento
 * Em produção, isso integraria com um provedor de Pix como Braspag, Vindi, etc.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apenas POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload: PixPayload = req.body;

    // Validar dados
    if (!payload.amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const amount = Number(payload.amount);
    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Gerar chave Pix simulada (em produção, viria do provedor)
    // Formato: 00020126580014br.gov.bcb.pix...
    const pixKey = generatePixQRCode(amount, payload.description || 'Compra na Tech Gadgets Store');

    res.status(200).json({
      success: true,
      pixQRCode: pixKey,
      amount: amount,
      description: payload.description,
      orderId: payload.orderId,
      expiresIn: 3600, // 1 hora em segundos
    });
  } catch (error) {
    console.error('Pix generation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate Pix QR Code',
    });
  }
}

/**
 * Gera um código Pix simulado
 * Em produção, isso seria gerado por um provedor real
 */
function generatePixQRCode(amount: number, description: string): string {
  // Simulação de um QR Code Pix válido
  // Formato EMV (Estrutura de Dados para Pagamentos Instantâneos)
  const merchantAccount = '12345678901234'; // Conta simulada
  const amountFormatted = amount.toFixed(2).replace('.', '');
  
  // Estrutura simplificada do QR Code Pix
  const qrCode = `00020126580014br.gov.bcb.pix0136${merchantAccount}52040000530398654061${amountFormatted}5802BR5913TECH STORE6009SAO PAULO62410503***63041D3D`;
  
  return qrCode;
}
