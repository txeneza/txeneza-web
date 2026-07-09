// colores.js
// Script para buscar qualquer cor e classe de cor hardcoded no projeto

const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_SCAN = ['src'];
const EXTENSIONS_TO_SCAN = ['.ts', '.tsx', '.css'];

// Padrões de classes do Tailwind "hardcoded" a serem substituídas pelas semânticas
const HARDCODED_CLASSES = [
  'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-gray-250', 'bg-gray-200', 'bg-gray-300', 'bg-gray-900', 'bg-gray-950', 'bg-slate-900',
  'text-gray-900', 'text-gray-800', 'text-gray-750', 'text-gray-700', 'text-gray-600', 'text-gray-550', 'text-gray-500', 'text-gray-450', 'text-gray-400', 'text-gray-300', 'text-blue-600', 'text-blue-400',
  'border-gray-200', 'border-gray-300', 'border-gray-700', 'border-gray-800', 'border-gray-850'
];

// Expressão regular para códigos Hex
const HEX_COLOR_REGEX = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\b/g;
// Expressão regular para RGB/RGBA
const RGB_COLOR_REGEX = /rgba?\([^)]+\)/g;

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  let matchesFound = false;

  const logHeader = () => {
    if (!matchesFound) {
      console.log(`\n\x1b[33mArquivo: ${relativePath}\x1b[0m`);
      matchesFound = true;
    }
  };

  // 1. Procurar Hex no código
  let match;
  while ((match = HEX_COLOR_REGEX.exec(content)) !== null) {
    const foundColor = match[0].toUpperCase();
    // Permitir cores do tema Txeneza e brancos/pretos absolutos
    const allowed = ['#01403A', '#ADD9B8', '#CEF2C4', '#B5F230', '#CBF277', '#FFFFFF', '#000000', '#FAFAFA', '#F5F5F5', '#EEEEEE', '#E0E0E0', '#757575', '#424242', '#212121', '#D32F2F', '#388E3C', '#FBC02D', '#1976D2', '#1E2F2C'];
    if (!allowed.includes(foundColor)) {
      logHeader();
      console.log(`  - Hex hardcoded: \x1b[31m${foundColor}\x1b[0m`);
    }
  }

  // 2. Procurar RGB/RGBA
  let rgbMatch;
  while ((rgbMatch = RGB_COLOR_REGEX.exec(content)) !== null) {
    // Filtrar apenas se não for parte do CSS de animações ou bibliotecas do node
    logHeader();
    console.log(`  - RGB(A) hardcoded: \x1b[36m${rgbMatch[0]}\x1b[0m`);
  }

  // 3. Procurar Classes de Cores do Tailwind hardcoded
  HARDCODED_CLASSES.forEach(className => {
    const regex = new RegExp(`\\b${className}\\b`, 'g');
    let classMatch;
    while ((classMatch = regex.exec(content)) !== null) {
      logHeader();
      console.log(`  - Classe Tailwind hardcoded: \x1b[35m${className}\x1b[0m`);
    }
  });
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
        scanFile(fullPath);
      }
    }
  }
}

console.log('\x1b[32m=== Pesquisando qualquer cor e classe de cor hardcoded ===\x1b[0m');
DIRECTORIES_TO_SCAN.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    traverseDirectory(fullPath);
  }
});
console.log('\n\x1b[32m=== Pesquisa concluída ===\x1b[0m');
