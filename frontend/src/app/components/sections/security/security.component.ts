import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface SecurityPillar {
  icon: string;
  title: string;
  description: string;
  detail: string;
}

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section security-section" id="seguranca">
      <div class="ambient-glow glow-violet security-glow"></div>

      <div class="container">
        <!-- Cabeçalho -->
        <div class="section-header">
          <span class="section-tag">
            <app-icon name="shield" [size]="14"></app-icon>
            Governança & Confiabilidade
          </span>
          <h2 class="section-title">
            Tecnologia preparada para<br>
            <span class="gradient-text">operações reais.</span>
          </h2>
          <p class="section-subtitle">
            Atendimento automatizado exige organização, previsibilidade e responsabilidade no tratamento das informações.
          </p>
        </div>

        <!-- Grade de 4 Pilares -->
        <div class="security-grid">
          <div class="card security-card" *ngFor="let pillar of pillars">
            <div class="card-icon-pill">
              <app-icon [name]="pillar.icon" [size]="22"></app-icon>
            </div>

            <h3 class="security-title">{{ pillar.title }}</h3>
            <p class="security-desc">{{ pillar.description }}</p>

            <div class="security-detail-pill">
              <span class="detail-bullet">•</span>
              <span>{{ pillar.detail }}</span>
            </div>
          </div>
        </div>

        <!-- Mensagem de Rigor e Transparência -->
        <div class="security-guarantee-note">
          <div class="note-content">
            <app-icon name="lock" [size]="18" color="#A855F7"></app-icon>
            <p>
              <strong>Princípio de projeto:</strong> A IA da Vozly foi concebida para conversar e coletar; a validação, execução e regras de negócio permanecem sempre sob o controle explícito da empresa contratante.
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .security-section {
      position: relative;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
    }

    .security-glow {
      top: 30%;
      right: 15%;
      width: 500px;
      height: 450px;
      opacity: 0.16;
    }

    .security-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      position: relative;
      z-index: 1;
      margin-bottom: 36px;
    }

    @media (min-width: 640px) {
      .security-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .security-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .security-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .security-title {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 12px;
      line-height: 1.3;
    }

    .security-desc {
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 20px;
      flex: 1;
    }

    .security-detail-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--text-muted);
      padding-top: 14px;
      border-top: 1px solid var(--border-subtle);
      font-family: var(--font-mono);
    }

    .detail-bullet {
      color: var(--light-purple);
      font-size: 14px;
    }

    .security-guarantee-note {
      max-width: 820px;
      margin: 0 auto;
      background: rgba(109, 0, 255, 0.05);
      border: 1px solid var(--purple-border);
      border-radius: var(--radius-md);
      padding: 16px 24px;
    }

    .note-content {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .note-content strong {
      color: #FFFFFF;
    }
  `]
})
export class SecurityComponent {
  pillars: SecurityPillar[] = [
    {
      icon: 'sliders',
      title: 'Controle operacional',
      description: 'Os fluxos de atendimento devem respeitar as regras e os limites definidos pela empresa.',
      detail: 'Parâmetros customizáveis por negócio'
    },
    {
      icon: 'eye',
      title: 'Transparência',
      description: 'As informações coletadas devem ser organizadas de maneira compreensível para continuidade do atendimento.',
      detail: 'Auditoria e histórico estruturado'
    },
    {
      icon: 'check-circle',
      title: 'Integração responsável',
      description: 'Cada integração deve respeitar permissões, disponibilidade e regras do sistema conectado.',
      detail: 'Isolamento de privilégios e acessos'
    },
    {
      icon: 'shield-check',
      title: 'Privacidade',
      description: 'A arquitetura do produto deverá considerar proteção de dados e boas práticas de segurança desde sua concepção.',
      detail: 'Conformidade com a LGPD em planejamento'
    }
  ];
}
