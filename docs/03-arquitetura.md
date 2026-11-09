# Arquitetura técnica

## Diretriz
Monólito modular em Java/Spring Boot, com fronteiras internas explícitas e adaptadores para fornecedores externos. Isso reduz complexidade inicial sem impedir extrações futuras. Microserviços só quando houver necessidade comprovada.

## Stack
- Frontend: Angular (definido).
- Backend: Java + Spring Boot (definido).
- Banco: PostgreSQL (definido).
- Redis: cache/estado temporário quando necessário.
- Telefonia, STT, LLM e TTS: fornecedores pendentes.
- Infraestrutura: definir após spike técnico.

## Módulos
- Identity & Access: autenticação, usuários, memberships e papéis.
- Tenants: empresas e contexto multi-tenant.
- Agents: criação, publicação e versionamento.
- Knowledge: FAQs, documentos e recuperação.
- Tools: catálogo, permissões, validação, execução e auditoria.
- Voice Runtime: sessões, turnos e pipeline de voz.
- Telephony: números, webhooks, eventos e transferência.
- Conversations: chamadas, mensagens, transcrições e resultados.
- Usage: duração, consumo e limites.
- Observability: logs, métricas, tracing e alertas.

## Visão de componentes
O painel Angular consome a API administrativa Spring Boot. Serviços de domínio usam PostgreSQL. O runtime recebe eventos e mídia do adaptador de telefonia e orquestra STT, LLM, ferramentas e TTS. Redis pode apoiar estado temporário e cache.

## API administrativa versus voz
REST atende cadastro, autenticação, configuração, conhecimento, histórico e indicadores. Voz exige streaming/conexões longas, baixa latência, eventos assíncronos, interrupção de fala e tratamento de desconexão. Não implementar áudio como sequência de requisições REST síncronas longas. Protocolo (WebSocket, SIP, streaming HTTP ou combinação) será definido após spike com o provedor.

## Multi-tenancy
Estratégia inicial: PostgreSQL compartilhado com tenant_id nas entidades de negócio.
- Resolver tenant a partir da identidade e membership válida.
- Nunca confiar em tenant_id livre enviado pelo frontend.
- Consultas e comandos operam no contexto do tenant.
- Índices e constraints consideram tenant quando necessário.
- Testar tentativas de acesso cruzado.
- Webhooks e tarefas assíncronas também resolvem tenant com segurança.
Avaliar Row-Level Security como defesa adicional, não substituta da autorização.

## Execução segura de ferramentas
1. Modelo solicita ferramenta.
2. Runtime verifica se está habilitada na versão publicada.
3. Backend valida schema e argumentos.
4. Domínio verifica tenant, autorização e regras.
5. Ação é executada.
6. Resultado real é auditado e devolvido.
7. Modelo responde com base no resultado.

LLM não recebe credenciais de banco, não executa SQL livre nem acessa sistemas internos diretamente. Ações com efeitos colaterais consideram idempotência, timeout e auditoria.

## Versionamento
Cada publicação gera snapshot imutável. Cada chamada referencia a versão utilizada para permitir auditoria, reprodução do contexto e rollback.

## Redis e persistência
PostgreSQL é fonte de verdade. Redis pode apoiar sessão temporária, cache, rate limiting e locks. Não usar Redis como persistência única de chamadas ou auditoria. Filas duráveis serão avaliadas quando requisitos forem conhecidos.

## Segurança e observabilidade
Segredos protegidos; verificação de webhooks quando suportada; rate limiting; logs estruturados com tenant_id, call_id e correlation ID; evitar dados pessoais desnecessários; métricas por etapa do pipeline; política de retenção e exclusão.

## Testes
Unitários de domínio; integração de repositórios e transações; contratos de adaptadores; autorização entre tenants; idempotência; fluxo de chamada ponta a ponta; carga e latência antes de ampliar concorrência.

## Decisões pendentes
Telefonia/protocolo de mídia; fornecedores STT/LLM/TTS; streaming e interrupção; hospedagem/região; armazenamento de áudio; fila durável; retenção e custo por minuto.