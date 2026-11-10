import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';
import { Agent } from '../../../models/dashboard.models';

interface AgentRank {
  name: string;
  role: string;
  resolutionRate: number;
}

@Component({
  selector: 'app-dashboard-performance-donut',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="dash-glass-card donut-card">
      <div class="donut-header">
        <div class="title-wrap">
          <h3 class="donut-title">Desempenho dos Agentes</h3>
          <span class="donut-subtitle">Taxa de resolução e satisfação telefônica</span>
        </div>
        <a routerLink="/dashboard/agents" class="view-all-link">
          <span>Ver Todos</span>
          <app-icon name="arrow-right" [size]="14"></app-icon>
        </a>
      </div>

      <div class="donut-content-grid">
        <!-- Donut SVG com Arco Neon Violeta (Conforme Imagem 02) -->
        <div class="donut-visual-col">
          <div class="donut-svg-wrapper">
            <svg viewBox="0 0 120 120" class="donut-svg">
              <defs>
                <linearGradient id="donutNeonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#C084FC" />
                  <stop offset="60%" stop-color="#8B3DFF" />
                  <stop offset="100%" stop-color="#6D00FF" />
                </linearGradient>
                <filter id="donutGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <!-- Trilha de Fundo Cinza Translúcida -->
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                stroke-width="10"
              />

              <!-- Arco Principal com Gradiente Roxo Neon (88% do perímetro) -->
              <circle
                cx="60"
                cy="60"
                r="48"
                fill="none"
                stroke="url(#donutNeonGradient)"
                stroke-width="10"
                stroke-linecap="round"
                stroke-dasharray="301.59"
                [attr.stroke-dashoffset]="strokeOffset"
                transform="rotate(-90 60 60)"
                filter="url(#donutGlow)"
              />
            </svg>

            <!-- Texto Central do Donut ("88% Média") -->
            <div class="donut-center-text">
              <span class="donut-score">{{ averageScore }}%</span>
              <span class="donut-score-label">Média Geral</span>
            </div>
          </div>
        </div>

        <!-- Lista Ranqueada dos Melhores Agentes (Conforme Imagem 02) -->
        <div class="ranking-col">
          <ul class="ranking-list">
            <li class="ranking-item" *ngFor="let item of rankedAgents; let i = index">
              <span class="rank-num">{{ i + 1 }}.</span>
              <div class="rank-info">
                <span class="rank-name">{{ item.name }}</span>
              </div>
              <span class="rank-score">{{ item.resolutionRate }}%</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .donut-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
      min-height: 290px;
    }

    .donut-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 2px;
    }

    .title-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .donut-title {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    .donut-subtitle {
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

    .donut-content-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      align-items: center;
      gap: 24px;
      flex: 1;
    }

    @media (max-width: 600px) {
      .donut-content-grid {
        grid-template-columns: 1fr;
        justify-items: center;
      }
    }

    .donut-visual-col {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .donut-svg-wrapper {
      width: 128px;
      height: 128px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .donut-svg {
      width: 100%;
      height: 100%;
      transform: rotate(0deg);
    }

    .donut-center-text {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      pointer-events: none;
    }

    .donut-score {
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: -0.03em;
      font-family: var(--font-display);
      line-height: 1;
    }

    .donut-score-label {
      font-size: 10px;
      color: var(--light-purple);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 3px;
    }

    .ranking-col {
      display: flex;
      flex-direction: column;
    }

    .ranking-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .ranking-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      transition: all var(--transition-fast);
    }

    .ranking-item:hover {
      background: rgba(109, 0, 255, 0.12);
      border-color: rgba(168, 85, 247, 0.3);
      transform: translateX(3px);
    }

    .rank-num {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 600;
      width: 16px;
    }

    .rank-info {
      flex: 1;
      overflow: hidden;
    }

    .rank-name {
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
    }

    .rank-score {
      font-size: 13px;
      font-weight: 700;
      color: var(--light-purple);
      font-family: var(--font-mono);
    }
  `]
})
export class DashboardPerformanceDonutComponent {
  @Input() averageScore: number = 88;

  readonly rankedAgents: AgentRank[] = [
    { name: 'Helena — Atendimento SAC', role: 'SAC Principal', resolutionRate: 94 },
    { name: 'Vitor — Vendas & Qualificação', role: 'Comercial', resolutionRate: 89 },
    { name: 'Larissa — Agendamentos & Presença', role: 'Agendamentos', resolutionRate: 85 },
    { name: 'Triagem N1 & Encaminhamento', role: 'Triagem', resolutionRate: 81 },
    { name: 'Cobrança & Avisos Amigáveis', role: 'Financeiro', resolutionRate: 74 }
  ];

  get strokeOffset(): number {
    const perimeter = 2 * Math.PI * 48; // 301.59
    return perimeter * (1 - this.averageScore / 100);
  }
}
