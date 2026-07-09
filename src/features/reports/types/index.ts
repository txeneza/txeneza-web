// src/features/reports/types/index.ts

export type ReportType = "occurrences" | "collection-points" | "summary" | "heatmap";

export type ReportFormat = "pdf" | "excel" | "csv";

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  bairro?: string;
  status?: string;
  gravity?: string;
}

export interface ExportHistoryItem {
  id: string;
  filename: string;
  type: ReportType;
  format: ReportFormat;
  createdAt: string;
  sizeBytes: number;
  url: string;
  filters?: ReportFilters;
}
