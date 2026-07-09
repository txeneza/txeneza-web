import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O pdfkit lê ficheiros de métricas de fonte (.afm) a partir do seu próprio
  // diretório em runtime. Se for empacotado pelo bundler, o caminho quebra
  // (ENOENT em .../pdfkit/js/data/Helvetica.afm). Mantê-lo externo faz o Node
  // carregá-lo diretamente de node_modules, onde os .afm existem.
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
