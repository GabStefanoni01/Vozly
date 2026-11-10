# Vozly Backend

Backend do Vozly, construído como monólito modular com Java 21 e Spring Boot 4.1.2.

## Pré-requisitos

- JDK 21.
- Maven 3.6.3 ou superior.
- PostgreSQL (Neon ou local) para o profile `local`.

## Configuração

Ative o profile `local` explicitamente no desenvolvimento (`SPRING_PROFILES_ACTIVE=local`). Sem esse profile, o backend exige configuração explícita de banco, JWT, origem do frontend e credenciais Microsoft. O Spring Boot não carrega arquivos `.env` automaticamente: exporte as variáveis no terminal ou use um carregador de ambiente local. Nunca versione `.env` nem credenciais reais.

| Variável | Descrição |
|---|---|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | Conexão PostgreSQL |
| `DB_POOL_MAX_SIZE`, `DB_POOL_MIN_IDLE` | Pool JDBC |
| `PORT` | Porta HTTP |
| `VOZLY_JWT_SECRET` | Segredo HMAC com pelo menos 32 bytes |
| `VOZLY_JWT_ISSUER`, `VOZLY_JWT_AUDIENCE` | Validação de emissor e audiência dos JWTs |
| `COOKIE_SECURE` | Use `true` em HTTPS; `false` somente no desenvolvimento HTTP local |
| `FRONTEND_URL` | Origem/base explícita do frontend e allowlist CORS; obrigatória fora do profile local |\n| `RATE_LIMIT_LOGIN_MAX`, `RATE_LIMIT_LOGIN_WINDOW` | Limite e janela de login (padrão: 10 tentativas/900 s) |\n| `RATE_LIMIT_REGISTER_MAX`, `RATE_LIMIT_REGISTER_WINDOW` | Limite e janela de cadastro (padrão: 5 tentativas/3600 s) |\n| `RATE_LIMIT_INTEREST_MAX`, `RATE_LIMIT_INTEREST_WINDOW` | Limite e janela de interesse (padrão: 5 tentativas/3600 s) |\n| `RATE_LIMIT_REFRESH_MAX`, `RATE_LIMIT_REFRESH_WINDOW` | Limite e janela de refresh (padrão: 30 tentativas/900 s) |
| `MICROSOFT_TENANT_ID` | `organizations` para contas corporativas ou o tenant GUID específico |
| `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` | Credenciais do aplicativo Microsoft Entra ID |
| `RATE_LIMIT_LOGIN_MAX`, `RATE_LIMIT_LOGIN_WINDOW` | Limite de login (padrão: 10 tentativas / 15 min) |
| `RATE_LIMIT_REGISTER_MAX`, `RATE_LIMIT_REGISTER_WINDOW` | Limite de cadastro (padrão: 5 / hora) |
| `RATE_LIMIT_REFRESH_MAX`, `RATE_LIMIT_REFRESH_WINDOW` | Limite de refresh (padrão: 30 / 15 min) |
| `RATE_LIMIT_INTEREST_MAX`, `RATE_LIMIT_INTEREST_WINDOW` | Limite de interesse (padrão: 5 / hora) |

### Microsoft Entra ID

Crie um registro de aplicativo no Microsoft Entra admin center, habilite o fluxo de autorização OpenID Connect e cadastre como redirect URI de plataforma Web:

`http://localhost:8080/login/oauth2/code/microsoft`

Em produção, cadastre também a URL HTTPS correspondente. Configure Client ID, Client Secret e Tenant ID somente por variáveis de ambiente. A implementação valida assinatura/audience do ID token pelo suporte OIDC e confere o issuer tenant-specific antes de criar/vincular a identidade.

O fluxo atual cria uma conta Vozly e um workspace OWNER para uma identidade Microsoft ainda desconhecida. Não associa automaticamente uma identidade Microsoft a uma conta local existente apenas porque os e-mails coincidem; o vínculo seguro de contas existentes exige autenticação prévia e será tratado em fluxo próprio.

## Endpoints de autenticação

Base: `/api/v1/auth`.

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/register` | Cria usuário, workspace e membership OWNER |
| POST | `/login` | Autentica e-mail/senha |
| POST | `/refresh` | Rotaciona refresh token via cookie HttpOnly |
| POST | `/logout` | Revoga a sessão e limpa cookie |
| GET | `/me` | Retorna identidade e workspace do JWT |

Microsoft SSO: iniciar em `GET /oauth2/authorization/microsoft`. Após autenticação, o backend grava refresh token em cookie HttpOnly e redireciona para `{FRONTEND_URL}/auth/sso/callback`. O frontend busca `GET /api/v1/auth/csrf` antes de login, cadastro, refresh e logout e envia o token retornado no header `X-XSRF-TOKEN`, com `credentials: include`. O endpoint público de interesse é isento de CSRF porque não usa a sessão de autenticação. Tokens não são enviados em query string.

O access token dura 10 minutos. O refresh token é opaco, tem validade de 30 dias, é armazenado somente como SHA-256 no banco e sofre rotação a cada uso. O cookie usa HttpOnly, SameSite=Strict e Secure conforme `COOKIE_SECURE`.

O endpoint de cadastro de conta aceita exclusivamente os campos abaixo em `POST /api/v1/auth/register`:

```json
{
  "name": "Nome da pessoa",
  "email": "pessoa@empresa.com",
  "password": "senha-com-12-caracteres-ou-mais",
  "workspaceName": "Minha empresa"
}
```

A resposta inclui access token e define o refresh token em cookie HttpOnly. Os limites de tamanho e validações são definidos pelo DTO `RegisterRequest` no backend.

## Registro de interesse da landing page

O formulário atual do modal envia os mesmos três campos apresentados na interface:

`POST /api/v1/interests`

Request:

```json
{
  "company": "Empresa Exemplo",
  "segment": "assistencia",
  "email": "contato@empresa.com"
}
```

Valores de `segment` aceitos, correspondentes às opções do Angular: `assistencia`, `clinica`, `oficina`, `manutencao`, `servicos` e `outros`.

Resposta `201 Created`:

```json
{
  "id": "uuid",
  "status": "RECEIVED"
}
```

A solicitação é armazenada em `vozly.interest_submissions`. O endpoint é público porque é utilizado na landing page antes da autenticação. Ele não cria usuário/workspace, não dispara e-mail e não promete contato automático.

## Persistência

Flyway cria o schema `vozly` e aplica migrations versionadas. A migration V2 cria usuários, tenants, memberships, identidades externas e sessões de refresh token. Cadastro de conta cria usuário, tenant e membership OWNER na mesma transação. A migration V3 cria a tabela de solicitações de interesse. A migration V4 cria buckets de rate limit no PostgreSQL, compartilhados entre instâncias do backend. A migration V4 cria buckets de rate limit no PostgreSQL, compartilhados entre instâncias do backend. A migration V4 cria os buckets persistentes de rate limiting, com limpeza oportunista de janelas antigas.

## Executar e testar

Na pasta `backend/`:

```bash
mvn test
mvn spring-boot:run
```

O profile de teste usa H2 em memória. Para executar localmente contra Neon, configure as variáveis `DB_*` com os dados fornecidos pelo painel Neon e mantenha SSL habilitado na JDBC URL.

## Health check

- `GET /actuator/health`
- `GET /actuator/health/liveness`
- `GET /actuator/health/readiness`

## Módulos

`identity`, `tenants`, `agents`, `knowledge`, `integrations`, `tools`, `telephony`, `voice`, `conversations`, `usage` e `audit`.

## Limitações conhecidas desta primeira entrega

- Recuperação de senha, MFA e vínculo manual de uma conta local com Microsoft ainda não estão incluídos.
- O primeiro tenant de uma conta é selecionado no login local; seleção/troca de workspace será implementada junto ao módulo de memberships.
- Login, cadastro, refresh e interesse possuem rate limiting por IP persistido no PostgreSQL, compartilhado entre instâncias. O limite excedido retorna HTTP 429. O endereço é obtido de `request.getRemoteAddr()`; `X-Forwarded-For` não é confiável sem configuração explícita de proxy confiável.
- O frontend mantém o access token somente em memória; ao recarregar a página, a próxima consulta autenticada deve renovar a sessão com o refresh cookie.
- Configure HTTPS e `COOKIE_SECURE=true` em qualquer ambiente publicado. O profile local é o único que contém valores de desenvolvimento para JWT e Microsoft; não o ative em produção.


## Desenvolvimento local — autenticação e CORS

Inicie o backend com `SPRING_PROFILES_ACTIVE=local`. Com esse perfil, o backend aceita o frontend em `http://localhost:4200` (configurável por `FRONTEND_URL`) e define `COOKIE_SECURE=false` por padrão para permitir cookies HTTP em localhost. Em produção, mantenha cookies Secure habilitados e use HTTPS.

Para habilitar Microsoft Entra ID localmente, configure `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` e `MICROSOFT_TENANT_ID`. Cadastre no aplicativo Entra ID o redirect URI do backend: `http://localhost:8080/login/oauth2/code/microsoft`. O callback da aplicação é `http://localhost:4200/auth/sso/callback`.

O frontend chama a API local em `http://localhost:8080`; essa URL pode ser alterada em `frontend/src/environments/environment.ts`. Não é necessário hospedar os serviços para validar os fluxos localmente.
