import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface IntegrationCategory {
  icon: string;
  title: string;
  description: string;
  scope: string;
}

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section integrations-section" id="integracoes">
      <div class="ambient-glow glow-purple integrations-glow"></div>

      <div class="container">
        <!-- Cabeçalho -->
        <div class="section-header">
          <span class="section-tag">
            <app-icon name="share-2" [size]="14"></app-icon>
            Conectividade & Expansão
          </span>
          <h2 class="section-title">
            Conecte o atendimento à<br>
            <span class="gradient-text">operação da sua empresa.</span>
          </h2>
          <p class="section-subtitle">
            A Vozly está sendo concebida para atuar como uma camada inteligente entre a comunicação com o cliente e os processos internos da empresa.
          </p>
        </div>

        <!-- Grade de Categorias de Integração -->
        <div class="integrations-grid">
          <div class="card integration-card" *ngFor="let item of categories">
            <div class="card-icon-pill">
              <app-icon [name]="item.icon" [size]="22"></app-icon>
            </div>

            <h3 class="integration-title">{{ item.title }}</h3>
            <p class="integration-desc">{{ item.description }}</p>

            <div class="integration-scope-badge">
              <span class="scope-dot"></span>
              <span>{{ item.scope }}</span>
            </div>
          </div>
        </div>

        <!-- Identificação Obrigatória de Desenvolvimento -->
        <div class="integrations-badge-status">
          <div class="status-inner-box">
            <app-icon name="activity" [size]="16" color="#A855F7"></app-icon>
            <span class="status-strong">Ecossistema de integrações em desenvolvimento.</span>
            <span class="status-light">— Conexões modulares sendo estruturadas para compatibilidade via webhooks e APIs restritas.</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .integrations-section {
      position: relative;
      background: var(--bg-primary);
    }

    .integrations-glow {
      top: 30%;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 400px;
      opacity: 0.16;
    }

    .integrations-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      position: relative;
      z-index: 1;
      margin-bottom: 40px;
    }

    @media (min-width: 640px) {
      .integrations-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .integrations-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .integration-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .integration-title {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 10px;
      line-height: 1.3;
    }

    .integration-desc {
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 20px;
      flex: 1;
    }

    .integration-scope-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-family: var(--font-mono);
      color: var(--text-muted);
      padding-top: 14px;
      border-top: 1px solid var(--border-subtle);
    }

    .scope-dot {
      width: 5px;
      height: 5px;
      background: var(--light-purple);
      border-radius: 50%;
    }

    /* Badge Obrigatório Discreto */
    .integrations-badge-status {
      display: flex;
      justify-content: center;
    }

    .status-inner-box {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: rgba(109, 0, 255, 0.08);
      border: 1px solid var(--purple-border);
      border-radius: var(--radius-pill);
      font-size: 13px;
      flex-wrap: wrap;
      justify-content: center;
      text-align: center;
    }

    .status-strong {
      color: #FFFFFF;
      font-weight: 600;
    }

    .status-light {
      color: var(--text-secondary);
    }
  `]
})
export class IntegrationsComponent {
  categories: IntegrationCategory[] = [
    {
      icon: 'database',
      title: 'Sistemas de Gestão',
      description: 'Sincronização de cadastros, ordens de serviço e histórico operacional com ERPs corporativos.',
      scope: 'Sincronização de Ordens de Serviço'
    },
    {
      icon: 'calendar',
      title: 'Agendas e Calendários',
      description: 'Consulta em tempo real de horários livres e reserva organizada de compromissos com clientes.',
      scope: 'Disponibilidade e Agendamento'
    },
    {
      icon: 'message-circle',
      title: 'WhatsApp',
      description: 'Envio de comprovantes, resumos de chamada e continuidade do atendimento por mensagem.',
      scope: 'Mensageria Complementar'
    },
    {
      icon: 'users',
      title: 'CRMs',
      description: 'Registro imediato do contato, classificação do lead e histórico de chamadas vinculadas ao cliente.',
      scope: 'Relacionamento com o Cliente'
    },
    {
      icon: 'hammer',
      title: 'Sistemas Operacionais de Campo',
      description: 'Roteamento direto de chamados técnicos para equipes externas e técnicos de manutenção.',
      scope: 'Operação e Despacho Externo'
    },
    {
      icon: 'terminal',
      title: 'APIs Empresariais',
      description: 'Webhooks e endpoints para troca de dados customizada com ferramentas proprietárias do seu negócio.',
      scope: 'Webhooks e Eventos Restritos'
    }
  ];
}
