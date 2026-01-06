import type { VercelRequest, VercelResponse } from '@vercel/node';

// Produtos da loja Tech Gadgets
const products = [
  {
    id: 1,
    name: "Webcam 4K com Microfone",
    description: "Webcam profissional 4K com microfone integrado, ideal para videoconferências e streaming. Sensor Sony IMX com autofoco contínuo.",
    price: 249.90,
    originalPrice: 349.90,
    imageUrl: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500",
    category: "Câmeras",
    rating: 4.8,
    reviews: 156,
    stock: 18,
    specifications: {
      "Resolução": "4K (2160p) a 30fps",
      "Sensor": "Sony IMX 1/2.3\"",
      "Microfone": "Duplo com cancelamento de ruído",
      "Foco": "Autofoco contínuo",
      "Campo de Visão": "90°",
      "Conexão": "USB 3.0"
    }
  },
  {
    id: 2,
    name: "Teclado Mecânico RGB",
    description: "Teclado mecânico com switches de alta durabilidade, iluminação RGB customizável e layout ABNT2. Perfeito para gamers e profissionais.",
    price: 189.90,
    originalPrice: 259.90,
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500",
    category: "Periféricos",
    rating: 4.6,
    reviews: 234,
    stock: 22,
    specifications: {
      "Switches": "Mecânicos RGB",
      "Iluminação": "RGB customizável",
      "Conexão": "USB-C wireless",
      "Layout": "ABNT2",
      "Material": "Alumínio",
      "Bateria": "40 horas"
    }
  },
  {
    id: 3,
    name: "Mouse Sem Fio Ergonômico",
    description: "Mouse ergonômico sem fio com sensor de alta precisão 4000 DPI, 6 botões programáveis e bateria de longa duração.",
    price: 79.90,
    originalPrice: 119.90,
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    category: "Periféricos",
    rating: 4.5,
    reviews: 312,
    stock: 35,
    specifications: {
      "DPI": "4000 DPI ajustável",
      "Botões": "6 botões programáveis",
      "Conexão": "2.4GHz wireless",
      "Bateria": "18 meses",
      "Alcance": "10 metros",
      "Peso": "95g"
    }
  },
  {
    id: 4,
    name: "Luminária Astronauta Galáxia",
    description: "Luminária decorativa de astronauta com projeção de galáxia. Perfeita para decoração de quartos e escritórios. Controle por app.",
    price: 129.90,
    originalPrice: 179.90,
    imageUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=500",
    category: "Iluminação",
    rating: 4.9,
    reviews: 89,
    stock: 25,
    specifications: {
      "Cores": "16 milhões de cores RGB",
      "Brilho": "500 lumens máximo",
      "Controle": "App mobile, voz (Alexa/Google)",
      "Consumo": "15W máximo",
      "Tamanho": "25 x 15 x 15 cm",
      "Garantia": "2 anos"
    }
  },
  {
    id: 5,
    name: "Relógio Digital com Carregador Wireless",
    description: "Relógio digital multifuncional com carregador wireless integrado de 15W. Mostra hora, temperatura e umidade.",
    price: 159.90,
    originalPrice: 219.90,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    category: "Acessórios",
    rating: 4.7,
    reviews: 178,
    stock: 20,
    specifications: {
      "Display": "LED 1.4 polegadas",
      "Carregador": "Wireless 15W",
      "Compatibilidade": "Qi universal",
      "Funções": "Hora, temperatura, umidade",
      "Bateria": "3000mAh",
      "Material": "Plástico premium"
    }
  },
  {
    id: 6,
    name: "Fone de Ouvido Bluetooth TWS",
    description: "Fones de ouvido true wireless com cancelamento de ruído ativo, resistência à água IPX5 e 30 horas de bateria total.",
    price: 149.90,
    originalPrice: 199.90,
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
    category: "Áudio",
    rating: 4.8,
    reviews: 445,
    stock: 30,
    specifications: {
      "Tipo": "True Wireless (TWS)",
      "ANC": "Cancelamento de ruído ativo",
      "Bateria": "8h + 22h no case",
      "Resistência": "IPX5",
      "Bluetooth": "5.3",
      "Drivers": "10mm dinâmicos"
    }
  },
  {
    id: 7,
    name: "Mini Projetor 4K Portátil",
    description: "Projetor portátil com resolução 4K nativa, 3000 lumens de brilho e bateria de 8 horas. Conectividade WiFi 6 e HDMI 2.1.",
    price: 349.90,
    originalPrice: 499.90,
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500",
    category: "Eletrônicos",
    rating: 4.8,
    reviews: 67,
    stock: 15,
    specifications: {
      "Resolução": "4K Nativa (3840 x 2160)",
      "Brilho": "3000 lumens",
      "Contraste": "10000:1",
      "Bateria": "8 horas de autonomia",
      "Conectividade": "WiFi 6, HDMI 2.1, USB-C",
      "Peso": "1.2 kg"
    }
  },
  {
    id: 8,
    name: "Suporte Ajustável para Smartphone",
    description: "Suporte premium em alumínio com rotação 360° em todos os eixos. Compatível com todos os smartphones de 4\" a 7\".",
    price: 59.90,
    originalPrice: 89.90,
    imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500",
    category: "Acessórios",
    rating: 4.7,
    reviews: 523,
    stock: 40,
    specifications: {
      "Material": "Alumínio premium de aviação",
      "Rotação": "360° em todos os eixos",
      "Compatibilidade": "Smartphones 4\" a 7\"",
      "Peso": "180g",
      "Tamanho": "15 x 10 x 8 cm",
      "Garantia": "Vitalícia"
    }
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id, category } = req.query;

  // Buscar produto específico por ID
  if (id) {
    const product = products.find(p => p.id === Number(id));
    if (product) {
      return res.status(200).json(product);
    }
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  // Filtrar por categoria
  if (category) {
    const filtered = products.filter(p => 
      p.category.toLowerCase() === String(category).toLowerCase()
    );
    return res.status(200).json(filtered);
  }

  // Retornar todos os produtos
  return res.status(200).json(products);
}
