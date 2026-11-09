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
      <div class="container">
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
    </section>
  `,
  styles: [`
    .brand-strip-section {
      position: relative;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      padding: 40px 0;
      z-index: 2;
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
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
    }

    .pillar-item:hover {
      background: rgba(109, 0, 255, 0.06);
      border-color: rgba(168, 85, 247, 0.25);
      transform: translateY(-2px);
    }

    .pillar-icon-box {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(109, 0, 255, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.2);
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
