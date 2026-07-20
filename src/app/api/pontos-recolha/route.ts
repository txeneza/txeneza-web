import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Obtém todos os pontos de recolha cadastrados no banco de dados.
 */
export async function GET() {
  try {
    const pontos = await prisma.pontoRecolha.findMany({
      orderBy: { nome: "asc" },
    });
    
    // Serializa os campos do tipo Decimal para Number para facilitar o uso no mapa
    const serialized = pontos.map((p: any) => ({
      id: p.id_ponto,
      nome: p.nome,
      latitude: Number(p.latitude),
      longitude: Number(p.longitude),
      bairro: p.bairro,
      horario: p.horario,
      estado: p.estado,
    }));

    return NextResponse.json(serialized);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao carregar pontos de recolha: " + error.message },
      { status: 500 }
    );
  }
}

import { verifyAdminSession, unauthorizedResponse } from "@/core/server-auth";

/**
 * Cadastra um novo ponto de recolha no banco de dados.
 */
export async function POST(request: Request) {
  const session = await verifyAdminSession(request);
  if (!session) {
    return unauthorizedResponse("Acesso negado: apenas administradores podem adicionar pontos de recolha.");
  }

  try {
    const body = await request.json();
    const { nome, latitude, longitude, bairro, horario, estado } = body;

    if (!nome || latitude === undefined || longitude === undefined || !bairro) {
      return NextResponse.json(
        { error: "Dados incompletos. Nome, coordenadas e bairro são obrigatórios." },
        { status: 400 }
      );
    }

    const novoPonto = await prisma.pontoRecolha.create({
      data: {
        nome,
        latitude: Number(latitude),
        longitude: Number(longitude),
        bairro,
        horario: horario || null,
        estado: estado === "inactivo" ? "inactivo" : "activo",
      },
    });

    return NextResponse.json({
      id: novoPonto.id_ponto,
      nome: novoPonto.nome,
      latitude: Number(novoPonto.latitude),
      longitude: Number(novoPonto.longitude),
      bairro: novoPonto.bairro,
      horario: novoPonto.horario,
      estado: novoPonto.estado,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao cadastrar ponto de recolha: " + error.message },
      { status: 500 }
    );
  }
}
