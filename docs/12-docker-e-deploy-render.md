# Docker e deploy no Render

Este repositório publica o Vozly como dois serviços Docker independentes:

- **Frontend:** Angular compilado em imagem multi-stage e servido pelo Nginx.
- **Backend:** Java 21 / Spring Boot em imagem multi-stage, executado com usuário sem privilégios.
- **Banco:** PostgreSQL externo (Neon). O banco não é incluído nas imagens nem no Docker Compose.

## Arquitetura no Render

O arquivo `render.yaml` define:

1. `vozly-backend` como serviço privado (`pserv`), escutando na porta `8080`.
2. `vozly-frontend` como serviço web público, servido pelo Nginx na porta `10000`.
3. Uma referência privada `API_UPSTREAM` do frontend para o host e porta internos do backend.

O navegador acessa somente o domínio público do frontend. O Nginx encaminha as rotas `/api/`, `/oauth2/`, `/login/oauth2/` e `/actuator/` ao backend. As demais rotas usam o fallback do Angular (`index.html`). Assim, as chamadas da aplicação e os cookies de autenticação permanecem same-origin.

O backend privado não recebe tráfego público direto. O serviço frontend tem health check em `/healthz`; o backend mantém os endpoints Actuator existentes, incluindo `/actuator/health`.

> O serviço privado do Render pode exigir um plano pago. Escolha planos e região compatíveis para os dois serviços e mantenha-os na mesma região para comunicação pela rede privada.

## Executar localmente com Docker Compose

Pré-requisitos: Docker Engine e Docker Compose.

1. Crie seu arquivo local de ambiente:

   ```bash
   cp .env.example .env
   ```

2. Preencha `DB_URL`, `DB_USERNAME` e `DB_PASSWORD` com os dados do PostgreSQL que deseja utilizar. O exemplo está preparado para Neon; use a JDBC URL com SSL habilitado.
3. Suba os serviços:

   ```bash
   docker compose up --build
   ```

4. Acesse o frontend em `http://localhost:4200`. O backend também fica exposto localmente em `http://localhost:8080` para diagnóstico.

O Compose ativa o profile `local`, desabilita cookies Secure somente para HTTP local e configura o Nginx para encaminhar as chamadas ao container `backend`. Não existe um container PostgreSQL neste Compose: a conexão é feita com o banco externo informado no `.env`.

Para encerrar:

```bash
docker compose down
```

Não versione o arquivo `.env`. Os valores de exemplo de JWT e Microsoft são somente para desenvolvimento local.

## Publicar pelo Blueprint do Render

1. Envie a branch com esta configuração ao GitHub e integre a PR após revisão.
2. No Render, crie um **Blueprint** conectado ao repositório e selecione o arquivo `render.yaml`.
3. Revise os dois serviços definidos. O backend é privado; o frontend é o único serviço público.
4. Configure as variáveis marcadas como `sync: false` no serviço `vozly-backend`:

| Variável | Valor |
|---|---|
| `DB_URL` | JDBC URL do Neon, por exemplo `jdbc:postgresql://HOST/DB?sslmode=require` |
| `DB_USERNAME` | Usuário do banco Neon |
| `DB_PASSWORD` | Senha do banco Neon |
| `VOZLY_JWT_ISSUER` | Identificador estável do emissor JWT, em formato URI |
| `FRONTEND_URL` | URL HTTPS pública do serviço frontend, sem barra final |
| `MICROSOFT_TENANT_ID` | Tenant ID ou `organizations`, conforme o registro Entra ID |
| `MICROSOFT_CLIENT_ID` | Client ID do aplicativo Microsoft Entra ID |
| `MICROSOFT_CLIENT_SECRET` | Client Secret do aplicativo Microsoft Entra ID |

O Blueprint gera `VOZLY_JWT_SECRET` automaticamente. Não substitua por um valor versionado. Mantenha `COOKIE_SECURE=true` e não ative o profile `local` em produção.

5. Após a criação dos serviços, copie a URL HTTPS pública do frontend e preencha `FRONTEND_URL` com essa origem exata. Use o mesmo valor como origem permitida do frontend.
6. No Microsoft Entra ID, registre como redirect URI de plataforma Web:

   ```text
   https://SUA-URL-FRONTEND/login/oauth2/code/microsoft
   ```

   O callback passa pelo Nginx e é encaminhado ao backend privado. O backend usa os cabeçalhos encaminhados pelo proxy para construir a URL externa HTTPS.
7. Faça o deploy dos serviços e confira o health check do frontend e os logs do backend. O Flyway executa as migrations na inicialização, conforme a configuração atual.

O arquivo Blueprint usa `autoDeployTrigger: off`: novos commits não devem disparar deploy automaticamente. A criação inicial dos recursos pelo Blueprint ainda exige confirmação no painel Render.

## Ambiente de desenvolvimento publicado (devvozly)

Enquanto o Blueprint Docker acima não é aplicado, existe um ambiente de **desenvolvimento** publicado no Render:

| Serviço | URL | Origem |
|---|---|---|
| Frontend (static site) | `https://devvozly-zxlh.onrender.com` | Branch `deploy/dev-dashboard`, Blueprint próprio (`render.yaml` daquela branch) |
| Backend (web service) | `https://vozly.onrender.com` | Spring Boot com `FRONTEND_URL=https://devvozly-zxlh.onrender.com` |

O static site reproduz o papel do Nginx com *rewrites* do Render, na ordem abaixo, mantendo a API **same-origin** para o navegador (cookies `SameSite=Strict` do refresh token e CSRF continuam funcionando):

```yaml
routes:
  - { type: rewrite, source: /api/*,          destination: https://vozly.onrender.com/api/* }
  - { type: rewrite, source: /actuator/*,     destination: https://vozly.onrender.com/actuator/* }
  - { type: rewrite, source: /oauth2/*,       destination: https://vozly.onrender.com/oauth2/* }
  - { type: rewrite, source: /login/oauth2/*, destination: https://vozly.onrender.com/login/oauth2/* }
  - { type: rewrite, source: /*,              destination: /index.html }   # fallback do Angular
```

O build de produção usa `environment.prod.ts` (`apiUrl: ''`), então o mesmo artefato funciona atrás do Nginx ou dos rewrites. A branch `deploy/dev-dashboard` só difere da linha principal pelo `render.yaml` do static site; não integre esse arquivo na `develop`, que mantém o Blueprint Docker.

Requisitos no backend para este ambiente:

- `FRONTEND_URL` deve ser exatamente `https://devvozly-zxlh.onrender.com` (allowlist de CORS — o navegador envia `Origin` desse domínio nos POSTs).
- `COOKIE_SECURE=true` e HTTPS.
- Microsoft SSO: registrar no Entra ID o redirect URI que o backend gerar para este ambiente e validar o fluxo antes de divulgá-lo.

## Decisões e limites atuais

- O backend usa `PORT`, definido como `8080` no Blueprint e no Compose.
- O Nginx usa `PORT=10000` no Render e no container.
- O build Angular de produção substitui o ambiente local e usa URL relativa da API. O ambiente de desenvolvimento continua apontando para `http://localhost:8080`.
- `server.forward-headers-strategy=framework` permite que Spring interprete os cabeçalhos encaminhados pelo Nginx/Render no fluxo OAuth.
- O `package-lock.json` está alinhado ao `package.json` (Angular 21) e o Dockerfile do frontend usa `npm ci` para instalações reproduzíveis.
- O Dockerfile do backend compila o JAR com Maven e o executa em uma imagem JRE, sem incluir Maven no runtime.
- Esta configuração não cria banco no Render, não migra dados do Neon e não cadastra segredos ou domínios automaticamente.
- Nenhum deploy foi executado por esta alteração.
