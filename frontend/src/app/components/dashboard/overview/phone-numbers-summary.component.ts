import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';
import { BackendPendingComponent } from './backend-pending.component';
import { RemoteError, RemoteStatus } from '../../../core/api/remote-resource';
import { PageResponse, PhoneNumberListItem } from '../../../core/api/dashboard-api.models';
import { fmtPhone } from './overview-format';

const STATUS_META: Record<PhoneNumberListItem['status'], { label: string; tone: string }> = {
  ACTIVE: { label: 'Ativo', tone: 'green' },
  PENDING: { label: 'Pendente', tone: 'amber' },
  SUSPENDED: { label: 'Suspenso', tone: 'red' },
  RELEASED: { label: 'Liberado', tone: 'neutral' }
};

/** Números do workspace e agente vinculado (`GET /api/v1/phone-numbers`). */
@Component({
  selector: 'app-phone-numbers-summary',
  standalone: true,
  imports: [RouterLink, IconComponent, BackendPendingComponent],
  template: `
    <section class="vz-panel">
      <header class="vz-panel-head">
        <div>
          <h2 class="vz-panel-title">Números e roteamento</h2>
          <p class="vz-panel-sub">Linhas que encaminham chamadas aos agentes</p>
        </div>
        <a routerLink="/dashboard/telephony" class="vz-link">Abrir <app-icon name="arrow-right" [size]="14"></app-icon></a>
      </header>

      @if (status() === 'ready' && page()?.data?.length) {
        <ul class="list">
          @for (n of page()!.data.slice(0, 4); track n.id) {
            <li>
              <div class="info">
                <span class="num">{{ fmtPhone(n.e164) }}</span>
                <span class="agent">{{ n.agentName ? '→ ' + n.agentName : 'Sem agente vinculado' }}</span>
              </div>
              <span class="vz-tag" [attr.data-tone]="meta[n.status].tone">{{ meta[n.status].label }}</span>
            </li>
          }
        </ul>
      } @else if (status() === 'ready') {
        <p class="empty">Nenhum número configurado.</p>
      } @else if (status() === 'loading') {
        @for (i of [1, 2]; track i) { <div class="skeleton"></div> }
      } @else {
        <app-backend-pending contractKey="phoneNumbers" [status]="status()" [error]="error()" [compact]="true" (retry)="retry.emit()" />
      }
    </section>
  `,
  styles: [`
    :host { display: block; min-width: 0; }
    .list { list-style: none; display: flex; flex-direction: column; }
    .list li { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 0; border-bottom: 1px solid var(--vz-border); }
    .list li:last-child { border-bottom: none; }
    .info { min-width: 0; display: flex; flex-direction: column; line-height: 1.35; }
    .num { font-family: var(--font-mono); font-size: 13px; color: var(--text-primary); }
    .agent { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .empty { font-size: 13px; color: var(--text-muted); text-align: center; padding: 12px 0; }
    .skeleton { height: 40px; border-radius: 10px; background: linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.07), rgba(255,255,255,0.03)); background-size: 200% 100%; animation: vzShimmer 1.4s linear infinite; }
  `]
})
export class PhoneNumbersSummaryComponent {
  readonly page = input<PageResponse<PhoneNumberListItem> | null>(null);
  readonly status = input<RemoteStatus>('loading');
  readonly error = input<RemoteError | null>(null);
  readonly retry = output<void>();

  readonly meta = STATUS_META;
  readonly fmtPhone = fmtPhone;
}
