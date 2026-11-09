import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-call-demo',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section call-demo-section" id="demonstracao">
      <div class="ambient-glow glow-purple call-glow" aria-hidden="true"></div>

      <div class="container">
        <div class="call-showcase-grid">
          <!-- Lado Esquerdo: Celular sem fundo com demonstração na tela -->
          <div class="phone-visual-col">
            <div class="phone-glow-backdrop" aria-hidden="true"></div>
            <picture class="phone-picture">
              <source srcset="brand/call-demo-phone.webp" type="image/webp" />
              <img
                src="brand/call-demo-phone.png"
                alt="Demonstração de Atendimento Telefônico Vozly no Celular"
                class="phone-mockup-img"
                loading="lazy"
              />
            </picture>
          </div>

          <!-- Lado Direito: Título, Texto Resumido e Botão de Ação -->
          <div class="call-content-col">
            <h2 class="section-title content-title">
              Veja uma conversa se transformar<br />
              <span class="gradient-text">em atendimento.</span>
            </h2>

            <p class="section-subtitle content-subtitle">
              Um exemplo de como a Vozly pode conduzir uma solicitação telefônica, compreender o contexto e estruturar as informações para sua equipe.
            </p>

            <div class="call-cta-actions">
              <button class="btn btn-primary btn-lg" (click)="onOpenCallDemo()">
                <span>Testar atendimento com IA</span>
                <app-icon name="arrow-right" [size]="18"></app-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .call-demo-section {
      position: relative;
      background: var(--bg-primary);
      overflow: hidden;
      padding: 112px 0;
    }

    .call-glow {
      top: 50%;
      left: 25%;
      transform: translate(-50%, -50%);
      width: 640px;
      height: 540px;
      opacity: 0.2;
      pointer-events: none;
    }

    .call-showcase-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 48px;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    @media (min-width: 992px) {
      .call-showcase-grid {
        grid-template-columns: 1fr 1fr;
        gap: 64px;
      }
    }

    /* Coluna Esquerda: Celular sem fundo */
    .phone-visual-col {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .phone-glow-backdrop {
      position: absolute;
      inset: 10% 15%;
      background: radial-gradient(ellipse at center, rgba(168, 85, 247, 0.26) 0%, rgba(109, 0, 255, 0.08) 55%, transparent 75%);
      filter: blur(44px);
      z-index: 0;
      pointer-events: none;
    }

    .phone-picture {
      position: relative;
      z-index: 1;
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .phone-mockup-img {
      width: 100%;
      max-width: 440px;
      height: auto;
      object-fit: contain;
      filter: drop-shadow(0 28px 56px rgba(0, 0, 0, 0.85));
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .phone-visual-col:hover .phone-mockup-img {
      transform: translateY(-8px) scale(1.015);
    }

    /* Coluna Direita: Título, Subtítulo & Botão CTA */
    .call-content-col {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
    }

    .content-title {
      margin-bottom: 20px;
      text-align: left;
      font-size: clamp(32px, 3.8vw, 46px);
      line-height: 1.15;
    }

    .content-subtitle {
      margin-bottom: 36px;
      text-align: left;
      max-width: 520px;
      font-size: 17px;
      line-height: 1.65;
      color: var(--text-secondary);
    }

    .call-cta-actions {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    @media (max-width: 640px) {
      .call-demo-section {
        padding: 72px 0;
      }

      .call-cta-actions,
      .call-cta-actions .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class CallDemoComponent {
  @Output() openDemo = new EventEmitter<{ title: string; desc: string }>();

  onOpenCallDemo(): void {
    this.openDemo.emit({
      title: 'Demonstração do Agente de Voz — Vozly',
      desc: 'Solicite uma apresentação guiada para ver a recepcionista telefônica com IA conduzindo triagens e agendamentos para o seu negócio.'
    });
  }
}
