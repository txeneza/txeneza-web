/**
 * Converte um array de objetos para uma string de formato CSV.
 */
export function generateCSV(data: any[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Cabeçalho
  csvRows.push(headers.join(","));

  // Linhas de dados
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ("" + (row[header] ?? "")).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}
