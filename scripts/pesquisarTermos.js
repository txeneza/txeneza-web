#!/usr/bin/env node
/**
 * pesquisarTermos.js
 * ---------------------------------------------------------------------------
 * Pesquisa (e, opcionalmente, remove) termos indesejados no código-fonte do
 * site — por padrão "premium" e "enterprise", que não fazem sentido numa
 * plataforma pública/académica do Município da Beira.
 *
 * MODO DE USO
 * ---------------------------------------------------------------------------
 *   node scripts/pesquisarTermos.js                     -> apenas pesquisa e lista ocorrências
 *   node scripts/pesquisarTermos.js --fix                -> remove as ocorrências encontradas
 *   node scripts/pesquisarTermos.js premium enterprise vip   -> pesquisa termos à escolha
 *   node scripts/pesquisarTermos.js --fix premium         -> remove só "premium"
 *   node scripts/pesquisarTermos.js --dir=src/components  -> restringe a pasta
 *
 * Também pode ser corrido via npm, se adicionado ao package.json:
 *   npm run termos            (apenas pesquisar)
 *   npm run termos:remover    (pesquisar e remover)
 *
 * O QUE FAZ
 * ---------------------------------------------------------------------------
 * 1. Percorre recursivamente a pasta indicada (por omissão "src"), ignorando
 *    node_modules, .git, .next, dist, build, out e coverage.
 * 2. Em ficheiros de código/conteúdo (.ts, .tsx, .js, .jsx, .md, .mdx, .json),
 *    procura os termos indicados como palavra inteira, sem distinguir
 *    maiúsculas/minúsculas (ex: "Premium", "PREMIUM", "premium" contam todos).
 * 3. Sem --fix: apenas lista cada ocorrência (ficheiro, linha, excerto).
 * 4. Com --fix: remove a palavra encontrada da linha (mantendo o resto do
 *    texto), grava o ficheiro e mostra um resumo do que foi alterado.
 *
 * IMPORTANTE: --fix altera ficheiros directamente. Corra sempre primeiro sem
 * --fix para rever as ocorrências, e confirme as alterações com "git diff"
 * antes de fazer commit.
 * ---------------------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");

const DEFAULT_TERMS = ["premium", "enterprise"];
const DEFAULT_DIR = "src";

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "out",
  "coverage",
  ".vercel",
]);

const SCANNED_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".md",
  ".mdx",
  ".json",
]);

/* --------------------------------------------------------------------- */
/* Leitura dos argumentos da linha de comandos                            */
/* --------------------------------------------------------------------- */

function parseArgs(argv) {
  const args = { fix: false, dir: DEFAULT_DIR, terms: [] };

  for (const raw of argv) {
    if (raw === "--fix") {
      args.fix = true;
    } else if (raw.startsWith("--dir=")) {
      args.dir = raw.slice("--dir=".length);
    } else if (raw.startsWith("--")) {
      // Ignora outras flags desconhecidas em vez de rebentar.
      console.warn(`Aviso: flag desconhecida ignorada: ${raw}`);
    } else {
      args.terms.push(raw);
    }
  }

  if (args.terms.length === 0) {
    args.terms = DEFAULT_TERMS;
  }

  return args;
}

/* --------------------------------------------------------------------- */
/* Percorrer a árvore de ficheiros                                       */
/* --------------------------------------------------------------------- */

function listFiles(startDir) {
  const results = [];

  function walk(currentDir) {
    let entries;
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (err) {
      console.warn(`Aviso: não foi possível ler "${currentDir}" (${err.message})`);
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (IGNORED_DIRS.has(entry.name)) continue;
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (SCANNED_EXTENSIONS.has(ext)) {
          results.push(fullPath);
        }
      }
    }
  }

  walk(startDir);
  return results;
}

/* --------------------------------------------------------------------- */
/* Pesquisa / remoção nos ficheiros                                       */
/* --------------------------------------------------------------------- */

function buildTermsRegex(terms) {
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  // \b...\b garante que só apanha a palavra inteira (não "premiumzinho" nem
  // partes de outra palavra), mas ainda apanha "bg-premium" ou "premium-card"
  // porque o hífen conta como fronteira de palavra.
  return new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
}

function scanFile(filePath, regex) {
  const original = fs.readFileSync(filePath, "utf8");
  const lines = original.split("\n");
  const occurrences = [];

  lines.forEach((lineText, index) => {
    const matches = lineText.match(regex);
    if (matches) {
      occurrences.push({
        line: index + 1,
        text: lineText.trim(),
        count: matches.length,
      });
    }
  });

  return { original, lines, occurrences };
}

function removeTermsFromLine(lineText, regex) {
  // Preserva a indentação original da linha (espaços/tabs no início) e só
  // limpa os espaços a mais que sobram exactamente onde a palavra foi
  // removida — nunca mexe na indentação em si.
  const leadingMatch = lineText.match(/^[ \t]*/);
  const leading = leadingMatch ? leadingMatch[0] : "";
  const rest = lineText.slice(leading.length);

  const restLimpo = rest
    .replace(regex, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ +([,.;:!?])/g, "$1")
    .replace(/[ \t]+$/, "");

  return leading + restLimpo;
}

/* --------------------------------------------------------------------- */
/* Execução principal                                                     */
/* --------------------------------------------------------------------- */

function main() {
  const args = parseArgs(process.argv.slice(2));
  const targetDir = path.resolve(process.cwd(), args.dir);

  if (!fs.existsSync(targetDir)) {
    console.error(`Erro: a pasta "${args.dir}" não existe (resolvida para "${targetDir}").`);
    process.exit(1);
  }

  console.log(`Pesquisando termos: ${args.terms.join(", ")}`);
  console.log(`Pasta alvo: ${targetDir}`);
  console.log(`Modo: ${args.fix ? "REMOVER (--fix)" : "apenas pesquisar"}`);
  console.log("-".repeat(70));

  const regex = buildTermsRegex(args.terms);
  const files = listFiles(targetDir);

  let totalOcorrencias = 0;
  let ficheirosComOcorrencias = 0;
  let ficheirosAlterados = 0;

  for (const filePath of files) {
    // A regex tem a flag "g", que mantém estado (lastIndex) entre usos;
    // reiniciamos antes de cada ficheiro para evitar falsos negativos.
    regex.lastIndex = 0;
    const { lines, occurrences } = scanFile(filePath, regex);

    if (occurrences.length === 0) continue;

    ficheirosComOcorrencias += 1;
    const relPath = path.relative(process.cwd(), filePath);
    console.log(`\n${relPath}`);

    for (const occ of occurrences) {
      totalOcorrencias += occ.count;
      console.log(`  linha ${occ.line}: ${occ.text}`);
    }

    if (args.fix) {
      const novasLinhas = lines.map((lineText) => {
        regex.lastIndex = 0;
        return regex.test(lineText) ? removeTermsFromLine(lineText, regex) : lineText;
      });
      const novoConteudo = novasLinhas.join("\n");
      fs.writeFileSync(filePath, novoConteudo, "utf8");
      ficheirosAlterados += 1;
      console.log(`  -> corrigido (${occurrences.length} linha(s) alterada(s))`);
    }
  }

  console.log("\n" + "-".repeat(70));
  console.log(`Ficheiros verificados: ${files.length}`);
  console.log(`Ficheiros com ocorrências: ${ficheirosComOcorrencias}`);
  console.log(`Total de ocorrências encontradas: ${totalOcorrencias}`);

  if (args.fix) {
    console.log(`Ficheiros alterados: ${ficheirosAlterados}`);
    console.log(`\nReveja as alterações com "git diff" antes de fazer commit.`);
  } else if (totalOcorrencias > 0) {
    console.log(`\nPara remover estas ocorrências, corra novamente com --fix.`);
  } else {
    console.log(`\nNenhuma ocorrência encontrada. Nada a fazer.`);
  }
}

main();
