# Domínio e modelo conceitual de dados

Este documento descreve conceitos e relações; não é ainda um schema SQL definitivo.

## Entidades
- **Tenant:** empresa/workspace; id, name, slug, status e timestamps.
- **User:** usuário do painel; id, name, email, credencial protegida ou referência a provedor de identidade, status.
- **Membership:** vínculo user-tenant; id, tenant_id, user_id, role (OWNER, ADMIN, OPERATOR), status.
- **Agent:** agente lógico; id, tenant_id, name, status (DRAFT, ACTIVE, PAUSED, ARCHIVED), versão publicada atual.
- **AgentVersion:** snapshot imutável; id, tenant_id, agent_id, version_number, configuration_snapshot, published_at, published_by.
- **KnowledgeItem:** conteúdo do agente; id, tenant_id, agent_id, type (FAQ, TEXT, DOCUMENT), title, content/referência, status.
- **ToolDefinition:** ferramenta da plataforma; id, key, name, description, input_schema e status.
- **AgentTool:** ferramenta habilitada no agente; id, tenant_id, agent_id, tool_key, enabled e configuration.
- **PhoneNumber:** número associado; id, tenant_id, agent_id, provider, provider_number_id, phone_number e status.
- **Call:** chamada; id, tenant_id, agent_id, agent_version_id, phone_number_id, provider_call_id, caller_number, direction, status, started_at, ended_at, duration_seconds, outcome e failure_reason.
- **ConversationMessage:** turno/evento; id, tenant_id, call_id, sequence_number, role, content/referência protegida e created_at.
- **ToolExecution:** execução; id, tenant_id, call_id, tool_key, status, input_summary, output_summary, idempotency_key, timestamps e error_code.
- **AuditEvent:** auditoria; id, tenant_id, actor, action, resource_type, resource_id, metadata minimizada e created_at.
- **UsageRecord:** consumo; id, tenant_id, call_id, provider, metric, quantity, unit, estimated_cost e occurred_at.

## Relações
Tenant possui memberships, agentes, números e eventos de auditoria. Agente possui versões, conhecimento e ferramentas. Chamada pertence a tenant, agente e versão; possui mensagens, execuções e registros de uso.

## Integridade
- Entidades de negócio contêm tenant_id ou vínculo inequívoco.
- Relacionamentos validam tenant consistente.
- IDs não substituem autorização.
- provider_call_id tem unicidade adequada por provedor.
- Webhooks são idempotentes.
- Chamada mantém referência à versão utilizada.
- Versões publicadas não são sobrescritas.
- Auditoria não pode ser alterada por usuários comuns.

## Decisões antes do schema físico
Autenticação própria ou externa; armazenamento de transcrições e áudios; retenção e exclusão; busca semântica/embeddings; anonimização; estratégia de arquivamento; armazenamento seguro de credenciais.