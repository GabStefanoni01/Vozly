# Catálogo de ferramentas e integrações — contratos do MVP

## 1. Objetivo e limites

Este documento define os contratos conceituais que orientam a implementação do catálogo no backend Java/Spring Boot, sua persistência em PostgreSQL e a experiência administrativa no Angular.

A Vozly oferece capacidades e conectores suportados. Cada empresa escolhe quais recursos habilitar em seus agentes e configura somente os parâmetros permitidos pelo produto.

O catálogo é controlado pela Vozly: clientes podem configurar instâncias e associações, mas não publicar novas implementações, código, SQL ou adaptadores arbitrários.

### Vocabulário

- **Ferramenta (Tool):** capacidade invocável pelo runtime, com nome, descrição, schema de entrada/saída e política de execução.
- **Conector (Integration):** tipo de conexão externa suportado pela Vozly, como API REST ou webhook.
- **Operação de integração:** ação específica e previamente definida sobre uma conexão, com método, rota, autenticação referenciada, schema e regras próprias.
- **Conexão (Connection):** instância configurada por um tenant, com metadados e referência protegida às credenciais.
- **Associação ao agente (Agent Tool Binding):** habilitação de uma ferramenta para um agente, incluindo configuração permitida e referência à operação/conexão quando aplicável.
- **Versão publicada:** snapshot imutável das ferramentas habilitadas e suas configurações não secretas.

Ferramenta e integração não são sinônimos. Uma ferramenta pode ser nativa da Vozly ou delegar sua execução a uma operação de integração. Um conector disponibiliza operações; ele não deve ser exposto diretamente ao modelo como uma capacidade irrestrita.

## 2. Catálogo inicial

### 2.1 Ferramentas nativas

| Chave sugerida | Nome | Responsabilidade | Observações |
|---|---|---|---|
| `knowledge.search` | Consultar conhecimento | Recuperar conteúdo autorizado associado ao agente | Sem acesso a dados externos arbitrários |
| `conversation.collect` | Coletar informações | Validar e registrar campos estruturados da conversa | Campos definidos pelo produto/configuração permitida |
| `call.transfer` | Transferir atendimento | Solicitar transferência para destino previamente configurado | Depende de suporte do provedor de telefonia |
| `call.request_callback` | Solicitar retorno | Registrar solicitação de retorno para tratamento posterior | Não significa iniciar chamada de saída automaticamente |
| `call.end` | Encerrar atendimento | Encerrar a chamada conforme estado do runtime | Execução controlada pelo runtime |

Essas chaves são identificadores estáveis sugeridos. Nomes de exibição e descrições podem ser localizados sem alterar a chave.

A disponibilidade de `call.transfer` depende de capacidade confirmada do provedor. A solicitação de retorno registra uma intenção/tarefa; discagem automática fica fora do contrato inicial.

### 2.2 Conectores externos

| Chave sugerida | Nome | Responsabilidade |
|---|---|---|
| `http.rest` | API REST | Executar operações HTTP explicitamente cadastradas e validadas |
| `http.webhook` | Webhook de saída | Enviar eventos selecionados para um endpoint autorizado |

Não há, nesta etapa, integração nativa prometida com fornecedores específicos. O conector REST não equivale a compatibilidade universal: cada operação precisa ser configurada dentro dos limites e validações da Vozly.

## 3. Contratos do catálogo

### 3.1 Definição de ferramenta

Uma definição de ferramenta é um recurso administrado pela Vozly, versionado e disponibilizado para descoberta.

Campos conceituais:
- `id`: identificador interno.
- `key`: chave estável e única, por exemplo `knowledge.search`.
- `name` e `description`: conteúdo apresentado ao cliente e/ou runtime.
- `implementation_type`: `NATIVE` ou `INTEGRATION_OPERATION`.
- `input_schema`: schema JSON validado no servidor.
- `output_schema`: formato de resultado esperado.
- `permission_policy`: permissões e condições exigidas.
- `risk_level`: classificação para controles adicionais.
- `timeout_ms`: limite de execução definido pela plataforma.
- `status`: `ACTIVE` ou `DEPRECATED`.
- `definition_version`: versão da definição.

Definições não são editáveis pelo tenant. Uma mudança incompatível gera nova versão ou nova chave, com estratégia de migração explícita.

### 3.2 Definição de integração

Uma definição de integração descreve um conector mantido pela Vozly:
- `key`, `name`, `description`, `version`;
- `configuration_schema`: campos não secretos de configuração;
- `credential_schema`: tipo de credencial aceita, sem valores;
- `capabilities`: capacidades suportadas pelo adaptador;
- `status`: disponibilidade do conector.

O cliente não altera o código ou o comportamento interno do conector.

### 3.3 Operação de integração

Uma operação representa uma ação específica permitida pelo conector:
- `id`, `integration_key`, `key`, `name`, `description`;
- método HTTP permitido;
- rota relativa e parâmetros permitidos;
- `input_schema` e mapeamento validado para a requisição;
- `output_schema` e regras de extração/normalização;
- política de autenticação por referência à conexão;
- timeout, limites de payload e política de repetição;
- classificação de efeito: `READ_ONLY` ou `SIDE_EFFECT`;
- versão e estado.

No MVP, o cliente pode configurar operações dentro de um formulário/contrato restrito. Não pode fornecer código para transformar requisições ou respostas.

### 3.4 Conexão por tenant

Uma conexão pertence a exatamente um tenant:
- `id`, `tenant_id`, `integration_key`;
- `display_name`;
- `status`: `DRAFT`, `PENDING_VALIDATION`, `CONNECTED`, `ERROR`, `REVOKED`;
- `configuration`: metadados não sensíveis;
- `secret_reference`: referência opaca ao segredo armazenado em serviço seguro;
- `last_validated_at`, `last_error_code` e timestamps.

O valor secreto nunca é retornado em respostas de API. A API pode retornar somente indicadores como `credential_configured: true`, tipo de autenticação e data da última atualização.

### 3.5 Associação de ferramenta ao agente

A associação representa a habilitação de uma capacidade em um agente:
- `id`, `tenant_id`, `agent_id`, `tool_key`;
- `enabled`;
- `configuration`: somente parâmetros permitidos pelo schema;
- `integration_connection_id` e `integration_operation_id`, quando a ferramenta depender de integração;
- limites e permissões adicionais permitidos;
- timestamps.

Toda referência deve pertencer ao mesmo tenant do agente. O servidor valida isso em cada gravação e novamente no momento da execução.

## 4. Contratos de entrada e saída

Os schemas de entrada e saída usam JSON Schema (versão a ser padronizada na implementação). Regras:
- tipos explícitos e campos obrigatórios;
- limites de tamanho e enumerações;
- rejeição de propriedades desconhecidas, salvo extensão explicitamente prevista;
- validação server-side antes de persistir e antes de executar;
- nenhuma expressão executável, template de código ou SQL;
- mensagens de erro sem credenciais ou dados sensíveis.

O modelo recebe somente o nome, descrição e schema necessários para solicitar uma ferramenta habilitada. Não recebe URL secreta, token, chave, cabeçalho de autenticação ou configuração interna do adaptador.

Resultado normalizado de execução deve conter:
- `execution_id`;
- `status`;
- `result` conforme schema público;
- `error_code` e mensagem segura quando houver falha;
- metadados mínimos de duração/correlação, quando úteis.

Não retornar stack trace, cabeçalhos sensíveis ou resposta externa bruta sem filtragem.

## 5. Fluxo de configuração e execução

### 5.1 Configuração no painel

1. Angular solicita os catálogos ativos.
2. Usuário seleciona uma ferramenta e/ou conector.
3. Angular apresenta formulário derivado dos schemas e metadados públicos.
4. Spring Boot valida usuário, membership, tenant e permissões.
5. Configuração não secreta é persistida em PostgreSQL.
6. Credenciais são encaminhadas ao serviço de segredos e apenas a referência é persistida.
7. Backend valida conexão/operação e registra o resultado.
8. A ferramenta pode ser associada ao agente em rascunho.

O frontend pode melhorar a experiência com validação antecipada, mas nunca substitui a validação do backend.

### 5.2 Teste

O teste deve indicar claramente se é uma verificação de conectividade ou uma execução funcional.

- Teste de conexão não deve produzir efeitos colaterais.
- Operações `SIDE_EFFECT` exigem modo de teste seguro, sandbox do sistema externo ou confirmação explícita do usuário antes de executar uma ação real.
- O resultado deve ser sanitizado.
- Testes possuem timeout, limites de frequência e auditoria.
- O estado `CONNECTED` significa que a verificação definida para aquela conexão passou; não garante disponibilidade permanente.

### 5.3 Publicação

Antes de publicar, o backend verifica:
- definição ativa e versão compatível;
- schema e configuração válidos;
- associação ao agente pertencente ao tenant;
- conexão não revogada e validada, quando necessária;
- permissões e limites definidos;
- pré-requisitos do runtime.

A publicação gera snapshot imutável com as chaves/versões das definições, configurações não secretas e referências às conexões autorizadas. Segredos não são copiados para o snapshot.

Alterações posteriores são feitas em rascunho e só entram em vigor após nova publicação. Cada chamada mantém referência à versão utilizada.

### 5.4 Execução durante a chamada

1. Runtime disponibiliza ao modelo somente ferramentas habilitadas na versão ativa.
2. Modelo solicita uma ferramenta com argumentos estruturados.
3. Backend resolve chamada, tenant, agente e versão a partir do contexto confiável do runtime.
4. Backend valida se a ferramenta pertence à versão e se está habilitada.
5. Valida schema, autorização, limites, regras de negócio e idempotência.
6. Adaptador autorizado recupera segredo pela referência protegida e executa a operação.
7. Resultado é sanitizado, registrado e devolvido ao runtime.
8. Modelo formula a resposta usando o resultado confirmado.

O modelo não escolhe tenant, conexão, credencial, host arbitrário ou política de autorização. O runtime não deve aceitar como prova de sucesso uma afirmação do modelo: somente o resultado do backend confirma a execução.

## 6. Contratos REST administrativos sugeridos

Os caminhos abaixo são uma proposta de interface, não endpoints já implementados. Todas as rotas exigem autenticação e autorização contextual por tenant.

| Método e rota | Finalidade |
|---|---|
| `GET /api/v1/catalog/tools` | Listar ferramentas disponíveis |
| `GET /api/v1/catalog/integrations` | Listar conectores disponíveis |
| `GET /api/v1/catalog/integrations/{key}/operations` | Listar operações permitidas de um conector |
| `GET /api/v1/integration-connections` | Listar conexões do tenant sem segredos |
| `POST /api/v1/integration-connections` | Criar conexão e receber credencial uma única vez |
| `POST /api/v1/integration-connections/{id}/validate` | Validar conexão |
| `POST /api/v1/integration-connections/{id}/rotate-credentials` | Substituir credencial sem revelar a anterior |
| `POST /api/v1/integration-connections/{id}/revoke` | Revogar conexão |
| `GET /api/v1/agents/{agentId}/tools` | Listar ferramentas associadas ao agente |
| `PUT /api/v1/agents/{agentId}/tools/{toolKey}` | Habilitar/configurar associação |
| `DELETE /api/v1/agents/{agentId}/tools/{toolKey}` | Remover associação do rascunho |
| `POST /api/v1/agents/{agentId}/tools/{toolKey}/test` | Executar teste controlado da configuração |

As rotas de publicação permanecem sob o módulo Agents e devem validar o conjunto completo do snapshot. A API administrativa não deve expor endpoint genérico que permita ao usuário enviar URL e método arbitrários para execução imediata.

### Convenções de resposta

- Listagens retornam definições públicas e paginação quando necessário.
- Criação/atualização retorna estado e metadados não sensíveis.
- Segredos nunca são incluídos em GET, listagens, erros ou respostas de teste.
- Erros usam códigos estáveis e mensagens acionáveis, sem detalhes internos.
- Operações mutáveis devem considerar idempotência e concorrência otimista quando aplicável.

## 7. Segurança específica do conector HTTP

O adaptador REST/webhook precisa impedir que a flexibilidade do conector se transforme em acesso irrestrito:

- HTTPS obrigatório em produção, salvo exceção interna documentada.
- Bloquear loopback, link-local, endereços privados e endpoints de metadata; resolver e validar DNS/IP para mitigar SSRF e revalidar redirecionamentos.
- Não permitir que o modelo forneça ou altere host, URL completa, cabeçalhos ou autenticação.
- Restringir métodos, portas, tamanho de payload, timeout e quantidade de redirecionamentos.
- Não encaminhar credenciais para hosts diferentes do destino validado.
- Redigir tokens, cookies, cabeçalhos e campos sensíveis dos logs.
- Validar assinatura e origem de webhooks recebidos quando esse recurso for introduzido.
- Aplicar rate limit, circuit breaker e limites de concorrência por tenant/conexão.
- Definir política de repetição somente para operações seguras/idempotentes.
- Para ações com efeito colateral, usar chave de idempotência quando suportada e registrar o resultado.

A implementação deve tratar explicitamente DNS rebinding, redirecionamentos para redes internas, abuso de proxy e exfiltração por mensagens de erro.

## 8. Modelo conceitual no PostgreSQL

Entidades sugeridas:

| Entidade | Responsabilidade |
|---|---|
| `ToolDefinition` | Definição versionada de capacidade nativa ou delegada |
| `IntegrationDefinition` | Tipo de conector mantido pela Vozly |
| `IntegrationOperationDefinition` | Operações permitidas por conector |
| `IntegrationConnection` | Conexão configurada por tenant |
| `AgentToolBinding` | Ferramenta habilitada e configurada no agente |
| `ToolExecution` | Registro de tentativa, resultado e estado de execução |
| `AuditEvent` | Registro de alterações e ações relevantes |

Regras de integridade:
- Recursos configurados possuem `tenant_id` ou vínculo verificável com um recurso do tenant.
- Constraints e consultas impedem associações cruzadas entre tenants.
- IDs não substituem autorização.
- `ToolExecution` referencia chamada, versão do agente, ferramenta e tenant.
- Definições publicadas são versionadas e não sobrescritas.
- Credenciais ficam fora das tabelas de configuração comuns; PostgreSQL armazena apenas referência opaca ao cofre/serviço de segredos.
- Configurações e snapshots guardam somente dados não secretos.

O schema físico, índices, constraints e estratégia de criptografia serão definidos em uma etapa de implementação própria.

## 9. Responsabilidades por camada

### Spring Boot
- Autenticação, autorização e resolução de tenant.
- Catálogos e serviços de aplicação.
- Validação de schemas e regras de negócio.
- Persistência e versionamento.
- Gestão segura de referências de credenciais.
- Orquestração de adaptadores.
- Auditoria, idempotência, limites e tratamento de falhas.
- Validação de publicação.

### PostgreSQL
- Fonte de verdade de definições versionadas, conexões (metadados), associações, snapshots e auditoria.
- Integridade referencial e isolamento lógico por tenant.
- Não armazenar segredos em texto puro.

### Angular
- Descobrir e apresentar catálogos.
- Renderizar formulários a partir de schemas públicos.
- Mostrar estados, validações e erros acionáveis.
- Enviar configuração e credenciais somente nos fluxos apropriados.
- Nunca armazenar ou exibir novamente segredos.
- Não decidir autorização nem considerar validação local como suficiente.

### Runtime e adaptadores
- Expor ao modelo apenas ferramentas autorizadas na versão publicada.
- Validar contexto e argumentos por meio dos serviços backend.
- Executar implementações nativas ou adaptadores controlados.
- Normalizar resultados e registrar correlação/auditoria.
- Não dar ao LLM acesso direto a banco, rede, credenciais ou código.

## 10. Estados sugeridos

### Conexão
`DRAFT` → `PENDING_VALIDATION` → `CONNECTED`; falhas levam a `ERROR`; revogação leva a `REVOKED`.

### Associação de ferramenta
`DISABLED`, `CONFIGURATION_REQUIRED`, `READY`, `INVALID`. O estado `READY` não substitui validação na publicação nem autorização em runtime.

### Execução
`REQUESTED`, `VALIDATING`, `RUNNING`, `SUCCEEDED`, `FAILED`, `TIMED_OUT`, `REJECTED`, `CANCELLED`.

Transições e estados terminais devem ser implementados de forma explícita. Uma falha externa nunca deve ser convertida em sucesso presumido.

## 11. Decisões pendentes

- Versão exata do JSON Schema e biblioteca de validação.
- Serviço de secrets/KMS e política de rotação.
- Modelo de autenticação suportado inicialmente pelo conector REST.
- Limites iniciais de timeout, payload, taxa e concorrência.
- Como o usuário define operações REST sem criar URLs arbitrárias.
- Modo de teste/sandbox para operações com efeitos colaterais.
- Política de retenção de payloads e dados pessoais em auditoria.
- Dependências de transferência e encerramento no provedor de telefonia.

Essas decisões devem ser fechadas antes de expor os conectores a clientes em produção.

## 12. Fora do escopo

- Integrações nativas com CRM/ERP específicos.
- Marketplace público de conectores.
- Código, scripts, SQL ou plugins arbitrários fornecidos pelo cliente.
- Execução de chamadas HTTP escolhidas livremente pelo modelo.
- Construtor visual avançado de fluxos.
- Campanhas de chamadas de saída.
- Implementação de endpoints, tabelas ou componentes nesta etapa documental.
