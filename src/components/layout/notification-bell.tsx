"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

interface NotificationItem {
  id: string;
  userId: string;
  occurrenceId?: string | null;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      }
    } catch (err) {
      console.warn("Erro ao buscar notificações:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Polling suave a cada 15s
    return () => clearInterval(interval);
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } finally {
      setLoading(false);
    }
  };

  const markSingleAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.warn("Erro ao marcar notificação:", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-grey100/80 dark:bg-grey800/80 border border-grey200/80 dark:border-grey700/60 text-grey700 dark:text-grey300 hover:bg-grey200/80 dark:hover:bg-grey700/80 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-forestGreen/40"
        title="Notificações do Sistema"
        aria-label="Ver notificações"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-grey900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-grey900 border border-grey200/90 dark:border-grey800/90 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Cabeçalho do Dropdown */}
          <div className="p-3.5 px-4 border-b border-grey100 dark:border-grey800/80 flex items-center justify-between bg-grey50/60 dark:bg-grey900/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-grey900 dark:text-grey50 uppercase tracking-wider">
                Notificações
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forestGreen/10 dark:bg-limeGreen/15 text-forestGreen dark:text-limeGreen border border-forestGreen/20 dark:border-limeGreen/25">
                  {unreadCount} novas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-[11px] font-bold text-forestGreen dark:text-limeGreen hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Marcar todas
              </button>
            )}
          </div>

          {/* Lista de Notificações */}
          <div className="max-h-80 overflow-y-auto divide-y divide-grey100 dark:divide-grey800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-grey400 dark:text-grey500 text-xs font-medium">
                Nenhuma notificação registada.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.read && markSingleAsRead(n.id)}
                  className={`p-3.5 px-4 flex items-start gap-3 transition-colors cursor-pointer hover:bg-grey50/80 dark:hover:bg-grey800/40 ${
                    !n.read ? "bg-forestGreen/5 dark:bg-limeGreen/5" : ""
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {n.type === "reabertura_automatica" ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : n.type === "resolucao_validada" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Info className="w-4 h-4 text-sky-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-grey900 dark:text-grey100 leading-snug">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-grey400 dark:text-grey500 mt-1 block font-mono">
                      {new Date(n.createdAt).toLocaleString("pt-PT", { timeZone: "Africa/Maputo" })}
                    </span>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-forestGreen dark:bg-limeGreen shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
