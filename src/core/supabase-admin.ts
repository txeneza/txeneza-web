import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

/**
 * Cliente Supabase privilegiado, exclusivo para uso em rotas de servidor
 * (src/app/api/**). Usa a service_role key, que ignora RLS — nunca deve
 * ser importado em componentes "use client" nem exposto ao browser.
 */
export const supabaseAdmin = createClient(
  env.supabase.url || "https://placeholder-url.supabase.co",
  env.supabase.serviceRoleKey || "placeholder-service-role-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
