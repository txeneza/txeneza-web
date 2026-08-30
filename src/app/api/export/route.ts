import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCSV } from "@/lib/csv";
import { verifyAdminSession, unauthorizedResponse } from "@/core/server-auth";
import { findClosestBairro } from "@/core/geo/beira-bairros";

export async function GET(request: Request) {
  const session = await verifyAdminSession(request);
  if (!session) {
    return unauthorizedResponse("Acesso negado: apenas administradores podem exportar dados.");
  }

  try {
    const data = await prisma.ocorrencia.findMany({
      include: {
        categoria: true,
        utilizador: true,
      },
      orderBy: { data_hora_registo: "desc" }
    });
    
    // Mapeia para um formato plano ideal para exportação CSV
    const rows = data.map((o) => {
      let status: "pendente" | "em-progresso" | "resolvido" | "rejeitado" = "pendente";
      if ((o.estado as string) === "em_analise") status = "em-progresso";
      else if ((o.estado as string) === "resolvida") status = "resolvido";
      else if ((o.estado as string) === "rejeitada") status = "rejeitado";

      const lat = Number(o.latitude);
      const lng = Number(o.longitude);
      const rawBairro = (o as any).bairro as string | undefined;
      const occurrenceBairro = rawBairro && rawBairro.trim() !== "" ? rawBairro : findClosestBairro(lat, lng);

      return {
        id: o.id_ocorrencia,
        titulo: `Ocorrência de ${o.categoria.nome}`,
        descricao: o.descricao || "",
        categoria: o.categoria.nome,
        bairro: occurrenceBairro,
        latitude: lat,
        longitude: lng,
        gravidade: o.gravidade,
        estado: status,
        moradorNome: o.utilizador?.nome || "",
        moradorResidencia: o.utilizador?.bairro || "",
        criadoEm: o.data_hora_registo.toISOString(),
      };
    });

    const csvContent = generateCSV(rows);

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=ocorrencias.csv",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao gerar arquivo de exportação: " + error.message },
      { status: 500 }
    );
  }
}
