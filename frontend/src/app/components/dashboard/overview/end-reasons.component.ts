import { Component, computed, input, output } from '@angular/core';
import { BackendPendingComponent } from './backend-pending.component';
import { RemoteError, RemoteStatus } from '../../../core/api/remote-resource';
import { UsageSummaryResponse } from '../../../core/api/dashboard-api.models';
import { END_REASON_LABEL, fmtNumber, fmtPercent } from './overview-format';

/**
 * Distribuição dos motivos de encerramento (`endReasons` de usage/summary).
 * Mostra a taxa de resolução sem transferência como destaque.
 */
@Component({
  selector: 'app-end-reasons',
  standalone: true,
  imports: [BackendPendingComponent],
  template: `
    <section class="vz-panel">
      <header class="vz-panel-head">
        <div>
          <h2 class="vz-panel-title">Resultado dos atendimentos</h2>
          <p class="vz-panel-sub">Como as chamadas foram encerradas no período</p>
        </div>
      </header>

      @if (status() === 'ready' && rows().length) {
        <div class="hero-stat">
          <span class="hero-value">{{ resolvedRate() }}</span>
          <span class="hero-label">resolvidas pelo agente, sem transferência</span>
        </div>
        <ul class="rows">
          @for (row of rows(); track row.reason) {
            <li>
              <div class="row-top">
                <span class="row-label">{{ row.label }}</span>
                <span class="row-value">{{ row.count }} <small>{{ row.pct }}</small></span>
              </div>
              <div class="bar"><span [style.width.%]="row.width" [attr.data-reason]="row.reason"></span></div>
            </li>
          }
        </ul>
      } @else if (status() === 'ready') {
        <p class="empty">Sem chamadas encerradas no período selecionado.</p>
      } @else if (status() === 'loading') {
        @for (i of [1, 2, 3, 4]; track i) {
          <div class="skeleton"></div>
        }
      } @else {
        <app-backend-pending contractKey="usageSummary" [status]="status()" [error]="error()" [compact]="true" (retry)="retry.emit()" />
      }
    </section>
  `,
  styles: [`
    :host { display: block; min-width: 0; }
    .vz-panel { height: 100%; }

    .hero-stat { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
    .hero-value { font-family: var(--font-display); font-size: 30px; font-weight: 700; letter-spacing: -0.03em; color: #FFFFFF; }
    .hero-label { font-size: 12.5px; color: var(--text-muted); }

    .rows { list-style: none; display: flex; flex-direction: column; gap: 14px; }
    .row-top { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 6px; font-size: 13px; }
    .row-label { color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .row-value { color: #FFFFFF; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .row-value small { color: var(--text-muted); font-weight: 500; font-size: 11.5px; margin-left: 4px; }

    .bar { height: 8px; border-radius: 999px; background: var(--vz-surface-inset); overflow: hidden; }
    .bar span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #6D28D9, #A78BFA); transition: width var(--transition-smooth); }
    .bar span[data-reason='TRANSFERRED'] { background: linear-gradient(90deg, #0369A1, #38BDF8); }
    .bar span[data-reason='FAILED'] { background: linear-gradient(90deg, #B91C1C, #F87171); }
    .bar span[data-reason='FALLBACK'], .bar span[data-reason='CALLBACK_REQUESTED'] { background: linear-gradient(90deg, #B45309, #FBBF24); }
    .bar span[data-reason='CALLER_HANGUP'] { background: linear-gradient(90deg, #3F3F46, #A1A1AA); }

    .empty { font-size: 13px; color: var(--text-muted); padding: 24px 0; text-align: center; }
    .skeleton { height: 30px; border-radius: 8px; background: linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.07), rgba(255,255,255,0.03)); background-size: 200% 100%; animation: vzShimmer 1.4s linear infinite; }
  `]
})
export class EndReasonsComponent {
  readonly summary = input<UsageSummaryResponse | null>(null);
  readonly status = input<RemoteStatus>('loading');
  readonly error = input<RemoteError | null>(null);
  readonly retry = output<void>();

  private readonly total = computed(() => (this.summary()?.endReasons ?? []).reduce((a, r) => a + r.count, 0));

  readonly rows = computed(() => {
    const total = this.total();
    if (!total) return [];
    const list = [...(this.summary()?.endReasons ?? [])].filter(r => r.count > 0).sort((a, b) => b.count - a.count);
    const max = list[0]?.count ?? 1;
    return list.map(r => ({
      reason: r.reason,
      label: END_REASON_LABEL[r.reason] ?? r.reason,
      count: fmtNumber(r.count),
      pct: fmtPercent((r.count / total) * 100),
      width: (r.count / max) * 100
    }));
  });

  readonly resolvedRate = computed(() => {
    const total = this.total();
    const resolved = this.summary()?.endReasons.find(r => r.reason === 'RESOLVED')?.count ?? 0;
    return total ? fmtPercent((resolved / total) * 100) : '—';
  });
}
