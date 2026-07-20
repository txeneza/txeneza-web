import { prisma } from "@/lib/prisma";

export interface NotificationItem {
  id: string;
  userId: string;
  occurrenceId?: string | null;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const notificationsService = {
  /**
   * Cria uma nova notificação na base de dados para um utilizador.
   */
  async createNotification(
    userId: string,
    message: string,
    type = "ocorrencia",
    occurrenceId?: string
  ): Promise<NotificationItem | null> {
    try {
      const created = await prisma.notificacao.create({
        data: {
          id_utilizador: userId,
          id_ocorrencia: occurrenceId || null,
          tipo: type,
          mensagem: message,
          lida: false,
          data_hora: new Date(),
        },
      });

      return {
        id: created.id_notificacao,
        userId: created.id_utilizador,
        occurrenceId: created.id_ocorrencia,
        type: created.tipo,
        message: created.mensagem,
        read: created.lida,
        createdAt: created.data_hora.toISOString(),
      };
    } catch (err: any) {
      console.error("Erro ao criar notificação na BD:", err.message);
      return null;
    }
  },

  /**
   * Obtém as notificações do utilizador ordenadas pelas mais recentes.
   */
  async getUserNotifications(userId?: string): Promise<NotificationItem[]> {
    try {
      const notifications = await prisma.notificacao.findMany({
        where: userId ? { id_utilizador: userId } : undefined,
        orderBy: { data_hora: "desc" },
        take: 30,
      });

      return notifications.map((n) => ({
        id: n.id_notificacao,
        userId: n.id_utilizador,
        occurrenceId: n.id_ocorrencia,
        type: n.tipo,
        message: n.mensagem,
        read: n.lida,
        createdAt: n.data_hora.toISOString(),
      }));
    } catch (err: any) {
      console.error("Erro ao buscar notificações da BD:", err.message);
      return [];
    }
  },

  /**
   * Marca uma notificação como lida.
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await prisma.notificacao.update({
        where: { id_notificacao: notificationId },
        data: { lida: true },
      });
      return true;
    } catch (err: any) {
      console.error("Erro ao marcar notificação como lida:", err.message);
      return false;
    }
  },

  /**
   * Marca todas as notificações como lidas.
   */
  async markAllAsRead(userId?: string): Promise<boolean> {
    try {
      await prisma.notificacao.updateMany({
        where: userId ? { id_utilizador: userId, lida: false } : { lida: false },
        data: { lida: true },
      });
      return true;
    } catch (err: any) {
      console.error("Erro ao marcar todas as notificações como lidas:", err.message);
      return false;
    }
  },
};
