import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona de forma permanente/temporária para a rota /map
  redirect("/map");
}
