import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Obtém todas as ocorrências cadastradas no banco de dados.
 */
export async function GET() {
  try {
    const databaseOccurrences = await prisma.ocorrencia.findMany({
      include: {
        utilizador: true,
        categoria: true,
        fotografias: {
          take: 1,
          orderBy: { data_hora: "desc" },
        },
      },
      orderBy: { data_hora_registo: "desc" },
    });

    // Mapeia do banco de dados para a interface Occurrence do frontend
    const serialized = databaseOccurrences.map((o) => {
      // Mapeamento de status:
      // - pendente ou reaberta -> "pendente"
      // - em_analise -> "em-progresso"
      // - resolvida -> "resolvido"
      // - rejeitada -> "rejeitado"
      let status: "pendente" | "em-progresso" | "resolvido" | "rejeitado" = "pendente";
      if ((o.estado as string) === "em_analise") status = "em-progresso";
      else if ((o.estado as string) === "resolvida") status = "resolvido";
      else if ((o.estado as string) === "rejeitada") status = "rejeitado";

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qixdkjsdurbzmpxlimdy.supabase.co";
      const imageUrl = o.fotografias[0]?.caminho_ficheiro
        ? `${supabaseUrl}/storage/v1/object/public/denuncias/${o.fotografias[0].caminho_ficheiro}`
        : undefined;

      return {
        id: o.id_ocorrencia,
        title: `Ocorrência de ${o.categoria.nome}`,
        description: o.descricao || "",
        category: o.categoria.nome,
        latitude: Number(o.latitude),
        longitude: Number(o.longitude),
        bairro: o.utilizador.bairro,
        status,
        createdAt: o.data_hora_registo.toISOString(),
        updatedAt: o.data_hora_sync ? o.data_hora_sync.toISOString() : undefined,
        reportedBy: o.utilizador.nome,
        imageUrl,
        gravidade: o.gravidade,
      };
    });

    return NextResponse.json(serialized);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao carregar ocorrências: " + error.message },
      { status: 500 }
    );
  }
}
