# Resumo da Arquitetura - barbeariaSaaS (Single-Tenant)

Este documento descreve a arquitetura, a organização do código, o modelo de dados e o estado atual das funcionalidades do SaaS de barbearia.

Objetivos principais deste material:
- Servir como referência técnica para manutenção e evolução do sistema.
- Padronizar entendimento de domínios, fluxos e decisões arquiteturais.
- Facilitar onboarding de desenvolvedores e colaboração com IA para tarefas técnicas.

## 🧱 Visão Geral da Arquitetura

O projeto adota uma arquitetura modular com foco em domínio, combinando:
- App Router do Next.js para roteamento e rendering.
- Organização por features para encapsular regras de negócio.
- Camadas compartilhadas para utilitários, infraestrutura e UI reutilizável.

Modelo operacional:
- Single-tenant: 1 barbearia com múltiplos barbeiros e múltiplos clientes.
- Controle de acesso por papéis: ADMIN, BARBER e USER.
- Server Actions tipadas para mutações com validação e segurança.

## 🛠️ Stack Tecnológica

- Framework: Next.js 16 (App Router) sobre React 19.
- Linguagem: TypeScript.
- Banco de dados: PostgreSQL.
- ORM: Prisma (cliente Prisma oficial).
- Autenticação e sessões: Better Auth com integração Stripe.
- Estado global: Zustand.
- Data fetching e cache: TanStack React Query.
- Server Actions type-safe: next-safe-action.
- UI e estilização: Tailwind CSS (v4/PostCSS) + shadcn/ui.
- Componentes base: Radix UI.
- Animações: Framer Motion e tw-animate-css.
- Pagamentos e assinaturas: Stripe (SDK server e client).
- E-mails transacionais: Resend + React Email + Nodemailer.
- Storage de imagens: Vercel Blob.
- Validação de dados e formulários: Zod + React Hook Form.

## 📁 Estrutura de Diretórios

### App Router

- /app: definição de rotas e layout principal.
- /(auth): autenticação (login, cadastro, recuperação e verificação).
- /(protected): áreas autenticadas por contexto.
- /admin: visão administrativa da barbearia.
- /barber: painel operacional do barbeiro.
- /client: área do cliente (agendamentos e assinatura).
- /profile: perfil e configurações da conta.
- /api: endpoints e webhooks (exemplo: autenticação e Stripe).

### Domínios de negócio

- /features/barber: gestão de barbeiros, disponibilidade e exceções.
- /features/booking: fluxo de agendamento e validações de agenda.
- /features/dashboard_barber: métricas e operação diária do barbeiro.
- /features/landing_page: páginas públicas de aquisição.
- /features/rating: avaliações de atendimentos concluídos.
- /features/service: cadastro e gestão de serviços.
- /features/signature: assinaturas e integração de planos.
- /features/user: gestão de perfis e clientes.

### Camadas compartilhadas

- /shared e /components: componentes reutilizáveis de UI e blocos comuns.
- /lib: infraestrutura compartilhada (Prisma, Auth, Stripe, utilitários de integração).
- /queries: leituras centralizadas para consumo em telas e hooks.
- /prisma: schema, seeds e histórico de migrações.

## 🗄️ Modelo de Dados (Prisma)

O schema é orientado ao cenário single-tenant com separação clara entre identidade, operação e cobrança.

### Identidade e permissões

- User: entidade base com role, credenciais e vínculo opcional com cliente Stripe.
- Session e Account: entidades de sessão e provedores da autenticação.

### Operação da barbearia

- Barbershop: configuração global do estabelecimento.
- Barber: perfil profissional vinculado a usuário.
- BarberService: catálogo de serviços por barbeiro, com preço e duração.
- Disponibility: janelas regulares por dia da semana.
- BarberBreak: pausas recorrentes no expediente.
- ExceptionDate: bloqueios pontuais, folgas, férias e feriados.

### Fluxo de atendimento

- Booking: agendamento com estados SCHEDULED, COMPLETED e CANCELLED.
- Rating: avaliação de booking concluído.
- Plan e Subscription: espelho de planos e assinaturas recorrentes no Stripe.

### Observação relevante

- Ghost users são suportados no Booking para marcações sem conta formal, usando campos como nome e telefone do cliente.

## ⚙️ Padrões Arquiteturais e Fluxos

1. Autenticação e autorização por role
- Redirecionamento pós-login orientado por papel (Admin, Barber, User).

2. Mutações seguras
- Server Actions com validação de payload por Zod antes de operações no banco.

3. Agenda e conflito de horários
- Cálculo de disponibilidade cruza janelas regulares, pausas, exceções e sobreposição de bookings.

4. Integração financeira
- Webhooks sincronizam assinaturas e eventos de cobrança com o banco principal.

5. Fronteira de domínio
- Regras de negócio vivem nas features e não em componentes de interface.

## 🚦 Feature Flags / System Status

Status consolidado por domínio com base na arquitetura e na estrutura atual do projeto.

### Booking

- ✅ Criar agendamento
  Fluxo base de criação está implementado para operação normal de marcações.

- ✅ Cancelar agendamento
  O domínio possui rotina dedicada de cancelamento e controle de estado.

- ✅ Suporte a ghost user
  O sistema aceita agendamento sem conta vinculada para atendimento por telefone/balcão.

- 🚧 Validação avançada de conflito
  Regras principais existem, mas cenários de borda de sobreposição e exceção ainda pedem refinamento contínuo.

- ❌ Reagendamento completo com trilha de histórico
  Não há fluxo consolidado com histórico formal de mudanças de horário.

### Barber

- ✅ Gestão de barbeiros
  Estrutura de domínio para cadastro e manutenção de profissionais está presente.

- ✅ Disponibilidade e pausas recorrentes
  Regras de agenda por dia da semana e intervalos de pausa fazem parte do modelo.

- 🚧 Exceções avançadas de agenda
  Exceções existem, porém dependem de evolução para casos complexos de operação.

- ❌ Gestão de capacidade dinâmica por slot
  Não há mecanismo consolidado para múltiplas capacidades por faixa de horário.

### Dashboard

- ✅ Dashboard administrativo e do barbeiro
  Rotas e módulos de dashboard estão estruturados para os contextos principais.

- 🚧 Métricas históricas avançadas
  Métricas operacionais existem, mas análises de longo prazo e comparativos ainda podem evoluir.

- ❌ Exportação de relatórios
  Não há fluxo formalizado de exportação em formatos como CSV/PDF.

### Payments / Subscriptions

- ✅ Integração com Stripe
  O projeto possui módulos de assinatura, cliente Stripe e webhook de sincronização.

- ✅ Modelo de planos e assinaturas
  Entidades de plano e assinatura suportam controle de status recorrente.

- 🚧 Tratamento avançado de falhas de cobrança
  Há base de cobrança, mas automações de recuperação e dunning podem ser ampliadas.

- ❌ Gestão self-service completa de billing
  Não há evidência de portal completo no produto para todas as operações de billing pelo usuário final.

### Authentication

- ✅ Login, cadastro e sessão
  Fluxos fundamentais de autenticação e sessão estão presentes.

- ✅ Controle de acesso por role
  A navegação protegida por contexto de usuário está definida na arquitetura.

- ✅ Verificação de conta e recuperação de senha
  Rotas e templates de e-mail para esses fluxos estão disponíveis.

- 🚧 Hardening adicional de segurança
  Itens como políticas avançadas de sessão e trilhas de auditoria podem ser aprofundados.

### Services

- ✅ CRUD de serviços
  O domínio de serviços está separado e com estrutura para manutenção de catálogo.

- ✅ Preço e duração por serviço
  A modelagem contempla preço e duração para cálculo da agenda.

- 🚧 Regras avançadas de precificação
  Cenários como preço dinâmico por horário/período ainda não aparecem como fluxo consolidado.

- ❌ Pacotes de serviços combinados
  Não há evidência de produto composto (combo) nativo no fluxo padrão.

### Ratings

- ✅ Avaliação de atendimento concluído
  O domínio de rating existe e está ligado ao ciclo de bookings.

- 🚧 Moderação e governança de avaliações
  Fluxos de revisão/moderação não aparecem como camada formal do domínio.

- ❌ Resposta pública a avaliações
  Não há recurso consolidado para resposta oficial da barbearia dentro da plataforma.

### Notifications (email, etc.)

- ✅ E-mails transacionais principais
  Projeto possui templates e utilitários para recuperação de senha e verificação de conta.

- 🚧 Notificações de ciclo operacional
  Notificações de confirmação, lembrete e alteração de booking ainda podem expandir cobertura.

- ❌ Central multicanal de notificações
  Não há módulo consolidado para orquestração unificada de e-mail, push e SMS.

## 📌 Current Limitations

- Algumas capacidades aparecem parcialmente no domínio, mas sem camada completa de produto (UX, automações e observabilidade).
- Fluxos avançados de agenda e billing ainda exigem evolução para cenários de borda em produção.
- O documento reflete o estado arquitetural atual e deve ser revisado periodicamente conforme novas releases.

## 🧭 Next Steps / Roadmap

1. Consolidar matriz de status por feature com versionamento por release.
2. Fechar lacunas de reagendamento e trilha de histórico de booking.
3. Evoluir billing self-service e automações de recuperação de pagamento.
4. Expandir notificações operacionais (confirmação, lembrete e pós-atendimento).
5. Ampliar observabilidade funcional por domínio (métricas, eventos e auditoria).

## 📚 Glossário de Termos

- Booking: agendamento de atendimento.
- Ghost user: cliente sem conta formal, registrado apenas para a operação de agendamento.
- Single-tenant: modelo com uma única barbearia operando múltiplos usuários e profissionais.
- Role: papel de acesso do usuário (Admin, Barber, User).
- Server Action: mutação no servidor com validação e tipagem fim a fim.
