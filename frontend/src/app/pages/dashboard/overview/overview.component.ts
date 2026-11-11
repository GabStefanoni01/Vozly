import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { KpiCardComponent } from '../../../components/dashboard/overview/kpi-card.component';
import { ActivityChartComponent } from '../../../components/dashboard/overview/activity-chart.component';
import { EndReasonsComponent } from '../../../components/dashboard/overview/end-reasons.component';
import { RecentCallsTableComponent } from '../../../components/dashboard/overview/recent-calls-table.component';
import { AgentsSummaryComponent } from '../../../components/dashboard/overview/agents-summary.component';
import { ActivationChecklistComponent } from '../../../components/dashboard/overview/activation-checklist.component';
import { SystemHealthComponent } from '../../../components/dashboard/overview/system-health.component';
import { PhoneNumbersSummaryComponent } from '../../../components/dashboard/overview/phone-numbers-summary.component';
import { DashboardApiService, DashboardRange } from '../../../core/api/dashboard-api.service';
import { SessionStore } from '../../../core/api/session.store';
import { remoteResource } from '../../../core/api/remote-resource';
import { fmtDuration, fmtNumber, fmtPercent, percentDelta } from '../../../components/dashboard/overview/overview-format';

const RANGE_LABEL: Record<DashboardRange, string> = {
  today: 'Hoje',
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias'
};

/**
 * VISÃO GERAL DO PAINEL
 *
 * Todos os números vêm da API administrativa; não há dados fictícios.
 * Mapa de dependências (detalhes em core/api/backend-contracts.ts):
 *
 * | Bloco                         | Endpoint                         | Backend         |
 * |-------------------------------|----------------------------------|-----------------|
 * | Saudação / workspace          | GET /me, GET /tenants/current    | ⏳ pendente     |
 * | KPIs, gráfico, resultados     | GET /usage/summary               | ⏳ pendente     |
 * | Chamadas recentes             | GET /calls                       | ⏳ pendente     |
 * | Agentes                       | GET /agents                      | ⏳ pendente     |
 * | Ativação                      | GET /onboarding                  | ⏳ pendente     |
 * | Números                       | GET /phone-numbers               | ⏳ pendente     |
 * | Saúde da plataforma           | GET /actuator/health             | ✅ disponível   |
 */
@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    RouterLink,
    IconComponent,
    KpiCardComponent,
    ActivityChartComponent,
    EndReasonsComponent,
    RecentCallsTableComponent,
    AgentsSummaryComponent,
    ActivationChecklistComponent,
    SystemHealthComponent,
    PhoneNumbersSummaryComponent
  ],
  template: `
    <div class="page">
      <!-- Cabeçalho da página -->
      <header class="page-head">
        <div class="page-title-block">
          <h1 class="page-title">{{ greeting() }}</h1>
          <p class="page-sub">
            {{ session.tenant.data()?.name ?? 'Visão geral da operação de voz' }}
            <span class="dot-sep">•</span>
            {{ todayLabel }}
          </p>
        </div>

        <div class="page-actions">
          <div class="vz-seg" role="tablist" aria-label="Período">
            @for (r of ranges; track r) {
              <button type="button" role="tab" [class.active]="range() === r" [attr.aria-selected]="range() === r" (click)="setRange(r)">
                {{ rangeLabel[r] }}
              </button>
            }
          </div>
          <button type="button" class="vz-btn" (click)="refreshAll()" title="Atualizar dados">
            <app-icon name="refresh-cw" [size]="14"></app-icon>
            <span class="hide-sm">Atualizar</span>
          </button>
        </div>
      </header>

      <div class="layout">
        <!-- Coluna principal -->
        <div class="main-col">
          <section class="kpis" aria-label="Indicadores do período">
            <app-kpi-card
              [featured]="true"
              label="Chamadas no período"
              icon="phone-call"
              [value]="kpiTotal()"
              [delta]="kpiTotalDelta()"
              hint="vs. período anterior"
              source="/usage/summary"
              [status]="summary.status()"
            />
            <app-kpi-card
              label="Em andamento agora"
              icon="activity"
              [value]="kpiInProgress()"
              hint="chamadas ativas ou transferindo"
              source="/usage/summary"
              [status]="summary.status()"
            />
            <app-kpi-card
              label="Transferidas para humano"
              icon="phone-forwarded"
              [value]="kpiTransferred()"
              [hint]="kpiTransferredHint()"
              source="/usage/summary"
              [status]="summary.status()"
            />
            <app-kpi-card
              label="Duração média"
              icon="clock"
              [value]="kpiAvgDuration()"
              [hint]="kpiTotalMinutes()"
              source="/usage/summary"
              [status]="summary.status()"
            />
          </section>

          <div class="row-chart">
            <app-activity-chart
              [series]="summary.data()?.series ?? null"
              [status]="summary.status()"
              [error]="summary.error()"
              [rangeLabel]="rangeLabel[range()]"
              (retry)="summary.reload()"
            />
            <app-end-reasons
              [summary]="summary.data()"
              [status]="summary.status()"
              [error]="summary.error()"
              (retry)="summary.reload()"
            />
          </div>

          <app-recent-calls-table
            [page]="calls.data()"
            [status]="calls.status()"
            [error]="calls.error()"
            (retry)="calls.reload()"
          />

          <div class="row-split">
            <app-agents-summary
              [page]="agents.data()"
              [status]="agents.status()"
              [error]="agents.error()"
              (retry)="agents.reload()"
            />
            <app-phone-numbers-summary
              [page]="phoneNumbers.data()"
              [status]="phoneNumbers.status()"
              [error]="phoneNumbers.error()"
              (retry)="phoneNumbers.reload()"
            />
          </div>
        </div>

        <!-- Coluna lateral -->
        <aside class="side-col" aria-label="Status do workspace">
          <app-activation-checklist
            [onboarding]="onboarding.data()"
            [status]="onboarding.status()"
            [error]="onboarding.error()"
            (retry)="onboarding.reload()"
          />

          <section class="vz-panel quick">
            <h2 class="vz-panel-title">Ações rápidas</h2>
            <div class="quick-grid">
              @for (a of quickActions; track a.label) {
                <a [routerLink]="a.route" class="quick-item">
                  <span class="quick-icon"><app-icon [name]="a.icon" [size]="16"></app-icon></span>
                  <span>{{ a.label }}</span>
                </a>
              }
            </div>
          </section>

          <app-system-health
            [health]="session.health.data()"
            [status]="session.health.status()"
            (refresh)="session.health.reload()"
          />
        </aside>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .page { display: flex; flex-direction: column; gap: 24px; }

    .page-head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .page-title {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.025em;
      line-height: 1.2;
    }

    .page-sub {
      margin-top: 4px;
      font-size: 13.5px;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .dot-sep { color: var(--text-dim); }

    .page-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 340px;
      gap: 20px;
      align-items: start;
    }

    .main-col, .side-col { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
    .main-col { container-type: inline-size; }

    .kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }

    /* KPIs em 2x2 quando a coluna principal fica estreita (sidebar + coluna lateral). */
    @container (max-width: 900px) {
      .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    .row-split {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
      align-items: stretch;
    }

    @container (max-width: 760px) {
      .row-chart, .row-split { grid-template-columns: minmax(0, 1fr); }
    }
    @container (max-width: 460px) {
      .kpis { grid-template-columns: minmax(0, 1fr); }
    }

    .row-chart {
      display: grid;
      grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
      gap: 20px;
      align-items: stretch;
    }

    .quick { gap: 12px; }
    .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .quick-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px;
      border-radius: 12px;
      font-size: 12.5px;
      font-weight: 500;
      color: var(--text-secondary);
      background: var(--vz-surface-2);
      border: 1px solid var(--vz-border);
      line-height: 1.3;
      transition: all var(--transition-fast);
    }
    .quick-item:hover { color: #FFFFFF; border-color: var(--vz-border-strong); background: var(--vz-accent-soft); }
    .quick-icon { width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; background: var(--vz-accent-soft); color: #C084FC; flex-shrink: 0; }

    @media (max-width: 1240px) {
      .layout { grid-template-columns: minmax(0, 1fr); }
      .side-col { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }
    }

    @media (max-width: 720px) {
      .side-col { grid-template-columns: minmax(0, 1fr); }
      .page-title { font-size: 22px; }
      .hide-sm { display: none; }
    }

    @media (max-width: 520px) {
      .page-actions { width: 100%; justify-content: space-between; }
    }
  `]
})
export class OverviewComponent {
  private readonly api = inject(DashboardApiService);
  readonly session = inject(SessionStore);

  readonly ranges: DashboardRange[] = ['today', '7d', '30d'];
  readonly rangeLabel = RANGE_LABEL;
  readonly range = signal<DashboardRange>('7d');

  readonly todayLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
    .format(new Date())
    .replace(/^./, c => c.toUpperCase());

  // Recursos remotos — cada um mostra instruções de implementação se a rota não existir.
  readonly summary = remoteResource(() => this.api.getUsageSummary(this.range()));
  readonly calls = remoteResource(() => this.api.listRecentCalls(6));
  readonly agents = remoteResource(() => this.api.listAgents());
  readonly onboarding = remoteResource(() => this.api.getOnboarding());
  readonly phoneNumbers = remoteResource(() => this.api.listPhoneNumbers());

  readonly quickActions = [
    { label: 'Novo agente', icon: 'bot', route: '/dashboard/agents/new' },
    { label: 'Conhecimento', icon: 'book-open', route: '/dashboard/knowledge' },
    { label: 'Integrações', icon: 'share-2', route: '/dashboard/integrations' },
    { label: 'Números', icon: 'phone', route: '/dashboard/telephony' }
  ];

  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    const salutation = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
    const name = this.session.firstName();
    return name ? `${salutation}, ${name}` : salutation;
  });

  // ---- KPIs derivados de UsageSummaryResponse --------------------------------
  readonly kpiTotal = computed(() => {
    const s = this.summary.data();
    return s ? fmtNumber(s.calls.total) : null;
  });

  readonly kpiTotalDelta = computed(() => {
    const s = this.summary.data();
    return s ? percentDelta(s.calls.total, s.previousCalls?.total) : null;
  });

  readonly kpiInProgress = computed(() => {
    const s = this.summary.data();
    return s ? fmtNumber(s.inProgress) : null;
  });

  readonly kpiTransferred = computed(() => {
    const s = this.summary.data();
    return s ? fmtNumber(s.calls.transferred) : null;
  });

  readonly kpiTransferredHint = computed(() => {
    const s = this.summary.data();
    if (!s || !s.calls.total) return 'sem chamadas no período';
    return `${fmtPercent((s.calls.transferred / s.calls.total) * 100)} do total`;
  });

  readonly kpiAvgDuration = computed(() => {
    const s = this.summary.data();
    return s ? fmtDuration(s.durationSeconds.average) : null;
  });

  readonly kpiTotalMinutes = computed(() => {
    const s = this.summary.data();
    return s ? `${fmtNumber(Math.round(s.durationSeconds.total / 60))} min no período` : '';
  });

  setRange(range: DashboardRange): void {
    if (range === this.range()) return;
    this.range.set(range);
    this.summary.reload();
  }

  refreshAll(): void {
    this.summary.reload();
    this.calls.reload();
    this.agents.reload();
    this.onboarding.reload();
    this.phoneNumbers.reload();
    this.session.refresh();
  }
}
