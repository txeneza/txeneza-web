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
  * Formata mensagens de erro técnicas do Supabase/Rede para mensagens amigáveis em português.
  */
function formatAuthError(message: string): string {
  const msg = (message || "").toLowerCase();

  if (msg.includes("failed to fetch") || msg.includes("typeerror") || msg.includes("networkerror")) {
    return "Não foi possível estabelecer ligação ao servidor. Verifique a sua ligação à internet ou se as chaves do Supabase no ficheiro .env estão corretas.";
  }
  if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
    return "E-mail ou palavra-passe incorretos. Por favor, verifique os seus dados de acesso.";
  }
  if (msg.includes("email not confirmed")) {
    return "O seu e-mail ainda não foi confirmado. Por favor, verifique a sua caixa de entrada.";
  }
  if (msg.includes("user not found")) {
    return "Não foi encontrada nenhuma conta associada a este endereço de e-mail.";
  }
  if (msg.includes("too many requests") || msg.includes("rate limit")) {
    return "Demasiadas tentativas de acesso. Por favor, aguarde alguns minutos antes de tentar novamente.";
  }

  return message || "Ocorreu um erro ao tentar autenticar. Por favor, tente novamente.";
}

/**
 * Autentica o utilizador utilizando o Supabase Auth.
 */
export async function loginWithEmail(email: string, password: string): Promise<UserSession> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(formatAuthError(error.message));
    }

    if (!data?.user) {
      throw new Error("Não foi possível carregar os dados da sessão do utilizador.");
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
  } catch (err: any) {
    throw new Error(formatAuthError(err.message));
  }
}

/**
 * Encerra a sessão atual no Supabase.
 */
export async function logout(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(formatAuthError(error.message));
    }
  } catch (err: any) {
    console.error("Erro ao encerrar sessão:", err);
  } finally {
    // Garante que o cookie local seja sempre limpo
    cookiesManager.delete("txeneza_session");
  }
}

/**
 * Ouve eventos de alteração de autenticação (login/logout/token expirado).
 */
export function subscribeToAuthChanges(callback: (user: UserSession | null) => void) {
  try {
    const result = supabase.auth.onAuthStateChange((_event: any, session: any) => {
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
      result?.data?.subscription?.unsubscribe();
    };
  } catch (error) {
    console.error("Erro ao registar ouvinte de autenticação:", error);
    return () => {};
  }
}
