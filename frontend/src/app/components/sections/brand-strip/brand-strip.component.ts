import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface PillarItem {
  icon: string;
  label: string;
  desc: string;
}

@Component({
  selector: 'app-brand-strip',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="brand-strip-section">
      <!-- Linha de Reflexo Luminoso do Horizonte de Eventos -->
      <div class="horizon-specular-line" aria-hidden="true"></div>

      <div class="container">
        <div class="horizon-glass-panel">
          <!-- Frase Central de Posicionamento -->
          <div class="strip-header">
            <p class="strip-statement">
              Muito além de atender chamadas.
              <span class="highlight">Uma nova forma de organizar operações.</span>
            </p>
          </div>

          <!-- Pilares Tecnológicos da Plataforma -->
          <div class="pillars-grid">
            <div class="pillar-item" *ngFor="let pillar of pillars">
              <div class="pillar-icon-box">
                <app-icon [name]="pillar.icon" [size]="18" color="#A855F7"></app-icon>
              </div>
              <div class="pillar-text">
                <span class="pillar-label">{{ pillar.label }}</span>
                <span class="pillar-desc">{{ pillar.desc }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .brand-strip-section {
      position: relative;
      background: linear-gradient(180deg, rgba(11, 11, 15, 0.72) 0%, var(--bg-secondary) 100%);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
      border-bottom: 1px solid var(--border-subtle);
      padding: 44px 0;
      z-index: 4;
    }

    /* Reflexo Luminoso Superior que Recebe a Luz do Buraco Negro */
    .horizon-specular-line {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 5%,
        rgba(109, 0, 255, 0.35) 25%,
        rgba(216, 180, 254, 0.85) 50%,
        rgba(109, 0, 255, 0.35) 75%,
        transparent 95%
      );
      box-shadow: 0 0 24px rgba(168, 85, 247, 0.55);
    }

    .horizon-glass-panel {
      position: relative;
    }

    .strip-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .strip-statement {
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: #FFFFFF;
    }

    .strip-statement .highlight {
      color: var(--light-purple);
      margin-left: 4px;
    }

    @media (max-width: 768px) {
      .strip-statement {
        font-size: 17px;
        line-height: 1.4;
      }
    }

    /* Grade dos Pilares */
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    @media (min-width: 768px) {
      .pillars-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .pillars-grid {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    .pillar-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(168, 85, 247, 0.12);
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
    }

    .pillar-item:hover {
      background: rgba(109, 0, 255, 0.08);
      border-color: rgba(168, 85, 247, 0.35);
      transform: translateY(-2px);
    }

    .pillar-icon-box {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(109, 0, 255, 0.14);
      border: 1px solid rgba(168, 85, 247, 0.24);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .pillar-text {
      display: flex;
      flex-direction: column;
    }

    .pillar-label {
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .pillar-desc {
      font-size: 11px;
      color: var(--text-muted);
    }
  `]
})
export class BrandStripComponent {
  pillars: PillarItem[] = [
    {
      icon: 'sparkles',
      label: 'Inteligência Artificial',
      desc: 'Compreensão contextual'
    },
    {
      icon: 'mic',
      label: 'Atendimento por Voz',
      desc: 'Diálogos telefônicos fluidos'
    },
    {
      icon: 'bot',
      label: 'Automação',
      desc: 'Triagem e roteamento'
    },
    {
      icon: 'activity',
      label: 'Gestão Operacional',
      desc: 'Estruturação de dados'
    },
    {
      icon: 'layers',
      label: 'Integrações',
      desc: 'Conectividade empresarial'
    }
  ];
}
