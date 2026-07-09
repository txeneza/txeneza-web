import { supabase } from "./supabase";
import { cookiesManager } from "@/lib/cookies";

export interface UserSession {
  uid: string;
  email: string | null;
  role: "admin" | "visitor";
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

  // Verifica o papel (role) do utilizador nos metadados da conta, com fallback para admin baseado no e-mail
  const isAdminEmail = data.user.email?.includes("admin") || data.user.email === "admin@txeneza.com";
  const role = isAdminEmail ? "admin" : ((data.user.user_metadata?.role as "admin" | "visitor") || "visitor");
  
  const sessionData: UserSession = {
    uid: data.user.id,
    email: data.user.email ?? null,
    role,
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
 * Ouve eventos de alteração de autenticação (login/logout/token expetirado).
 */
export function subscribeToAuthChanges(callback: (user: UserSession | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
    if (session?.user) {
      const isAdminEmail = session.user.email?.includes("admin") || session.user.email === "admin@txeneza.com";
      const role = isAdminEmail ? "admin" : ((session.user.user_metadata?.role as "admin" | "visitor") || "visitor");
      const sessionData: UserSession = {
        uid: session.user.id,
        email: session.user.email ?? null,
        role,
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
