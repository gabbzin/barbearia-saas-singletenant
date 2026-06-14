import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

export type GraphQLContext = {
  prisma: typeof prisma;
  userId: string | null;
  userRole: UserRole | null;
};

export async function createContext(request: Request): Promise<GraphQLContext> {
  try {
    const { auth } = await import("@/lib/auth");
    const session = await auth.api.getSession({ headers: request.headers });
    const user = session?.user as { id: string; role?: string } | null | undefined;
    return {
      prisma,
      userId: user?.id ?? null,
      userRole: (user?.role as UserRole) ?? null,
    };
  } catch {
    return { prisma, userId: null, userRole: null };
  }
}
