import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProblemCard {
  marks: number[];
  title: string;
  description: string;
}

@Component({
  selector: 'app-problem',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section problem-wave-section" id="problema">
      <!-- Onda 3D Roxa Fluindo no Fundo (Print 3 posicionada como no Print 1) -->
      <div class="wave-backdrop-wrapper" aria-hidden="true">
        <picture>
          <source srcset="brand/purple-wave-bg.webp" type="image/webp">
          <img
            src="brand/purple-wave-bg.jpg"
            alt=""
            class="wave-backdrop-img"
            loading="lazy"
          />
        </picture>
      </div>

      <div class="container problem-container">
        <!-- Cabeçalho Alinhado à Esquerda no Estilo do Print 1 -->
        <div class="problem-header-left">
          <h2 class="problem-heading-lavender">
            Enquanto sua equipe está ocupada,<br>
            seus clientes continuam ligando.
          </h2>
          <p class="problem-subheading">
            Uma ligação não atendida pode representar uma solicitação perdida, um agendamento que não aconteceu ou uma oportunidade que foi direcionada para outra empresa.
          </p>
        </div>

        <!-- 3 Cards Translúcidos sobre a Onda Roxa (Layout idêntico ao Print 1) -->
        <div class="problem-glass-grid">
          <article class="problem-glass-card" *ngFor="let item of problemCards">
            <!-- Símbolos Geométricos Roxos Progressivos (1, 2 e 3 unidades como no Print 1) -->
            <div class="progressive-marks" aria-hidden="true">
              <span class="geo-mark" *ngFor="let m of item.marks">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 4C5.34315 4 4 5.34315 4 7C4 8.65685 5.34315 10 7 10H10V7C10 5.34315 8.65685 4 7 4Z"
                    fill="#7C3AED"
                  />
                  <path
                    d="M17 4C18.6569 4 20 5.34315 20 7C20 8.65685 18.6569 10 17 10H14V7C14 5.34315 15.3431 4 17 4Z"
                    fill="#8B5CF6"
                  />
                  <path
                    d="M7 20C5.34315 20 4 18.6569 4 17C4 15.3431 5.34315 14 7 14H10V17C10 18.6569 8.65685 20 7 20Z"
                    fill="#8B5CF6"
                  />
                  <path
                    d="M17 20C18.6569 20 20 18.6569 20 17C20 15.3431 18.6569 14 17 14H14V17C14 18.6569 15.3431 20 17 20Z"
                    fill="#7C3AED"
                  />
                  <rect x="9" y="9" width="6" height="6" rx="1" fill="#A855F7" />
                </svg>
              </span>
            </div>

            <!-- Título em Caixa Alta & Descrição -->
            <h3 class="glass-card-title">{{ item.title }}</h3>
            <p class="glass-card-desc">{{ item.description }}</p>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .problem-wave-section {
      position: relative;
      background-color: var(--bg-primary);
      padding: 120px 0 130px 0;
      overflow: hidden;
    }

    /* Imagem da Onda 3D Roxa ao Fundo */
    .wave-backdrop-wrapper {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 0;
    }

    .wave-backdrop-img {
      width: 100%;
      max-width: 1560px;
      height: auto;
      object-fit: cover;
      opacity: 0.92;
      transform: translateY(15px) scale(1.04);
      mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, #000 60%, transparent 100%);
      -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, #000 60%, transparent 100%);
    }

    .problem-container {
      position: relative;
      z-index: 2;
    }

    /* Cabeçalho Alinhado à Esquerda (Estilo Print 1) */
    .problem-header-left {
      max-width: 680px;
      margin-bottom: 52px;
      text-align: left;
    }

    .problem-heading-lavender {
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
      .problem-heading-lavender {
        font-size: 28px;
      }
    }

    .problem-subheading {
      font-size: 16px;
      line-height: 1.65;
      color: var(--text-secondary);
      max-width: 580px;
    }

    /* Grid de 3 Cards de Vidro Escuro sobre a Onda */
    .problem-glass-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }

    @media (min-width: 768px) {
      .problem-glass-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 28px;
      }
    }

    .problem-glass-card {
      background: rgba(12, 12, 18, 0.68);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(168, 85, 247, 0.14);
      border-radius: 16px;
      padding: 36px 32px;
      min-height: 265px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      transition: all var(--transition-smooth);
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
    }

    .problem-glass-card:hover {
      background: rgba(18, 16, 28, 0.76);
      border-color: rgba(168, 85, 247, 0.38);
      transform: translateY(-4px);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.7), 0 0 25px rgba(109, 0, 255, 0.18);
    }

    /* Ícones Geométricos Progressivos no Topo */
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

    .glass-card-title {
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: #FFFFFF;
      line-height: 1.4;
      margin-bottom: 16px;
    }

    .glass-card-desc {
      font-size: 14px;
      line-height: 1.65;
      color: #A1A1AA;
      font-weight: 400;
    }
  `]
})
export class ProblemComponent {
  problemCards: ProblemCard[] = [
    {
      marks: [1],
      title: 'CHAMADAS FORA DO EXPEDIENTE',
      description: 'Seus clientes podem precisar de atendimento mesmo quando sua equipe já encerrou o expediente.'
    },
    {
      marks: [1, 2],
      title: 'SOBRECARGA OPERACIONAL',
      description: 'Interromper atividades para atender constantemente o telefone pode prejudicar a produtividade da equipe.'
    },
    {
      marks: [1, 2, 3],
      title: 'INFORMAÇÕES DESORGANIZADAS',
      description: 'Solicitações, dúvidas e pedidos de agendamento precisam ser organizados para que a equipe consiga dar continuidade ao atendimento.'
    }
  ];
}
