// // ========================================
// // EXEMPLO 1: Proteger Rota de Admin
// // ========================================

// // ❌ ANTES - No Layout (app/(protected)/admin/layout.tsx)
// export default async function AdminLayout({ children }: { children: React.ReactNode }) {
//   const session = await verifySession(); // 🐢 Query no banco
  
//   if (!session) {
//     redirect("/login"); // Já processou React
//   }
  
//   if (session.user.role !== "ADMIN") {
//     redirect("/"); // Já fez queries desnecessárias
//   }
  
//   return <>{children}</>;
// }

// // ✅ DEPOIS - No Middleware (middleware.ts)
// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
  
//   if (pathname.startsWith('/admin')) {
//     const session = await getSession(request); // ⚡ Apenas cookie
    
//     if (!session) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
    
//     if (session.user.role !== 'ADMIN') {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
//   }
  
//   return NextResponse.next();
// }

// // ========================================
// // EXEMPLO 2: Proteger API Routes
// // ========================================

// // ❌ ANTES - Verificação em cada API
// // app/api/bookings/route.ts
// export async function POST(request: Request) {
//   const session = await verifySession(); // Repete em cada API
  
//   if (!session) {
//     return Response.json({ error: "Unauthorized" }, { status: 401 });
//   }
  
//   // Lógica da API...
// }

// // ✅ DEPOIS - Middleware protege automaticamente
// // middleware.ts (protege TODAS as APIs)
// if (pathname.startsWith('/api') && !isPublicAPI(pathname)) {
//   const session = await getSession(request);
  
//   if (!session) {
//     return NextResponse.json(
//       { error: 'Unauthorized' },
//       { status: 401 }
//     );
//   }
// }

// // app/api/bookings/route.ts (código limpo)
// export async function POST(request: Request) {
//   // Já está protegido pelo middleware! 🎉
//   // Pode ir direto para a lógica
  
//   const body = await request.json();
//   const booking = await createBooking(body);
  
//   return Response.json(booking);
// }

// // ========================================
// // EXEMPLO 3: Redirect com Callback URL
// // ========================================

// // ❌ ANTES - Perde a URL original
// export default async function ProtectedLayout({ children }) {
//   const session = await verifySession();
  
//   if (!session) {
//     redirect("/login"); // Usuário perde onde queria ir
//   }
  
//   return <>{children}</>;
// }

// // ✅ DEPOIS - Salva e retorna para URL original
// // middleware.ts
// if (!session && isProtectedRoute(pathname)) {
//   const loginUrl = new URL('/login', request.url);
//   loginUrl.searchParams.set('callbackUrl', pathname);
  
//   return NextResponse.redirect(loginUrl);
//   // Redireciona para: /login?callbackUrl=/admin/painel
// }

// // app/(auth)/login/page.tsx
// 'use client';

// export default function LoginPage() {
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get('callbackUrl') || '/';
  
//   const handleLogin = async () => {
//     await signIn({ /* ... */ });
    
//     // Após login bem-sucedido, redireciona para onde queria ir
//     router.push(callbackUrl);
//   };
  
//   return (
//     <form onSubmit={handleLogin}>
//       {/* Formulário de login */}
//     </form>
//   );
// }

// // ========================================
// // EXEMPLO 4: Prevenir Acesso ao Login Quando Logado
// // ========================================

// // ❌ ANTES - Usuário logado pode acessar /login
// // Não havia verificação

// // ✅ DEPOIS - Redireciona automaticamente
// // middleware.ts
// const AUTH_ROUTES = ['/login', '/register', '/reset-password'];

// if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
//   const session = await getSession(request);
  
//   if (session) {
//     // Já está logado, vai para home
//     return NextResponse.redirect(new URL('/', request.url));
//   }
// }

// // ========================================
// // EXEMPLO 5: Controle Granular por Role
// // ========================================

// // ❌ ANTES - Verificação espalhada em vários lugares
// // app/(protected)/barber/page.tsx
// export default async function BarberPage() {
//   const session = await verifySession();
  
//   if (!['BARBER', 'ADMIN'].includes(session.user.role)) {
//     redirect('/');
//   }
  
//   return <div>Dashboard Barbeiro</div>;
// }

// // ✅ DEPOIS - Centralizado no middleware
// // middleware.ts
// const ROLE_ROUTES = {
//   '/admin': ['ADMIN'],
//   '/barber': ['BARBER', 'ADMIN'],
//   '/user': ['USER', 'BARBER', 'ADMIN'],
// };

// Object.entries(ROLE_ROUTES).forEach(([route, allowedRoles]) => {
//   if (pathname.startsWith(route)) {
//     const userRole = session.user.role as string;
    
//     if (!allowedRoles.includes(userRole)) {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
//   }
// });

// // ========================================
// // EXEMPLO 6: Performance - Comparação Real
// // ========================================

// // ❌ ANTES - Layout faz múltiplas queries
// export default async function ProtectedLayout({ children }) {
//   const session = await verifySession(); // Query 1: ~50ms
  
//   const plans = await prisma.plan.findFirstOrThrow({ // Query 2: ~30ms
//     where: { name: "FREE" },
//   });
  
//   if (session?.id) {
//     await prisma.subscription.upsert({ // Query 3: ~40ms
//       // ... upsert subscription
//     });
//   }
  
//   if (!session) {
//     redirect("/login"); // Já gastou 120ms em queries
//   }
  
//   return <>{children}</>;
// }
// // Total: ~120ms + processamento React

// // ✅ DEPOIS - Middleware verifica apenas cookie
// export async function middleware(request: NextRequest) {
//   const session = await getSession(request); // ~5ms (cookie)
  
//   if (!session) {
//     return NextResponse.redirect(new URL('/login', request.url));
//     // Economizou 115ms e evitou 3 queries!
//   }
  
//   return NextResponse.next();
// }
// // Total: ~5ms
// // Ganho: 96% mais rápido!

// // ========================================
// // EXEMPLO 7: Logs e Analytics
// // ========================================

// // ✅ Middleware permite tracking centralizado
// export async function middleware(request: NextRequest) {
//   const start = Date.now();
//   const { pathname } = request.nextUrl;
  
//   const session = await getSession(request);
  
//   // Log estruturado
//   console.log({
//     timestamp: new Date().toISOString(),
//     method: request.method,
//     path: pathname,
//     userId: session?.user.id,
//     userRole: session?.user.role,
//     duration: Date.now() - start,
//     ip: request.ip,
//     userAgent: request.headers.get('user-agent'),
//   });
  
//   // Pode enviar para analytics (Amplitude, Mixpanel, etc)
//   // await trackPageView({ userId, pathname });
  
//   return NextResponse.next();
// }

// // ========================================
// // EXEMPLO 8: Rate Limiting (Bonus)
// // ========================================

// // ✅ Implementação básica de rate limiting
// const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// export async function middleware(request: NextRequest) {
//   const ip = request.ip || 'unknown';
//   const now = Date.now();
  
//   let ratelimit = rateLimitMap.get(ip);
  
//   if (!ratelimit || ratelimit.resetAt < now) {
//     // Reset a cada minuto
//     ratelimit = { count: 0, resetAt: now + 60000 };
//     rateLimitMap.set(ip, ratelimit);
//   }
  
//   ratelimit.count++;
  
//   // Limite: 100 requests por minuto
//   if (ratelimit.count > 100) {
//     return NextResponse.json(
//       { error: 'Too many requests' },
//       { status: 429 }
//     );
//   }
  
//   return NextResponse.next();
// }

// // ========================================
// // EXEMPLO 9: Headers Customizados
// // ========================================

// // ✅ Adicionar informações no header para as páginas usarem
// export async function middleware(request: NextRequest) {
//   const session = await getSession(request);
//   const response = NextResponse.next();
  
//   // Adiciona headers customizados
//   if (session) {
//     response.headers.set('x-user-id', session.user.id);
//     response.headers.set('x-user-role', session.user.role);
//   }
  
//   response.headers.set('x-request-id', crypto.randomUUID());
//   response.headers.set('x-middleware-version', '1.0.0');
  
//   return response;
// }

// // As páginas podem ler esses headers
// // import { headers } from 'next/headers';
// // 
// // export default async function Page() {
// //   const headersList = headers();
// //   const userRole = headersList.get('x-user-role');
// //   
// //   return <div>Your role: {userRole}</div>;
// // }

// // ========================================
// // EXEMPLO 10: Matcher Configurations
// // ========================================

// // ❌ RUIM - Roda em TUDO (super lento)
// export const config = {
//   matcher: '/:path*',
// };

// // ✅ BOM - Exclui estáticos
// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico).*)',
//   ],
// };

// // ✅ MELHOR - Específico para suas rotas
// export const config = {
//   matcher: [
//     '/admin/:path*',      // Todas rotas admin
//     '/barber/:path*',     // Todas rotas barbeiro
//     '/bookings/:path*',   // Todas rotas bookings
//     '/api/:path*',        // Todas APIs
//     '/',                  // Homepage
//   ],
// };

// // ✅ ÓTIMO - Com exclusões específicas
// export const config = {
//   matcher: [
//     /*
//      * Match all routes except:
//      * - API auth (public)
//      * - Webhooks (public)
//      * - Static files
//      */
//     '/((?!api/auth|api/stripe/webhook|_next/static|_next/image|favicon.ico).*)',
//   ],
// };
