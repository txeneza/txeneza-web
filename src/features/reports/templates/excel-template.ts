// src/features/reports/templates/excel-template.ts

import { Worksheet, Fill, Font, Border, Borders } from "exceljs";

// ─── Brand Color Palette ──────────────────────────────────────────────────────
// Forest Green #01403A  |  Lime Green #A8E063  |  White #FFFFFF
// Neutral 50  #FAFAFA   |  Neutral 200 #E4E4E7 |  Neutral 700 #3F3F46

const C = {
  FOREST:      "FF01403A",
  FOREST_DARK: "FF012D28",
  FOREST_MID:  "FF025C53",
  LIME:        "FFA8E063",
  LIME_LIGHT:  "FFD6F0A8",
  WHITE:       "FFFFFFFF",
  NEUTRAL_50:  "FFFAFAFA",
  NEUTRAL_100: "FFF4F4F5",
  NEUTRAL_200: "FFE4E4E7",
  NEUTRAL_300: "FFD4D4D8",
  NEUTRAL_500: "FF71717A",
  NEUTRAL_700: "FF3F3F46",
  NEUTRAL_900: "FF18181B",
  // Status
  RED_BG:      "FFFEF2F2", RED_FG:    "FF991B1B", RED_BD:    "FFFECACA",
  ORANGE_BG:   "FFFFF7ED", ORANGE_FG: "FFC2410C", ORANGE_BD: "FFFFEDD5",
  AMBER_BG:    "FFFEFCE8", AMBER_FG:  "FFB45309", AMBER_BD:  "FFFEF08A",
  GREEN_BG:    "FFF0FDF4", GREEN_FG:  "FF15803D", GREEN_BD:  "FFBBF7D0",
  BLUE_BG:     "FFEFF6FF", BLUE_FG:   "FF1D4ED8", BLUE_BD:   "FFBFDBFE",
};

// ─── Shared Style Tokens ─────────────────────────────────────────────────────

const solidFill = (argb: string): Fill => ({
  type: "pattern", pattern: "solid", fgColor: { argb },
});

const font = (opts: Partial<Font>): Partial<Font> => ({
  name: "Segoe UI",
  ...opts,
});

const thinBorder = (argb = C.NEUTRAL_200): Border => ({
  style: "thin", color: { argb },
});

const thickBorder = (argb: string): Border => ({
  style: "medium", color: { argb },
});

const allBorders = (argb = C.NEUTRAL_200): Partial<Borders> => ({
  top: thinBorder(argb),
  left: thinBorder(argb),
  bottom: thinBorder(argb),
  right: thinBorder(argb),
});

// ─── Public Style Definitions ─────────────────────────────────────────────────

export const EXCEL_STYLES = {
  // Table header (Forest Green bar)
  headerFill: solidFill(C.FOREST),
  headerFont: font({ size: 10, bold: true, color: { argb: C.WHITE } }),

  // Text styles
  titleFont:   font({ size: 18, bold: true,  color: { argb: C.FOREST } }),
  subtitleFont:font({ size: 10, italic: true, color: { argb: C.NEUTRAL_500 } }),
  sectionFont: font({ size: 11, bold: true,  color: { argb: C.FOREST_DARK } }),
  labelFont:   font({ size: 9,  bold: true,  color: { argb: C.NEUTRAL_500 } }),
  bodyFont:    font({ size: 9,               color: { argb: C.NEUTRAL_900 } }),
  monoFont:    font({ size: 8,               color: { argb: C.NEUTRAL_700 } }),

  // KPI card text
  kpiLabelFont: font({ size: 8,  bold: true, color: { argb: C.NEUTRAL_500 } }),
  kpiValueFont: font({ size: 20, bold: true, color: { argb: C.FOREST } }),

  // Borders
  cellBorder:    allBorders(C.NEUTRAL_200),
  headerBorder:  allBorders(C.FOREST_MID),
  kpiBorder:     allBorders(C.NEUTRAL_300),

  // Zebra striping
  rowAlt: solidFill(C.NEUTRAL_50),

  // Severity — chip style (colored background, dark text)
  severityColors: {
    critica: {
      fill: solidFill(C.RED_BG),
      font: font({ size: 9, bold: true, color: { argb: C.RED_FG } }),
      border: allBorders(C.RED_BD),
    },
    alta: {
      fill: solidFill(C.ORANGE_BG),
      font: font({ size: 9, bold: true, color: { argb: C.ORANGE_FG } }),
      border: allBorders(C.ORANGE_BD),
    },
    media: {
      fill: solidFill(C.AMBER_BG),
      font: font({ size: 9, bold: true, color: { argb: C.AMBER_FG } }),
      border: allBorders(C.AMBER_BD),
    },
    baixa: {
      fill: solidFill(C.GREEN_BG),
      font: font({ size: 9, bold: true, color: { argb: C.GREEN_FG } }),
      border: allBorders(C.GREEN_BD),
    },
  },

  // Status chip
  statusColors: {
    pendente:      { fill: solidFill(C.AMBER_BG),  font: font({ size: 9, bold: true, color: { argb: C.AMBER_FG } }) },
    "em-progresso":{ fill: solidFill(C.BLUE_BG),   font: font({ size: 9, bold: true, color: { argb: C.BLUE_FG } }) },
    resolvido:     { fill: solidFill(C.GREEN_BG),  font: font({ size: 9, bold: true, color: { argb: C.GREEN_FG } }) },
  },

  // Brand palette exposure
  C,
};

// ─── Cover Banner ────────────────────────────────────────────────────────────
/**
 * Desenha o bloco de capa institucional — faixa verde de branding + título + metadados.
 * Ocupa as primeiras N linhas da sheet. Retorna o número da próxima linha livre.
 */
export function drawCoverBanner(
  sheet: Worksheet,
  reportTitle: string,
  subtitle: string,
  metaLines: { label: string; value: string }[],
  totalColumns: number
): number {
  const C = EXCEL_STYLES.C;

  // ── Faixa de branding (linhas 1-4) ──────────────────────────────────────
  for (let r = 1; r <= 4; r++) {
    for (let c = 1; c <= totalColumns; c++) {
      const cell = sheet.getCell(r, c);
      cell.fill = solidFill(C.FOREST);
    }
  }
  sheet.mergeCells(1, 1, 4, totalColumns);
  const brandCell = sheet.getCell(1, 1);
  brandCell.value = {
    richText: [
      { text: "TXENEZA\n", font: font({ size: 22, bold: true, color: { argb: C.WHITE } }) },
      { text: "Plataforma Municipal de Mapeamento de Resíduos — Beira, Moçambique",
        font: font({ size: 9, italic: true, color: { argb: C.LIME_LIGHT } }) },
    ],
  };
  brandCell.alignment = { vertical: "middle", horizontal: "left", indent: 2 };

  // ── Linha de separação decorativa verde-lima (linha 5) ────────────────
  for (let c = 1; c <= totalColumns; c++) {
    const cell = sheet.getCell(5, c);
    cell.fill = solidFill(C.LIME);
  }
  sheet.mergeCells(5, 1, 5, totalColumns);
  sheet.getRow(5).height = 5;

  // ── Espaço em branco (linha 6) ────────────────────────────────────────
  sheet.getRow(6).height = 8;

  // ── Título do relatório (linha 7) ─────────────────────────────────────
  sheet.mergeCells(7, 1, 7, totalColumns);
  const titleCell = sheet.getCell(7, 1);
  titleCell.value = reportTitle.toUpperCase();
  titleCell.font = font({ size: 16, bold: true, color: { argb: C.FOREST } });
  titleCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(7).height = 28;

  // ── Subtítulo (linha 8) ───────────────────────────────────────────────
  sheet.mergeCells(8, 1, 8, totalColumns);
  const subCell = sheet.getCell(8, 1);
  subCell.value = subtitle;
  subCell.font = EXCEL_STYLES.subtitleFont;
  subCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  sheet.getRow(8).height = 16;

  // ── Linha fina separadora (linha 9) ───────────────────────────────────
  for (let c = 1; c <= totalColumns; c++) {
    const cell = sheet.getCell(9, c);
    cell.fill = solidFill(C.NEUTRAL_200);
  }
  sheet.mergeCells(9, 1, 9, totalColumns);
  sheet.getRow(9).height = 2;

  // ── Bloco de metadados ────────────────────────────────────────────────
  let row = 10;
  for (const meta of metaLines) {
    sheet.getRow(row).height = 16;
    const labelCell = sheet.getCell(row, 1);
    labelCell.value = meta.label;
    labelCell.font = EXCEL_STYLES.labelFont;
    labelCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };

    // span value across remaining columns
    sheet.mergeCells(row, 2, row, totalColumns);
    const valCell = sheet.getCell(row, 2);
    valCell.value = meta.value;
    valCell.font = font({ size: 9, color: { argb: C.NEUTRAL_700 } });
    valCell.alignment = { vertical: "middle" };
    row++;
  }

  // ── Espaço pós-metadados ──────────────────────────────────────────────
  sheet.getRow(row).height = 10;
  return row + 1;
}

// ─── Table Header ─────────────────────────────────────────────────────────────
/**
 * Aplica o cabeçalho verde profissional, ativa auto-filtro e freezes.
 */
export function formatTableHeader(sheet: Worksheet, headerRowNumber: number, maxColumnIndex: number) {
  const row = sheet.getRow(headerRowNumber);
  row.height = 28;

  for (let i = 1; i <= maxColumnIndex; i++) {
    const cell = row.getCell(i);
    cell.fill = EXCEL_STYLES.headerFill;
    cell.font = EXCEL_STYLES.headerFont;
    cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    cell.border = {
      top: thickBorder(EXCEL_STYLES.C.FOREST_DARK),
      left: thinBorder(EXCEL_STYLES.C.FOREST_MID),
      bottom: thickBorder(EXCEL_STYLES.C.FOREST_DARK),
      right: thinBorder(EXCEL_STYLES.C.FOREST_MID),
    };
  }
  row.commit();

  sheet.autoFilter = {
    from: { row: headerRowNumber, column: 1 },
    to: { row: headerRowNumber, column: maxColumnIndex },
  };

  sheet.views = [
    { state: "frozen", ySplit: headerRowNumber, xSplit: 0, activeCell: `A${headerRowNumber + 1}` },
  ];
}

// ─── Zebra Row ────────────────────────────────────────────────────────────────
/**
 * Aplica fundo alternado zebra a uma linha de dados.
 * Call after adding each row.
 */
export function applyZebraRow(sheet: Worksheet, rowNumber: number, isAlt: boolean, numCols: number) {
  const row = sheet.getRow(rowNumber);
  row.height = 20;
  for (let c = 1; c <= numCols; c++) {
    const cell = row.getCell(c);
    if (isAlt && (!cell.fill || (cell.fill as any).fgColor?.argb === EXCEL_STYLES.C.WHITE)) {
      cell.fill = EXCEL_STYLES.rowAlt;
    }
    if (!cell.border || Object.keys(cell.border).length === 0) {
      cell.border = EXCEL_STYLES.cellBorder;
    }
    if (!cell.font || Object.keys(cell.font).length === 0) {
      cell.font = EXCEL_STYLES.bodyFont;
    }
    cell.alignment = { ...cell.alignment, vertical: "middle" };
  }
  row.commit();
}

// ─── Section Header ───────────────────────────────────────────────────────────
/**
 * Insere um cabeçalho de secção (linha escura fina) antes de um bloco.
 */
export function drawSectionHeader(sheet: Worksheet, rowNumber: number, label: string, totalColumns: number) {
  sheet.mergeCells(rowNumber, 1, rowNumber, totalColumns);
  const cell = sheet.getCell(rowNumber, 1);
  cell.value = label.toUpperCase();
  cell.font = font({ size: 9, bold: true, color: { argb: EXCEL_STYLES.C.WHITE } });
  cell.fill = solidFill(EXCEL_STYLES.C.FOREST_MID);
  cell.alignment = { vertical: "middle", horizontal: "left", indent: 2 };
  sheet.getRow(rowNumber).height = 20;
}

// ─── KPI Block ────────────────────────────────────────────────────────────────
/**
 * KPI card: 4 linhas x 2 colunas, com fundo verde-claro, valor grande e rótulo.
 */
export function drawKPIBlock(
  sheet: Worksheet,
  startRow: number,
  startCol: number,
  label: string,
  value: string | number,
  accentColor: string = EXCEL_STYLES.C.FOREST
) {
  const endRow = startRow + 3;
  const endCol = startCol + 1;

  // Fundo e borda do cartão
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      const cell = sheet.getCell(r, c);
      cell.fill = solidFill(EXCEL_STYLES.C.NEUTRAL_50);
      cell.border = allBorders(EXCEL_STYLES.C.NEUTRAL_200);
    }
  }

  // Faixa colorida superior do cartão (1 linha)
  for (let c = startCol; c <= endCol; c++) {
    const accentCell = sheet.getCell(startRow, c);
    accentCell.fill = solidFill(accentColor);
  }
  sheet.getRow(startRow).height = 6;

  sheet.mergeCells(startRow + 1, startCol, endRow, endCol);
  const mainCell = sheet.getCell(startRow + 1, startCol);
  mainCell.value = {
    richText: [
      { text: label.toUpperCase() + "\n", font: EXCEL_STYLES.kpiLabelFont },
      { text: String(value), font: font({ size: 22, bold: true, color: { argb: accentColor } }) },
    ],
  };
  mainCell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  for (let r = startRow + 1; r <= endRow; r++) {
    sheet.getRow(r).height = 18;
  }
}

// ─── Footer ───────────────────────────────────────────────────────────────────
/**
 * Insere uma linha de rodapé discreta no final da sheet.
 */
export function drawFooter(sheet: Worksheet, footerRow: number, totalColumns: number) {
  sheet.mergeCells(footerRow, 1, footerRow, totalColumns);
  const cell = sheet.getCell(footerRow, 1);
  const now = new Date().toLocaleString("pt-PT", { timeZone: "Africa/Maputo" });
  cell.value = `Gerado automaticamente pelo sistema Txeneza em ${now} | Uso interno — Câmara Municipal da Beira`;
  cell.font = font({ size: 8, italic: true, color: { argb: EXCEL_STYLES.C.NEUTRAL_500 } });
  cell.fill = solidFill(EXCEL_STYLES.C.NEUTRAL_100);
  cell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(footerRow).height = 18;

  // Linha decorativa acima do rodapé
  for (let c = 1; c <= totalColumns; c++) {
    sheet.getCell(footerRow - 1, c).fill = solidFill(EXCEL_STYLES.C.LIME);
  }
  sheet.mergeCells(footerRow - 1, 1, footerRow - 1, totalColumns);
  sheet.getRow(footerRow - 1).height = 3;
}

// ─── Auto-fit Column Widths ───────────────────────────────────────────────────
export function autoFitColumnWidths(sheet: Worksheet, minWidth = 12) {
  sheet.columns.forEach((column) => {
    let maxLength = minWidth;
    column.values?.forEach((val) => {
      if (val) {
        const strVal = typeof val === "object" && "richText" in (val as any)
          ? (val as any).richText.map((r: any) => r.text).join("")
          : String(val);
        if (strVal.length > maxLength) maxLength = strVal.length;
      }
    });
    column.width = Math.min(maxLength + 4, 55);
  });
}
