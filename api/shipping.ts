import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simulação de cálculo de frete (integração com Melhor Envio seria aqui)
const shippingOptions = [
  {
    id: 'sedex',
    name: 'SEDEX',
    carrier: 'Correios',
    deliveryDays: { min: 2, max: 4 },
    basePrice: 25.90,
  },
  {
    id: 'pac',
    name: 'PAC',
    carrier: 'Correios',
    deliveryDays: { min: 5, max: 10 },
    basePrice: 18.90,
  },
  {
    id: 'jadlog',
    name: 'Jadlog Package',
    carrier: 'Jadlog',
    deliveryDays: { min: 3, max: 6 },
    basePrice: 22.50,
  },
];

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
    const { cep, cartTotal } = req.body;

    if (!cep) {
      return res.status(400).json({ error: 'CEP é obrigatório' });
    }

    // Validar formato do CEP
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      return res.status(400).json({ error: 'CEP inválido' });
    }

    // Frete grátis acima de R$ 200
    const freeShipping = cartTotal >= 200;

    // Calcular opções de frete
    const options = shippingOptions.map(option => {
      // Ajustar preço baseado na região (simulação)
      let regionMultiplier = 1;
      const region = cleanCep.substring(0, 1);
      
      if (['0', '1'].includes(region)) regionMultiplier = 1; // SP, RJ
      else if (['2', '3'].includes(region)) regionMultiplier = 1.1; // ES, MG
      else if (['4', '5'].includes(region)) regionMultiplier = 1.2; // BA, SE, AL, PE, PB, RN, CE, PI, MA
      else if (['6', '7'].includes(region)) regionMultiplier = 1.3; // PA, AM, AC, RO, RR, AP
      else if (['8', '9'].includes(region)) regionMultiplier = 1.15; // PR, SC, RS, MS, MT, GO, DF

      const price = freeShipping ? 0 : Math.round(option.basePrice * regionMultiplier * 100) / 100;

      return {
        ...option,
        price,
        freeShipping,
        estimatedDelivery: `${option.deliveryDays.min} a ${option.deliveryDays.max} dias úteis`,
      };
    });

    return res.status(200).json({
      success: true,
      cep: cleanCep,
      freeShippingThreshold: 200,
      freeShipping,
      options,
    });
  } catch (error: any) {
    console.error('Erro ao calcular frete:', error);
    return res.status(500).json({ error: error.message || 'Erro ao calcular frete' });
  }
}
