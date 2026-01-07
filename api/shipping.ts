import { VercelRequest, VercelResponse } from '@vercel/node';

interface ShippingPayload {
  zipCode: string;
  weight?: number;
  subtotal?: string;
}

interface ShippingOption {
  id: string;
  name: string;
  price: string;
  estimatedDays: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apenas POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload: ShippingPayload = req.body;

    // Validar dados
    if (!payload.zipCode) {
      return res.status(400).json({ error: 'Zip code is required' });
    }

    // Calcular frete baseado no CEP e peso
    const shippingOptions = calculateShipping(
      payload.zipCode,
      payload.weight || 1,
      Number(payload.subtotal || 0)
    );

    res.status(200).json({
      success: true,
      zipCode: payload.zipCode,
      options: shippingOptions,
    });
  } catch (error) {
    console.error('Shipping calculation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate shipping',
    });
  }
}

function calculateShipping(zipCode: string, weight: number, subtotal: number): ShippingOption[] {
  // Simular cálculo de frete baseado em CEP
  // Em produção, isso integraria com APIs reais como Correios, Loggi, etc.

  // Extrair região do CEP (primeiros 2 dígitos)
  const region = parseInt(zipCode.substring(0, 2));

  // Definir base de frete por região
  let basePrice = 15; // São Paulo
  let estimatedDays = 5;

  if (region >= 20 && region <= 28) {
    // Rio de Janeiro
    basePrice = 18;
    estimatedDays = 6;
  } else if (region >= 30 && region <= 39) {
    // Minas Gerais
    basePrice = 20;
    estimatedDays = 7;
  } else if (region >= 40 && region <= 48) {
    // Santa Catarina, Paraná, Rio Grande do Sul
    basePrice = 22;
    estimatedDays = 8;
  } else if (region >= 50 && region <= 59) {
    // Distrito Federal, Goiás, Mato Grosso, Mato Grosso do Sul
    basePrice = 25;
    estimatedDays = 9;
  } else if (region >= 60 && region <= 69) {
    // Brasília e região
    basePrice = 28;
    estimatedDays = 10;
  } else if (region >= 70 && region <= 79) {
    // Amazonas, Pará, Rondônia, Roraima, Amapá
    basePrice = 35;
    estimatedDays = 12;
  } else {
    // Outras regiões (Nordeste, Norte)
    basePrice = 30;
    estimatedDays = 11;
  }

  // Ajustar preço baseado no peso
  const weightFactor = Math.max(1, weight / 1000); // 1kg = base
  const weightAdjustment = (weightFactor - 1) * 5; // R$ 5 por kg adicional

  // Frete grátis acima de R$ 200
  let standardPrice = basePrice + weightAdjustment;
  if (subtotal >= 200) {
    standardPrice = 0;
  }

  const options: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Entrega Padrão',
      price: standardPrice.toFixed(2),
      estimatedDays: estimatedDays,
    },
    {
      id: 'express',
      name: 'Entrega Expressa',
      price: (standardPrice * 1.5).toFixed(2),
      estimatedDays: Math.max(1, Math.ceil(estimatedDays / 2)),
    },
    {
      id: 'same-day',
      name: 'Entrega no Mesmo Dia (São Paulo)',
      price: region === 1 ? '49.90' : 'indisponível',
      estimatedDays: region === 1 ? 0 : 999,
    },
  ];

  // Filtrar opções indisponíveis
  return options.filter(opt => opt.price !== 'indisponível');
}
