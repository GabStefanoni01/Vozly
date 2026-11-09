# Vozly Backend

Backend do Vozly, construído como monólito modular com Java 21 e Spring Boot 4.1.2.

## Pré-requisitos

- JDK 21.
- Maven 3.6.3 ou superior.
- PostgreSQL (Neon ou local) para o profile `local`.

## Configuração

O profile padrão é `local`. O Spring Boot não carrega arquivos `.env` automaticamente: exporte as variáveis no terminal ou use um carregador de ambiente local. Nunca versione `.env` nem credenciais reais.

| Variável | Descrição |
|---|---|
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | Conexão PostgreSQL |
| `DB_POOL_MAX_SIZE`, `DB_POOL_MIN_IDLE` | Pool JDBC |
| `PORT` | Porta HTTP |
| `VOZLY_JWT_SECRET` | Segredo HMAC com pelo menos 32 bytes |
| `VOZLY_JWT_ISSUER`, `VOZLY_JWT_AUDIENCE` | Validação de emissor e audiência dos JWTs |
| `COOKIE_SECURE` | Use `true` em HTTPS; `false` somente no desenvolvimento HTTP local |
| `FRONTEND_URL` | Origem/base do frontend e allowlist CORS |
| `MICROSOFT_TENANT_ID` | `organizations` para contas corporativas ou o tenant GUID específico |
| `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` | Credenciais do aplicativo Microsoft Entra ID |

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

Microsoft SSO: iniciar em `GET /oauth2/authorization/microsoft`. Após autenticação, o backend grava refresh token em cookie HttpOnly e redireciona para `{FRONTEND_URL}/auth/sso/callback`. O frontend deve chamar `POST /api/v1/auth/refresh` com credenciais incluídas para obter o access token. Tokens não são enviados em query string.

O access token dura 10 minutos. O refresh token é opaco, tem validade de 30 dias, é armazenado somente como SHA-256 no banco e sofre rotação a cada uso. O cookie usa HttpOnly, SameSite=Strict e Secure conforme `COOKIE_SECURE`.

## Persistência

Flyway cria o schema `vozly` e aplica migrations versionadas. A migration V2 cria usuários, tenants, memberships, identidades externas e sessões de refresh token. Cadastro cria usuário, tenant e membership OWNER na mesma transação.

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
- Rate limiting distribuído e bloqueio progressivo por tentativas precisam ser concluídos antes de exposição pública.
- O frontend Angular ainda precisa implementar as telas e o tratamento de cookies/refresh.
- Configure HTTPS e `COOKIE_SECURE=true` em qualquer ambiente publicado.
