Você é um engenheiro de software sênior especializado em Next.js, SaaS e aplicações prontas para produção.

Analise TODO o projeto atual de forma profunda e sistemática, como se ele fosse ser vendido para um cliente real.

Objetivo:
Validar se o projeto está pronto para PRODUÇÃO e COMERCIALIZAÇÃO.

Faça as verificações abaixo e gere um relatório técnico claro e acionável.

1. Arquitetura & Estrutura
- Organização de pastas (app/, shared/, features/, services, etc)
- Separação de responsabilidades
- Padrões consistentes de nomenclatura
- Uso correto do App Router e Server/Client Components

2. Next.js & Produção
- Uso correto de `next/image` (domínios, fallback, otimização)
- Uso correto de `next/font`
- Server Actions, cache, revalidate, dynamic/static rendering
- Possíveis problemas com Turbopack
- Rotas protegidas e middleware
- Build production (`next build`) — possíveis falhas

3. Segurança
- Autenticação e autorização
- Proteção de rotas privadas
- Validação de dados no backend
- Uso seguro de variáveis de ambiente
- Vazamento de dados sensíveis
- Possíveis ataques comuns (XSS, CSRF, etc)

4. Performance
- Componentes que poderiam ser Server Components
- Renderizações desnecessárias
- Uso correto de `useEffect`
- Queries repetidas
- Possíveis gargalos de performance
- Otimização de imagens e assets

5. UX/UI
- Estados de loading, empty e error
- Feedback visual para ações do usuário
- Responsividade (mobile-first)
- Consistência visual
- Possíveis pontos de confusão para usuários reais

6. Código & Qualidade
- Tipagem TypeScript
- Uso de `any`
- Funções grandes ou complexas
- Código morto ou não utilizado
- Logs esquecidos
- Comentários desnecessários ou ausentes

7. Pronto para venda?
- Pontos que impedem a venda imediata
- Riscos técnicos
- Melhorias obrigatórias vs opcionais
- O que um cliente poderia reclamar nos primeiros 7 dias

Formato da resposta:
- Resumo executivo (1–2 parágrafos)
- Lista de PROBLEMAS CRÍTICOS (bloqueiam produção)
- Lista de MELHORIAS IMPORTANTES
- Lista de MELHORIAS FUTURAS
- Checklist final de "Pronto para Produção" (Sim / Quase / Não)

Seja direto, técnico e honesto.
Não economize nos detalhes.