# Modelo relacional e persistência

> Status: especificação lógica inicial. Não é migration SQL nem schema físico definitivo. Tipos, índices e políticas devem ser confirmados durante a implementação e revisão de segurança.

## 1. Princípios

- PostgreSQL é a fonte de verdade para dados transacionais e configuração.
- Redis é opcional e restrito a cache, estado efêmero, coordenação e dados com expiração explícita. Nunca é a única cópia de informação necessária para auditoria ou consistência.
- Todo recurso pertencente a uma empresa deve carregar `tenant_id` ou ser alcançável por uma relação cuja autorização valide o tenant.
- IDs não substituem autorização: toda leitura, alteração, exclusão e execução verifica membership e escopo no servidor.
- Configurações publicadas são snapshots imutáveis. Alterações posteriores criam nova versão.
- Segredos não são armazenados em texto puro nas tabelas de domínio nem incluídos em snapshots, prompts, logs ou respostas administrativas.

## 2. Convenções

- Chaves primárias: UUID gerado no backend ou banco, salvo justificativa documentada.
- Datas: timestamps em UTC, persistidos com timezone (`timestamptz`).
- Campos de auditoria comuns: `created_at`, `updated_at`; adicionar `created_by` e `updated_by` quando houver ator humano identificável.
- Estados: valores controlados no domínio; não aceitar estados arbitrários enviados pelo cliente.
- Exclusão: preferir arquivamento/soft delete para recursos operacionais com histórico. Dados pessoais seguem política de retenção e exclusão aprovada; soft delete não pode impedir obrigações de eliminação.
- Valores monetários, caso introduzidos, devem usar tipo decimal e moeda explícita, nunca ponto flutuante.

## 3. Entidades e relações

### 3.1 Identidade e tenants

| Entidade | Campos principais | Relações e restrições |
|---|---|---|
| `users` | id, name, email_normalized, identity_provider, external_subject, status, created_at, updated_at | Email normalizado único conforme estratégia de identidade adotada; credenciais podem ficar em provedor externo. |
| `tenants` | id, name, slug, status, created_at, updated_at | slug único global ou por política explícita; status controla acesso ao workspace. |
| `memberships` | id, tenant_id, user_id, role, status, created_at | FK tenant/user; UNIQUE(tenant_id,user_id); role em OWNER, ADMIN, OPERATOR. |
| `invitations` | id, tenant_id, email_normalized, role, token_hash, expires_at, accepted_at, invited_by | Token armazenado como hash; expiração e uso único; tenant obrigatório. |
| `onboarding_progress` | id, tenant_id, current_step, completed_steps, status, updated_at | UNIQUE(tenant_id); progresso não concede permissões. |

Um usuário pode pertencer a vários tenants. A sessão deve indicar o tenant ativo, mas a autorização sempre revalida a membership no servidor.

### 3.2 Agentes e publicação

| Entidade | Campos principais | Relações e restrições |
|---|---|---|
| `agents` | id, tenant_id, name, description, status, current_published_version_id, created_at, updated_at | FK tenant; status DRAFT, ACTIVE, PAUSED, ARCHIVED. |
| `agent_versions` | id, tenant_id, agent_id, version_number, configuration_snapshot, checksum, published_at, published_by | FK composta para agente/tenant; UNIQUE(tenant_id,agent_id,version_number); imutável após publicação. |
| `agent_publications` (opcional) | id, tenant_id, agent_id, agent_version_id, published_by, published_at, revoked_at | Histórico explícito de publicação/retirada se necessário além do ponteiro atual. |

O snapshot publicado deve conter apenas configuração operacional não secreta: identidade, instruções, regras, referências versionadas a conhecimento/ferramentas e parâmetros de runtime. Credenciais são resolvidas por referência segura no serviço de integração, nunca copiadas para o snapshot.

### 3.3 Conhecimento

| Entidade | Campos principais | Relações e restrições |
|---|---|---|
| `knowledge_items` | id, tenant_id, title, content, content_type, status, created_at, updated_at | Conteúdo pertence ao tenant; status DRAFT, ACTIVE, ARCHIVED. |
| `agent_knowledge_bindings` | id, tenant_id, agent_id, knowledge_item_id, priority, enabled | UNIQUE(tenant_id,agent_id,knowledge_item_id); ambas FKs devem pertencer ao mesmo tenant. |
| `knowledge_revisions` (recomendado) | id, tenant_id, knowledge_item_id, revision, content_snapshot, created_at, created_by | UNIQUE(tenant_id,knowledge_item_id,revision); permite reproduzir contexto de versões publicadas. |

Se futuramente houver documentos binários ou indexação vetorial, metadados e permissões continuam no PostgreSQL; armazenamento de arquivos e índice de busca serão adaptadores separados. O conteúdo recuperado deve respeitar tenant e bindings ativos.

### 3.4 Catálogo, conexões e ferramentas

Os conceitos e contratos detalhados estão em [Catálogo de ferramentas e integrações](07-catalogo-ferramentas-integracoes.md). Persistência lógica:

| Entidade | Campos principais | Relações e restrições |
|---|---|---|
| `tool_definitions` | id, key, version, kind, input_schema, output_schema, policy, status | Catálogo controlado pela Vozly; UNIQUE(key,version). |
| `integration_definitions` | id, key, version, connector_type, config_schema, status | Catálogo controlado pela Vozly; UNIQUE(key,version). |
| `integration_connections` | id, tenant_id, integration_definition_id, name, status, credential_ref, config_ciphertext, validated_at | UNIQUE(tenant_id,name) conforme regra de nomes; segredo fora da linha ou cifrado com KMS/envelope encryption. |
| `integration_operations` | id, tenant_id, connection_id, operation_key, method, path_template, input_schema, output_mapping, enabled | UNIQUE(tenant_id,connection_id,operation_key); métodos e destinos allowlisted. |
| `agent_tool_bindings` | id, tenant_id, agent_id, tool_definition_id, connection_id, operation_id, config, enabled | Integridade tenant-scoped; não permitir binding cruzado entre tenants. |

Definições globais do catálogo não devem conter credenciais de clientes. Configurações específicas e referências a segredos são sempre tenant-scoped.

### 3.5 Telefonia, chamadas e conversas

| Entidade | Campos principais | Relações e restrições |
|---|---|---|
| `phone_numbers` | id, tenant_id, provider_key, provider_number_ref, e164, status, routing_config | Número associado a tenant; unicidade do identificador do provedor. |
| `calls` | id, tenant_id, agent_id, agent_version_id, phone_number_id, provider_call_ref, direction, status, started_at, answered_at, ended_at, end_reason | Toda chamada registra exatamente a versão publicada utilizada; provider_call_ref com unicidade no escopo do provedor. |
| `conversations` | id, tenant_id, call_id, status, started_at, ended_at | FK tenant-scoped para chamada; normalmente uma conversa por chamada no MVP. |
| `conversation_messages` | id, tenant_id, conversation_id, sequence, role, content_ref/content, created_at, metadata | UNIQUE(tenant_id,conversation_id,sequence); aplicar minimização e política de retenção. |
| `tool_executions` | id, tenant_id, call_id, conversation_id, agent_version_id, tool_binding_id, status, input_redacted, output_redacted, started_at, finished_at, error_code | Auditoria de execução sem segredos; estado e resultado sanitizados. |
| `call_events` (opcional) | id, tenant_id, call_id, event_type, occurred_at, correlation_id, safe_payload | Eventos operacionais com payload minimizado e retenção definida. |

Gravações e transcrições extensas podem ficar em storage próprio com criptografia e política de expiração. O banco guarda referência, metadados, consentimento/base aplicável quando pertinente e estado de retenção; nunca se deve presumir gravação habilitada por padrão.

### 3.6 Auditoria e consumo

| Entidade | Campos principais | Relações e restrições |
|---|---|---|
| `audit_events` | id, tenant_id, actor_user_id, action, resource_type, resource_id, occurred_at, correlation_id, safe_metadata | Append-only para eventos relevantes; não registrar tokens ou segredos. |
| `usage_records` | id, tenant_id, call_id, metric, quantity, unit, provider_key, occurred_at | Registros idempotentes por evento de origem; não equivalem ainda a faturamento. |

## 4. Integridade multi-tenant

1. Toda tabela tenant-scoped contém `tenant_id NOT NULL`.
2. Relacionamentos entre recursos tenant-scoped devem usar chaves/constraints compostas quando necessário, por exemplo UNIQUE(tenant_id,id) e FK (tenant_id,agent_id).
3. O backend obtém o tenant autorizado a partir da identidade e membership; não confia em `tenant_id` livre enviado no body.
4. Queries devem filtrar tenant no repositório/serviço, não apenas no controller.
5. Índices iniciados por `tenant_id` são esperados para consultas tenant-scoped; validar planos com dados representativos.
6. Testes de integração devem tentar acessar IDs de outro tenant em cada operação de leitura e escrita.
7. Políticas PostgreSQL Row-Level Security podem ser avaliadas como defesa adicional, não substituindo autorização de aplicação. Se adotadas, contexto de tenant deve ser configurado com segurança por transação/conexão.

## 5. Índices iniciais a avaliar

- `memberships(tenant_id,user_id)` UNIQUE.
- `agents(tenant_id,status,updated_at)`.
- `agent_versions(tenant_id,agent_id,version_number)` UNIQUE.
- `integration_connections(tenant_id,status)`.
- `calls(tenant_id,started_at DESC)`.
- `calls(tenant_id,status,started_at DESC)`.
- `conversation_messages(tenant_id,conversation_id,sequence)` UNIQUE.
- `tool_executions(tenant_id,call_id,started_at)`.
- `audit_events(tenant_id,occurred_at DESC)`.
- `usage_records(tenant_id,occurred_at,metric)`.

São hipóteses iniciais. Índices adicionais devem nascer de consultas reais e medição, evitando indexar indiscriminadamente campos de baixa seletividade.

## 6. Redis

Usos possíveis, sempre com TTL e política de invalidação:
- estado transitório de sessão/stream de chamada;
- locks curtos ou coordenação distribuída quando indispensável;
- cache de catálogo público e configuração não sensível;
- rate limiting.

Não usar Redis como fonte definitiva de membership, autorização, histórico, publicação, auditoria ou execução de operações. Cache tenant-scoped deve incluir tenant no namespace/chave e ser invalidado em mudanças relevantes.

## 7. Migrations e evolução

- Adotar ferramenta de migrations compatível com Spring Boot (Flyway ou Liquibase; decisão pendente).
- Migrations versionadas, revisadas e executadas de forma previsível por ambiente.
- Não editar migrations já aplicadas em ambientes compartilhados; criar migration corretiva.
- Preferir evolução expand/contract: adicionar estrutura compatível, migrar dados, atualizar aplicação e só então remover legado.
- Testar migrations em banco limpo e em atualização a partir da versão anterior.
- Seeds de catálogo devem ser versionados e idempotentes; dados de cliente não entram em seeds.
- Backup, restore e recuperação point-in-time precisam ser definidos antes de produção.

## 8. Decisões pendentes

- Estratégia de identidade: autenticação própria ou provedor externo.
- UUID gerado na aplicação ou no PostgreSQL.
- Flyway ou Liquibase.
- RLS como camada adicional.
- Storage de gravações/documentos e provedor de busca.
- Política final de retenção, anonimização e exclusão, sujeita a avaliação jurídica e de produto.
- Necessidade de particionamento para chamadas/eventos conforme volume real.

## 9. Critério para implementação

O modelo físico só deve ser criado após revisão das relações e contratos de API. Cada migration deve ser acompanhada por testes de constraints, isolamento entre tenants, índices essenciais e compatibilidade com snapshots publicados.
