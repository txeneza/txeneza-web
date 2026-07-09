// src/app/api/reports/route.ts

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { generatePDFReport } from "@/features/reports/services/pdf-generator";
import { generateExcelReport } from "@/features/reports/services/excel-generator";
import { generateCSV } from "@/lib/csv";
import { occurrencesService } from "@/features/occurrences/occurrences.service";
import { prisma } from "@/lib/prisma";
import { getBeiraHeatmapStats, BEIRA_BAIRROS } from "@/features/map/beira-heatmap.data";
import { ReportFilters, ExportHistoryItem } from "@/features/reports/types";

// Ficheiro de persistência do histórico
const REPORTS_DIR = path.join(process.cwd(), "public", "reports");
const HISTORY_FILE = path.join(REPORTS_DIR, "history.json");

// Fallback de pontos de recolha para assegurar dados caso o DB local esteja sem sementes
const MOCK_POINTS_FALLBACK = [
  { id: "p1", nome: "Contentor Mercado Central", bairro: "Baixa / Mercado", latitude: -19.8340, longitude: 34.8390, horario: "07:00 - 18:00", estado: "activo" },
  { id: "p2", nome: "Ecoponto Munhava Principal", bairro: "Munhava", latitude: -19.8090, longitude: 34.8470, horario: "24h", estado: "activo" },
  { id: "p3", nome: "Contentor Valas do Goto", bairro: "Goto", latitude: -19.8170, longitude: 34.8360, horario: "06:00 - 20:00", estado: "inactivo" },
  { id: "p4", nome: "Contentor Largo Esturro", bairro: "Esturro", latitude: -19.8250, longitude: 34.8560, horario: "08:00 - 17:00", estado: "activo" },
  { id: "p5", nome: "Contentor Marginal Macúti", bairro: "Macúti", latitude: -19.8270, longitude: 34.8720, horario: "Livre", estado: "activo" }
];

/**
 * Garante a existência da diretoria e inicializa o histórico com dados funcionais na primeira execução.
 */
async function ensureInitialized() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  if (!fs.existsSync(HISTORY_FILE)) {
    const defaultHistory: ExportHistoryItem[] = [];

    // Gerar relatórios reais para que os downloads do histórico inicial funcionem
    try {
      const occurrences = await occurrencesService.getAll();
      const points = await getCollectionPoints();

      // 1. Relatório Ocorrências PDF
      const pdfBuffer = await generatePDFReport("occurrences", occurrences, {}, {});
      const pdfFilename = "relatorio_ocorrencias_geral_beira.pdf";
      fs.writeFileSync(path.join(REPORTS_DIR, pdfFilename), pdfBuffer);

      defaultHistory.push({
        id: "exp-init-1",
        filename: pdfFilename,
        type: "occurrences",
        format: "pdf",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
        sizeBytes: pdfBuffer.length,
        url: `/reports/${pdfFilename}`,
        filters: {}
      });

      // 2. Relatório Pontos Excel
      const xlsxBuffer = await generateExcelReport("collection-points", points, { status: "activo" }, {});
      const xlsxFilename = "inventario_contentores_ativos.xlsx";
      fs.writeFileSync(path.join(REPORTS_DIR, xlsxFilename), xlsxBuffer);

      defaultHistory.push({
        id: "exp-init-2",
        filename: xlsxFilename,
        type: "collection-points",
        format: "excel",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
        sizeBytes: xlsxBuffer.length,
        url: `/reports/${xlsxFilename}`,
        filters: { status: "activo" }
      });

    } catch (e) {
      console.error("Erro ao gerar arquivos iniciais de histórico:", e);
    }

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(defaultHistory, null, 2), "utf8");
  }
}

/**
 * Obtém os pontos de recolha da base de dados com fallback para os dados simulados
 */
async function getCollectionPoints() {
  try {
    const databasePoints = await prisma.pontoRecolha.findMany({
      orderBy: { nome: "asc" },
    });
    if (databasePoints.length > 0) {
      return databasePoints.map((p) => ({
        id: p.id_ponto,
        nome: p.nome,
        latitude: Number(p.latitude),
        longitude: Number(p.longitude),
        bairro: p.bairro,
        horario: p.horario,
        estado: p.estado,
      }));
    }
  } catch (err) {
    console.warn("Falha ao ler pontos de recolha do DB (usando fallback simulado):", err);
  }
  return MOCK_POINTS_FALLBACK;
}

/**
 * Filtra as ocorrências com base nos filtros fornecidos
 */
function filterOccurrences(items: any[], filters: ReportFilters) {
  return items.filter((item) => {
    if (filters.startDate) {
      if (new Date(item.createdAt) < new Date(filters.startDate)) return false;
    }
    if (filters.endDate) {
      const endLimit = new Date(filters.endDate);
      endLimit.setHours(23, 59, 59, 999);
      if (new Date(item.createdAt) > endLimit) return false;
    }
    if (filters.bairro && filters.bairro !== "todos" && filters.bairro !== "Todas" && filters.bairro !== "Todos") {
      if (item.bairro?.toLowerCase() !== filters.bairro.toLowerCase()) return false;
    }
    if (filters.status && filters.status !== "todas" && filters.status !== "todos") {
      if (item.status?.toLowerCase() !== filters.status.toLowerCase()) return false;
    }
    if (filters.gravity && filters.gravity !== "todas" && filters.gravity !== "todos") {
      const g = item.gravidade || item.gravity || "";
      if (g.toLowerCase() !== filters.gravity.toLowerCase()) return false;
    }
    return true;
  });
}

/**
 * Filtra os pontos de recolha com base nos filtros fornecidos
 */
function filterCollectionPoints(items: any[], filters: ReportFilters) {
  return items.filter((item) => {
    if (filters.bairro && filters.bairro !== "todos" && filters.bairro !== "Todas" && filters.bairro !== "Todos") {
      if (item.bairro?.toLowerCase() !== filters.bairro.toLowerCase()) return false;
    }
    if (filters.status && filters.status !== "todos" && filters.status !== "todas") {
      const statusQuery = filters.status === "ativo" || filters.status === "activo" ? "activo" : "inactivo";
      if (item.estado?.toLowerCase() !== statusQuery) return false;
    }
    return true;
  });
}

/**
 * Endpoint GET: Devolve a lista histórica de relatórios gerados
 */
export async function GET() {
  try {
    await ensureInitialized();
    const historyData = fs.readFileSync(HISTORY_FILE, "utf8");
    const history = JSON.parse(historyData);
    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao ler histórico: " + error.message }, { status: 500 });
  }
}

/**
 * Endpoint POST: Gera um novo relatório no servidor
 */
export async function POST(request: NextRequest) {
  try {
    await ensureInitialized();

    const body = await request.json();
    const { type, format, filters = {} } = body as {
      type: "occurrences" | "collection-points" | "summary" | "heatmap";
      format: "pdf" | "excel" | "csv";
      filters: ReportFilters & { ids?: string[] };
    };

    if (!type || !format) {
      return NextResponse.json({ error: "Parâmetros 'type' e 'format' são obrigatórios." }, { status: 400 });
    }

    // 1. Obter e filtrar dados
    let filteredData: any[] = [];
    let stats: any = {};

    if (type === "occurrences" || type === "summary") {
      const allOccurrences = await occurrencesService.getAll();
      filteredData = filterOccurrences(allOccurrences, filters);
      
      const targetIds = filters.ids;
      if (targetIds && Array.isArray(targetIds)) {
        filteredData = filteredData.filter(o => targetIds.includes(o.id));
      }

      // Calcular estatísticas para relatórios consolidados
      const total = filteredData.length;
      const pendentes = filteredData.filter(o => o.status === "pendente").length;
      const emProgresso = filteredData.filter(o => o.status === "em-progresso" || o.status === "em_analise").length;
      const resolvidos = filteredData.filter(o => o.status === "resolvido" || o.status === "resolvida").length;

      // Distribuição de gravidade
      const gravityDistribution = {
        critica: filteredData.filter(o => o.gravidade === "critica").length,
        alta: filteredData.filter(o => o.gravidade === "alta").length,
        media: filteredData.filter(o => o.gravidade === "media").length,
        baixa: filteredData.filter(o => o.gravidade === "baixa").length,
      };

      // Distribuição de categorias
      const categoriesMap: Record<string, number> = {};
      filteredData.forEach((o) => {
        const cat = o.category || "Outros";
        categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
      });
      const categoryDistribution = Object.entries(categoriesMap)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      stats = {
        total,
        pendentes,
        emProgresso,
        resolvidos,
        gravityDistribution,
        categoryDistribution,
        occurrencesList: filteredData
      };
    } else if (type === "collection-points") {
      const allPoints = await getCollectionPoints();
      filteredData = filterCollectionPoints(allPoints, filters);
      
      const targetIds = filters.ids;
      if (targetIds && Array.isArray(targetIds)) {
        filteredData = filteredData.filter(p => targetIds.includes(p.id));
      }
    } else if (type === "heatmap") {
      // Estatísticas determinísticas baseadas nos bairros da Beira
      const baseStats = getBeiraHeatmapStats();
      const bairrosDensity = BEIRA_BAIRROS.map((b) => ({
        bairro: b.name,
        count: b.count,
        weight: b.weight
      })).sort((a, b) => b.count - a.count);

      stats = {
        totalPoints: baseStats.totalPoints,
        bairrosCount: baseStats.bairrosCount,
        criticalZone: baseStats.criticalZone,
        bairrosDensity
      };
    }

    // 2. Gerar o Buffer do ficheiro
    let fileBuffer: Buffer;
    let extension = "";
    let mimeType = "";

    if (format === "pdf") {
      fileBuffer = await generatePDFReport(type, filteredData, filters, stats);
      extension = "pdf";
      mimeType = "application/pdf";
    } else if (format === "excel") {
      fileBuffer = await generateExcelReport(type, filteredData, filters, stats);
      extension = "xlsx";
      mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else if (format === "csv") {
      // Gerar CSV plano simples
      let csvContent = "";
      if (type === "occurrences" || type === "summary") {
        const rows = filteredData.map((o) => ({
          ID: o.id,
          Titulo: o.title,
          Categoria: o.category,
          Bairro: o.bairro || "",
          Latitude: o.latitude,
          Longitude: o.longitude,
          Gravidade: o.gravidade || "baixa",
          Estado: o.status,
          CriadoEm: o.createdAt,
        }));
        csvContent = generateCSV(rows);
      } else if (type === "collection-points") {
        const rows = filteredData.map((p) => ({
          ID: p.id,
          Nome: p.nome,
          Bairro: p.bairro,
          Latitude: p.latitude,
          Longitude: p.longitude,
          Horario: p.horario || "",
          Estado: p.estado,
        }));
        csvContent = generateCSV(rows);
      } else if (type === "heatmap") {
        const rows = BEIRA_BAIRROS.map((b) => ({
          Bairro: b.name,
          FocosAmostrados: b.count,
          PesoDensidade: b.weight,
        }));
        csvContent = generateCSV(rows);
      }
      fileBuffer = Buffer.from(csvContent, "utf8");
      extension = "csv";
      mimeType = "text/csv";
    } else {
      return NextResponse.json({ error: "Formato de arquivo não suportado." }, { status: 400 });
    }

    // 3. Salvar ficheiro físico em public/reports/
    const dateStamp = new Date().toISOString().replace(/-/g, "").replace(/:/g, "").replace(/T/g, "").slice(0, 14);
    const filename = `relatorio_${type}_${dateStamp}.${extension}`;
    const filePath = path.join(REPORTS_DIR, filename);
    fs.writeFileSync(filePath, fileBuffer);

    // 4. Registar no histórico
    const historyData = fs.readFileSync(HISTORY_FILE, "utf8");
    const historyList = JSON.parse(historyData) as ExportHistoryItem[];

    const newHistoryItem: ExportHistoryItem = {
      id: `exp-${Date.now()}`,
      filename,
      type,
      format,
      createdAt: new Date().toISOString(),
      sizeBytes: fileBuffer.length,
      url: `/reports/${filename}`,
      filters,
    };

    historyList.unshift(newHistoryItem);
    // Limitar histórico recente a 15 itens para evitar inflar o ficheiro JSON
    if (historyList.length > 15) {
      const removedItems = historyList.splice(15);
      // Apagar arquivos físicos removidos do histórico
      removedItems.forEach((item) => {
        try {
          const pathToDelete = path.join(REPORTS_DIR, item.filename);
          if (fs.existsSync(pathToDelete)) {
            fs.unlinkSync(pathToDelete);
          }
        } catch (e) {
          console.warn("Falha ao remover arquivo de relatório antigo:", e);
        }
      });
    }

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(historyList, null, 2), "utf8");

    return NextResponse.json(newHistoryItem);
  } catch (error: any) {
    console.error("Erro na geração de relatório:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao gerar relatório: " + error.message },
      { status: 500 }
    );
  }
}
