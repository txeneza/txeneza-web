const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const searchDirs = [
  path.join(rootDir, 'src'),
  path.join(rootDir, 'public')
];

const keywords = [/mock/i, /simulado/i, /fallback/i];

function scanFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return; // Pula binários
  }

  const lines = content.split('\n');
  let filePrinted = false;

  lines.forEach((line, index) => {
    for (const regex of keywords) {
      if (regex.test(line)) {
        if (!filePrinted) {
          console.log(`\n📄 Arquivo: ${path.relative(rootDir, filePath)}`);
          filePrinted = true;
        }
        console.log(`   Linhna ${index + 1}: ${line.trim()}`);
        break; // Passa para a próxima linha para evitar duplicar
      }
    }
  });
}

function traverse(currentDir) {
  if (!fs.existsSync(currentDir)) return;
  const files = fs.readdirSync(currentDir);

  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        traverse(fullPath);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (['.tsx', '.ts', '.js', '.jsx', '.json', '.html', '.css', '.md'].includes(ext)) {
        // Ignorar o próprio script para não dar falso positivo
        if (file !== 'pesquisamock.js') {
          scanFile(fullPath);
        }
      }
    }
  }
}

console.log('🔍 Iniciando busca por dados mock, simulados ou fallbacks no projeto...');
for (const dir of searchDirs) {
  traverse(dir);
}
console.log('\n✅ Varredura concluída!');
