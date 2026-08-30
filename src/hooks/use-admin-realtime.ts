"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/core/supabase";
import { notificationSound } from "@/lib/notification-sound";
import { LiveAlertPayload } from "@/components/ui/realtime-toast-alert";
import { useOccurrencesStore } from "@/features/occurrences/occurrences.store";
import { useMapStore } from "@/features/map/map.store";
import { useDashboardStore } from "@/features/dashboard/dashboard.store";
import { Occurrence, OccurrenceStatus } from "@/features/occurrences/occurrences.types";

export function useAdminRealtime() {
  const [alerts, setAlerts] = useState<LiveAlertPayload[]>([]);
  const processedIdsRef = useRef<Set<string>>(new Set());

  // Solicita permissão para notificações nativas do browser (Desktop Notifications)
  const requestDesktopPermission = useCallback(async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch (_) {}
      }
    }
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const triggerLiveAlert = useCallback(
    (payload: LiveAlertPayload) => {
      // Evita duplicar o mesmo alerta em rajada
      if (processedIdsRef.current.has(payload.id)) return;
      processedIdsRef.current.add(payload.id);

      // Mantém tamanho do Set sob controlo
      if (processedIdsRef.current.size > 100) {
        processedIdsRef.current.clear();
        processedIdsRef.current.add(payload.id);
      }

      // 1. Toca som suave
      notificationSound.playChime();

      // 2. Adiciona ao estado dos Toasts flutuantes
      setAlerts((prev) => [payload, ...prev].slice(0, 5));

      // 3. Notificação nativa do SO/Navegador (se a janela não estiver em foco ou se suportada)
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try {
          new Notification("Txeneza · Nova Denúncia", {
            body: payload.message || payload.title,
            icon: "/icons/TXENEZA.svg",
            tag: payload.id,
          });
        } catch (_) {}
      }

      // 4. Auto-dispensa após 7 segundos
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== payload.id));
      }, 7000);
    },
    []
  );

  useEffect(() => {
    requestDesktopPermission();

    // Cria o canal Realtime no Supabase
    const channel = supabase
      .channel("admin-realtime-channel")
      // A. Ouve inserções na tabela de ocorrências (novas denúncias do mobile)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "ocorrencia" },
        async (payload) => {
          const newRow = payload.new as any;
          if (!newRow) return;

          // Mapeia para o formato de Occurrence
          let status: OccurrenceStatus = "pendente";
          if (newRow.estado === "em_analise") status = "em-progresso";
          else if (newRow.estado === "resolvida") status = "resolvido";
          else if (newRow.estado === "rejeitada") status = "rejeitado";

          const occurrenceObj: Occurrence = {
            id: newRow.id_ocorrencia,
            title: `Nova Denúncia`,
            description: newRow.descricao || "Sem descrição adicional",
            category: "Resíduo", // Atualizado dinamicamente
            latitude: Number(newRow.latitude),
            longitude: Number(newRow.longitude),
            status,
            gravidade: newRow.gravidade || "media",
            createdAt: newRow.data_hora_registo || new Date().toISOString(),
          };

          // Dispara alerta audiovisual completo (Toast, Chime, Notificação do Navegador)
          triggerLiveAlert({
            id: newRow.id_ocorrencia,
            occurrenceId: newRow.id_ocorrencia,
            title: `🚨 Nova Denúncia Registada`,
            message: newRow.descricao
              ? `Nova denúncia submetida (${newRow.gravidade || "Gravidade Normal"}): ${newRow.descricao}`
              : `Nova denúncia de resíduos submetida com gravidade ${newRow.gravidade || "normal"}.`,
            gravidade: newRow.gravidade || "media",
            createdAt: newRow.data_hora_registo || new Date().toISOString(),
          });

          // Atualiza as lojas ativas (Tabela, Mapa, Estatísticas)
          useOccurrencesStore.getState().addOrUpdateOccurrence(occurrenceObj);
          useMapStore.getState().addOrUpdateMarker(occurrenceObj);
          useDashboardStore.getState().fetchStats();

          // Notifica o sino de notificações para sincronizar
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("txeneza:new-occurrence", { detail: occurrenceObj }));
          }
        }
      )
      // B. Ouve inserções na tabela de notificações (geradas pelo Trigger PostgreSQL)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notificacao" },
        (payload) => {
          const newNotif = payload.new as any;
          if (!newNotif) return;

          triggerLiveAlert({
            id: newNotif.id_notificacao,
            occurrenceId: newNotif.id_ocorrencia,
            title: "Nova Notificação do Sistema",
            message: newNotif.mensagem,
            createdAt: newNotif.data_hora || new Date().toISOString(),
          });

          // Notifica o componente NotificationBell para atualizar o badge em 0ms
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("txeneza:new-notification", { detail: newNotif }));
          }
        }
      )
      // C. Ouve alterações de estado em ocorrências (ex.: resoluções, reaberturas)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "ocorrencia" },
        (payload) => {
          const updatedRow = payload.new as any;
          if (!updatedRow) return;

          let status: OccurrenceStatus = "pendente";
          if (updatedRow.estado === "em_analise") status = "em-progresso";
          else if (updatedRow.estado === "resolvida") status = "resolvido";
          else if (updatedRow.estado === "rejeitada") status = "rejeitado";

          const occurrenceObj: Occurrence = {
            id: updatedRow.id_ocorrencia,
            title: `Ocorrência`,
            description: updatedRow.descricao || "",
            category: "Resíduo",
            latitude: Number(updatedRow.latitude),
            longitude: Number(updatedRow.longitude),
            status,
            gravidade: updatedRow.gravidade || "media",
            createdAt: updatedRow.data_hora_registo || new Date().toISOString(),
            updatedAt: updatedRow.data_hora_sync || new Date().toISOString(),
          };

          useOccurrencesStore.getState().addOrUpdateOccurrence(occurrenceObj);
          useMapStore.getState().addOrUpdateMarker(occurrenceObj);
          useDashboardStore.getState().fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [triggerLiveAlert, requestDesktopPermission]);

  return {
    alerts,
    dismissAlert,
  };
}
