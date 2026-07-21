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
  // Firebase Admin — apenas para uso no servidor (rotas /api), para enviar
  // pushes via Firebase Cloud Messaging. Nunca expor ao cliente. Obtido em:
  // Firebase Console -> Definições do projeto -> Contas de serviço ->
  // "Gerar nova chave privada" (descarrega um JSON com estes 3 campos).
  firebaseAdmin: {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    // A chave privada vem com quebras de linha "\n" escapadas quando
    // colada como variável de ambiente numa só linha — é preciso
    // "desescapar" antes de passar ao SDK.
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  },
} as const;
