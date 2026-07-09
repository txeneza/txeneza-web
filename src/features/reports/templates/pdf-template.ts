// src/features/reports/templates/pdf-template.ts

import fs from "fs";
import path from "path";
import { ReportType, ReportFilters } from "../types";

export const PDF_COLORS = {
  primary: "#01403A",   // Forest Green
  secondary: "#ADD9B8", // Sage Green
  accent: "#B5F230",    // Lime Green
  text: "#1A1A1A",      // Near-black
  mutedText: "#6B7280", // Grey
  softText: "#9CA3AF",  // Lighter grey
  lightGrey: "#F6F8F7", // Off-white for zebra rows
  headerTint: "#EEF4F0",// Subtle green-tinted panel
  border: "#E4E7E6",    // Hairline border
  white: "#FFFFFF",

  // Severity colors (sober variants for print)
  critica: "#991B1B",
  alta: "#C2410C",
  media: "#B45309",
  baixa: "#15803D",
};

const MARGIN = 40;

export interface PDFTableColumn {
  header: string;
  key: string;
  width: number;
  align?: "left" | "center" | "right";
}

/* -------------------------------------------------------------------------- */
/* Logótipo Txeneza (SVG vetorial lido de public/icons/TXENEZA.svg)           */
/* -------------------------------------------------------------------------- */

interface LogoData {
  paths: { d: string; fill: string }[];
  width: number;
  height: number;
}

let cachedLogo: LogoData | null = null;

function getLogo(): LogoData {
  if (cachedLogo) return cachedLogo;

  try {
    const svgPath = path.join(process.cwd(), "public", "icons", "TXENEZA.svg");
    const svg = fs.readFileSync(svgPath, "utf8");

    let width = 1103;
    let height = 1426;
    const vb = svg.match(/viewBox="([-\d.\s]+)"/);
    if (vb) {
      const nums = vb[1].trim().split(/\s+/).map(Number);
      if (nums.length === 4) {
        width = nums[2];
        height = nums[3];
      }
    }

    const paths: { d: string; fill: string }[] = [];
    const re = /<path\b[^>]*\bd="([^"]+)"[^>]*\bfill="([^"]+)"[^>]*>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(svg)) !== null) {
      paths.push({ d: m[1], fill: m[2] });
    }

    cachedLogo = { paths, width, height };
  } catch {
    cachedLogo = { paths: [], width: 1103, height: 1426 };
  }

  return cachedLogo;
}

/**
 * Desenha o logótipo Txeneza (vetorial) numa dada posição e altura.
 */
export function drawTxenezaLogo(doc: any, x: number, y: number, targetHeight: number) {
  const logo = getLogo();

  // Fallback: marca circular caso o SVG não seja legível.
  if (!logo.paths.length) {
    doc.save();
    const r = targetHeight / 2;
    doc.circle(x + r, y + r, r).fill(PDF_COLORS.primary);
    doc.circle(x + r, y + r, r * 0.62).fill(PDF_COLORS.secondary);
    doc.circle(x + r, y + r, r * 0.3).fill(PDF_COLORS.accent);
    doc.restore();
    return;
  }

  const scale = targetHeight / logo.height;
  doc.save();
  doc.translate(x, y);
  doc.scale(scale);
  logo.paths.forEach((p) => {
    doc.path(p.d).fill(p.fill);
  });
  doc.restore();
}

/* -------------------------------------------------------------------------- */
/* Cabeçalho institucional                                                    */
/* -------------------------------------------------------------------------- */

export function drawHeader(
  doc: any,
  title: string,
  filters: ReportFilters,
  reportType: ReportType
) {
  const pageW = doc.page.width;

  // Faixa superior de marca (letterhead)
  doc.save();
  doc.rect(0, 0, pageW, 4).fill(PDF_COLORS.primary);
  doc.rect(0, 0, 150, 4).fill(PDF_COLORS.accent);
  doc.restore();

  // Logótipo vetorial
  drawTxenezaLogo(doc, MARGIN, 20, 40);

  // Marca nominativa
  doc.font("Helvetica-Bold").fontSize(17).fillColor(PDF_COLORS.primary).text("Txeneza", 82, 22);
  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(PDF_COLORS.mutedText)
    .text("Plataforma de Gestão de Resíduos Sólidos — Cidade da Beira", 82, 43);

  // Título do relatório (direita)
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor(PDF_COLORS.text)
    .text(title, pageW / 2, 24, { align: "right", width: pageW / 2 - MARGIN });

  const nowStr = new Date().toLocaleString("pt-PT", { timeZone: "Africa/Maputo" });
  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(PDF_COLORS.softText)
    .text(`Gerado em ${nowStr}`, pageW / 2, 44, { align: "right", width: pageW / 2 - MARGIN });

  // Régua divisória com acento de marca
  const ruleY = 68;
  doc.moveTo(MARGIN, ruleY).lineTo(pageW - MARGIN, ruleY).strokeColor(PDF_COLORS.border).lineWidth(1).stroke();
  doc.moveTo(MARGIN, ruleY).lineTo(MARGIN + 90, ruleY).strokeColor(PDF_COLORS.primary).lineWidth(2).stroke();
  doc.moveTo(MARGIN, ruleY).lineTo(MARGIN + 34, ruleY).strokeColor(PDF_COLORS.accent).lineWidth(2).stroke();

  // Caixa de filtros aplicados
  const parts: string[] = [];
  if (filters.startDate || filters.endDate) {
    const start = filters.startDate ? new Date(filters.startDate).toLocaleDateString("pt-PT") : "Início";
    const end = filters.endDate ? new Date(filters.endDate).toLocaleDateString("pt-PT") : "Fim";
    parts.push(`Período: ${start} a ${end}`);
  }
  if (filters.bairro) parts.push(`Bairro: ${filters.bairro}`);
  if (filters.status) parts.push(`Estado: ${filters.status}`);
  if (filters.gravity) parts.push(`Gravidade: ${filters.gravity}`);
  const filterValue = parts.length === 0 ? "Todos os dados (sem filtros)" : parts.join("   ·   ");

  const boxY = 76;
  doc.save();
  doc.roundedRect(MARGIN, boxY, pageW - MARGIN * 2, 16, 3).fill(PDF_COLORS.headerTint);
  doc.restore();
  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .fillColor(PDF_COLORS.primary)
    .text("FILTROS", MARGIN + 8, boxY + 5.5, { lineBreak: false });
  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(PDF_COLORS.mutedText)
    .text(filterValue, MARGIN + 50, boxY + 5, {
      width: pageW - MARGIN * 2 - 58,
      ellipsis: true,
      lineBreak: false,
    });
}

/* -------------------------------------------------------------------------- */
/* Rodapé                                                                     */
/* -------------------------------------------------------------------------- */

export function drawFooters(doc: any) {
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);

    const y = doc.page.height - 40;
    const pageW = doc.page.width;

    doc.moveTo(MARGIN, y).lineTo(pageW - MARGIN, y).strokeColor(PDF_COLORS.border).lineWidth(0.5).stroke();

    // Marca à esquerda
    doc.save();
    doc.circle(MARGIN + 3, y + 11, 3).fill(PDF_COLORS.primary);
    doc.restore();
    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor(PDF_COLORS.mutedText)
      .text(
        "Txeneza · Vereação de Higiene e Salubridade — Município da Beira",
        MARGIN + 12,
        y + 8
      );

    // Número de página à direita
    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor(PDF_COLORS.softText)
      .text(`Página ${i + 1} de ${range.count}`, pageW - 150, y + 8, { align: "right", width: 110 });
  }
}

/* -------------------------------------------------------------------------- */
/* Tabela                                                                     */
/* -------------------------------------------------------------------------- */

export function drawPDFTable(
  doc: any,
  columns: PDFTableColumn[],
  data: any[],
  startY: number
) {
  const marginX = MARGIN;
  const tableWidth = doc.page.width - marginX * 2;
  const headerHeight = 24;
  const rowHeight = 21;
  const pageHeightLimit = doc.page.height - 55;
  const pad = 8;

  let currentY = startY;

  const drawTableHeader = () => {
    doc.save();
    doc.roundedRect(marginX, currentY, tableWidth, headerHeight, 3).fill(PDF_COLORS.primary);
    doc.restore();

    let x = marginX;
    columns.forEach((col) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(8)
        .fillColor(PDF_COLORS.white)
        .text(col.header.toUpperCase(), x + pad, currentY + 8, {
          width: col.width - pad * 2,
          align: col.align || "left",
        });
      x += col.width;
    });
    currentY += headerHeight;
  };

  drawTableHeader();

  const tableTop = startY;

  data.forEach((row, rowIndex) => {
    if (currentY + rowHeight > pageHeightLimit) {
      doc.addPage();
      currentY = 100;
      drawTableHeader();
    }

    // Zebra
    if (rowIndex % 2 === 1) {
      doc.save();
      doc.rect(marginX, currentY, tableWidth, rowHeight).fill(PDF_COLORS.lightGrey);
      doc.restore();
    }

    // Hairline inferior
    doc
      .moveTo(marginX, currentY + rowHeight)
      .lineTo(marginX + tableWidth, currentY + rowHeight)
      .strokeColor(PDF_COLORS.border)
      .lineWidth(0.5)
      .stroke();

    let cellX = marginX;
    columns.forEach((col) => {
      const cellValue = String(row[col.key] ?? "");
      doc
        .font("Helvetica")
        .fontSize(8.5)
        .fillColor(PDF_COLORS.text)
        .text(cellValue, cellX + pad, currentY + 6.5, {
          width: col.width - pad * 2,
          align: col.align || "left",
          ellipsis: true,
        });
      cellX += col.width;
    });

    currentY += rowHeight;
  });

  // Moldura exterior subtil
  doc
    .roundedRect(marginX, tableTop, tableWidth, currentY - tableTop, 3)
    .strokeColor(PDF_COLORS.border)
    .lineWidth(0.8)
    .stroke();

  return currentY;
}
