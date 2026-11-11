import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { CallDetailsModalComponent } from '../../../components/dashboard/call-details-modal/call-details-modal.component';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { Call, CallOutcome, CallStatus } from '../../../models/dashboard.models';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, CallDetailsModalComponent],
  template: `
    <div class="conversations-page">
      <!-- Cabeçalho -->
      <header class="page-header">
        <div class="header-titles">
          <div class="badge-title">
            <span class="badge-dot"></span>
            <span>CENTRAL DE ATENDIMENTOS & HISTÓRICO</span>
          </div>
          <h1 class="page-title">Conversas & Chamadas Telefônicas</h1>
          <p class="page-subtitle">
            Acompanhe em tempo real as chamadas recebidas, transcrições turn-by-turn e execuções de ferramentas.
          </p>
        </div>

        <div class="header-stats-row">
          <div class="mini-stat-card dash-glass-card">
            <span class="msc-label">Chamadas Atendidas</span>
            <span class="msc-val">1.284</span>
          </div>
          <div class="mini-stat-card dash-glass-card">
            <span class="msc-label">Resolução Direta</span>
            <span class="msc-val green">94.2%</span>
          </div>
          <div class="mini-stat-card dash-glass-card">
            <span class="msc-label">Transferidas</span>
            <span class="msc-val purple">86</span>
          </div>
        </div>
      </header>

      <!-- Barra de Filtros Avançada -->
      <section class="filters-panel dash-glass-card">
        <div class="search-input-wrap">
          <app-icon name="search" [size]="16" color="#71717A"></app-icon>
          <input
            type="text"
            [(ngModel)]="searchFilter"
            placeholder="Buscar por telefone, resumo ou identificador de chamada..."
            class="filter-input"
          />
        </div>

        <div class="select-filters">
          <select [(ngModel)]="statusFilter" class="filter-select" aria-label="Filtrar por status">
            <option value="ALL">Todos os Status</option>
            <option value="IN_PROGRESS">Em Andamento</option>
            <option value="COMPLETED">Concluídas</option>
            <option value="TRANSFERRED">Transferidas</option>
          </select>

          <select [(ngModel)]="outcomeFilter" class="filter-select" aria-label="Filtrar por resultado">
            <option value="ALL">Todos os Resultados</option>
            <option value="RESOLVED">Resolvida pela IA</option>
            <option value="TRANSFERRED_HUMAN">Transferida para Humano</option>
            <option value="CALLBACK_REQUESTED">Retorno Solicitado</option>
          </select>

          <select [(ngModel)]="agentFilter" class="filter-select" aria-label="Filtrar por agente">
            <option value="ALL">Todos os Agentes</option>
            <option *ngFor="let ag of state.agents()" [value]="ag.id">
              {{ ag.name }}
            </option>
          </select>
        </div>
      </section>

      <!-- Tabela de Chamadas -->
      <section class="calls-table-card dash-glass-card">
        <div class="table-responsive">
          <table class="calls-table">
            <thead>
              <tr>
                <th>Interlocutor</th>
                <th>Agente & Versão</th>
                <th>Horário</th>
                <th>Duração</th>
                <th>Status</th>
                <th>Resultado</th>
                <th>Ferramentas</th>
                <th class="text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              <tr
                *ngFor="let call of filteredCalls"
                (click)="openCallDetails(call)"
                class="call-row"
              >
                <td>
                  <div class="caller-cell">
                    <span class="caller-number">{{ call.callerNumber }}</span>
                    <span class="caller-ref">#{{ call.id.substring(call.id.length - 6).toUpperCase() }}</span>
                  </div>
                </td>
                <td>
                  <div class="agent-cell">
                    <span class="agent-title">{{ call.agentName }}</span>
                    <span class="agent-v">v{{ call.agentVersion }}.0</span>
                  </div>
                </td>
                <td>
                  <span class="call-time-text">{{ call.startedAt }}</span>
                </td>
                <td>
                  <span class="duration-pill">{{ formatDuration(call.durationSeconds) }}</span>
                </td>
                <td>
                  <span class="dash-badge" [ngClass]="getStatusBadgeClass(call.status)">
                    <span class="badge-dot" *ngIf="call.status === 'IN_PROGRESS'"></span>
                    {{ formatStatus(call.status) }}
                  </span>
                </td>
                <td>
                  <span class="outcome-text" [ngClass]="getOutcomeClass(call.outcome)">
                    {{ formatOutcome(call.outcome) }}
                  </span>
                </td>
                <td>
                  <div class="tools-badges-wrap">
                    <span
                      class="tool-mini-badge"
                      *ngFor="let tool of call.toolsExecuted"
                      [title]="tool"
                    >
                      {{ tool.split('.')[1] || tool }}
                    </span>
                  </div>
                </td>
                <td class="text-right">
                  <button class="btn-inspect" (click)="openCallDetails(call); $event.stopPropagation()">
                    <app-icon name="eye" [size]="15"></app-icon>
                    <span>Ver</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="filteredCalls.length === 0">
          <p>Nenhuma chamada encontrada com os filtros informados.</p>
        </div>
      </section>
    </div>

    <!-- Modal de Detalhes da Chamada e Transcrição -->
    <app-call-details-modal
      [isOpen]="isModalOpen()"
      [call]="selectedCall()"
      (closeEvent)="isModalOpen.set(false)"
    ></app-call-details-modal>
  `,
  styles: [`
    .conversations-page {
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

    .header-stats-row {
      display: flex;
      gap: 12px;
    }

    .mini-stat-card {
      padding: 10px 18px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .msc-label {
      font-size: 11px;
      color: var(--text-muted);
    }

    .msc-val {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      font-family: var(--font-display);
    }

    .msc-val.green { color: #4ADE80; }
    .msc-val.purple { color: #C084FC; }

    /* Painel de Filtros */
    .filters-panel {
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 14px;
    }

    .search-input-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      max-width: 440px;
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

    .select-filters {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .filter-select {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      color: var(--text-primary);
      padding: 7px 12px;
      font-size: 12.5px;
      outline: none;
      cursor: pointer;
    }

    .filter-select option {
      background: #15151B;
      color: #FFFFFF;
    }

    /* Tabela */
    .calls-table-card {
      padding: 4px;
      overflow: hidden;
    }

    .table-responsive {
      overflow-x: auto;
      width: 100%;
    }

    .calls-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }

    .calls-table th {
      padding: 14px 16px;
      color: var(--text-muted);
      font-size: 11.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .calls-table td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      vertical-align: middle;
    }

    .call-row {
      cursor: pointer;
      transition: background var(--transition-fast);
    }

    .call-row:hover {
      background: rgba(109, 0, 255, 0.08);
    }

    .caller-cell {
      display: flex;
      flex-direction: column;
    }

    .caller-number {
      font-weight: 600;
      color: #FFFFFF;
    }

    .caller-ref {
      font-size: 11px;
      color: var(--light-purple);
      font-family: var(--font-mono);
    }

    .agent-cell {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .agent-title {
      font-weight: 600;
      color: #FFFFFF;
    }

    .agent-v {
      font-size: 10.5px;
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.05);
      padding: 1px 5px;
      border-radius: 4px;
    }

    .call-time-text {
      color: var(--text-secondary);
      font-size: 12px;
    }

    .duration-pill {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-secondary);
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #C084FC;
      box-shadow: 0 0 6px #C084FC;
      animation: pulseGlow 1.8s infinite;
    }

    .outcome-text {
      font-size: 12px;
      font-weight: 500;
    }

    .outcome-text.green { color: #4ADE80; }
    .outcome-text.blue { color: #38BDF8; }
    .outcome-text.amber { color: #FBBF24; }

    .tools-badges-wrap {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .tool-mini-badge {
      font-size: 10.5px;
      padding: 2px 6px;
      border-radius: 6px;
      background: rgba(109, 0, 255, 0.15);
      color: #C084FC;
      border: 1px solid rgba(168, 85, 247, 0.25);
      font-family: var(--font-mono);
    }

    .text-right {
      text-align: right;
    }

    .btn-inspect {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 10px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-secondary);
      font-size: 12px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .btn-inspect:hover {
      background: rgba(109, 0, 255, 0.2);
      border-color: rgba(168, 85, 247, 0.4);
      color: #FFFFFF;
    }

    .empty-state {
      padding: 36px;
      text-align: center;
      color: var(--text-muted);
    }
  `]
})
export class ConversationsComponent {
  searchFilter: string = '';
  statusFilter: string = 'ALL';
  outcomeFilter: string = 'ALL';
  agentFilter: string = 'ALL';

  isModalOpen = signal<boolean>(false);
  selectedCall = signal<Call | null>(null);

  constructor(public state: DashboardStateService) {}

  get filteredCalls(): Call[] {
    return this.state.calls().filter(c => {
      const matchSearch =
        !this.searchFilter.trim() ||
        c.callerNumber.includes(this.searchFilter) ||
        c.summary.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
        c.id.toLowerCase().includes(this.searchFilter.toLowerCase());

      const matchStatus = this.statusFilter === 'ALL' || c.status === this.statusFilter;
      const matchOutcome = this.outcomeFilter === 'ALL' || c.outcome === this.outcomeFilter;
      const matchAgent = this.agentFilter === 'ALL' || c.agentId === this.agentFilter;

      return matchSearch && matchStatus && matchOutcome && matchAgent;
    });
  }

  formatStatus(status: CallStatus): string {
    switch (status) {
      case 'IN_PROGRESS': return 'Em Andamento';
      case 'COMPLETED': return 'Concluída';
      case 'TRANSFERRED': return 'Transferida';
      case 'FAILED': return 'Falha';
      case 'MISSED': return 'Perdida';
      default: return status;
    }
  }

  formatOutcome(outcome: CallOutcome): string {
    switch (outcome) {
      case 'RESOLVED': return 'Resolvida';
      case 'TRANSFERRED_HUMAN': return 'Transferida';
      case 'CALLBACK_REQUESTED': return 'Retorno';
      default: return outcome;
    }
  }

  getOutcomeClass(outcome: CallOutcome): string {
    switch (outcome) {
      case 'RESOLVED': return 'green';
      case 'TRANSFERRED_HUMAN': return 'blue';
      case 'CALLBACK_REQUESTED': return 'amber';
      default: return '';
    }
  }

  getStatusBadgeClass(status: CallStatus): string {
    switch (status) {
      case 'IN_PROGRESS': return 'dash-badge-purple';
      case 'COMPLETED': return 'dash-badge-green';
      case 'TRANSFERRED': return 'dash-badge-blue';
      case 'FAILED':
      case 'MISSED': return 'dash-badge-red';
      default: return 'dash-badge-neutral';
    }
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  openCallDetails(call: Call): void {
    this.selectedCall.set(call);
    this.isModalOpen.set(true);
  }
}
