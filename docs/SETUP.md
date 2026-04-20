# 🛠️ Guia de Setup e Deploy - AgendaBarber

## 📋 Índice

- [Setup Local](#setup-local)
- [Configuração de Serviços](#configuração-de-serviços)
- [Deploy em Produção](#deploy-em-produção)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Setup Local

### 1. Pré-requisitos

- **Node.js**: v20 ou superior
- **pnpm**: v8+ (recomendado)
- **Banco de dados**: PostgreSQL 14+
- **Git**: Para controle de versão

### 2. Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd barbearia-saas-singletenant

# Instale as dependências
pnpm install

# Configure o ambiente
cp .env.example .env
```

### 3. Configuração do Banco de Dados

**Opção A: PostgreSQL Local**

```bash
# Crie um banco de dados
createdb agendabarber

# Configure o DATABASE_URL no .env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendabarber"
```

**Opção B: Neon (Recomendado)**

1. Acesse https://neon.tech
2. Crie um novo projeto
3. Copie a connection string
4. Cole no arquivo `.env`

### 4. Migrations e Seed

```bash
# Execute as migrations
pnpm prisma migrate dev

# Gere o Prisma Client
pnpm prisma generate

# (Opcional) Popule com dados de exemplo
pnpm prisma db seed
```

### 5. Inicie o Projeto

```bash
pnpm dev
```

Acesse: http://localhost:3000

---

## 🔐 Configuração de Serviços

### Better Auth

Gere uma chave secreta segura:

```bash
openssl rand -base64 32
```

Configure no `.env`:

```env
BETTER_AUTH_SECRET="sua-chave-gerada"
BETTER_AUTH_URL="http://localhost:3000/api/auth"
```

### Google OAuth

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Crie um projeto novo ou selecione existente
3. Vá em "Credenciais" → "Criar credenciais" → "ID do cliente OAuth"
4. Configure:
   - **Tipo**: Aplicativo da Web
   - **URIs de redirecionamento autorizados**:
     - `http://localhost:3000/api/auth/callback/google` (dev)
     - `https://seudominio.com/api/auth/callback/google` (prod)
5. Copie Client ID e Client Secret para o `.env`

### Stripe

1. Acesse: https://dashboard.stripe.com/apikeys
2. Copie as chaves de teste ou produção
3. Configure webhooks:
   - URL local (dev): Use Stripe CLI
   - URL produção: `https://seudominio.com/api/stripe/webhook`
4. Eventos necessários:
   - `checkout.session.completed`
   - `charge.refunded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`

**Desenvolvimento com Stripe CLI:**

```bash
# Instale o Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Windows/Linux: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks para localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Resend (Email)

1. Acesse: https://resend.com/api-keys
2. Crie uma API Key
3. Configure no `.env`
4. Verifique seu domínio para emails em produção

### Vercel Blob (Storage)

1. Acesse: https://vercel.com/dashboard/stores
2. Crie um novo Blob Store
3. Copie o token e a URL pública
4. Configure no `.env`

---

## 🚀 Deploy em Produção

### Pré-requisitos

- [ ] Banco de dados PostgreSQL em produção (Neon, Supabase, Railway)
- [ ] Domínio configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Testes realizados em ambiente de staging

### Deploy na Vercel

1. **Instale o Vercel CLI**

```bash
npm i -g vercel
```

2. **Faça login**

```bash
vercel login
```

3. **Configure o projeto**

```bash
vercel
```

4. **Configure as variáveis de ambiente**

```bash
# Via CLI
vercel env add DATABASE_URL
vercel env add BETTER_AUTH_SECRET
# ... adicione todas as variáveis

# Ou via dashboard: https://vercel.com/dashboard
```

5. **Deploy**

```bash
vercel --prod
```

### Checklist Pós-Deploy

- [ ] Rode migrations: `pnpm prisma migrate deploy`
- [ ] Teste autenticação (email e Google)
- [ ] Teste fluxo de pagamento Stripe
- [ ] Configure webhooks do Stripe para URL de produção
- [ ] Teste envio de emails
- [ ] Verifique logs de erro (Vercel Dashboard)
- [ ] Configure domínio customizado
- [ ] Configure SSL/HTTPS
- [ ] Teste em diferentes dispositivos

### Variáveis de Ambiente em Produção

**⚠️ IMPORTANTE**: Atualize estas variáveis para produção:

```env
# ❌ NÃO use localhost em produção
BETTER_AUTH_URL="https://seudominio.com/api/auth"
NEXT_PUBLIC_BASE_URL="https://seudominio.com"

# ✅ Use chaves de PRODUÇÃO do Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ✅ Use banco de dados de PRODUÇÃO
DATABASE_URL="postgresql://..."
```

---

## 🐛 Troubleshooting

### Erro: "Prisma Client not generated"

```bash
pnpm prisma generate
```

### Erro: "Database connection failed"

1. Verifique se o PostgreSQL está rodando
2. Confira a string de conexão no `.env`
3. Teste a conexão:

```bash
pnpm prisma db pull
```

### Erro: "OAuth redirect URI mismatch"

1. Verifique se a URI no Google Console está correta
2. Deve ser exatamente: `http://localhost:3000/api/auth/callback/google`
3. Inclua tanto HTTP quanto HTTPS em produção

### Erro: "Webhook signature verification failed"

1. Verifique se `STRIPE_WEBHOOK_SECRET` está correto
2. Em desenvolvimento, use Stripe CLI
3. Em produção, configure o webhook no Stripe Dashboard

### Erro: "Email sending failed"

1. Verifique se `RESEND_API_KEY` está correto
2. Em produção, verifique seu domínio no Resend
3. Confira os logs no dashboard do Resend

### Build falha na Vercel

1. Verifique erros no log de build
2. Rode `pnpm build` localmente para testar
3. Certifique-se que todas as variáveis de ambiente estão configuradas
4. Execute `pnpm prisma generate` antes do build

---

## 📚 Recursos Adicionais

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Prisma](https://www.prisma.io/docs)
- [Better Auth Docs](https://www.better-auth.com/docs)
- [Stripe API](https://stripe.com/docs/api)
- [Resend Docs](https://resend.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 🤝 Suporte

Encontrou um problema? Abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.
