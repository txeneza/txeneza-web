/**
 * Serviço de Análise Visual de Resolução por IA (Gemini / Visão Computacional).
 *
 * Avalia se a foto de resolução enviada pelo operador/fiscal comprova
 * efetivamente a limpeza do local em relação à fotografia original da denúncia.
 *
 * PRINCÍPIO DE SEGURANÇA: em caso de dúvida, falha de rede, chave em falta,
 * ou resposta inesperada da IA, o resultado é SEMPRE "nao_resolvida" — nunca
 * "resolvida" por omissão. Aprovar automaticamente uma resolução não
 * verificada fecharia denúncias reais de cidadãos sem confirmação nenhuma;
 * o pior caso de um falso "nao_resolvida" é só pedir revisão humana extra,
 * o que é seguro. O pior caso de um falso "resolvida" é fechar um problema
 * real por engano — por isso nunca é a opção por omissão.
 */

export interface AIVerificationResult {
  resultado: "resolvida" | "nao_resolvida";
  confianca: number; // Percentagem (0 a 100)
  observacoes: string;
}

const MODEL = "gemini-2.5-flash";

/**
 * Descarrega uma imagem (por URL pública) e devolve os bytes em base64,
 * prontos para incluir como inlineData num pedido ao Gemini. A API do
 * Gemini não aceita URLs externos directamente — é preciso enviar os bytes.
 */
async function fetchImageAsBase64(url: string): Promise<{ base64: string; mimeType: string } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const mimeType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return { base64, mimeType };
  } catch (err: any) {
    console.warn("Falha ao descarregar imagem original para comparação:", err.message);
    return null;
  }
}

export const aiVerificationService = {
  /**
   * Analisa a foto de resolução e compara visualmente com a foto da denúncia
   * inicial (quando disponível).
   *
   * @param originalPhotoUrl URL pública da foto inicial da denúncia
   * @param resolutionPhotoBuffer Buffer da imagem de prova de resolução enviada
   * @param notes Observações fornecidas pelo utilizador
   */
  async verifyResolution(
    originalPhotoUrl: string | null | undefined,
    resolutionPhotoBuffer: Buffer,
    notes?: string
  ): Promise<AIVerificationResult> {
    // Prioridade máxima: se o próprio operador já escreveu nas notas que a
    // limpeza ficou incompleta/foi recusada, isso é informação humana
    // directa — não precisa de IA nenhuma para ser respeitada.
    const lowerNotes = (notes || "").toLowerCase();
    if (
      lowerNotes.includes("incompleto") ||
      lowerNotes.includes("não limpo") ||
      lowerNotes.includes("recusado")
    ) {
      return {
        resultado: "nao_resolvida",
        confianca: 92.5,
        observacoes: "Nas observações do operador consta que a limpeza está incompleta ou foi recusada.",
      };
    }

    // IMPORTANTE: nunca usar um fallback "NEXT_PUBLIC_GEMINI_API_KEY" aqui.
    // Qualquer variável com prefixo NEXT_PUBLIC_ é inserida pelo Next.js no
    // bundle JavaScript enviado ao browser sempre que é referenciada em
    // código que chega ao cliente — uma chave paga da API Gemini não pode
    // ter esse nome, nem como "alternativa", para não a expor por engano
    // se este código (ou algo que o importe) vier a ser usado de um
    // componente "use client" no futuro.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY não configurada — verificação de resolução requer revisão manual.");
      return {
        resultado: "nao_resolvida",
        confianca: 0,
        observacoes: "Verificação automática indisponível (IA não configurada). Requer confirmação manual por um administrador.",
      };
    }

    try {
      const originalImage = originalPhotoUrl ? await fetchImageAsBase64(originalPhotoUrl) : null;

      const promptText = originalImage
        ? `Você é um perito em gestão ambiental e resíduos sólidos no projeto Txeneza em Beira, Moçambique.
A PRIMEIRA imagem é a fotografia ORIGINAL da denúncia (o problema reportado pelo cidadão). A SEGUNDA imagem é a fotografia de RESOLUÇÃO enviada como prova de que o local foi limpo.
Compare as duas imagens e determine, com base em evidência visual real (não presumas), se o local mostrado na segunda foto corresponde ao mesmo tipo de local da primeira E se os resíduos sólidos visíveis na primeira foto foram efectivamente removidos na segunda.
Se a segunda foto parecer ser de um local diferente, não mostrar claramente uma limpeza, ou não permitir uma comparação fiável, considera "nao_resolvida" e reduz a confiança.
Responda ESTRITAMENTE em formato JSON com o seguinte esquema, sem markdown:
{
  "resultado": "resolvida" ou "nao_resolvida",
  "confianca": numero de 0 a 100,
  "observacoes": "breve explicação visual em português, referindo o que mudou (ou não) entre as duas fotos"
}`
        : `Você é um perito em gestão ambiental e resíduos sólidos no projeto Txeneza em Beira, Moçambique.
Examine esta imagem de verificação de resolução de uma denúncia de resíduos. Não há fotografia original disponível para comparação directa — avalie apenas se esta imagem mostra, por si só, evidência clara e inequívoca de um local limpo e livre de resíduos sólidos.
Na dúvida (por não haver comparação possível), prefira "nao_resolvida" com confiança moderada, em vez de assumir que está tudo resolvido.
Responda ESTRITAMENTE em formato JSON com o seguinte esquema, sem markdown:
{
  "resultado": "resolvida" ou "nao_resolvida",
  "confianca": numero de 0 a 100,
  "observacoes": "breve explicação visual em português"
}`;

      const parts: any[] = [{ text: promptText }];
      if (originalImage) {
        parts.push({
          inlineData: { mimeType: originalImage.mimeType, data: originalImage.base64 },
        });
      }
      parts.push({
        inlineData: { mimeType: "image/jpeg", data: resolutionPhotoBuffer.toString("base64") },
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { temperature: 0.3 },
          }),
        }
      );

      if (!response.ok) {
        console.warn(`Gemini devolveu ${response.status} na verificação de resolução.`);
        return {
          resultado: "nao_resolvida",
          confianca: 0,
          observacoes: "Não foi possível concluir a verificação automática. Requer confirmação manual por um administrador.",
        };
      }

      const resData = await response.json();
      const candidateText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!candidateText) {
        return {
          resultado: "nao_resolvida",
          confianca: 0,
          observacoes: "A IA não devolveu uma análise válida. Requer confirmação manual por um administrador.",
        };
      }

      const cleanJson = candidateText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      // parsed.confianca pode legitimamente ser 0 — "|| 85.0" trataria isso
      // como "não veio confiança" e substituía por um valor inventado. Usar
      // Number.isFinite para só cair no valor por omissão quando o campo
      // realmente não vier / não for um número.
      const confiancaNum = Number(parsed.confianca);
      const confianca = Number.isFinite(confiancaNum) ? Math.min(100, Math.max(0, confiancaNum)) : 50;

      return {
        resultado: parsed.resultado === "resolvida" ? "resolvida" : "nao_resolvida",
        confianca,
        observacoes: parsed.observacoes || "Análise efectuada via Gemini AI.",
      };
    } catch (err: any) {
      console.warn("Erro na verificação de IA de resolução:", err.message);
      return {
        resultado: "nao_resolvida",
        confianca: 0,
        observacoes: "Ocorreu um erro na verificação automática. Requer confirmação manual por um administrador.",
      };
    }
  },
};
