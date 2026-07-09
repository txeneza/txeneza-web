export type OccurrenceStatus = "pendente" | "resolvido" | "em-progresso" | "rejeitado";

export interface Occurrence {
  id: string;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  bairro?: string;
  status: OccurrenceStatus;
  createdAt: Date | string;
  updatedAt?: Date | string;
  reportedBy?: string;
  imageUrl?: string;
  gravidade?: "baixa" | "media" | "alta" | "critica";
}

export interface OccurrenceFilter {
  category?: string;
  status?: OccurrenceStatus;
  startDate?: string;
  endDate?: string;
}
