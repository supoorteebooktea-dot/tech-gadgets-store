import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

interface EmailPayload {
  to: string;
  subject: string;
  template: 'order-confirmation' | 'payment-received' | 'shipping' | 'contact';
  data?: Record<string, any>;
}

// Configurar transportador de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apenas POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload: EmailPayload = req.body;

    // Validar dados
    if (!payload.to || !payload.subject || !payload.template) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Gerar HTML do e-mail baseado no template
    const htmlContent = generateEmailTemplate(payload.template, payload.data || {});

    // Enviar e-mail
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: payload.to,
      subject: payload.subject,
      html: htmlContent,
    });

    res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    });
  }
}

function generateEmailTemplate(template: string, data: Record<string, any>): string {
  const baseStyle = `
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
      .content { padding: 20px; background: #f9f9f9; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      .button { display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
      .order-item { border-bottom: 1px solid #ddd; padding: 10px 0; }
    </style>
  `;

  switch (template) {
    case 'order-confirmation':
      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>Pedido Confirmado!</h1>
          </div>
          <div class="content">
            <p>Olá ${data.customerName || 'Cliente'},</p>
            <p>Seu pedido #${data.orderId} foi confirmado com sucesso!</p>
            <h3>Detalhes do Pedido:</h3>
            <div class="order-item">
              <strong>Subtotal:</strong> R$ ${data.subtotal}
            </div>
            <div class="order-item">
              <strong>Frete:</strong> R$ ${data.shipping}
            </div>
            <div class="order-item">
              <strong>Total:</strong> R$ ${data.total}
            </div>
            <p>Você receberá um e-mail quando seu pedido for enviado.</p>
            <p><a href="${data.orderLink || '#'}" class="button">Ver Pedido</a></p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Tech Gadgets Store. Todos os direitos reservados.</p>
          </div>
        </div>
      `;

    case 'payment-received':
      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>Pagamento Recebido!</h1>
          </div>
          <div class="content">
            <p>Olá ${data.customerName || 'Cliente'},</p>
            <p>Confirmamos o recebimento do seu pagamento no valor de <strong>R$ ${data.amount}</strong>.</p>
            <p>Seu pedido será processado em breve e você receberá atualizações por e-mail.</p>
            <p><a href="${data.orderLink || '#'}" class="button">Acompanhar Pedido</a></p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Tech Gadgets Store. Todos os direitos reservados.</p>
          </div>
        </div>
      `;

    case 'shipping':
      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>Seu Pedido Foi Enviado!</h1>
          </div>
          <div class="content">
            <p>Olá ${data.customerName || 'Cliente'},</p>
            <p>Seu pedido #${data.orderId} foi enviado!</p>
            <p><strong>Código de Rastreamento:</strong> ${data.trackingCode}</p>
            <p><a href="${data.trackingLink || '#'}" class="button">Rastrear Pedido</a></p>
            <p>O pedido deve chegar em ${data.estimatedDays} dias úteis.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Tech Gadgets Store. Todos os direitos reservados.</p>
          </div>
        </div>
      `;

    case 'contact':
      return `
        ${baseStyle}
        <div class="container">
          <div class="header">
            <h1>Obrigado por Entrar em Contato!</h1>
          </div>
          <div class="content">
            <p>Olá ${data.name || 'Visitante'},</p>
            <p>Recebemos sua mensagem e entraremos em contato em breve.</p>
            <p><strong>Sua Mensagem:</strong></p>
            <p>${data.message}</p>
            <p>Tempo de resposta: até 24 horas.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Tech Gadgets Store. Todos os direitos reservados.</p>
          </div>
        </div>
      `;

    default:
      return `
        ${baseStyle}
        <div class="container">
          <div class="header"><h1>Tech Gadgets Store</h1></div>
          <div class="content"><p>${data.message || 'Mensagem padrão'}</p></div>
          <div class="footer"><p>&copy; 2024 Tech Gadgets Store.</p></div>
        </div>
      `;
  }
}
