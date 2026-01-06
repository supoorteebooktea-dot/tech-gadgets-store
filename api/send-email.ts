import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
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
    const { to, subject, orderNumber, items, total, customerName } = req.body;

    if (!to || !orderNumber) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Template de e-mail HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 30px; }
          .order-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-size: 20px; font-weight: bold; color: #4F46E5; text-align: right; margin-top: 20px; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; }
          .btn { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛒 Tech Gadgets Store</h1>
            <p>Pedido Confirmado!</p>
          </div>
          <div class="content">
            <h2>Olá, ${customerName || 'Cliente'}!</h2>
            <p>Obrigado pela sua compra! Seu pedido foi recebido e está sendo processado.</p>
            
            <div class="order-info">
              <h3>📦 Pedido #${orderNumber}</h3>
              ${items ? items.map((item: any) => `
                <div class="item">
                  <span>${item.name} x${item.quantity || 1}</span>
                  <span>R$ ${(item.price * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              `).join('') : ''}
              <div class="total">
                Total: R$ ${total?.toFixed(2) || '0.00'}
              </div>
            </div>
            
            <p>Você receberá atualizações sobre o status do seu pedido por e-mail.</p>
            
            <center>
              <a href="https://tech-gadgets-store-gvin.vercel.app" class="btn">Voltar à Loja</a>
            </center>
          </div>
          <div class="footer">
            <p>Tech Gadgets Store - Gadgets que transformam seu dia a dia</p>
            <p>Este é um e-mail automático, por favor não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Tech Gadgets Store" <${process.env.GMAIL_USER}>`,
      to,
      subject: subject || `Pedido #${orderNumber} Confirmado - Tech Gadgets Store`,
      html: htmlContent,
    });

    return res.status(200).json({ success: true, message: 'E-mail enviado com sucesso' });
  } catch (error: any) {
    console.error('Erro ao enviar e-mail:', error);
    return res.status(500).json({ error: error.message || 'Erro ao enviar e-mail' });
  }
}
