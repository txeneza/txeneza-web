// trocar_colores.js
// Script para automatizar a remoção de cores "hardcoded" (Tailwind cinzas/azuis genéricos)
// substituindo-as por referências da paleta de cores oficial (grey50...grey900, forestGreen, limeGreen).

const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_SCAN = ['src'];
const EXTENSIONS_TO_SCAN = ['.ts', '.tsx', '.css'];

// Mapa de substituições das classes genéricas para as classes oficiais do tema
const CLASS_REPLACEMENTS = {
  // Planos de Fundo (Backgrounds)
  'bg-white': 'bg-light-background dark:bg-dark-background',
  'bg-gray-50': 'bg-grey100 dark:bg-grey900/40',
  'bg-gray-100': 'bg-grey200 dark:bg-grey800/60',
  'bg-gray-250': 'bg-grey350 dark:bg-grey800',
  'bg-gray-200': 'bg-grey200 dark:bg-grey800',
  'bg-gray-300': 'bg-grey300 dark:bg-grey700',
  'bg-gray-900': 'bg-grey900',
  'bg-gray-950': 'bg-grey950',
  'bg-slate-900': 'bg-grey900/90',

  // Textos (Foregrounds)
  'text-gray-900': 'text-grey900 dark:text-grey50',
  'text-gray-800': 'text-grey800 dark:text-grey100',
  'text-gray-750': 'text-grey800 dark:text-grey200',
  'text-gray-700': 'text-grey800 dark:text-grey200',
  'text-gray-650': 'text-grey600 dark:text-grey300',
  'text-gray-600': 'text-grey600 dark:text-grey300',
  'text-gray-555': 'text-grey600 dark:text-grey400',
  'text-gray-550': 'text-grey600 dark:text-grey450',
  'text-gray-500': 'text-grey600 dark:text-grey400',
  'text-gray-450': 'text-grey400 dark:text-grey500',
  'text-gray-400': 'text-grey300 dark:text-grey500',
  'text-gray-300': 'text-grey200 dark:text-grey700',
  'text-blue-600': 'text-forestGreen dark:text-limeGreen',
  'text-blue-400': 'text-sageGreen dark:text-lightLime',

  // Bordas (Borders)
  'border-gray-200': 'border-grey200 dark:border-grey800',
  'border-gray-150': 'border-grey200 dark:border-grey800/80',
  'border-gray-300': 'border-grey300 dark:border-grey700',
  'border-gray-700': 'border-grey700 dark:border-grey800',
  'border-gray-800': 'border-grey800',
  'border-gray-850': 'border-grey850'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let replacementsCount = 0;

  // Substituir classes
  Object.entries(CLASS_REPLACEMENTS).forEach(([oldClass, newClass]) => {
    // Regex correspondendo exatamente à classe Tailwind com limites de palavras
    const regex = new RegExp(`\\b${oldClass}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, newClass);
      replacementsCount++;
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    console.log(`\x1b[32m[OK] Atualizado:\x1b[0m ${relativePath} (${replacementsCount} classes adaptadas)`);
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        traverseDirectory(fullPath);
      }
    } else {
      const ext = path.extname(file);
      if (EXTENSIONS_TO_SCAN.includes(ext)) {
        processFile(fullPath);
      }
    }
  }
}

console.log('\x1b[32m=== Substituindo classes de cores hardcoded pelas semânticas do tema ===\x1b[0m');
DIRECTORIES_TO_SCAN.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    traverseDirectory(fullPath);
  }
});
console.log('\x1b[32m=== Processo concluído com sucesso! ===\x1b[0m');
