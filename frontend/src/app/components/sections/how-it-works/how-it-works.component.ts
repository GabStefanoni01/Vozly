import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface StepItem {
  step: string;
  icon: string;
  title: string;
  description: string;
  outputHint: string;
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section how-it-works-section" id="como-funciona">
      <div class="ambient-glow glow-violet hiw-glow"></div>

      <div class="container">
        <!-- Cabeçalho -->
        <div class="section-header">
          <span class="section-tag">
            <app-icon name="activity" [size]="14"></app-icon>
            Fluxo Operacional
          </span>
          <h2 class="section-title">
            Uma ligação. Uma conversa.<br>
            <span class="gradient-text">Uma operação organizada.</span>
          </h2>
          <p class="section-subtitle">
            A Vozly utiliza inteligência artificial para transformar o atendimento telefônico em um fluxo estruturado de informações e ações.
          </p>
        </div>

        <!-- Linha do Tempo Visual / 4 Etapas Conectadas -->
        <div class="steps-flow-container">
          <!-- Linha Conectora de Gradiente -->
          <div class="flow-track-line" aria-hidden="true"></div>

          <div class="steps-grid">
            <div
              class="step-item"
              *ngFor="let item of steps; let i = index"
              [class.step-active]="selectedStep === i"
              (mouseenter)="selectedStep = i"
            >
              <!-- Ponto Conector com Número -->
              <div class="step-node-wrapper">
                <div class="step-node">
                  <span class="node-number">{{ item.step }}</span>
                </div>
                <div class="node-pulse"></div>
              </div>

              <!-- Card da Etapa -->
              <div class="step-card">
                <div class="step-card-header">
                  <div class="step-icon-pill">
                    <app-icon [name]="item.icon" [size]="20"></app-icon>
                  </div>
                  <span class="step-badge">Etapa {{ item.step }}</span>
                </div>

                <h3 class="step-title">{{ item.title }}</h3>
                <p class="step-desc">{{ item.description }}</p>

                <div class="step-footer">
                  <span class="output-label">Resultado:</span>
                  <span class="output-text">{{ item.outputHint }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .how-it-works-section {
      position: relative;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
    }

    .hiw-glow {
      top: 30%;
      right: 10%;
      width: 500px;
      height: 500px;
      opacity: 0.2;
    }

    /* Linha do Tempo Visual */
    .steps-flow-container {
      position: relative;
      margin-top: 20px;
    }

    /* Linha Conectora Desktop */
    .flow-track-line {
      display: none;
    }

    @media (min-width: 992px) {
      .flow-track-line {
        display: block;
        position: absolute;
        top: 24px;
        left: 50px;
        right: 50px;
        height: 2px;
        background: linear-gradient(90deg, 
          rgba(109, 0, 255, 0.2) 0%, 
          rgba(168, 85, 247, 0.8) 50%, 
          rgba(109, 0, 255, 0.2) 100%
        );
        z-index: 1;
      }
    }

    .steps-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
      position: relative;
      z-index: 2;
    }

    @media (min-width: 600px) {
      .steps-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 992px) {
      .steps-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      }
    }

    .step-item {
      display: flex;
      flex-direction: column;
      position: relative;
      transition: all var(--transition-base);
    }

    /* Ponto Conector */
    .step-node-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 20px;
      position: relative;
    }

    @media (min-width: 992px) {
      .step-node-wrapper {
        justify-content: center;
      }
    }

    .step-node {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: var(--bg-card);
      border: 2px solid var(--border-highlight);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3;
      transition: all var(--transition-base);
    }

    .node-number {
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .step-item:hover .step-node,
    .step-item.step-active .step-node {
      background: var(--gradient-primary);
      border-color: #FFFFFF;
      box-shadow: 0 0 20px rgba(109, 0, 255, 0.7);
      transform: scale(1.1);
    }

    /* Card da Etapa */
    .step-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: var(--radius-lg);
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex: 1;
      transition: all var(--transition-smooth);
    }

    .step-item:hover .step-card,
    .step-item.step-active .step-card {
      border-color: var(--border-highlight);
      transform: translateY(-4px);
      box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(109, 0, 255, 0.15);
    }

    .step-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .step-icon-pill {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      background: rgba(109, 0, 255, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--light-purple);
    }

    .step-badge {
      font-size: 11px;
      font-family: var(--font-mono);
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .step-title {
      font-size: 17px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 10px;
      line-height: 1.3;
    }

    .step-desc {
      font-size: 14px;
      line-height: 1.55;
      color: var(--text-secondary);
      margin-bottom: 20px;
      flex: 1;
    }

    .step-footer {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding-top: 14px;
      border-top: 1px solid var(--border-subtle);
      font-size: 12px;
    }

    .output-label {
      color: var(--light-purple);
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .output-text {
      color: var(--text-muted);
    }
  `]
})
export class HowItWorksComponent {
  selectedStep = 0;

  steps: StepItem[] = [
    {
      step: '01',
      icon: 'phone-incoming',
      title: 'A ligação chega',
      description: 'O cliente entra em contato com a empresa por telefone em qualquer horário.',
      outputHint: 'Recepção imediata sem fila de espera'
    },
    {
      step: '02',
      icon: 'mic',
      title: 'A IA conversa',
      description: 'A Vozly identifica a intenção do cliente, faz perguntas e coleta as informações necessárias.',
      outputHint: 'Diálogo natural em português BR'
    },
    {
      step: '03',
      icon: 'layers',
      title: 'A solicitação é organizada',
      description: 'As informações são estruturadas para que possam ser utilizadas pela operação da empresa.',
      outputHint: 'Ficha padronizada de atendimento'
    },
    {
      step: '04',
      icon: 'check-circle',
      title: 'O atendimento continua',
      description: 'Conforme as integrações disponíveis, a solicitação segue para agendamento, registro ou encaminhamento à equipe.',
      outputHint: 'Continuidade operacional sem ruído'
    }
  ];
}
