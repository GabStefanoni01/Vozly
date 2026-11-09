import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="hero-section" id="hero">
      <!-- Glows de Iluminação Ambiente -->
      <div class="ambient-glow glow-purple hero-glow-1"></div>
      <div class="ambient-glow glow-violet hero-glow-2"></div>

      <div class="container hero-container">
        <!-- Coluna Esquerda: Conteúdo & Proposta -->
        <div class="hero-content">
          <!-- Tag Superior -->
          <div class="hero-badge">
            <span class="badge-dot"></span>
            <span>Atendimento por voz com inteligência artificial</span>
          </div>

          <!-- Título Principal -->
          <h1 class="hero-title">
            Sua empresa atende.<br>
            A <span class="gradient-text">Vozly</span> continua trabalhando.
          </h1>

          <!-- Subtítulo -->
          <p class="hero-subtitle">
            Uma recepcionista inteligente que atende ligações, entende solicitações e organiza atendimentos. Mesmo quando sua equipe não está disponível.
          </p>

          <!-- Texto Complementar -->
          <p class="hero-complement">
            Transforme chamadas telefônicas em oportunidades de atendimento, agendamentos e operações organizadas.
          </p>

          <!-- Botões de Ação -->
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" (click)="onKnowMore()">
              Conhecer a Vozly
              <app-icon name="arrow-right" [size]="18"></app-icon>
            </button>
            <a href="#como-funciona" class="btn btn-secondary btn-lg">
              Entender como funciona
            </a>
          </div>

          <!-- Mini Rodapé do Hero -->
          <div class="hero-info-footer">
            <div class="info-pill">
              <app-icon name="soundwave" [size]="16" color="#A855F7"></app-icon>
              <span>Voz natural em português brasileiro</span>
            </div>
            <div class="info-separator">•</div>
            <div class="info-pill">
              <app-icon name="activity" [size]="16" color="#22C55E"></app-icon>
              <span>Disponibilidade 24 horas</span>
            </div>
          </div>
        </div>

        <!-- Coluna Direita: Composição Visual Tecnológica de Alto Impacto -->
        <div class="hero-visual">
          <div class="visual-stage">
            <!-- Halo e Anéis de Órbita Abstratos -->
            <div class="orbit-ring-outer"></div>
            <div class="orbit-ring-inner"></div>

            <!-- Símbolo Oficial V com Anel Orbital -->
            <div class="symbol-container animate-float">
              <div class="symbol-glow"></div>
              <img
                src="brand/vozly-symbol-orbit-tight.png"
                alt="Símbolo oficial Vozly em 3D"
                class="brand-symbol-hero"
              />
            </div>

            <!-- Card Flutuante Superior: Chamada Ativa -->
            <div class="float-card active-call-card">
              <div class="card-status-row">
                <span class="live-indicator">
                  <span class="ping"></span>
                  <span class="dot"></span>
                </span>
                <span class="call-status-label">Chamada em andamento</span>
                <span class="call-timer">01:24</span>
              </div>
              
              <!-- Ondas Sonoras Animadas -->
              <div class="waveform-container" aria-label="Ondas sonoras ativas">
                <span class="wave-bar bar-1"></span>
                <span class="wave-bar bar-2"></span>
                <span class="wave-bar bar-3"></span>
                <span class="wave-bar bar-4"></span>
                <span class="wave-bar bar-5"></span>
                <span class="wave-bar bar-6"></span>
                <span class="wave-bar bar-7"></span>
                <span class="wave-bar bar-8"></span>
                <span class="wave-bar bar-9"></span>
                <span class="wave-bar bar-10"></span>
                <span class="wave-bar bar-11"></span>
                <span class="wave-bar bar-12"></span>
              </div>
            </div>

            <!-- Card Flutuante Inferior: Transcrição e Ação Operacional -->
            <div class="float-card operation-preview-card">
              <div class="operation-header">
                <div class="operation-avatar">
                  <app-icon name="bot" [size]="16" color="#A855F7"></app-icon>
                </div>
                <div>
                  <div class="operation-title">Recepção Inteligente Vozly</div>
                  <div class="operation-meta">Processamento de intenção em tempo real</div>
                </div>
                <span class="operation-badge">Ativo</span>
              </div>

              <div class="operation-transcript">
                <span class="speaker-tag">IA:</span>
                "Entendido. Máquina de lavar Brastemp com ruído na centrifugação. Vou organizar a solicitação de agendamento."
              </div>

              <div class="operation-tags">
                <span class="op-tag">
                  <app-icon name="check" [size]="12" color="#22C55E"></app-icon>
                  Equipamento identificado
                </span>
                <span class="op-tag">
                  <app-icon name="check" [size]="12" color="#22C55E"></app-icon>
                  Falha categorizada
                </span>
                <span class="op-tag highlight">
                  <app-icon name="calendar" [size]="12" color="#A855F7"></app-icon>
                  Preparando agendamento
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      position: relative;
      padding-top: calc(var(--header-height) + 60px);
      padding-bottom: 90px;
      overflow: hidden;
      min-height: 90vh;
      display: flex;
      align-items: center;
    }

    /* Glows Ambientais */
    .hero-glow-1 {
      top: -10%;
      right: 15%;
      width: 550px;
      height: 550px;
    }

    .hero-glow-2 {
      top: 30%;
      left: -10%;
      width: 450px;
      height: 450px;
    }

    .hero-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 60px;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    @media (min-width: 992px) {
      .hero-container {
        grid-template-columns: 1.15fr 0.85fr;
        gap: 40px;
      }
    }

    /* Coluna Esquerda */
    .hero-content {
      max-width: 640px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 6px 16px;
      background: rgba(109, 0, 255, 0.12);
      border: 1px solid var(--purple-border);
      border-radius: var(--radius-pill);
      font-size: 13px;
      font-weight: 500;
      color: #D8B4FE;
      margin-bottom: 24px;
      backdrop-filter: blur(8px);
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      background: var(--light-purple);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--light-purple);
    }

    .hero-title {
      font-size: 54px;
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.035em;
      margin-bottom: 24px;
      color: #FFFFFF;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 34px;
      }
    }

    .hero-subtitle {
      font-size: 18px;
      line-height: 1.6;
      color: #E4E4E7;
      margin-bottom: 16px;
      font-weight: 400;
    }

    @media (max-width: 768px) {
      .hero-subtitle {
        font-size: 16px;
      }
    }

    .hero-complement {
      font-size: 15px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 36px;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }

    .hero-info-footer {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: var(--text-muted);
      flex-wrap: wrap;
    }

    .info-pill {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .info-separator {
      color: var(--border-subtle);
    }

    /* Coluna Direita: Stage Visual */
    .hero-visual {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 480px;
    }

    .visual-stage {
      position: relative;
      width: 100%;
      max-width: 480px;
      height: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Anéis de Órbita Abstratos */
    .orbit-ring-outer {
      position: absolute;
      width: 380px;
      height: 380px;
      border: 1px dashed rgba(168, 85, 247, 0.2);
      border-radius: 50%;
      animation: rotateOrbit 60s linear infinite;
    }

    .orbit-ring-inner {
      position: absolute;
      width: 280px;
      height: 280px;
      border: 1px solid rgba(109, 0, 255, 0.15);
      border-radius: 50%;
    }

    /* Símbolo Central Oficial */
    .symbol-container {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .symbol-glow {
      position: absolute;
      width: 220px;
      height: 220px;
      background: radial-gradient(circle, rgba(109, 0, 255, 0.6) 0%, rgba(139, 61, 255, 0.2) 50%, transparent 70%);
      filter: blur(40px);
      border-radius: 50%;
      z-index: -1;
    }

    .brand-symbol-hero {
      width: 210px;
      height: 210px;
      object-fit: contain;
      filter: drop-shadow(0 15px 30px rgba(109, 0, 255, 0.45));
    }

    /* Cards Flutuantes */
    .float-card {
      position: absolute;
      background: rgba(21, 21, 27, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(139, 61, 255, 0.3);
      border-radius: var(--radius-md);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(109, 0, 255, 0.15);
      z-index: 3;
      transition: all var(--transition-base);
    }

    .float-card:hover {
      border-color: var(--light-purple);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(109, 0, 255, 0.25);
    }

    /* Card Chamada Ativa (Topo Direito) */
    .active-call-card {
      top: 15px;
      right: 0;
      padding: 14px 18px;
      min-width: 240px;
      animation: floatSlow 6s ease-in-out infinite alternate;
    }

    .card-status-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 13px;
    }

    .live-indicator {
      position: relative;
      width: 8px;
      height: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .live-indicator .dot {
      width: 8px;
      height: 8px;
      background: var(--status-green);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--status-green);
    }

    .live-indicator .ping {
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.4);
      animation: pulse 1.5s infinite;
    }

    .call-status-label {
      font-weight: 500;
      color: #FFFFFF;
      flex: 1;
    }

    .call-timer {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.05);
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* Ondas Sonoras */
    .waveform-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3px;
      height: 24px;
      padding: 0 4px;
    }

    .wave-bar {
      width: 3px;
      background: var(--gradient-primary);
      border-radius: 3px;
      animation: waveBar 1.2s ease-in-out infinite;
    }

    .bar-1 { height: 8px; animation-delay: 0.1s; }
    .bar-2 { height: 16px; animation-delay: 0.25s; }
    .bar-3 { height: 22px; animation-delay: 0.4s; }
    .bar-4 { height: 12px; animation-delay: 0.15s; }
    .bar-5 { height: 20px; animation-delay: 0.3s; }
    .bar-6 { height: 24px; animation-delay: 0.45s; }
    .bar-7 { height: 14px; animation-delay: 0.2s; }
    .bar-8 { height: 22px; animation-delay: 0.35s; }
    .bar-9 { height: 18px; animation-delay: 0.5s; }
    .bar-10 { height: 10px; animation-delay: 0.1s; }
    .bar-11 { height: 16px; animation-delay: 0.28s; }
    .bar-12 { height: 8px; animation-delay: 0.4s; }

    /* Card Inferior de Operação */
    .operation-preview-card {
      bottom: 20px;
      left: -10px;
      padding: 16px;
      max-width: 360px;
      width: 100%;
      animation: floatSlow 7s ease-in-out infinite alternate-reverse;
    }

    @media (max-width: 480px) {
      .operation-preview-card {
        left: 0;
        max-width: 100%;
      }
      .active-call-card {
        right: 0;
      }
    }

    .operation-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .operation-avatar {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: rgba(109, 0, 255, 0.2);
      border: 1px solid rgba(168, 85, 247, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .operation-title {
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .operation-meta {
      font-size: 11px;
      color: var(--text-muted);
    }

    .operation-badge {
      margin-left: auto;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      padding: 2px 6px;
      background: rgba(34, 197, 94, 0.15);
      color: var(--status-green);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 4px;
    }

    .operation-transcript {
      font-size: 12px;
      line-height: 1.45;
      color: #D4D4D8;
      background: rgba(5, 5, 5, 0.6);
      padding: 8px 10px;
      border-radius: 6px;
      border-left: 2px solid var(--light-purple);
      margin-bottom: 10px;
    }

    .speaker-tag {
      color: var(--light-purple);
      font-weight: 600;
      margin-right: 4px;
    }

    .operation-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .op-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      padding: 3px 8px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      border-radius: 4px;
      color: var(--text-secondary);
    }

    .op-tag.highlight {
      background: rgba(109, 0, 255, 0.12);
      border-color: rgba(168, 85, 247, 0.3);
      color: #E9D5FF;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.4); opacity: 0; }
      100% { transform: scale(0.95); opacity: 0; }
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
