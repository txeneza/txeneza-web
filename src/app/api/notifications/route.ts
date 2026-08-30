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
 * PATCH: Marca uma notificação individual ou todas como lidas/não lidas na base de dados.
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request);
    const body = await request.json().catch(() => ({}));
    const { notificationId, markAll, read = true } = body as {
      notificationId?: string;
      markAll?: boolean;
      read?: boolean;
    };

    if (markAll) {
      await notificationsService.markAllAsRead(session?.uid);
      return NextResponse.json({ success: true, message: "Todas as notificações foram marcadas como lidas." });
    }

    if (!notificationId) {
      return NextResponse.json({ error: "ID da notificação é obrigatório." }, { status: 400 });
    }

    const ok = read
      ? await notificationsService.markAsRead(notificationId)
      : await notificationsService.markAsUnread(notificationId);

    if (!ok) {
      return NextResponse.json({ error: "Notificação não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true, notificationId, read });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao atualizar notificação: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove uma notificação ou todas da base de dados.
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await verifyAdminSession(request);
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");
    const deleteAll = searchParams.get("all") === "true";

    if (deleteAll) {
      await notificationsService.deleteAllNotifications(session?.uid);
      return NextResponse.json({ success: true, message: "Todas as notificações foram eliminadas." });
    }

    if (!notificationId) {
      return NextResponse.json({ error: "ID da notificação é obrigatório." }, { status: 400 });
    }

    const ok = await notificationsService.deleteNotification(notificationId);
    if (!ok) {
      return NextResponse.json({ error: "Erro ao remover notificação ou não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true, notificationId });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao eliminar notificação: " + error.message },
      { status: 500 }
    );
  }
}
