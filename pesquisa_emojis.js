const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const searchDir = path.join(rootDir, 'src', 'components', 'landing');

// Expressão regular moderna para capturar estritamente emojis e pictogramas coloridos/gráficos
// usando a propriedade de escape Unicode Extended_Pictographic.
const emojiRegex = /\p{Extended_Pictographic}/gu;

function checkAndRemoveEmojis(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return;
  }

  // Reseta o index do regex global antes de testar
  emojiRegex.lastIndex = 0;
  if (emojiRegex.test(content)) {
    console.log(`\n🔍 Emojis detectados no arquivo: ${path.relative(rootDir, filePath)}`);
    
    // Mostra as linhas com emojis
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      emojiRegex.lastIndex = 0;
      if (emojiRegex.test(line)) {
        console.log(`   Linha ${index + 1}: ${line.trim()}`);
      }
    });

    // Remove os emojis
    emojiRegex.lastIndex = 0;
    const cleanContent = content.replace(emojiRegex, '');
    fs.writeFileSync(filePath, cleanContent, 'utf8');
    console.log(`   ✨ Emojis removidos com sucesso!`);
  }
}

function traverse(currentDir) {
  if (!fs.existsSync(currentDir)) return;
  const files = fs.readdirSync(currentDir);

  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      traverse(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (['.tsx', '.ts', '.js', '.jsx'].includes(ext)) {
        if (file !== 'pesquisa_emojis.js') {
          checkAndRemoveEmojis(fullPath);
        }
      }
    }
  }
}

console.log('🚀 Iniciando busca e remoção precisa de emojis na Landing Page...');
traverse(searchDir);
console.log('\n✅ Fim da limpeza de emojis!');
