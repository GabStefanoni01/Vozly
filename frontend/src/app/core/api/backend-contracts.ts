/**
 * VOZLY — Guia de ligação Frontend ↔ Backend da Visão Geral.
 *
 * Cada entrada descreve uma função do painel, o endpoint que ela consome e o que
 * precisa ser implementado no Spring Boot (pasta `backend/`) para ela funcionar.
 * O mesmo conteúdo é exibido na interface (painel "Como conectar ao backend")
 * quando a rota ainda responde 404 ou o backend está fora do ar.
 *
 * Stack do backend: Java 25, Spring Boot 4.1 (spring-boot-starter-webmvc),
 * PostgreSQL + Flyway, monólito modular em `com.vozly.<módulo>`.
 * Convenções obrigatórias (docs/09): base `/api/v1`, envelope paginado,
 * Problem Details em erros, tenant derivado da identidade (nunca do request).
 */

export interface BackendContract {
  /** Identificador estável usado pelos widgets. */
  key: string;
  /** Nome da função do painel. */
  feature: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  /** Pacote do monólito modular responsável. */
  module: string;
  /** Situação atual no backend. */
  availability: 'available' | 'pending';
  /** Passos objetivos para implementar no backend. */
  backendSteps: string[];
  /** Documentos de referência em `docs/`. */
  docs: string[];
}

const COMMON_TENANT_STEP =
  'Resolver o tenant a partir da identidade autenticada + membership ativa; nunca aceitar tenant_id do cliente (docs/03 Multi-tenancy).';

export const BACKEND_CONTRACTS = {
  health: {
    key: 'health',
    feature: 'Saúde da API',
    method: 'GET',
    path: '/actuator/health',
    module: 'Spring Boot Actuator',
    availability: 'available',
    backendSteps: [
      'Já disponível: management.endpoints.web.exposure.include=health,info em application.yml.',
      'Probes /actuator/health/liveness e /readiness habilitadas (management.endpoint.health.probes.enabled=true).',
      'Para exibir saúde de STT/LLM/TTS e telefonia, criar HealthIndicators por adaptador e expor em endpoint administrativo autenticado — nunca detalhes internos públicos (docs/10 §10).'
    ],
    docs: ['backend/README.md', 'docs/10-runtime-de-voz-seguranca-e-operacao.md §10']
  },

  me: {
    key: 'me',
    feature: 'Usuário autenticado',
    method: 'GET',
    path: '/api/v1/auth/me',
    module: 'com.vozly.identity',
    availability: 'available',
    backendSteps: [
      'Implementado: GET /api/v1/auth/me retorna userId, tenantId, role, name e email; os dados de perfil são consultados pelo subject autenticado.',
      'O endpoint não retorna senha, hash, refresh token ou outros dados sensíveis.',
      'A identidade e o tenant são derivados do JWT validado no backend (docs/09 §3).'
    ],
    docs: ['docs/09-contratos-api-administrativa.md §3–4', 'docs/08-modelo-relacional-e-persistencia.md §3.1']
  },

  tenant: {
    key: 'tenant',
    feature: 'Workspace ativo',
    method: 'GET',
    path: '/api/v1/tenants/current',
    module: 'com.vozly.tenants',
    availability: 'available',
    backendSteps: [
      'Implementado: GET /api/v1/tenants/current consulta o tenant associado ao tenant_id do JWT validado.',
      COMMON_TENANT_STEP,
      'O cadastro cria um workspace e uma membership OWNER para o usuário; a migration V6 garante uma única membership/workspace por usuário.'
    ],
    docs: ['docs/09-contratos-api-administrativa.md §4', 'docs/04-dominio-e-dados.md']
  },

  onboarding: {
    key: 'onboarding',
    feature: 'Checklist de ativação',
    method: 'GET',
    path: '/api/v1/onboarding',
    module: 'com.vozly.tenants',
    availability: 'available',
    backendSteps: [
      'Migration V5 cria onboarding_progress; calcular etapas com base nos recursos persistidos e manter pendentes os módulos ainda indisponíveis.',
      'Calcular cada etapa a partir de pré-requisitos reais (agente existe, conhecimento ativo, número vinculado, versão publicada) — o progresso é informativo e não concede permissões.',
      'Retornar { status, currentStep, steps: [{ key, completed, pendingReason }] } com keys WORKSPACE, MEMBERS, AGENT, KNOWLEDGE, TOOLS, PHONE_NUMBER, TEST, PUBLISH.'
    ],
    docs: ['docs/06-jornada-self-service-e-configuracao.md', 'docs/02-requisitos-mvp.md (Fluxo prioritário de ativação)']
  },

  usageSummary: {
    key: 'usageSummary',
    feature: 'Indicadores e atividade de chamadas',
    method: 'GET',
    path: '/api/v1/usage/summary?from={iso}&to={iso}&granularity=DAY',
    module: 'com.vozly.usage + com.vozly.conversations',
    availability: 'available',
    backendSteps: [
      'Migration V5 cria calls e usage_records com índices tenant-scoped; o resumo agrega chamadas persistidas enquanto a ingestão pelo runtime não estiver disponível.',
      'Agregar no período: total, concluídas, transferidas, falhas; repetir para o período anterior de mesmo tamanho (previousCalls).',
      'Contar inProgress (status ACTIVE ou TRANSFERRING) e somar duração total/média.',
      'Agrupar end_reason em endReasons e gerar série diária { date, calls, minutes } preenchendo dias sem chamadas com zero.',
      'Validar from/to (máx. 90 dias) e responder 422 com Problem Details em caso inválido.'
    ],
    docs: ['docs/09-contratos-api-administrativa.md §4 (Uso)', 'docs/10-runtime-de-voz-seguranca-e-operacao.md §10 (Métricas)']
  },

  recentCalls: {
    key: 'recentCalls',
    feature: 'Chamadas recentes',
    method: 'GET',
    path: '/api/v1/calls?page=0&size=6&sort=startedAt,desc',
    module: 'com.vozly.conversations',
    availability: 'available',
    backendSteps: [
      'Migration V5 cria calls com agent_version_id obrigatório e FKs compostas por tenant.',
      'Implementar CallController.list com Pageable, sort allowlisted (startedAt, durationSeconds) e size máximo 100.',
      'Retornar envelope { data, pagination } com itens CallListItem; mascarar o número de origem no servidor (LGPD).',
      'OPERATOR recebe dados minimizados (docs/09 matriz de permissões).'
    ],
    docs: ['docs/09-contratos-api-administrativa.md §2.1 e §4 (Chamadas)', 'docs/08-modelo-relacional-e-persistencia.md §3.5']
  },

  agents: {
    key: 'agents',
    feature: 'Agentes e versões publicadas',
    method: 'GET',
    path: '/api/v1/agents?size=20&sort=updatedAt,desc',
    module: 'com.vozly.agents',
    availability: 'available',
    backendSteps: [
      'Migration V5 cria agents e agent_versions com vínculo tenant-scoped.',
      'Implementar AgentController.list retornando { id, name, status, draftRevision, publishedVersion, updatedAt } no envelope paginado.',
      'Filtrar por tenant no repositório (não apenas no controller) e ignorar ARCHIVED por padrão.'
    ],
    docs: ['docs/09-contratos-api-administrativa.md §4–5', 'docs/08-modelo-relacional-e-persistencia.md §3.2']
  },

  phoneNumbers: {
    key: 'phoneNumbers',
    feature: 'Números e roteamento',
    method: 'GET',
    path: '/api/v1/phone-numbers',
    module: 'com.vozly.telephony',
    availability: 'available',
    backendSteps: [
      'A persistência é provider-agnostic; seleção do provedor e provisionamento de números continuam pendentes.',
      'Criar migration phone_numbers (tenant_id, provider_key, provider_number_ref, e164, status, routing_config).',
      'Implementar PhoneNumberController.list retornando { id, e164, status, providerKey, agentId, agentName }.'
    ],
    docs: ['docs/09-contratos-api-administrativa.md §4 (Telefonia)', 'docs/08-modelo-relacional-e-persistencia.md §3.5']
  }
} satisfies Record<string, BackendContract>;

export type BackendContractKey = keyof typeof BACKEND_CONTRACTS;
