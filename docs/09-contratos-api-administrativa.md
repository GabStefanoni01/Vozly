# Contratos da API administrativa

> Contrato administrativo da Vozly. Os endpoints identificados como implementados refletem o backend atual; os demais recursos continuam como propostas. A descrição OpenAPI deverá ser mantida junto da implementação e validada em CI.

## 1. Escopo e separação

A API administrativa atende painel, onboarding e gestão do tenant. Não é o transporte do áudio em tempo real.

- Base proposta: `/api/v1`.
- JSON UTF-8 para requests e responses administrativas.
- HTTPS obrigatório fora de desenvolvimento local.
- Identificadores opacos; cliente não escolhe o tenant de um recurso por confiar em IDs.
- Operações demoradas retornam recurso de operação/status ou evento assíncrono, sem manter request HTTP aberto indefinidamente.
- Webhooks de provedores e canais de runtime usam endpoints próprios, autenticação e validação de assinatura.

## 2. Convenções

### 2.1 Envelope

Responses de recurso podem retornar o objeto diretamente. Coleções usam envelope:

```json
{
  "data": [],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 0,
    "totalPages": 0
  }
}
```

Paginação padrão: `page=0`, `size=20`; limite máximo proposto: 100. Ordenação deve aceitar apenas campos allowlisted, por exemplo `sort=createdAt,desc`.

### 2.2 Erros

Adotar Problem Details (RFC 9457) ou envelope equivalente padronizado. Proposta:

```json
{
  "type": "https://api.vozly.example/problems/validation-error",
  "title": "Validation failed",
  "status": 422,
  "detail": "One or more fields are invalid.",
  "code": "VALIDATION_ERROR",
  "traceId": "01J...",
  "errors": [
    { "field": "name", "code": "REQUIRED", "message": "Name is required." }
  ]
}
```

Não incluir stack trace, SQL, segredo, conteúdo sensível ou informação que confirme recurso de outro tenant.

Códigos HTTP:
- 400: request malformado ou falha de validação dos campos (inclui `VALIDATION_ERROR`).
- 401: ausência/invalidade de autenticação.
- 403: identidade autenticada sem permissão.
- 404: recurso inexistente ou fora do escopo visível do tenant.
- 409: conflito de estado, duplicidade ou versão concorrente (inclui `EMAIL_ALREADY_REGISTERED`, `ACCOUNT_LINK_REQUIRED` e `RESOURCE_CONFLICT`).
- 422: conteúdo sintaticamente válido, mas inválido nas regras de domínio.
- 429: limite de requisições excedido.
- 500: falha inesperada sem detalhes internos.
- 502/503/504: falha/indisponibilidade/timeout de dependência quando aplicável.

## 3. Autenticação, tenant e autorização

A autenticação atual utiliza access JWT e refresh token rotativo em cookie HttpOnly. O backend valida a identidade e deriva o tenant e o papel a partir dos dados assinados no token, emitido após validar uma membership ativa.

Endpoints implementados:
- `GET /api/v1/auth/csrf`: fornece token CSRF para operações protegidas por cookie.
- `POST /api/v1/auth/register`: recebe `name`, `email`, `password` e `workspaceName`; cria usuário, workspace e membership `OWNER`, e inicia sessão. Retorna access token e define cookie de refresh.
- `POST /api/v1/auth/login`: autentica e inicia sessão.
- `POST /api/v1/auth/refresh`: rotaciona refresh token e emite novo access token.
- `POST /api/v1/auth/logout`: revoga o refresh token e limpa o cookie.
- `POST /api/v1/auth/password/forgot`: solicita recuperação; sempre responde `202` com mensagem genérica para não revelar se o e-mail existe.
- `POST /api/v1/auth/password/reset`: recebe `token` e `newPassword`; consome o token de uso único e atualiza a senha.
- `GET /api/v1/auth/me`: retorna `userId`, `tenantId`, `role`, `name` e `email` para a identidade autenticada.
- `GET /api/v1/tenants/current`: retorna o workspace associado ao tenant do JWT.

Regras do produto:
- Cada usuário pertence a exatamente um workspace. A migration V6 impõe unicidade por `memberships.user_id`.
- Um workspace pode ter vários usuários, cada um com sua própria membership e papel.
- O cadastro local exige senha entre 12 e 128 caracteres e normaliza o e-mail.
- O refresh token é armazenado no banco somente como hash; o cookie é HttpOnly, SameSite Strict e Secure conforme configuração. Access token tem validade de 10 minutos e não é persistido no localStorage.
- Nunca aceitar papel, user_id ou tenant_id do cliente como prova de autorização.
- Recuperação: token aleatório de 256 bits, persistido somente como SHA-256, válido por 30 minutos e de uso único. Ao concluir, todos os refresh tokens do usuário são revogados. O access JWT já emitido pode permanecer válido até seu vencimento (10 minutos).
- Recuperação de senha implementada com e-mail SMTP; configurar `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_AUTH`, `SMTP_STARTTLS`, `PASSWORD_RESET_FROM` e `FRONTEND_URL` no ambiente.

### Matriz inicial de permissões

| Capacidade | OWNER | ADMIN | OPERATOR |
|---|---:|---:|---:|
| Ver workspace e onboarding | Sim | Sim | Sim |
| Gerenciar membros e convites | Sim | Sim | Não |
| Alterar dados gerais do workspace | Sim | Sim | Não |
| Criar/editar agentes em rascunho | Sim | Sim | Conforme política; inicialmente não |
| Configurar conhecimento | Sim | Sim | Leitura |
| Configurar conexões e credenciais | Sim | Sim | Não |
| Habilitar ferramentas e operações | Sim | Sim | Não |
| Testar configuração | Sim | Sim | Conforme política; inicialmente leitura |
| Publicar/pausar agente | Sim | Sim | Não |
| Consultar chamadas e histórico | Sim | Sim | Sim, com dados minimizados |
| Consultar consumo agregado | Sim | Sim | Conforme política |
| Excluir workspace/transferir ownership | Sim, com confirmação reforçada | Não | Não |

A matriz é uma política inicial para revisão. Permissões finas podem ser introduzidas sem depender apenas do nome do papel. Deve existir exatamente um owner ativo ou processo explícito de transferência/recuperação de ownership.

## 4. Recursos e operações propostas

| Recurso | Operações principais | Observações |
|---|---|---|
| Sessão/identidade | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me` | Implementado; inclui recuperação por e-mail, token temporário de uso único e revogação dos refresh tokens. |
| Tenants | `GET /api/v1/tenants/current` | Leitura do workspace atual implementada. Cadastro cria um workspace por usuário; gestão/edição do workspace permanece pendente. |
| Membros | `GET/POST /tenants/current/members`, `PATCH/DELETE /members/{id}` | Convites e alteração de papéis somente admin. |
| Onboarding | `GET /onboarding`, `PATCH /onboarding` | Progresso informativo; backend valida pré-requisitos reais. |
| Agentes | `GET/POST /agents`, `GET/PATCH /agents/{id}`, `POST /agents/{id}/archive` | Alterações em draft não mudam versão publicada em uso. |
| Versões | `GET /agents/{id}/versions`, `POST /agents/{id}/publish`, `POST /agents/{id}/rollback` | Rollback aponta para versão anterior; não altera snapshot. |
| Conhecimento | `GET/POST /knowledge-items`, `GET/PATCH/DELETE /knowledge-items/{id}` | Validação de conteúdo e escopo tenant. |
| Catálogo | `GET /catalog/tools`, `GET /catalog/integrations` | Somente definições publicadas e suportadas. |
| Bindings | `GET/POST /agents/{id}/tools`, `PATCH/DELETE /agents/{id}/tools/{bindingId}` | Apenas ferramentas e operações autorizadas. |
| Conexões | `GET/POST /integration-connections`, `POST /integration-connections/{id}/validate`, `POST /integration-connections/{id}/rotate-secret` | Nunca retornar segredo após gravação. |
| Testes | `POST /agents/{id}/test-sessions`, `GET /test-sessions/{id}` | Ambiente de teste isolado; não executar ações reais sem autorização explícita. |
| Telefonia | `GET/POST /phone-numbers`, `PATCH /phone-numbers/{id}` | Disponibilidade depende de provedor selecionado. |
| Chamadas | `GET /calls`, `GET /calls/{id}`, `GET /calls/{id}/messages` | Acesso e retenção respeitam política de dados. |
| Uso | `GET /usage/summary`, `GET /usage/records` | Métricas operacionais; não implica faturamento final. |

Os caminhos são ilustrativos e podem ser ajustados antes da implementação. A lista não afirma que qualquer rota já exista.

## 5. Exemplos de contratos

### 5.1 Criar agente

`POST /api/v1/agents`

```json
{
  "name": "Atendimento principal",
  "description": "Agente de atendimento",
  "language": "pt-BR"
}
```

Resposta `201 Created`:

```json
{
  "id": "0192f6e0-8d5b-7c11-a000-123456789abc",
  "name": "Atendimento principal",
  "description": "Agente de atendimento",
  "status": "DRAFT",
  "draftRevision": 1,
  "publishedVersion": null,
  "createdAt": "2026-11-09T18:00:00Z"
}
```

O tenant é derivado do contexto autorizado, não do body.

### 5.2 Atualizar configuração em rascunho

`PATCH /api/v1/agents/{agentId}`

```json
{
  "name": "Atendimento principal",
  "instructions": "Cumprimente a pessoa e identifique como pode ajudar.",
  "behavior": {
    "openingMessage": "Olá! Como posso ajudar?",
    "fallbackMessage": "Não consegui concluir essa solicitação.",
    "transferPolicy": { "enabled": true }
  },
  "expectedRevision": 4
}
```

Resposta `200 OK` retorna a nova revisão. `expectedRevision` previne sobrescrita silenciosa; conflito retorna `409 REVISION_CONFLICT`.

### 5.3 Configurar uma conexão

`POST /api/v1/integration-connections`

```json
{
  "integrationKey": "rest-api",
  "name": "Sistema corporativo",
  "configuration": {
    "baseUrl": "https://api.example.com",
    "authentication": {
      "type": "BEARER_TOKEN",
      "secret": "valor-enviado-apenas-nesta-operacao"
    }
  }
}
```

Resposta `201 Created`:

```json
{
  "id": "0192f6e0-8d5b-7c11-a000-123456789abd",
  "name": "Sistema corporativo",
  "integrationKey": "rest-api",
  "status": "PENDING_VALIDATION",
  "secretConfigured": true,
  "createdAt": "2026-11-09T18:05:00Z"
}
```

O campo `secretConfigured` é apenas indicador. Segredo não retorna em GET, PATCH, logs, erros ou exportação de configuração. Validação de URL deve bloquear destinos privados/internos e revalidar DNS/redirects para mitigar SSRF.

### 5.4 Publicar agente

`POST /api/v1/agents/{agentId}/publish`

```json
{
  "expectedDraftRevision": 5
}
```

Resposta `202 Accepted` se publicação for processada assincronamente:

```json
{
  "operationId": "0192f6e0-8d5b-7c11-a000-123456789abe",
  "status": "QUEUED",
  "statusUrl": "/api/v1/operations/0192f6e0-8d5b-7c11-a000-123456789abe"
}
```

A publicação só conclui após validar dependências, schemas, conexões necessárias, permissões e regras. A versão publicada é imutável e recebe identificador próprio.

## 6. Idempotência, concorrência e operações assíncronas

- Operações de criação com risco de repetição (convites, provisionamento, publicação, solicitações externas) devem aceitar `Idempotency-Key` e armazenar resultado por escopo/tenant e janela definida.
- PATCH de recursos editáveis deve usar revisão/ETag ou `expectedRevision`.
- Publicação, validação de conexão e provisionamento de número podem retornar `202` e um recurso de operação consultável.
- Callbacks de provedores devem ser idempotentes por identificador externo e tipo de evento.
- Timeout do cliente não significa falha da operação: consultar status por operationId antes de repetir ação não idempotente.

## 7. Segurança dos conectores REST e webhook

- Métodos HTTP, hosts, paths e operações são explicitamente configurados e allowlisted.
- Bloquear loopback, redes privadas, link-local, metadata endpoints, DNS rebinding e redirects para destinos não permitidos.
- Validar TLS e certificados; nunca permitir desativação em produção.
- Aplicar timeout, limite de payload, rate limit, limite de resposta e circuit breaker.
- Credenciais injetadas somente no adaptador de integração; nunca disponibilizadas ao modelo.
- Sanitizar outputs e limitar campos enviados ao contexto do agente.
- Webhooks devem usar assinatura/HMAC, timestamp, proteção contra replay e segredo rotacionável.
- Não aceitar URL livre escolhida pelo modelo.

## 8. Contrato Angular ↔ backend

- DTOs administrativos são independentes das entidades JPA.
- Frontend usa enums e contratos gerados a partir de OpenAPI quando disponível; não replica regras de autorização.
- Backend é autoridade final para validação e estado.
- Mensagens de erro devem ser estáveis por `code`; texto pode ser localizado no frontend.
- Nunca confiar em controles ocultos/desabilitados na interface como barreira de segurança.
- Alterações incompatíveis devem exigir nova versão de API ou estratégia de depreciação.

## 9. Decisões pendentes

- Provedor e fluxo de autenticação.
- Convenção final de envelope e adoção formal de RFC 9457.
- Política de versionamento e geração de OpenAPI.
- Estratégia de upload e processamento de documentos.
- Quais ações de teste podem atingir sistemas reais e qual confirmação será exigida.
- Se OPERATOR poderá editar agentes ou iniciar sessões de teste.

## 10. Critério para implementação

Antes de codificar um recurso, revisar o contrato com frontend e backend, registrar exemplos em OpenAPI, mapear autorização, definir erros e criar testes de contrato. Não considerar os exemplos deste documento como rotas implementadas.
