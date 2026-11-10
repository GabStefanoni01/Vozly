import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';
import { Call } from '../../../models/dashboard.models';

@Component({
  selector: 'app-dashboard-recent-calls',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="dash-glass-card recent-calls-card">
      <div class="card-header">
        <div class="title-wrap">
          <h3 class="card-title">Chamadas Recentes</h3>
          <span class="card-subtitle">Últimas interações em tempo real</span>
        </div>
        <a routerLink="/dashboard/conversations" class="view-all-link">
          <span>Ver Todas</span>
          <app-icon name="arrow-right" [size]="14"></app-icon>
        </a>
      </div>

      <div class="calls-list">
        <div
          class="call-item"
          *ngFor="let call of calls.slice(0, 4)"
          (click)="onSelectCall(call)"
          role="button"
          tabindex="0"
          [attr.aria-label]="'Ver detalhes da chamada ' + call.callerNumber"
        >
          <div class="call-icon-pill" [ngClass]="getCallIconClass(call)">
            <app-icon [name]="getCallIconName(call)" [size]="16"></app-icon>
          </div>

          <div class="call-details">
            <div class="call-top-line">
              <span class="call-topic">{{ call.summary }}</span>
            </div>
            <div class="call-meta-line">
              <span class="call-ref">#{{ call.id.substring(call.id.length - 6).toUpperCase() }}</span>
              <span class="meta-dot">•</span>
              <span class="call-number">{{ call.callerNumber }}</span>
              <span class="meta-dot">•</span>
              <span class="call-time">{{ call.startedAt }}</span>
            </div>
          </div>

          <div class="call-status-col">
            <span class="dash-badge" [ngClass]="getStatusBadgeClass(call.status)">
              <span class="badge-dot" *ngIf="call.status === 'IN_PROGRESS'"></span>
              {{ formatStatus(call.status) }}
            </span>
            <app-icon name="chevron-right" [size]="16" color="#71717A" class="row-arrow"></app-icon>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .recent-calls-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 4px;
    }

    .title-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .card-title {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    .card-subtitle {
      font-size: 12.5px;
      color: var(--text-secondary);
    }

    .view-all-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 600;
      color: var(--light-purple);
      transition: all var(--transition-fast);
    }

    .view-all-link:hover {
      color: #FFFFFF;
      transform: translateX(2px);
    }

    .calls-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .call-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 14px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .call-item:hover {
      background: rgba(109, 0, 255, 0.12);
      border-color: rgba(168, 85, 247, 0.3);
      transform: translateX(4px);
    }

    .call-icon-pill {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .call-icon-pill.in-progress {
      background: rgba(109, 0, 255, 0.25);
      color: #C084FC;
      border: 1px solid rgba(168, 85, 247, 0.4);
      animation: dashPulseNeon 2.5s infinite;
    }

    .call-icon-pill.completed {
      background: rgba(34, 197, 94, 0.16);
      color: #4ADE80;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .call-icon-pill.transferred {
      background: rgba(56, 189, 248, 0.16);
      color: #38BDF8;
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    .call-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
      overflow: hidden;
    }

    .call-topic {
      font-size: 13.5px;
      font-weight: 600;
      color: #FFFFFF;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .call-meta-line {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-muted);
    }

    .call-ref {
      font-family: var(--font-mono);
      color: var(--light-purple);
      font-weight: 600;
      font-size: 11px;
    }

    .meta-dot {
      color: var(--text-dim);
    }

    .call-status-col {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #C084FC;
      box-shadow: 0 0 6px #C084FC;
      animation: pulseGlow 1.8s infinite;
    }

    .row-arrow {
      transition: transform var(--transition-fast);
    }

    .call-item:hover .row-arrow {
      color: #FFFFFF;
      transform: translateX(2px);
    }
  `]
})
export class DashboardRecentCallsComponent {
  @Input() calls: Call[] = [];
  @Output() selectCall = new EventEmitter<Call>();

  onSelectCall(call: Call): void {
    this.selectCall.emit(call);
  }

  getCallIconClass(call: Call): string {
    switch (call.status) {
      case 'IN_PROGRESS':
        return 'in-progress';
      case 'TRANSFERRED':
        return 'transferred';
      case 'COMPLETED':
      default:
        return 'completed';
    }
  }

  getCallIconName(call: Call): string {
    switch (call.status) {
      case 'IN_PROGRESS':
        return 'phone-call';
      case 'TRANSFERRED':
        return 'phone-forwarded';
      case 'COMPLETED':
      default:
        return 'phone';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'IN_PROGRESS':
        return 'dash-badge-purple';
      case 'COMPLETED':
        return 'dash-badge-green';
      case 'TRANSFERRED':
        return 'dash-badge-blue';
      case 'FAILED':
      case 'MISSED':
        return 'dash-badge-red';
      default:
        return 'dash-badge-neutral';
    }
  }

  formatStatus(status: string): string {
    switch (status) {
      case 'IN_PROGRESS':
        return 'Em Andamento';
      case 'COMPLETED':
        return 'Concluída';
      case 'TRANSFERRED':
        return 'Transferida';
      case 'FAILED':
        return 'Falha';
      case 'MISSED':
        return 'Perdida';
      default:
        return status;
    }
  }
}
