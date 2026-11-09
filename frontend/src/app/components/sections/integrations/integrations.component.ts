import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface IntegrationCategory {
  marks: number[];
  title: string;
  description: string;
}

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section integrations-minimal-section" id="integracoes">
      <!-- Elemento de Fundo Minimalista Exclusivo: Arcos de Conexão Vetoriais e Brilho Violeta -->
      <div class="integrations-minimal-backdrop" aria-hidden="true">
        <div class="integrations-glow-center"></div>
        <svg
          class="integrations-arcs-svg"
          viewBox="0 0 1440 620"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M120 620 C 340 240, 1100 240, 1320 620"
            stroke="url(#intArcGrad1)"
            stroke-width="1.5"
            opacity="0.55"
          />
          <path
            d="M-40 520 C 320 120, 1120 120, 1480 520"
            stroke="url(#intArcGrad2)"
            stroke-width="1"
            stroke-dasharray="4 8"
            opacity="0.4"
          />
          <path
            d="M260 620 C 460 350, 980 350, 1180 620"
            stroke="url(#intArcGrad2)"
            stroke-width="28"
            stroke-linecap="round"
            opacity="0.12"
          />
          <circle cx="720" cy="230" r="3" fill="#C084FC" opacity="0.7" />
          <circle cx="420" cy="315" r="2.5" fill="#A855F7" opacity="0.55" />
          <circle cx="1020" cy="315" r="2.5" fill="#A855F7" opacity="0.55" />
          <defs>
            <linearGradient id="intArcGrad1" x1="120" y1="400" x2="1320" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#6D00FF" stop-opacity="0" />
              <stop offset="50%" stop-color="#C084FC" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#6D00FF" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="intArcGrad2" x1="0" y1="320" x2="1440" y2="320" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#6D00FF" stop-opacity="0" />
              <stop offset="50%" stop-color="#8B3DFF" stop-opacity="0.75" />
              <stop offset="100%" stop-color="#6D00FF" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div class="container integrations-container">
        <!-- Cabeçalho no Estilo do Primeiro Print -->
        <div class="integrations-header-left">
          <h2 class="integrations-heading-lavender">
            Conecte o atendimento à<br>
            operação da sua empresa.
          </h2>
          <p class="integrations-subheading">
            A Vozly está sendo concebida para atuar como uma camada inteligente entre a comunicação com o cliente e os processos internos da empresa.
          </p>
        </div>

        <!-- Grade de Categorias no Layout do Primeiro Print -->
        <div class="integrations-glass-grid">
          <article class="integration-glass-card" *ngFor="let item of categories">
            <div class="progressive-marks" aria-hidden="true">
              <span class="geo-mark" *ngFor="let m of item.marks">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7 4C5.34315 4 4 5.34315 4 7C4 8.65685 5.34315 10 7 10H10V7C10 5.34315 8.65685 4 7 4Z" fill="#7C3AED"/>
                  <path d="M17 4C18.6569 4 20 5.34315 20 7C20 8.65685 18.6569 10 17 10H14V7C14 5.34315 15.3431 4 17 4Z" fill="#8B5CF6"/>
                  <path d="M7 20C5.34315 20 4 18.6569 4 17C4 15.3431 5.34315 14 7 14H10V17C10 18.6569 8.65685 20 7 20Z" fill="#8B5CF6"/>
                  <path d="M17 20C18.6569 20 20 18.6569 20 17C20 15.3431 18.6569 14 17 14H14V17C14 18.6569 15.3431 20 17 20Z" fill="#7C3AED"/>
                  <rect x="9" y="9" width="6" height="6" rx="1" fill="#A855F7" />
                </svg>
              </span>
            </div>

            <h3 class="integration-glass-title">{{ item.title }}</h3>
            <p class="integration-glass-desc">{{ item.description }}</p>
          </article>
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
    .integrations-minimal-section {
      position: relative;
      background: var(--bg-primary);
      padding: 120px 0 130px 0;
      overflow: hidden;
    }

    .integrations-minimal-backdrop {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 0;
    }

    .integrations-glow-center {
      position: absolute;
      width: 760px;
      height: 440px;
      background: radial-gradient(ellipse at center, rgba(109, 0, 255, 0.16) 0%, rgba(168, 85, 247, 0.06) 50%, transparent 75%);
      filter: blur(80px);
    }

    .integrations-arcs-svg {
      width: 100%;
      height: 100%;
      max-height: 600px;
      filter: drop-shadow(0 0 18px rgba(139, 61, 255, 0.3));
    }

    .integrations-container {
      position: relative;
      z-index: 2;
    }

    .integrations-header-left {
      max-width: 680px;
      margin-bottom: 52px;
      text-align: left;
    }

    .integrations-heading-lavender {
      font-family: var(--font-display);
      font-size: 42px;
      font-weight: 600;
      line-height: 1.18;
      letter-spacing: -0.025em;
      background: linear-gradient(95deg, #C4B5FD 0%, #A78BFA 50%, #8B5CF6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .integrations-heading-lavender {
        font-size: 28px;
      }
    }

    .integrations-subheading {
      font-size: 16px;
      line-height: 1.65;
      color: var(--text-secondary);
      max-width: 580px;
    }

    .integrations-glass-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      margin-bottom: 44px;
    }

    @media (min-width: 640px) {
      .integrations-glass-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .integrations-glass-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 28px;
      }
    }

    .integration-glass-card {
      background: rgba(13, 13, 19, 0.66);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(168, 85, 247, 0.14);
      border-radius: 16px;
      padding: 36px 32px;
      min-height: 235px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      transition: all var(--transition-smooth);
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
    }

    .integration-glass-card:hover {
      background: rgba(19, 17, 29, 0.78);
      border-color: rgba(168, 85, 247, 0.38);
      transform: translateY(-4px);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.7), 0 0 25px rgba(109, 0, 255, 0.18);
    }

    .progressive-marks {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 22px;
    }

    .geo-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.45));
    }

    .integration-glass-title {
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: #FFFFFF;
      line-height: 1.4;
      margin-bottom: 16px;
    }

    .integration-glass-desc {
      font-size: 14px;
      line-height: 1.65;
      color: #A1A1AA;
      font-weight: 400;
    }

    .integrations-badge-status {
      display: flex;
      justify-content: center;
    }

    .status-inner-box {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: rgba(12, 12, 18, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid var(--purple-border);
      border-radius: var(--radius-md);
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
      marks: [1],
      title: 'SISTEMAS DE GESTÃO',
      description: 'Sincronização de cadastros, ordens de serviço e histórico operacional com ERPs corporativos.'
    },
    {
      marks: [1, 2],
      title: 'AGENDAS E CALENDÁRIOS',
      description: 'Consulta em tempo real de horários livres e reserva organizada de compromissos com clientes.'
    },
    {
      marks: [1, 2, 3],
      title: 'WHATSAPP',
      description: 'Envio de comprovantes, resumos de chamada e continuidade do atendimento por mensagem.'
    },
    {
      marks: [1],
      title: 'CRMs',
      description: 'Registro imediato do contato, classificação do lead e histórico de chamadas vinculadas ao cliente.'
    },
    {
      marks: [1, 2],
      title: 'SISTEMAS OPERACIONAIS DE CAMPO',
      description: 'Roteamento direto de chamados técnicos para equipes externas e técnicos de manutenção.'
    },
    {
      marks: [1, 2, 3],
      title: 'APIs EMPRESARIAIS',
      description: 'Webhooks e endpoints para troca de dados customizada com ferramentas proprietárias do seu negócio.'
    }
  ];
}
