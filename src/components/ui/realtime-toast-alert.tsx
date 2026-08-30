"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertOctagon, ArrowRight, BellRing, MapPin, Volume2, VolumeX, X } from "lucide-react";
import { notificationSound } from "@/lib/notification-sound";

export interface LiveAlertPayload {
  id: string;
  occurrenceId?: string;
  title: string;
  category?: string;
  bairro?: string;
  gravidade?: "baixa" | "media" | "alta" | "critica";
  message: string;
  createdAt: string;
}

interface RealtimeToastAlertProps {
  alerts: LiveAlertPayload[];
  onDismiss: (id: string) => void;
}

export const RealtimeToastAlert: React.FC<RealtimeToastAlertProps> = ({
  alerts,
  onDismiss,
}) => {
  const router = useRouter();
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(notificationSound.isMuted());
  }, []);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !muted;
    setMuted(next);
    notificationSound.setMuted(next);
  };

  if (!alerts || alerts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      {alerts.map((alert) => {
        const isCritica = alert.gravidade === "critica";
        const isAlta = alert.gravidade === "alta";

        // Remove any emoji if present
        const cleanTitle = alert.title.replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim();
        const cleanMessage = alert.message.replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim();

        return (
          <div
            key={alert.id}
            className={`pointer-events-auto relative overflow-hidden rounded-2xl bg-white/95 dark:bg-grey900/95 border backdrop-blur-xl shadow-2xl p-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              isCritica
                ? "border-rose-500/40 ring-2 ring-rose-500/20"
                : isAlta
                ? "border-amber-500/40 ring-1 ring-amber-500/20"
                : "border-forestGreen/30 dark:border-limeGreen/30"
            }`}
          >
            {/* Barra de progresso de auto-fecho */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                isCritica
                  ? "bg-rose-500"
                  : isAlta
                  ? "bg-amber-500"
                  : "bg-forestGreen dark:bg-limeGreen"
              } animate-pulse`}
            />

            <div className="flex items-start gap-3">
              {/* Ícone */}
              <div
                className={`relative p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  isCritica
                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    : isAlta
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-forestGreen/15 dark:bg-limeGreen/15 text-forestGreen dark:text-limeGreen"
                }`}
              >
                {isCritica ? (
                  <AlertOctagon className="w-5 h-5 animate-bounce" />
                ) : (
                  <BellRing className="w-5 h-5 animate-pulse" />
                )}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-forestGreen/10 dark:bg-limeGreen/15 text-forestGreen dark:text-limeGreen border border-forestGreen/20 dark:border-limeGreen/25">
                    Nova Denúncia
                  </span>
                  {alert.gravidade && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isCritica
                          ? "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
                          : isAlta
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
                          : "bg-grey100 dark:bg-grey800 text-grey700 dark:text-grey300 border-grey200 dark:border-grey700"
                      }`}
                    >
                      {alert.gravidade}
                    </span>
                  )}
                  {alert.bairro && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-grey500 dark:text-grey400 truncate">
                      <MapPin className="w-3 h-3 shrink-0 text-forestGreen dark:text-limeGreen" />
                      <span>{alert.bairro}</span>
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-grey900 dark:text-white leading-snug line-clamp-2">
                  {cleanMessage || cleanTitle}
                </h4>

                {/* Botões de Ação */}
                <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-grey100 dark:border-grey800">
                  <button
                    onClick={() => {
                      onDismiss(alert.id);
                      if (alert.occurrenceId) {
                        router.push(`/admin/occurrences/${alert.occurrenceId}`);
                      } else {
                        router.push(`/admin/occurrences`);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-forestGreen dark:text-limeGreen hover:underline"
                  >
                    <span>Ver no Painel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={toggleSound}
                      title={muted ? "Ativar som de alertas" : "Silenciar alertas"}
                      className="p-1 rounded-lg text-grey400 hover:text-grey600 dark:hover:text-grey200 transition-colors"
                      aria-label="Controlo de som"
                    >
                      {muted ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className="p-1 rounded-lg text-grey400 hover:text-grey600 dark:hover:text-grey200 transition-colors"
                      title="Dispensar alerta"
                      aria-label="Dispensar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
