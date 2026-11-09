# ADR-002 — Configuração guiada de agentes

- Status: Aceito para o MVP
- Data: 2026-11-09

## Contexto
A Vozly deve permitir configuração sem programação. Um construtor visual exige decisões adicionais de UX, validação, versionamento, execução e depuração.

## Decisão
O MVP usará assistente guiado em etapas:
1. Identidade e comportamento.
2. Conhecimento.
3. Ferramentas e ações permitidas.
4. Horários e fallback.
5. Número telefônico, teste e publicação.

A configuração será salva como rascunho e publicada em versões imutáveis.

## Consequências
Menor curva de aprendizado e escopo mais controlado. Fluxos muito específicos podem exigir evolução posterior. O runtime deve ser independente da interface para permitir construtor visual no futuro sem reescrever o motor.