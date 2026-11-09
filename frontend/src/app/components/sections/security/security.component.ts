import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface SecurityPillar {
  marks: number[];
  title: string;
  description: string;
}

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section security-minimal-section" id="seguranca">
      <!-- Elemento de Fundo Minimalista Exclusivo: Anéis Concêntricos de Governança + Luz Violeta -->
      <div class="security-minimal-backdrop" aria-hidden="true">
        <div class="security-glow-orb"></div>
        <svg
          class="security-rings-svg"
          viewBox="0 0 1440 540"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="720" cy="270" r="240" stroke="url(#secGrad1)" stroke-width="1.2" opacity="0.5" />
          <circle cx="720" cy="270" r="350" stroke="url(#secGrad2)" stroke-width="1" stroke-dasharray="4 8" opacity="0.38" />
          <circle cx="720" cy="270" r="470" stroke="url(#secGrad2)" stroke-width="1" opacity="0.25" />
          <line x1="140" y1="270" x2="1300" y2="270" stroke="url(#secLineGrad)" stroke-width="1" opacity="0.4" />
          <defs>
            <linearGradient id="secGrad1" x1="720" y1="30" x2="720" y2="510" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#C084FC" stop-opacity="0.7" />
              <stop offset="100%" stop-color="#6D00FF" stop-opacity="0.05" />
            </linearGradient>
            <linearGradient id="secGrad2" x1="720" y1="0" x2="720" y2="540" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#A855F7" stop-opacity="0.5" />
              <stop offset="100%" stop-color="#6D00FF" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="secLineGrad" x1="140" y1="270" x2="1300" y2="270" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#6D00FF" stop-opacity="0" />
              <stop offset="50%" stop-color="#C084FC" stop-opacity="0.75" />
              <stop offset="100%" stop-color="#6D00FF" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div class="container security-container">
        <!-- Cabeçalho no Layout do Primeiro Print -->
        <div class="security-header-left">
          <h2 class="security-heading-lavender">
            Tecnologia preparada para<br>
            operações reais.
          </h2>
          <p class="security-subheading">
            Atendimento automatizado exige organização, previsibilidade e responsabilidade no tratamento das informações.
          </p>
        </div>

        <!-- 4 Pilares no Layout de Cards Translúcidos do Primeiro Print -->
        <div class="security-glass-grid">
          <article class="security-glass-card" *ngFor="let pillar of pillars">
            <div class="progressive-marks" aria-hidden="true">
              <span class="geo-mark" *ngFor="let m of pillar.marks">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                  <path d="M7 4C5.34315 4 4 5.34315 4 7C4 8.65685 5.34315 10 7 10H10V7C10 5.34315 8.65685 4 7 4Z" fill="#7C3AED"/>
                  <path d="M17 4C18.6569 4 20 5.34315 20 7C20 8.65685 18.6569 10 17 10H14V7C14 5.34315 15.3431 4 17 4Z" fill="#8B5CF6"/>
                  <path d="M7 20C5.34315 20 4 18.6569 4 17C4 15.3431 5.34315 14 7 14H10V17C10 18.6569 8.65685 20 7 20Z" fill="#8B5CF6"/>
                  <path d="M17 20C18.6569 20 20 18.6569 20 17C20 15.3431 18.6569 14 17 14H14V17C14 18.6569 15.3431 20 17 20Z" fill="#7C3AED"/>
                  <rect x="9" y="9" width="6" height="6" rx="1" fill="#A855F7" />
                </svg>
              </span>
            </div>

            <h3 class="security-glass-title">{{ pillar.title }}</h3>
            <p class="security-glass-desc">{{ pillar.description }}</p>
          </article>
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
    .security-minimal-section {
      position: relative;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      padding: 120px 0 130px 0;
      overflow: hidden;
    }

    .security-minimal-backdrop {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 0;
    }

    .security-glow-orb {
      position: absolute;
      width: 680px;
      height: 380px;
      background: radial-gradient(ellipse at center, rgba(139, 61, 255, 0.16) 0%, rgba(109, 0, 255, 0.05) 55%, transparent 75%);
      filter: blur(75px);
    }

    .security-rings-svg {
      width: 100%;
      height: 100%;
      max-height: 540px;
    }

    .security-container {
      position: relative;
      z-index: 2;
    }

    .security-header-left {
      max-width: 680px;
      margin-bottom: 52px;
      text-align: left;
    }

    .security-heading-lavender {
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
      .security-heading-lavender {
        font-size: 28px;
      }
    }

    .security-subheading {
      font-size: 16px;
      line-height: 1.65;
      color: var(--text-secondary);
      max-width: 580px;
    }

    .security-glass-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      margin-bottom: 44px;
    }

    @media (min-width: 640px) {
      .security-glass-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .security-glass-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
      }
    }

    .security-glass-card {
      background: rgba(14, 14, 20, 0.66);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(168, 85, 247, 0.14);
      border-radius: 16px;
      padding: 34px 28px;
      min-height: 245px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      transition: all var(--transition-smooth);
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
    }

    .security-glass-card:hover {
      background: rgba(20, 18, 30, 0.78);
      border-color: rgba(168, 85, 247, 0.38);
      transform: translateY(-4px);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.65), 0 0 25px rgba(109, 0, 255, 0.16);
    }

    .progressive-marks {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 22px;
    }

    .geo-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.45));
    }

    .security-glass-title {
      font-family: var(--font-display);
      font-size: 15.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: #FFFFFF;
      line-height: 1.4;
      margin-bottom: 14px;
    }

    .security-glass-desc {
      font-size: 14px;
      line-height: 1.65;
      color: #A1A1AA;
      font-weight: 400;
    }

    .security-guarantee-note {
      max-width: 820px;
      margin: 0 auto;
      background: rgba(12, 12, 18, 0.75);
      backdrop-filter: blur(12px);
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
      marks: [1],
      title: 'CONTROLE OPERACIONAL',
      description: 'Os fluxos de atendimento devem respeitar rigorosamente as regras e os limites operacionais definidos pela empresa.'
    },
    {
      marks: [1, 2],
      title: 'TRANSPARÊNCIA',
      description: 'As informações coletadas são organizadas de maneira compreensível e rastreável para continuidade imediata do atendimento.'
    },
    {
      marks: [1, 2, 3],
      title: 'INTEGRAÇÃO RESPONSÁVEL',
      description: 'Cada integração respeita permissões, janelas de disponibilidade e regras de validação do sistema conectado.'
    },
    {
      marks: [1, 2, 3, 4],
      title: 'PRIVACIDADE',
      description: 'A arquitetura do produto considera proteção de dados, isolamento entre empresas e boas práticas de segurança desde sua concepção.'
    }
  ];
}
