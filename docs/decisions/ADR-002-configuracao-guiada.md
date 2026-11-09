# ADR-002 — Configuração guiada self-service

- Status: Aceito para o MVP
- Data: 2026-11-09

## Contexto

O Vozly deve permitir que cada empresa configure e gerencie seu próprio ambiente sem depender da equipe Vozly para mapear e parametrizar a operação. Um construtor visual completo exige decisões adicionais de UX, validação, versionamento, execução e depuração, podendo ampliar excessivamente o primeiro escopo.

## Decisão

O MVP oferecerá onboarding e configuração guiada self-service. O cliente será responsável por configurar seu ambiente por meio do painel, seguindo etapas com validação, ajuda contextual e indicação de pendências.

Etapas iniciais previstas:

1. Criar workspace e gerenciar membros.
2. Configurar identidade e comportamento do agente.
3. Adicionar conhecimento.
4. Habilitar ferramentas e configurar integrações suportadas.
5. Configurar número, horários e fallback, conforme disponibilidade.
6. Testar, corrigir pendências e publicar.

A configuração será salva como rascunho e publicada em versões imutáveis. Credenciais serão geridas por fluxo seguro e nunca farão parte do snapshot de configuração.

## Responsabilidades

- O cliente configura sua operação, agentes, conhecimento, integrações e regras dentro das capacidades oferecidas.
- O Vozly fornece os fluxos, validações, infraestrutura, segurança, documentação e suporte.
- O backend é responsável por validar permissões, schemas, limites e regras técnicas antes de persistir ou executar operações.
- A equipe Vozly não assume a configuração manual da operação do cliente como etapa padrão de ativação.

## Consequências

O onboarding, a usabilidade, a documentação contextual e o tratamento de erros tornam-se partes essenciais do produto. A arquitetura deve separar configuração do cliente, operação interna do serviço e execução do runtime.

O conjunto inicial de integrações será limitado e explícito. Não haverá suporte irrestrito a código arbitrário ou a qualquer API no MVP. Um construtor visual avançado poderá ser avaliado posteriormente sem reescrever o runtime.