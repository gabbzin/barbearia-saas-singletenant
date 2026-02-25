import { type NextRequest, NextResponse } from "next/server";

// ========================================
// CONFIGURAÇÃO
// ========================================
const PUBLIC_ROUTES = ["/login", "/register", "/reset-password", "/"];
const AUTH_ROUTES = [
  "/login",
  "/register",
  "/reset-password",
  "/verify-account",
];
const PUBLIC_API_ROUTES = ["/api/auth", "/api/stripe/webhook"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(pathname);

  // 1. Filtros iniciais (estáticos e APIs públicas)
  if (
    pathname.startsWith("/_next") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/) ||
    PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  // Valida o token de autenticação e obtém a sessão do usuário
  const sessionResponse = await fetch(
    `${request.nextUrl.origin}/api/auth/get-session`,
    {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  const session = await sessionResponse.json();

  const isUserLoggedIn = !!session;
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  console.log(isUserLoggedIn, isAuthRoute);

  // REGRA: Se estou logado -> Vai pra /client (página principal do app)
  // REGRA SECUNDÁRIA: Se estou logado e estou em / -> Vai pra /client (evita que usuário logado veja a landing page)
  if (isUserLoggedIn && (pathname === "/" || isAuthRoute)) {
    return NextResponse.redirect(new URL("/client", request.url));
  }

  // REGRA: Se NÃO estou logado e a rota NÃO é pública -> vai para Login
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  if (!isPublicRoute && !isUserLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    // Evita loop se o callbackUrl for o próprio login
    if (pathname !== "/login") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
