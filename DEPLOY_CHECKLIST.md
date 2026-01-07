# ✅ Checklist de Deploy - Tech Gadgets Store

## 📋 Antes de Fazer Deploy

### Código
- [ ] Todos os arquivos foram commitados
- [ ] Não há erros de TypeScript: `npm run check`
- [ ] Build local funciona: `npm run build`
- [ ] Servidor local funciona: `npm run dev`

### Configuração
- [ ] Arquivo `vercel.json` existe
- [ ] Arquivo `.npmrc` existe
- [ ] Arquivo `.vercelignore` existe
- [ ] Arquivo `package.json` está correto

### Banco de Dados
- [ ] DATABASE_URL está configurada
- [ ] Banco de dados está acessível remotamente
- [ ] Schema foi criado no banco (migrations rodaram)

### Variáveis de Ambiente
- [ ] JWT_SECRET está definido
- [ ] VITE_APP_ID está definido
- [ ] OAUTH_SERVER_URL está definido
- [ ] OWNER_OPEN_ID está definido
- [ ] NODE_ENV = production

## 🚀 Durante o Deploy

### Vercel Dashboard
- [ ] Projeto está conectado ao GitHub
- [ ] Branch correto está selecionado (main/master)
- [ ] Build command está correto
- [ ] Environment variables estão configuradas

### Build
- [ ] Build iniciou automaticamente após push
- [ ] Logs mostram progresso
- [ ] Não há erros durante npm install
- [ ] Não há erros durante build

### Deployment
- [ ] URL foi gerada
- [ ] Deployment está "Ready"
- [ ] Não há erros nos logs

## ✅ Após o Deploy

### Testes Básicos
- [ ] Site carrega na URL da Vercel
- [ ] Página inicial renderiza corretamente
- [ ] Não há erros no console do navegador
- [ ] Imagens carregam corretamente

### Testes de API
- [ ] GET /api/trpc/products.getAll retorna produtos
- [ ] Login/OAuth funciona
- [ ] Requisições ao banco de dados funcionam

### Testes de Funcionalidades
- [ ] Página de produtos carrega
- [ ] Busca de produtos funciona
- [ ] Carrinho de compras funciona
- [ ] Checkout funciona (se Stripe está configurado)
- [ ] Painel admin é acessível

### Monitoramento
- [ ] Logs da Vercel não mostram erros
- [ ] Sem erros de 5xx no servidor
- [ ] Sem erros de conexão com banco

## 🔧 Se Algo Falhar

### Build Falha
1. [ ] Verifique os logs completos na Vercel
2. [ ] Procure por "ERR_" ou "Error:" nos logs
3. [ ] Teste localmente: `npm install && npm run build`
4. [ ] Verifique se todas as dependências estão no package.json

### Deploy Falha
1. [ ] Verifique se a URL do banco de dados está correta
2. [ ] Teste a conexão localmente
3. [ ] Verifique se o banco aceita conexões remotas
4. [ ] Verifique firewall/security groups

### Site Carrega mas Funcionalidades Falham
1. [ ] Abra DevTools (F12) → Console
2. [ ] Procure por erros de rede (Network tab)
3. [ ] Verifique se as variáveis de ambiente foram aplicadas
4. [ ] Faça redeploy: Dashboard → Deployments → ⋮ → Redeploy

### Erro 502 Bad Gateway
1. [ ] Servidor Express pode estar falhando
2. [ ] Verifique logs: Deployments → Logs
3. [ ] Procure por erros de inicialização
4. [ ] Verifique conexão com banco de dados

## 📞 Informações Úteis

### Logs da Vercel
- Dashboard → Seu Projeto → Deployments → Clique no deploy → Logs

### Redeploy
- Dashboard → Seu Projeto → Deployments → ⋮ (menu) → Redeploy

### Rollback
- Dashboard → Seu Projeto → Deployments → Clique em um deploy anterior

### Variáveis de Ambiente
- Dashboard → Seu Projeto → Settings → Environment Variables

---

**Dica**: Salve este arquivo para consultar sempre que fizer deploy! 📌
