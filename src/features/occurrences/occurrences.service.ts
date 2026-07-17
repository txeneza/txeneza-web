import { Occurrence, OccurrenceFilter } from "./occurrences.types";

/**
 * Serviço de Ocorrências no Frontend.
 * Consome os endpoints da API (/api/occurrences) para comunicar diretamente com o banco de dados.
 */
export const occurrencesService = {
  async getAll(filters?: OccurrenceFilter): Promise<Occurrence[]> {
    const res = await fetch("/api/occurrences");
    if (!res.ok) throw new Error("Erro ao buscar ocorrências no servidor.");
    
    let occurrences: Occurrence[] = await res.json();
    
    if (filters?.status) {
      occurrences = occurrences.filter(o => o.status === filters.status);
    }
    if (filters?.category) {
      occurrences = occurrences.filter(o => o.category === filters.category);
    }
    return occurrences;
  },

  async getById(id: string): Promise<Occurrence | null> {
    const res = await fetch(`/api/occurrences/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Erro ao obter detalhes da ocorrência.");
    
    return res.json();
  },

  async create(data: Omit<Occurrence, "id" | "createdAt">): Promise<Occurrence> {
    const res = await fetch("/api/occurrences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro ao cadastrar ocorrência.");
    return res.json();
  },

  async updateStatus(id: string, status: Occurrence["status"]): Promise<Occurrence> {
    const res = await fetch(`/api/occurrences/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Erro ao atualizar estado da ocorrência.");
    }
    return res.json();
  },

  subscribeToChanges(callback: (occurrences: Occurrence[]) => void) {
    // Busca os dados iniciais
    this.getAll().then(callback).catch(console.error);

    // Atualiza periodicamente a cada 10 segundos
    const interval = setInterval(() => {
      this.getAll().then(callback).catch(console.error);
    }, 10000);

    return () => clearInterval(interval);
  }
};
