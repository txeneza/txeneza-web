const fs = require('fs');
const path = require('path');

// RegExp to match emojis in ES6 (Node 10+)
const EMOJI_REGEX = /\p{Emoji_Presentation}/gu;

// Directory to scan
const TARGET_DIR = path.join(__dirname, 'src');

// Common emojis used in the project and their suggested realistic Lucide React replacements
const REPLACEMENTS = {
  '📍': { icon: 'MapPin', component: 'import { MapPin } from "lucide-react";', label: 'Ponto no Mapa' },
  '🏛️': { icon: 'Landmark', component: 'import { Landmark } from "lucide-react";', label: 'Edifício Público / CMB' },
  '🗑️': { icon: 'Trash2', component: 'import { Trash2 } from "lucide-react";', label: 'Lixo / Contentor' },
  '👥': { icon: 'Users', component: 'import { Users } from "lucide-react";', label: 'Comunidade' },
  '🔥': { icon: 'Flame', component: 'import { Flame } from "lucide-react";', label: 'Mapa de Calor' },
  '⚙️': { icon: 'Settings', component: 'import { Settings } from "lucide-react";', label: 'Definições' },
  '👤': { icon: 'User', component: 'import { User } from "lucide-react";', label: 'Utilizador' },
  '🚨': { icon: 'ShieldAlert', component: 'import { ShieldAlert } from "lucide-react";', label: 'Alerta / Ocorrência' },
  '📷': { icon: 'Camera', component: 'import { Camera } from "lucide-react";', label: 'Câmara / Foto' },
};

function getFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.css')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function scanFiles() {
  console.log(`\n🔍 A pesquisar emojis em: ${TARGET_DIR} ...\n`);
  
  const files = getFilesRecursively(TARGET_DIR);
  let totalMatches = 0;
  
  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let fileReported = false;
    
    lines.forEach((lineContent, index) => {
      const matches = lineContent.match(EMOJI_REGEX);
      if (matches) {
        if (!fileReported) {
          console.log(`📁 Arquivo: ${path.relative(__dirname, file)}`);
          fileReported = true;
        }
        
        matches.forEach((emoji) => {
          totalMatches++;
          const replacement = REPLACEMENTS[emoji];
          const lineNum = index + 1;
          
          console.log(`   └─ Linha ${lineNum}: Encontrado [ ${emoji} ]`);
          console.log(`      Conteúdo: "${lineContent.trim()}"`);
          if (replacement) {
            console.log(`      💡 Sugestão: Substituir por <${replacement.icon} className="w-4 h-4" />`);
            console.log(`         Importação: ${replacement.component}`);
          } else {
            console.log(`      💡 Sugestão: Substituir por um ícone da biblioteca 'lucide-react'.`);
          }
          console.log();
        });
      }
    });
  });
  
  console.log(`----------------------------------------------------------------`);
  console.log(`✅ Pesquisa concluída. Total de emojis encontrados: ${totalMatches}`);
  console.log(`Para realizar substituições, use a biblioteca 'lucide-react' já instalada no projecto.`);
}

scanFiles();
