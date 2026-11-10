# CI/CD e revisão automática

## Visão geral

O repositório usa GitHub Actions para validar mudanças antes da integração e produzir artefatos de build. Os workflows são:

- `.github/workflows/ci.yml`: compila e executa os testes do backend, compila o frontend e publica os artefatos em pushes para `develop` e `main`.
- `.github/workflows/pr-security-review.yml`: executa CodeQL para Java/Kotlin e JavaScript/TypeScript e Trivy para vulnerabilidades de dependências em Pull Requests.

Os workflows são disparados em PRs com destino a `develop` ou `main`, em pushes nessas branches e, quando aplicável, manualmente. O CodeQL também executa semanalmente.

## CI do backend

- JDK 21 (Temurin).
- Maven executa `clean verify`.
- Profile `test`, que usa H2 em memória.
- Variáveis de configuração Microsoft/JWT são valores fictícios exclusivos do job; nenhuma credencial real é necessária.
- O JAR gerado é publicado como artefato do workflow em pushes.

## CI do frontend

- Node.js 22.13.1 e npm 11.17.0, alinhados ao `package.json`.
- Instala dependências e executa `npm run build`.
- O diretório `frontend/dist/` é publicado como artefato em pushes.

**Atenção ao lockfile:** no momento da configuração, o `package.json` declara Angular 21, enquanto o `package-lock.json` contém referências Angular 22. Por isso, o workflow usa `npm install` para reconciliar o lockfile no ambiente efêmero do runner antes do build. Isso mantém a pipeline executável, mas não substitui a correção e o commit de um lockfile sincronizado. Depois de sincronizar o lockfile com `package.json`, trocar o passo por `npm ci` para obter instalações reprodutíveis.

O `angular.json` não possui target de testes configurado. Portanto, o pipeline executa o build Angular e não chama `npm test` até existir uma configuração de testes válida.

## Revisão automática de PR

### CodeQL

Analisa o código Java/Kotlin e JavaScript/TypeScript com a suíte `security-extended`. Os alertas são publicados no recurso de segurança/code scanning do GitHub e podem apontar padrões vulneráveis no código alterado.

### Trivy Vulnerability Scan

Analisa os manifestos/lockfiles de dependências e o filesystem em busca de vulnerabilidades conhecidas. O check falha quando encontra vulnerabilidades HIGH ou CRITICAL para as quais há correção disponível. Os resultados SARIF são enviados ao GitHub Code Scanning.

O Trivy foi escolhido no lugar do Dependency Review porque o Dependency Graph do repositório estava desabilitado e a action não conseguia executar. O Trivy não depende dessa configuração.

Essas verificações são análise estática e de dependências. Não equivalem a uma revisão funcional feita por uma pessoa nem a uma revisão generativa por IA. Nenhum provedor de IA ou chave externa foi escolhido/configurado nesta etapa.

## Entrega contínua e deploy

Em pushes para `develop` e `main`, os workflows publicam os artefatos do backend e frontend no GitHub Actions por 14 dias. Isso permite baixar builds identificados pelo SHA do commit.

O deploy automático não foi habilitado porque o Vozly ainda não possui provedor/ambiente de hospedagem definido. Quando o destino for escolhido, o deploy deve ser adicionado em workflow separado, com GitHub Environments, secrets específicos e aprovação manual para produção.

## Proteção das branches

Depois que os workflows executarem ao menos uma vez, configurar em **Settings → Rules → Rulesets** (ou Branch protection rules):

- Exigir Pull Request para atualizar `develop` e `main`.
- Exigir que os checks de backend, frontend, CodeQL e Dependency Review estejam aprovados.
- Exigir branch atualizada em relação à base antes do merge.
- Bloquear force push e exclusão das branches protegidas.
- Manter aprovação humana antes de merge; a automação não deve mesclar PRs.

Os nomes dos checks devem ser selecionados na interface do GitHub depois da primeira execução, conforme os nomes exibidos na aba Checks.

## Execução local

Backend:

```bash
cd backend
SPRING_PROFILES_ACTIVE=test mvn clean verify
```

Frontend:

```bash
cd frontend
npm install
npm run build
```

## Limitações atuais

- Não existe deploy automático enquanto a hospedagem não for definida.
- O frontend ainda não possui target de testes configurado no Angular CLI.
- O lockfile npm precisa ser sincronizado com o manifesto antes de adotar `npm ci`.
- CodeQL e Trivy são revisores automatizados baseados em regras e vulnerabilidades; uma revisão por IA exigiria escolher um provedor e armazenar sua chave em GitHub Secrets.
