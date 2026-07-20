import { NextRequest, NextResponse } from "next/server";
import { notificationsService } from "@/features/notifications/notifications.service";
import { verifyAdminSession } from "@/core/server-auth";

/**
 * GET: Obtém a lista de notificações armazenadas na base de dados.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request);
    const notifications = await notificationsService.getUserNotifications(session?.uid);
    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao obter notificações: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Marca uma notificação individual ou todas como lidas na base de dados.
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request);
    const body = await request.json().catch(() => ({}));
    const { notificationId, markAll } = body as { notificationId?: string; markAll?: boolean };

    if (markAll) {
      await notificationsService.markAllAsRead(session?.uid);
      return NextResponse.json({ success: true, message: "Todas as notificações foram marcadas como lidas." });
    }

    if (!notificationId) {
      return NextResponse.json({ error: "ID da notificação é obrigatório." }, { status: 400 });
    }

    const ok = await notificationsService.markAsRead(notificationId);
    if (!ok) {
      return NextResponse.json({ error: "Notificação não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true, notificationId });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao atualizar notificação: " + error.message },
      { status: 500 }
    );
  }
}
