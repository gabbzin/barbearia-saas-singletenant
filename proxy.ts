import { NextRequest, NextResponse } from "next/server";
import type { Session } from "./lib/auth-client";

// ========================================
// CONFIGURAÇÃO DE ROTAS
// ========================================

// Rotas públicas (qualquer um pode acessar)
const PUBLIC_ROUTES = ["/", "/login", "/register", "/reset-password"];

// Rotas de autenticação (apenas não-logados)
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/reset-password",
  "/verify-account",
];

// Rotas protegidas por role
const ADMIN_ROUTES = ["/admin"];
const BARBER_ROUTES = ["/barber"];

// Rotas de API públicas
const PUBLIC_API_ROUTES = ["/api/auth", "/api/stripe/webhook"];

// ========================================
// FUNÇÃO AUXILIAR - VERIFICAR SESSÃO
// ========================================

async function getSession(request: NextRequest): Promise<Session | null> {
  try {
    // Better Auth armazena o token no cookie "better-auth.session_token"
    const sessionToken = request.cookies.get(
      "better-auth.session_token",
    )?.value;

    if (!sessionToken) {
      return null;
    }

    // Valida a sessão fazendo uma requisição interna para a API do Better Auth
    const response = await fetch(
      new URL("/api/auth/get-session", request.url).toString(),
      {
        headers: {
          cookie: request.cookies.toString(),
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    // Os dados do usuário estão em data {session e user}
    return data || null;
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    return null;
  }
}

// ========================================
// PROXY PRINCIPAL
// ========================================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Permitir arquivos estáticos e Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Permitir APIs públicas (webhooks, auth, etc)
  if (PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 3. Verificar sessão do usuário
  const session = await getSession(request);

  // 4. Rotas públicas (homepage, etc)
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // 5. Rotas de autenticação (login, register)
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    // Se já está logado, redireciona para dashboard
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 6. Rotas protegidas - exige autenticação
  if (!session) {
    // Salva a URL original para redirecionar após login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 7. Verificar permissões por role
  const userRole = session.user.role as string;

  // Rotas de ADMIN - apenas administradores
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Rotas de BARBEIRO - apenas barbeiros
  if (BARBER_ROUTES.some((route) => pathname.startsWith(route))) {
    if (userRole !== "BARBER" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 8. Permitir acesso
  return NextResponse.next();
}

// ========================================
// CONFIGURAÇÃO - MATCHER
// ========================================

// Define em quais rotas o middleware deve rodar
// (evita rodar em TODOS os arquivos estáticos)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
