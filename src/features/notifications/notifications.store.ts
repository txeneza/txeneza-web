import { create } from "zustand";
import { NotificationItem, NotificationFilterTab } from "./notifications.types";

interface NotificationsState {
  notifications: NotificationItem[];
  filterTab: NotificationFilterTab;
  loading: boolean;
  error: string | null;
  setFilterTab: (tab: NotificationFilterTab) => void;
  fetchNotifications: () => Promise<void>;
  addNotification: (notif: NotificationItem) => void;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  toggleRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  filterTab: "todas",
  loading: false,
  error: null,

  setFilterTab: (tab) => set({ filterTab: tab }),

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          set({ notifications: data, loading: false });
        }
      }
    } catch (err: any) {
      set({ error: err.message || "Erro ao carregar notificações", loading: false });
    }
  },

  addNotification: (notif) => {
    set((state) => {
      // Evita duplicatas
      const filtered = state.notifications.filter((n) => n.id !== notif.id);
      return {
        notifications: [notif, ...filtered],
      };
    });
  },

  markAsRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id, read: true }),
      });
    } catch (err) {
      console.warn("Erro ao marcar notificação como lida:", err);
    }
  },

  markAsUnread: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: false } : n
      ),
    }));

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id, read: false }),
      });
    } catch (err) {
      console.warn("Erro ao marcar notificação como não lida:", err);
    }
  },

  toggleRead: async (id) => {
    const current = get().notifications.find((n) => n.id === id);
    if (!current) return;
    if (current.read) {
      await get().markAsUnread(id);
    } else {
      await get().markAsRead(id);
    }
  },

  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
    } catch (err) {
      console.warn("Erro ao marcar todas as notificações como lidas:", err);
    }
  },

  deleteNotification: async (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));

    try {
      await fetch(`/api/notifications?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Erro ao eliminar notificação na API:", err);
    }
  },

  clearAllNotifications: async () => {
    set({ notifications: [] });

    try {
      await fetch("/api/notifications?all=true", {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Erro ao limpar todas as notificações na API:", err);
    }
  },
}));
