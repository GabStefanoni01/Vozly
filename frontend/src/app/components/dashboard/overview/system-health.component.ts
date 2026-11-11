import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../../ui/icon/icon.component';
import { RemoteStatus } from '../../../core/api/remote-resource';
import { HealthResponse } from '../../../core/api/dashboard-api.models';
import { BACKEND_CONTRACTS } from '../../../core/api/backend-contracts';

/**
 * Saúde dos componentes.
 * - "API administrativa" usa `GET /actuator/health` (✅ já existe no backend).
 * - Telefonia, STT, LLM e TTS dependem da escolha dos fornecedores (docs/10 §12):
 *   cada adaptador deve expor um HealthIndicator próprio e um endpoint
 *   administrativo autenticado, p.ex. `GET /api/v1/system/health`, retornando
 *   `{ components: [{ key, status, latencyMs, checkedAt }] }` sem detalhes internos.
 */
@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [IconComponent],
  template: `
    <section class="vz-panel">
      <header class="vz-panel-head">
        <div>
          <h2 class="vz-panel-title">Saúde da plataforma</h2>
          <p class="vz-panel-sub">Componentes do runtime de voz</p>
        </div>
        <button type="button" class="vz-btn icon-only" (click)="refresh.emit()" aria-label="Verificar novamente" title="Verificar novamente">
          <app-icon name="refresh-cw" [size]="14"></app-icon>
        </button>
      </header>

      <ul class="components">
        <li>
          <span class="c-icon"><app-icon name="layers" [size]="15"></app-icon></span>
          <div class="c-text">
            <span class="c-name">API administrativa</span>
            <span class="c-sub">{{ apiDetail() }}</span>
          </div>
          <span class="vz-tag" [attr.data-tone]="apiTone()">{{ apiLabel() }}</span>
        </li>
        @for (c of providers; track c.name) {
          <li>
            <span class="c-icon"><app-icon [name]="c.icon" [size]="15"></app-icon></span>
            <div class="c-text">
              <span class="c-name">{{ c.name }}</span>
              <span class="c-sub">Fornecedor ainda não definido</span>
            </div>
            <span class="vz-tag" data-tone="neutral">Pendente</span>
          </li>
        }
      </ul>

      <p class="foot">
        <app-icon name="info" [size]="12"></app-icon>
        <span>Fonte: <code>{{ healthPath }}</code>. Provedores exigirão HealthIndicators por adaptador (docs/10 §10).</span>
      </p>
    </section>
  `,
  styles: [`
    :host { display: block; min-width: 0; }
    .icon-only { padding: 7px; }
    .components { list-style: none; display: flex; flex-direction: column; }
    .components li { display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--vz-border); }
    .components li:last-child { border-bottom: none; }
    .c-icon { width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center; background: var(--vz-surface-2); border: 1px solid var(--vz-border); color: var(--text-secondary); flex-shrink: 0; }
    .c-text { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.35; }
    .c-name { font-size: 13px; color: var(--text-primary); font-weight: 500; }
    .c-sub { font-size: 11.5px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .foot { display: flex; gap: 6px; align-items: flex-start; font-size: 11.5px; color: var(--text-muted); line-height: 1.5; }
    .foot app-icon { margin-top: 2px; flex-shrink: 0; }
    .foot code { font-family: var(--font-mono); color: #C084FC; font-size: 11px; }
  `]
})
export class SystemHealthComponent {
  readonly health = input<HealthResponse | null>(null);
  readonly status = input<RemoteStatus>('loading');
  readonly refresh = output<void>();

  readonly healthPath = BACKEND_CONTRACTS.health.path;

  readonly providers = [
    { name: 'Telefonia / SIP', icon: 'phone' },
    { name: 'Reconhecimento de fala (STT)', icon: 'mic' },
    { name: 'Modelo de linguagem (LLM)', icon: 'cpu' },
    { name: 'Síntese de voz (TTS)', icon: 'volume-2' }
  ];

  readonly apiLabel = computed(() => {
    if (this.status() === 'loading') return 'Verificando';
    if (this.status() !== 'ready') return 'Offline';
    return this.health()?.status === 'UP' ? 'Operacional' : this.health()?.status ?? 'Desconhecido';
  });

  readonly apiTone = computed(() => {
    if (this.status() === 'loading') return 'neutral';
    if (this.status() !== 'ready') return 'red';
    return this.health()?.status === 'UP' ? 'green' : 'amber';
  });

  readonly apiDetail = computed(() => {
    if (this.status() === 'ready') return 'Spring Boot · Actuator';
    if (this.status() === 'loading') return 'Consultando /actuator/health';
    return 'Inicie o backend na porta 8080';
  });
}
