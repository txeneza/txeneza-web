export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
  },
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "",
} as const;
