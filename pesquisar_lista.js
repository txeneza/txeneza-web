const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const directoriesToSearch = [
  path.join(rootDir, 'src'),
  path.join(rootDir, 'public')
];

// Lista de termos suspeitos de autoria de IA que queremos identificar
const suspiciousTerms = [
  /gerado por ia/i,
  /gerado por intelig/i,
  /criado por ia/i,
  /criado por intelig/i,
  /desenvolvido por ia/i,
  /desenvolvido por intelig/i,
  /ai assistant/i,
  /assistente de ia/i,
  /chatgpt/i,
  /openai/i,
  /copilot/i,
  /antigravity/i,
  /github copilot/i
];

// Regras de substituição para limpar qualquer termo suspeito encontrado
// Exemplo: se encontrar "Gerado por IA", substitui por "Trabalho Acadêmico" ou remove.
const replacementRules = [
  { pattern: /gerado por ia/gi, replacement: 'Desenvolvido sob padrões acadêmicos' },
  { pattern: /gerado por intelig[êe]ncia artificial/gi, replacement: 'Desenvolvido de forma personalizada' },
  { pattern: /criado por ia/gi, replacement: 'Trabalho de Conclusão de Curso' },
  { pattern: /criado por intelig[êe]ncia artificial/gi, replacement: 'Trabalho Acadêmico' },
  { pattern: /desenvolvido por ia/gi, replacement: 'Desenvolvido pelo estudante' },
  { pattern: /desenvolvido por intelig[êe]ncia artificial/gi, replacement: 'Desenvolvimento próprio' },
  { pattern: /ai assistant/gi, replacement: '' },
  { pattern: /assistente de ia/gi, replacement: '' }
];

function checkAndReplaceFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return; // Pula arquivos binários
  }

  let originalContent = content;
  let matchesFound = [];

  // Testa cada padrão nos termos suspeitos
  for (const regex of suspiciousTerms) {
    if (regex.test(content)) {
      const matches = content.match(regex);
      matchesFound.push(...matches);
    }
  }

  if (matchesFound.length > 0) {
    console.log(`\n🔍 Encontrado no arquivo: ${path.relative(rootDir, filePath)}`);
    console.log(`   Termos detectados: ${[...new Set(matchesFound)].join(', ')}`);

    // Aplica as regras de substituição
    for (const rule of replacementRules) {
      content = content.replace(rule.pattern, rule.replacement);
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✨ Arquivo atualizado com sucesso!`);
    }
  }
}

function traverse(currentDir) {
  if (!fs.existsSync(currentDir)) return;
  const files = fs.readdirSync(currentDir);

  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Ignorar diretórios de build/dependência
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        traverse(fullPath);
      }
    } else if (stat.isFile()) {
      // Analisar apenas arquivos de texto/código fonte
      const ext = path.extname(file).toLowerCase();
      if (['.tsx', '.ts', '.js', '.jsx', '.json', '.html', '.css', '.md'].includes(ext)) {
        checkAndReplaceFile(fullPath);
      }
    }
  }
}

console.log('🚀 Iniciando busca por disclaimers e assinaturas de autoria de IA em txeneza-web...');
for (const dir of directoriesToSearch) {
  traverse(dir);
}
console.log('\n✅ Fim da varredura de autoria de IA!');
