
// src/features/reports/services/excel-generator.ts

import ExcelJS from "exceljs";
import { ReportFilters } from "../types";
import {
  EXCEL_STYLES,
  drawCoverBanner,
  drawSectionHeader,
  drawKPIBlock,
  drawFooter,
  formatTableHeader,
  applyZebraRow,
  autoFitColumnWidths,
} from "../templates/excel-template";

const C = EXCEL_STYLES.C;

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(raw: any): Date | string {
  if (!raw) return "";
  try {
    return new Date(new Date(raw).toLocaleString("en-US", { timeZone: "Africa/Maputo" }));
  } catch {
    return String(raw);
  }
}

function gravityLabel(g: string): string {
  return ({ critica: "Crítica", alta: "Alta", media: "Média", baixa: "Baixa" }[g.toLowerCase()] ?? g);
}

function statusLabel(s: string): string {
  if (s === "pendente") return "Pendente";
  if (s === "resolvido" || s === "resolvida") return "Resolvida";
  if (s === "em-progresso" || s === "em_analise") return "Em Progresso";
  return s;
}

function filterSummary(filters: ReportFilters): string {
  const parts: string[] = [];
  if (filters.startDate || filters.endDate)
    parts.push(`Período: ${filters.startDate ?? "Início"} → ${filters.endDate ?? "Hoje"}`);
  if (filters.bairro)   parts.push(`Bairro: ${filters.bairro}`);
  if (filters.status)   parts.push(`Estado: ${filters.status}`);
  if (filters.gravity)  parts.push(`Gravidade: ${filters.gravity}`);
  return parts.length > 0 ? parts.join("   •   ") : "Todos os dados (sem filtros activos)";
}

// ─── Main Generator ──────────────────────────────────────────────────────────

export async function generateExcelReport(
  type: "occurrences" | "collection-points" | "summary" | "heatmap",
  data: any[],
  filters: ReportFilters,
  stats: any
): Promise<Buffer> {

  // ── Workbook metadata ─────────────────────────────────────────────────
  const workbook = new ExcelJS.Workbook();
  workbook.creator        = "Txeneza Admin";
  workbook.lastModifiedBy = "Txeneza Admin";
  workbook.created        = new Date();
  workbook.modified       = new Date();
  workbook.properties.date1904 = false;

  // ── Title map ─────────────────────────────────────────────────────────
  const TITLES: Record<string, string> = {
    occurrences:        "Relatório de Ocorrências Urbanas",
    "collection-points": "Relatório de Pontos de Recolha",
    summary:            "Painel Consolidado de Estatísticas",
    heatmap:            "Relatório de Análise de Densidade Espacial",
  };
  const reportTitle = TITLES[type] ?? "Relatório";

  // ═══════════════════════════════════════════════════════════════════════
  // ABA 1 — RESUMO EXECUTIVO
  // ═══════════════════════════════════════════════════════════════════════
  const summarySheet = workbook.addWorksheet("Resumo Executivo", {
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1 },
  });
  summarySheet.views = [{ showGridLines: false }];

  const SUMMARY_COLS = 12;
  for (let c = 1; c <= SUMMARY_COLS; c++) {
    summarySheet.getColumn(c).width = 16;
  }
  summarySheet.getColumn(1).width = 3;
  summarySheet.getColumn(2).width = 22;

  const nowStr = new Date().toLocaleString("pt-PT", { timeZone: "Africa/Maputo" });

  // Cover banner
  const nextRow = drawCoverBanner(
    summarySheet,
    reportTitle,
    "Câmara Municipal da Beira · Sistema de Gestão de Resíduos Urbanos",
    [
      { label: "Data de Geração:", value: nowStr },
      { label: "Filtros Aplicados:", value: filterSummary(filters) },
      { label: "Total de Registos:", value: `${data.length} entrada${data.length !== 1 ? "s" : ""}` },
    ],
    SUMMARY_COLS
  );

  // Section header for KPIs
  drawSectionHeader(summarySheet, nextRow, "Indicadores-Chave de Desempenho (KPIs)", SUMMARY_COLS);
  const kpiStart = nextRow + 2;

  // KPI cards (row, col) — 4 cards side by side, each 2 cols wide
  const KPI_ROW = kpiStart;
  if (type === "occurrences" || type === "summary") {
    const total  = type === "summary" ? (stats.total ?? 0) : data.length;
    const pend   = type === "summary" ? (stats.pendentes ?? 0)  : data.filter((o: any) => o.status === "pendente").length;
    const prog   = type === "summary" ? (stats.emProgresso ?? 0) : data.filter((o: any) => ["em-progresso","em_analise"].includes(o.status)).length;
    const resol  = type === "summary" ? (stats.resolvidos ?? 0) : data.filter((o: any) => ["resolvido","resolvida"].includes(o.status)).length;

    drawKPIBlock(summarySheet, KPI_ROW, 2, "Total de Casos",  total, C.FOREST);
    drawKPIBlock(summarySheet, KPI_ROW, 5, "Pendentes",       pend,  C.AMBER_FG);
    drawKPIBlock(summarySheet, KPI_ROW, 8, "Em Progresso",    prog,  C.BLUE_FG);
    drawKPIBlock(summarySheet, KPI_ROW, 11,"Resolvidas",      resol, C.GREEN_FG);

  } else if (type === "collection-points") {
    const ativos   = data.filter((p: any) => p.estado === "activo").length;
    const inativos = data.filter((p: any) => p.estado !== "activo").length;
    const bairros  = new Set(data.map((p: any) => p.bairro)).size;

    drawKPIBlock(summarySheet, KPI_ROW, 2, "Total de Pontos", data.length, C.FOREST);
    drawKPIBlock(summarySheet, KPI_ROW, 5, "Pontos Ativos",   ativos,     C.GREEN_FG);
    drawKPIBlock(summarySheet, KPI_ROW, 8, "Pontos Inativos", inativos,   C.RED_FG);
    drawKPIBlock(summarySheet, KPI_ROW, 11,"Bairros Cobertos",bairros,    C.FOREST_MID);

  } else if (type === "heatmap") {
    drawKPIBlock(summarySheet, KPI_ROW, 2, "Pontos Activos",   stats.totalPoints  ?? 0, C.FOREST);
    drawKPIBlock(summarySheet, KPI_ROW, 5, "Bairros Mapeados", stats.bairrosCount ?? 0, C.FOREST_MID);
    drawKPIBlock(summarySheet, KPI_ROW, 8, "Zona Crítica",     stats.criticalZone ?? "—", C.RED_FG);
  }

  // Spacer after KPIs (5 rows)
  const afterKPI = KPI_ROW + 6;

  // Summary note block
  drawSectionHeader(summarySheet, afterKPI, "Notas e Observações", SUMMARY_COLS);
  summarySheet.mergeCells(afterKPI + 1, 1, afterKPI + 3, SUMMARY_COLS);
  const noteCell = summarySheet.getCell(afterKPI + 1, 1);
  noteCell.value =
    "Este relatório foi gerado automaticamente pelo sistema Txeneza. " +
    "Os dados reflectem o estado da base de dados no momento da exportação. " +
    "Para informações adicionais, consulte o administrador do sistema ou aceda ao painel em txeneza.vercel.app.";
  noteCell.font    = { name: "Segoe UI", size: 9, italic: true, color: { argb: C.NEUTRAL_700 } };
  noteCell.fill    = EXCEL_STYLES.rowAlt;
  noteCell.alignment = { vertical: "top", horizontal: "left", indent: 2, wrapText: true };
  [afterKPI + 1, afterKPI + 2, afterKPI + 3].forEach(r => { summarySheet.getRow(r).height = 18; });

  drawFooter(summarySheet, afterKPI + 5, SUMMARY_COLS);

  // ═══════════════════════════════════════════════════════════════════════
  // ABA 2 — DADOS DETALHADOS
  // ═══════════════════════════════════════════════════════════════════════
  const detailedSheet = workbook.addWorksheet("Dados Detalhados", {
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1 },
  });
  detailedSheet.views = [{ showGridLines: false }];

  // ── Occurrences / Summary ─────────────────────────────────────────────
  if (type === "occurrences" || type === "summary") {
    const NUM_COLS = 10;

    detailedSheet.columns = [
      { header: "ID",           key: "id",          width: 14 },
      { header: "Descrição",    key: "description", width: 42 },
      { header: "Categoria",    key: "category",    width: 22 },
      { header: "Bairro",       key: "bairro",      width: 18 },
      { header: "Gravidade",    key: "gravidade",   width: 14 },
      { header: "Estado",       key: "status",      width: 16 },
      { header: "Latitude",     key: "latitude",    width: 14 },
      { header: "Longitude",    key: "longitude",   width: 14 },
      { header: "Reportado Por",key: "reportedBy",  width: 22 },
      { header: "Data / Hora",  key: "createdAt",   width: 20 },
    ];

    formatTableHeader(detailedSheet, 1, NUM_COLS);

    const items = type === "summary" ? (stats.occurrencesList ?? data) : data;
    items.forEach((item: any, idx: number) => {
      const rowData = {
        id:          item.id ?? "",
        description: item.description ?? item.descricao ?? "",
        category:    item.category    ?? item.categoria  ?? "",
        bairro:      item.bairro      ?? "",
        gravidade:   gravityLabel(item.gravidade ?? "baixa"),
        status:      statusLabel(item.status     ?? ""),
        latitude:    item.latitude  ? Number(item.latitude)  : 0,
        longitude:   item.longitude ? Number(item.longitude) : 0,
        reportedBy:  item.reportedBy ?? "Munícipe",
        createdAt:   formatDate(item.createdAt),
      };

      const row = detailedSheet.addRow(rowData);
      const rowNum = row.number;

      // Date formatting
      const dateCell = row.getCell("createdAt");
      if (dateCell.value instanceof Date) dateCell.numFmt = "dd/mm/yyyy hh:mm";

      // Gravity chip
      const gravKey = (item.gravidade ?? "baixa").toLowerCase() as keyof typeof EXCEL_STYLES.severityColors;
      const gravStyle = EXCEL_STYLES.severityColors[gravKey] ?? EXCEL_STYLES.severityColors.baixa;
      const gravCell = row.getCell("gravidade");
      gravCell.fill   = gravStyle.fill;
      gravCell.font   = gravStyle.font;
      gravCell.border = gravStyle.border;
      gravCell.alignment = { horizontal: "center", vertical: "middle" };

      // Status chip
      const statusKey = (item.status ?? "pendente") as keyof typeof EXCEL_STYLES.statusColors;
      const statusStyle = EXCEL_STYLES.statusColors[statusKey] ?? EXCEL_STYLES.statusColors["pendente"];
      const statusCell = row.getCell("status");
      statusCell.fill = statusStyle.fill;
      statusCell.font = statusStyle.font;
      statusCell.alignment = { horizontal: "center", vertical: "middle" };

      applyZebraRow(detailedSheet, rowNum, idx % 2 === 1, NUM_COLS);
    });

    drawFooter(detailedSheet, detailedSheet.rowCount + 2, NUM_COLS);

  // ── Collection Points ─────────────────────────────────────────────────
  } else if (type === "collection-points") {
    const NUM_COLS = 7;

    detailedSheet.columns = [
      { header: "ID",             key: "id",      width: 14 },
      { header: "Nome do Local",  key: "nome",    width: 30 },
      { header: "Bairro",         key: "bairro",  width: 20 },
      { header: "Latitude",       key: "lat",     width: 14 },
      { header: "Longitude",      key: "lon",     width: 14 },
      { header: "Horário",        key: "horario", width: 20 },
      { header: "Estado",         key: "estado",  width: 14 },
    ];

    formatTableHeader(detailedSheet, 1, NUM_COLS);

    data.forEach((item: any, idx: number) => {
      const isActivo = item.estado === "activo";
      const row = detailedSheet.addRow({
        id:      item.id       ?? "",
        nome:    item.nome     ?? "",
        bairro:  item.bairro   ?? "",
        lat:     item.latitude  ? Number(item.latitude)  : 0,
        lon:     item.longitude ? Number(item.longitude) : 0,
        horario: item.horario  ?? "Livre",
        estado:  isActivo ? "Ativo" : "Inativo",
      });
      const rowNum = row.number;

      // Status chip
      const estadoCell = row.getCell("estado");
      estadoCell.fill = isActivo ? EXCEL_STYLES.severityColors.baixa.fill : EXCEL_STYLES.severityColors.critica.fill;
      estadoCell.font = isActivo ? EXCEL_STYLES.severityColors.baixa.font : EXCEL_STYLES.severityColors.critica.font;
      estadoCell.border = isActivo ? EXCEL_STYLES.severityColors.baixa.border : EXCEL_STYLES.severityColors.critica.border;
      estadoCell.alignment = { horizontal: "center", vertical: "middle" };

      applyZebraRow(detailedSheet, rowNum, idx % 2 === 1, NUM_COLS);
    });

    drawFooter(detailedSheet, detailedSheet.rowCount + 2, NUM_COLS);

  // ── Heatmap density ───────────────────────────────────────────────────
  } else if (type === "heatmap") {
    const NUM_COLS = 4;

    detailedSheet.columns = [
      { header: "#",                      key: "rank",       width: 6  },
      { header: "Bairro",                 key: "bairro",     width: 30 },
      { header: "Ocorrências",            key: "count",      width: 18 },
      { header: "Percentagem do Total",   key: "percentage", width: 22 },
    ];

    formatTableHeader(detailedSheet, 1, NUM_COLS);

    const bairrosList: any[] = stats.bairrosDensity ?? [];
    const totalPoints = Math.max(stats.totalPoints ?? 1, 1);

    bairrosList.forEach((b: any, idx: number) => {
      const pct = b.count / totalPoints;
      const row = detailedSheet.addRow({
        rank:       idx + 1,
        bairro:     b.bairro ?? "",
        count:      b.count  ?? 0,
        percentage: pct,
      });
      const rowNum = row.number;
      row.getCell("percentage").numFmt = "0.0%";
      row.getCell("rank").alignment = { horizontal: "center", vertical: "middle" };

      // Heat colouring by density
      const densityCell = row.getCell("count");
      if (pct >= 0.3) {
        densityCell.fill = EXCEL_STYLES.severityColors.critica.fill;
        densityCell.font = EXCEL_STYLES.severityColors.critica.font;
      } else if (pct >= 0.15) {
        densityCell.fill = EXCEL_STYLES.severityColors.alta.fill;
        densityCell.font = EXCEL_STYLES.severityColors.alta.font;
      } else if (pct >= 0.07) {
        densityCell.fill = EXCEL_STYLES.severityColors.media.fill;
        densityCell.font = EXCEL_STYLES.severityColors.media.font;
      }
      densityCell.alignment = { horizontal: "right", vertical: "middle" };

      applyZebraRow(detailedSheet, rowNum, idx % 2 === 1, NUM_COLS);
    });

    drawFooter(detailedSheet, detailedSheet.rowCount + 2, NUM_COLS);
  }

  // Auto-fit
  autoFitColumnWidths(detailedSheet, 12);

  // ═══════════════════════════════════════════════════════════════════════
  // Serialize and return
  // ═══════════════════════════════════════════════════════════════════════
  const excelBuffer = await workbook.xlsx.writeBuffer();
  return excelBuffer as unknown as Buffer;
}
