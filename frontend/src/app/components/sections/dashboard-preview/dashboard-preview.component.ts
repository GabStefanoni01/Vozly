import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-dashboard-preview',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section dashboard-preview-section" id="painel">
      <div class="ambient-glow glow-violet dash-glow" aria-hidden="true"></div>

      <div class="container">
        <div class="dashboard-showcase-grid">
          <!-- Lado Esquerdo: Imagem sem fundo do PC e Notebook -->
          <div class="devices-visual-col">
            <div class="devices-glow-backdrop" aria-hidden="true"></div>
            <picture class="devices-picture">
              <source srcset="brand/dashboard-devices.webp" type="image/webp" />
              <img
                src="brand/dashboard-devices.png"
                alt="Painel de Controle Vozly em Computador e Notebook"
                class="devices-mockup-img"
                loading="lazy"
              />
            </picture>
          </div>

          <!-- Lado Direito: Título, Texto Resumido e Botão de Ação -->
          <div class="dashboard-content-col">
            <h2 class="section-title content-title">
              Sua operação, em uma<br />
              <span class="gradient-text">visão mais organizada.</span>
            </h2>

            <p class="section-subtitle content-subtitle">
              Uma interface centralizada para acompanhar as interações e organizar o fluxo de atendimento da sua empresa em tempo real.
            </p>

            <div class="dashboard-cta-actions">
              <button class="btn btn-primary btn-lg" (click)="onOpenDashboardDemo()">
                <span>Conhecer a Vozly</span>
                <app-icon name="arrow-right" [size]="18"></app-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .dashboard-preview-section {
      position: relative;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      overflow: hidden;
      padding: 112px 0;
    }

    .dash-glow {
      top: 50%;
      left: 28%;
      transform: translate(-50%, -50%);
      width: 680px;
      height: 520px;
      opacity: 0.22;
      pointer-events: none;
    }

    .dashboard-showcase-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 48px;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    @media (min-width: 992px) {
      .dashboard-showcase-grid {
        grid-template-columns: 1.25fr 0.9fr;
        gap: 64px;
      }
    }

    /* Coluna Esquerda: PC + Notebook */
    .devices-visual-col {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .devices-glow-backdrop {
      position: absolute;
      inset: 8% 6%;
      background: radial-gradient(ellipse at center, rgba(139, 61, 255, 0.28) 0%, rgba(109, 0, 255, 0.08) 50%, transparent 75%);
      filter: blur(42px);
      z-index: 0;
      pointer-events: none;
    }

    .devices-picture {
      position: relative;
      z-index: 1;
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .devices-mockup-img {
      width: 100%;
      max-width: 740px;
      height: auto;
      object-fit: contain;
      filter: drop-shadow(0 28px 60px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 32px rgba(109, 0, 255, 0.18));
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .devices-visual-col:hover .devices-mockup-img {
      transform: translateY(-6px) scale(1.01);
    }

    /* Coluna Direita: Título, Subtítulo & Botão CTA */
    .dashboard-content-col {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
    }

    .content-title {
      margin-bottom: 20px;
      text-align: left;
      font-size: clamp(32px, 3.8vw, 46px);
      line-height: 1.15;
    }

    .content-subtitle {
      margin-bottom: 36px;
      text-align: left;
      max-width: 500px;
      font-size: 17px;
      line-height: 1.65;
      color: var(--text-secondary);
    }

    .dashboard-cta-actions {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    @media (max-width: 640px) {
      .dashboard-preview-section {
        padding: 72px 0;
      }

      .dashboard-cta-actions,
      .dashboard-cta-actions .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class DashboardPreviewComponent {
  @Output() openDemo = new EventEmitter<{ title: string; desc: string }>();

  onOpenDashboardDemo(): void {
    this.openDemo.emit({
      title: 'Painel Operacional — Vozly',
      desc: 'Solicite acesso antecipado para conhecer de perto a central de acompanhamento de chamadas, triagem e agendamentos em tempo real.'
    });
  }
}
