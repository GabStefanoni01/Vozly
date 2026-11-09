import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface IndustryCardItem {
  marks: number[];
  title: string;
  description: string;
}

@Component({
  selector: 'app-industries',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section industries-minimal-section" id="aplicacoes">
      <!-- Elemento de Fundo Minimalista Exclusivo: Feixes de Luz Multilinhas e Aura Violeta -->
      <div class="industries-minimal-backdrop" aria-hidden="true">
        <div class="industries-ambient-orb orb-left"></div>
        <div class="industries-ambient-orb orb-right"></div>
        <svg
          class="industries-ribbon-svg"
          viewBox="0 0 1440 680"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <!-- Feixe Principal em fita translúcida -->
          <path
            d="M-80 560 C 260 520, 480 180, 780 310 C 1060 430, 1220 120, 1520 90"
            stroke="url(#indFlowMain)"
            stroke-width="46"
            stroke-linecap="round"
            opacity="0.18"
          />
          <path
            d="M-80 560 C 260 520, 480 180, 780 310 C 1060 430, 1220 120, 1520 90"
            stroke="url(#indFlowCore)"
            stroke-width="2"
            opacity="0.75"
          />
          <path
            d="M-80 600 C 290 555, 510 220, 800 345 C 1080 465, 1250 165, 1520 130"
            stroke="url(#indFlowSub)"
            stroke-width="1.2"
            opacity="0.45"
          />
          <path
            d="M-80 520 C 230 485, 450 145, 760 275 C 1040 395, 1190 85, 1520 55"
            stroke="url(#indFlowSub)"
            stroke-width="1"
            opacity="0.35"
          />
          <defs>
            <linearGradient id="indFlowMain" x1="0" y1="580" x2="1440" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#6D00FF" stop-opacity="0" />
              <stop offset="30%" stop-color="#7C3AED" stop-opacity="0.9" />
              <stop offset="70%" stop-color="#A855F7" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#6D00FF" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="indFlowCore" x1="0" y1="580" x2="1440" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#6D00FF" stop-opacity="0" />
              <stop offset="35%" stop-color="#C084FC" stop-opacity="0.95" />
              <stop offset="65%" stop-color="#E9D5FF" stop-opacity="1" />
              <stop offset="100%" stop-color="#8B3DFF" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="indFlowSub" x1="0" y1="580" x2="1440" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#6D00FF" stop-opacity="0" />
              <stop offset="50%" stop-color="#A855F7" stop-opacity="0.65" />
              <stop offset="100%" stop-color="#6D00FF" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div class="container industries-container">
        <!-- Cabeçalho no Estilo do Primeiro Print -->
        <div class="industries-header-left">
          <h2 class="industries-heading-lavender">
            Uma tecnologia. Diferentes operações.
          </h2>
          <p class="industries-subheading">
            A Vozly pode ser adaptada para empresas que dependem de comunicação, agendamentos e atendimento recorrente.
          </p>
        </div>

        <!-- Grade de Cards Translúcidos no Layout do Primeiro Print -->
        <div class="industries-glass-grid">
          <article class="industry-glass-card" *ngFor="let ind of industries">
            <div class="progressive-marks" aria-hidden="true">
              <span class="geo-mark" *ngFor="let m of ind.marks">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7 4C5.34315 4 4 5.34315 4 7C4 8.65685 5.34315 10 7 10H10V7C10 5.34315 8.65685 4 7 4Z" fill="#7C3AED"/>
                  <path d="M17 4C18.6569 4 20 5.34315 20 7C20 8.65685 18.6569 10 17 10H14V7C14 5.34315 15.3431 4 17 4Z" fill="#8B5CF6"/>
                  <path d="M7 20C5.34315 20 4 18.6569 4 17C4 15.3431 5.34315 14 7 14H10V17C10 18.6569 8.65685 20 7 20Z" fill="#8B5CF6"/>
                  <path d="M17 20C18.6569 20 20 18.6569 20 17C20 15.3431 18.6569 14 17 14H14V17C14 18.6569 15.3431 20 17 20Z" fill="#7C3AED"/>
                  <rect x="9" y="9" width="6" height="6" rx="1" fill="#A855F7" />
                </svg>
              </span>
            </div>

            <h3 class="industry-glass-title">{{ ind.title }}</h3>
            <p class="industry-glass-desc">{{ ind.description }}</p>
          </article>
        </div>

        <!-- Nota Discreta de Escopo -->
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
    .industries-minimal-section {
      position: relative;
      background-color: var(--bg-primary);
      padding: 120px 0 130px 0;
      overflow: hidden;
    }

    .industries-minimal-backdrop {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .industries-ambient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(85px);
    }

    .industries-ambient-orb.orb-left {
      bottom: 12%;
      left: 12%;
      width: 480px;
      height: 360px;
      background: radial-gradient(circle, rgba(109, 0, 255, 0.22) 0%, transparent 70%);
    }

    .industries-ambient-orb.orb-right {
      top: 16%;
      right: 12%;
      width: 520px;
      height: 380px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, transparent 70%);
    }

    .industries-ribbon-svg {
      width: 100%;
      height: 100%;
      max-height: 640px;
      filter: drop-shadow(0 0 24px rgba(139, 61, 255, 0.35));
    }

    .industries-container {
      position: relative;
      z-index: 2;
    }

    .industries-header-left {
      max-width: 680px;
      margin-bottom: 52px;
      text-align: left;
    }

    .industries-heading-lavender {
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
      .industries-heading-lavender {
        font-size: 28px;
      }
    }

    .industries-subheading {
      font-size: 16px;
      line-height: 1.65;
      color: var(--text-secondary);
      max-width: 580px;
    }

    .industries-glass-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      margin-bottom: 44px;
    }

    @media (min-width: 640px) {
      .industries-glass-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .industries-glass-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 28px;
      }
    }

    .industry-glass-card {
      background: rgba(13, 13, 19, 0.66);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(168, 85, 247, 0.14);
      border-radius: 16px;
      padding: 36px 32px;
      min-height: 240px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      transition: all var(--transition-smooth);
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
    }

    .industry-glass-card:hover {
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

    .industry-glass-title {
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: #FFFFFF;
      line-height: 1.4;
      margin-bottom: 16px;
    }

    .industry-glass-desc {
      font-size: 14px;
      line-height: 1.65;
      color: #A1A1AA;
      font-weight: 400;
    }

    .industries-disclaimer {
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 820px;
      margin: 0 auto;
      padding: 16px 20px;
      background: rgba(12, 12, 18, 0.75);
      backdrop-filter: blur(12px);
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
  industries: IndustryCardItem[] = [
    {
      marks: [1],
      title: 'ASSISTÊNCIAS TÉCNICAS',
      description: 'Recepção de solicitações, identificação de equipamentos e organização de pedidos de manutenção, coletando marca, modelo e defeito relatado.'
    },
    {
      marks: [1, 2],
      title: 'CLÍNICAS E CONSULTÓRIOS',
      description: 'Recepção inicial, identificação da necessidade do paciente e organização de solicitações de agendamento conforme especialidade e turno.'
    },
    {
      marks: [1, 2, 3],
      title: 'OFICINAS MECÂNICAS',
      description: 'Coleta de informações sobre veículos, serviços solicitados e pedidos de avaliação com registro de sintomas mecânicos.'
    },
    {
      marks: [1],
      title: 'EMPRESAS DE MANUTENÇÃO',
      description: 'Registro de solicitações prediais ou industriais, identificação de problemas e encaminhamento estruturado para as equipes responsáveis.'
    },
    {
      marks: [1, 2],
      title: 'PRESTADORES DE SERVIÇOS',
      description: 'Organização de contatos, identificação da necessidade do cliente e preparação de agendamentos mesmo durante trabalhos externos.'
    },
    {
      marks: [1, 2, 3],
      title: 'PEQUENAS E MÉDIAS EMPRESAS',
      description: 'Automação do primeiro contato telefônico e organização das solicitações comerciais e dúvidas frequentes recebidas.'
    }
  ];
}
