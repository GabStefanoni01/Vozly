/**
 * VOZLY — DTOs consumidos pela Visão Geral do painel.
 *
 * Estes contratos são PROPOSTAS derivadas de:
 * - docs/09-contratos-api-administrativa.md (envelope, erros, recursos)
 * - docs/08-modelo-relacional-e-persistencia.md (campos das entidades)
 * - docs/10-runtime-de-voz-seguranca-e-operacao.md (estados de chamada, métricas)
 *
 * Quando o backend publicar o OpenAPI (docs/09 §8), substitua estas interfaces
 * pelos tipos gerados e mantenha os nomes de campo do contrato oficial.
 * DTOs são independentes das entidades JPA. Datas sempre ISO-8601 em UTC.
 */

/** Envelope de coleção paginada (docs/09 §2.1). */
export interface PageResponse<T> {
  data: T[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

/** Problem Details (RFC 9457) proposto em docs/09 §2.2. */
export interface ProblemDetails {
  type?: string;
  title?: string;
  status: number;
  detail?: string;
  code?: string;
  traceId?: string;
  errors?: { field: string; code: string; message: string }[];
}

// ---------------------------------------------------------------------------
// Identidade e tenant
// ---------------------------------------------------------------------------

export type MembershipRole = 'OWNER' | 'ADMIN' | 'OPERATOR';

/** `GET /api/v1/me` — usuário autenticado e papel no tenant ativo. */
export interface MeResponse {
  id: string;
  name: string;
  email: string;
  /** Papel da membership no tenant ativo, resolvido no servidor. */
  role: MembershipRole;
  activeTenantId: string;
}

export type TenantStatus = 'ONBOARDING' | 'ACTIVE' | 'SUSPENDED';

/** `GET /api/v1/tenants/current` — workspace ativo. */
export interface TenantResponse {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Onboarding (docs/06, tabela onboarding_progress em docs/08 §3.1)
// ---------------------------------------------------------------------------

export type OnboardingStepKey =
  | 'WORKSPACE'
  | 'MEMBERS'
  | 'AGENT'
  | 'KNOWLEDGE'
  | 'TOOLS'
  | 'PHONE_NUMBER'
  | 'TEST'
  | 'PUBLISH';

/** `GET /api/v1/onboarding` — progresso informativo; não concede permissões. */
export interface OnboardingResponse {
  status: 'IN_PROGRESS' | 'COMPLETED';
  currentStep: OnboardingStepKey;
  steps: {
    key: OnboardingStepKey;
    completed: boolean;
    /** Motivo acionável quando o pré-requisito real ainda não foi atendido. */
    pendingReason?: string;
  }[];
}

// ---------------------------------------------------------------------------
// Consumo e métricas operacionais (docs/08 §3.6, docs/10 §10)
// ---------------------------------------------------------------------------

export interface CallCounters {
  total: number;
  completed: number;
  transferred: number;
  failed: number;
}

export type CallEndReason =
  | 'RESOLVED'
  | 'TRANSFERRED'
  | 'CALLBACK_REQUESTED'
  | 'CALLER_HANGUP'
  | 'FALLBACK'
  | 'FAILED';

/**
 * `GET /api/v1/usage/summary?from=&to=&granularity=DAY`
 * Métricas operacionais agregadas do tenant. Não equivale a faturamento.
 */
export interface UsageSummaryResponse {
  period: { from: string; to: string };
  calls: CallCounters;
  /** Mesmo intervalo imediatamente anterior, para calcular variação. */
  previousCalls: CallCounters | null;
  /** Chamadas com status ACTIVE/TRANSFERRING no momento da consulta. */
  inProgress: number;
  durationSeconds: { total: number; average: number };
  endReasons: { reason: CallEndReason; count: number }[];
  series: { date: string; calls: number; minutes: number }[];
}

// ---------------------------------------------------------------------------
// Chamadas (docs/08 §3.5, estados em docs/10 §3)
// ---------------------------------------------------------------------------

export type CallStatus =
  | 'RECEIVED'
  | 'RESOLVING'
  | 'RINGING'
  | 'ACTIVE'
  | 'TRANSFERRING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'TIMED_OUT';

/** Item de `GET /api/v1/calls` — dados minimizados para listagem. */
export interface CallListItem {
  id: string;
  agentId: string;
  agentName: string;
  agentVersionNumber: number;
  /** Número Vozly que recebeu a chamada (E.164). */
  phoneNumber: string;
  /** Número de origem já mascarado pelo backend (LGPD — minimização). */
  callerNumberMasked: string | null;
  direction: 'INBOUND' | 'OUTBOUND';
  status: CallStatus;
  endReason: CallEndReason | null;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
}

// ---------------------------------------------------------------------------
// Agentes e números
// ---------------------------------------------------------------------------

export type AgentStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

/** Item de `GET /api/v1/agents`. */
export interface AgentListItem {
  id: string;
  name: string;
  status: AgentStatus;
  draftRevision: number;
  publishedVersion: number | null;
  updatedAt: string;
}

/** Item de `GET /api/v1/phone-numbers`. */
export interface PhoneNumberListItem {
  id: string;
  e164: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'RELEASED';
  providerKey: string;
  agentId: string | null;
  agentName: string | null;
}

// ---------------------------------------------------------------------------
// Saúde (Spring Boot Actuator — já disponível no backend)
// ---------------------------------------------------------------------------

export type HealthStatus = 'UP' | 'DOWN' | 'OUT_OF_SERVICE' | 'UNKNOWN';

/** `GET /actuator/health` — detalhes não são expostos (show-details: never). */
export interface HealthResponse {
  status: HealthStatus;
}
