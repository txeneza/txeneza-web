import { NextResponse } from "next/server";
import { occurrencesService } from "@/features/occurrences/occurrences.service";
import { generateCSV } from "@/lib/csv";

export async function GET() {
  try {
    const data = await occurrencesService.getAll();
    
    // Mapeia para um formato plano ideal para exportação CSV
    const rows = data.map((o) => ({
      id: o.id,
      titulo: o.title,
      descricao: o.description,
      categoria: o.category,
      latitude: o.latitude,
      longitude: o.longitude,
      estado: o.status,
      criadoEm: o.createdAt,
    }));

    const csvContent = generateCSV(rows);

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
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
