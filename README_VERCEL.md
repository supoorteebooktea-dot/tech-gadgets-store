# Tech Gadgets Store - Guia de Deploy na Vercel

## 🚀 Visão Geral

Este é um projeto e-commerce completo refatorado para funcionar como **Vercel Serverless Functions**. O projeto agora é 100% compatível com a Vercel e não depende mais de um servidor Express tradicional.

## 📋 Arquitetura

### Frontend
- **React 19** com TypeScript
- **Vite** para build otimizado
- **TailwindCSS v4** para estilos
- **Componentes UI** com Radix UI
- **Roteamento** com Wouter

### Backend (Serverless Functions)
- `/api/products.ts` - Listar produtos
- `/api/checkout.ts` - Criar sessão de checkout Stripe
- `/api/pix.ts` - Gerar QR Code Pix
- `/api/send-email.ts` - Enviar e-mails automáticos
- `/api/shipping.ts` - Calcular frete

## 🔧 Configuração Necessária

### 1. Variáveis de Ambiente

Configure estas variáveis no painel da Vercel (Settings → Environment Variables):

```
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Gmail (para e-mails)
GMAIL_USER=seu-email@gmail.com
GMAIL_APP_PASSWORD=sua-senha-de-app

# Vercel (automático)
VERCEL_URL=https://seu-dominio.vercel.app
```

### 2. Arquivos de Configuração

✅ `vercel.json` - Configuração do build
✅ `.npmrc` - Configuração do npm
✅ `.vercelignore` - Arquivos a ignorar
✅ `vite.config.ts` - Configuração do Vite
✅ `package.json` - Dependências otimizadas

## 📦 Como Fazer Deploy

### Opção 1: Deploy Automático (Recomendado)

1. **Fazer commit e push** das mudanças:
```bash
git add .
git commit -m "Refactor for Vercel Serverless Functions"
git push
```

2. A Vercel detectará automaticamente as mudanças e iniciará o deploy.

### Opção 2: Deploy Manual

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique no seu projeto
3. Vá para "Deployments"
4. Clique em "⋮" → "Redeploy"

## 🧪 Testando Localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview
```

## 📡 Consumindo as APIs

### Exemplo: Buscar Produtos

```javascript
import { fetchProducts } from '@/lib/api';

const products = await fetchProducts();
console.log(products);
```

### Exemplo: Criar Sessão de Checkout

```javascript
import { createCheckoutSession } from '@/lib/api';

const response = await createCheckoutSession({
  items: [
    { productId: 1, quantity: 2, unitPrice: '299.99', name: 'Fone Bluetooth' }
  ],
  subtotal: '599.98',
  shippingCost: '15.00',
  tax: '59.99',
  total: '674.97',
  email: 'cliente@example.com',
  name: 'João Silva'
});

// Redirecionar para Stripe
window.location.href = response.url;
```

### Exemplo: Calcular Frete

```javascript
import { calculateShipping } from '@/lib/api';

const options = await calculateShipping({
  zipCode: '01310100',
  weight: 2,
  subtotal: '500.00'
});

console.log(options); // Array com opções de frete
```

## 🐛 Troubleshooting

### Erro: "Cannot find module '@vercel/node'"

**Solução**: Executar `npm install` novamente

```bash
npm install
npm run build
```

### Erro: "API endpoint not found"

**Solução**: Verificar se os arquivos estão em `/api` e com extensão `.ts`

```bash
ls -la api/
# Deve mostrar: products.ts, checkout.ts, pix.ts, send-email.ts, shipping.ts
```

### Erro: "STRIPE_SECRET_KEY is not defined"

**Solução**: Configurar as variáveis de ambiente na Vercel

1. Dashboard → Settings → Environment Variables
2. Adicionar `STRIPE_SECRET_KEY` com o valor correto
3. Fazer redeploy

### Erro: "Build failed"

**Solução**: Verificar os logs

1. Dashboard → Deployments → Clique no deploy com erro
2. Vá para "Logs" e procure por "Error:"
3. Corrigir o problema e fazer push novamente

## 📊 Estrutura de Pastas

```
tech-gadgets-store/
├── api/                      # Serverless Functions
│   ├── products.ts
│   ├── checkout.ts
│   ├── pix.ts
│   ├── send-email.ts
│   └── shipping.ts
├── client/                   # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── main.tsx
│   └── index.html
├── public/                   # Assets estáticos
├── vercel.json              # Configuração Vercel
├── vite.config.ts           # Configuração Vite
├── package.json             # Dependências
└── README_VERCEL.md         # Este arquivo
```

## 🔐 Segurança

### Boas Práticas

1. **Nunca** compartilhe suas chaves de API
2. Use variáveis de ambiente para dados sensíveis
3. Valide sempre os dados recebidos nas APIs
4. Use HTTPS em produção (Vercel fornece automaticamente)
5. Implemente rate limiting se necessário

### Proteção de Dados

- Stripe: Dados de cartão nunca passam pelo seu servidor
- Emails: Credenciais do Gmail armazenadas com segurança
- Variáveis: Criptografadas pela Vercel

## 📈 Performance

- **Frontend**: Otimizado com Vite (build ~100KB gzipped)
- **APIs**: Serverless Functions (cold start ~200ms)
- **Cache**: Vercel CDN automático para assets estáticos
- **Imagens**: Otimizadas com Vercel Image Optimization

## 🚀 Próximos Passos

1. ✅ Fazer deploy na Vercel
2. ✅ Configurar variáveis de ambiente
3. ✅ Testar todas as funcionalidades
4. ✅ Configurar domínio customizado (opcional)
5. ✅ Monitorar performance nos logs

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs na Vercel: Dashboard → Deployments → Logs
2. Consulte a documentação do Vite: https://vitejs.dev
3. Consulte a documentação da Vercel: https://vercel.com/docs
4. Verifique a documentação do Stripe: https://stripe.com/docs

## 📝 Changelog

### v1.0.0 - Refatoração para Vercel
- ✅ Convertido de Express para Serverless Functions
- ✅ Removidas dependências do Manus
- ✅ Otimizado para Vercel
- ✅ Adicionadas APIs de produtos, checkout, Pix, e-mail e frete
- ✅ Documentação completa

---

**Última atualização**: Janeiro 2026  
**Status**: ✅ Pronto para produção
