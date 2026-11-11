import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';
import { BackendPendingComponent } from './backend-pending.component';
import { RemoteError, RemoteStatus } from '../../../core/api/remote-resource';
import { OnboardingResponse, OnboardingStepKey } from '../../../core/api/dashboard-api.models';

/**
 * Etapas do fluxo prioritário de ativação (docs/02 e docs/06).
 * As etapas são definição de produto; o estado de cada uma vem de
 * `GET /api/v1/onboarding` — sem o endpoint, nenhuma etapa é marcada.
 */
const STEPS: { key: OnboardingStepKey; title: string; route: string }[] = [
  { key: 'WORKSPACE', title: 'Dados do workspace', route: '/dashboard/settings' },
  { key: 'MEMBERS', title: 'Membros e papéis', route: '/dashboard/settings' },
  { key: 'AGENT', title: 'Configurar o primeiro agente', route: '/dashboard/agents/new' },
  { key: 'KNOWLEDGE', title: 'Adicionar conhecimento', route: '/dashboard/knowledge' },
  { key: 'TOOLS', title: 'Ferramentas e integrações', route: '/dashboard/integrations' },
  { key: 'PHONE_NUMBER', title: 'Número e regras de atendimento', route: '/dashboard/telephony' },
  { key: 'TEST', title: 'Testar o agente', route: '/dashboard/agents' },
  { key: 'PUBLISH', title: 'Publicar uma versão', route: '/dashboard/agents' }
];

@Component({
  selector: 'app-activation-checklist',
  standalone: true,
  imports: [RouterLink, IconComponent, BackendPendingComponent],
  template: `
    <section class="vz-panel">
      <header class="vz-panel-head">
        <div>
          <h2 class="vz-panel-title">Ativação do workspace</h2>
          <p class="vz-panel-sub">Etapas para começar a receber chamadas</p>
        </div>
        @if (known()) {
          <span class="count">{{ doneCount() }}/{{ steps.length }}</span>
        }
      </header>

      <div class="progress" [attr.aria-label]="known() ? doneCount() + ' de ' + steps.length + ' etapas concluídas' : 'Progresso indisponível'">
        <span [style.width.%]="known() ? (doneCount() / steps.length) * 100 : 0"></span>
      </div>

      <ol class="steps">
        @for (step of rows(); track step.key) {
          <li [attr.data-state]="step.state">
            <span class="mark">
              @if (step.state === 'done') {
                <app-icon name="check" [size]="12" [strokeWidth]="3"></app-icon>
              } @else {
                {{ $index + 1 }}
              }
            </span>
            <div class="step-text">
              <a [routerLink]="step.route" class="step-title">{{ step.title }}</a>
              @if (step.pendingReason) {
                <span class="step-reason">{{ step.pendingReason }}</span>
              }
            </div>
            @if (step.state === 'current') {
              <a [routerLink]="step.route" class="go" aria-label="Ir para a etapa"><app-icon name="chevron-right" [size]="14"></app-icon></a>
            }
          </li>
        }
      </ol>

      @if (!known() && status() !== 'loading') {
        <app-backend-pending contractKey="onboarding" [status]="status()" [error]="error()" [compact]="true" (retry)="retry.emit()" />
      }
    </section>
  `,
  styles: [`
    :host { display: block; min-width: 0; }
    .count { font-size: 12.5px; font-weight: 600; color: #C084FC; font-variant-numeric: tabular-nums; }

    .progress { height: 6px; border-radius: 999px; background: var(--vz-surface-inset); overflow: hidden; }
    .progress span { display: block; height: 100%; background: linear-gradient(90deg, #6D28D9, #A78BFA); border-radius: inherit; transition: width var(--transition-smooth); }

    .steps { list-style: none; display: flex; flex-direction: column; gap: 2px; }
    .steps li { display: flex; align-items: center; gap: 10px; padding: 7px 8px; border-radius: 10px; }
    .steps li[data-state='current'] { background: var(--vz-accent-soft); }

    .mark {
      flex-shrink: 0;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      border: 1px solid var(--vz-border);
      background: var(--vz-surface-inset);
    }
    [data-state='done'] .mark { color: #0B0A10; background: #4ADE80; border-color: #4ADE80; }
    [data-state='current'] .mark { color: #FFFFFF; background: var(--vz-accent); border-color: var(--vz-accent); }

    .step-text { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.35; }
    .step-title { font-size: 13px; color: var(--text-secondary); }
    .step-title:hover { color: #FFFFFF; }
    [data-state='done'] .step-title { color: var(--text-muted); text-decoration: line-through; text-decoration-color: rgba(255,255,255,0.2); }
    [data-state='current'] .step-title { color: #FFFFFF; font-weight: 600; }
    .step-reason { font-size: 11.5px; color: #FBBF24; }
    .go { color: #C084FC; display: grid; place-items: center; }
  `]
})
export class ActivationChecklistComponent {
  readonly onboarding = input<OnboardingResponse | null>(null);
  readonly status = input<RemoteStatus>('loading');
  readonly error = input<RemoteError | null>(null);
  readonly retry = output<void>();

  readonly steps = STEPS;

  readonly known = computed(() => this.status() === 'ready' && !!this.onboarding());

  readonly rows = computed(() => {
    const data = this.onboarding();
    return STEPS.map(step => {
      const remote = data?.steps.find(s => s.key === step.key);
      const state = !data ? 'unknown' : remote?.completed ? 'done' : data.currentStep === step.key ? 'current' : 'todo';
      return { ...step, state, pendingReason: remote && !remote.completed ? remote.pendingReason : undefined };
    });
  });

  readonly doneCount = computed(() => this.rows().filter(r => r.state === 'done').length);
}
