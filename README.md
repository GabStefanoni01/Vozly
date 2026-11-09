# Vozly

**Plataforma de agentes de voz inteligentes para empresas.**

A Vozly permite que empresas configurem agentes de voz capazes de atender chamadas telefônicas, conversar naturalmente, consultar informações e executar ações autorizadas nos sistemas da operação.

A plataforma será multiempresa e configurável. Assistências técnicas de eletrodomésticos serão o primeiro segmento de validação, sem limitar o produto a esse mercado.

## Visão do MVP

Permitir que uma empresa crie seu espaço de trabalho, configure um agente por fluxo guiado, defina instruções e conhecimento, habilite ações permitidas, conecte um número telefônico e acompanhe chamadas, resultados e consumo.

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
- [ADR 001 — Monólito modular](docs/decisions/ADR-001-monolito-modular.md)
- [ADR 002 — Configuração guiada](docs/decisions/ADR-002-configuracao-guiada.md)

## Princípios

- Multi-tenant desde o início, com isolamento rigoroso.
- A IA conversa; o backend valida e executa ações.
- O agente nunca inventa disponibilidade, preços, status ou confirmações.
- Ações importantes têm permissões, validação e auditoria.
- Deve existir transferência para atendimento humano.
- Privacidade, transparência e LGPD fazem parte do produto.

## Estado atual

O repositório está na fase de definição e documentação. Provedores de telefonia, STT, LLM e TTS, custos, retenção de gravações e integrações específicas ainda precisam ser validados.
