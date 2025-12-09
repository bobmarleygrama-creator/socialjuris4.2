# 📄 DOCUMENTO DE ESCOPO TÉCNICO E FUNCIONAL — SOCIALJURIS

**Versão:** 1.0 (Baseada no Código Atual)
**Arquitetura:** SPA (Single Page Application) Serverless
**Stack:** React 19, Tailwind CSS, Supabase (Auth/DB/Realtime), Google Gemini AI.

---

## 1. VISÃO GERAL DO SISTEMA

*   **Nome do Sistema:** SocialJuris.
*   **Objetivo Principal:** Democratizar o acesso à justiça conectando clientes com demandas reais a advogados verificados, funcionando simultaneamente como um **Marketplace Jurídico** (foco em conexão) e um **SaaS de Gestão** (SocialJuris PRO) para advogados.
*   **Público-Alvo:**
    *   **Clientes:** Pessoas Físicas/Jurídicas buscando solução jurídica acessível e digital.
    *   **Advogados:** Profissionais buscando novos clientes qualificados e ferramentas de produtividade.
    *   **Administradores:** Gestores da plataforma.
*   **Problemas que Resolve:**
    *   *Cliente:* Medo de altos custos iniciais, dificuldade de encontrar especialistas, burocracia no atendimento.
    *   *Advogado:* Dificuldade de prospecção, leads desqualificados (curiosos), falta de ferramentas integradas.
*   **Valor Entregue:**
    *   *Para o Cliente:* Publicação de caso a custo popular (R$ 2 a R$ 6), atendimento 100% digital.
    *   *Para o Advogado:* Acesso a clientes que já pagaram (filtro de seriedade), sistema de gestão completo (CRM, IA, Docs).

---

## 2. REGRAS QUE NÃO PODEM SER ALTERADAS (IMUTÁVEIS)

Estas regras definem o "Core Business" e a lógica atual do sistema. **Não devem ser modificadas.**

1.  **Modelo de Match (Marketplace):** O sistema **não** faz match automático por IA. Funciona como uma vitrine: o cliente publica, o caso aparece no "Feed de Oportunidades", e o advogado escolhe ativamente aceitar o caso.
2.  **Taxa de Publicação (Cliente):** O cliente **deve** pagar uma taxa simbólica (R$ 2,00 a R$ 6,00) definida pela complexidade do caso para publicar. Isso serve como filtro de qualificação.
3.  **Economia de "Juris" (Advogado):** O advogado gasta a moeda interna "Juris" para aceitar um caso (Custo padrão atual: 5 Juris). Se não tiver saldo, deve comprar pacotes.
4.  **Verificação de Advogados:** Advogados se cadastram mas ficam com status `verified: false` até aprovação manual de um Administrador.
5.  **Simulação de Pagamentos:** Atualmente, os fluxos de pagamento (Cliente pagando taxa e Advogado comprando Juris) são simulados (mock) no frontend, apenas atualizando o saldo no banco.
6.  **Estrutura do Chat:** O chat é direto entre as partes, suporta envio de arquivos simulado e "videochamada" (interface simulada).

---

## 3. FUNCIONALIDADES ATUAIS DO SISTEMA

### 3.1. Landing Page (`components/Landing.tsx`)
*   **Hero Section:** Segmentação clara ("Sou Cliente" / "Sou Advogado") com chamadas para ação distintas.
*   **Stats Bar:** Destaque para "Valores Populares" e "100% Online".
*   **Diferenciais:** Comparativo visual "Advocacia Tradicional" vs "SocialJuris".
*   **Passo a Passo:** Explicação da jornada de publicação (taxa simbólica) e atendimento.
*   **Rodapé:** Link discreto para Login Administrativo.

### 3.2. Módulo de Autenticação (`App.tsx`, `store.tsx`)
*   **Login/Registro:** Unificado com alternância de abas.
*   **Suporte a Roles:** CLIENT, LAWYER, ADMIN.
*   **Campos Específicos:** Solicita OAB apenas para advogados.
*   **Tratamento de Erros:** Detecção de e-mail não confirmado e auto-criação de admin para testes.

### 3.3. Painel do Cliente (`ClientDashboard` em `Dashboards.tsx`)
*   **Novo Caso com IA:**
    *   Input de relato livre.
    *   **IA (Gemini):** Analisa o texto e retorna: Área, Título Sugerido, Resumo e Complexidade (Baixa/Média/Alta).
    *   **Precificação:** Calcula o valor (R$ 2-6) baseado na complexidade.
    *   **Checkout:** Simulação de pagamento antes da publicação.
*   **Meus Casos:** Lista com status (Aguardando, Em Andamento).
*   **Chat:** Interface de conversa quando o caso está `ACTIVE`.

### 3.4. Painel do Advogado (`LawyerDashboard` em `Dashboards.tsx`)
*   **Feed de Oportunidades:**
    *   Lista global de casos `OPEN`.
    *   Filtro por palavra-chave/área.
    *   Exibe "Investimento: 5 Juris".
    *   Botão "Aceitar Caso" (Desconta saldo e move caso para `ACTIVE`).
*   **Gestão de Saldo:**
    *   Visualização de Juris no topo.
    *   Botão para comprar pacotes (Simulado).
*   **Ferramentas PRO (SocialJuris PRO):**
    *   **ToolCRM:** Cadastro de clientes (PF/PJ), Dossiê (CPF, Endereço), Análise de Risco (IA) e upload de arquivos no perfil.
    *   **ToolDocs (Smart Docs):** Upload de arquivos, Auto-Tagging via IA (identifica se é Petição, Contrato, etc) e vínculo com clientes do CRM.
    *   **ToolJuris:** Busca simulada de jurisprudência via IA com termômetro de relevância.
    *   **ToolWriter:** Redator de minutas. O advogado escolhe o Tom, Tipo de Peça e pode "puxar" dados de um cliente do CRM para preencher o prompt da IA.
    *   **ToolAgenda:** Visualização de prazos (Mock).
    *   **ToolIntake:** Chat de triagem onde a IA diagnostica a urgência e área baseada no relato.

### 3.5. Painel Administrativo (`AdminDashboard` em `Dashboards.tsx`)
*   **KPIs:** Contadores de usuários, advogados e pendências.
*   **Aprovação:** Lista de advogados não verificados com botão para "Aprovar" (muda status no banco).

---

## 4. FLUXOS COMPLETOS (STEP-BY-STEP)

### 4.1. Fluxo de Criação de Caso (Cliente)
1.  Cliente acessa "Novo Caso".
2.  Digita o problema: "Fui demitido e não recebi nada".
3.  Clica em "Analisar".
4.  **Sistema (Gemini):** Identifica "Direito Trabalhista", Complexidade "Média".
5.  **Sistema:** Define preço R$ 4,00.
6.  Cliente preenche Cidade/UF e clica em "Confirmar e Publicar".
7.  **Sistema:** Cria registro na tabela `cases` com `status: OPEN`, `is_paid: true`.

### 4.2. Fluxo de Aceite (Advogado)
1.  Advogado acessa "Oportunidades".
2.  Visualiza o caso (Título, Resumo, Cidade).
3.  Verifica custo (5 Juris).
4.  Clica em "Aceitar".
5.  **Sistema:**
    *   Verifica saldo na tabela `profiles`.
    *   Se saldo < 5: Alerta erro.
    *   Se saldo >= 5: Subtrai 5 do saldo, atualiza `cases` (define `lawyer_id`, status `ACTIVE`), cria notificação para o cliente.

### 4.3. Fluxo Inteligente PRO (Integração CRM -> Writer)
1.  Advogado cadastra cliente "João Silva" no **ToolCRM**.
2.  Sistema salva no Supabase (`crm_clients`).
3.  Advogado vai para **ToolWriter** (Redator).
4.  Seleciona "Puxar do CRM" -> "João Silva".
5.  Sistema injeta dados (Nome, CPF, Endereço) no prompt.
6.  Advogado define "Tom: Agressivo" e "Fatos: Demissão sem justa causa".
7.  **IA (Gemini):** Gera a petição inicial completa com os dados injetados.

---

## 5. ARQUITETURA ATUAL

*   **Frontend:**
    *   `React 19` (via CDN/ESM no index.html).
    *   `Tailwind CSS` (via CDN).
    *   `Lucide React` (Ícones).
*   **Backend & Banco de Dados (BaaS):**
    *   **Supabase:**
        *   `auth`: Gerenciamento de usuários.
        *   `public.profiles`: Dados estendidos (role, OAB, saldo, premium).
        *   `public.cases`: Demandas jurídicas.
        *   `public.messages`: Chat.
        *   `public.notifications`: Alertas.
        *   `public.crm_clients`: Clientes do advogado (SocialJuris PRO).
        *   `public.smart_docs`: Documentos do advogado (SocialJuris PRO).
    *   **Realtime:** Subscrições ativas em `store.tsx` para atualizar telas sem refresh.
*   **Inteligência Artificial:**
    *   `@google/genai`: SDK oficial.
    *   Modelo: `gemini-2.5-flash`.
    *   Uso: Classificação, extração de dados, geração de texto, análise de risco.
*   **Estado (State Management):**
    *   `React Context` (`store.tsx`): Gerencia usuário, casos, notificações e CRUDs do PRO.

---

## 6. PONTOS FRACOS, LACUNAS E RISCOS

1.  **Segurança (RLS):** As políticas do banco de dados (`create policy ... using (true)`) estão permissivas demais (modo protótipo). Qualquer usuário logado pode ler/editar dados de outros se souber o endpoint.
    *   *Risco:* Vazamento de dados de clientes do CRM.
2.  **Pagamentos:** Todo o fluxo financeiro é simulado. Não há gateway real (Stripe/Asaas).
3.  **Videochamada:** O componente de vídeo é apenas visual (mock), não conecta áudio/vídeo real (WebRTC).
4.  **Upload de Arquivos:** O upload no CRM/Docs apenas salva o metadado no banco. Não está fazendo upload real do binário para o Supabase Storage. O link gerado é `'#'`.
5.  **Persistência de Sessão:** O token do Supabase é gerenciado, mas atualizações manuais de estado podem causar dessincronia se a internet falhar.

---

## 7. MELHORIAS RECOMENDADAS (SEM ALTERAR O CORE)

1.  **Storage Real:** Implementar upload real de arquivos para um bucket do Supabase (`documents`).
2.  **Refinamento de RLS:** Restringir `crm_clients` e `smart_docs` para que apenas o `lawyer_id` dono possa ver/editar.
3.  **Dashboards de Métricas:** O Analytics atual é visual. Criar queries SQL para agrupar dados reais (ex: ganhos mensais, casos por área).
4.  **Notificações Push:** Integrar com Browser Notifications API além das notificações internas.

---

## 8. PRIORIDADES DE DESENVOLVIMENTO

### 🔴 Alta Prioridade (Segurança e Funcionalidade Básica)
1.  **Corrigir RLS no Supabase:** Garantir que um advogado não veja o CRM do outro.
2.  **Implementar Supabase Storage:** Para que os arquivos anexados no CRM e Chat funcionem de verdade.

### 🟡 Média Prioridade (Refinamento do PRO)
1.  **Melhorar Prompts da IA:** Refinar o "Opositor IA" e "Jurisprudência" para respostas mais formatadas juridicamente (ABNT/Markdown rico).
2.  **Exportação:** Permitir baixar a minuta gerada pelo Writer em .DOCX ou PDF.

### 🟢 Baixa Prioridade (Visual/Futuro)
1.  **Integração de Pagamento Real:** Substituir o mock por Link de Pagamento.
2.  **Videochamada WebRTC:** Implementar peer-to-peer real.

---

## 9. CHECKLIST TÉCNICO PARA CONTINUIDADE

Antes de qualquer novo desenvolvimento, verifique:
*   [ ] As tabelas `crm_clients` e `smart_docs` foram criadas no Supabase?
*   [ ] A chave da API do Gemini (`process.env.API_KEY`) está ativa e com cota?
*   [ ] A URL e Key do Supabase em `services/supabaseClient.ts` correspondem ao projeto correto?
*   [ ] As *Triggers* de criação de perfil (`profiles`) estão funcionando no Supabase Auth?
