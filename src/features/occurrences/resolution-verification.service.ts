import {
  CreateResolutionVerificationInput,
  ResolutionVerification,
} from "./resolution-verification.types";

/**
 * Serviço de "prova de resolução" (foto do local já limpo).
 * 
 * INTEGRADO COM ENDPOINT REAL E BASE DE DADOS POSTGRESQL + SUPABASE STORAGE.
 * Realiza upload real da foto, executa verificação de IA e suporta
 * a lógica de reabertura automática de ocorrências caso a limpeza falhe.
 */

export const resolutionVerificationService = {
  /** Lista as provas de resolução já registadas para uma ocorrência. */
  async getByOccurrence(occurrenceId: string): Promise<ResolutionVerification[]> {
    try {
      const res = await fetch(`/api/occurrences/${occurrenceId}/verifications`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Falha ao obter provas de resolução.");
      }

      return await res.json();
    } catch (err: any) {
      console.warn("Erro ao obter provas de resolução:", err.message);
      return [];
    }
  },

  /** Regista uma nova prova de resolução (foto obrigatória). */
  async create(input: CreateResolutionVerificationInput): Promise<ResolutionVerification> {
    const formData = new FormData();
    formData.append("photo", input.photoFile);
    if (input.notes) formData.append("notes", input.notes);
    if (input.result) formData.append("result", input.result);

    const res = await fetch(`/api/occurrences/${input.occurrenceId}/verifications`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Erro ao registar prova de resolução no servidor.");
    }

    return await res.json();
  },

  /**
   * Regista várias fotos de prova de uma só vez.
   */
  async createMany(
    occurrenceId: string,
    photoFiles: File[],
    notes?: string,
    result?: ResolutionVerification["result"]
  ): Promise<ResolutionVerification[]> {
    const created: ResolutionVerification[] = [];
    for (const photoFile of photoFiles) {
      const item = await this.create({ occurrenceId, photoFile, notes, result });
      created.push(item);
    }
    return created;
  },
};
