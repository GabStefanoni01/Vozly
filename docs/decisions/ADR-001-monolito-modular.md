# ADR-001 — Monólito modular

- Status: Aceito para o MVP
- Data: 2026-11-09

## Contexto
A equipe inicial é pequena e precisa entregar painel, multi-tenancy, agentes, integrações e voz em tempo real. Microserviços aumentariam custo de infraestrutura, observabilidade, deploy e depuração antes de haver necessidade comprovada.

## Decisão
Construir o backend inicial como monólito modular Java/Spring Boot, com fronteiras de domínio explícitas. O pipeline de voz terá contratos e adaptadores próprios e poderá ser extraído se streaming, latência ou escala exigirem.

## Consequências positivas
Menor complexidade operacional, transações mais simples, desenvolvimento e testes diretos e possibilidade de extração futura.

## Riscos
O processo pode concentrar cargas diferentes; fronteiras precisam ser respeitadas; voz pode exigir processo separado antes dos módulos administrativos.

## Revisão
Reavaliar diante de gargalo de escala, deploy independente, isolamento de falhas ou requisitos de disponibilidade incompatíveis.