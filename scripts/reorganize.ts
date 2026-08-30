import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src");

// 1. Definição das pastas a criar
const directoriesToCreate = [
  path.join(root, "components", "landing", "download"),
  path.join(root, "features", "occurrences", "components"),
  path.join(root, "features", "map", "components"),
  path.join(root, "core", "database"),
  path.join(root, "core", "auth"),
  path.join(root, "core", "config"),
];

console.log("📁 Criando diretórios...");
directoriesToCreate.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`+ Diretório criado: ${path.relative(process.cwd(), dir)}`);
  }
});

// 2. Definição das movimentações de ficheiros
const moves = [
  // Download folder
  {
    from: path.join(root, "components", "landing", "download-section.tsx"),
    to: path.join(root, "components", "landing", "download", "download-section.tsx"),
  },
  {
    from: path.join(root, "components", "landing", "download-qr-modal.tsx"),
    to: path.join(root, "components", "landing", "download", "download-qr-modal.tsx"),
  },
  // Occurrences UI
  {
    from: path.join(root, "components", "occurrences", "occurrence-card.tsx"),
    to: path.join(root, "features", "occurrences", "components", "occurrence-card.tsx"),
  },
  {
    from: path.join(root, "components", "occurrences", "occurrence-table.tsx"),
    to: path.join(root, "features", "occurrences", "components", "occurrence-table.tsx"),
  },
  // Map UI
  {
    from: path.join(root, "components", "map", "map-view.tsx"),
    to: path.join(root, "features", "map", "components", "map-view.tsx"),
  },
  {
    from: path.join(root, "components", "map", "heatmap-view.tsx"),
    to: path.join(root, "features", "map", "components", "heatmap-view.tsx"),
  },
  {
    from: path.join(root, "components", "map", "location-picker-map.tsx"),
    to: path.join(root, "features", "map", "components", "location-picker-map.tsx"),
  },
  {
    from: path.join(root, "components", "map", "location-search-input.tsx"),
    to: path.join(root, "features", "map", "components", "location-search-input.tsx"),
  },
  {
    from: path.join(root, "components", "map", "map-style-toggle.tsx"),
    to: path.join(root, "features", "map", "components", "map-style-toggle.tsx"),
  },
];

console.log("\n📦 Movendo ficheiros...");
moves.forEach(({ from, to }) => {
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
    console.log(`✓ Movel: ${path.relative(process.cwd(), from)} ➔ ${path.relative(process.cwd(), to)}`);
  } else {
    console.log(`! Ficheiro de origem não encontrado ou já movido: ${path.relative(process.cwd(), from)}`);
  }
});

// 3. Criar Ficheiros Barrel (index.ts) nas novas pastas
const downloadIndexContent = `export * from "./download-section";\nexport * from "./download-qr-modal";\n`;
fs.writeFileSync(path.join(root, "components", "landing", "download", "index.ts"), downloadIndexContent, "utf-8");
console.log("+ Ficheiro index.ts criado em components/landing/download/");

console.log("\n✅ Reorganização concluída com sucesso!");
