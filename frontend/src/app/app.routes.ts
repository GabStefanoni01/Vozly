import { Routes } from '@angular/router';

export const routes: Routes = [
  // Landing Page Institucional
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing-page/landing-page.component').then(m => m.LandingPageComponent),
    title: 'Vozly — Agentes Inteligentes de Voz para Atendimento Telefônico'
  },

  // Acesso / Login
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'Acessar Plataforma — Vozly AI'
  },

  // Dashboard Operacional da Plataforma (Fase 02)
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard-layout/dashboard-layout.component').then(
        m => m.DashboardLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/overview/overview.component').then(m => m.OverviewComponent),
        title: 'Visão Geral — Vozly AI'
      },
      {
        path: 'agents',
        loadComponent: () =>
          import('./pages/dashboard/agents/agents.component').then(m => m.AgentsComponent),
        title: 'Agentes de IA — Vozly'
      },
      {
        path: 'agents/new',
        loadComponent: () =>
          import('./pages/dashboard/agent-wizard/agent-wizard.component').then(
            m => m.AgentWizardComponent
          ),
        title: 'Novo Agente — Vozly'
      },
      {
        path: 'agents/wizard/:id',
        loadComponent: () =>
          import('./pages/dashboard/agent-wizard/agent-wizard.component').then(
            m => m.AgentWizardComponent
          ),
        title: 'Configurar Agente — Vozly'
      },
      {
        path: 'conversations',
        loadComponent: () =>
          import('./pages/dashboard/conversations/conversations.component').then(
            m => m.ConversationsComponent
          ),
        title: 'Conversas & Chamadas — Vozly'
      },
      {
        path: 'knowledge',
        loadComponent: () =>
          import('./pages/dashboard/knowledge/knowledge.component').then(
            m => m.KnowledgeComponent
          ),
        title: 'Base de Conhecimento — Vozly'
      },
      {
        path: 'integrations',
        loadComponent: () =>
          import('./pages/dashboard/integrations/integrations.component').then(
            m => m.IntegrationsComponent
          ),
        title: 'Ferramentas & Integrações — Vozly'
      },
      {
        path: 'telephony',
        loadComponent: () =>
          import('./pages/dashboard/telephony/telephony.component').then(
            m => m.TelephonyComponent
          ),
        title: 'Telefonia & Linhas — Vozly'
      },
      {
        path: 'usage',
        loadComponent: () =>
          import('./pages/dashboard/usage/usage.component').then(m => m.UsageComponent),
        title: 'Utilização & Consumo — Vozly'
      },
      {
        path: 'audit',
        loadComponent: () =>
          import('./pages/dashboard/audit/audit.component').then(m => m.AuditComponent),
        title: 'Trilha de Auditoria — Vozly'
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/dashboard/settings/settings.component').then(
            m => m.SettingsComponent
          ),
        title: 'Configurações do Workspace — Vozly'
      }
    ]
  },

  // Fallback
  { path: '**', redirectTo: '' }
];
