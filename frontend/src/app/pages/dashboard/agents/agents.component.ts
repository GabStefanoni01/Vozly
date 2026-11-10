import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { VoiceTestModalComponent } from '../../../components/dashboard/voice-test-modal/voice-test-modal.component';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { Agent, AgentStatus } from '../../../models/dashboard.models';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, VoiceTestModalComponent],
  template: `
    <div class="agents-page">
      <!-- Cabeçalho da Página de Agentes -->
      <header class="page-header">
        <div class="header-titles">
          <div class="badge-title">
            <span class="badge-dot"></span>
            <span>GESTÃO DE AGENTES DE VOZ</span>
          </div>
          <h1 class="page-title">Agentes de Inteligência Artificial</h1>
          <p class="page-subtitle">
            Configure, gerencie versões publicadas e acompanhe a operação autônoma dos seus agentes telefônicos.
          </p>
        </div>

        <div class="header-actions">
          <a routerLink="/dashboard/agents/new" class="btn btn-primary btn-sm">
            <app-icon name="plus" [size]="16"></app-icon>
            <span>Criar Novo Agente</span>
          </a>
        </div>
      </header>

      <!-- Barra de Filtros e Pesquisa de Agentes -->
      <section class="filters-bar dash-glass-card">
        <div class="search-wrap">
          <app-icon name="search" [size]="16" color="#71717A"></app-icon>
          <input
            type="text"
            [(ngModel)]="searchFilter"
            placeholder="Buscar agente por nome, finalidade ou número..."
            class="filter-input"
          />
        </div>

        <div class="status-tabs">
          <button
            class="tab-btn"
            [class.active]="selectedTab() === 'ALL'"
            (click)="selectedTab.set('ALL')"
          >
            Todos ({{ state.agents().length }})
          </button>
          <button
            class="tab-btn"
            [class.active]="selectedTab() === 'ACTIVE'"
            (click)="selectedTab.set('ACTIVE')"
          >
            Ativos ({{ countByStatus('ACTIVE') }})
          </button>
          <button
            class="tab-btn"
            [class.active]="selectedTab() === 'DRAFT'"
            (click)="selectedTab.set('DRAFT')"
          >
            Rascunhos ({{ countByStatus('DRAFT') }})
          </button>
          <button
            class="tab-btn"
            [class.active]="selectedTab() === 'PAUSED'"
            (click)="selectedTab.set('PAUSED')"
          >
            Pausados ({{ countByStatus('PAUSED') }})
          </button>
        </div>
      </section>

      <!-- Grid de Cards de Agentes -->
      <section class="agents-grid">
        <div
          class="dash-glass-card agent-card"
          *ngFor="let agent of filteredAgents"
          [class.active-card]="agent.status === 'ACTIVE'"
        >
          <!-- Topo do Card do Agente -->
          <div class="agent-card-top">
            <div class="agent-avatar-pill" [class.active-glow]="agent.status === 'ACTIVE'">
              <app-icon name="bot" [size]="22"></app-icon>
            </div>

            <div class="agent-status-badges">
              <span class="dash-badge" [ngClass]="getStatusBadgeClass(agent.status)">
                <span class="badge-dot" *ngIf="agent.status === 'ACTIVE'"></span>
                {{ formatStatus(agent.status) }}
              </span>

              <span class="dash-badge dash-badge-neutral">
                {{ agent.currentPublishedVersion ? 'v' + agent.currentPublishedVersion + '.0' : 'Rascunho rev ' + agent.draftRevision }}
              </span>
            </div>
          </div>

          <!-- Informações Principais -->
          <div class="agent-info-section">
            <h3 class="agent-name">{{ agent.name }}</h3>
            <p class="agent-desc">{{ agent.description }}</p>
          </div>

          <!-- Configurações Rápidas de Voz & Linha -->
          <div class="agent-specs-grid">
            <div class="spec-item">
              <app-icon name="mic" [size]="14" color="#A855F7"></app-icon>
              <div class="spec-text">
                <span class="spec-label">Voz Neural</span>
                <span class="spec-value">{{ agent.voiceConfig.voiceName.split(' ')[0] }}</span>
              </div>
            </div>

            <div class="spec-item">
              <app-icon name="phone" [size]="14" color="#4ADE80"></app-icon>
              <div class="spec-text">
                <span class="spec-label">Linha Ativa</span>
                <span class="spec-value">{{ agent.telephony.phoneNumber || 'Não vinculada' }}</span>
              </div>
            </div>

            <div class="spec-item">
              <app-icon name="book-open" [size]="14" color="#38BDF8"></app-icon>
              <div class="spec-text">
                <span class="spec-label">Base</span>
                <span class="spec-value">{{ agent.knowledgeItemIds.length }} itens</span>
              </div>
            </div>

            <div class="spec-item">
              <app-icon name="cpu" [size]="14" color="#FBBF24"></app-icon>
              <div class="spec-text">
                <span class="spec-label">Ferramentas</span>
                <span class="spec-value">{{ countActiveTools(agent) }} habilitadas</span>
              </div>
            </div>
          </div>

          <!-- Métricas de Desempenho Operacional -->
          <div class="agent-metrics-bar">
            <div class="metric-item">
              <span class="metric-number">{{ agent.metrics.totalCalls }}</span>
              <span class="metric-caption">Chamadas</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <span class="metric-number highlight">{{ agent.metrics.resolutionRate }}%</span>
              <span class="metric-caption">Resolução</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <span class="metric-number">{{ agent.metrics.avgDurationSeconds }}s</span>
              <span class="metric-caption">Duração Média</span>
            </div>
          </div>

          <!-- Ações do Agente -->
          <div class="agent-card-actions">
            <button
              class="btn btn-secondary btn-sm btn-test"
              (click)="openSimulator(agent)"
              title="Abrir simulador interativo de conversação"
            >
              <app-icon name="mic" [size]="14"></app-icon>
              <span>Testar Voz</span>
            </button>

            <a
              [routerLink]="['/dashboard/agents/wizard', agent.id]"
              class="btn btn-primary btn-sm btn-edit"
              title="Acessar assistente de configuração guiada"
            >
              <app-icon name="edit-2" [size]="14"></app-icon>
              <span>Configurar</span>
            </a>

            <button
              class="btn-icon-more"
              (click)="toggleStatus(agent)"
              [title]="agent.status === 'ACTIVE' ? 'Pausar Agente' : 'Ativar Agente'"
            >
              <app-icon [name]="agent.status === 'ACTIVE' ? 'pause' : 'play'" [size]="16"></app-icon>
            </button>
          </div>
        </div>
      </section>

      <!-- Estado Vazio se nenhum agente encontrado -->
      <div class="empty-state dash-glass-card" *ngIf="filteredAgents.length === 0">
        <div class="empty-icon-pill">
          <app-icon name="bot" [size]="32" color="#A855F7"></app-icon>
        </div>
        <h3>Nenhum agente encontrado</h3>
        <p>Não encontramos agentes correspondentes aos filtros selecionados.</p>
        <button class="btn btn-primary btn-sm" (click)="searchFilter = ''; selectedTab.set('ALL')">
          Limpar Filtros
        </button>
      </div>
    </div>

    <!-- Modal do Simulador de Voz -->
    <app-voice-test-modal
      [isOpen]="isSimulatorOpen()"
      [selectedAgent]="selectedAgentForTest()"
      (closeEvent)="isSimulatorOpen.set(false)"
    ></app-voice-test-modal>
  `,
  styles: [`
    .agents-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .header-titles {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .badge-title {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      color: #C084FC;
      letter-spacing: 0.05em;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #A855F7;
    }

    .page-title {
      font-size: 26px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 13.5px;
      color: var(--text-secondary);
      max-width: 640px;
    }

    /* Barra de Filtros */
    .filters-bar {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 14px;
    }

    .search-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      max-width: 400px;
      background: rgba(11, 11, 15, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 8px 12px;
    }

    .filter-input {
      background: transparent;
      border: none;
      color: #FFFFFF;
      font-size: 13px;
      width: 100%;
      outline: none;
    }

    .status-tabs {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 10px;
      padding: 4px;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .tab-btn {
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 500;
      color: var(--text-secondary);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .tab-btn:hover {
      color: #FFFFFF;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, rgba(109, 0, 255, 0.8) 0%, rgba(139, 61, 255, 0.7) 100%);
      color: #FFFFFF;
      font-weight: 600;
    }

    /* Grid de Cards */
    .agents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 22px;
    }

    @media (max-width: 600px) {
      .agents-grid {
        grid-template-columns: 1fr;
      }
    }

    .agent-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 18px;
      position: relative;
    }

    .agent-card.active-card {
      border-color: rgba(168, 85, 247, 0.28);
    }

    .agent-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .agent-avatar-pill {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      background: rgba(109, 0, 255, 0.16);
      border: 1px solid rgba(168, 85, 247, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #C084FC;
    }

    .agent-avatar-pill.active-glow {
      box-shadow: 0 0 18px rgba(109, 0, 255, 0.35);
    }

    .agent-status-badges {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .agent-name {
      font-size: 17px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 6px;
      letter-spacing: -0.01em;
    }

    .agent-desc {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .agent-specs-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 12px;
    }

    .spec-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .spec-text {
      display: flex;
      flex-direction: column;
    }

    .spec-label {
      font-size: 10.5px;
      color: var(--text-muted);
    }

    .spec-value {
      font-size: 12px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .agent-metrics-bar {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 10px;
      border-radius: 12px;
      background: rgba(109, 0, 255, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.2);
    }

    .metric-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .metric-number {
      font-size: 15px;
      font-weight: 700;
      color: #FFFFFF;
      font-family: var(--font-display);
    }

    .metric-number.highlight {
      color: #C084FC;
    }

    .metric-caption {
      font-size: 10.5px;
      color: var(--text-secondary);
    }

    .metric-divider {
      width: 1px;
      height: 24px;
      background: rgba(255, 255, 255, 0.08);
    }

    .agent-card-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      padding-top: 6px;
    }

    .btn-test {
      flex: 1;
    }

    .btn-edit {
      flex: 1;
    }

    .btn-icon-more {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
      cursor: pointer;
    }

    .btn-icon-more:hover {
      background: rgba(109, 0, 255, 0.2);
      border-color: rgba(168, 85, 247, 0.4);
      color: #FFFFFF;
    }

    /* Empty state */
    .empty-state {
      padding: 48px 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .empty-icon-pill {
      width: 64px;
      height: 64px;
      border-radius: 20px;
      background: rgba(109, 0, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
    }
  `]
})
export class AgentsComponent {
  selectedTab = signal<'ALL' | 'ACTIVE' | 'DRAFT' | 'PAUSED'>('ALL');
  searchFilter: string = '';

  isSimulatorOpen = signal<boolean>(false);
  selectedAgentForTest = signal<Agent | null>(null);

  constructor(public state: DashboardStateService, private router: Router) {}

  get filteredAgents(): Agent[] {
    return this.state.agents().filter(agent => {
      const matchTab = this.selectedTab() === 'ALL' || agent.status === this.selectedTab();
      const matchQuery =
        !this.searchFilter.trim() ||
        agent.name.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
        agent.description.toLowerCase().includes(this.searchFilter.toLowerCase());
      return matchTab && matchQuery;
    });
  }

  countByStatus(status: AgentStatus): number {
    return this.state.agents().filter(a => a.status === status).length;
  }

  countActiveTools(agent: Agent): number {
    return agent.tools.filter(t => t.enabled).length;
  }

  getStatusBadgeClass(status: AgentStatus): string {
    switch (status) {
      case 'ACTIVE': return 'dash-badge-green';
      case 'DRAFT': return 'dash-badge-amber';
      case 'PAUSED': return 'dash-badge-purple';
      default: return 'dash-badge-neutral';
    }
  }

  formatStatus(status: AgentStatus): string {
    switch (status) {
      case 'ACTIVE': return 'Ativo';
      case 'DRAFT': return 'Rascunho';
      case 'PAUSED': return 'Pausado';
      default: return status;
    }
  }

  openSimulator(agent: Agent): void {
    this.selectedAgentForTest.set(agent);
    this.isSimulatorOpen.set(true);
  }

  toggleStatus(agent: Agent): void {
    this.state.toggleAgentStatus(agent.id);
  }
}
