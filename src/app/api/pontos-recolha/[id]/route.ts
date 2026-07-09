import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function serialize(p: any) {
  return {
    id: p.id_ponto,
    nome: p.nome,
    latitude: Number(p.latitude),
    longitude: Number(p.longitude),
    bairro: p.bairro,
    horario: p.horario,
    estado: p.estado,
  };
}

/**
 * Actualiza um ponto de recolha existente.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nome, latitude, longitude, bairro, horario, estado } = body;

    if (!nome || latitude === undefined || longitude === undefined || !bairro) {
      return NextResponse.json(
        { error: "Dados incompletos. Nome, coordenadas e bairro são obrigatórios." },
        { status: 400 }
      );
    }

    const atualizado = await prisma.pontoRecolha.update({
      where: { id_ponto: id },
      data: {
        nome,
        latitude: Number(latitude),
        longitude: Number(longitude),
        bairro,
        horario: horario || null,
        estado: estado === "inactivo" ? "inactivo" : "activo",
      },
    });

    return NextResponse.json(serialize(atualizado));
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Ponto de recolha não encontrado." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Erro ao actualizar ponto de recolha: " + error.message },
      { status: 500 }
    );
  }
}

/**
 * Remove um ponto de recolha.
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.pontoRecolha.delete({ where: { id_ponto: id } });
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Ponto de recolha não encontrado." }, { status: 404 });
    }
    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "Não é possível eliminar: existem ocorrências associadas a este ponto." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao eliminar ponto de recolha: " + error.message },
      { status: 500 }
    );
  }
}
