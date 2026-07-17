import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function serialize(o: any) {
  // Mapeamento de status:
  // - pendente ou reaberta -> "pendente"
  // - em_analise -> "em-progresso"
  // - resolvida -> "resolvido"
  // - rejeitada -> "rejeitado"
  let status: "pendente" | "em-progresso" | "resolvido" | "rejeitado" = "pendente";
  if (o.estado === "em_analise") status = "em-progresso";
  else if (o.estado === "resolvida") status = "resolvido";
  else if (o.estado === "rejeitada") status = "rejeitado";

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
}

/**
 * Obtém uma ocorrência específica por ID.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const o = await prisma.ocorrencia.findUnique({
      where: { id_ocorrencia: id },
      include: {
        utilizador: true,
        categoria: true,
        fotografias: {
          take: 1,
          orderBy: { data_hora: "desc" },
        },
      },
    });

    if (!o) {
      return NextResponse.json({ error: "Ocorrência não encontrada." }, { status: 404 });
    }

    return NextResponse.json(serialize(o));
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao obter ocorrência: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * Atualiza o estado de uma ocorrência.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status não fornecido." },
        { status: 400 }
      );
    }

    // Mapeamento sugerido para Escrita (Frontend -> DB):
    // - "pendente" -> pendente
    // - "em-progresso" -> em_analise
    // - "resolvido" -> resolvida
    // - "rejeitado" -> rejeitada
    let databaseStatus: "pendente" | "em_analise" | "resolvida" | "rejeitada" = "pendente";
    if (status === "em-progresso") databaseStatus = "em_analise";
    else if (status === "resolvido") databaseStatus = "resolvida";
    else if (status === "rejeitado") databaseStatus = "rejeitada";

    const atualizado = await prisma.ocorrencia.update({
      where: { id_ocorrencia: id },
      data: {
        estado: databaseStatus as any,
        data_hora_sync: new Date(),
      },
      include: {
        utilizador: true,
        categoria: true,
        fotografias: {
          take: 1,
          orderBy: { data_hora: "desc" },
        },
      },
    });

    return NextResponse.json(serialize(atualizado));
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Ocorrência não encontrada." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Erro ao actualizar ocorrência: " + error.message },
      { status: 500 }
    );
  }
}
