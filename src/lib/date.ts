/**
 * Formata uma data para exibição amigável.
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString("pt-MZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Retorna a diferença de tempo em formato humano (ex: "há 2 dias").
 */
export function timeAgo(date: Date | string | number): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `há ${interval} ano${interval > 1 ? "s" : ""}`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `há ${interval} mê${interval > 1 ? "ses" : "s"}`;
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `há ${interval} dia${interval > 1 ? "s" : ""}`;
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `há ${interval} hora${interval > 1 ? "s" : ""}`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `há ${interval} minuto${interval > 1 ? "s" : ""}`;
  
  return "agora mesmo";
}
