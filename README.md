# Vozly — Inteligência Artificial Aplicada ao Atendimento Telefônico

> "Estou desenvolvendo a Vozly com o objetivo de aproximar a inteligência artificial das operações reais das empresas. Minha proposta é construir uma plataforma de atendimento telefônico inteligente, capaz de compreender solicitações, conduzir conversas naturais e transformar interações em informações e processos organizados."

---

## 1. O que é a Vozly

A Vozly é uma plataforma de recepcionista virtual baseada em inteligência artificial e atendimento por voz em português brasileiro.

A proposta não é oferecer apenas mais um chatbot de mensagens ou uma árvore rígida de URA (Unidade de Resposta Audível). Meu foco é conceber agentes de IA capazes de atender chamadas telefônicas reais, compreender solicitações com linguagem natural e estruturar tarefas operacionais diretamente conectadas ao fluxo de atendimento das empresas.

**Diferencial central:**
> **A Vozly transforma ligações telefônicas em atendimentos organizados e ações operacionais.**

---

## 2. O Problema que Estou Resolvendo

Enquanto a equipe de uma empresa está ocupada executando serviços ou quando o expediente se encerra, os clientes continuam ligando:

1. **Chamadas fora do expediente:** Clientes que ligam às 22h ou aos finais de semana encontram linhas mudas ou caixas postais ignoradas, resultando em oportunidades perdidas.
2. **Sobrecarga operacional constante:** Interromper manutenções, atendimentos presenciais ou consultas para atender o telefone quebra o fluxo de trabalho e reduz a produtividade da equipe.
3. **Informações desorganizadas:** Recados em papéis soltos ou anotações informais geram retrabalho e ruído na passagem de serviço.

A Vozly entra como uma camada inteligente que atende a chamada imediatamente, conversa com cordialidade e precisão, identifica o equipamento ou serviço desejado, registra o problema relatado e gera uma ficha estruturada pronta para agendamento ou encaminhamento.

---

## 3. Por que Decidi Desenvolver este Projeto

Conversando com proprietários de assistências técnicas, clínicas e oficinas mecânicas, percebi que a maior dor não é a falta de canais digitais, mas sim o volume expressivo de clientes que ainda preferem — ou precisam — telefonar para resolver seus problemas com agilidade.

A tecnologia atual de Large Language Models e síntese/reconhecimento de voz de baixa latência atingiu maturidade suficiente para que possamos construir agentes telefônicos empáticos e focados em tarefas. Decidi então criar a Vozly para provar que a IA pode participar da operação, gerando valor real para pequenas e médias empresas.

---

## 4. Proposta Tecnológica e Arquitetura

Concebi a arquitetura da Vozly guiado por princípios sólidos de governança e escalabilidade:

- **A IA conversa; o backend valida e executa:** O agente de voz nunca inventa disponibilidades, preços ou confirmações de agendamento. Todas as operações de escrita passam por validação de regras de negócio.
- **Multi-tenant por padrão:** Isolamento estrito de dados e configurações entre empresas clientes.
- **Roteamento para atendimento humano:** Caso o cliente solicite ou a situação fuja das regras configuradas, a chamada é direcionada para a equipe responsável.
- **Privacidade e conformidade:** Proteção de dados e conformidade com as diretrizes da LGPD consideradas desde o design de software.

### Stack Tecnológica Global do Produto

| Camada | Tecnologia | Papel no Ecossistema |
|---|---|---|
| **Frontend** | Angular (v22+, Standalone Components, Modern CSS) | Landing page de posicionamento, simulador interativo de chamadas e interface de gestão do dashboard |
| **Backend** | Java + Spring Boot (Monólito modular planejado) | Regras de negócio, controle multi-tenant, autorização e orquestração de chamadas |
| **Banco de Dados** | PostgreSQL | Persistência transacional de workspaces, chamadas, clientes e auditoria |
| **Cache & Estado** | Redis | Gerenciamento de estado de chamadas ativas e sessões efêmeras |
| **Telefonia & Voz** | Webhooks SIP/WebRTC, STT (Speech-to-Text) e TTS (Text-to-Speech) | Conectividade telefônica e sintetização de voz natural (em fase de seleção) |

---

## 5. Estrutura do Repositório

Todo o código referente à interface visual e componentes de usuário está encapsulado estritamente no diretório `frontend/`:

```text
Vozly/
│
├── frontend/                               # Aplicação Frontend (Angular)
│   ├── public/
│   │   ├── brand/                          # Identidade visual oficial (logos, símbolos, app icons)
│   │   └── favicon.ico                     # Favicon oficial
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── layout/
│   │   │   │   │   ├── header/             # Navegação com glassmorphism e menu mobile
│   │   │   │   │   └── footer/             # Rodapé institucional e links estruturados
│   │   │   │   ├── sections/
│   │   │   │   │   ├── hero/               # Hero com símbolo V 3D e áudio interativo
│   │   │   │   │   ├── brand-strip/        # Pilares tecnológicos da plataforma
│   │   │   │   │   ├── problem/            # Apresentação dos 3 desafios de mercado
│   │   │   │   │   ├── how-it-works/       # 4 etapas do fluxo operacional
│   │   │   │   │   ├── call-demo/          # Simulador de chamada e extração em tempo real
│   │   │   │   │   ├── features/           # 6 recursos essenciais da plataforma
│   │   │   │   │   ├── industries/         # 6 segmentos atendidos e fluxos práticos
│   │   │   │   │   ├── dashboard-preview/  # Mockup do painel de controle e KPIs
│   │   │   │   │   ├── integrations/       # Ecossistema de integrações em desenvolvimento
│   │   │   │   │   ├── security/           # 4 pilares de segurança e previsibilidade
│   │   │   │   │   └── final-cta/          # Chamada de encerramento com símbolo oficial
│   │   │   │   └── ui/
│   │   │   │       ├── icon/               # Componente SVG vetorial puro (sem dependências)
│   │   │   │       └── demo-modal/         # Modal de registro e esclarecimento do estágio
│   │   │   ├── app.ts                      # Componente raiz
│   │   │   ├── app.html                    # Composição das seções verticais
│   │   │   └── app.css                     # Estilos de apoio
│   │   ├── index.html                      # Ponto de entrada HTML com fontes Inter/Jakarta
│   │   ├── styles.css                      # Design tokens, paleta oficial (#050505, #6D00FF)
│   │   └── main.ts                         # Bootstrap da aplicação
│   ├── angular.json                        # Configurações de compilação e orçamentos de estilo
│   ├── package.json                        # Scripts e dependências do frontend
│   └── tsconfig.json                       # Configurações TypeScript
│
├── docs/                                   # Documentação de arquitetura, requisitos e ADRs
│   ├── 01-visao-do-produto.md
│   ├── 02-requisitos-mvp.md
│   ├── 03-arquitetura.md
│   ├── 04-dominio-e-dados.md
│   ├── 05-roadmap.md
│   └── decisions/                          # Architectural Decision Records (ADRs)
│
├── .gitignore                              # Regras de exclusão Git
└── README.md                               # Apresentação oficial do projeto
```

---

## 6. Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js**: versão 18 ou superior (testado com Node v24 LTS)
- **npm**: versão 9 ou superior

### Passo a Passo

1. Clone o repositório e acesse a branch de desenvolvimento:
   ```bash
   git clone https://github.com/GabStefanoni01/Vozly.git
   cd Vozly
   git checkout develop
   ```

2. Acesse a pasta do frontend e instale as dependências:
   ```bash
   cd frontend
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

4. Abra o navegador em:
   ```
   http://localhost:4200
   ```

5. Para gerar o build otimizado de produção:
   ```bash
   npm run build
   ```
   Os artefatos compilados serão gerados em `frontend/dist/frontend`.

---

## 7. Fluxo de Branches e Versionamento

O desenvolvimento da Vozly adota uma estratégia estrita de ramificação para garantir estabilidade e rastreabilidade:

- **`develop`**: Branch oficial de desenvolvimento ativo. Todo novo recurso, refinamento de design e teste deve ser submetido nesta branch.
- **`main`**: Branch de produção e releases estáveis. Nenhuma alteração direta é efetuada na `main`.
- **Conventional Commits V2**: Todos os commits seguem a convenção semântica padronizada (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `chore`).

---

## 8. Estágio Atual de Desenvolvimento

> ⚠️ **Aviso de Transparência:**
> **Status do projeto: desenvolvimento frontend ativo.**
> As interfaces demonstrativas apresentadas na landing page, no simulador de chamadas e no mockup do painel de controle representam a experiência e a arquitetura visual pretendidas, não correspondendo a integrações telefônicas ou de backend já conectadas nesta etapa.
