import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="hero-section" id="hero">
      <!-- Glows de Iluminação Cósmica de Fundo -->
      <div class="ambient-glow glow-purple hero-glow-center"></div>
      <div class="ambient-glow glow-violet hero-glow-top"></div>

      <div class="container hero-container">
        <!-- Cabeçalho Limpo e Intuitivo: Título, Subtexto e Botões -->
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

        <!-- Palco do Buraco Negro Cósmico com Branding Brilhante e Minimalista -->
        <div class="blackhole-stage">
          <!-- Linhas de Órbita e Geometria Celestial -->
          <div class="celestial-orbit-outer" aria-hidden="true"></div>
          <div class="celestial-orbit-inner" aria-hidden="true"></div>

          <!-- Imagem / Arte do Buraco Negro Roxo (Event Horizon e Disco de Acreção) -->
          <div class="blackhole-portal-wrapper">
            <img
              src="brand/blackhole-portal.png"
              alt="Horizonte de eventos e buraco negro roxo da Vozly"
              class="blackhole-portal-img"
            />

            <!-- Feixe de Luz Horizontal Hiperbrilhante -->
            <div class="horizontal-beam" aria-hidden="true"></div>
          </div>

          <!-- Símbolo Oficial da Vozly Flutuando no Foco Lúmico do Buraco Negro -->
          <div class="brand-focus animate-float">
            <div class="brand-backlight" aria-hidden="true"></div>
            <img
              src="brand/vozly-symbol-orbit-tight.png"
              alt="Símbolo oficial Vozly"
              class="brand-symbol-clean"
            />
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      padding-top: calc(var(--header-height) + 64px);
      padding-bottom: 70px;
      overflow: hidden;
      min-height: 92vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-primary);
    }

    /* Iluminação Cósmica Ambiente */
    .hero-glow-center {
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 800px;
      height: 600px;
      opacity: 0.35;
      background: radial-gradient(circle, rgba(139, 61, 255, 0.45) 0%, rgba(109, 0, 255, 0.15) 50%, transparent 75%);
    }

    .hero-glow-top {
      top: 15%;
      left: 50%;
      transform: translateX(-50%);
      width: 500px;
      height: 300px;
      opacity: 0.2;
    }

    .hero-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
      z-index: 1;
      width: 100%;
    }

    /* Cabeçalho Limpo e Minimalista */
    .hero-header-clean {
      max-width: 820px;
      margin: 0 auto 36px auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-title {
      font-size: 58px;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.035em;
      color: #FFFFFF;
      margin-bottom: 22px;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 34px;
        line-height: 1.15;
      }
    }

    .hero-subtitle {
      font-size: 19px;
      line-height: 1.6;
      color: #A1A1AA;
      max-width: 660px;
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

    /* Palco do Buraco Negro Cósmico */
    .blackhole-stage {
      position: relative;
      width: 100%;
      max-width: 960px;
      height: 380px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
    }

    @media (max-width: 768px) {
      .blackhole-stage {
        height: 260px;
        margin-top: 0;
      }
    }

    /* Linhas de Órbita Celeste Sutis */
    .celestial-orbit-outer {
      position: absolute;
      width: 620px;
      height: 620px;
      border: 1px dashed rgba(168, 85, 247, 0.15);
      border-radius: 50%;
      pointer-events: none;
      animation: rotateOrbit 90s linear infinite;
    }

    .celestial-orbit-inner {
      position: absolute;
      width: 460px;
      height: 460px;
      border: 1px solid rgba(139, 61, 255, 0.1);
      border-radius: 50%;
      pointer-events: none;
    }

    @media (max-width: 768px) {
      .celestial-orbit-outer {
        width: 320px;
        height: 320px;
      }
      .celestial-orbit-inner {
        width: 240px;
        height: 240px;
      }
    }

    /* Imagem do Buraco Negro Roxo */
    .blackhole-portal-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .blackhole-portal-img {
      width: 100%;
      max-width: 860px;
      height: auto;
      object-fit: contain;
      filter: contrast(1.15) brightness(1.1);
      opacity: 0.95;
      mask-image: radial-gradient(ellipse at center, black 65%, transparent 95%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 65%, transparent 95%);
    }

    /* Feixe de Luz Horizontal */
    .horizontal-beam {
      position: absolute;
      top: 50%;
      left: 10%;
      right: 10%;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(109, 0, 255, 0.3) 25%, 
        rgba(255, 255, 255, 0.9) 50%, 
        rgba(168, 85, 247, 0.4) 75%, 
        transparent 100%
      );
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(109, 0, 255, 0.6);
      transform: translateY(-50%);
      pointer-events: none;
      opacity: 0.85;
    }

    /* Branding Brilhante e Minimalista no Centro */
    .brand-focus {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-backlight {
      position: absolute;
      width: 180px;
      height: 180px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.65) 0%, rgba(109, 0, 255, 0.3) 45%, transparent 70%);
      border-radius: 50%;
      filter: blur(30px);
      z-index: -1;
      animation: pulseGlow 4s ease-in-out infinite;
    }

    .brand-symbol-clean {
      width: 170px;
      height: 170px;
      object-fit: contain;
      filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.6)) drop-shadow(0 15px 35px rgba(0, 0, 0, 0.9));
      transition: transform var(--transition-base);
    }

    @media (max-width: 768px) {
      .brand-symbol-clean {
        width: 120px;
        height: 120px;
      }
      .brand-backlight {
        width: 130px;
        height: 130px;
      }
    }

    .brand-focus:hover .brand-symbol-clean {
      transform: scale(1.04);
    }

    @keyframes rotateOrbit {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes pulseGlow {
      0%, 100% {
        opacity: 0.6;
        transform: scale(1);
      }
      50% {
        opacity: 0.95;
        transform: scale(1.1);
      }
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
