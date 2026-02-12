import { NextRequest, NextResponse } from "next/server";

// ========================================
// CONFIGURAÇÃO
// ========================================
const PUBLIC_ROUTES = ["/", "/login", "/register", "/reset-password"];
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/reset-password",
  "/verify-account",
];
const PUBLIC_API_ROUTES = ["/api/auth", "/api/stripe/webhook"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ignorar arquivos estáticos e internos do Next
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Permitir APIs públicas sempre
  if (PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // ========================================
  // CORREÇÃO CRÍTICA AQUI (COOKIES)
  // ========================================
  // Em produção (HTTPS), o cookie pode ter prefixo __Secure-
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isUserLoggedIn = !!sessionToken;

  console.log(`Path: ${pathname} | LoggedIn: ${isUserLoggedIn}`);

  // 3. Redirecionar usuário logado longe das páginas de auth (Login/Register)
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isUserLoggedIn) {
      // Redireciona para onde o usuário "deveria" estar (Dashboard)
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Se não logado, deixa acessar login
    return NextResponse.next();
  }

  // 4. Proteção de Rotas Privadas
  // Lógica: Se a rota NÃO é pública E o usuário NÃO está logado -> Login
  // Usamos 'includes' para rotas exatas, mas considere adicionar startsWith se tiver subpáginas públicas
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!isPublicRoute && !isUserLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se passou por tudo, libera
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
