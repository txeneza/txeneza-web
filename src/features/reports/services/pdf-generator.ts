import PDFDocument from "pdfkit";
import path from "path";
import { ReportFilters } from "../types";
import { PDF_COLORS, drawHeader, drawFooters, drawPDFTable } from "../templates/pdf-template";

/**
 * Gera um Buffer contendo o PDF do relatório gerado.
 */
export async function generatePDFReport(
  type: "occurrences" | "collection-points" | "summary" | "heatmap",
  data: any[],
  filters: ReportFilters,
  stats: any
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Usar bufferPages: true para podermos calcular o número total de páginas no rodapé no final
      // As fontes padrão (Helvetica/-Bold/-Oblique) são carregadas pelo próprio
      // PDFKit a partir de node_modules. O pacote está marcado como externo em
      // next.config.ts (serverExternalPackages) para que os .afm sejam encontrados.
      const doc = new PDFDocument({
        bufferPages: true,
        size: "A4",
        margin: 40,
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });
      doc.on("error", (err) => reject(err));

      // 1. Configurar página inicial com cabeçalho
      let docTitle = "";
      if (type === "occurrences") docTitle = "Relatório de Ocorrências";
      else if (type === "collection-points") docTitle = "Pontos de Recolha Oficiais";
      else if (type === "summary") docTitle = "Resumo Consolidado do Painel";
      else if (type === "heatmap") docTitle = "Análise de Densidade Espacial";

      // Evento para re-desenhar cabeçalho ao adicionar novas páginas
      doc.on("pageAdded", () => {
        drawHeader(doc, docTitle, filters, type);
      });

      // Desenhar cabeçalho da página 1
      drawHeader(doc, docTitle, filters, type);

      let currentY = 110;

      // 2. Gerar conteúdo específico de acordo com o tipo
      if (type === "occurrences") {
        // --- RELATÓRIO DE OCORRÊNCIAS ---
        // Desenhar mini KPIs
        currentY = drawMiniKPIs(doc, currentY, [
          { label: "Total Ocorrências", value: data.length },
          { label: "Pendentes", value: data.filter(o => o.status === "pendente").length },
          { label: "Em Progresso", value: data.filter(o => o.status === "em-progresso" || o.status === "em_analise").length },
          { label: "Resolvidas", value: data.filter(o => o.status === "resolvido" || o.status === "resolvida").length }
        ]);

        currentY += 15;

        // Desenhar Tabela
        doc.font("Helvetica-Bold").fontSize(11).fillColor(PDF_COLORS.primary).text("Registos Detalhados", 40, currentY);
        currentY += 15;

        const columns = [
          { header: "Título", key: "title", width: 140 },
          { header: "Categoria", key: "category", width: 90 },
          { header: "Bairro", key: "bairro", width: 80 },
          { header: "Gravidade", key: "gravidade", width: 60, align: "center" as const },
          { header: "Estado", key: "estadoLabel", width: 75, align: "center" as const },
          { header: "Data", key: "dataStr", width: 70, align: "center" as const }
        ];

        // Mapear dados para exibição na tabela
        const mappedData = data.map((o) => ({
          title: o.title || o.titulo || "",
          category: o.category || o.categoria || "",
          bairro: o.bairro || "",
          gravidade: o.gravidade || "baixa",
          estadoLabel: o.status === "pendente" ? "Pendente" : o.status === "resolvido" || o.status === "resolvida" ? "Resolvida" : "Em Progresso",
          dataStr: o.createdAt ? new Date(o.createdAt).toLocaleDateString("pt-PT") : ""
        }));

        drawPDFTable(doc, columns, mappedData, currentY);

      } else if (type === "collection-points") {
        // --- RELATÓRIO DE PONTOS DE RECOLHA ---
        // Desenhar mini KPIs
        currentY = drawMiniKPIs(doc, currentY, [
          { label: "Total Contentores", value: data.length },
          { label: "Ativos", value: data.filter(p => p.estado === "activo").length },
          { label: "Inativos", value: data.filter(p => p.estado === "inactivo").length },
          { label: "Bairros Cobertos", value: new Set(data.map(p => p.bairro)).size }
        ]);

        currentY += 15;

        doc.font("Helvetica-Bold").fontSize(11).fillColor(PDF_COLORS.primary).text("Contentores e Locais Cadastrados", 40, currentY);
        currentY += 15;

        const columns = [
          { header: "Nome do Local", key: "nome", width: 140 },
          { header: "Bairro", key: "bairro", width: 95 },
          { header: "Horário", key: "horario", width: 100 },
          { header: "Coordenadas", key: "coords", width: 100, align: "center" as const },
          { header: "Estado", key: "estadoLabel", width: 80, align: "center" as const }
        ];

        const mappedData = data.map((p) => ({
          nome: p.nome || "",
          bairro: p.bairro || "",
          horario: p.horario || "Livre",
          coords: `${Number(p.latitude).toFixed(4)}, ${Number(p.longitude).toFixed(4)}`,
          estadoLabel: p.estado === "activo" ? "Ativo" : "Inativo"
        }));

        drawPDFTable(doc, columns, mappedData, currentY);

      } else if (type === "summary") {
        // --- RELATÓRIO CONSOLIDADO DO PAINEL DE CONTROLE ---
        // KPIs Principais
        currentY = drawMiniKPIs(doc, currentY, [
          { label: "Total Ocorrências", value: stats.total || 0 },
          { label: "Pendentes", value: stats.pendentes || 0 },
          { label: "Em Progresso", value: stats.emProgresso || 0 },
          { label: "Resolvidas", value: stats.resolvidos || 0 }
        ]);

        currentY += 25;

        // Gráficos Vectoriais
        // Título Gráfico Donut de Gravidade
        doc.font("Helvetica-Bold").fontSize(11).fillColor(PDF_COLORS.primary).text("Distribuição por Níveis de Gravidade", 40, currentY);
        
        // Dados do gráfico donut
        const gravityData = [
          { label: "Crítica", value: stats.gravityDistribution?.critica || 0, color: PDF_COLORS.critica },
          { label: "Alta", value: stats.gravityDistribution?.alta || 0, color: PDF_COLORS.alta },
          { label: "Média", value: stats.gravityDistribution?.media || 0, color: PDF_COLORS.media },
          { label: "Baixa", value: stats.gravityDistribution?.baixa || 0, color: PDF_COLORS.baixa }
        ];

        drawDonutChart(doc, 130, currentY + 70, 48, gravityData);

        // Gráfico de Categorias ao lado do gráfico circular
        doc.font("Helvetica-Bold").fontSize(11).fillColor(PDF_COLORS.primary).text("Incidências por Categoria", 300, currentY);
        
        const categoryData = (stats.categoryDistribution || []).slice(0, 5).map((c: any) => ({
          label: c.category,
          value: c.count
        }));

        drawHorizontalBarChart(doc, 300, currentY + 30, 215, 18, categoryData);

        currentY += 140;

        // Adicionar uma secção de recomendações da Direção Municipal
        doc.moveTo(40, currentY).lineTo(doc.page.width - 40, currentY).strokeColor(PDF_COLORS.border).lineWidth(1).stroke();
        currentY += 15;

        doc.font("Helvetica-Bold").fontSize(10).fillColor(PDF_COLORS.primary).text("Análise Qualitativa e Recomendações de Gestão", 40, currentY);
        currentY += 15;
        
        doc.font("Helvetica").fontSize(9).fillColor(PDF_COLORS.text).text(
          "1. Alocação Prioritária: Com base na distribuição estatística de severidade, as ocorrências identificadas como Críticas e Altas devem ser despachadas no prazo regulamentar de 12 horas, priorizando áreas residenciais densas.\n\n" +
          "2. Rota de Recolha: Recomenda-se a readequação das rotas operacionais dos camiões compactadores do município de forma a cobrir as categorias de maior incidência identificadas nos gráficos acima.\n\n" +
          "3. Sensibilização Comunitária: Os bairros com focos recorrentes necessitam de campanhas de higiene organizadas em articulação com as respetivas Secretarias de Bairro.",
          40, currentY, { width: 515, align: "justify", lineGap: 3 }
        );

      } else if (type === "heatmap") {
        // --- RELATÓRIO DO MAPA DE CALOR ---
        // KPIs
        currentY = drawMiniKPIs(doc, currentY, [
          { label: "Focos Monitorizados", value: stats.totalPoints || 0 },
          { label: "Bairros Analisados", value: stats.bairrosCount || 0 },
          { label: "Zona Mais Crítica", value: stats.criticalZone || "Não Definida" }
        ]);

        currentY += 25;

        doc.font("Helvetica-Bold").fontSize(11).fillColor(PDF_COLORS.primary).text("Densidade Relativa de Resíduos por Bairro", 40, currentY);
        currentY += 15;

        // Desenhar Gráfico de Barras dos bairros mais afetados
        const bairroData = (stats.bairrosDensity || []).slice(0, 7).map((b: any) => ({
          label: b.bairro,
          value: b.count
        }));

        drawHorizontalBarChart(doc, 40, currentY, 515, 20, bairroData);
        currentY += 170;

        doc.moveTo(40, currentY).lineTo(doc.page.width - 40, currentY).strokeColor(PDF_COLORS.border).lineWidth(1).stroke();
        currentY += 15;

        doc.font("Helvetica-Bold").fontSize(10).fillColor(PDF_COLORS.primary).text("Orientações para Operações de Higiene e Salubridade", 40, currentY);
        currentY += 15;

        doc.font("Helvetica").fontSize(9).fillColor(PDF_COLORS.text).text(
          "O gradiente térmico de densidade espacial aponta para uma concentração significativa de focos de deposição irregular na zona de estudo indicada como Crítica. " +
          "Para mitigar esta acumulação sob restrições orçamentais, recomenda-se a seguinte estratégia híbrida:\n\n" +
          "• Instalação de Micro-contentores: Posicionar novos contentores de 1.1m³ num raio máximo de 150 metros das coordenadas centrais do mapa de calor.\n" +
          "• Fiscalização Urbana: Implementar patrulhas comunitárias para mitigar as lixeiras informais e desencorajar a deposição de resíduos industriais/entulho por terceiros.\n" +
          "• Plano de Contingência para Drenagem: Monitorizar os pontos localizados em valas de drenagem antes da época das chuvas na Beira.",
          40, currentY, { width: 515, align: "justify", lineGap: 3.5 }
        );
      }

      // 3. Finalizar documento e desenhar rodapés em todas as páginas
      drawFooters(doc);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Desenha cartões com métricas de KPI no PDF.
 */
function drawMiniKPIs(doc: any, y: number, items: { label: string; value: string | number }[]) {
  const startX = 40;
  const totalWidth = doc.page.width - startX * 2;
  const gap = 12;
  const count = items.length || 1;
  const cardWidth = (totalWidth - gap * (count - 1)) / count;
  const cardHeight = 46;

  items.forEach((item, index) => {
    const x = startX + index * (cardWidth + gap);

    // Cartão com cantos arredondados
    doc.save();
    doc.roundedRect(x, y, cardWidth, cardHeight, 4).fill(PDF_COLORS.lightGrey);
    doc.restore();
    doc.save();
    doc.roundedRect(x, y, cardWidth, cardHeight, 4)
       .strokeColor(PDF_COLORS.border)
       .lineWidth(0.6)
       .stroke();
    doc.restore();

    // Acento de marca à esquerda
    doc.save();
    doc.roundedRect(x, y + 4, 3, cardHeight - 8, 1.5).fill(PDF_COLORS.primary);
    doc.restore();

    // Etiqueta
    doc.font("Helvetica-Bold").fontSize(6.5).fillColor(PDF_COLORS.mutedText)
       .text(item.label.toUpperCase(), x + 12, y + 10, { width: cardWidth - 18, ellipsis: true });

    // Valor
    doc.font("Helvetica-Bold").fontSize(15).fillColor(PDF_COLORS.primary)
       .text(String(item.value), x + 12, y + 22, { width: cardWidth - 18, ellipsis: true });
  });

  return y + cardHeight;
}

/**
 * Desenha um Gráfico Donut Vectorial no PDF.
 */
function drawDonutChart(doc: any, x: number, y: number, radius: number, data: { label: string; value: number; color: string }[]) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  if (total === 0) {
    doc.font("Helvetica-Oblique").fontSize(8.5).fillColor(PDF_COLORS.mutedText).text("Sem dados suficientes", x - 40, y);
    return;
  }

  let startAngle = -Math.PI / 2; // Começar no topo (-90º)

  data.forEach((slice) => {
    if (slice.value === 0) return;
    const sliceAngle = (slice.value / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    // Desenhar fatia
    doc.save();
    doc.beginPath();
    doc.moveTo(x, y);
    doc.arc(x, y, radius, startAngle, endAngle);
    doc.lineTo(x, y);
    doc.fillColor(slice.color).fill();
    doc.restore();

    startAngle = endAngle;
  });

  // Fazer o buraco do donut desenhando um círculo branco por cima do centro
  doc.save();
  doc.circle(x, y, radius * 0.55).fillColor("#FFFFFF").fill();
  doc.restore();

  // Desenhar Legenda ao lado direito do gráfico
  let legendX = x + radius + 20;
  let legendY = y - radius + 10;

  data.forEach((slice) => {
    const percentage = ((slice.value / total) * 100).toFixed(1);
    
    // Quadrado de cor da legenda
    doc.save();
    doc.rect(legendX, legendY, 8, 8).fillColor(slice.color).fill();
    doc.restore();

    // Texto descritivo
    doc.font("Helvetica").fontSize(8).fillColor(PDF_COLORS.text)
       .text(`${slice.label}: ${slice.value} (${percentage}%)`, legendX + 14, legendY);
    
    legendY += 15;
  });
}

/**
 * Desenha um Gráfico de Barras Horizontal no PDF.
 */
function drawHorizontalBarChart(
  doc: any,
  x: number,
  y: number,
  width: number,
  rowHeight: number,
  data: { label: string; value: number }[]
) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  let currentY = y;
  const labelWidth = 100;

  if (data.length === 0) {
    doc.font("Helvetica-Oblique").fontSize(8.5).fillColor(PDF_COLORS.mutedText).text("Sem dados disponíveis", x, y + 10);
    return;
  }

  data.forEach((item) => {
    // Escrever nome da categoria
    doc.font("Helvetica-Bold").fontSize(8).fillColor(PDF_COLORS.text)
       .text(item.label, x, currentY + 4, { width: labelWidth - 10, ellipsis: true });

    // Desenhar a barra
    const barMaxWidth = width - labelWidth - 30;
    const barWidth = (item.value / maxVal) * barMaxWidth;
    
    doc.save();
    doc.rect(x + labelWidth, currentY + 2, Math.max(barWidth, 3), rowHeight - 6)
       .fillColor(PDF_COLORS.primary)
       .fill();
    doc.restore();

    // Escrever o valor no final da barra
    doc.font("Helvetica").fontSize(8).fillColor(PDF_COLORS.mutedText)
       .text(String(item.value), x + labelWidth + Math.max(barWidth, 3) + 6, currentY + 4);

    currentY += rowHeight;
  });
}
