export type NotificationType =
  | "nova_denuncia"
  | "ocorrencia"
  | "alerta_critico"
  | "reabertura_automatica"
  | "resolucao_validada"
  | "alteracao_estado"
  | "sistema";

export interface NotificationItem {
  id: string;
  userId: string;
  occurrenceId?: string | null;
  type: NotificationType | string;
  message: string;
  read: boolean;
  createdAt: string;
  category?: string;
  bairro?: string;
  gravidade?: "baixa" | "media" | "alta" | "critica";
}

export type NotificationFilterTab = "todas" | "nao_lidas" | "denuncias" | "criticas";
