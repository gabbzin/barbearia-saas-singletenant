# AgendaBarber

Plataforma de agendamento online para barbearias.

## Visão Geral

O AgendaBarber é um sistema criado para simplificar o gerenciamento de horários, serviços e atendimentos em barbearias. Ele permite que clientes realizem agendamentos online de forma rápida, enquanto a equipe organiza a agenda diária com praticidade.

## 🚀 Setup para Desenvolvimento

### Pré-requisitos

- Node.js 20+
- pnpm (recomendado) ou npm
- PostgreSQL (ou conta Neon/Supabase)

### Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd barbearia-saas-singletenant
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

- **DATABASE_URL**: String de conexão PostgreSQL
- **BETTER_AUTH_SECRET**: Chave secreta (min. 32 caracteres)
- **GOOGLE_CLIENT_ID/SECRET**: Credenciais OAuth Google
- **STRIPE\_\***: Keys do Stripe dashboard
- **RESEND_API_KEY**: API key do Resend
- **BLOB\_\***: Tokens do Vercel Blob Storage

4. Execute as migrations do Prisma:

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

5. (Opcional) Popule o banco com dados de teste:

```bash
pnpm prisma db seed
```

6. Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

Acesse: http://localhost:3000

### Stack Tecnológica

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, shadcn/ui, Tailwind CSS 4
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Better Auth
- **Payments**: Stripe
- **Email**: Resend + React Email
- **Storage**: Vercel Blob

## Principais Funcionalidades

- Agendamento online de horários
- Visualização da agenda diária da barbearia
- Cadastro e gerenciamento de barbeiros
- Cadastro e gerenciamento de serviços
- Histórico de agendamentos
- Controle de horários disponíveis
- Painel administrativo

## Fluxo Geral de Uso

1. O cliente acessa a plataforma.
2. Seleciona o serviço e o barbeiro.
3. Escolhe um horário disponível.
4. Confirma o agendamento.
5. A barbearia acompanha os agendamentos pelo painel administrativo.

## Perfis de Usuário

- Administrador da barbearia: gerencia barbeiros, serviços, horários e agenda.
- Barbeiro: visualiza seus horários e atendimentos.
- Cliente: realiza e acompanha seus agendamentos.

## Acesso ao Sistema

Os usuários entram com credenciais cadastradas pela barbearia. Cada perfil possui permissões específicas no painel: administradores configuram a operação, barbeiros consultam sua própria agenda e clientes acessam seus agendamentos confirmados e futuros. O acesso é individual e seguro, respeitando o nível de permissão de cada usuário.

## Requisitos para Utilização

- Acesso à internet
- Navegador atualizado (Google Chrome, Edge, Firefox ou similares)
- Dispositivo desktop, tablet ou smartphone

## Boas Práticas de Uso

- Manter dados cadastrais atualizados
- Respeitar os horários agendados
- Cancelar ou reagendar com antecedência

## Limitações Conhecidas

- Alterações de agenda feitas muito perto do horário marcado podem não ser refletidas para todos os usuários em tempo real.
- A disponibilidade exibida depende do cadastro correto de horários e serviços pela barbearia.
- O funcionamento requer conexão estável à internet.

## Suporte e Atendimento

Para suporte técnico, dúvidas ou solicitações de melhorias, entre em contato com a equipe AgendaBarber pelo e-mail suporte@agendabarber.com ou pelo canal oficial informado no painel administrativo.

## Atualizações Futuras

O AgendaBarber evolui continuamente para oferecer uma experiência cada vez melhor. Estão previstas melhorias em notificações inteligentes, novas opções de personalização da agenda e integrações adicionais para facilitar o atendimento e a comunicação com os clientes.
