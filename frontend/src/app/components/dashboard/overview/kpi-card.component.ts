import { Component, computed, input } from '@angular/core';
import { IconComponent } from '../../ui/icon/icon.component';
import { RemoteStatus } from '../../../core/api/remote-resource';
import { fmtPercent } from './overview-format';

/**
 * Cartão de indicador. Não inventa valores: quando `value` é nulo mostra "—"
 * e o motivo (carregando / aguardando backend).
 */
@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [IconComponent],
  template: `
    <article class="kpi" [class.kpi-featured]="featured()">
      <header class="kpi-head">
        <span class="kpi-icon"><app-icon [name]="icon()" [size]="18"></app-icon></span>
        <span class="kpi-label">{{ label() }}</span>
      </header>

      @if (status() === 'loading') {
        <div class="kpi-skeleton" aria-label="Carregando"></div>
        <div class="kpi-skeleton kpi-skeleton-sm"></div>
      } @else {
        <p class="kpi-value" [class.kpi-value-empty]="value() === null">
          {{ value() ?? '—' }}@if (value() !== null && unit()) {<span class="kpi-unit">{{ unit() }}</span>}
        </p>

        <footer class="kpi-foot">
          @if (value() === null) {
            <span class="kpi-hint">
              <app-icon name="database" [size]="12"></app-icon>
              {{ status() === 'offline' ? 'Backend indisponível' : 'Aguardando ' + source() }}
            </span>
          } @else {
            @if (delta() !== null) {
              <span class="kpi-delta" [class.down]="delta()! < 0">
                <app-icon [name]="delta()! < 0 ? 'trending-down' : 'trending-up'" [size]="12"></app-icon>
                {{ deltaText() }}
              </span>
            }
            <span class="kpi-hint">{{ hint() }}</span>
          }
        </footer>
      }
    </article>
  `,
  styles: [`
    :host { display: block; min-width: 0; }

    .kpi {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 18px 20px;
      border-radius: 18px;
      background: var(--vz-surface);
      border: 1px solid var(--vz-border);
      position: relative;
      overflow: hidden;
      transition: border-color var(--transition-base), transform var(--transition-base);
    }
    .kpi:hover { border-color: var(--vz-border-strong); }

    .kpi-featured {
      background:
        radial-gradient(120% 140% at 0% 0%, rgba(168, 85, 247, 0.55) 0%, transparent 55%),
        linear-gradient(150deg, #5B12D6 0%, #3A0E86 55%, #1F0B45 100%);
      border-color: rgba(192, 132, 252, 0.45);
      box-shadow: 0 18px 40px -18px rgba(109, 0, 255, 0.65);
    }

    .kpi-head { display: flex; align-items: center; gap: 10px; min-width: 0; }

    .kpi-icon {
      flex-shrink: 0;
      width: 34px;
      height: 34px;
      border-radius: 10px;
      display: grid;
      place-items: center;
      color: #C084FC;
      background: rgba(168, 85, 247, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.22);
    }
    .kpi-featured .kpi-icon { color: #FFFFFF; background: rgba(255, 255, 255, 0.14); border-color: rgba(255, 255, 255, 0.2); }

    .kpi-label {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .kpi-featured .kpi-label { color: rgba(255, 255, 255, 0.82); }

    .kpi-value {
      font-family: var(--font-display);
      font-size: 30px;
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1;
      color: #FFFFFF;
      font-variant-numeric: tabular-nums;
    }
    .kpi-value-empty { color: var(--text-dim); }
    .kpi-featured .kpi-value-empty { color: rgba(255, 255, 255, 0.45); }
    .kpi-unit { font-size: 16px; font-weight: 600; margin-left: 4px; color: var(--text-secondary); }

    .kpi-foot {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: auto;
      min-height: 22px;
    }

    .kpi-delta {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 600;
      color: #4ADE80;
      background: rgba(34, 197, 94, 0.12);
      border: 1px solid rgba(34, 197, 94, 0.25);
      font-variant-numeric: tabular-nums;
    }
    .kpi-delta.down { color: #F87171; background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.25); }

    .kpi-hint {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .kpi-featured .kpi-hint { color: rgba(255, 255, 255, 0.7); }

    .kpi-skeleton {
      height: 30px;
      width: 60%;
      border-radius: 8px;
      background: linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.09), rgba(255,255,255,0.04));
      background-size: 200% 100%;
      animation: vzShimmer 1.4s linear infinite;
    }
    .kpi-skeleton-sm { height: 14px; width: 40%; }
  `]
})
export class KpiCardComponent {
  readonly label = input.required<string>();
  readonly icon = input.required<string>();
  readonly value = input<string | null>(null);
  readonly unit = input<string>('');
  readonly delta = input<number | null>(null);
  readonly hint = input<string>('');
  /** Nome curto do endpoint de origem, exibido quando não há dado. */
  readonly source = input<string>('API');
  readonly status = input<RemoteStatus>('loading');
  readonly featured = input(false);

  readonly deltaText = computed(() => {
    const d = this.delta();
    if (d === null) return '';
    return `${d > 0 ? '+' : ''}${fmtPercent(d)}`;
  });
}
