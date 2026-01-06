import type { VercelRequest, VercelResponse } from '@vercel/node';

// Função para gerar código Pix Copia e Cola (EMV)
function generatePixCode(amount: number, pixKey: string, merchantName: string, city: string, txId: string): string {
  const formatField = (id: string, value: string): string => {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  };

  // Merchant Account Information (campo 26)
  const gui = formatField('00', 'br.gov.bcb.pix');
  const key = formatField('01', pixKey);
  const merchantAccountInfo = formatField('26', gui + key);

  // Campos principais
  const payloadFormatIndicator = formatField('00', '01');
  const merchantCategoryCode = formatField('52', '0000');
  const transactionCurrency = formatField('53', '986'); // BRL
  const transactionAmount = formatField('54', amount.toFixed(2));
  const countryCode = formatField('58', 'BR');
  const merchantNameField = formatField('59', merchantName.substring(0, 25));
  const merchantCity = formatField('60', city.substring(0, 15));
  
  // Additional Data Field (campo 62)
  const txIdField = formatField('05', txId);
  const additionalDataField = formatField('62', txIdField);

  // Montar payload sem CRC
  const payloadWithoutCRC = 
    payloadFormatIndicator +
    merchantAccountInfo +
    merchantCategoryCode +
    transactionCurrency +
    transactionAmount +
    countryCode +
    merchantNameField +
    merchantCity +
    additionalDataField +
    '6304'; // CRC placeholder

  // Calcular CRC16
  const crc = calculateCRC16(payloadWithoutCRC);
  
  return payloadWithoutCRC + crc;
}

function calculateCRC16(str: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
      crc &= 0xFFFF;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

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
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valor inválido' });
    }

    const pixKey = process.env.PIX_KEY || 'supoorteebooktea@gmail.com';
    const merchantName = 'TECH GADGETS STORE';
    const city = 'SAO PAULO';
    const txId = `TG${Date.now().toString(36).toUpperCase()}`;

    const pixCode = generatePixCode(amount, pixKey, merchantName, city, txId);

    // URL para gerar QR Code (usando API pública)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`;

    return res.status(200).json({
      success: true,
      pixCode,
      qrCodeUrl,
      txId,
      amount,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
    });
  } catch (error: any) {
    console.error('Erro ao gerar Pix:', error);
    return res.status(500).json({ error: error.message || 'Erro ao gerar código Pix' });
  }
}
