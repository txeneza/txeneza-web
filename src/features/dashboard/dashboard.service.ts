import { Occurrence } from "../occurrences/occurrences.types";
import { occurrencesService } from "../occurrences/occurrences.service";

export interface DashboardStats {
  total: number;
  pendentes: number;
  emProgresso: number;
  resolvidos: number;
  rejeitados: number;
  categoryDistribution: { category: string; count: number }[];
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
    };

    const categoriesMap = new Map<string, number>();
    occurrences.forEach(o => {
      categoriesMap.set(o.category, (categoriesMap.get(o.category) || 0) + 1);
    });

    stats.categoryDistribution = Array.from(categoriesMap.entries()).map(([category, count]) => ({
      category,
      count,
    }));

    return stats;
  }
};
