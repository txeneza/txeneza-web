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

    return stats;
  }
};
