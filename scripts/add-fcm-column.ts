import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    console.log("Adicionando coluna fcm_token à tabela utilizador no Supabase...");
    await prisma.$executeRawUnsafe("ALTER TABLE utilizador ADD COLUMN IF NOT EXISTS fcm_token TEXT;");
    console.log("COLUNA fcm_token ADICIONADA COM SUCESSO!");
  } catch (err) {
    console.error("Erro ao adicionar coluna:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
