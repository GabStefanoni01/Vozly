import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface IndustryItem {
  icon: string;
  title: string;
  description: string;
  exampleCall: string;
  tag: string;
}

@Component({
  selector: 'app-industries',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section industries-section" id="aplicacoes">
      <div class="ambient-glow glow-purple industries-glow"></div>

      <div class="container">
        <!-- Cabeçalho -->
        <div class="section-header">
          <span class="section-tag">
            <app-icon name="briefcase" [size]="14"></app-icon>
            Segmentos Atendidos
          </span>
          <h2 class="section-title">
            Uma tecnologia.<br>
            <span class="gradient-text">Diferentes operações.</span>
          </h2>
          <p class="section-subtitle">
            A Vozly pode ser adaptada para empresas que dependem de comunicação, agendamentos e atendimento recorrente.
          </p>
        </div>

        <!-- Grade de Segmentos -->
        <div class="industries-grid">
          <div
            class="card industry-card"
            *ngFor="let ind of industries; let i = index"
            [class.active-segment]="activeIndex === i"
            (mouseenter)="activeIndex = i"
          >
            <div class="industry-card-header">
              <div class="card-icon-pill">
                <app-icon [name]="ind.icon" [size]="22"></app-icon>
              </div>
              <span class="industry-tag">{{ ind.tag }}</span>
            </div>

            <h3 class="industry-title">{{ ind.title }}</h3>
            <p class="industry-desc">{{ ind.description }}</p>

            <!-- Exemplo de Aplicação Prática -->
            <div class="industry-example-box">
              <span class="example-label">Exemplo de fluxo:</span>
              <p class="example-text">{{ ind.exampleCall }}</p>
            </div>
          </div>
        </div>

        <!-- Nota de Posicionamento Clara -->
        <div class="industries-disclaimer">
          <app-icon name="alert-circle" [size]="16" color="#A855F7"></app-icon>
          <span>
            A Vozly atua como camada de recepção inteligente e estruturação operacional, integrando-se aos sistemas da empresa — sem substituir softwares clínicos ou ERPs existentes.
          </span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .industries-section {
      position: relative;
      background: var(--bg-primary);
    }

    .industries-glow {
      top: 25%;
      right: 20%;
      width: 550px;
      height: 450px;
      opacity: 0.18;
    }

    .industries-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      position: relative;
      z-index: 1;
      margin-bottom: 36px;
    }

    @media (min-width: 640px) {
      .industries-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .industries-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .industry-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all var(--transition-base);
    }

    .industry-card.active-segment {
      border-color: var(--border-highlight);
      background: linear-gradient(180deg, rgba(32, 32, 42, 0.6) 0%, rgba(21, 21, 27, 0.95) 100%);
    }

    .industry-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .industry-tag {
      font-size: 11px;
      font-family: var(--font-mono);
      color: var(--light-purple);
      background: rgba(109, 0, 255, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.2);
      padding: 3px 8px;
      border-radius: 4px;
    }

    .industry-title {
      font-size: 19px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 10px;
      line-height: 1.3;
    }

    .industry-desc {
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 20px;
      flex: 1;
    }

    .industry-example-box {
      background: rgba(5, 5, 5, 0.6);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 12px;
      font-size: 12px;
      line-height: 1.45;
    }

    .example-label {
      display: block;
      color: var(--light-purple);
      font-weight: 600;
      font-size: 11px;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .example-text {
      color: var(--text-muted);
    }

    .industries-disclaimer {
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 820px;
      margin: 0 auto;
      padding: 16px 20px;
      background: rgba(109, 0, 255, 0.06);
      border: 1px solid var(--purple-border);
      border-radius: var(--radius-md);
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.5;
      text-align: left;
    }
  `]
})
export class IndustriesComponent {
  activeIndex = 0;

  industries: IndustryItem[] = [
    {
      icon: 'wrench',
      title: 'Assistências técnicas',
      description: 'Recepção de solicitações, identificação de equipamentos e organização de pedidos de manutenção.',
      exampleCall: 'Identifica marca, modelo e defeito para triagem técnica antes do envio à bancada.',
      tag: 'Validação Inicial'
    },
    {
      icon: 'stethoscope',
      title: 'Clínicas e consultórios',
      description: 'Recepção inicial, identificação da necessidade do paciente e organização de solicitações de agendamento.',
      exampleCall: 'Coleta especialidade desejada, preferência de turno e dados básicos para confirmação.',
      tag: 'Agendamentos'
    },
    {
      icon: 'car',
      title: 'Oficinas mecânicas',
      description: 'Coleta de informações sobre veículos, serviços solicitados e pedidos de avaliação com antecedência.',
      exampleCall: 'Registra modelo do veículo, ano e sintomas mecânicos para orçamento prévio.',
      tag: 'Serviços Automotivos'
    },
    {
      icon: 'hammer',
      title: 'Empresas de manutenção',
      description: 'Registro de solicitações, identificação de problemas e encaminhamento para equipes responsáveis.',
      exampleCall: 'Atendimento de chamados prediais e industriais com categorização de criticidade.',
      tag: 'Operação de Campo'
    },
    {
      icon: 'users',
      title: 'Prestadores de serviços',
      description: 'Organização de contatos, identificação da necessidade do cliente e preparação de agendamentos.',
      exampleCall: 'Atende clientes mesmo durante a execução de outros trabalhos externos.',
      tag: 'Profissionais'
    },
    {
      icon: 'building',
      title: 'Pequenas e médias empresas',
      description: 'Automação do primeiro contato telefônico e organização das solicitações recebidas.',
      exampleCall: 'Filtra chamadas comerciais, dúvidas frequentes e solicitações de orçamento.',
      tag: 'Atendimento Geral'
    }
  ];
}
