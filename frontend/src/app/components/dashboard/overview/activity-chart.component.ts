import { Component, computed, input, output, signal } from '@angular/core';
import { BackendPendingComponent } from './backend-pending.component';
import { RemoteError, RemoteStatus } from '../../../core/api/remote-resource';
import { UsageSummaryResponse } from '../../../core/api/dashboard-api.models';
import { fmtDayMonth, fmtNumber } from './overview-format';

type Metric = 'calls' | 'minutes';

const W = 720;
const H = 240;
const PAD_TOP = 12;

/**
 * Gráfico de atividade (série diária de `GET /api/v1/usage/summary`).
 * Renderização SVG sem dependências externas.
 */
@Component({
  selector: 'app-activity-chart',
  standalone: true,
  imports: [BackendPendingComponent],
  template: `
    <section class="vz-panel chart-panel">
      <header class="vz-panel-head">
        <div>
          <h2 class="vz-panel-title">Atividade de chamadas</h2>
          <p class="vz-panel-sub">{{ subtitle() }}</p>
        </div>
        <div class="vz-seg" role="tablist" aria-label="Métrica do gráfico">
          <button type="button" role="tab" [class.active]="metric() === 'calls'" [attr.aria-selected]="metric() === 'calls'" (click)="metric.set('calls')">Chamadas</button>
          <button type="button" role="tab" [class.active]="metric() === 'minutes'" [attr.aria-selected]="metric() === 'minutes'" (click)="metric.set('minutes')">Minutos</button>
        </div>
      </header>

      @if (status() === 'ready' && points().length > 1) {
        <div class="chart">
          <div class="y-axis" aria-hidden="true">
            @for (tick of ticks(); track $index) {
              <span [style.top.%]="(gridY(4 - $index) / H) * 100">{{ tick }}</span>
            }
          </div>

          <div class="plot" (mousemove)="onMove($event)" (mouseleave)="hover.set(null)">
            <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" preserveAspectRatio="none" class="plot-svg" role="img" [attr.aria-label]="ariaLabel()">
              <defs>
                <linearGradient id="vzAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.45" />
                  <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0" />
                </linearGradient>
              </defs>
              @for (i of [0, 1, 2, 3, 4]; track i) {
                <line x1="0" [attr.x2]="W" [attr.y1]="gridY(i)" [attr.y2]="gridY(i)" class="grid" />
              }
              <path [attr.d]="areaPath()" fill="url(#vzAreaGrad)" />
              <path [attr.d]="linePath()" class="line" />
              @if (hoverPoint(); as p) {
                <line [attr.x1]="p.x" [attr.x2]="p.x" [attr.y1]="PAD_TOP" [attr.y2]="H" class="cursor" />
              }
            </svg>

            @if (hoverPoint(); as p) {
              <span class="dot" [style.left.%]="(p.x / W) * 100" [style.top.%]="(p.y / H) * 100"></span>
              <div class="tooltip" [style.left.%]="(p.x / W) * 100" [class.flip]="p.x > W * 0.75">
                <span class="tt-date">{{ p.label }}</span>
                <span class="tt-value">{{ p.formatted }}</span>
              </div>
            }
          </div>

          <div class="x-axis" aria-hidden="true">
            @for (l of xLabels(); track l.key) {
              <span [style.left.%]="l.left">{{ l.text }}</span>
            }
          </div>
        </div>
        @if (allZero()) {
          <p class="chart-note">Nenhuma chamada registrada no período selecionado.</p>
        }
      } @else if (status() === 'loading') {
        <div class="chart-placeholder shimmer" aria-label="Carregando gráfico"></div>
      } @else {
        <div class="chart-placeholder">
          <svg [attr.viewBox]="'0 0 ' + W + ' ' + H" preserveAspectRatio="none" class="ghost" aria-hidden="true">
            @for (i of [0, 1, 2, 3, 4]; track i) {
              <line x1="0" [attr.x2]="W" [attr.y1]="gridY(i)" [attr.y2]="gridY(i)" class="grid" />
            }
          </svg>
          <div class="placeholder-content">
            <app-backend-pending contractKey="usageSummary" [status]="status()" [error]="error()" (retry)="retry.emit()" />
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    :host { display: block; min-width: 0; }
    .chart-panel { height: 100%; }

    .chart {
      display: grid;
      grid-template-columns: 44px 1fr;
      grid-template-rows: 240px 22px;
      column-gap: 8px;
    }

    .y-axis {
      grid-row: 1;
      position: relative;
      font-size: 11px;
      color: var(--text-muted);
      font-variant-numeric: tabular-nums;
    }
    .y-axis span { position: absolute; right: 0; transform: translateY(-50%); line-height: 1; }

    .plot { position: relative; grid-row: 1; grid-column: 2; cursor: crosshair; }
    .plot-svg, .ghost { width: 100%; height: 100%; display: block; overflow: visible; }

    .grid { stroke: var(--vz-grid-line); stroke-width: 1; vector-effect: non-scaling-stroke; stroke-dasharray: 3 4; }
    .line { fill: none; stroke: #A78BFA; stroke-width: 2.25; vector-effect: non-scaling-stroke; stroke-linejoin: round; stroke-linecap: round; }
    .cursor { stroke: rgba(255, 255, 255, 0.35); stroke-width: 1; vector-effect: non-scaling-stroke; stroke-dasharray: 4 4; }

    .dot {
      position: absolute;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #FFFFFF;
      border: 3px solid #8B5CF6;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.25);
      pointer-events: none;
    }

    .tooltip {
      position: absolute;
      top: 0;
      transform: translateX(12px);
      display: flex;
      flex-direction: column;
      padding: 8px 12px;
      border-radius: 10px;
      background: rgba(22, 20, 29, 0.96);
      border: 1px solid var(--vz-border-strong);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.5);
      pointer-events: none;
      white-space: nowrap;
    }
    .tooltip.flip { transform: translateX(calc(-100% - 12px)); }
    .tt-date { font-size: 11px; color: var(--text-muted); }
    .tt-value { font-size: 15px; font-weight: 700; color: #FFFFFF; font-variant-numeric: tabular-nums; }

    .x-axis { grid-row: 2; grid-column: 2; position: relative; font-size: 11px; color: var(--text-muted); }
    .x-axis span { position: absolute; top: 6px; transform: translateX(-50%); white-space: nowrap; }
    .x-axis span:first-child { transform: none; }
    .x-axis span:last-child { transform: translateX(-100%); }

    .chart-note { font-size: 12.5px; color: var(--text-muted); text-align: center; }

    .chart-placeholder {
      position: relative;
      min-height: 262px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      padding: 12px;
    }
    .chart-placeholder .ghost { position: absolute; inset: 0; opacity: 0.8; }
    .placeholder-content { position: relative; width: min(520px, 100%); }
    .shimmer {
      background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.06), rgba(255,255,255,0.02));
      background-size: 200% 100%;
      animation: vzShimmer 1.4s linear infinite;
    }
  `]
})
export class ActivityChartComponent {
  readonly W = W;
  readonly H = H;
  readonly PAD_TOP = PAD_TOP;

  readonly series = input<UsageSummaryResponse['series'] | null>(null);
  readonly status = input<RemoteStatus>('loading');
  readonly error = input<RemoteError | null>(null);
  readonly rangeLabel = input<string>('');
  readonly retry = output<void>();

  readonly metric = signal<Metric>('calls');
  readonly hover = signal<number | null>(null);

  readonly subtitle = computed(() =>
    `${this.metric() === 'calls' ? 'Chamadas recebidas' : 'Minutos de conversa'} por dia · ${this.rangeLabel()}`
  );

  private readonly values = computed(() => (this.series() ?? []).map(p => (this.metric() === 'calls' ? p.calls : p.minutes)));

  readonly allZero = computed(() => this.values().every(v => v === 0));

  private readonly niceMax = computed(() => {
    // Escala com 4 intervalos inteiros e "redondos" (ex.: 0/15/30/45/60).
    const max = Math.max(0, ...this.values());
    if (max <= 4) return 4;
    const rawStep = max / 4;
    const exp = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const f = rawStep / exp;
    const nice = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find(c => f <= c) ?? 10;
    const step = Math.max(1, Math.ceil(nice * exp));
    return step * 4;
  });

  readonly ticks = computed(() => [0, 1, 2, 3, 4].map(i => fmtNumber(Math.round((this.niceMax() / 4) * i))));

  readonly points = computed(() => {
    const vals = this.values();
    const series = this.series() ?? [];
    const n = vals.length;
    if (n < 2) return [];
    return vals.map((v, i) => ({
      x: (i / (n - 1)) * W,
      y: H - (v / this.niceMax()) * (H - PAD_TOP),
      label: fmtDayMonth(series[i].date),
      formatted: `${fmtNumber(v)} ${this.metric() === 'calls' ? (v === 1 ? 'chamada' : 'chamadas') : 'min'}`
    }));
  });

  readonly linePath = computed(() => smoothPath(this.points()));
  readonly areaPath = computed(() => {
    const pts = this.points();
    if (!pts.length) return '';
    return `${smoothPath(pts)} L ${W} ${H} L 0 ${H} Z`;
  });

  readonly hoverPoint = computed(() => {
    const i = this.hover();
    return i === null ? null : this.points()[i] ?? null;
  });

  readonly xLabels = computed(() => {
    const series = this.series() ?? [];
    const n = series.length;
    if (n < 2) return [];
    const maxLabels = 7;
    const step = Math.max(1, Math.ceil((n - 1) / (maxLabels - 1)));
    const idx: number[] = [];
    for (let i = 0; i < n; i += step) idx.push(i);
    if (idx[idx.length - 1] !== n - 1) {
      if (n - 1 - idx[idx.length - 1] < step / 2) idx.pop();
      idx.push(n - 1);
    }
    return idx.map(i => ({ key: series[i].date, text: fmtDayMonth(series[i].date), left: (i / (n - 1)) * 100 }));
  });

  readonly ariaLabel = computed(() => `Gráfico de ${this.subtitle()}`);

  gridY(i: number): number {
    return PAD_TOP + ((H - PAD_TOP) / 4) * i;
  }

  onMove(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const n = this.points().length;
    if (!n) return;
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    this.hover.set(Math.round(ratio * (n - 1)));
  }
}

/** Curva suave (Catmull-Rom → Bézier) limitada ao eixo para não ultrapassar 0. */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (!pts.length) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = Math.min(H, p1.y + (p2.y - p0.y) / 6);
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = Math.min(H, p2.y - (p3.y - p1.y) / 6);
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}
