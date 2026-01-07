# Guia de Deploy na Vercel - Tech Gadgets Store

## 🚀 Configuração do Deploy

Este projeto é um aplicação **full-stack** com:
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Express + tRPC
- **Banco de Dados**: MySQL (TiDB)
- **Autenticação**: OAuth + JWT

## 📋 Pré-requisitos

1. Repositório no GitHub
2. Conta na Vercel
3. Banco de dados MySQL (TiDB ou similar)
4. Variáveis de ambiente configuradas

## 🔧 Variáveis de Ambiente Necessárias

Configure estas variáveis na Vercel (Settings → Environment Variables):

```
# Banco de Dados
DATABASE_URL=mysql://user:password@host:port/database

# JWT e Segurança
JWT_SECRET=sua_chave_secreta_aqui

# OAuth (Manus)
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://oauth.server.url
OWNER_OPEN_ID=seu_owner_id

# APIs Externas (Opcional)
BUILT_IN_FORGE_API_URL=https://api.forge.url
BUILT_IN_FORGE_API_KEY=sua_chave_api

# Node Environment
NODE_ENV=production
```

## 📝 Passos para Deploy

### 1. Preparar o Repositório

```bash
# Certifique-se de que o arquivo vercel.json existe
# Certifique-se de que o arquivo .npmrc existe
# Faça commit de todas as mudanças
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Conectar à Vercel

1. Acesse [vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em "Add New..." → "Project"
3. Selecione seu repositório GitHub
4. Clique em "Import"

### 3. Configurar Variáveis de Ambiente

1. Na tela de configuração do projeto, clique em "Environment Variables"
2. Adicione todas as variáveis listadas acima
3. Clique em "Deploy"

### 4. Aguardar o Build

- O build leva entre 3-5 minutos
- Você pode acompanhar o progresso no dashboard
- Se houver erro, verifique os logs

## 🐛 Troubleshooting

### Erro: "Command pnpm install exited with 1"

**Solução**: O arquivo `vercel.json` já força o uso de npm. Se o erro persistir:

1. Delete o arquivo `pnpm-lock.yaml` do repositório
2. Faça commit e push
3. Redeploy na Vercel

```bash
git rm pnpm-lock.yaml
git commit -m "Remove pnpm-lock.yaml"
git push
```

### Erro: "Cannot find module"

**Solução**: Verifique se todas as dependências estão no `package.json`:

```bash
npm install
npm run check  # Verifica tipos TypeScript
```

### Erro: "Database connection failed"

**Solução**: Verifique se a variável `DATABASE_URL` está correta:

1. Teste a conexão localmente
2. Verifique se o banco aceita conexões remotas
3. Confirme o formato da URL

Formato correto: `mysql://user:password@host:port/database`

### Erro: "Build timeout"

**Solução**: O build está demorando muito. Possíveis causas:

1. Muitas dependências pesadas
2. Conexão lenta com o banco de dados
3. Limite de memória

Tente:
- Aumentar o timeout na Vercel (Settings → Build & Development Settings)
- Otimizar dependências
- Usar cache do npm

## ✅ Verificação Pós-Deploy

Após o deploy bem-sucedido:

1. ✅ Acesse a URL do seu projeto
2. ✅ Verifique se a página inicial carrega
3. ✅ Teste o login (OAuth)
4. ✅ Teste uma requisição à API (ex: listar produtos)
5. ✅ Verifique os logs em "Deployments" → "Logs"

## 🔄 Redeploy

Para fazer redeploy após mudanças:

1. Faça commit e push das mudanças
2. A Vercel redeploy automaticamente
3. Ou manualmente: Dashboard → Deployments → ⋮ → Redeploy

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs na Vercel
2. Teste localmente com `npm run dev`
3. Verifique as variáveis de ambiente
4. Confirme a conectividade do banco de dados

---

**Última atualização**: Janeiro 2026
