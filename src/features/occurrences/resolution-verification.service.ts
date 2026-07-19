import {
  CreateResolutionVerificationInput,
  ResolutionVerification,
} from "./resolution-verification.types";

/**
 * Serviço de "prova de resolução" (foto do local já limpo).
 *
 * ESTADO ATUAL: mock em memória — NÃO GRAVA em nenhuma base de dados real.
 * Serve para validar o fluxo de UX (admin tem de anexar foto antes de marcar
 * uma ocorrência como "Resolvido") antes de existir o endpoint definitivo.
 *
 * COMO INTEGRAR COM A BASE DE DADOS REAL (quando estiver pronto):
 * 1. Criar a rota `/api/occurrences/[id]/verifications`:
 *    - GET  -> lista VerificacaoResolucao da ocorrência (Prisma).
 *    - POST -> recebe FormData (foto + observacoes), grava a foto no
 *      Supabase Storage (bucket "denuncias", pasta "verificacao/"),
 *      cria uma Fotografia (tipo="verificacao") e depois a
 *      VerificacaoResolucao ligada a essa foto.
 * 2. Substituir o corpo das duas funções abaixo por chamadas `fetch`
 *    equivalentes (mantendo as mesmas assinaturas/tipos de retorno) —
 *    nenhum componente que usa este serviço precisa de mudar.
 */

// Guarda em memória, por ocorrência. Reinicia ao recarregar a página —
// é uma limitação aceite do mock, não do desenho da funcionalidade.
const mockStore = new Map<string, ResolutionVerification[]>();

function fileToObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

export const resolutionVerificationService = {
  /** Lista as provas de resolução já registadas para uma ocorrência. */
  async getByOccurrence(occurrenceId: string): Promise<ResolutionVerification[]> {
    // TODO(integração real): substituir por
    // const res = await fetch(`/api/occurrences/${occurrenceId}/verifications`);
    // return res.json();
    return mockStore.get(occurrenceId) ?? [];
  },

  /** Regista uma nova prova de resolução (foto obrigatória). */
  async create(input: CreateResolutionVerificationInput): Promise<ResolutionVerification> {
    // TODO(integração real): substituir por
    // const formData = new FormData();
    // formData.append("photo", input.photoFile);
    // if (input.notes) formData.append("notes", input.notes);
    // const res = await fetch(`/api/occurrences/${input.occurrenceId}/verifications`, {
    //   method: "POST",
    //   body: formData,
    // });
    // if (!res.ok) throw new Error("Erro ao registar prova de resolução.");
    // return res.json();

    const record: ResolutionVerification = {
      id: `mock-verif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      occurrenceId: input.occurrenceId,
      photoUrl: fileToObjectUrl(input.photoFile),
      result: input.result ?? "resolvida",
      notes: input.notes,
      createdAt: new Date().toISOString(),
    };

    const existing = mockStore.get(input.occurrenceId) ?? [];
    mockStore.set(input.occurrenceId, [record, ...existing]);
    return record;
  },

  /**
   * Regista várias fotos de prova de uma só vez (uma ocorrência pode ter
   * mais do que um ângulo/foto do local já limpo). No mock, cria um
   * registo por foto; na integração real, o ideal é enviar todas as
   * fotos numa única chamada FormData com `photos[]` e devolver a lista
   * de registos criados numa só resposta.
   */
  async createMany(
    occurrenceId: string,
    photoFiles: File[],
    notes?: string,
    result?: ResolutionVerification["result"]
  ): Promise<ResolutionVerification[]> {
    const created: ResolutionVerification[] = [];
    for (const photoFile of photoFiles) {
      created.push(await this.create({ occurrenceId, photoFile, notes, result }));
    }
    return created;
  },
};
