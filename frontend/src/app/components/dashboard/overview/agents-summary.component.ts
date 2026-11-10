import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';
import { BackendPendingComponent } from './backend-pending.component';
import { RemoteError, RemoteStatus } from '../../../core/api/remote-resource';
import { AgentListItem, PageResponse } from '../../../core/api/dashboard-api.models';
import { AGENT_STATUS_META, fmtDateTime } from './overview-format';

/** Lista curta de agentes (`GET /api/v1/agents`) com versão publicada e rascunho. */
@Component({
  selector: 'app-agents-summary',
  standalone: true,
  imports: [RouterLink, IconComponent, BackendPendingComponent],
  template: `
    <section class="vz-panel">
      <header class="vz-panel-head">
        <div>
          <h2 class="vz-panel-title">Agentes</h2>
          <p class="vz-panel-sub">{{ subtitle() }}</p>
        </div>
        <a routerLink="/dashboard/agents" class="vz-link">Gerenciar <app-icon name="arrow-right" [size]="14"></app-icon></a>
      </header>

      @if (status() === 'ready' && agents().length) {
        <ul class="list">
          @for (agent of agents(); track agent.id) {
            <li>
              <span class="avatar"><app-icon name="bot" [size]="16"></app-icon></span>
              <div class="info">
                <span class="name">{{ agent.name }}</span>
                <span class="meta">
                  {{ agent.publishedVersion ? 'Publicado v' + agent.publishedVersion : 'Nunca publicado' }}
                  · rascunho r{{ agent.draftRevision }} · {{ fmtDateTime(agent.updatedAt) }}
                </span>
              </div>
              <span class="vz-tag" [attr.data-tone]="meta[agent.status].tone">{{ meta[agent.status].label }}</span>
            </li>
          }
        </ul>
      } @else if (status() === 'ready') {
        <div class="empty">
          <p>Nenhum agente criado.</p>
          <a routerLink="/dashboard/agents/new" class="vz-btn vz-btn-primary"><app-icon name="plus" [size]="14"></app-icon> Criar primeiro agente</a>
        </div>
      } @else if (status() === 'loading') {
        @for (i of [1, 2, 3]; track i) { <div class="skeleton"></div> }
      } @else {
        <app-backend-pending contractKey="agents" [status]="status()" [error]="error()" [compact]="true" (retry)="retry.emit()" />
      }
    </section>
  `,
  styles: [`
    :host { display: block; min-width: 0; }
    .vz-panel { height: 100%; }
    .list { list-style: none; display: flex; flex-direction: column; }
    .list li { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--vz-border); }
    .list li:last-child { border-bottom: none; padding-bottom: 0; }
    .avatar { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: var(--vz-accent-soft); color: #C084FC; flex-shrink: 0; }
    .info { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.35; }
    .name { font-size: 13.5px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .meta { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px 0; font-size: 13px; color: var(--text-muted); }
    .skeleton { height: 44px; border-radius: 10px; background: linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.07), rgba(255,255,255,0.03)); background-size: 200% 100%; animation: vzShimmer 1.4s linear infinite; }
  `]
})
export class AgentsSummaryComponent {
  readonly page = input<PageResponse<AgentListItem> | null>(null);
  readonly status = input<RemoteStatus>('loading');
  readonly error = input<RemoteError | null>(null);
  readonly retry = output<void>();

  readonly meta = AGENT_STATUS_META;
  readonly fmtDateTime = fmtDateTime;

  readonly agents = computed(() => (this.page()?.data ?? []).filter(a => a.status !== 'ARCHIVED').slice(0, 5));

  readonly subtitle = computed(() => {
    const list = this.page()?.data;
    if (!list) return 'Status e versão publicada de cada agente';
    const active = list.filter(a => a.status === 'ACTIVE').length;
    return `${active} ativo${active === 1 ? '' : 's'} de ${list.length} no workspace`;
  });
}
