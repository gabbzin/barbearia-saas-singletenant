# 🛡️ Guia Completo: Middlewares no Next.js

## 📚 Índice

- [O que é um Middleware?](#o-que-é-um-middleware)
- [Fluxo de Execução](#fluxo-de-execução)
- [Implementação no Projeto](#implementação-no-projeto)
- [Casos de Uso](#casos-de-uso)
- [Otimizações](#otimizações)
- [FAQ](#faq)

---

## 🤔 O que é um Middleware?

Um **middleware** no Next.js é uma função que **intercepta requisições** antes delas chegarem às páginas ou APIs. Ele roda no **Edge Runtime** (super rápido) e permite:

- ✅ Autenticação e autorização
- ✅ Redirecionamentos inteligentes
- ✅ Modificar headers de requisição/resposta
- ✅ Reescrever URLs (rewrites)
- ✅ Logs e analytics
- ✅ Rate limiting
- ✅ Geolocalização

---

## 🔄 Fluxo de Execução

### SEM Middleware (Situação Antiga)

```
1. Usuário acessa /admin/painel
2. Next.js carrega o layout de (protected)
3. Layout faz query no banco de dados
4. Se não autenticado → redirect
5. ❌ Problema: já processou React, fez query, gastou recursos
```

### COM Middleware (Situação Nova)

```
1. Usuário acessa /admin/painel
2. 🛡️ MIDDLEWARE intercepta ANTES de tudo
3. Verifica sessão (cookie)
4. Se não autenticado → redirect IMEDIATO
5. ✅ Nada foi processado, zero queries
```

---

## 🏗️ Implementação no Projeto

### Estrutura do Arquivo

```typescript
// middleware.ts (na raiz do projeto)

import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Seu código aqui
  
  return NextResponse.next(); // Permite continuar
  // OU
  return NextResponse.redirect(new URL('/login', request.url)); // Redireciona
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### Por que `middleware.ts` na raiz?

```
/home/gabriel/GitHub/barbearia-saas-singletenant/
├── app/                    ❌ NÃO aqui
├── lib/                    ❌ NÃO aqui
├── middleware.ts           ✅ SIM! Na raiz
├── package.json
└── ...
```

O Next.js **procura especificamente** por `middleware.ts` na raiz.

---

## 🎯 Casos de Uso no AgendaBarber

### 1. Proteger Rotas Autenticadas

```typescript
// Antes (no layout)
export default async function ProtectedLayout({ children }) {
  const session = await verifySession(); // 🐢 Query no banco
  
  if (!session) {
    redirect("/login");
  }
  
  return <>{children}</>;
}

// Depois (no middleware)
export async function middleware(request: NextRequest) {
  const session = await getSession(request); // ⚡ Cookie check apenas
  
  if (!session && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
```

**Performance:**
- Antes: ~50-100ms (query no Prisma)
- Depois: ~5-10ms (cookie check)

### 2. Controle de Acesso por Role

```typescript
// Exemplo: apenas ADMIN pode acessar /admin
if (pathname.startsWith('/admin')) {
  const userRole = session.user.role;
  
  if (userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// Exemplo: apenas BARBER ou ADMIN pode acessar /barber
if (pathname.startsWith('/barber')) {
  const userRole = session.user.role;
  
  if (!['BARBER', 'ADMIN'].includes(userRole)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
```

### 3. Prevenir Acesso ao Login Quando Já Logado

```typescript
// Rotas de autenticação
const AUTH_ROUTES = ['/login', '/register'];

if (AUTH_ROUTES.includes(pathname)) {
  // Se já está logado, vai para home
  if (session) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
```

### 4. Callback URL (Retornar após Login)

```typescript
// Usuário tenta acessar /admin/painel sem estar logado
if (!session && isProtectedRoute(pathname)) {
  const loginUrl = new URL('/login', request.url);
  
  // Salva para onde ele queria ir
  loginUrl.searchParams.set('callbackUrl', pathname);
  
  return NextResponse.redirect(loginUrl);
  // Redireciona para: /login?callbackUrl=/admin/painel
}

// Depois do login, redireciona de volta
// (isso você implementa na página de login)
```

### 5. Proteger APIs

```typescript
// Exemplo: API de criar agendamento
if (pathname.startsWith('/api') && !PUBLIC_API_ROUTES.includes(pathname)) {
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
```

---

## 🚀 Otimizações

### 1. Cache de Sessão

```typescript
// Evite fazer fetch toda vez
const SESSION_CACHE = new Map<string, { session: Session, expires: number }>();

async function getSession(request: NextRequest): Promise<Session | null> {
  const token = request.cookies.get("better-auth.session_token")?.value;
  
  if (!token) return null;
  
  // Check cache first
  const cached = SESSION_CACHE.get(token);
  if (cached && cached.expires > Date.now()) {
    return cached.session;
  }
  
  // Fetch e cache por 5 minutos
  const session = await fetchSession(token);
  
  if (session) {
    SESSION_CACHE.set(token, {
      session,
      expires: Date.now() + 5 * 60 * 1000 // 5 min
    });
  }
  
  return session;
}
```

### 2. Early Return Pattern

```typescript
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Retorna o mais cedo possível
  if (isStaticFile(pathname)) return NextResponse.next();
  if (isPublicAPI(pathname)) return NextResponse.next();
  if (isPublicRoute(pathname)) return NextResponse.next();
  
  // Só verifica sessão se realmente necessário
  const session = await getSession(request);
  
  // ... resto da lógica
}
```

### 3. Matcher Eficiente

```typescript
export const config = {
  // ❌ Ruim: roda em TUDO
  matcher: '/:path*',
  
  // ✅ Bom: exclui estáticos
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
  
  // ✅ Melhor ainda: especifica apenas o que precisa
  matcher: [
    '/admin/:path*',
    '/barber/:path*',
    '/bookings/:path*',
    '/api/:path*'
  ],
};
```

---

## 🔍 Debugging

### Adicionar Logs

```typescript
export async function middleware(request: NextRequest) {
  const start = Date.now();
  const { pathname } = request.nextUrl;
  
  console.log(`[Middleware] ${request.method} ${pathname}`);
  
  const session = await getSession(request);
  
  console.log(`[Middleware] Session: ${session ? '✓' : '✗'}`);
  console.log(`[Middleware] Took: ${Date.now() - start}ms`);
  
  return NextResponse.next();
}
```

### Headers Customizados

```typescript
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Adiciona headers para debug
  response.headers.set('x-middleware-ran', 'true');
  response.headers.set('x-user-role', session?.user.role || 'none');
  
  return response;
}
```

---

## ⚠️ Limitações do Edge Runtime

O middleware roda no **Edge Runtime**, que é mais limitado que Node.js:

### ❌ NÃO Funciona:
- `fs` (file system)
- `child_process`
- Alguns pacotes npm que dependem de Node.js APIs
- **Prisma Client** (não pode fazer queries diretas)

### ✅ Funciona:
- `fetch` API
- Cookies e Headers
- Chamadas HTTP
- JSON
- Crypto

### Solução: API Routes

```typescript
// ❌ NÃO FAÇA ISSO no middleware
const user = await prisma.user.findUnique({ where: { id } });

// ✅ FAÇA ISSO
// middleware.ts
const response = await fetch('/api/auth/session', {
  headers: { cookie: request.cookies.toString() }
});

// app/api/auth/session/route.ts
export async function GET(request: Request) {
  // Aqui pode usar Prisma normalmente
  const user = await prisma.user.findUnique(...);
  return Response.json(user);
}
```

---

## 📊 Comparação: Com vs Sem Middleware

| Aspecto | Sem Middleware | Com Middleware |
|---------|----------------|----------------|
| **Momento** | Depois do roteamento | Antes do roteamento |
| **Performance** | ~50-100ms | ~5-10ms |
| **Queries BD** | Múltiplas (por layout) | Zero (cookies apenas) |
| **Segurança** | Pode ser bypassado | Impossível bypasser |
| **Proteção API** | ❌ Não protege | ✅ Protege tudo |
| **Manutenção** | Espalhado em layouts | Centralizado |

---

## 🎯 Checklist de Implementação

- [ ] Criar `middleware.ts` na raiz
- [ ] Configurar `matcher` para rotas específicas
- [ ] Implementar função `getSession()`
- [ ] Definir rotas públicas/privadas
- [ ] Adicionar verificação de roles
- [ ] Implementar callback URLs
- [ ] Proteger APIs
- [ ] Testar todos os cenários:
  - [ ] Usuário não logado tentando acessar /admin
  - [ ] Usuário logado tentando acessar /login
  - [ ] USER tentando acessar rota de ADMIN
  - [ ] BARBER acessando /barber
  - [ ] APIs sem autenticação
- [ ] Remover verificações duplicadas dos layouts
- [ ] Adicionar logs para debug (dev only)
- [ ] Testar performance

---

## 🔧 Integração com Better Auth

O Better Auth já fornece helpers para middleware:

```typescript
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // Better Auth fornece um helper de sessão
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  
  // ... resto da lógica
}
```

---

## 📚 FAQ

### Q: Middleware substitui os layouts de proteção?

**A:** Sim e não. O middleware faz a **primeira linha de defesa**, mas você ainda pode ter lógica adicional nos layouts (ex: buscar dados do usuário específicos).

### Q: Posso ter múltiplos middlewares?

**A:** Não nativamente, mas você pode compor funções:

```typescript
export async function middleware(request: NextRequest) {
  let response = NextResponse.next();
  
  response = await authMiddleware(request, response);
  response = await rateLimitMiddleware(request, response);
  response = await loggingMiddleware(request, response);
  
  return response;
}
```

### Q: Middleware funciona em desenvolvimento e produção?

**A:** Sim! Funciona em ambos. Em dev roda no Node.js, em produção no Edge.

### Q: Como testar?

```typescript
// middleware.test.ts (conceitual)
describe('Middleware', () => {
  it('redireciona não autenticados', async () => {
    const request = new NextRequest('http://localhost/admin');
    const response = await middleware(request);
    
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/login');
  });
});
```

---

## 🎓 Próximos Passos

1. **Implementar o middleware**: Use o arquivo criado como base
2. **Testar**: Acesse diferentes rotas e veja os logs
3. **Remover verificações duplicadas**: Limpe os layouts que não precisam mais verificar sessão
4. **Monitorar performance**: Compare antes/depois
5. **Adicionar rate limiting**: Próximo nível de segurança

---

## 📖 Recursos

- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)
- [Better Auth + Next.js](https://www.better-auth.com/docs/integrations/next)

---

**💡 Dica Final**: O middleware é **essencial** para aplicações em produção. Não é opcional se você quer segurança real!
