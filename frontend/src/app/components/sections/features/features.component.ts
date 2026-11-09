import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  badge: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section features-section" id="recursos">
      <div class="ambient-glow glow-violet features-glow"></div>

      <div class="container">
        <!-- Cabeçalho -->
        <div class="section-header">
          <span class="section-tag">
            <app-icon name="sparkles" [size]="14"></app-icon>
            Capacidades do Produto
          </span>
          <h2 class="section-title">
            Inteligência aplicada ao <span class="gradient-text">atendimento.</span>
          </h2>
          <p class="section-subtitle">
            Uma estrutura pensada para aproximar conversas telefônicas de processos operacionais, com precisão e controle.
          </p>
        </div>

        <!-- Grade de 6 Cards de Recursos -->
        <div class="features-grid">
          <div class="card feature-card" *ngFor="let feat of features">
            <div class="feature-card-top">
              <div class="card-icon-pill">
                <app-icon [name]="feat.icon" [size]="22"></app-icon>
              </div>
              <span class="feature-badge">{{ feat.badge }}</span>
            </div>

            <h3 class="feature-title">{{ feat.title }}</h3>
            <p class="feature-desc">{{ feat.description }}</p>

            <div class="feature-accent-line"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .features-section {
      position: relative;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
    }

    .features-glow {
      top: 40%;
      left: 10%;
      width: 500px;
      height: 500px;
      opacity: 0.2;
    }

    .features-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      position: relative;
      z-index: 1;
    }

    @media (min-width: 640px) {
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .features-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .feature-card {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .feature-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .feature-badge {
      font-size: 11px;
      font-family: var(--font-mono);
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.03);
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid var(--border-subtle);
    }

    .feature-title {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 12px;
      line-height: 1.3;
    }

    .feature-desc {
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 24px;
      flex: 1;
    }

    .feature-accent-line {
      height: 2px;
      width: 32px;
      background: var(--light-purple);
      border-radius: 2px;
      transition: width var(--transition-base);
    }

    .feature-card:hover .feature-accent-line {
      width: 60px;
      background: var(--gradient-primary);
    }
  `]
})
export class FeaturesComponent {
  features: FeatureItem[] = [
    {
      icon: 'mic',
      title: 'Atendimento por voz com IA',
      description: 'Agentes capazes de conversar naturalmente, compreender solicitações e conduzir atendimentos por telefone com clareza.',
      badge: 'Voz & Diálogo'
    },
    {
      icon: 'sparkles',
      title: 'Compreensão de solicitações',
      description: 'Identificação precisa do motivo do contato e organização lógica das informações fornecidas durante a conversa.',
      badge: 'Inteligência'
    },
    {
      icon: 'calendar',
      title: 'Agendamento de serviços',
      description: 'Preparação de fluxos de agendamento e consulta de disponibilidade mediante integração com sistemas compatíveis.',
      badge: 'Agendamento'
    },
    {
      icon: 'layers',
      title: 'Organização de atendimentos',
      description: 'Transformação das informações coletadas em registros estruturados e padronizados para continuidade operacional imediata.',
      badge: 'Operação'
    },
    {
      icon: 'database',
      title: 'Integração com operações empresariais',
      description: 'Arquitetura planejada para conectar o atendimento telefônico a sistemas de gestão e ferramentas empresariais.',
      badge: 'Conectividade'
    },
    {
      icon: 'message-circle',
      title: 'Comunicação integrada',
      description: 'Possibilidade de ampliar o fluxo de atendimento com canais complementares, como WhatsApp, conforme as integrações disponíveis.',
      badge: 'Multicanal'
    }
  ];
}
