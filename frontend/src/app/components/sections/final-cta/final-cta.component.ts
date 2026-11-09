import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section final-cta-section" id="contato">
      <div class="ambient-glow glow-purple cta-glow"></div>

      <div class="container">
        <div class="cta-banner-card">
          <!-- Background Decorativo & Símbolo Oficial Vozly -->
          <div class="cta-backdrop-glow"></div>
          
          <div class="cta-brand-symbol-wrap">
            <img
              src="brand/vozly-symbol-orbit-tight.png"
              alt="Símbolo oficial Vozly"
              class="cta-symbol-img animate-float"
            />
          </div>

          <!-- Conteúdo -->
          <div class="cta-content">
            <span class="cta-tag">
              <span class="pulse-dot"></span>
              Próximo Passo
            </span>

            <h2 class="cta-title">
              O próximo atendimento da sua empresa pode começar de uma nova maneira.
            </h2>

            <p class="cta-description">
              Conheça a proposta da Vozly e descubra como a inteligência artificial pode transformar o atendimento telefônico em uma operação mais organizada.
            </p>

            <div class="cta-actions">
              <button class="btn btn-primary btn-lg" (click)="onKnowVozly()">
                Conhecer a Vozly
                <app-icon name="arrow-right" [size]="18"></app-icon>
              </button>
              <button class="btn btn-secondary btn-lg" (click)="onTalkTeam()">
                Falar com a equipe
              </button>
            </div>

            <!-- Informação Discreta de Configuração -->
            <div class="cta-meta-note">
              <span>Acompanhe o desenvolvimento antecipado da plataforma • Sem compromisso</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .final-cta-section {
      position: relative;
      background: var(--bg-primary);
      padding: 120px 0;
    }

    .cta-glow {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 700px;
      height: 450px;
      opacity: 0.3;
    }

    .cta-banner-card {
      position: relative;
      background: radial-gradient(circle at 50% 0%, rgba(109, 0, 255, 0.28) 0%, rgba(21, 21, 27, 0.95) 75%);
      border: 1px solid rgba(168, 85, 247, 0.35);
      border-radius: var(--radius-xl);
      padding: 64px 32px;
      text-align: center;
      overflow: hidden;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(109, 0, 255, 0.2);
    }

    @media (min-width: 768px) {
      .cta-banner-card {
        padding: 80px 48px;
      }
    }

    .cta-brand-symbol-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 28px;
    }

    .cta-symbol-img {
      width: 100px;
      height: 100px;
      object-fit: contain;
      filter: drop-shadow(0 0 25px rgba(109, 0, 255, 0.6));
    }

    .cta-content {
      max-width: 720px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .cta-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 14px;
      background: rgba(109, 0, 255, 0.15);
      border: 1px solid var(--purple-border);
      border-radius: var(--radius-pill);
      font-size: 12px;
      font-weight: 500;
      color: var(--light-purple);
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      background: var(--light-purple);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--light-purple);
    }

    .cta-title {
      font-size: 40px;
      font-weight: 800;
      line-height: 1.18;
      letter-spacing: -0.03em;
      color: #FFFFFF;
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .cta-title {
        font-size: 28px;
      }
    }

    .cta-description {
      font-size: 17px;
      line-height: 1.6;
      color: #D4D4D8;
      margin-bottom: 36px;
      max-width: 620px;
      margin-left: auto;
      margin-right: auto;
    }

    @media (max-width: 768px) {
      .cta-description {
        font-size: 15px;
      }
    }

    .cta-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 28px;
    }

    .cta-meta-note {
      font-size: 12px;
      color: var(--text-muted);
    }
  `]
})
export class FinalCtaComponent {
  @Output() openDemo = new EventEmitter<{ title: string; desc: string }>();

  onKnowVozly(): void {
    this.openDemo.emit({
      title: 'Conheça o Projeto Vozly',
      desc: 'Estamos validando o atendimento telefônico com inteligência artificial para os primeiros segmentos comerciais.'
    });
  }

  onTalkTeam(): void {
    this.openDemo.emit({
      title: 'Falar com o Responsável',
      desc: 'Envie sua mensagem para conversar diretamente sobre casos de uso, segmentos prioritários e parcerias de validação técnica.'
    });
  }
}
