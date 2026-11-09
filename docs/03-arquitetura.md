# Arquitetura técnica

## Diretriz

Monólito modular em Java/Spring Boot, com fronteiras internas explícitas e adaptadores para fornecedores externos. Isso reduz complexidade inicial sem impedir extrações futuras. Microserviços só quando houver necessidade comprovada.

A arquitetura deve suportar onboarding e configuração self-service: cada tenant gerencia seu ambiente pelo painel, enquanto o backend valida e aplica todas as alterações. A equipe Vozly opera o produto e a infraestrutura, mas não configura manualmente os processos de cada cliente como requisito de ativação.

## Stack

- Frontend: Angular (definido).
- Backend: Java + Spring Boot (definido).
- Banco: PostgreSQL (definido).
- Redis: cache/estado temporário quando necessário.
- Telefonia, STT, LLM e TTS: fornecedores pendentes.
- Infraestrutura e gestão de segredos: definir após spike técnico.

## Módulos

- **Identity & Access:** autenticação, usuários, memberships e papéis.
- **Tenants & Onboarding:** workspaces, provisionamento, checklist e estado de ativação.
- **Agents:** criação, configuração, validação, publicação e versionamento.
- **Knowledge:** FAQs, conteúdo, documentos e recuperação.
- **Integrations:** conexões externas, credenciais, testes, estado e revogação.
- **Tools:** catálogo, configuração por tenant/agente, permissões, validação, execução e auditoria.
- **Voice Runtime:** sessões, turnos e pipeline de voz.
- **Telephony:** números, webhooks, eventos e transferência.
- **Conversations:** chamadas, mensagens, transcrições e resultados.
- **Usage:** duração, consumo e limites.
- **Observability:** logs, métricas, tracing e alertas.
- **Platform Operations:** operações internas de suporte, com acesso privilegiado explícito e auditado.

## Visão de componentes

O painel Angular consome a API administrativa Spring Boot. O cliente usa o painel para provisionar seu workspace e configurar agentes, conhecimento, ferramentas e conexões. A API valida cada alteração no contexto do tenant e persiste configurações em PostgreSQL.

Serviços de domínio e o runtime utilizam snapshots publicados. O runtime recebe eventos e mídia do adaptador de telefonia e orquestra STT, LLM, ferramentas e TTS. Redis pode apoiar estado temporário e cache.

## API administrativa versus voz

REST atende cadastro, autenticação, onboarding, configuração, conhecimento, integrações, histórico e indicadores. Voz exige streaming/conexões longas, baixa latência, eventos assíncronos, interrupção de fala e tratamento de desconexão. Não implementar áudio como sequência de requisições REST síncronas longas. Protocolo (WebSocket, SIP, streaming HTTP ou combinação) será definido após spike com o provedor.

## Multi-tenancy

Estratégia inicial: PostgreSQL compartilhado com tenant_id nas entidades de negócio.

- Resolver tenant a partir da identidade e membership válida.
- Nunca confiar em tenant_id livre enviado pelo frontend.
- Consultas e comandos operam no contexto do tenant.
- Índices e constraints consideram tenant quando necessário.
- Testar tentativas de acesso cruzado.
- Webhooks e tarefas assíncronas resolvem tenant por vínculo assinado/registrado, nunca por argumento não confiável.
- Credenciais e conexões pertencem ao tenant e possuem autorização explícita.

Avaliar Row-Level Security como defesa adicional, não substituta da autorização.

## Onboarding e configuração

- Provisionamento de tenant deve ser idempotente e vinculado ao usuário autenticado.
- Onboarding mantém progresso e permite retomar etapas.
- Cada etapa possui schema, validações e mensagens de erro acionáveis.
- Configurações em rascunho são separadas de snapshots publicados.
- Testes de integração devem oferecer modo de validação que evite efeitos colaterais sempre que possível.
- O cliente recebe feedback de estado: incompleto, inválido, conectado, pronto para teste ou pronto para publicação.
- A publicação verifica pré-requisitos no servidor; não confia apenas na validação do frontend.

## Gestão de integrações e segredos

- Credenciais nunca são persistidas em texto puro.
- O frontend envia o segredo somente no fluxo de criação/atualização e não recebe o valor de volta.
- Segredos são criptografados em repouso ou mantidos em serviço de secrets apropriado; a escolha de implementação fica pendente.
- Logs, traces, eventos, prompts e respostas não podem conter credenciais.
- Acesso a segredo é concedido somente ao adaptador/serviço autorizado e auditado.
- Deve existir fluxo de testar conexão, atualizar credencial, revogar e lidar com falhas.
- Nunca permitir que o LLM leia, escolha ou manipule credenciais diretamente.

## Execução segura de ferramentas

1. Modelo solicita ferramenta.
2. Runtime verifica se está habilitada na versão publicada.
3. Backend valida schema e argumentos.
4. Domínio verifica tenant, autorização e regras.
5. Adaptador executa a ação com credenciais recuperadas de forma segura.
6. Resultado real é auditado e devolvido.
7. Modelo responde com base no resultado.

LLM não recebe credenciais de banco ou integrações, não executa SQL livre nem acessa sistemas internos diretamente. Ações com efeitos colaterais consideram idempotência, timeout e auditoria.

## Versionamento

Cada publicação gera snapshot imutável da configuração do agente e das referências de conhecimento/ferramentas aplicáveis. Cada chamada referencia a versão utilizada. Segredos não devem ser copiados para o snapshot; ele guarda apenas referências a conexões autorizadas, cuja validade é verificada em runtime.

## Redis e persistência

PostgreSQL é fonte de verdade. Redis pode apoiar sessão temporária, cache, rate limiting e locks. Não usar Redis como persistência única de chamadas ou auditoria. Filas duráveis serão avaliadas quando requisitos forem conhecidos.

## Segurança e observabilidade

Segredos protegidos; verificação de webhooks quando suportada; rate limiting; logs estruturados com tenant_id, call_id e correlation ID; evitar dados pessoais e credenciais desnecessárias; métricas por etapa do pipeline; trilha de auditoria para mudanças de configuração, acesso privilegiado e operações; política de retenção e exclusão.

## Testes

Unitários de domínio; integração de repositórios e transações; contratos de adaptadores; autorização entre tenants; isolamento de credenciais; idempotência; fluxo de onboarding ponta a ponta; publicação e rollback; fluxo de chamada; carga e latência antes de ampliar concorrência.

## Decisões pendentes

Telefonia/protocolo de mídia; fornecedores STT/LLM/TTS; streaming e interrupção; hospedagem/região; armazenamento de áudio; solução de secrets; modelo de conexões externas; fila durável; retenção e custo por minuto.