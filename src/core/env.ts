export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
    // Apenas para uso no servidor (rotas /api). Nunca expor ao cliente.
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  },
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "",
  // Estilos do modo duplo do mapa (Normal / Satélite).
  // Nota: por serem lidos em componentes "use client", a env var TEM de ter
  // o prefixo NEXT_PUBLIC_ para o Next.js a expor no browser. Se a variável
  // não estiver definida, usa-se o estilo por defeito indicado abaixo.
  mapboxStyles: {
    normal:
      process.env.NEXT_PUBLIC_MAPBOX_STYLE_NORMAL ||
      "mapbox://styles/tivanepaulo2/cmrovy6jx005q01qt1jb91owi",
    satellite:
      process.env.NEXT_PUBLIC_MAPBOX_STYLE_SATELLITE ||
      "mapbox://styles/mapbox/satellite-streets-v12",
  },
} as const;
