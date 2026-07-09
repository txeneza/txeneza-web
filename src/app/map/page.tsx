import { redirect } from "next/navigation";

// O mapa passou a integrar o painel administrativo. Mantém-se este redirecionamento
// para preservar ligações antigas para /map.
export default function MapRedirectPage() {
  redirect("/admin/map");
}
