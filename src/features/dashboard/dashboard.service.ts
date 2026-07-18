import { Occurrence } from "../occurrences/occurrences.types";
import { occurrencesService } from "../occurrences/occurrences.service";

export interface DashboardStats {
  total: number;
  pendentes: number;
  emProgresso: number;
  resolvidos: number;
  rejeitados: number;
  categoryDistribution: { category: string; count: number }[];
  gravityDistribution: {
    baixa: number;
    media: number;
    alta: number;
    critica: number;
  };
  timelineData: { date: string; count: number }[];
  /**
   * Variação percentual do total de ocorrências registadas no mês atual
   * em relação ao mês anterior, calculada a partir de timelineData.
   * `null` quando não há dados suficientes (ex.: mês anterior sem registos)
   * para produzir uma percentagem real e não fabricada.
   */
  totalTrend: { value: string; positive: boolean } | null;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const occurrences = await occurrencesService.getAll();
    
    const stats: DashboardStats = {
      total: occurrences.length,
      pendentes: occurrences.filter(o => o.status === "pendente").length,
      emProgresso: occurrences.filter(o => o.status === "em-progresso").length,
      resolvidos: occurrences.filter(o => o.status === "resolvido").length,
      rejeitados: occurrences.filter(o => o.status === "rejeitado").length,
      categoryDistribution: [],
      gravityDistribution: {
        baixa: occurrences.filter(o => o.gravidade === "baixa").length,
        media: occurrences.filter(o => o.gravidade === "media").length,
        alta: occurrences.filter(o => o.gravidade === "alta").length,
        critica: occurrences.filter(o => o.gravidade === "critica").length,
      },
      timelineData: [],
      totalTrend: null,
    };

    // Mapeamento de categorias
    const categoriesMap = new Map<string, number>();
    occurrences.forEach(o => {
      const cat = o.category || "Outros";
      categoriesMap.set(cat, (categoriesMap.get(cat) || 0) + 1);
    });

    stats.categoryDistribution = Array.from(categoriesMap.entries()).map(([category, count]) => ({
      category,
      count,
    }));

    // Histórico de ocorrências dos últimos 6 meses
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const last6MonthsList: { date: string; count: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      last6MonthsList.push({
        date: months[d.getMonth()],
        count: 0,
      });
    }

    occurrences.forEach((o) => {
      if (!o.createdAt) return;
      const date = new Date(o.createdAt);
      const monthName = months[date.getMonth()];
      const monthData = last6MonthsList.find(m => m.date === monthName);
      if (monthData) {
        monthData.count++;
      }
    });

    stats.timelineData = last6MonthsList;

    // Variação percentual real do total de ocorrências: mês atual vs mês anterior.
    // Calculada a partir de datas precisas (ano + mês), não apenas do nome do mês,
    // para evitar comparar meses de anos diferentes.
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthKey = `${prevDate.getFullYear()}-${prevDate.getMonth()}`;

    let currentMonthCount = 0;
    let prevMonthCount = 0;
    occurrences.forEach((o) => {
      if (!o.createdAt) return;
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (key === currentMonthKey) currentMonthCount++;
      else if (key === prevMonthKey) prevMonthCount++;
    });

    if (prevMonthCount > 0) {
      const change = ((currentMonthCount - prevMonthCount) / prevMonthCount) * 100;
      const rounded = Math.round(change * 10) / 10;
      stats.totalTrend = {
        value: `${rounded >= 0 ? "+" : ""}${rounded}%`,
        positive: rounded >= 0,
      };
    } else if (currentMonthCount > 0) {
      // Sem registos no mês anterior para servir de base de comparação:
      // reportar o crescimento absoluto em vez de uma percentagem fabricada.
      stats.totalTrend = {
        value: `+${currentMonthCount} este mês`,
        positive: true,
      };
    } else {
      stats.totalTrend = null;
    }

    return stats;
  }
};
