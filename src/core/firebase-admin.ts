import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { env } from "./env";

/**
 * App do Firebase Admin, exclusivo para uso no servidor (rotas /api), para
 * enviar notificações push via Firebase Cloud Messaging. Nunca importar em
 * componentes "use client".
 *
 * Segue o mesmo padrão de "placeholder gracioso" do supabase-admin.ts: se
 * as credenciais não estiverem configuradas, a inicialização não rebenta
 * o build/arranque da app — falha de forma controlada só quando algo
 * tentar mesmo enviar um push (ver push.service.ts), com um aviso claro
 * na consola em vez de um crash.
 */
let firebaseAdminApp: App | null = null;

export function getFirebaseAdminApp(): App | null {
  if (firebaseAdminApp) return firebaseAdminApp;

  const { projectId, clientEmail, privateKey } = env.firebaseAdmin;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      "Firebase Admin não configurado (faltam FIREBASE_PROJECT_ID / " +
        "FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY). Pushes FCM não serão enviados."
    );
    return null;
  }

  // Evita reinicializar em cada hot-reload/import repetido durante dev.
  const existing = getApps();
  if (existing.length > 0) {
    firebaseAdminApp = existing[0];
    return firebaseAdminApp;
  }

  try {
    firebaseAdminApp = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
    return firebaseAdminApp;
  } catch (err: any) {
    console.error("Falha ao inicializar o Firebase Admin:", err.message);
    return null;
  }
}
