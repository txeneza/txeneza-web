// src/features/reports/templates/excel-template.ts

import { Worksheet } from "exceljs";

export const EXCEL_STYLES = {
  headerFill: {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: "FF01403A" }, // Forest Green
  },
  headerFont: {
    name: "Segoe UI",
    size: 11,
    bold: true,
    color: { argb: "FFFFFFFF" }, // White
  },
  titleFont: {
    name: "Segoe UI",
    size: 16,
    bold: true,
    color: { argb: "FF01403A" },
  },
  sectionFont: {
    name: "Segoe UI",
    size: 12,
    bold: true,
    color: { argb: "FF424242" },
  },
  kpiLabelFont: {
    name: "Segoe UI",
    size: 9,
    bold: true,
    color: { argb: "FF757575" }, // Neutral grey
  },
  kpiValueFont: {
    name: "Segoe UI",
    size: 18,
    bold: true,
    color: { argb: "FF212121" },
  },
  kpiBorder: {
    top: { style: "thin" as const, color: { argb: "FFE0E0E0" } },
    left: { style: "thin" as const, color: { argb: "FFE0E0E0" } },
    bottom: { style: "thin" as const, color: { argb: "FFE0E0E0" } },
    right: { style: "thin" as const, color: { argb: "FFE0E0E0" } },
  },
  cellBorder: {
    top: { style: "thin" as const, color: { argb: "FFEEEEEE" } },
    left: { style: "thin" as const, color: { argb: "FFEEEEEE" } },
    bottom: { style: "thin" as const, color: { argb: "FFEEEEEE" } },
    right: { style: "thin" as const, color: { argb: "FFEEEEEE" } },
  },
  // Severity fills and text colors (sober variants for conditional cells)
  severityColors: {
    critica: {
      fill: { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FFFEE2E2" } }, // Light red
      font: { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF991B1B" } },
    },
    alta: {
      fill: { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FFFFEDD5" } }, // Light orange
      font: { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFC2410C" } },
    },
    media: {
      fill: { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FFFEF9C3" } }, // Light yellow
      font: { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFB45309" } },
    },
    baixa: {
      fill: { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FFDCFCE7" } }, // Light green
      font: { name: "Segoe UI", size: 10, bold: true, color: { argb: "FF15803D" } },
    },
  },
};

/**
 * Aplica estilos padrão ao cabeçalho da tabela:
 * Cor de fundo forestGreen, texto bold branco, ativa auto-filtro e fixa a primeira linha (freeze panes).
 */
export function formatTableHeader(sheet: Worksheet, headerRowNumber: number, maxColumnIndex: number) {
  const row = sheet.getRow(headerRowNumber);
  row.height = 26;
  
  for (let i = 1; i <= maxColumnIndex; i++) {
    const cell = row.getCell(i);
    cell.fill = EXCEL_STYLES.headerFill;
    cell.font = EXCEL_STYLES.headerFont;
    cell.alignment = { vertical: "middle", horizontal: "left" };
    cell.border = EXCEL_STYLES.cellBorder;
  }
  row.commit();

  // Ativar filtros automáticos na tabela
  sheet.autoFilter = {
    from: { row: headerRowNumber, column: 1 },
    to: { row: headerRowNumber, column: maxColumnIndex },
  };

  // Congelar a linha do cabeçalho (faz com que fique fixa ao scrollar)
  sheet.views = [
    { state: "frozen", ySplit: headerRowNumber, xSplit: 0, activeCell: "A" + (headerRowNumber + 1) }
  ];
}

/**
 * Redimensiona a largura das colunas dinamicamente baseado no comprimento do conteúdo.
 */
export function autoFitColumnWidths(sheet: Worksheet, minWidth = 12) {
  sheet.columns.forEach((column) => {
    let maxLength = minWidth;
    if (column.values) {
      column.values.forEach((val) => {
        if (val) {
          const strVal = String(val);
          if (strVal.length > maxLength) {
            maxLength = strVal.length;
          }
        }
      });
    }
    // Adiciona uma margem extra de segurança
    column.width = Math.min(maxLength + 3, 50);
  });
}

/**
 * Desenha um cartão de KPI formatado no resumo do Excel.
 */
export function drawKPIBlock(
  sheet: Worksheet,
  startRow: number,
  startCol: number,
  label: string,
  value: string | number
) {
  // Ocupa 3 linhas x 2 colunas
  const endRow = startRow + 2;
  const endCol = startCol + 1;

  sheet.mergeCells(startRow, startCol, endRow, endCol);

  // Escrever a etiqueta e o valor em células separadas, mas como estão mescladas,
  // definimos no canto superior esquerdo
  const mainCell = sheet.getCell(startRow, startCol);
  mainCell.value = `${label}\n${value}`;
  mainCell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  
  // Aplicar borda e fundo a toda a área mesclada
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      const cell = sheet.getCell(r, c);
      cell.border = EXCEL_STYLES.kpiBorder;
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFBFBFB" },
      };
    }
  }

  // Estilização do texto (como a célula está unida, exceljs suporta rich text para separar estilos)
  mainCell.value = {
    richText: [
      { text: label.toUpperCase() + "\n", font: EXCEL_STYLES.kpiLabelFont },
      { text: String(value), font: EXCEL_STYLES.kpiValueFont },
    ],
  };
}
