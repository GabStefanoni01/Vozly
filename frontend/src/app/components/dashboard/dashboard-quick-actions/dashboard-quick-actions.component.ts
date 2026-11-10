import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-dashboard-quick-actions',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="dash-glass-card quick-actions-card">
      <div class="actions-content">
        <h4 class="actions-title">Ações Rápidas</h4>
        <p class="actions-subtitle">Atalhos operacionais para gerenciar sua central de voz</p>

        <!-- Grade de 4 Ações Rápidas (Conforme Imagem 02) -->
        <div class="actions-grid">
          <a routerLink="/dashboard/agents/new" class="action-btn" title="Criar novo agente de IA">
            <div class="action-icon-pill">
              <app-icon name="plus" [size]="18"></app-icon>
            </div>
            <span class="action-label">Novo Agente</span>
          </a>

          <button class="action-btn" (click)="onOpenVoiceTest()" title="Abrir simulador interativo de voz">
            <div class="action-icon-pill">
              <app-icon name="mic" [size]="18"></app-icon>
            </div>
            <span class="action-label">Testar Voz</span>
          </button>

          <a routerLink="/dashboard/knowledge" class="action-btn" title="Gerenciar base de conhecimento">
            <div class="action-icon-pill">
              <app-icon name="book-open" [size]="18"></app-icon>
            </div>
            <span class="action-label">Nova Base</span>
          </a>

          <a routerLink="/dashboard/usage" class="action-btn" title="Ver relatório de consumo e minutos">
            <div class="action-icon-pill">
              <app-icon name="bar-chart-2" [size]="18"></app-icon>
            </div>
            <span class="action-label">Relatórios</span>
          </a>
        </div>
      </div>

      <!-- Elemento Gráfico Tridimensional Isometric Cube com Glow Violeta (Conforme Imagem 02) -->
      <div class="isometric-cube-container" aria-hidden="true">
        <div class="cube-glow-halo"></div>
        <div class="isometric-cube">
          <div class="cube-face top"></div>
          <div class="cube-face left"></div>
          <div class="cube-face right"></div>
          <div class="inner-core-glow"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .quick-actions-card {
      padding: 22px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      height: 100%;
      min-height: 160px;
      position: relative;
      overflow: hidden;
    }

    .actions-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      z-index: 2;
    }

    .actions-title {
      font-size: 15px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.01em;
    }

    .actions-subtitle {
      font-size: 12px;
      color: var(--text-secondary);
      margin: 2px 0 14px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    @media (max-width: 600px) {
      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 8px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      transition: all var(--transition-fast);
      cursor: pointer;
      text-decoration: none;
    }

    .action-btn:hover {
      background: rgba(109, 0, 255, 0.18);
      border-color: rgba(168, 85, 247, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(109, 0, 255, 0.25);
    }

    .action-icon-pill {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(109, 0, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #C084FC;
    }

    .action-label {
      font-size: 11.5px;
      font-weight: 600;
      color: #FFFFFF;
      white-space: nowrap;
    }

    /* Elemento 3D Isométrico (Cubo de Cristal Neon Violeta da Imagem 02) */
    .isometric-cube-container {
      width: 100px;
      height: 100px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .isometric-cube-container {
        display: none;
      }
    }

    .cube-glow-halo {
      position: absolute;
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(109, 0, 255, 0.1) 50%, transparent 70%);
      filter: blur(15px);
      animation: pulseGlow 3s infinite;
    }

    .isometric-cube {
      width: 60px;
      height: 60px;
      position: relative;
      transform: rotateX(60deg) rotateZ(45deg);
      transform-style: preserve-3d;
      animation: floatSlow 4s ease-in-out infinite;
    }

    .cube-face {
      position: absolute;
      width: 48px;
      height: 48px;
      border: 1.5px solid rgba(168, 85, 247, 0.6);
      background: rgba(109, 0, 255, 0.2);
      backdrop-filter: blur(4px);
    }

    .cube-face.top {
      transform: translateZ(24px);
      background: rgba(192, 132, 252, 0.3);
      box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.4);
    }

    .cube-face.left {
      transform: rotateY(-90deg) translateZ(24px);
      background: rgba(109, 0, 255, 0.35);
    }

    .cube-face.right {
      transform: rotateX(90deg) translateZ(24px);
      background: rgba(139, 61, 255, 0.3);
    }

    .inner-core-glow {
      position: absolute;
      width: 20px;
      height: 20px;
      left: 14px;
      top: 14px;
      background: #FFFFFF;
      box-shadow: 0 0 16px #A855F7, 0 0 30px #6D00FF;
      border-radius: 4px;
      transform: translateZ(12px);
    }
  `]
})
export class DashboardQuickActionsComponent {
  @Output() openVoiceTest = new EventEmitter<void>();

  onOpenVoiceTest(): void {
    this.openVoiceTest.emit();
  }
}
