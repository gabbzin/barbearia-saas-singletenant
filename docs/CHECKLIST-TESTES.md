# ✅ Checklist: Preparação para Testes com Usuário Real

**Data:** 12 de fevereiro de 2026  
**Contexto:** Enviar para barbeiro amigo testar por alguns dias  
**Ambiente:** Desenvolvimento/Staging (não é produção final)

---

## 🎯 Status Geral: **PRONTO PARA TESTES** ✅

O projeto está funcional e pode ser testado por um usuário real. Não está perfeito, mas está **usável**.

---

## ✅ Checklist Pré-Teste (Obrigatório)

### 1. **Ambiente e Dados**

- [x] Banco de dados configurado
- [ ] Rodar seed para criar dados de exemplo
- [ ] Criar conta de barbeiro para seu amigo
- [ ] Criar alguns clientes fake para testes
- [ ] Adicionar alguns serviços de exemplo

```bash
# Execute no terminal:
pnpm prisma db seed
```

### 2. **Deploy Local ou Tunnel**

Escolha UMA das opções:

**Opção A: Localhost + Ngrok (Mais Rápido)**

```bash
# Terminal 1: Inicie o projeto
pnpm dev

# Terminal 2: Crie um tunnel público
ngrok http 3000
# Copie a URL https://xxx.ngrok.io e envie pro barbeiro
```

**Opção B: Deploy na Vercel (Mais Profissional)**

```bash
vercel --prod
# URL: https://seu-projeto.vercel.app
```

### 3. **Credenciais de Teste**

Crie e envie para ele:

```
📱 CREDENCIAIS DE ACESSO

URL: [sua-url-aqui]

👤 Login:
Email: barbeiro@teste.com
Senha: Teste@123

🎯 O que testar:
- Visualizar agenda
- Adicionar horários disponíveis
- Ver agendamentos dos clientes
- Editar perfil
```

### 4. **Stripe em Modo Teste**

- [x] Já está configurado com chaves de teste
- [ ] Avisar que pagamentos são fake (modo teste)

### 5. **Google OAuth (Opcional)**

- [ ] Se for usar login com Google, configure as URLs de redirect
- [ ] Ou desabilite temporariamente

---

## ⚠️ Avisos Importantes para o Testador

Crie um documento simples para seu amigo:

```markdown
# 🧪 GUIA DE TESTES - AgendaBarber

Olá! Obrigado por testar o sistema. Algumas informações:

## ⚠️ Isso é um TESTE

- Este não é o sistema final
- Podem haver bugs (e tudo bem!)
- Seus dados podem ser apagados
- Pagamentos estão em MODO TESTE (nada é cobrado)

## 📝 O que preciso que você teste:

### Básico (Prioridade Alta)

- [ ] Conseguiu fazer login?
- [ ] Consegue ver sua agenda?
- [ ] Consegue adicionar horários disponíveis?
- [ ] Consegue ver agendamentos dos clientes?
- [ ] Consegue cancelar agendamentos?

### Intermediário

- [ ] Layout é intuitivo?
- [ ] Está rápido ou lento?
- [ ] Funciona no celular?
- [ ] Conseguiu usar sem travar?

### Feedback

- O que achou confuso?
- O que faltou?
- O que poderia melhorar?
- Encontrou algum erro?

## 🐛 Se der erro:

1. Tira print se possível
2. Anota o que estava fazendo
3. Me manda no zap

## 📱 Contato

WhatsApp: [seu-número]
```

---

## 🔧 Preparação Técnica (5 minutos)

Execute estes comandos antes de enviar:

```bash
# 1. Limpa e reinstala (garantir que está ok)
pnpm install

# 2. Gera Prisma Client atualizado
pnpm prisma generate

# 3. Aplica migrations
pnpm prisma migrate dev

# 4. Popula banco com dados de exemplo
pnpm prisma db seed

# 5. Testa build (certifica que não quebra)
pnpm build

# 6. Inicia em modo dev
pnpm dev
```

---

## 📊 Funcionalidades Prontas para Teste

### ✅ Funcionando

- [x] Login/Registro (email + senha)
- [x] Login com Google OAuth
- [x] Dashboard do barbeiro
- [x] Visualizar agenda
- [x] Adicionar/editar horários disponíveis
- [x] Ver agendamentos
- [x] Cancelar agendamentos
- [x] Sistema de assinaturas (Stripe test mode)
- [x] Envio de emails (recuperação de senha)
- [x] Upload de imagens (perfil)
- [x] Responsivo (mobile)

### ⚠️ Funciona mas pode ter bugs

- Validações de horários conflitantes
- Timezone (fuso horário)
- Notificações por email

### ❌ Ainda não implementado

- Notificações push
- Chat interno
- Relatórios financeiros avançados
- App mobile nativo

---

## 🐛 Bugs Conhecidos (Avisar o testador)

1. **Console.logs aparecem**: Mensagens no console (sem problema)
2. **Emails podem cair no spam**: Verificar pasta de spam
3. **Recarregamento manual às vezes**: Se algo não atualizar, dar F5

---

## 📱 Fluxo de Teste Recomendado

### Dia 1: Setup e Primeira Impressão

1. Acessa o sistema
2. Faz login
3. Explora o dashboard
4. Adiciona 2-3 horários disponíveis

### Dia 2: Uso Normal

1. Verifica se horários aparecem
2. Simula agendamentos (você pode criar como cliente)
3. Testa cancelamento

### Dia 3: Mobile

1. Abre no celular
2. Testa funcionalidades principais
3. Verifica se é fácil de usar

### Dia 4-7: Uso Real (se possível)

1. Usa como se fosse de verdade
2. Anota tudo que achar estranho
3. Feedback final

---

## 🎯 Métricas de Sucesso

O teste é um **SUCESSO** se:

- [ ] Barbeiro conseguiu usar sem travamentos críticos
- [ ] Interface ficou clara (mesmo sem tutorial)
- [ ] Funcionalidades principais funcionaram
- [ ] Ele conseguiu completar pelo menos 3 agendamentos fake

O teste **PRECISA MELHORAR** se:

- Travou muito
- Não conseguiu entender como usar
- Perdeu dados
- Teve erro ao agendar/cancelar

---

## 🚀 Após os Testes

### Coleta Feedback

```markdown
1. Nota de 0-10 para facilidade de uso
2. O que mais gostou?
3. O que mais achou ruim?
4. Usaria no dia a dia?
5. O que é ESSENCIAL adicionar?
```

### Priorize Correções

1. **Bugs críticos** (quebram funcionalidade): URGENTE
2. **UX confusa** (difícil de usar): IMPORTANTE
3. **Features faltando**: AVALIAR
4. **Melhorias visuais**: DEPOIS

---

## ⏰ Timeline Sugerido

```
Hoje:       Setup + Deploy
Amanhã:     Enviar credenciais pro barbeiro
Dia 2-7:    Ele usa e anota feedbacks
Dia 8:      Call rápida pra coletar feedback
Dia 9-10:   Você corrige bugs críticos
```

---

## 🆘 Se Algo Der Errado

### Erro ao fazer login

```bash
# Verifica se o banco está ok
pnpm prisma studio
```

### Erro ao agendar

- Veja console do navegador (F12)
- Veja terminal do servidor
- Me manda o erro

### Sistema não carrega

- Verifica se `pnpm dev` está rodando
- Se usando ngrok, verifica se o tunnel está ativo
- Testa pelo localhost antes

---

## 📞 Suporte Rápido

**Durante os testes, fique disponível para:**

- Mensagens rápidas no WhatsApp
- Resolver bloqueadores urgentes
- Resetar dados se necessário

**Comando útil para resetar tudo:**

```bash
pnpm prisma migrate reset
pnpm prisma db seed
```

---

## ✨ Dica Final

**NÃO SE PREOCUPE COM PERFEIÇÃO!**

O objetivo é:

1. ✅ Ver se funciona no uso real
2. ✅ Identificar o que está confuso
3. ✅ Descobrir o que falta
4. ✅ Pegar bugs que você não viu

Bugs e feedbacks negativos são **ÓTIMOS** nessa fase! 🎉

---

## 📋 Resumo Executivo

| Item          | Status        | Ação                  |
| ------------- | ------------- | --------------------- |
| Código        | ✅ Sem erros  | Nenhuma               |
| Banco         | ⚠️ Needs seed | `pnpm prisma db seed` |
| Deploy        | ⏳ Pendente   | Ngrok ou Vercel       |
| Docs testador | ⏳ Criar      | Usar template acima   |
| Credenciais   | ⏳ Criar      | Criar conta barbeiro  |

**Tempo total de preparação: ~15 minutos** ⏱️

---

**BORA TESTAR! 🚀**
