import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-system-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dash-glass-card status-card">
      <div class="status-top">
        <div class="status-indicator-wrap">
          <span class="status-pulse-dot"></span>
          <span class="status-label-bold">Todos os Sistemas Operacionais</span>
        </div>
        <span class="status-badge-live">99.8% SLA</span>
      </div>

      <p class="status-subtext">Última checagem automática há 2 minutos</p>

      <div class="pipeline-health-grid">
        <div class="health-item">
          <span class="health-name">Runtime de Voz & SIP</span>
          <span class="health-val green">16ms</span>
        </div>
        <div class="health-item">
          <span class="health-name">Transcrição Neural (STT)</span>
          <span class="health-val green">95ms</span>
        </div>
        <div class="health-item">
          <span class="health-name">Síntese de Voz (TTS)</span>
          <span class="health-val green">110ms</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .status-card {
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      min-height: 160px;
    }

    .status-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .status-indicator-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-pulse-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #22C55E;
      box-shadow: 0 0 10px #22C55E;
      animation: pulseGlow 2s infinite;
      flex-shrink: 0;
    }

    .status-label-bold {
      font-size: 14.5px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .status-badge-live {
      font-size: 11px;
      font-weight: 700;
      color: #4ADE80;
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.3);
      padding: 3px 8px;
      border-radius: 9999px;
      letter-spacing: 0.03em;
    }

    .status-subtext {
      font-size: 12px;
      color: var(--text-muted);
      margin: 6px 0 14px;
    }

    .pipeline-health-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 12px;
    }

    @media (max-width: 600px) {
      .pipeline-health-grid {
        grid-template-columns: 1fr;
      }
    }

    .health-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .health-name {
      font-size: 11px;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .health-val {
      font-size: 12.5px;
      font-weight: 700;
      font-family: var(--font-mono);
    }

    .health-val.green {
      color: #4ADE80;
    }
  `]
})
export class DashboardSystemStatusComponent {}
