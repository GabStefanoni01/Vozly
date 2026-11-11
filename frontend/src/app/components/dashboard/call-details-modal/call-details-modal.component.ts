import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';
import { Call } from '../../../models/dashboard.models';

@Component({
  selector: 'app-call-details-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="drawer-backdrop" *ngIf="isOpen && call" (click)="close()">
      <div class="drawer-panel dash-glass-card" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
        <!-- Topo do Drawer -->
        <div class="drawer-header">
          <div class="header-left-col">
            <div class="call-id-row">
              <span class="call-protocol">#{{ call.id.substring(call.id.length - 8).toUpperCase() }}</span>
              <span class="dash-badge" [ngClass]="getStatusBadgeClass(call.status)">
                {{ formatStatus(call.status) }}
              </span>
              <span class="dash-badge dash-badge-neutral">
                {{ formatDuration(call.durationSeconds) }}
              </span>
            </div>
            <h3 class="caller-title">{{ call.callerNumber }}</h3>
          </div>
          <button class="close-btn" (click)="close()" aria-label="Fechar detalhes da chamada">
            <app-icon name="x" [size]="20"></app-icon>
          </button>
        </div>

        <!-- Metadados da Chamada -->
        <div class="call-meta-grid">
          <div class="meta-card">
            <span class="meta-label">Agente de IA</span>
            <span class="meta-val">{{ call.agentName }} (v{{ call.agentVersion }}.0)</span>
          </div>
          <div class="meta-card">
            <span class="meta-label">Linha Telefônica</span>
            <span class="meta-val">{{ call.phoneNumber }}</span>
          </div>
          <div class="meta-card">
            <span class="meta-label">Sentimento Detectado</span>
            <span class="meta-val sentiment" [ngClass]="call.sentiment.toLowerCase()">
              {{ call.sentiment === 'POSITIVE' ? 'Positivo' : call.sentiment === 'NEUTRAL' ? 'Neutro' : 'Crítico' }}
            </span>
          </div>
          <div class="meta-card">
            <span class="meta-label">Resultado Final</span>
            <span class="meta-val">{{ formatOutcome(call.outcome) }}</span>
          </div>
        </div>

        <!-- Resumo da Chamada -->
        <div class="summary-box">
          <span class="summary-title">Resumo Operacional da Interação</span>
          <p class="summary-text">{{ call.summary }}</p>
        </div>

        <!-- Transcrição Turno a Turno -->
        <div class="transcript-section">
          <h4 class="section-heading">
            <app-icon name="file-text" [size]="16" color="#C084FC"></app-icon>
            <span>Transcrição Completa da Conversa</span>
          </h4>

          <div class="turns-list" *ngIf="call.messages && call.messages.length > 0; else noMessages">
            <div
              class="turn-bubble"
              *ngFor="let turn of call.messages"
              [class.user]="turn.role === 'user'"
              [class.assistant]="turn.role === 'assistant'"
            >
              <div class="turn-top">
                <span class="turn-sender">
                  <app-icon [name]="turn.role === 'user' ? 'user' : 'bot'" [size]="13"></app-icon>
                  <span>{{ turn.role === 'user' ? 'Interlocutor' : call.agentName }}</span>
                </span>
                <span class="turn-time">{{ turn.timestamp }}</span>
              </div>
              <p class="turn-text">{{ turn.content }}</p>

              <!-- Bloco de Execução de Ferramenta -->
              <div class="tool-execution-block" *ngIf="turn.toolCall">
                <div class="te-header">
                  <app-icon name="zap" [size]="13" color="#C084FC"></app-icon>
                  <span class="te-key">{{ turn.toolCall.toolKey }}</span>
                  <span class="te-latency">{{ turn.toolCall.executionTimeMs }}ms</span>
                </div>
                <div class="te-body">
                  <div class="te-line">
                    <span class="te-tag">Entrada:</span>
                    <code>{{ turn.toolCall.inputSummary }}</code>
                  </div>
                  <div class="te-line">
                    <span class="te-tag">Saída:</span>
                    <span class="te-res">{{ turn.toolCall.outputSummary }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ng-template #noMessages>
            <div class="empty-transcript">
              <p>Nenhuma mensagem gravada para esta chamada.</p>
            </div>
          </ng-template>
        </div>

        <!-- Rodapé do Drawer -->
        <div class="drawer-footer">
          <span class="lgpd-text">
            <app-icon name="shield" [size]="13" color="#4ADE80"></app-icon>
            Dados protegidos e retidos conforme diretrizes da LGPD (docs/10).
          </span>
          <button class="btn btn-secondary btn-sm" (click)="close()">Fechar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(10px);
      z-index: 1000;
      display: flex;
      justify-content: flex-end;
      animation: fadeIn 0.2s ease-out;
    }

    .drawer-panel {
      width: 100%;
      max-width: 560px;
      height: 100vh;
      background: rgba(14, 12, 20, 0.98);
      border-left: 1px solid rgba(168, 85, 247, 0.35);
      display: flex;
      flex-direction: column;
      padding: 28px;
      overflow-y: auto;
      box-shadow: -20px 0 60px rgba(0, 0, 0, 0.9);
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .drawer-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .header-left-col {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .call-id-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .call-protocol {
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--light-purple);
      font-weight: 700;
    }

    .caller-title {
      font-size: 22px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    .close-btn {
      color: var(--text-muted);
      padding: 6px;
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .close-btn:hover {
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.08);
    }

    .call-meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 20px 0;
    }

    .meta-card {
      padding: 10px 14px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .meta-label {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .meta-val {
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .meta-val.sentiment.positive { color: #4ADE80; }
    .meta-val.sentiment.neutral { color: #38BDF8; }
    .meta-val.sentiment.negative { color: #F87171; }

    .summary-box {
      padding: 14px 16px;
      border-radius: 14px;
      background: rgba(109, 0, 255, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.25);
      margin-bottom: 24px;
    }

    .summary-title {
      display: block;
      font-size: 11.5px;
      font-weight: 700;
      color: #E9D5FF;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 6px;
    }

    .summary-text {
      font-size: 13.5px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .transcript-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .section-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .turns-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .turn-bubble {
      padding: 14px;
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .turn-bubble.user {
      background: rgba(109, 0, 255, 0.16);
      border: 1px solid rgba(168, 85, 247, 0.3);
    }

    .turn-bubble.assistant {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
    }

    .turn-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11.5px;
    }

    .turn-sender {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      color: var(--light-purple);
    }

    .turn-time {
      color: var(--text-muted);
    }

    .turn-text {
      font-size: 13.5px;
      color: #FFFFFF;
      line-height: 1.5;
    }

    .tool-execution-block {
      margin-top: 6px;
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(168, 85, 247, 0.25);
      font-size: 11.5px;
    }

    .te-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
      color: #C084FC;
      margin-bottom: 4px;
    }

    .te-latency {
      font-size: 10.5px;
      color: var(--text-muted);
      margin-left: auto;
    }

    .te-body {
      display: flex;
      flex-direction: column;
      gap: 2px;
      color: var(--text-secondary);
    }

    .te-line {
      display: flex;
      gap: 6px;
    }

    .te-tag {
      font-weight: 600;
      color: var(--text-muted);
    }

    .empty-transcript {
      padding: 30px;
      text-align: center;
      color: var(--text-muted);
      font-size: 13px;
    }

    .drawer-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding-top: 18px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin-top: 24px;
    }

    .lgpd-text {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--text-muted);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `]
})
export class CallDetailsModalComponent {
  @Input() isOpen: boolean = false;
  @Input() call: Call | null = null;
  @Output() closeEvent = new EventEmitter<void>();

  close(): void {
    this.closeEvent.emit();
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'IN_PROGRESS': return 'Em Andamento';
      case 'COMPLETED': return 'Concluída';
      case 'TRANSFERRED': return 'Transferida';
      default: return status;
    }
  }

  formatOutcome(outcome: string): string {
    switch (outcome) {
      case 'RESOLVED': return 'Resolvida Diretamente pela IA';
      case 'TRANSFERRED_HUMAN': return 'Transferida para Atendente Humano';
      case 'CALLBACK_REQUESTED': return 'Retorno Solicitado';
      default: return outcome;
    }
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'IN_PROGRESS': return 'dash-badge-purple';
      case 'COMPLETED': return 'dash-badge-green';
      case 'TRANSFERRED': return 'dash-badge-blue';
      default: return 'dash-badge-neutral';
    }
  }
}
