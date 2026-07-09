import { OccurrenceStatus } from "./occurrences.types";

export interface OccurrenceStatusMeta {
  label: string;
  /** Cor do ponto indicador */
  dot: string;
  /** Classes do badge (fundo + texto + borda), com variantes dark */
  badge: string;
}

export const OCCURRENCE_STATUS_META: Record<OccurrenceStatus, OccurrenceStatusMeta> = {
  pendente: {
    label: "Pendente",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
  },
  "em-progresso": {
    label: "Em progresso",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
  },
  resolvido: {
    label: "Resolvido",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
  },
  rejeitado: {
    label: "Rejeitado",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
  },
};

/** Ordem de apresentação dos estados nos filtros. */
export const OCCURRENCE_STATUS_ORDER: OccurrenceStatus[] = [
  "pendente",
  "em-progresso",
  "resolvido",
  "rejeitado",
];
