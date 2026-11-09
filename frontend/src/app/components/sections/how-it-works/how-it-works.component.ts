import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StepItem {
  marks: number[];
  step: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section hiw-minimal-section" id="como-funciona">
      <!-- Fundo Minimalista Exclusivo: Feixes Vetoriais de Sinal de Voz + Brilho Difuso -->
      <div class="hiw-minimal-backdrop" aria-hidden="true">
        <div class="hiw-glow-orb"></div>
        <svg
          class="hiw-vector-wave"
          viewBox="0 0 1440 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M-60 390 C 280 420, 440 130, 760 240 C 1060 340, 1210 110, 1500 150"
            stroke="url(#hiwRibbon1)"
            stroke-width="2.5"
            opacity="0.7"
          />
          <path
            d="M-60 430 C 310 450, 470 165, 780 270 C 1080 370, 1230 145, 1500 190"
            stroke="url(#hiwRibbon2)"
            stroke-width="1.2"
            opacity="0.45"
          />
          <path
            d="M-60 350 C 250 385, 410 95, 740 210 C 1040 310, 1190 80, 1500 115"
            stroke="url(#hiwRibbon2)"
            stroke-width="1"
            stroke-dasharray="4 8"
            opacity="0.35"
          />
          <defs>
            <linearGradient id="hiwRibbon1" x1="0" y1="260" x2="1440" y2="260" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#6D00FF" stop-opacity="0" />
              <stop offset="25%" stop-color="#8B3DFF" stop-opacity="0.65" />
              <stop offset="55%" stop-color="#C084FC" stop-opacity="0.9" />
              <stop offset="85%" stop-color="#6D00FF" stop-opacity="0.5" />
              <stop offset="100%" stop-color="#6D00FF" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="hiwRibbon2" x1="0" y1="260" x2="1440" y2="260" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#6D00FF" stop-opacity="0" />
              <stop offset="50%" stop-color="#A855F7" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#6D00FF" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div class="container hiw-container">
        <!-- Cabeçalho no Layout do Primeiro Print -->
        <div class="hiw-header-left">
          <h2 class="hiw-heading-lavender">
            Uma ligação. Uma conversa.<br>
            Uma operação organizada.
          </h2>
          <p class="hiw-subheading">
            A Vozly utiliza inteligência artificial para transformar o atendimento telefônico em um fluxo estruturado de informações e ações.
          </p>
        </div>

        <!-- 4 Cards Translúcidos no Layout do Primeiro Print -->
        <div class="hiw-glass-grid">
          <article class="hiw-glass-card" *ngFor="let item of steps">
            <div class="hiw-top-row">
              <div class="progressive-marks" aria-hidden="true">
                <span class="geo-mark" *ngFor="let m of item.marks">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                    <path d="M7 4C5.34315 4 4 5.34315 4 7C4 8.65685 5.34315 10 7 10H10V7C10 5.34315 8.65685 4 7 4Z" fill="#7C3AED"/>
                    <path d="M17 4C18.6569 4 20 5.34315 20 7C20 8.65685 18.6569 10 17 10H14V7C14 5.34315 15.3431 4 17 4Z" fill="#8B5CF6"/>
                    <path d="M7 20C5.34315 20 4 18.6569 4 17C4 15.3431 5.34315 14 7 14H10V17C10 18.6569 8.65685 20 7 20Z" fill="#8B5CF6"/>
                    <path d="M17 20C18.6569 20 20 18.6569 20 17C20 15.3431 18.6569 14 17 14H14V17C14 18.6569 15.3431 20 17 20Z" fill="#7C3AED"/>
                    <rect x="9" y="9" width="6" height="6" rx="1" fill="#A855F7" />
                  </svg>
                </span>
              </div>
              <span class="step-num-tag">{{ item.step }}</span>
            </div>

            <h3 class="hiw-card-title">{{ item.title }}</h3>
            <p class="hiw-card-desc">{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hiw-minimal-section {
      position: relative;
      background-color: var(--bg-secondary);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      padding: 120px 0 130px 0;
      overflow: hidden;
    }

    .hiw-minimal-backdrop {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hiw-glow-orb {
      position: absolute;
      width: 780px;
      height: 360px;
      background: radial-gradient(ellipse at center, rgba(109, 0, 255, 0.16) 0%, rgba(168, 85, 247, 0.06) 50%, transparent 75%);
      filter: blur(75px);
    }

    .hiw-vector-wave {
      width: 100%;
      height: 100%;
      max-height: 460px;
      filter: drop-shadow(0 0 18px rgba(139, 61, 255, 0.35));
    }

    .hiw-container {
      position: relative;
      z-index: 2;
    }

    .hiw-header-left {
      max-width: 680px;
      margin-bottom: 52px;
      text-align: left;
    }

    .hiw-heading-lavender {
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
      .hiw-heading-lavender {
        font-size: 28px;
      }
    }

    .hiw-subheading {
      font-size: 16px;
      line-height: 1.65;
      color: var(--text-secondary);
      max-width: 580px;
    }

    .hiw-glass-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }

    @media (min-width: 640px) {
      .hiw-glass-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .hiw-glass-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
      }
    }

    .hiw-glass-card {
      background: rgba(14, 14, 20, 0.66);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(168, 85, 247, 0.14);
      border-radius: 16px;
      padding: 34px 28px;
      min-height: 250px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      transition: all var(--transition-smooth);
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
    }

    .hiw-glass-card:hover {
      background: rgba(20, 18, 30, 0.78);
      border-color: rgba(168, 85, 247, 0.38);
      transform: translateY(-4px);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.65), 0 0 25px rgba(109, 0, 255, 0.16);
    }

    .hiw-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 22px;
    }

    .progressive-marks {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .geo-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.45));
    }

    .step-num-tag {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--light-purple);
      opacity: 0.8;
    }

    .hiw-card-title {
      font-family: var(--font-display);
      font-size: 15.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: #FFFFFF;
      line-height: 1.4;
      margin-bottom: 14px;
    }

    .hiw-card-desc {
      font-size: 14px;
      line-height: 1.65;
      color: #A1A1AA;
      font-weight: 400;
    }
  `]
})
export class HowItWorksComponent {
  steps: StepItem[] = [
    {
      marks: [1],
      step: '01',
      title: 'A LIGAÇÃO CHEGA',
      description: 'O cliente entra em contato com a empresa por telefone em qualquer horário, sendo atendido imediatamente sem fila de espera.'
    },
    {
      marks: [1, 2],
      step: '02',
      title: 'A IA CONVERSA',
      description: 'A Vozly identifica a intenção do cliente em português natural, faz perguntas contextuais e coleta as informações necessárias.'
    },
    {
      marks: [1, 2, 3],
      step: '03',
      title: 'A SOLICITAÇÃO É ORGANIZADA',
      description: 'As informações são estruturadas de maneira padronizada para que possam ser utilizadas pela operação da empresa.'
    },
    {
      marks: [1, 2, 3, 4],
      step: '04',
      title: 'O ATENDIMENTO CONTINUA',
      description: 'Conforme as integrações disponíveis, a solicitação segue para agendamento, registro ou encaminhamento à equipe responsável.'
    }
  ];
}
