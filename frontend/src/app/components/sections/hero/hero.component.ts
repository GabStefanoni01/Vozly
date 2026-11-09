import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="hero-section" id="hero">
      <!-- Glow de Iluminação Cósmica de Fundo -->
      <div class="ambient-glow glow-purple hero-glow-bg" aria-hidden="true"></div>

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

        <!-- Banner do Buraco Negro Roxo (Totalmente Limpo, sem elementos ou logos na frente) -->
        <div class="blackhole-banner-wrapper">
          <picture>
            <source srcset="brand/hero-blackhole.webp" type="image/webp">
            <img
              src="brand/hero-blackhole.jpg"
              alt="Buraco negro cósmico roxo com disco de acreção brilhante"
              class="blackhole-banner-img"
              loading="eager"
            />
          </picture>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      padding-top: calc(var(--header-height) + 54px);
      padding-bottom: 60px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-primary);
    }

    /* Iluminação Cósmica de Fundo */
    .hero-glow-bg {
      top: 55%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 900px;
      height: 600px;
      opacity: 0.35;
      background: radial-gradient(circle, rgba(139, 61, 255, 0.4) 0%, rgba(109, 0, 255, 0.12) 50%, transparent 75%);
      pointer-events: none;
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

    /* Cabeçalho Limpo: Título, Subtexto e Ações */
    .hero-header-clean {
      max-width: 820px;
      margin: 0 auto 32px auto;
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

    /* Banner do Buraco Negro Roxo (Totalmente Limpo e sem Sobreposição) */
    .blackhole-banner-wrapper {
      position: relative;
      width: 100%;
      max-width: 980px;
      margin: 12px auto 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(109, 0, 255, 0.2);
    }

    .blackhole-banner-img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: contain;
      filter: contrast(1.1) brightness(1.05);
      border-radius: var(--radius-xl);
      transition: transform var(--transition-smooth);
    }

    .blackhole-banner-wrapper:hover .blackhole-banner-img {
      transform: scale(1.015);
    }

    @media (max-width: 768px) {
      .blackhole-banner-wrapper {
        border-radius: var(--radius-md);
      }
      .blackhole-banner-img {
        border-radius: var(--radius-md);
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
