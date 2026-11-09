import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="hero-section" id="hero">
      <!-- Iluminação Atmosférica de Fundo -->
      <div class="hero-ambient-top" aria-hidden="true"></div>

      <!-- Conteúdo Principal Centralizado: Título, Subtexto e Botões -->
      <div class="container hero-container">
        <div class="hero-header-clean">
          <h1 class="hero-title">
            Sua empresa atende.<br>
            A <span class="gradient-text">Vozly</span> continua trabalhando.
          </h1>

          <p class="hero-subtitle">
            Uma recepcionista inteligente que atende ligações, entende solicitações e organiza atendimentos. Mesmo quando sua equipe não está disponível.
          </p>

          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" (click)="onKnowMore()">
              Conhecer a Vozly
              <app-icon name="arrow-right" [size]="18"></app-icon>
            </button>
            <a href="#como-funciona" class="btn btn-secondary btn-lg">
              Entender como funciona
            </a>
          </div>
        </div>
      </div>

      <!-- Palco Full-Screen do Buraco Negro Roxo (Integrado ao Fundo e ao Horizonte da Página) -->
      <div class="blackhole-fullscreen-stage">
        <!-- Anéis Orbitais Celestes e Partículas Estelares (Inspirado na Referência) -->
        <svg
          class="celestial-overlay-svg"
          viewBox="0 0 1440 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <!-- Anel Orbital Externo Sutil -->
          <circle
            cx="720"
            cy="355"
            r="295"
            stroke="url(#orbitGradOuter)"
            stroke-width="1"
            stroke-dasharray="3 6"
            opacity="0.45"
          />
          <!-- Anel Orbital Interno -->
          <circle
            cx="720"
            cy="355"
            r="225"
            stroke="url(#orbitGradInner)"
            stroke-width="1"
            opacity="0.55"
          />

          <!-- Pequenos Nós Orbitais Brilhantes -->
          <circle cx="512" cy="200" r="2.5" fill="#E9D5FF" opacity="0.8" />
          <circle cx="928" cy="200" r="2" fill="#C084FC" opacity="0.7" />
          <circle cx="720" cy="60" r="2" fill="#A855F7" opacity="0.6" />
          <circle cx="445" cy="245" r="1.5" fill="#FFFFFF" opacity="0.5" />
          <circle cx="995" cy="250" r="1.5" fill="#FFFFFF" opacity="0.5" />

          <!-- Micro-estrelas de Profundidade -->
          <circle cx="310" cy="140" r="1" fill="#FFFFFF" opacity="0.35" />
          <circle cx="380" cy="95" r="1.2" fill="#D8B4FE" opacity="0.4" />
          <circle cx="610" cy="110" r="1" fill="#FFFFFF" opacity="0.45" />
          <circle cx="840" cy="95" r="1.3" fill="#E9D5FF" opacity="0.5" />
          <circle cx="1080" cy="150" r="1" fill="#FFFFFF" opacity="0.3" />
          <circle cx="1140" cy="105" r="1.2" fill="#C084FC" opacity="0.35" />
          <circle cx="555" cy="155" r="1" fill="#A855F7" opacity="0.5" />
          <circle cx="885" cy="150" r="1" fill="#A855F7" opacity="0.5" />

          <defs>
            <linearGradient id="orbitGradOuter" x1="720" y1="60" x2="720" y2="550" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#C084FC" stop-opacity="0.6" />
              <stop offset="55%" stop-color="#8B3DFF" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#050505" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="orbitGradInner" x1="720" y1="130" x2="720" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#E9D5FF" stop-opacity="0.65" />
              <stop offset="60%" stop-color="#6D00FF" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#050505" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <!-- Imagem Full-Screen do Buraco Negro Roxo com Fusão Perfeita no Fundo #050505 -->
        <picture class="blackhole-picture">
          <source srcset="brand/hero-blackhole.webp" type="image/webp">
          <img
            src="brand/hero-blackhole.jpg"
            alt="Horizonte de eventos cósmico da Vozly"
            class="blackhole-fullscreen-img"
            loading="eager"
          />
        </picture>

        <!-- Brilho Equatorial e Transição de Horizonte para a Seção Seguinte -->
        <div class="horizon-light-bleed" aria-hidden="true"></div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      padding-top: calc(var(--header-height) + 56px);
      padding-bottom: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: var(--bg-primary);
    }

    /* Luz Atmosférica Superior Discreta */
    .hero-ambient-top {
      position: absolute;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      width: 900px;
      height: 420px;
      background: radial-gradient(ellipse at center, rgba(109, 0, 255, 0.16) 0%, rgba(139, 61, 255, 0.05) 50%, transparent 75%);
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
    }

    .hero-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
      z-index: 3;
      width: 100%;
    }

    /* Cabeçalho Limpo: Título, Subtexto e Botões */
    .hero-header-clean {
      max-width: 820px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-title {
      font-size: 58px;
      font-weight: 800;
      line-height: 1.08;
      letter-spacing: -0.035em;
      color: #FFFFFF;
      margin-bottom: 22px;
      text-shadow: 0 4px 30px rgba(0, 0, 0, 0.6);
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 36px;
        line-height: 1.14;
      }
    }

    .hero-subtitle {
      font-size: 18px;
      line-height: 1.65;
      color: #A1A1AA;
      max-width: 640px;
      margin-bottom: 34px;
      font-weight: 400;
    }

    @media (max-width: 768px) {
      .hero-subtitle {
        font-size: 16px;
        margin-bottom: 28px;
      }
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    @media (max-width: 480px) {
      .hero-actions {
        width: 100%;
        flex-direction: column;
      }
      .hero-actions .btn {
        width: 100%;
      }
    }

    /* Palco Full-Screen do Buraco Negro Roxo */
    .blackhole-fullscreen-stage {
      position: relative;
      width: 100vw;
      max-width: 1800px;
      margin-top: -10px;
      margin-bottom: -110px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      pointer-events: none;
      user-select: none;
    }

    @media (max-width: 1024px) {
      .blackhole-fullscreen-stage {
        margin-top: 0;
        margin-bottom: -65px;
      }
    }

    @media (max-width: 640px) {
      .blackhole-fullscreen-stage {
        width: 135vw;
        margin-top: 8px;
        margin-bottom: -35px;
      }
    }

    /* Anéis Orbitais e Estrelas em SVG */
    .celestial-overlay-svg {
      position: absolute;
      top: -6%;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      max-width: 1440px;
      height: auto;
      z-index: 2;
      pointer-events: none;
    }

    .blackhole-picture {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .blackhole-fullscreen-img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
      /* Fusão invisível com o fundo #050505 em qualquer monitor */
      mask-image: radial-gradient(ellipse 85% 80% at 50% 48%, #000 55%, transparent 100%);
      -webkit-mask-image: radial-gradient(ellipse 85% 80% at 50% 48%, #000 55%, transparent 100%);
    }

    /* Reflexo de Luz Violeta que Ilumina o Topo da Seção Abaixo */
    .horizon-light-bleed {
      position: absolute;
      bottom: 85px;
      left: 50%;
      transform: translateX(-50%);
      width: 75%;
      max-width: 1100px;
      height: 120px;
      background: radial-gradient(ellipse at center, rgba(168, 85, 247, 0.28) 0%, rgba(109, 0, 255, 0.1) 50%, transparent 75%);
      filter: blur(40px);
      z-index: 2;
      pointer-events: none;
    }
  `]
})
export class HeroComponent {
  @Output() openDemo = new EventEmitter<{ title: string; desc: string }>();

  onKnowMore(): void {
    this.openDemo.emit({
      title: 'Conheça a Plataforma Vozly',
      desc: 'Estamos preparando a experiência da Vozly para aproximar a inteligência artificial das operações comerciais do seu negócio.'
    });
  }
}
