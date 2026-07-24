// src/features/reports/services/excel-generator.ts

import ExcelJS from "exceljs";
import { ReportFilters } from "../types";
import { EXCEL_STYLES, formatTableHeader, autoFitColumnWidths, drawKPIBlock } from "../templates/excel-template";

/**
 * Gera um Buffer contendo a folha Excel gerada.
 */
export async function generateExcelReport(
  type: "occurrences" | "collection-points" | "summary" | "heatmap",
  data: any[],
  filters: ReportFilters,
  stats: any
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Txeneza Admin";
  workbook.lastModifiedBy = "Txeneza Admin";
  workbook.created = new Date();
  workbook.modified = new Date();

  // 1. Criar folha 1: Resumo Executivo (KPIs)
  const summarySheet = workbook.addWorksheet("Resumo");
  summarySheet.views = [{ showGridLines: true }];

  // Título do Relatório
  let reportTitle = "";
  if (type === "occurrences") reportTitle = "Relatório de Ocorrências Urbanas";
  else if (type === "collection-points") reportTitle = "Relatório de Pontos de Recolha";
  else if (type === "summary") reportTitle = "Painel Consolidado de Estatísticas";
  else if (type === "heatmap") reportTitle = "Relatório de Análise de Densidade";

  summarySheet.getCell("B2").value = "TXENEZA — PLATAFORMA DE MAPEAMENTO DE RESÍDUOS";
  summarySheet.getCell("B2").font = { name: "Segoe UI", size: 9, bold: true, color: { argb: "FF757575" } };
  
  summarySheet.getCell("B3").value = reportTitle;
  summarySheet.getCell("B3").font = EXCEL_STYLES.titleFont;

  // Bloco de Metadados/Filtros
  summarySheet.getCell("B5").value = "Data de Geração:";
  summarySheet.getCell("B5").font = { name: "Segoe UI", size: 10, bold: true };
  const nowStr = new Date().toLocaleString("pt-PT", { timeZone: "Africa/Maputo" });
  summarySheet.getCell("C5").value = nowStr;
  summarySheet.getCell("C5").font = { name: "Segoe UI", size: 10 };

  summarySheet.getCell("B6").value = "Filtros Aplicados:";
  summarySheet.getCell("B6").font = { name: "Segoe UI", size: 10, bold: true };
  
  const filterParts: string[] = [];
  if (filters.startDate || filters.endDate) {
    filterParts.push(`Período: ${filters.startDate || "Início"} a ${filters.endDate || "Fim"}`);
  }
  if (filters.bairro) filterParts.push(`Bairro: ${filters.bairro}`);
  if (filters.status) filterParts.push(`Estado: ${filters.status}`);
  if (filters.gravity) filterParts.push(`Gravidade: ${filters.gravity}`);
  summarySheet.getCell("C6").value = filterParts.length > 0 ? filterParts.join(" | ") : "Todos os dados (Sem filtros)";
  summarySheet.getCell("C6").font = { name: "Segoe UI", size: 10, italic: true };

  // Secção de Indicadores Chave (KPIs)
  summarySheet.getCell("B9").value = "MÉTRICAS E INDICADORES DE DESEMPENHO";
  summarySheet.getCell("B9").font = EXCEL_STYLES.sectionFont;

  if (type === "occurrences") {
    // KPIs de Ocorrências
    drawKPIBlock(summarySheet, 11, 2, "Total de Casos", data.length);
    drawKPIBlock(summarySheet, 11, 4, "Pendentes", data.filter(o => o.status === "pendente").length);
    drawKPIBlock(summarySheet, 11, 6, "Em Progresso", data.filter(o => o.status === "em-progresso" || o.status === "em_analise").length);
    drawKPIBlock(summarySheet, 11, 8, "Resolvidas", data.filter(o => o.status === "resolvido" || o.status === "resolvida").length);
  } else if (type === "collection-points") {
    // KPIs de Pontos de Recolha
    drawKPIBlock(summarySheet, 11, 2, "Pontos Totais", data.length);
    drawKPIBlock(summarySheet, 11, 4, "Pontos Ativos", data.filter(p => p.estado === "activo").length);
    drawKPIBlock(summarySheet, 11, 6, "Pontos Inativos", data.filter(p => p.estado === "inactivo").length);
    drawKPIBlock(summarySheet, 11, 8, "Bairros Cobertos", new Set(data.map(p => p.bairro)).size);
  } else if (type === "summary") {
    // KPIs do Painel Geral
    drawKPIBlock(summarySheet, 11, 2, "Total Ocorrências", stats.total || 0);
    drawKPIBlock(summarySheet, 11, 4, "Pendentes", stats.pendentes || 0);
    drawKPIBlock(summarySheet, 11, 6, "Em Progresso", stats.emProgresso || 0);
    drawKPIBlock(summarySheet, 11, 8, "Resolvidas", stats.resolvidos || 0);
  } else if (type === "heatmap") {
    // KPIs do Mapa de Calor
    drawKPIBlock(summarySheet, 11, 2, "Pontos Ativos", stats.totalPoints || 0);
    drawKPIBlock(summarySheet, 11, 4, "Bairros Mapeados", stats.bairrosCount || 0);
    drawKPIBlock(summarySheet, 11, 6, "Zona Crítica", stats.criticalZone || "Nenhuma");
  }

  // Ajustar colunas da aba de resumo
  summarySheet.getColumn(1).width = 3;
  summarySheet.getColumn(2).width = 18;
  summarySheet.getColumn(3).width = 18;
  summarySheet.getColumn(4).width = 18;
  summarySheet.getColumn(5).width = 18;
  summarySheet.getColumn(6).width = 18;
  summarySheet.getColumn(7).width = 18;
  summarySheet.getColumn(8).width = 18;
  summarySheet.getColumn(9).width = 18;

  // 2. Criar folha 2: Dados Detalhados
  const detailedSheet = workbook.addWorksheet("Dados Detalhados");
  detailedSheet.views = [{ showGridLines: true }];

  if (type === "occurrences" || type === "summary") {
    // Colunas detalhadas de ocorrências
    detailedSheet.columns = [
      { header: "ID Ocorrência", key: "id", width: 12 },
      { header: "Título", key: "title", width: 25 },
      { header: "Descrição", key: "description", width: 40 },
      { header: "Categoria", key: "category", width: 20 },
      { header: "Bairro", key: "bairro", width: 18 },
      { header: "Latitude", key: "latitude", width: 15 },
      { header: "Longitude", key: "longitude", width: 15 },
      { header: "Gravidade", key: "gravidade", width: 15 },
      { header: "Estado", key: "status", width: 15 },
      { header: "Reportado Por", key: "reportedBy", width: 20 },
      { header: "Data de Criação", key: "createdAt", width: 18 },
    ];

    // Preencher linhas
    const items = type === "summary" ? (stats.occurrencesList || data) : data;
    items.forEach((item: any) => {
      const row = detailedSheet.addRow({
        id: item.id || "",
        title: item.title || item.titulo || "",
        description: item.description || item.descricao || "",
        category: item.category || item.categoria || "",
        bairro: item.bairro || "",
        latitude: item.latitude ? Number(item.latitude) : 0,
        longitude: item.longitude ? Number(item.longitude) : 0,
        gravidade: item.gravidade || "baixa",
        status: item.status === "pendente" ? "Pendente" : item.status === "resolvido" || item.status === "resolvida" ? "Resolvido" : "Em Progresso",
        reportedBy: item.reportedBy || "Munícipe",
        createdAt: item.createdAt ? new Date(new Date(item.createdAt).toLocaleString("en-US", { timeZone: "Africa/Maputo" })) : "",
      });

      // Formatar célula de Data nativa do Excel
      const dateCell = row.getCell("createdAt");
      if (dateCell.value instanceof Date) {
        dateCell.numFmt = "yyyy-mm-dd hh:mm:ss";
      }

      // Aplicar formatação condicional manual na coluna Gravidade (Coluna 8)
      const gravidadeCell = row.getCell("gravidade");
      const gravVal = String(gravidadeCell.value).toLowerCase();
      if (gravVal === "critica") {
        gravidadeCell.fill = EXCEL_STYLES.severityColors.critica.fill;
        gravidadeCell.font = EXCEL_STYLES.severityColors.critica.font;
      } else if (gravVal === "alta") {
        gravidadeCell.fill = EXCEL_STYLES.severityColors.alta.fill;
        gravidadeCell.font = EXCEL_STYLES.severityColors.alta.font;
      } else if (gravVal === "media") {
        gravidadeCell.fill = EXCEL_STYLES.severityColors.media.fill;
        gravidadeCell.font = EXCEL_STYLES.severityColors.media.font;
      } else if (gravVal === "baixa") {
        gravidadeCell.fill = EXCEL_STYLES.severityColors.baixa.fill;
        gravidadeCell.font = EXCEL_STYLES.severityColors.baixa.font;
      }

      // Bordas finas gerais
      row.eachCell((cell) => {
        cell.border = EXCEL_STYLES.cellBorder;
      });
    });

    formatTableHeader(detailedSheet, 1, 11);

  } else if (type === "collection-points") {
    // Colunas detalhadas de pontos de recolha
    detailedSheet.columns = [
      { header: "ID Ponto", key: "id", width: 12 },
      { header: "Nome do Local", key: "nome", width: 25 },
      { header: "Bairro", key: "bairro", width: 18 },
      { header: "Latitude", key: "latitude", width: 15 },
      { header: "Longitude", key: "longitude", width: 15 },
      { header: "Horário de Coleta", key: "horario", width: 15 },
      { header: "Estado", key: "estado", width: 15 },
    ];

    data.forEach((item: any) => {
      const row = detailedSheet.addRow({
        id: item.id || "",
        nome: item.nome || "",
        bairro: item.bairro || "",
        latitude: item.latitude ? Number(item.latitude) : 0,
        longitude: item.longitude ? Number(item.longitude) : 0,
        horario: item.horario || "Livre",
        estado: item.estado === "activo" ? "Ativo" : "Inativo",
      });

      row.eachCell((cell) => {
        cell.border = EXCEL_STYLES.cellBorder;
      });
    });

    formatTableHeader(detailedSheet, 1, 7);

  } else if (type === "heatmap") {
    // Colunas de Densidade por Bairro
    detailedSheet.columns = [
      { header: "Bairro", key: "bairro", width: 25 },
      { header: "Quantidade de Ocorrências", key: "count", width: 25 },
      { header: "Percentagem (%)", key: "percentage", width: 18 },
    ];

    const bairrosList = stats.bairrosDensity || [];
    const totalPoints = stats.totalPoints || 1;

    bairrosList.forEach((b: any) => {
      const percentage = (b.count / totalPoints);
      const row = detailedSheet.addRow({
        bairro: b.bairro || "",
        count: b.count || 0,
        percentage: percentage,
      });

      // Formatação de percentagem nativa
      const pctCell = row.getCell("percentage");
      pctCell.numFmt = "0.0%";

      row.eachCell((cell) => {
        cell.border = EXCEL_STYLES.cellBorder;
      });
    });

    formatTableHeader(detailedSheet, 1, 3);
  }

  // Auto-ajustar a largura das colunas da folha de detalhes
  autoFitColumnWidths(detailedSheet, 12);

  // 3. Serializar para buffer e retornar
  const excelBuffer = await workbook.xlsx.writeBuffer();
  return excelBuffer as unknown as Buffer;
}
