// Helpers de autenticação (Compatíveis com Supabase ou Firebase)

export interface UserSession {
  uid: string;
  email: string | null;
  role: "admin" | "visitor";
}

export async function loginWithEmail(email: string, password: string): Promise<UserSession> {
  console.log("Tentativa de login com email:", email);
  // Simulação de login - Substituir pelo SDK do Firebase/Supabase
  if (email === "admin@txeneza.com" && password === "admin123") {
    return {
      uid: "admin-id-123",
      email,
      role: "admin",
    };
  }
  throw new Error("Credenciais inválidas");
}

export async function logout(): Promise<void> {
  console.log("Logout efetuado");
}

export function subscribeToAuthChanges(callback: (user: UserSession | null) => void) {
  // Callback de alteração de estado - Substituir pela subscrição correspondente
  // Ex: onAuthStateChanged(auth, ...) ou supabase.auth.onAuthStateChange(...)
  const timer = setTimeout(() => {
    // Retorna sessão mockada se necessário
    callback(null);
  }, 500);

  return () => clearTimeout(timer);
}
