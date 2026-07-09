# Resumo de Funcionalidades — Painel Administrativo Txeneza

Este documento sistematiza as funcionalidades desenvolvidas no painel administrativo da plataforma **Txeneza**, concebida no âmbito do TCC: *“Txeneza - Proposta de uma plataforma mobile-web com suporte de IA para mapeamento georreferenciado de resíduos sólidos urbanos em contextos de baixa conectividade: estudo de caso cidade da Beira”*.

---

## 1. Segurança e Controle de Acesso
* **Autenticação via Supabase Auth**: Mecanismo de login seguro integrado com a base de dados PostgreSQL.
* **Persistência de Sessão (Cookies)**: Gerenciamento robusto de sessão no cliente via Cookies (`cookiesManager` + `useAuth`) para mitigar oscilações de conexão comuns em contextos de baixa conectividade e evitar loops de carregamento.
* **Guarda de Rotas (Layout Guards)**: Proteção automática de caminhos administrativos (`/admin`, `/admin/*`, `/map`). Utilizadores não autorizados ou sem a flag de administrador (`role === 'admin'`) são redirecionados automaticamente para `/login`.
* **Logout Integrado**: Botão no cabeçalho para encerramento de sessão seguro, limpando os cookies e invalidando o token de acesso.

## 2. Painel de Controle e Métricas Gerais (Dashboard)
* **Indicadores Rápidos (KPIs)**: Cartões interativos com dados consolidados do município (ex: ocorrências pendentes, resolvidas, pontos de recolha operantes).
* **Gráficos de Análise Estatística (AG Charts)**:
  * **Categorização de Resíduos**: Gráfico de barras identificando os tipos de resíduos mais descartados.
  * **Níveis de Gravidade**: Gráfico circular (donut) de severidade dos focos (Baixa, Média, Alta, Crítica).
  * **Evolução Temporal (Histórico)**: Gráfico de área que monitora o registro de incidentes ao longo do tempo.

## 3. Gerenciamento e Cadastro de Pontos de Recolha (CRUD)
* **Cadastro de Contentores**: Interface limpa para adicionar novos contentores oficiais à base de dados em tempo real.
* **Facilidade de Coordenadas**: Atalhos para inserção rápida de latitude, longitude e seleção estruturada de bairros da Cidade da Beira.
* **Tabela de Inventário**: Visualização em lista dos pontos cadastrados, exibindo o status de operação (Operante ou Inativo), bairro e horários recomendados de despejo.

## 4. Mapeamento Georreferenciado e Operações
* **Visualização Espacial (`/map`)**: Plotagem simultânea dos focos de lixo (pinos vermelhos) e pontos de recolha oficiais (exibidos com o logotipo oficial do Txeneza).
* **Painel Informativo de Pontos**: Janelas flutuantes (popups) interativas do Mapbox contendo coordenadas detalhadas, horário de coleta, bairro e status.
* **Inspeção de Ocorrência**: Exibição de cards de detalhes do foco selecionado diretamente na barra lateral, reduzindo a sobreposição de janelas e economizando banda (adequado para baixa conectividade).

## 5. Análise de Densidade Espacial (Mapa de Calor de IA)
* **Mapa de Calor (`/admin/heatmap`)**: Exibição em gradiente térmico de densidade dos resíduos na Beira com base nas coordenadas de denúncias processadas pela Inteligência Artificial.
* **Interface Dinâmica (IA & Caso Beira)**: Gráficos de suporte sinalizando o número de pontos de análise ativos e identificação automatizada do bairro com maior acúmulo (Zona Crítica).

## 6. Infraestrutura de Interface e Consistência Visual
* **Alternador de Temas (Dark & Light Mode)**: Suporte completo ao modo claro e escuro. O mapa do Mapbox altera seu estilo dinamicamente (`light-v11` / `dark-v11`) conforme a escolha do utilizador para melhorar a usabilidade sob iluminação solar forte na Beira.
* **Fidelidade da Identidade Visual**: Limpeza de todas as cores rígidas e substituição por variáveis do tema oficial do Txeneza (*forestGreen*, *limeGreen*, *sageGreen*, *grey50...grey950*), garantindo consistência visual.
* **Ferramenta de Auditoria (`colores.js` / `trocar_colores.js`)**: Scripts utilitários criados na raiz do projeto para varrer a base de código e garantir a conformidade semântica de cores.
