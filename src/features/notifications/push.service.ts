import { getMessaging } from "firebase-admin/messaging";
import { getFirebaseAdminApp } from "@/core/firebase-admin";
import { prisma } from "@/lib/prisma";

/**
 * Título mostrado na notificação push, derivado do tipo — espelha
 * exactamente o mesmo mapeamento usado no mobile (notification_tile.dart)
 * e no sino do painel web (notification-bell.tsx), para a experiência ser
 * consistente em todas as plataformas.
 */
function tituloParaTipo(tipo: string): string {
  switch (tipo) {
    case "reabertura_automatica":
      return "Ocorrência reaberta";
    case "resolucao_validada":
      return "Resolução validada";
    case "alteracao_estado":
    default:
      return "Ocorrência atualizada";
  }
}

export interface EnviarPushParams {
  fcmToken: string | null | undefined;
  tipo: string;
  mensagem: string;
  idOcorrencia?: string | null;
}

/**
 * Envia uma notificação push a um utilizador via Firebase Cloud Messaging.
 *
 * Nunca lança excepção para o chamador: um push falhado (token inválido,
 * Firebase Admin não configurado, sem rede, etc.) não deve impedir a
 * operação principal (mudar o estado de uma ocorrência, registar uma
 * verificação) de completar — a notificação já foi gravada na BD e vai
 * aparecer no centro de notificações in-app de qualquer forma; o push é
 * só um "empurrão" extra quando a app está fechada.
 */
export async function enviarPush({
  fcmToken,
  tipo,
  mensagem,
  idOcorrencia,
}: EnviarPushParams): Promise<void> {
  if (!fcmToken) return; // Utilizador sem token registado (nunca abriu a app / negou permissão).

  const app = getFirebaseAdminApp();
  if (!app) return; // Aviso já emitido em getFirebaseAdminApp().

  try {
    await getMessaging(app).send({
      token: fcmToken,
      notification: {
        title: tituloParaTipo(tipo),
        body: mensagem,
      },
      data: {
        tipo,
        ...(idOcorrencia ? { id_ocorrencia: idOcorrencia } : {}),
      },
      android: {
        priority: "high",
        notification: {
          channelId: "txeneza_status_channel",
        },
      },
    });
  } catch (err: any) {
    // Códigos comuns: messaging/registration-token-not-registered (app
    // desinstalada ou token expirado), messaging/invalid-registration-token.
    // Nesses casos, o token guardado já não serve — limpa-o para não
    // continuar a tentar enviar para um destino morto em cada evento futuro.
    const codigosTokenInvalido = [
      "messaging/registration-token-not-registered",
      "messaging/invalid-registration-token",
      "messaging/invalid-argument",
    ];

    if (codigosTokenInvalido.includes(err?.code)) {
      console.warn(`Token FCM inválido/expirado, a limpar: ${err.code}`);
      try {
        await prisma.utilizador.updateMany({
          where: { fcm_token: fcmToken },
          data: { fcm_token: null },
        });
      } catch (cleanupErr: any) {
        console.warn("Falha ao limpar token FCM inválido:", cleanupErr.message);
      }
    } else {
      console.warn("Falha ao enviar push FCM:", err?.message || err);
    }
  }
}
