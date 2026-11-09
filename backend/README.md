# Vozly Backend

Backend inicial do Vozly, construído como monólito modular com Java 21 e Spring Boot 4.1.2.

## Pré-requisitos

- JDK 21.
- Maven 3.6.3 ou superior.
- PostgreSQL para executar o profile `local`.

## Configuração

O profile padrão é `local`. Configure as variáveis de ambiente antes de iniciar:

| Variável | Padrão local | Descrição |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/vozly` | JDBC URL do PostgreSQL |
| `DB_USERNAME` | `vozly` | Usuário do banco |
| `DB_PASSWORD` | `vozly` | Senha do banco |
| `DB_POOL_MAX_SIZE` | `10` | Máximo de conexões no pool |
| `DB_POOL_MIN_IDLE` | `2` | Mínimo de conexões ociosas |
| `PORT` | `8080` | Porta HTTP |

O arquivo `.env.example` documenta os nomes esperados. O Spring Boot não carrega esse arquivo automaticamente: exporte as variáveis no terminal ou use um gerenciador de ambiente local. Não versione credenciais reais.

No primeiro início, o Flyway cria o schema `vozly` e registra o histórico de migrations. Nenhuma tabela de domínio é criada nesta etapa.

## Executar

Na pasta `backend/`:

```bash
mvn spring-boot:run
```

## Testar

Os testes usam H2 em memória e não precisam de PostgreSQL:

```bash
mvn test
```

## Health check

Com a aplicação em execução:

- `GET /actuator/health`
- `GET /actuator/health/liveness`
- `GET /actuator/health/readiness`

Os detalhes internos do health check não são expostos publicamente pela configuração padrão.

## Organização

Os pacotes iniciais representam fronteiras do monólito modular:

- `identity`
- `tenants`
- `agents`
- `knowledge`
- `integrations`
- `tools`
- `telephony`
- `voice`
- `conversations`
- `usage`
- `audit`

Os módulos ainda não possuem regras de negócio. Novas dependências entre módulos devem ser explícitas e evitar acesso cruzado desnecessário às estruturas internas.

## Próximos passos

Autenticação, autorização multi-tenant, entidades de domínio e contratos da API serão implementados em issues próprias, seguindo as especificações em `../docs/`.
