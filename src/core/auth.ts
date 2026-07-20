import { supabase } from "./supabase";
import { cookiesManager } from "@/lib/cookies";

export interface UserSession {
  uid: string;
  email: string | null;
  role: "admin" | "visitor";
  accessToken?: string;
}

/**
 * Utilitário interno para determinar com segurança se o utilizador possui o papel de administrador.
 * Elimina a heurística vulnerável baseada em substring (includes("admin")).
 */
function checkIsAdmin(user: { email?: string | null; user_metadata?: Record<string, any>; app_metadata?: Record<string, any> }): boolean {
  if (!user) return false;
  const email = user.email?.toLowerCase();
  
  // Exact admin emails fallback
  if (email === "admin@txeneza.com" || email === "admin@txeneza.gov.mz") {
    return true;
  }
  
  // Metadata claims check
  if (user.user_metadata?.role === "admin" || user.app_metadata?.role === "admin") {
    return true;
  }

  return false;
}

/**
 * Autentica o utilizador utilizando o Supabase Auth.
 */
export async function loginWithEmail(email: string, password: string): Promise<UserSession> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Não foi possível carregar os dados da sessão.");
  }

  const role = checkIsAdmin(data.user) ? "admin" : "visitor";
  
  const sessionData: UserSession = {
    uid: data.user.id,
    email: data.user.email ?? null,
    role,
    accessToken: data.session?.access_token,
  };

  // Salva no cookie imediatamente após login bem-sucedido
  cookiesManager.set("txeneza_session", JSON.stringify(sessionData), 7);

  return sessionData;
}

/**
 * Encerra a sessão atual no Supabase.
 */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  // Remove o cookie ao fazer logout
  cookiesManager.delete("txeneza_session");
}

/**
 * Ouve eventos de alteração de autenticação (login/logout/token expirado).
 */
export function subscribeToAuthChanges(callback: (user: UserSession | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
    if (session?.user) {
      const role = checkIsAdmin(session.user) ? "admin" : "visitor";
      const sessionData: UserSession = {
        uid: session.user.id,
        email: session.user.email ?? null,
        role,
        accessToken: session.access_token,
      };
      
      // Atualiza o cookie
      cookiesManager.set("txeneza_session", JSON.stringify(sessionData), 7);
      callback(sessionData);
    } else {
      cookiesManager.delete("txeneza_session");
      callback(null);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}
