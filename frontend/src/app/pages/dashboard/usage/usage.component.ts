import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { DashboardApiService, DashboardRange } from '../../../core/api/dashboard-api.service';
import { remoteResource } from '../../../core/api/remote-resource';
import { fmtDuration, fmtNumber } from '../../../components/dashboard/overview/overview-format';

@Component({
  selector: 'app-usage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="usage-page">
      <header class="page-header">
        <div>
          <div class="eyebrow">OBSERVABILIDADE OPERACIONAL</div>
          <h1 class="page-title">Utilização & Consumo</h1>
          <p class="page-subtitle">Indicadores calculados a partir das chamadas registradas para este workspace.</p>
        </div>
        <div class="range-control" aria-label="Período">
          <button type="button" [class.active]="range() === '7d'" (click)="setRange('7d')">7 dias</button>
          <button type="button" [class.active]="range() === '30d'" (click)="setRange('30d')">30 dias</button>
        </div>
      </header>

      @if (summary.status() === 'loading') {
        <section class="metrics-grid" aria-label="Carregando métricas">
          @for (item of [1, 2, 3, 4]; track item) { <div class="metric-card skeleton"></div> }
        </section>
      } @else if (summary.status() === 'ready' && summary.data(); as data) {
        <section class="metrics-grid">
          <article class="metric-card">
            <span class="metric-label">Chamadas no período</span>
            <strong class="metric-value">{{ fmtNumber(data.calls.total) }}</strong>
            <span class="metric-hint">Total registrado</span>
          </article>
          <article class="metric-card">
            <span class="metric-label">Chamadas concluídas</span>
            <strong class="metric-value">{{ fmtNumber(data.calls.completed) }}</strong>
            <span class="metric-hint">Encerradas normalmente</span>
          </article>
          <article class="metric-card">
            <span class="metric-label">Transferidas</span>
            <strong class="metric-value">{{ fmtNumber(data.calls.transferred) }}</strong>
            <span class="metric-hint">Com motivo de transferência</span>
          </article>
          <article class="metric-card">
            <span class="metric-label">Falhas</span>
            <strong class="metric-value">{{ fmtNumber(data.calls.failed) }}</strong>
            <span class="metric-hint">Falha, rejeição ou timeout</span>
          </article>
          <article class="metric-card">
            <span class="metric-label">Minutos processados</span>
            <strong class="metric-value">{{ fmtNumber(data.durationSeconds.total / 60) }}</strong>
            <span class="metric-hint">Duração atendida acumulada</span>
          </article>
          <article class="metric-card">
            <span class="metric-label">Duração média</span>
            <strong class="metric-value">{{ fmtDuration(data.durationSeconds.average) }}</strong>
            <span class="metric-hint">Por chamada atendida</span>
          </article>
        </section>

        <section class="panel">
          <header class="panel-head">
            <div>
              <h2>Consumo diário de minutos</h2>
              <p>Tempo de atendimento por dia, em UTC</p>
            </div>
            <span class="period-label">{{ range() === '7d' ? 'Últimos 7 dias' : 'Últimos 30 dias' }}</span>
          </header>
          @if (data.series.length) {
            <div class="chart" role="img" aria-label="Minutos de atendimento por dia">
              @for (day of data.series; track day.date) {
                <div class="bar-column" [title]="day.date + ': ' + day.minutes.toFixed(2) + ' minutos, ' + day.calls + ' chamadas'">
                  <div class="bar-track">
                    <div class="bar-fill" [style.height.%]="(day.minutes / maxMinutes()) * 100"></div>
                  </div>
                  <span class="bar-value">{{ day.minutes | number:'1.0-1' }}</span>
                  <span class="bar-label">{{ day.date.slice(5) }}</span>
                </div>
              }
            </div>
          } @else {
            <p class="empty">Nenhum dia disponível no intervalo selecionado.</p>
          }
        </section>

        <section class="panel reasons-panel">
          <header class="panel-head">
            <div>
              <h2>Motivos de encerramento</h2>
              <p>Classificação registrada pelo runtime</p>
            </div>
          </header>
          @if (data.endReasons.length) {
            <ul class="reason-list">
              @for (reason of data.endReasons; track reason.reason) {
                <li><span>{{ reason.reason }}</span><strong>{{ fmtNumber(reason.count) }}</strong></li>
              }
            </ul>
          } @else {
            <p class="empty">Ainda não há motivos de encerramento registrados.</p>
          }
        </section>
      } @else {
        <section class="panel state-panel">
          <h2>Não foi possível carregar as métricas</h2>
          <p>Verifique a conexão com a API e tente novamente.</p>
          <button type="button" class="retry" (click)="summary.reload()">Tentar novamente</button>
          @if (summary.error()?.httpStatus) {
            <small>HTTP {{ summary.error()?.httpStatus }} · {{ summary.error()?.code ?? 'ERRO_NAO_CLASSIFICADO' }}</small>
          }
        </section>
      }

      <p class="data-note">
        Os dados acima são métricas operacionais, não faturamento. Limites de plano, pico de canais concorrentes,
        execuções de ferramentas e consumo por agente ainda não possuem fontes persistidas disponíveis e não são estimados.
      </p>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .usage-page { display: flex; flex-direction: column; gap: 20px; }
    .page-header { display: flex; justify-content: space-between; align-items: end; gap: 16px; flex-wrap: wrap; }
    .eyebrow { color: var(--text-muted); font-size: 10px; font-weight: 700; letter-spacing: .12em; }
    .page-title { color: var(--text-primary); font-size: 26px; font-weight: 700; margin-top: 6px; }
    .page-subtitle { color: var(--text-secondary); font-size: 13px; margin-top: 6px; }
    .range-control { display: flex; gap: 4px; padding: 4px; border: 1px solid var(--vz-border); border-radius: 10px; background: var(--vz-surface-2); }
    .range-control button { color: var(--text-secondary); border: 0; background: transparent; border-radius: 7px; padding: 8px 12px; font-size: 12px; cursor: pointer; }
    .range-control button.active { color: var(--text-primary); background: var(--vz-accent-soft); }
    .metrics-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .metric-card, .panel { border: 1px solid var(--vz-border); background: var(--vz-surface-1); border-radius: 14px; padding: 20px; }
    .metric-card { display: flex; flex-direction: column; gap: 8px; min-height: 126px; }
    .metric-label { color: var(--text-secondary); font-size: 12px; }
    .metric-value { color: var(--text-primary); font-size: 26px; font-weight: 700; font-variant-numeric: tabular-nums; }
    .metric-hint, .panel-head p { color: var(--text-muted); font-size: 11px; }
    .panel { display: flex; flex-direction: column; gap: 18px; }
    .panel-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .panel-head h2 { color: var(--text-primary); font-size: 16px; font-weight: 650; }
    .period-label { color: var(--text-muted); font-size: 11px; }
    .chart { display: flex; align-items: end; gap: 8px; min-height: 190px; overflow-x: auto; padding: 10px 2px 0; }
    .bar-column { flex: 1; min-width: 22px; display: flex; flex-direction: column; align-items: center; justify-content: end; gap: 6px; height: 180px; }
    .bar-track { width: 100%; max-width: 34px; height: 128px; display: flex; align-items: end; background: var(--vz-surface-inset); border-radius: 7px; overflow: hidden; }
    .bar-fill { width: 100%; min-height: 0; background: var(--vz-accent); border-radius: 7px; transition: height .2s ease; }
    .bar-value, .bar-label { color: var(--text-muted); font-size: 10px; font-variant-numeric: tabular-nums; }
    .reason-list { list-style: none; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
    .reason-list li { display: flex; justify-content: space-between; gap: 10px; padding: 12px; border-radius: 9px; background: var(--vz-surface-2); color: var(--text-secondary); font-size: 12px; }
    .reason-list strong { color: var(--text-primary); }
    .empty, .state-panel p { color: var(--text-muted); font-size: 13px; }
    .state-panel { align-items: flex-start; }
    .state-panel h2 { color: var(--text-primary); font-size: 16px; }
    .retry { border: 1px solid var(--vz-border); border-radius: 8px; padding: 8px 12px; color: var(--text-primary); background: var(--vz-surface-2); cursor: pointer; }
    .state-panel small { color: var(--text-muted); }
    .data-note { color: var(--text-muted); font-size: 11px; line-height: 1.5; }
    .skeleton { min-height: 126px; animation: pulse 1.3s infinite alternate; }
    @keyframes pulse { from { opacity: .45; } to { opacity: .9; } }
    @media (max-width: 850px) { .metrics-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 560px) { .metrics-grid, .reason-list { grid-template-columns: 1fr; } .page-title { font-size: 22px; } }
  `]
})
export class UsageComponent {
  private readonly api = inject(DashboardApiService);
  readonly range = signal<DashboardRange>('30d');
  readonly summary = remoteResource(() => this.api.getUsageSummary(this.range()));
  readonly maxMinutes = computed(() =>
    Math.max(1, ...(this.summary.data()?.series ?? []).map(day => day.minutes))
  );
  readonly fmtNumber = fmtNumber;
  readonly fmtDuration = fmtDuration;

  setRange(range: DashboardRange): void {
    if (range === this.range()) return;
    this.range.set(range);
    this.summary.reload();
  }
}
