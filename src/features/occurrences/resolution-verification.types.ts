/**
 * Tipos do "ciclo de verificação de resolução" (prova fotográfica de
 * antes/depois), espelhando 1:1 o modelo `VerificacaoResolucao` já
 * definido em prisma/schema.prisma. Manter os nomes de campo alinhados
 * com o schema é o que torna a troca do mock pela API real trivial —
 * ver resolution-verification.service.ts.
 */

export type ResolutionVerificationResult = "resolvida" | "nao_resolvida";

export interface ResolutionVerification {
  /** id_verificacao */
  id: string;
  /** id_ocorrencia */
  occurrenceId: string;
  /** id_utilizador — administrador que registou a prova (opcional no mock) */
  verifiedBy?: string;
  /** URL/preview da foto de verificação (Fotografia.tipo = "verificacao") */
  photoUrl: string;
  /** resultado */
  result: ResolutionVerificationResult;
  /**
   * confianca_comparacao — percentagem (0-100) de confiança da comparação
   * antes/depois feita pela IA (Gemini).
   */
  comparisonConfidence?: number;
  confianca?: number;
  /** observacoes */
  notes?: string;
  /** data_hora */
  createdAt: string;
}

export interface CreateResolutionVerificationInput {
  occurrenceId: string;
  photoFile: File;
  notes?: string;
  result?: ResolutionVerificationResult;
}
