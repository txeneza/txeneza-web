import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { enviarPush } from "../src/features/notifications/push.service";

async function testarNotificacao() {
  console.log("=== INICIANDO TESTE DE NOTIFICAÇÃO ===\n");

  // 1. Buscar uma ocorrência existente na base de dados
  const ocorrencia = await prisma.ocorrencia.findFirst({
    include: { utilizador: true, categoria: true },
  });

  if (!ocorrencia) {
    console.error("Nenhuma ocorrência encontrada na base de dados para testar.");
    return;
  }

  console.log(`📌 Ocorrência selecionada: ID ${ocorrencia.id_ocorrencia}`);
  console.log(`👤 Utilizador associado: ${ocorrencia.utilizador.nome} (${ocorrencia.utilizador.email})`);
  console.log(`📱 FCM Token do utilizador: ${ocorrencia.utilizador.fcm_token || "Nenhum registado (teste in-app)"}\n`);

  // 2. Criar notificação na base de dados (Notificação In-App)
  const mensagem = `Teste de notificação: O estado da ocorrência «${ocorrencia.categoria.nome}» foi atualizado!`;
  
  const novaNotificacao = await prisma.notificacao.create({
    data: {
      id_utilizador: ocorrencia.id_utilizador,
      id_ocorrencia: ocorrencia.id_ocorrencia,
      tipo: "alteracao_estado",
      mensagem: mensagem,
      lida: false,
      data_hora: new Date(),
    },
  });

  console.log("✅ NOTIFICAÇÃO IN-APP GRAVADA NA BD!");
  console.log(`   ID da Notificação: ${novaNotificacao.id_notificacao}`);
  console.log(`   Mensagem: "${novaNotificacao.mensagem}"\n`);

  // 3. Tentar enviar Notificação Push via Firebase (FCM)
  console.log("🚀 Disparando notificação Push (FCM)...");
  await enviarPush({
    fcmToken: ocorrencia.utilizador.fcm_token || "mock-token-teste-fcm",
    tipo: "alteracao_estado",
    mensagem: mensagem,
    idOcorrencia: ocorrencia.id_ocorrencia,
  });

  console.log("\n=== TESTE CONCLUÍDO COM SUCESSO ===");
}

testarNotificacao()
  .catch((err) => console.error("Erro no teste de notificação:", err))
  .finally(async () => {
    await prisma.$disconnect();
  });
