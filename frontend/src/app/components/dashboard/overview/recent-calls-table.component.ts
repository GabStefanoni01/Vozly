import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';
import { BackendPendingComponent } from './backend-pending.component';
import { RemoteError, RemoteStatus } from '../../../core/api/remote-resource';
import { CallListItem, PageResponse } from '../../../core/api/dashboard-api.models';
import { CALL_STATUS_META, END_REASON_LABEL, fmtDateTime, fmtDuration, fmtNumber, fmtPhone } from './overview-format';

/**
 * Tabela das últimas chamadas (`GET /api/v1/calls`).
 * O detalhe/transcrição deve usar `GET /api/v1/calls/{id}` e `/calls/{id}/messages`
 * na página de Conversas (ainda baseada em dados locais).
 */
@Component({
  selector: 'app-recent-calls-table',
  standalone: true,
  imports: [RouterLink, IconComponent, BackendPendingComponent],
  template: `
    <section class="vz-panel">
      <header class="vz-panel-head">
        <div>
          <h2 class="vz-panel-title">Chamadas recentes</h2>
          <p class="vz-panel-sub">
            @if (page(); as p) {
              {{ fmtNumber(p.pagination.totalElements) }} chamadas no histórico do workspace
            } @else {
              Últimos atendimentos registrados pelo runtime de voz
            }
          </p>
        </div>
        <a routerLink="/dashboard/conversations" class="vz-link">
          Ver histórico completo <app-icon name="arrow-right" [size]="14"></app-icon>
        </a>
      </header>

      @if (status() === 'ready' && page()?.data?.length) {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Origem</th>
                <th>Agente</th>
                <th>Início</th>
                <th class="num">Duração</th>
                <th>Status</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              @for (call of page()!.data; track call.id) {
                <tr>
                  <td>
                    <div class="cell-main">
                      <span class="dir-icon" [class.out]="call.direction === 'OUTBOUND'">
                        <app-icon [name]="call.direction === 'OUTBOUND' ? 'phone-forwarded' : 'phone-incoming'" [size]="14"></app-icon>
                      </span>
                      <div class="stack">
                        <span class="strong">{{ call.callerNumberMasked ?? 'Número oculto' }}</span>
                        <span class="muted">para {{ fmtPhone(call.phoneNumber) }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="stack">
                      <span class="strong ellipsis">{{ call.agentName }}</span>
                      <span class="muted mono">v{{ call.agentVersionNumber }}</span>
                    </div>
                  </td>
                  <td class="muted nowrap">{{ fmtDateTime(call.startedAt) }}</td>
                  <td class="num mono">{{ fmtDuration(call.durationSeconds) }}</td>
                  <td><span class="vz-tag" [attr.data-tone]="statusMeta[call.status].tone">{{ statusMeta[call.status].label }}</span></td>
                  <td class="muted nowrap">{{ call.endReason ? endReasonLabel[call.endReason] : '—' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else if (status() === 'ready') {
        <div class="empty">
          <app-icon name="phone-missed" [size]="22"></app-icon>
          <p>Nenhuma chamada registrada ainda.</p>
          <span>Publique um agente e vincule um número para começar a receber ligações.</span>
        </div>
      } @else if (status() === 'loading') {
        <div class="rows-skeleton">
          @for (i of [1, 2, 3, 4]; track i) { <div></div> }
        </div>
      } @else {
        <app-backend-pending contractKey="recentCalls" [status]="status()" [error]="error()" (retry)="retry.emit()" />
      }
    </section>
  `,
  styles: [`
    :host { display: block; min-width: 0; }

    .table-wrap { overflow-x: auto; margin: 0 -20px -20px; }
    table { width: 100%; border-collapse: collapse; min-width: 720px; font-size: 13px; }
    thead th {
      text-align: left;
      font-size: 11.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      padding: 10px 20px;
      background: var(--vz-surface-inset);
      border-top: 1px solid var(--vz-border);
      border-bottom: 1px solid var(--vz-border);
      white-space: nowrap;
    }
    tbody td { padding: 12px 20px; border-bottom: 1px solid var(--vz-border); vertical-align: middle; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover td { background: rgba(255, 255, 255, 0.02); }
    .num { text-align: right; }

    .cell-main { display: flex; align-items: center; gap: 10px; }
    .dir-icon { width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center; color: #C084FC; background: var(--vz-accent-soft); flex-shrink: 0; }
    .dir-icon.out { color: #38BDF8; background: rgba(56, 189, 248, 0.12); }
    .stack { display: flex; flex-direction: column; min-width: 0; line-height: 1.35; }
    .strong { color: var(--text-primary); font-weight: 500; white-space: nowrap; }
    .muted { white-space: nowrap; }
    .muted { color: var(--text-muted); font-size: 12px; }
    .mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
    .nowrap { white-space: nowrap; }
    .ellipsis { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .empty { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 28px 12px; text-align: center; color: var(--text-muted); }
    .empty p { color: var(--text-primary); font-weight: 600; font-size: 14px; }
    .empty span { font-size: 12.5px; }

    .rows-skeleton { display: flex; flex-direction: column; gap: 10px; }
    .rows-skeleton div { height: 44px; border-radius: 10px; background: linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.07), rgba(255,255,255,0.03)); background-size: 200% 100%; animation: vzShimmer 1.4s linear infinite; }
  `]
})
export class RecentCallsTableComponent {
  readonly page = input<PageResponse<CallListItem> | null>(null);
  readonly status = input<RemoteStatus>('loading');
  readonly error = input<RemoteError | null>(null);
  readonly retry = output<void>();

  readonly statusMeta = CALL_STATUS_META;
  readonly endReasonLabel = END_REASON_LABEL;
  readonly fmtDateTime = fmtDateTime;
  readonly fmtDuration = fmtDuration;
  readonly fmtNumber = fmtNumber;
  readonly fmtPhone = fmtPhone;
}
