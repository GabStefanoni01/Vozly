import { Injectable, computed, signal } from '@angular/core';
import {
  Agent,
  AgentStatus,
  AuditEvent,
  Call,
  IntegrationConnection,
  KnowledgeItem,
  PhoneNumber,
  ReadinessCheckResult,
  ToolDefinition,
  UsageMetric,
  User,
  WorkspaceTenant
} from '../models/dashboard.models';

/**
 * VOZLY — ESTADO LOCAL DO PAINEL (sem dados fictícios)
 *
 * Todas as coleções começam vazias. Elas devem ser preenchidas pelas respostas
 * da API (ver core/api/backend-contracts.ts) assim que os endpoints existirem.
 *
 * NOTA ARQUITETURAL:
 * Este serviço gerencia os dados demonstrativos em memória para avaliação visual
 * e validação da experiência do usuário (UX) antes da integração com a API Spring Boot.
 *
 * Em conformidade com as diretrizes:
 * - Não faz requisições para endpoints inexistentes.
 * - Não simula persistência externa ou publicações falsas no backend.
 * - Todos os contratos de dados espelham estritamente a especificação oficial de domínio.
 */

@Injectable({
  providedIn: 'root'
})
export class DashboardStateService {
  // ==========================================
  // ESTADO DO USUÁRIO & WORKSPACE
  // ==========================================
  readonly currentWorkspace = signal<WorkspaceTenant>({
    id: '',
    name: 'Workspace',
    slug: '',
    status: 'ACTIVE',
    plan: '',
    timezone: 'America/Sao_Paulo',
    createdAt: ''
  });

  readonly currentUser = signal<User>({
    id: '',
    name: 'Usuário',
    email: '',
    role: 'OPERATOR',
    status: 'ACTIVE'
  });

  readonly teamMembers = signal<User[]>([]);

  // ==========================================
  // FERRAMENTAS E CATÁLOGO OFICIAL
  // Conforme docs/07-catalogo-ferramentas-integracoes.md
  // ==========================================
  readonly toolDefinitions = signal<ToolDefinition[]>([
    {
      key: 'knowledge.search',
      name: 'Consultar Conhecimento',
      description: 'Recupera informações oficiais e perguntas frequentes associadas ao agente na base de conhecimento.',
      implementationType: 'NATIVE',
      category: 'CORE',
      riskLevel: 'LOW',
      inputSchemaSummary: '{ query: string, maxResults?: number }'
    },
    {
      key: 'conversation.collect',
      name: 'Coletar Informações',
      description: 'Valida e armazena de forma estruturada dados informados pelo interlocutor (CPF, protocolo, nome).',
      implementationType: 'NATIVE',
      category: 'CORE',
      riskLevel: 'LOW',
      inputSchemaSummary: '{ fields: { name: string, value: string }[] }'
    },
    {
      key: 'call.transfer',
      name: 'Transferir Atendimento',
      description: 'Encaminha a chamada para uma fila humana ou ramal telefônico de contingência configurado.',
      implementationType: 'NATIVE',
      category: 'CALL_CONTROL',
      riskLevel: 'MEDIUM',
      inputSchemaSummary: '{ reason: string, destinationNumber?: string }'
    },
    {
      key: 'call.request_callback',
      name: 'Solicitar Retorno',
      description: 'Registra a intenção de retorno de contato telefônico pelo time humano em horário útil.',
      implementationType: 'NATIVE',
      category: 'CALL_CONTROL',
      riskLevel: 'LOW',
      inputSchemaSummary: '{ preferredTime?: string, reason: string }'
    },
    {
      key: 'call.end',
      name: 'Encerrar Atendimento',
      description: 'Finaliza a chamada educadamente após resolução da demanda ou confirmação do cliente.',
      implementationType: 'NATIVE',
      category: 'CALL_CONTROL',
      riskLevel: 'LOW',
      inputSchemaSummary: '{ finalSummary?: string }'
    },
    {
      key: 'http.rest',
      name: 'Conector REST Corporativo',
      description: 'Executa requisições HTTP REST seguras para APIs autorizadas e cadastradas no workspace.',
      implementationType: 'INTEGRATION_OPERATION',
      category: 'EXTERNAL_API',
      riskLevel: 'HIGH',
      inputSchemaSummary: '{ operationKey: string, payload: Record<string, any> }'
    },
    {
      key: 'http.webhook',
      name: 'Webhook de Notificação',
      description: 'Dispara eventos assíncronos via HTTP POST com assinatura HMAC para o endpoint da sua empresa.',
      implementationType: 'INTEGRATION_OPERATION',
      category: 'EXTERNAL_API',
      riskLevel: 'MEDIUM',
      inputSchemaSummary: '{ event: string, data: Record<string, any> }'
    }
  ]);

  // ==========================================
  // CONEXÕES DE INTEGRAÇÃO
  // ==========================================
  readonly connections = signal<IntegrationConnection[]>([]);

  // ==========================================
  // ITENS DE CONHECIMENTO (BASE EMPRESARIAL)
  // ==========================================
  readonly knowledgeItems = signal<KnowledgeItem[]>([]);

  // ==========================================
  // NÚMEROS TELEFÔNICOS CADASTRADOS
  // ==========================================
  readonly phoneNumbers = signal<PhoneNumber[]>([]);

  // ==========================================
  // AGENTES DE INTELIGÊNCIA ARTIFICIAL
  // ==========================================
  readonly agents = signal<Agent[]>([]);

  // ==========================================
  // CHAMADAS E CONVERSAS RECENTES (HISTÓRICO)
  // Conforme docs/08 e docs/09
  // ==========================================
  readonly calls = signal<Call[]>([]);

  // ==========================================
  // INDICADORES DE USO E CONSUMO
  // Conforme docs/08 e docs/09
  // ==========================================
  readonly usage = signal<UsageMetric>({
    totalMinutesUsed: 0,
    monthlyMinutesLimit: 0,
    concurrentPeakChannels: 0,
    concurrentChannelsLimit: 0,
    totalCallsMonth: 0,
    toolExecutionsCount: 0,
    dailyUsage: []
  });

  // ==========================================
  // TRILHA DE AUDITORIA (SEGURANÇA & GOVERNANÇA)
  // Conforme docs/08-modelo-relacional-e-persistencia.md
  // ==========================================
  readonly auditEvents = signal<AuditEvent[]>([]);

  // ==========================================
  // FILTROS & ESTADO GLOBAL DE PESQUISA
  // ==========================================
  readonly searchQuery = signal<string>('');
  readonly selectedTimeRange = signal<'today' | 'week' | 'month'>('week');

  // ==========================================
  // COMPUTED SIGNALS
  // ==========================================
  readonly activeAgentsCount = computed(() => {
    return this.agents().filter(a => a.status === 'ACTIVE').length;
  });

  readonly totalCallsSum = computed(() => {
    return this.agents().reduce((acc, curr) => acc + curr.metrics.totalCalls, 0);
  });

  readonly averageResolutionRate = computed(() => {
    const active = this.agents().filter(a => a.metrics.totalCalls > 0);
    if (active.length === 0) return 0;
    const sum = active.reduce((acc, curr) => acc + curr.metrics.resolutionRate, 0);
    return Math.round((sum / active.length) * 10) / 10;
  });

  // ==========================================
  // AÇÕES LOCAIS (DEMO PURA - SEM BACKEND REAL)
  // ==========================================

  createAgent(agentData: Partial<Agent>): Agent {
    const newId = `ag-${Date.now().toString(36)}`;
    const newAgent: Agent = {
      id: newId,
      name: agentData.name || 'Novo Agente de Voz',
      description: agentData.description || 'Configuração guiada recém-iniciada.',
      status: 'DRAFT',
      language: 'pt-BR',
      draftRevision: 1,
      currentPublishedVersion: null,
      instructions: agentData.instructions || 'Você é um assistente de voz profissional.',
      voiceConfig: agentData.voiceConfig || {
        voiceId: 'pt-BR-Wavenet-Helena',
        voiceName: 'Helena (Neural Clara)',
        provider: 'Neural Engine',
        language: 'pt-BR',
        speed: 1.0,
        pitch: 1.0,
        interruptionSensitivity: 'HIGH'
      },
      behavior: agentData.behavior || {
        openingMessage: 'Olá! Como posso ajudar você hoje?',
        fallbackMessage: 'Desculpe, vou transferir sua ligação.',
        closingMessage: 'Obrigado pelo contato! Até logo.',
        transferPolicy: { enabled: true, destinationNumber: '', department: 'Suporte' },
        collectSummary: true
      },
      telephony: agentData.telephony || {
        phoneNumberId: '',
        phoneNumber: '',
        businessHours: '08:00 - 18:00',
        afterHoursBehavior: 'CLOSING_MESSAGE'
      },
      knowledgeItemIds: agentData.knowledgeItemIds || ['kn-01'],
      tools: agentData.tools || [
        { toolKey: 'knowledge.search', toolName: 'Consultar Conhecimento', enabled: true, implementationType: 'NATIVE' },
        { toolKey: 'conversation.collect', toolName: 'Coletar Informações', enabled: true, implementationType: 'NATIVE' },
        { toolKey: 'call.end', toolName: 'Encerrar Atendimento', enabled: true, implementationType: 'NATIVE' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        totalCalls: 0,
        completedCalls: 0,
        transferredCalls: 0,
        resolutionRate: 0,
        avgDurationSeconds: 0
      }
    };

    this.agents.update(list => [newAgent, ...list]);

    this.addAuditEvent({
      actor: this.currentUser().name,
      actorRole: this.currentUser().role,
      action: 'AGENT_CREATED',
      resourceType: 'AGENT',
      resourceId: newId,
      metadataSafe: { name: newAgent.name }
    });

    return newAgent;
  }

  updateAgent(agentId: string, updates: Partial<Agent>): void {
    this.agents.update(list =>
      list.map(ag => {
        if (ag.id !== agentId) return ag;
        return {
          ...ag,
          ...updates,
          draftRevision: ag.draftRevision + 1,
          updatedAt: new Date().toISOString()
        };
      })
    );
  }

  toggleAgentStatus(agentId: string): void {
    this.agents.update(list =>
      list.map(ag => {
        if (ag.id !== agentId) return ag;
        const newStatus: AgentStatus = ag.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        return {
          ...ag,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      })
    );
  }

  checkAgentReadiness(agent: Agent): ReadinessCheckResult {
    const checks = [
      {
        title: 'Nome e Instruções Definidas',
        description: 'O agente possui nome, finalidade e diretrizes de comportamento preenchidas.',
        passed: Boolean(agent.name && agent.instructions && agent.instructions.length > 20),
        mandatory: true,
        stepIndex: 1
      },
      {
        title: 'Mensagens de Entrada e Fallback',
        description: 'Saudação inicial e mensagem de contingência configuradas adequadamente.',
        passed: Boolean(agent.behavior.openingMessage && agent.behavior.fallbackMessage),
        mandatory: true,
        stepIndex: 2
      },
      {
        title: 'Voz Neural Selecionada',
        description: 'Modelo de voz e parâmetros de síntese calibrados em português brasileiro.',
        passed: Boolean(agent.voiceConfig.voiceId),
        mandatory: true,
        stepIndex: 3
      },
      {
        title: 'Base de Conhecimento Vinculada',
        description: 'Ao menos um item ou FAQ associado para fundamentar respostas do agente.',
        passed: agent.knowledgeItemIds.length > 0,
        mandatory: false,
        stepIndex: 4
      },
      {
        title: 'Ferramentas de Controle Habilitadas',
        description: 'Capacidades de consulta ou encerramento ativas para operação autônoma.',
        passed: agent.tools.some(t => t.enabled),
        mandatory: true,
        stepIndex: 5
      },
      {
        title: 'Número Telefônico Vinculado',
        description: 'Número de telefone cadastrado para recepção de chamadas (pode ser vinculado após publicação).',
        passed: Boolean(agent.telephony.phoneNumber),
        mandatory: false,
        stepIndex: 6
      }
    ];

    const isReady = checks.filter(c => c.mandatory).every(c => c.passed);
    return { isReady, checks };
  }

  publishAgent(agentId: string): { success: boolean; message: string; newVersion?: number } {
    const agent = this.agents().find(a => a.id === agentId);
    if (!agent) {
      return { success: false, message: 'Agente não encontrado no workspace.' };
    }

    const readiness = this.checkAgentReadiness(agent);
    if (!readiness.isReady) {
      return {
        success: false,
        message: 'O agente ainda possui pendências obrigatórias antes da publicação.'
      };
    }

    const nextVersion = (agent.currentPublishedVersion || 0) + 1;

    this.agents.update(list =>
      list.map(ag => {
        if (ag.id !== agentId) return ag;
        return {
          ...ag,
          status: 'ACTIVE',
          currentPublishedVersion: nextVersion,
          updatedAt: new Date().toISOString()
        };
      })
    );

    this.addAuditEvent({
      actor: this.currentUser().name,
      actorRole: this.currentUser().role,
      action: 'AGENT_PUBLISHED',
      resourceType: 'AGENT',
      resourceId: agent.id,
      metadataSafe: {
        agentName: agent.name,
        publishedVersion: nextVersion,
        note: 'Publicação demonstrativa local realizada com sucesso'
      }
    });

    return {
      success: true,
      message: `Versão v${nextVersion}.0 publicada no ambiente demonstrativo.`,
      newVersion: nextVersion
    };
  }

  addKnowledgeItem(item: Partial<KnowledgeItem>): KnowledgeItem {
    const newItem: KnowledgeItem = {
      id: `kn-${Date.now().toString(36)}`,
      title: item.title || 'Novo Item de Conhecimento',
      type: item.type || 'FAQ',
      category: item.category || 'Geral',
      content: item.content || '',
      status: 'ACTIVE',
      assignedAgentIds: item.assignedAgentIds || ['ag-01'],
      tokenCount: Math.round((item.content?.length || 100) / 4),
      updatedAt: new Date().toISOString()
    };

    this.knowledgeItems.update(list => [newItem, ...list]);

    this.addAuditEvent({
      actor: this.currentUser().name,
      actorRole: this.currentUser().role,
      action: 'KNOWLEDGE_ITEM_CREATED',
      resourceType: 'KNOWLEDGE',
      resourceId: newItem.id,
      metadataSafe: { title: newItem.title, type: newItem.type }
    });

    return newItem;
  }

  deleteKnowledgeItem(id: string): void {
    this.knowledgeItems.update(list => list.filter(k => k.id !== id));
  }

  createConnection(conn: Partial<IntegrationConnection>): IntegrationConnection {
    const newConn: IntegrationConnection = {
      id: `conn-${Date.now().toString(36)}`,
      integrationKey: conn.integrationKey || 'http.rest',
      name: conn.name || 'Nova Conexão REST',
      baseUrl: conn.baseUrl || 'https://api.exemplo.com.br',
      authType: conn.authType || 'BEARER_TOKEN',
      secretConfigured: true,
      status: 'CONNECTED',
      lastValidatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    this.connections.update(list => [newConn, ...list]);

    this.addAuditEvent({
      actor: this.currentUser().name,
      actorRole: this.currentUser().role,
      action: 'CONNECTION_CREATED',
      resourceType: 'CONNECTION',
      resourceId: newConn.id,
      metadataSafe: { name: newConn.name, authType: newConn.authType }
    });

    return newConn;
  }

  inviteTeamMember(email: string, role: 'OWNER' | 'ADMIN' | 'OPERATOR'): User {
    const name = email.split('@')[0].replace('.', ' ');
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    const newUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: formattedName,
      email,
      role,
      status: 'INVITED'
    };

    this.teamMembers.update(list => [...list, newUser]);

    this.addAuditEvent({
      actor: this.currentUser().name,
      actorRole: this.currentUser().role,
      action: 'MEMBER_INVITED',
      resourceType: 'MEMBERSHIP',
      resourceId: newUser.id,
      metadataSafe: { email, role }
    });

    return newUser;
  }

  private addAuditEvent(eventData: Omit<AuditEvent, 'id' | 'occurredAt' | 'correlationId'>): void {
    const newEvent: AuditEvent = {
      id: `aud-${Date.now().toString(36)}`,
      occurredAt: new Date().toISOString(),
      correlationId: `cor-${Math.floor(Math.random() * 9000000 + 1000000)}`,
      ...eventData
    };

    this.auditEvents.update(list => [newEvent, ...list]);
  }
}
