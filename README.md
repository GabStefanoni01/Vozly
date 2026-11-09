# Vozly

**Solução de agentes de voz inteligentes para automatizar atendimentos e operações empresariais.**

O Vozly permite que empresas configurem e operem seus próprios agentes de voz para atender chamadas, conversar naturalmente, consultar informações e executar operações autorizadas por meio de integrações controladas.

Cada empresa será responsável por configurar seu ambiente diretamente no produto, por meio de uma experiência self-service guiada. O Vozly fornece os recursos, validações, controles de segurança e infraestrutura necessários para que o cliente configure, teste, publique e acompanhe seus agentes sem depender da equipe Vozly para parametrizar sua operação.

## Visão do MVP

Permitir que uma empresa crie seu workspace, convide usuários, configure um agente, cadastre conhecimento, habilite ferramentas, conecte integrações e números telefônicos, teste o comportamento e publique uma versão. Depois, poderá acompanhar chamadas, resultados, transferências e consumo pelo painel.

O MVP será desenhado sem depender de um segmento empresarial específico ou de um processo operacional pré-definido.

## Stack inicial

- Frontend: Angular
- Backend: Java + Spring Boot
- Banco de dados: PostgreSQL
- Cache/estado temporário: Redis, quando necessário
- Integrações: telefonia, speech-to-text, LLM e text-to-speech; fornecedores ainda a selecionar.

## Documentação

- [Visão do produto](docs/01-visao-do-produto.md)
- [Requisitos do MVP](docs/02-requisitos-mvp.md)
- [Arquitetura](docs/03-arquitetura.md)
- [Domínio e dados](docs/04-dominio-e-dados.md)
- [Roadmap](docs/05-roadmap.md)
- [Jornada self-service e configuração](docs/06-jornada-self-service-e-configuracao.md)
- [Catálogo de ferramentas e integrações](docs/07-catalogo-ferramentas-integracoes.md)
- [Modelo relacional e persistência](docs/08-modelo-relacional-e-persistencia.md)
- [Contratos da API administrativa](docs/09-contratos-api-administrativa.md)
- [Runtime de voz, segurança e operação](docs/10-runtime-de-voz-seguranca-e-operacao.md)
- [ADR 001 — Monólito modular](docs/decisions/ADR-001-monolito-modular.md)
- [ADR 002 — Configuração guiada self-service](docs/decisions/ADR-002-configuracao-guiada.md)

## Princípios

- Cada empresa configura e administra seu próprio ambiente.
- Multi-tenant desde o início, com isolamento rigoroso.
- A IA conversa; o backend valida e executa ações.
- Ferramentas e integrações são explicitamente habilitadas pelo cliente e validadas pelo backend.
- O agente nunca inventa disponibilidade, preços, status ou confirmações.
- Ações importantes têm permissões, validação e auditoria.
- Deve existir transferência para atendimento humano.
- Privacidade, transparência e LGPD fazem parte do produto.

## Responsabilidades

- **Cliente:** configura sua empresa, usuários, agentes, conhecimento, ferramentas, integrações e regras de atendimento dentro das capacidades disponíveis.
- **Vozly:** fornece e opera o produto, protege os ambientes, disponibiliza recursos e controles, monitora a infraestrutura e oferece suporte.
- **Backend Vozly:** valida permissões, parâmetros, limites e regras técnicas antes de executar operações; nunca confia apenas na decisão do modelo ou nos dados enviados pelo frontend.

## Estado atual

O repositório está na fase de definição e documentação. Provedores de telefonia, STT, LLM e TTS, custos, retenção de gravações, gestão de credenciais e estratégia de integrações ainda precisam ser detalhados e validados.