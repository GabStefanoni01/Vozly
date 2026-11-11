import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../../ui/icon/icon.component';
import { BACKEND_CONTRACTS, BackendContractKey } from '../../../core/api/backend-contracts';
import { RemoteError, RemoteStatus } from '../../../core/api/remote-resource';

/**
 * Estado exibido quando um widget não conseguiu dados reais do backend.
 * Mostra o motivo (rota inexistente, backend fora do ar, sem autenticação)
 * e, sob demanda, o passo a passo para implementar o endpoint no Spring Boot.
 */
@Component({
  selector: 'app-backend-pending',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="bp" [class.bp-compact]="compact()">
      <div class="bp-head">
        <span class="bp-icon" [attr.data-tone]="tone()">
          <app-icon [name]="icon()" [size]="compact() ? 15 : 18"></app-icon>
        </span>
        <div class="bp-text">
          <p class="bp-title">{{ title() }}</p>
          <p class="bp-desc">{{ description() }}</p>
        </div>
      </div>

      <code class="bp-endpoint" [title]="contract().method + ' ' + contract().path">
        <span class="bp-method">{{ contract().method }}</span><span class="bp-path">{{ contract().path }}</span>
      </code>

      <details class="bp-details">
        <summary>
          <app-icon name="terminal" [size]="13"></app-icon>
          Como conectar ao backend
        </summary>
        <div class="bp-body">
          <p class="bp-module">Módulo: <strong>{{ contract().module }}</strong></p>
          <ol>
            @for (step of contract().backendSteps; track $index) {
              <li>{{ step }}</li>
            }
          </ol>
          <p class="bp-docs">
            Referência:
            @for (doc of contract().docs; track doc; let last = $last) {
              <span>{{ doc }}</span>@if (!last) {<span> · </span>}
            }
          </p>
        </div>
      </details>

      @if (showRetry()) {
        <button type="button" class="bp-retry" (click)="retry.emit()">
          <app-icon name="refresh-cw" [size]="13"></app-icon>
          Tentar novamente
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .bp {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 18px;
      border-radius: 14px;
      border: 1px dashed rgba(168, 85, 247, 0.28);
      background: rgba(109, 0, 255, 0.04);
      text-align: left;
    }

    .bp-compact { padding: 14px; gap: 10px; }

    .bp-head { display: flex; gap: 12px; align-items: flex-start; }

    .bp-icon {
      flex-shrink: 0;
      width: 34px;
      height: 34px;
      border-radius: 10px;
      display: grid;
      place-items: center;
      background: rgba(168, 85, 247, 0.14);
      color: #C084FC;
    }
    .bp-compact .bp-icon { width: 28px; height: 28px; border-radius: 8px; }
    .bp-icon[data-tone='amber'] { background: rgba(245, 158, 11, 0.14); color: #FBBF24; }
    .bp-icon[data-tone='red'] { background: rgba(239, 68, 68, 0.14); color: #F87171; }

    .bp-text { min-width: 0; }
    .bp-title { font-size: 13.5px; font-weight: 600; color: var(--text-primary); line-height: 1.35; }
    .bp-desc { font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; margin-top: 2px; }
    .bp-compact .bp-title { font-size: 13px; }
    .bp-compact .bp-desc { font-size: 12px; }

    .bp-endpoint {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-family: var(--font-mono);
      font-size: 11.5px;
      color: #E9D5FF;
      padding: 6px 10px;
      border-radius: 8px;
      background: rgba(5, 5, 5, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      align-self: flex-start;
    }
    .bp-method { color: #4ADE80; font-weight: 600; flex-shrink: 0; }
    .bp-path { overflow: hidden; text-overflow: ellipsis; }

    .bp-details summary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      font-size: 12.5px;
      font-weight: 600;
      color: #C084FC;
      list-style: none;
      user-select: none;
    }
    .bp-details summary::-webkit-details-marker { display: none; }
    .bp-details summary:hover { color: #FFFFFF; }

    .bp-body {
      margin-top: 10px;
      padding: 12px 14px;
      border-radius: 10px;
      background: rgba(5, 5, 5, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 12.5px;
      color: var(--text-secondary);
      line-height: 1.55;
    }
    .bp-module strong { color: var(--text-primary); font-family: var(--font-mono); font-weight: 500; font-size: 12px; }
    .bp-body ol { margin: 8px 0 8px 18px; display: flex; flex-direction: column; gap: 6px; }
    .bp-body li::marker { color: #A855F7; font-weight: 600; }
    .bp-docs { font-size: 11.5px; color: var(--text-muted); }

    .bp-retry {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      padding: 5px 10px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.03);
      transition: all var(--transition-fast);
    }
    .bp-retry:hover { color: #FFFFFF; border-color: rgba(168, 85, 247, 0.4); }
  `]
})
export class BackendPendingComponent {
  readonly contractKey = input.required<BackendContractKey>();
  readonly status = input<RemoteStatus>('not-implemented');
  readonly error = input<RemoteError | null>(null);
  readonly compact = input(false);
  readonly retry = output<void>();

  readonly contract = computed(() => BACKEND_CONTRACTS[this.contractKey()]);

  readonly showRetry = computed(() => this.status() !== 'not-implemented');

  readonly tone = computed(() => {
    switch (this.status()) {
      case 'offline':
      case 'unauthorized':
        return 'amber';
      case 'error':
        return 'red';
      default:
        return 'purple';
    }
  });

  readonly icon = computed(() => {
    switch (this.status()) {
      case 'offline': return 'zap';
      case 'unauthorized': return 'lock';
      case 'error': return 'alert-circle';
      default: return 'database';
    }
  });

  readonly title = computed(() => {
    switch (this.status()) {
      case 'offline': return 'Backend indisponível';
      case 'unauthorized': return 'Autenticação necessária';
      case 'error': return 'Não foi possível carregar';
      default: return 'Aguardando endpoint no backend';
    }
  });

  readonly description = computed(() => {
    const err = this.error();
    switch (this.status()) {
      case 'offline':
        return 'A API não respondeu. Inicie o Spring Boot (mvn spring-boot:run em backend/) na porta 8080.';
      case 'unauthorized':
        return 'A API exigiu autenticação. Configure o fluxo de login definido em docs/09 §3.';
      case 'error':
        return `Resposta HTTP ${err?.httpStatus ?? '?'}${err?.code ? ' · ' + err.code : ''}${err?.traceId ? ' · trace ' + err.traceId : ''}.`;
      default:
        return `${this.contract().feature}: rota ainda não implementada. Nenhum dado fictício é exibido.`;
    }
  });
}
