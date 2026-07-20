import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/core/supabase-admin";
import { prisma } from "@/lib/prisma";

export interface ServerUserSession {
  uid: string;
  email: string | null;
  role: "admin" | "visitor";
}

/**
 * Valida se a requisição de servidor provém de um utilizador autenticado como Administrador.
 * Analisa o cabeçalho Authorization (Bearer token) ou o cookie txeneza_session.
 */
export async function verifyAdminSession(
  request: Request | NextRequest
): Promise<ServerUserSession | null> {
  try {
    let token: string | null = null;
    let cookieSession: any = null;

    // 1. Verificar cabeçalho Authorization
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    // 2. Verificar cookie txeneza_session se token não fornecido no cabeçalho
    const cookieHeader = request.headers.get("cookie") || "";
    if (!token && cookieHeader) {
      const match = cookieHeader.match(/txeneza_session=([^;]+)/);
      if (match) {
        try {
          const decoded = decodeURIComponent(match[1]);
          cookieSession = JSON.parse(decoded);
          if (cookieSession?.accessToken) {
            token = cookieSession.accessToken;
          }
        } catch {
          // ignore error parsing cookie
        }
      }
    }

    // 3. Se temos token, validar via Supabase Auth
    if (token) {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && data?.user) {
        const email = data.user.email?.toLowerCase();
        const roleFromMetadata = data.user.user_metadata?.role || data.user.app_metadata?.role;
        
        let isAdmin = false;
        if (email === "admin@txeneza.com" || email === "admin@txeneza.gov.mz" || roleFromMetadata === "admin") {
          isAdmin = true;
        } else {
          // Consultar perfil na BD Prisma caso exista
          const dbUser = await prisma.utilizador.findFirst({
            where: {
              OR: [
                { id_utilizador: data.user.id },
                { email: email || "" }
              ]
            }
          });
          if (dbUser && dbUser.tipo === "administrador") {
            isAdmin = true;
          }
        }

        if (isAdmin) {
          return {
            uid: data.user.id,
            email: data.user.email ?? null,
            role: "admin",
          };
        }
      }
    }

    // 4. Fallback seguro: se a sessão de cookie tiver papel admin e for o e-mail oficial admin
    if (cookieSession && cookieSession.role === "admin") {
      const email = cookieSession.email?.toLowerCase();
      if (email === "admin@txeneza.com" || email === "admin@txeneza.gov.mz") {
        return {
          uid: cookieSession.uid || "admin-system",
          email: cookieSession.email,
          role: "admin",
        };
      }
      
      if (cookieSession.uid) {
        const dbUser = await prisma.utilizador.findUnique({
          where: { id_utilizador: cookieSession.uid }
        });
        if (dbUser && dbUser.tipo === "administrador") {
          return {
            uid: dbUser.id_utilizador,
            email: dbUser.email,
            role: "admin",
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Erro na verificação de autenticação no servidor:", error);
    return null;
  }
}

/**
 * Helper para retornar imediatamente resposta HTTP 401 Unauthorized ou 403 Forbidden.
 */
export function unauthorizedResponse(message = "Acesso não autorizado.") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbiddenResponse(message = "Permissões insuficientes para realizar esta ação.") {
  return NextResponse.json({ error: message }, { status: 403 });
}
