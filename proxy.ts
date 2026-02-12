import { NextRequest, NextResponse } from "next/server";

// ========================================
// CONFIGURAÇÃO DE ROTAS
// ========================================
const PUBLIC_ROUTES = ["/", "/login", "/register", "/reset-password"];
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/reset-password",
  "/verify-account",
];
// Removi as verificações de role daqui, faremos isso no Layout/Page
const PUBLIC_API_ROUTES = ["/api/auth", "/api/stripe/webhook"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ignorar estáticos e APIs públicas
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/) ||
    PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  // 2. Verificação "Otimista" (Apenas checa se o cookie existe)
  // Não fazemos fetch aqui para evitar o Timeout da Vercel
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;
  const isUserLoggedIn = !!sessionToken;

  // 3. Redirecionamento de Rotas de Auth (Login/Register)
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isUserLoggedIn) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 4. Proteção básica de rotas privadas
  // Se tentar acessar qualquer coisa que NÃO seja pública e NÃO estiver logado
  if (!PUBLIC_ROUTES.includes(pathname) && !isUserLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // NOTA: A verificação de ROLE (Admin/Barber) deve ser movida para o
  // Server Component (layout.tsx ou page.tsx) dessas rotas.
  // O Middleware deixa passar se tiver o cookie, e o Server Component expulsa se a role estiver errada.

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
