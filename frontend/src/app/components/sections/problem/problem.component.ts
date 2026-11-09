import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface ProblemCard {
  number: string;
  icon: string;
  title: string;
  description: string;
  impact: string;
}

@Component({
  selector: 'app-problem',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section problem-section" id="problema">
      <div class="ambient-glow glow-purple problem-glow"></div>

      <div class="container">
        <!-- Cabeçalho da Seção -->
        <div class="section-header">
          <span class="section-tag">
            <app-icon name="alert-circle" [size]="14"></app-icon>
            O Desafio Comercial
          </span>
          <h2 class="section-title">
            Enquanto sua equipe está ocupada,<br>
            seus clientes continuam ligando.
          </h2>
          <p class="section-subtitle">
            Uma ligação não atendida pode representar uma solicitação perdida, um agendamento que não aconteceu ou uma oportunidade que foi direcionada para outra empresa.
          </p>
        </div>

        <!-- Grade de 3 Cards de Problemas -->
        <div class="problem-grid">
          <div class="card problem-card" *ngFor="let item of problemCards">
            <!-- Número do Card -->
            <div class="card-top-row">
              <span class="card-number">{{ item.number }}</span>
              <div class="card-icon-pill">
                <app-icon [name]="item.icon" [size]="22"></app-icon>
              </div>
            </div>

            <!-- Título & Descrição -->
            <h3 class="problem-title">{{ item.title }}</h3>
            <p class="problem-description">{{ item.description }}</p>

            <!-- Impacto Operacional -->
            <div class="impact-badge">
              <span class="impact-dot"></span>
              <span class="impact-text">{{ item.impact }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .problem-section {
      position: relative;
      background: var(--bg-primary);
    }

    .problem-glow {
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 350px;
      opacity: 0.25;
    }

    .problem-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      position: relative;
      z-index: 1;
    }

    @media (min-width: 768px) {
      .problem-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .problem-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 290px;
    }

    .card-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .card-number {
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 600;
      color: var(--light-purple);
      padding: 3px 8px;
      background: rgba(109, 0, 255, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.2);
      border-radius: 6px;
    }

    .problem-title {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 12px;
      line-height: 1.3;
    }

    .problem-description {
      font-size: 15px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 24px;
      flex: 1;
    }

    .impact-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 16px;
      border-top: 1px solid var(--border-subtle);
      font-size: 12px;
      color: var(--text-muted);
    }

    .impact-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(168, 85, 247, 0.6);
    }
  `]
})
export class ProblemComponent {
  problemCards: ProblemCard[] = [
    {
      number: '01',
      icon: 'clock',
      title: 'Chamadas fora do expediente',
      description: 'Seus clientes podem precisar de atendimento mesmo quando sua equipe já encerrou o expediente.',
      impact: 'Perda de solicitações noturnas e de fins de semana'
    },
    {
      number: '02',
      icon: 'activity',
      title: 'Sobrecarga operacional',
      description: 'Interromper atividades para atender constantemente o telefone pode prejudicar a produtividade da equipe.',
      impact: 'Ruptura de foco e lentidão na execução dos serviços'
    },
    {
      number: '03',
      icon: 'layers',
      title: 'Informações desorganizadas',
      description: 'Solicitações, dúvidas e pedidos de agendamento precisam ser organizados para que a equipe consiga dar continuidade ao atendimento.',
      impact: 'Dados incompletos e retrabalho na triagem manual'
    }
  ];
}
