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
 * VOZLY — CAMADA DE DADOS E ESTADO DEMONSTRATIVO (FASE 02)
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
    id: 'ws-0192f6e0-8d5b-7c11-a000-001',
    name: 'Vozly Telecom & Serviços',
    slug: 'vozly-telecom',
    status: 'ACTIVE',
    plan: 'Enterprise Voice AI (Demonstração)',
    timezone: 'America/Sao_Paulo (UTC-3)',
    createdAt: '2026-10-15T10:00:00Z'
  });

  readonly currentUser = signal<User>({
    id: 'usr-0192f6e0-8d5b-7c11-a000-101',
    name: 'Jordan Silveira',
    email: 'jordan@vozly.com.br',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    status: 'ACTIVE'
  });

  readonly teamMembers = signal<User[]>([
    {
      id: 'usr-0192f6e0-8d5b-7c11-a000-101',
      name: 'Jordan Silveira',
      email: 'jordan@vozly.com.br',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      status: 'ACTIVE'
    },
    {
      id: 'usr-0192f6e0-8d5b-7c11-a000-102',
      name: 'Camila Albuquerque',
      email: 'camila@vozly.com.br',
      role: 'OWNER',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      status: 'ACTIVE'
    },
    {
      id: 'usr-0192f6e0-8d5b-7c11-a000-103',
      name: 'Lucas Nogueira',
      email: 'lucas.op@vozly.com.br',
      role: 'OPERATOR',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      status: 'ACTIVE'
    }
  ]);

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
  readonly connections = signal<IntegrationConnection[]>([
    {
      id: 'conn-01',
      integrationKey: 'http.rest',
      name: 'API do CRM Principal (HubSpot/Salesforce)',
      baseUrl: 'https://api.crm.empresa.com.br/v2',
      authType: 'BEARER_TOKEN',
      secretConfigured: true,
      status: 'CONNECTED',
      lastValidatedAt: '2026-11-09T18:30:00Z',
      createdAt: '2026-10-20T14:10:00Z'
    },
    {
      id: 'conn-02',
      integrationKey: 'http.webhook',
      name: 'Webhook de Abertura de Chamados (Zendesk)',
      baseUrl: 'https://hooks.empresa.com.br/voice-events',
      authType: 'API_KEY',
      secretConfigured: true,
      status: 'CONNECTED',
      lastValidatedAt: '2026-11-08T09:15:00Z',
      createdAt: '2026-10-25T11:00:00Z'
    },
    {
      id: 'conn-03',
      integrationKey: 'http.rest',
      name: 'ERP Consulta de Boletos & Finanças',
      baseUrl: 'https://financeiro.empresa.com.br/api',
      authType: 'BEARER_TOKEN',
      secretConfigured: false,
      status: 'PENDING_VALIDATION',
      createdAt: '2026-11-05T16:45:00Z'
    }
  ]);

  // ==========================================
  // ITENS DE CONHECIMENTO (BASE EMPRESARIAL)
  // ==========================================
  readonly knowledgeItems = signal<KnowledgeItem[]>([
    {
      id: 'kn-01',
      title: 'Políticas de Atendimento, Horários e Plantão 24h',
      type: 'FAQ',
      category: 'Institucional',
      content: 'Nosso horário comercial é de segunda a sexta, das 08h às 18h. Para emergências técnicas e chamados críticos nível 1, o plantão telefônico opera 24 horas por dia através do ramal 990.',
      status: 'ACTIVE',
      assignedAgentIds: ['ag-01', 'ag-02'],
      tokenCount: 420,
      updatedAt: '2026-11-08T15:20:00Z'
    },
    {
      id: 'kn-02',
      title: 'Segunda Via de Boleto e Formas de Pagamento PIX',
      type: 'FAQ',
      category: 'Financeiro',
      content: 'A segunda via de fatura pode ser emitida informando o CNPJ ou CPF do titular. Aceitamos pagamento via PIX copia e cola com compensação instantânea e cartão de crédito.',
      status: 'ACTIVE',
      assignedAgentIds: ['ag-01'],
      tokenCount: 380,
      updatedAt: '2026-11-07T11:10:00Z'
    },
    {
      id: 'kn-03',
      title: 'Instruções para Agendamento e Cancelamento de Consultas',
      type: 'TEXT',
      category: 'Operacional',
      content: 'Cancelamentos e reagendamentos devem ser solicitados com antecedência mínima de 2 horas. O agente de voz pode verificar a agenda dos próximos 7 dias úteis.',
      status: 'ACTIVE',
      assignedAgentIds: ['ag-01', 'ag-03'],
      tokenCount: 510,
      updatedAt: '2026-11-06T14:00:00Z'
    },
    {
      id: 'kn-04',
      title: 'Catálogo de Planos Vozly Voice AI & SLA de Voz',
      type: 'DOCUMENT',
      category: 'Comercial',
      content: 'Todos os planos Vozly contam com disponibilidade garantida de 99,5%, síntese neural com baixa latência (<400ms) e transcrição com pontuação automática em português brasileiro.',
      status: 'ACTIVE',
      assignedAgentIds: ['ag-02'],
      tokenCount: 780,
      updatedAt: '2026-11-01T09:00:00Z'
    }
  ]);

  // ==========================================
  // NÚMEROS TELEFÔNICOS CADASTRADOS
  // ==========================================
  readonly phoneNumbers = signal<PhoneNumber[]>([
    {
      id: 'ph-01',
      e164: '+551140038899',
      formatted: '(11) 4003-8899',
      provider: 'SIP Trunking Brasil (Telecom Nacional)',
      status: 'ACTIVE',
      assignedAgentId: 'ag-01',
      assignedAgentName: 'Helena — Atendimento Principal & SAC',
      routingConfig: {
        fallbackDestination: '+5511987654321',
        businessHours: 'Seg-Sex 08:00 - 20:00'
      }
    },
    {
      id: 'ph-02',
      e164: '+551130032211',
      formatted: '(11) 3003-2211',
      provider: 'SIP Trunking Corporativo',
      status: 'ACTIVE',
      assignedAgentId: 'ag-02',
      assignedAgentName: 'Vitor — Vendas & Qualificação de Leads',
      routingConfig: {
        fallbackDestination: '+5511999887766',
        businessHours: 'Seg-Sex 09:00 - 18:00'
      }
    },
    {
      id: 'ph-03',
      e164: '+551140049900',
      formatted: '(11) 4004-9900',
      provider: 'DID Virtual Cloud',
      status: 'PENDING',
      assignedAgentId: null,
      routingConfig: {
        fallbackDestination: '',
        businessHours: '24 Horas'
      }
    }
  ]);

  // ==========================================
  // AGENTES DE INTELIGÊNCIA ARTIFICIAL
  // ==========================================
  readonly agents = signal<Agent[]>([
    {
      id: 'ag-01',
      name: 'Helena — Atendimento Principal & SAC',
      description: 'Agente de voz principal encarregada de tirar dúvidas, triar solicitações, emitir boletos e transferir casos críticos para a equipe de suporte.',
      status: 'ACTIVE',
      language: 'pt-BR',
      draftRevision: 6,
      currentPublishedVersion: 2,
      instructions: `Você é Helena, assistente virtual de voz da empresa Vozly.
Sua comunicação deve ser clara, empática, profissional e objetiva.
Sempre cumprimente cordialmente o cliente, pergunte como pode ajudar e forneça respostas baseadas exclusivamente na base de conhecimento autorizada.
Caso o cliente queira falar com um atendente humano ou se a demanda envolver cancelamento de contrato ou reclamação grave, transfira imediatamente usando a ferramenta call.transfer.`,
      voiceConfig: {
        voiceId: 'pt-BR-Wavenet-Helena',
        voiceName: 'Helena (Voz Neural Feminina Clara)',
        provider: 'Neural Voice Engine v2',
        language: 'pt-BR',
        speed: 1.0,
        pitch: 1.0,
        interruptionSensitivity: 'HIGH'
      },
      behavior: {
        openingMessage: 'Olá! Sou a Helena, assistente virtual da Vozly. Como posso ajudar você hoje?',
        fallbackMessage: 'Desculpe, não consegui entender perfeitamente ou não tenho essa informação no momento. Vou transferir você para nossa equipe humana.',
        closingMessage: 'Foi um prazer atender você! Tenha um ótimo dia e até logo.',
        transferPolicy: {
          enabled: true,
          destinationNumber: '+5511987654321',
          department: 'Suporte N2 Humanizado'
        },
        collectSummary: true
      },
      telephony: {
        phoneNumberId: 'ph-01',
        phoneNumber: '(11) 4003-8899',
        businessHours: '08:00 - 20:00',
        afterHoursBehavior: 'CLOSING_MESSAGE'
      },
      knowledgeItemIds: ['kn-01', 'kn-02', 'kn-03'],
      tools: [
        { toolKey: 'knowledge.search', toolName: 'Consultar Conhecimento', enabled: true, implementationType: 'NATIVE' },
        { toolKey: 'conversation.collect', toolName: 'Coletar Informações', enabled: true, implementationType: 'NATIVE' },
        { toolKey: 'call.transfer', toolName: 'Transferir Atendimento', enabled: true, implementationType: 'NATIVE' },
        { toolKey: 'call.request_callback', toolName: 'Solicitar Retorno', enabled: true, implementationType: 'NATIVE' },
        { toolKey: 'call.end', toolName: 'Encerrar Atendimento', enabled: true, implementationType: 'NATIVE' },
        { toolKey: 'http.rest', toolName: 'API do CRM Principal', enabled: true, implementationType: 'INTEGRATION_OPERATION', connectionId: 'conn-01' }
      ],
      createdAt: '2026-10-18T14:00:00Z',
      updatedAt: '2026-11-09T17:30:00Z',
      metrics: {
        totalCalls: 1284,
        completedCalls: 1102,
        transferredCalls: 86,
        resolutionRate: 94.2,
        avgDurationSeconds: 135
      }
    },
    {
      id: 'ag-02',
      name: 'Vitor — Vendas & Qualificação de Leads',
      description: 'Agente comercial focado na qualificação de empresas interessadas, apresentação de soluções e agendamento de reuniões com consultores.',
      status: 'ACTIVE',
      language: 'pt-BR',
      draftRevision: 4,
      currentPublishedVersion: 1,
      instructions: `Você é Vitor, consultor de inteligência de voz da Vozly.
Converse de forma engajada, demonstrando valor e fazendo perguntas de qualificação para entender o porte da empresa e volume de chamadas.`,
      voiceConfig: {
        voiceId: 'pt-BR-Neural-Vitor',
        voiceName: 'Vitor (Voz Neural Masculina Confiante)',
        provider: 'Neural Voice Engine v2',
        language: 'pt-BR',
        speed: 1.05,
        pitch: 0.95,
        interruptionSensitivity: 'NORMAL'
      },
      behavior: {
        openingMessage: 'Olá! Bem-vindo à Vozly. Sou o Vitor. Você gostaria de conhecer nossos agentes de voz ou agendar uma reunião comercial?',
        fallbackMessage: 'Perfeito, vou conectar você diretamente com um dos nossos consultores de negócios.',
        closingMessage: 'Agradecemos o seu interesse na Vozly! Entraremos em contato em breve.',
        transferPolicy: {
          enabled: true,
          destinationNumber: '+5511999887766',
          department: 'Mesa Comercial de Vendas'
        },
        collectSummary: true
      },
      telephony: {
        phoneNumberId: 'ph-02',
        phoneNumber: '(11) 3003-2211',
        businessHours: '09:00 - 18:00',
        afterHoursBehavior: 'TRANSFER'
      },
      knowledgeItemIds: ['kn-01', 'kn-04'],
      tools: [
        { toolKey: 'knowledge.search', toolName: 'Consultar Conhecimento', enabled: true, implementationType: 'NATIVE' },
        { toolKey: 'conversation.collect', toolName: 'Coletar Informações', enabled: true, implementationType: 'NATIVE' },
        { toolKey: 'call.transfer', toolName: 'Transferir Atendimento', enabled: true, implementationType: 'NATIVE' },
        { toolKey: 'http.webhook', toolName: 'Webhook Zendesk', enabled: true, implementationType: 'INTEGRATION_OPERATION', connectionId: 'conn-02' }
      ],
      createdAt: '2026-10-25T10:00:00Z',
      updatedAt: '2026-11-08T19:00:00Z',
      metrics: {
        totalCalls: 642,
        completedCalls: 532,
        transferredCalls: 74,
        resolutionRate: 88.5,
        avgDurationSeconds: 180
      }
    },
    {
      id: 'ag-03',
      name: 'Larissa — Agendamentos & Confirmações',
      description: 'Agente especializada em confirmação ativa de presenças, reagendamento de consultas e avisos de lembretes telefônicos.',
      status: 'DRAFT',
      language: 'pt-BR',
      draftRevision: 2,
      currentPublishedVersion: null,
      instructions: `Você é Larissa, responsável por agendamentos e lembretes amigáveis por telefone.`,
      voiceConfig: {
        voiceId: 'pt-BR-Wavenet-Larissa',
        voiceName: 'Larissa (Voz Neural Feminina Suave)',
        provider: 'Neural Voice Engine v2',
        language: 'pt-BR',
        speed: 0.98,
        pitch: 1.0,
        interruptionSensitivity: 'NORMAL'
      },
      behavior: {
        openingMessage: 'Olá! Sou a Larissa da equipe de agendamentos. Gostaria de confirmar seu horário?',
        fallbackMessage: 'Sem problemas, vou transferir para a recepção verificar as opções.',
        closingMessage: 'Seu agendamento está confirmado! Até logo.',
        transferPolicy: {
          enabled: true,
          destinationNumber: '',
          department: 'Recepção'
        },
        collectSummary: true
      },
      telephony: {
        phoneNumberId: '',
        phoneNumber: '',
        businessHours: '08:00 - 17:00',
        afterHoursBehavior: 'CLOSING_MESSAGE'
      },
      knowledgeItemIds: ['kn-03'],
      tools: [
        { toolKey: 'knowledge.search', toolName: 'Consultar Conhecimento', enabled: true, implementationType: 'NATIVE' },
        { toolKey: 'conversation.collect', toolName: 'Coletar Informações', enabled: true, implementationType: 'NATIVE' }
      ],
      createdAt: '2026-11-04T16:00:00Z',
      updatedAt: '2026-11-09T11:00:00Z',
      metrics: {
        totalCalls: 0,
        completedCalls: 0,
        transferredCalls: 0,
        resolutionRate: 0,
        avgDurationSeconds: 0
      }
    }
  ]);

  // ==========================================
  // CHAMADAS E CONVERSAS RECENTES (HISTÓRICO)
  // Conforme docs/08 e docs/09
  // ==========================================
  readonly calls = signal<Call[]>([
    {
      id: 'call-0192f6e0-8d5b-7c11-c001',
      callerNumber: '+55 (11) 98452-1102',
      agentId: 'ag-01',
      agentName: 'Helena — Atendimento Principal',
      agentVersion: 2,
      phoneNumber: '(11) 4003-8899',
      direction: 'INBOUND',
      status: 'IN_PROGRESS',
      outcome: 'RESOLVED',
      startedAt: 'Há 2 minutos',
      durationSeconds: 124,
      sentiment: 'POSITIVE',
      toolsExecuted: ['knowledge.search', 'conversation.collect'],
      summary: 'Cliente solicitou orientações para emissão de 2ª via de fatura e recebeu código de barras via SMS.',
      messages: [
        {
          sequence: 1,
          role: 'assistant',
          content: 'Olá! Sou a Helena, assistente virtual da Vozly. Como posso ajudar você hoje?',
          timestamp: '18:42:10'
        },
        {
          sequence: 2,
          role: 'user',
          content: 'Oi Helena, boa noite! Preciso da segunda via da minha fatura que vence amanhã.',
          timestamp: '18:42:16'
        },
        {
          sequence: 3,
          role: 'assistant',
          content: 'Com certeza! Pode me informar o CNPJ ou CPF cadastrado na sua conta, por gentileza?',
          timestamp: '18:42:20',
          toolCall: {
            toolKey: 'knowledge.search',
            inputSummary: 'segunda via boleto fatura regras',
            outputSummary: 'Recuperado item kn-02 (Relevância: 98%)',
            executionTimeMs: 140
          }
        },
        {
          sequence: 4,
          role: 'user',
          content: 'Claro, é o CPF 123.456.789-00.',
          timestamp: '18:42:28'
        },
        {
          sequence: 5,
          role: 'assistant',
          content: 'Localizei sua fatura de R$ 349,00 referente a Novembro. Deseja que eu envie o código PIX copia e cola para o seu número?',
          timestamp: '18:42:32',
          toolCall: {
            toolKey: 'http.rest',
            inputSummary: 'POST /v2/faturas/buscar { cpf: "123.456.789-00" }',
            outputSummary: 'Status 200 OK — Fatura ativa encontrada',
            executionTimeMs: 310
          }
        }
      ]
    },
    {
      id: 'call-0192f6e0-8d5b-7c11-c002',
      callerNumber: '+55 (19) 99120-4491',
      agentId: 'ag-01',
      agentName: 'Helena — Atendimento Principal',
      agentVersion: 2,
      phoneNumber: '(11) 4003-8899',
      direction: 'INBOUND',
      status: 'COMPLETED',
      outcome: 'RESOLVED',
      startedAt: 'Há 18 minutos',
      endedAt: 'Há 15 minutos',
      durationSeconds: 178,
      sentiment: 'POSITIVE',
      toolsExecuted: ['knowledge.search', 'call.end'],
      summary: 'Dúvidas sobre horários de funcionamento e agendamento de suporte técnico presencial.',
      messages: [
        {
          sequence: 1,
          role: 'assistant',
          content: 'Olá! Sou a Helena, assistente virtual da Vozly. Como posso ajudar você hoje?',
          timestamp: '18:25:00'
        },
        {
          sequence: 2,
          role: 'user',
          content: 'Boa noite. Vocês atendem presencialmente aos sábados?',
          timestamp: '18:25:08'
        },
        {
          sequence: 3,
          role: 'assistant',
          content: 'Nosso atendimento presencial ocorre de segunda a sexta, das 8h às 18h. Aos sábados nosso suporte opera exclusivamente via telefone de plantão 24h.',
          timestamp: '18:25:12'
        }
      ]
    },
    {
      id: 'call-0192f6e0-8d5b-7c11-c003',
      callerNumber: '+55 (21) 97600-8822',
      agentId: 'ag-01',
      agentName: 'Helena — Atendimento Principal',
      agentVersion: 2,
      phoneNumber: '(11) 4003-8899',
      direction: 'INBOUND',
      status: 'TRANSFERRED',
      outcome: 'TRANSFERRED_HUMAN',
      startedAt: 'Há 45 minutos',
      endedAt: 'Há 41 minutos',
      durationSeconds: 240,
      sentiment: 'NEUTRAL',
      toolsExecuted: ['call.transfer'],
      summary: 'Cliente solicitou negociação de dívida em aberto. Transferido com sucesso para equipe financeira humana.',
      messages: [
        {
          sequence: 1,
          role: 'assistant',
          content: 'Olá! Sou a Helena, assistente virtual da Vozly. Como posso ajudar?',
          timestamp: '18:00:10'
        },
        {
          sequence: 2,
          role: 'user',
          content: 'Preciso falar com alguém sobre renegociação de valores com desconto.',
          timestamp: '18:00:18'
        },
        {
          sequence: 3,
          role: 'assistant',
          content: 'Entendi perfeitamente. Para condições especiais de renegociação, estou transferindo você para nosso setor financeiro.',
          timestamp: '18:00:23',
          toolCall: {
            toolKey: 'call.transfer',
            inputSummary: '{ reason: "Renegociação de valores", department: "Financeiro" }',
            outputSummary: 'Transferência aceita no ramal 987654321',
            executionTimeMs: 220
          }
        }
      ]
    },
    {
      id: 'call-0192f6e0-8d5b-7c11-c004',
      callerNumber: '+55 (31) 98833-2211',
      agentId: 'ag-02',
      agentName: 'Vitor — Vendas & Leads',
      agentVersion: 1,
      phoneNumber: '(11) 3003-2211',
      direction: 'INBOUND',
      status: 'COMPLETED',
      outcome: 'RESOLVED',
      startedAt: 'Há 1 hora',
      endedAt: 'Há 56 minutos',
      durationSeconds: 210,
      sentiment: 'POSITIVE',
      toolsExecuted: ['conversation.collect', 'http.webhook'],
      summary: 'Lead qualificado com 40 colaboradores interessado em automatizar chamadas de agendamento.',
      messages: [
        {
          sequence: 1,
          role: 'assistant',
          content: 'Olá! Sou o Vitor da Vozly. Como posso ajudar com sua operação de voz?',
          timestamp: '17:45:00'
        },
        {
          sequence: 2,
          role: 'user',
          content: 'Vi a apresentação de vocês e temos uma clínica que recebe 3 mil chamadas por mês.',
          timestamp: '17:45:12'
        }
      ]
    },
    {
      id: 'call-0192f6e0-8d5b-7c11-c005',
      callerNumber: '+55 (41) 99911-3344',
      agentId: 'ag-01',
      agentName: 'Helena — Atendimento Principal',
      agentVersion: 2,
      phoneNumber: '(11) 4003-8899',
      direction: 'INBOUND',
      status: 'COMPLETED',
      outcome: 'CALLBACK_REQUESTED',
      startedAt: 'Há 2 horas',
      endedAt: 'Há 1 hora e 58 minutos',
      durationSeconds: 95,
      sentiment: 'NEUTRAL',
      toolsExecuted: ['call.request_callback'],
      summary: 'Cliente pediu retorno de ligação no período da manhã de amanhã.',
      messages: []
    }
  ]);

  // ==========================================
  // INDICADORES DE USO E CONSUMO
  // Conforme docs/08 e docs/09
  // ==========================================
  readonly usage = signal<UsageMetric>({
    totalMinutesUsed: 3420,
    monthlyMinutesLimit: 10000,
    concurrentPeakChannels: 8,
    concurrentChannelsLimit: 15,
    totalCallsMonth: 1926,
    toolExecutionsCount: 3140,
    dailyUsage: [
      { date: '03 Nov', minutes: 410, calls: 230 },
      { date: '04 Nov', minutes: 520, calls: 290 },
      { date: '05 Nov', minutes: 480, calls: 265 },
      { date: '06 Nov', minutes: 610, calls: 340 },
      { date: '07 Nov', minutes: 590, calls: 320 },
      { date: '08 Nov', minutes: 380, calls: 215 },
      { date: '09 Nov', minutes: 430, calls: 266 }
    ]
  });

  // ==========================================
  // TRILHA DE AUDITORIA (SEGURANÇA & GOVERNANÇA)
  // Conforme docs/08-modelo-relacional-e-persistencia.md
  // ==========================================
  readonly auditEvents = signal<AuditEvent[]>([
    {
      id: 'aud-01',
      actor: 'Jordan Silveira',
      actorRole: 'ADMIN',
      action: 'AGENT_PUBLISHED',
      resourceType: 'AGENT',
      resourceId: 'ag-01',
      occurredAt: '2026-11-09T17:30:00Z',
      correlationId: 'cor-9872134',
      metadataSafe: {
        agentName: 'Helena — Atendimento Principal & SAC',
        versionPublished: 2,
        draftRevisionMerged: 6
      }
    },
    {
      id: 'aud-02',
      actor: 'Jordan Silveira',
      actorRole: 'ADMIN',
      action: 'CONNECTION_VALIDATED',
      resourceType: 'CONNECTION',
      resourceId: 'conn-01',
      occurredAt: '2026-11-09T18:30:00Z',
      correlationId: 'cor-9872140',
      metadataSafe: {
        connectionName: 'API do CRM Principal',
        statusResult: 'CONNECTED',
        authType: 'BEARER_TOKEN'
      }
    },
    {
      id: 'aud-03',
      actor: 'Camila Albuquerque',
      actorRole: 'OWNER',
      action: 'KNOWLEDGE_ITEM_CREATED',
      resourceType: 'KNOWLEDGE',
      resourceId: 'kn-01',
      occurredAt: '2026-11-08T15:20:00Z',
      correlationId: 'cor-9871020',
      metadataSafe: {
        title: 'Políticas de Atendimento e Horários',
        type: 'FAQ'
      }
    },
    {
      id: 'aud-04',
      actor: 'Lucas Nogueira',
      actorRole: 'OPERATOR',
      action: 'CALL_INSPECTED',
      resourceType: 'AGENT',
      resourceId: 'call-0192f6e0-8d5b-7c11-c003',
      occurredAt: '2026-11-09T18:05:00Z',
      correlationId: 'cor-9872166',
      metadataSafe: {
        outcome: 'TRANSFERRED_HUMAN',
        agent: 'Helena'
      }
    }
  ]);

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
    if (active.length === 0) return 94.2;
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
