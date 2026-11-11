import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SsoCallbackComponent } from './pages/auth/sso-callback.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auth/sso/callback', component: SsoCallbackComponent },

  // Painel autenticado — exige sessão válida (authGuard); páginas carregadas sob demanda.
  {
    path: 'dashboard',
    canActivate: [authGuard],
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

  { path: '**', redirectTo: '' }
];
