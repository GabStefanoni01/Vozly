/**
 * VOZLY — MODELOS E CONTRATOS DO DOMÍNIO ADMINISTRATIVO
 * Especificação alinhada aos documentos oficiais:
 * - docs/04-dominio-e-dados.md
 * - docs/07-catalogo-ferramentas-integracoes.md
 * - docs/08-modelo-relacional-e-persistencia.md
 * - docs/09-contratos-api-administrativa.md
 * - docs/10-runtime-de-voz-seguranca-e-operacao.md
 */

export type UserRole = 'OWNER' | 'ADMIN' | 'OPERATOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
}

export interface WorkspaceTenant {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'ONBOARDING' | 'SUSPENDED';
  plan: string;
  timezone: string;
  createdAt: string;
}

export type AgentStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

export interface VoiceConfig {
  voiceId: string;
  voiceName: string;
  provider: string;
  language: string; // e.g. 'pt-BR'
  speed: number;    // e.g. 1.0 (0.8 - 1.2)
  pitch: number;    // e.g. 1.0
  interruptionSensitivity: 'LOW' | 'NORMAL' | 'HIGH';
  sampleAudioUrl?: string;
}

export interface AgentBehavior {
  openingMessage: string;
  fallbackMessage: string;
  closingMessage: string;
  transferPolicy: {
    enabled: boolean;
    destinationNumber?: string;
    department?: string;
    triggerCondition?: string;
  };
  collectSummary: boolean;
}

export interface AgentTelephonyConfig {
  phoneNumberId?: string;
  phoneNumber?: string;
  businessHours?: string;
  afterHoursBehavior: 'VOICEMAIL' | 'TRANSFER' | 'CLOSING_MESSAGE';
}

export interface AgentToolBinding {
  toolKey: string;
  toolName: string;
  enabled: boolean;
  implementationType: 'NATIVE' | 'INTEGRATION_OPERATION';
  connectionId?: string;
  config?: Record<string, any>;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  language: string; // 'pt-BR'
  draftRevision: number;
  currentPublishedVersion: number | null;
  instructions: string;
  voiceConfig: VoiceConfig;
  behavior: AgentBehavior;
  telephony: AgentTelephonyConfig;
  knowledgeItemIds: string[];
  tools: AgentToolBinding[];
  createdAt: string;
  updatedAt: string;
  // Métricas operacionais agregadas (demonstrativas)
  metrics: {
    totalCalls: number;
    completedCalls: number;
    transferredCalls: number;
    resolutionRate: number; // e.g. 94.2
    avgDurationSeconds: number; // e.g. 142
  };
}

export interface AgentVersion {
  id: string;
  agentId: string;
  versionNumber: number;
  configurationSnapshot: Partial<Agent>;
  checksum: string;
  publishedAt: string;
  publishedBy: string;
}

export type KnowledgeType = 'FAQ' | 'TEXT' | 'DOCUMENT';
export type KnowledgeStatus = 'ACTIVE' | 'PROCESSING' | 'DRAFT' | 'ARCHIVED';

export interface KnowledgeItem {
  id: string;
  title: string;
  type: KnowledgeType;
  category: string;
  content: string;
  status: KnowledgeStatus;
  assignedAgentIds: string[];
  tokenCount: number;
  updatedAt: string;
}

export type ToolImplementationType = 'NATIVE' | 'INTEGRATION_OPERATION';

export interface ToolDefinition {
  key: string;
  name: string;
  description: string;
  implementationType: ToolImplementationType;
  category: 'CORE' | 'CALL_CONTROL' | 'EXTERNAL_API';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  inputSchemaSummary: string;
}

export type ConnectionStatus = 'DRAFT' | 'PENDING_VALIDATION' | 'CONNECTED' | 'ERROR' | 'REVOKED';

export interface IntegrationConnection {
  id: string;
  integrationKey: string; // e.g. 'http.rest' | 'http.webhook'
  name: string;
  baseUrl?: string;
  authType: 'BEARER_TOKEN' | 'API_KEY' | 'BASIC' | 'NONE';
  secretConfigured: boolean; // Segredos NUNCA retornam em claro
  status: ConnectionStatus;
  lastValidatedAt?: string;
  lastErrorCode?: string;
  createdAt: string;
}

export interface PhoneNumber {
  id: string;
  e164: string;
  formatted: string;
  provider: string;
  status: 'ACTIVE' | 'PENDING' | 'RELEASED';
  assignedAgentId: string | null;
  assignedAgentName?: string;
  routingConfig: {
    fallbackDestination: string;
    businessHours: string;
  };
}

export type CallDirection = 'INBOUND' | 'OUTBOUND';
export type CallStatus = 'IN_PROGRESS' | 'COMPLETED' | 'TRANSFERRED' | 'FAILED' | 'MISSED';
export type CallOutcome = 'RESOLVED' | 'TRANSFERRED_HUMAN' | 'CALLBACK_REQUESTED' | 'ABANDONED' | 'ERROR';

export interface ConversationTurn {
  sequence: number;
  role: 'assistant' | 'user' | 'system' | 'tool';
  content: string;
  timestamp: string;
  toolCall?: {
    toolKey: string;
    inputSummary: string;
    outputSummary: string;
    executionTimeMs: number;
  };
}

export interface Call {
  id: string;
  callerNumber: string;
  agentId: string;
  agentName: string;
  agentVersion: number;
  phoneNumber: string;
  direction: CallDirection;
  status: CallStatus;
  outcome: CallOutcome;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  toolsExecuted: string[];
  summary: string;
  messages: ConversationTurn[];
}

export interface UsageMetric {
  totalMinutesUsed: number;
  monthlyMinutesLimit: number;
  concurrentPeakChannels: number;
  concurrentChannelsLimit: number;
  totalCallsMonth: number;
  toolExecutionsCount: number;
  dailyUsage: { date: string; minutes: number; calls: number }[];
}

export interface AuditEvent {
  id: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  resourceType: 'AGENT' | 'CONNECTION' | 'KNOWLEDGE' | 'PHONE_NUMBER' | 'MEMBERSHIP' | 'WORKSPACE';
  resourceId: string;
  occurredAt: string;
  correlationId: string;
  metadataSafe: Record<string, any>;
}

export interface ReadinessCheckResult {
  isReady: boolean;
  checks: {
    title: string;
    description: string;
    passed: boolean;
    mandatory: boolean;
    actionLabel?: string;
    stepIndex?: number;
  }[];
}
