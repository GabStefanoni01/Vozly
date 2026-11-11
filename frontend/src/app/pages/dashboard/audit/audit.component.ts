import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { AuditEvent } from '../../../models/dashboard.models';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="audit-page">
      <!-- Cabeçalho -->
      <header class="page-header">
        <div class="header-titles">
          <div class="badge-title">
            <span class="badge-dot"></span>
            <span>SEGURANÇA, COMPLIANCE & GOVERNANÇA (DOCS/08 & DOCS/09)</span>
          </div>
          <h1 class="page-title">Trilha de Auditoria Imutável</h1>
          <p class="page-subtitle">
            Registro append-only de ações administrativas, publicações de agentes e acessos operacionais ao workspace.
          </p>
        </div>
      </header>

      <!-- Painel de Filtros -->
      <section class="filters-bar dash-glass-card">
        <div class="search-input-wrap">
          <app-icon name="search" [size]="16" color="#71717A"></app-icon>
          <input
            type="text"
            [(ngModel)]="searchFilter"
            placeholder="Buscar por ator, ação ou ID de correlação..."
            class="filter-input"
          />
        </div>

        <div class="filter-actions">
          <select [(ngModel)]="resourceFilter" class="filter-select" aria-label="Filtrar por recurso">
            <option value="ALL">Todos os Recursos</option>
            <option value="AGENT">Agentes</option>
            <option value="CONNECTION">Conexões</option>
            <option value="KNOWLEDGE">Conhecimento</option>
            <option value="MEMBERSHIP">Membros</option>
          </select>
        </div>
      </section>

      <!-- Tabela de Auditoria -->
      <section class="audit-table-card dash-glass-card">
        <div class="table-responsive">
          <table class="audit-table">
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Ator Responsável</th>
                <th>Ação Executada</th>
                <th>Recurso</th>
                <th>Correlation ID</th>
                <th>Metadados Sanitizados</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let event of filteredEvents">
                <td>
                  <span class="event-time">{{ formatDate(event.occurredAt) }}</span>
                </td>
                <td>
                  <div class="actor-cell">
                    <span class="actor-name">{{ event.actor }}</span>
                    <span class="actor-role">{{ event.actorRole }}</span>
                  </div>
                </td>
                <td>
                  <span class="action-badge" [ngClass]="getActionClass(event.action)">
                    {{ event.action }}
                  </span>
                </td>
                <td>
                  <span class="resource-pill">{{ event.resourceType }} #{{ event.resourceId }}</span>
                </td>
                <td>
                  <code class="corr-id">{{ event.correlationId }}</code>
                </td>
                <td>
                  <code class="metadata-code">{{ formatMetadata(event.metadataSafe) }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="filteredEvents.length === 0">
          <p>Nenhum evento de auditoria localizado com os filtros selecionados.</p>
        </div>
      </section>

      <!-- Aviso de Segurança LGPD -->
      <div class="info-callout dash-glass-card">
        <app-icon name="shield-check" [size]="18" color="#4ADE80"></app-icon>
        <p>
          Os registros de auditoria são imutáveis e protegidos contra edição ou exclusão. Segredos, senhas e tokens nunca são armazenados ou exibidos na trilha de auditoria (conforme seção 3.6 de docs/08).
        </p>
      </div>
    </div>
  `,
  styles: [`
    .audit-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header {
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

    .filters-bar {
      padding: 12px 16px;
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

    .filter-select {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      color: var(--text-primary);
      padding: 7px 14px;
      font-size: 12.5px;
      outline: none;
      cursor: pointer;
    }

    .filter-select option {
      background: #15151B;
      color: #FFFFFF;
    }

    .audit-table-card {
      padding: 4px;
      overflow: hidden;
    }

    .table-responsive {
      overflow-x: auto;
      width: 100%;
    }

    .audit-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }

    .audit-table th {
      padding: 14px 16px;
      color: var(--text-muted);
      font-size: 11.5px;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .audit-table td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      vertical-align: middle;
    }

    .event-time {
      font-size: 12px;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .actor-cell {
      display: flex;
      flex-direction: column;
    }

    .actor-name {
      font-weight: 600;
      color: #FFFFFF;
    }

    .actor-role {
      font-size: 10.5px;
      color: var(--light-purple);
      font-weight: 700;
    }

    .action-badge {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 600;
      font-family: var(--font-mono);
      white-space: nowrap;
    }

    .action-badge.publish {
      background: rgba(109, 0, 255, 0.2);
      color: #C084FC;
      border: 1px solid rgba(168, 85, 247, 0.35);
    }

    .action-badge.create {
      background: rgba(34, 197, 94, 0.15);
      color: #4ADE80;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .action-badge.default {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-secondary);
    }

    .resource-pill {
      font-size: 11.5px;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.04);
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .corr-id {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-muted);
    }

    .metadata-code {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--text-secondary);
      max-width: 300px;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .info-callout {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12.5px;
      color: var(--text-secondary);
    }

    .empty-state {
      padding: 36px;
      text-align: center;
      color: var(--text-muted);
    }
  `]
})
export class AuditComponent {
  searchFilter: string = '';
  resourceFilter: string = 'ALL';

  constructor(public state: DashboardStateService) {}

  get filteredEvents(): AuditEvent[] {
    return this.state.auditEvents().filter(e => {
      const matchSearch =
        !this.searchFilter.trim() ||
        e.actor.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
        e.action.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
        e.correlationId.toLowerCase().includes(this.searchFilter.toLowerCase());

      const matchRes = this.resourceFilter === 'ALL' || e.resourceType === this.resourceFilter;
      return matchSearch && matchRes;
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getActionClass(action: string): string {
    if (action.includes('PUBLISHED')) return 'publish';
    if (action.includes('CREATED')) return 'create';
    return 'default';
  }

  formatMetadata(meta: Record<string, any>): string {
    return JSON.stringify(meta);
  }
}
