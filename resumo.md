# Resumo de Funcionalidades — Plataforma Txeneza

Este documento apresenta o mapeamento completo e detalhado de todas as funcionalidades desenvolvidas na plataforma **Txeneza** (Painel Administrativo e Portal Público). A plataforma foi concebida no contexto do Trabalho de Conclusão de Curso (TCC): *“Txeneza - Proposta de uma plataforma mobile-web com suporte de IA para mapeamento georreferenciado de resíduos sólidos urbanos em contextos de baixa conectividade: estudo de caso cidade da Beira”*.

---

## 1. Tecnologias e Infraestrutura Utilizadas
A plataforma está construída com uma infraestrutura robusta focada em desempenho e usabilidade:
* **Framework Principal**: Next.js (com roteamento baseado em App Router) e React.
* **Base de Dados e ORM**: Prisma ORM sobre PostgreSQL com extensões espaciais.
* **Segurança e Cloud**: Supabase (Auth para autenticação e Storage para imagens).
* **Renderização de Mapas**: Mapbox GL via React Map GL.
* **Gráficos e Estatísticas**: AG Charts React (Community/Enterprise).
* **Geração de Ficheiros**: PDFKit (para relatórios em PDF) e ExcelJS (para folhas de cálculo Excel).
* **Gerenciamento de Estado**: Zustand (para controle global de mapas e relatórios).
* **Estilização**: TailwindCSS com temas CSS semânticos e suporte nativo a Modo Escuro/Claro.
---
## 2. Portal Público (Landing Page)
Uma página de apresentação rica e interativa voltada aos munícipes e parceiros institucionais:
* **Navegação Inteligente**: Menu responsivo com alternador de modo escuro/claro e atalhos rápidos de navegação.
* **Apresentação Institucional**: Seções explicando o propósito do projeto, a problemática do acúmulo de lixo na Cidade da Beira e o alinhamento com os Objetivos de Desenvolvimento Sustentável (ODS) da ONU.
* **Exposição do Fluxo de Trabalho**: Guia visual mostrando as quatro etapas do ciclo de vida das denúncias (Capturar Foto -> Categorizar com IA -> Resolução Municipal -> Verificação Cidadã).
* **Demonstração Móvel Interativa**: Mockup interativo da aplicação móvel simulando o chatbot "Xeni" (assistente virtual de IA com suporte a Gemini e TensorFlow Lite) e a visualização de ocorrências no ecrã do telemóvel.
* **Visualização Pública do Mapa**: Pré-visualização funcional baseada em Mapbox que plota as ocorrências registradas e pontos de recolha oficiais.
* **Seção de Públicos-Alvo**: Segmentação explicativa para Moradores, Fiscais Ambientais e Administração Pública.

---

## 3. Segurança e Controle de Acesso
Garante que as operações administrativas sejam realizadas apenas por pessoal qualificado da Vereação de Higiene e Salubridade da Cidade da Beira:
* **Autenticação com Supabase**: Tela de login com design premium institucional do Conselho Municipal da Beira (CMB).
* **Resiliência de Rede (Cookies)**: Sessão gerida por cookies no cliente e servidor (`cookiesManager`), evitando loops de carregamento infinitos ou desconexão abrupta sob redes de internet móvel instáveis.
* **Guarda de Rotas (Layout Guards)**: Proteção automática de todos os caminhos administrativos (`/admin`, `/admin/*`, `/map`). Qualquer tentativa de acesso por utilizadores não autenticados ou sem a flag de administrador (`role === 'admin'`) resulta no redirecionamento imediato para a tela de `/login`.
* **Logout Seguro**: Botão de encerramento de sessão que invalida os tokens do Supabase e limpa os cookies locais do navegador.

---

## 4. Painel de Controle e Métricas Gerais (Dashboard)
Interface administrativa que consolida os dados operacionais da Beira em indicadores fáceis de interpretar:
* **Cartões de Indicadores (KPIs)**: Indicadores numéricos interativos que exibem o total de ocorrências registradas, casos pendentes, em progresso e resolvidas (com cálculo de tendências percentuais).
* **Análise Visual Avançada (AG Charts)**:
  * **Categorização de Resíduos**: Gráfico de barras horizontais indicando a distribuição das denúncias por tipo de resíduo.
  * **Nível de Gravidade**: Gráfico em formato Donut exibindo a severidade das ocorrências (Baixa, Média, Alta, Crítica).
  * **Histórico Temporal**: Gráfico de área demonstrando a curva de denúncias recebidas ao longo do tempo.
* **Exportação Rápida**: Atalho para descarregar os dados agregados dos gráficos em formato CSV.

---

## 5. Gestão e Moderação de Ocorrências (Denúncias)
Permite que os administradores acompanhem e alterem o status dos problemas urbanos informados pela população:
* **Painel de Ocorrências**: Lista completa de ocorrências com paginação e suporte a pesquisa textual (busca por título da denúncia, categoria de resíduo ou nome do bairro).
* **Filtros por Estado**: Segmentação rápida por status da ocorrência (Pendente, Em Progresso, Resolvida) exibindo a contagem individual de cada categoria.
* **Ficha de Detalhe da Ocorrência**:
  * Visualização da imagem real submetida pelo munícipe no momento da denúncia (com tratamento para fotos corrompidas ou inexistentes).
  * Informações de georreferenciamento (coordenadas de latitude/longitude exatas com link rápido para visualização direta no mapa administrativo).
  * Metadados da ocorrência (categoria de resíduo atribuída, bairro da Beira, data e hora da submissão e nome/ID do munícipe relator).
  * **Painel de Moderação de Status**: Botões rápidos para avançar a denúncia entre os estados (Pendente, Em Progresso, Resolvido ou Rejeitado).
  * **Modal de Confirmação**: Caixa de diálogo protetiva que explica o impacto da mudança de status (mencionando o envio automático de notificações ao morador).

---

## 6. Mapeamento Georreferenciado e Operações Urbanas (`/admin/map`)
Um ambiente espacial avançado para planeamento logístico de rotas de recolha:
* **Plotagem Dupla no Mapbox**: Exibição simultânea de dois tipos de marcadores:
  * **Focos de Lixo**: Marcadores circulares com pinos vermelhos representativos de denúncias ativas de resíduos.
  * **Pontos de Recolha**: Marcadores circulares com o logótipo oficial do Txeneza, representando contentores oficiais do município.
* **Painel Lateral Inteligente (Economia de Dados)**: Ao clicar num foco de resíduos no mapa, os seus detalhes e fotografia são carregados num painel na barra lateral direita. Este comportamento otimiza a transferência de dados em redes móveis (evitando renderização de pesados balões informativos sobre o mapa).
* **Popups Interativos**: Ao clicar num contentor oficial, abre-se uma pequena janela informativa sobre o mapa exibindo o nome do local, bairro, horário recomendado de despejo de lixo e indicador visual de estado operacional.
* **Estilização de Mapas Dinâmica**: Alteração de estilo do Mapbox (Light/Dark) integrada ao tema global do painel.
* **Alerta de Conectividade Instável**: Monitor automático que detecta falhas ou lentidão no carregamento das texturas do Mapbox. Exibe uma faixa amigável avisando ao usuário que o mapa está sob conexão instável, mas garantindo que as camadas de pontos e coordenadas de cache continuam ativas para trabalho local.

---

## 7. Análise de Densidade Espacial (Mapa de Calor de IA)
Módulo analítico que auxilia na tomada de decisões estratégicas sobre onde instalar novos contentores:
* **Camada de Calor Dinâmica (Heatmap GL)**: Camada térmica que agrupa as coordenadas de denúncias para exibir manchas de calor indicando acúmulo de lixo.
* **Rampa Térmica Adaptada**: Gradiente de cores baseado na identidade visual do Txeneza (Verde-floresta -> Verde-lima -> Amarelo -> Laranja -> Vermelho para zonas de urgência crítica).
* **Filtro por Zoom**: Conforme o administrador aproxima o mapa, o mapa de calor desvanece suavemente para revelar marcadores de pontos de intensidade individuais.
* **Métricas de Análise Espacial**: Painel contendo o total de pontos sob monitorização, quantidade de bairros cobertos e cálculo automático identificando a Zona Mais Crítica da Cidade da Beira (bairro com maior densidade de lixo).
* **Painéis Informativos**: Guias conceituais sobre o mapa para orientar as equipes de limpeza urbana na priorização e alocação de contentores.

---

## 8. Gerenciamento e Cadastro de Pontos de Recolha (Contentores CRUD)
Gestão direta dos locais oficiais disponibilizados pelo Conselho Municipal para o despejo de resíduos:
* **Painel Centralizado**: Visualização rápida da saúde dos equipamentos urbanos através de cartões (Total de pontos, contentores Ativos, contentores Inativos e número de bairros atendidos).
* **Formulário de Cadastro e Edição**:
  * Campo para Nome do Local e Horário de recolha.
  * Seleção estruturada de Bairro através de um menu de pesquisa (*Combobox*) contendo todos os bairros da Cidade da Beira.
  * **Preenchimento Inteligente de Coordenadas**: Ao selecionar um bairro na lista, a aplicação localiza o seu centro geográfico cadastrado e pré-preenche automaticamente os campos de latitude e longitude.
  * **Atalho de Coordenadas Padrão**: Botão para preencher as coordenadas padrão geográficas centrais da Beira com um único clique.
  * Seletor segmentado para definir o estado operacional (Ativo / Inativo).
* **Tabela de Inventário**: Lista organizada que suporta buscas instantâneas por nome/bairro e filtragem de visualização baseada no estado operacional. Permite acionar o modo de edição (que faz rolagem suave até o formulário) ou a exclusão do ponto.
* **Modal de Segurança para Exclusão**: Diálogo de confirmação para prevenir exclusões acidentais de contentores da base de dados.

---

## 9. Exportação de Relatórios e Histórico de Arquivos
Central de extração de indicadores municipais para fins de fiscalização e relatórios executivos:
* **Configuração de Filtros Diversos**: Permite filtrar os dados que farão parte do relatório por:
  * Tipo de relatório (Ocorrências registradas, Contentores/Pontos de recolha, Resumo consolidado do dashboard ou Dados do mapa de calor).
  * Período cronológico (data de início e fim).
  * Bairro de abrangência.
  * Estado de moderação e gravidade da ocorrência ou estado operacional do contentor.
* **Múltiplos Formatos Corporativos**:
  * **PDF Premium**: Relatório institucional altamente estilizado, contendo logotipos do CMB, assinaturas automáticas, paginação profissional e tabela estruturada dos dados com cores de gravidade.
  * **Excel (Sheets)**: Planilha excel formatada com colunas redimensionadas, estilos de cabeçalho corporativos verdes e destaque visual para status.
  * **CSV Plano**: Exportação de dados brutos sem formatação para integração rápida com ferramentas GIS (ex: QGIS, ArcGIS) ou BI (PowerBI).
* **Histórico de Relatórios Gerados (Bandwidth Efficiency)**:
  * Lista que armazena os relatórios físicos gerados no servidor (`public/reports/`).
  * Mostra o nome do arquivo gerado, tipo do relatório, formato, data exata de geração e tamanho do arquivo (formatado amigavelmente em Bytes, KB ou MB).
  * Permite que os administradores realizem o download direto do histórico. Isso economiza processamento e uso de dados móveis, já que não é preciso regenerar relatórios repetidos.

---

## 10. Arquitetura de Dados (Modelo de Banco de Dados)
O modelo relacional do banco de dados (Prisma DB Schema) apoia as operações integradas entre IA e mapeamento:
* **Utilizador**: Registo dos munícipes e funcionários (nome, email, telefone, senha encriptada, bairro, tipo/cargo, estado da conta e foto de perfil).
* **Ocorrencia**: Entidade central georreferenciada ligando o relato às chaves de Categoria de Resíduo, Utilizador cadastrado, Ponto de Recolha oficial mais próximo e Classificação de IA correspondente. Armazena coordenadas decimais precisas, gravidade, estado de moderação e indicador de sincronização offline.
* **Fotografia**: Registra os ficheiros de imagem associados às denúncias ou às verificações de resolução feitas pelas equipes.
* **CategoriaResiduo**: Tabela de tipos de lixo com suporte a ícones específicos e nomes únicos.
* **ClassificacaoIA**: Grava as predições de inteligência artificial geradas (grau de confiança percentual, gravidade sugerida, motor de execução utilizado - Gemini ou TensorFlow Lite, latência de processamento em milissegundos e timestamp).
* **VerificacaoResolucao**: Vincula a vistoria de encerramento da ocorrência, registrando o utilizador vistoriador, foto de prova, resultado, taxa de confiança na similaridade de imagem e observações.
* **PontoRecolha**: Tabela dos contentores municipais com suas coordenadas geográficas, bairro correspondente, horário operacional e status.
* **ConversacaoXeni**: Registo de interações de diálogo no chat de inteligência artificial (mensagem do munícipe, resposta da assistente Xeni e modelo de IA utilizado).
* **Notificacao**: Avisos gerados para o munícipe sobre alterações no status de suas denúncias.

---
## dark mode
## 11. Recursos Visuais e Usabilidade
* **Modo Escuro e Claro Integrado**: Interface limpa baseada na paleta de cores da identidade do Txeneza (ForestGreen, LimeGreen, SageGreen).
* **Scripts de Auditoria de Design**: Scripts utilitários (`colores.js` e `trocar_colores.js`) desenvolvidos na raiz do projeto para varrer a base de código do painel, localizando cores estáticas fora do padrão do tema e realizando substituições em lote para variáveis semânticas CSS do tema oficial.
