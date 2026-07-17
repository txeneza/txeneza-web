const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'components', 'landing');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Tratamento específico para o how-it-works-section.tsx
  if (filePath.endsWith('how-it-works-section.tsx')) {
    // Remove "requirement: ...," ou 'requirement: ...,'
    content = content.replace(/\s*requirement:\s*["'][^"']+["'],?/g, '');
    
    // Remove o bloco do HTML de requisitos (comentário do requisito até a tag de fechamento div)
    const reqTagRegex = /\{\/\*\s*Requirement tag\s*\*\/\}[\s\S]*?<div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-950 flex justify-between items-center">[\s\S]*?<\/div>/g;
    content = content.replace(reqTagRegex, '');
  }

  // 2. Remove ocorrências gerais do padrão (RFXX)
  content = content.replace(/\s*\(RF\d+\)/g, '');
  // Remove padrões isolados do tipo RFXX / RFYY
  content = content.replace(/\bRF\d+\s*(?:\/\s*RF\d+)*\b/g, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Atualizado: ${path.basename(filePath)}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverse(fullPath);
    } else if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js'))) {
      processFile(fullPath);
    }
  }
}

console.log('Pesquisando e removendo requisitos RF01/RF02 etc na pasta landing...');
traverse(targetDir);
console.log('Fim do processamento!');
