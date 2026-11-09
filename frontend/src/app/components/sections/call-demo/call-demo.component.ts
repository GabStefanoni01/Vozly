import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface DialogueStep {
  speaker: 'cliente' | 'vozly';
  text: string;
  time: string;
  reveals: string[]; // keys in summary revealed by this message
}

interface SummaryData {
  tipo: string;
  equipamento: string;
  marca: string;
  capacidade: string;
  problema: string;
  proximaEtapa: string;
}

@Component({
  selector: 'app-call-demo',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section call-demo-section" id="demonstracao">
      <div class="ambient-glow glow-purple call-glow"></div>

      <div class="container">
        <!-- Cabeçalho -->
        <div class="section-header">
          <h2 class="section-title">
            Veja uma conversa se transformar<br>
            <span class="gradient-text">em atendimento.</span>
          </h2>
          <p class="section-subtitle">
            Um exemplo de como a Vozly pode conduzir uma solicitação telefônica, compreender o contexto e estruturar as informações para sua equipe.
          </p>
        </div>

        <!-- Interface de Demonstração Dual-Column -->
        <div class="demo-card-container">
          <!-- Coluna 1: Simulador de Chamada Telefônica -->
          <div class="phone-column">
            <!-- Barra Superior do Telefone -->
            <div class="phone-header">
              <div class="caller-meta">
                <div class="avatar-ring">
                  <app-icon name="bot" [size]="18" color="#A855F7"></app-icon>
                </div>
                <div>
                  <div class="caller-name">Agente Vozly — Atendimento Telefônico</div>
                  <div class="caller-status">
                    <span class="pulse-green"></span>
                    Chamada ativa • Linha telefônica comercial
                  </div>
                </div>
              </div>

              <!-- Ondas Sonoras da Chamada -->
              <div class="sound-visualizer" aria-label="Áudio da chamada">
                <span class="s-bar" *ngFor="let b of [1,2,3,4,5,6,7,8]"></span>
              </div>
            </div>

            <!-- Diálogo Telefônico -->
            <div class="dialogue-scroll-box" #scrollBox>
              <div
                class="message-bubble"
                *ngFor="let msg of visibleMessages; let i = index"
                [ngClass]="msg.speaker"
              >
                <div class="msg-meta">
                  <span class="msg-sender">
                    {{ msg.speaker === 'vozly' ? 'Vozly (IA)' : 'Cliente' }}
                  </span>
                  <span class="msg-time">{{ msg.time }}</span>
                </div>
                <div class="msg-content">
                  {{ msg.text }}
                </div>
              </div>

              <!-- Indicador de Digitação / Processamento quando em autoplay -->
              <div class="typing-indicator" *ngIf="isProcessing">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-text">Vozly processando resposta por voz...</span>
              </div>
            </div>

            <!-- Controles Interativos da Demonstração -->
            <div class="demo-controls-bar">
              <div class="controls-left">
                <button
                  class="control-btn"
                  (click)="toggleAutoPlay()"
                  [class.active]="isAutoPlaying"
                  title="Reprodução automática"
                >
                  <app-icon [name]="isAutoPlaying ? 'pause' : 'play'" [size]="14"></app-icon>
                  <span>{{ isAutoPlaying ? 'Pausar' : 'Reproduzir' }}</span>
                </button>
                <button class="control-btn" (click)="resetDemo()" title="Reiniciar demonstração">
                  <app-icon name="refresh-cw" [size]="14"></app-icon>
                  <span>Reiniciar</span>
                </button>
              </div>

              <div class="controls-right">
                <button
                  class="btn btn-primary btn-sm"
                  (click)="nextStep()"
                  [disabled]="currentStepIndex >= dialogues.length"
                >
                  <span>{{ currentStepIndex >= dialogues.length ? 'Concluído' : 'Avançar conversa' }}</span>
                  <app-icon name="arrow-right" [size]="14"></app-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- Coluna 2: Resumo Estruturado do Atendimento -->
          <div class="summary-column">
            <div class="summary-header">
              <div class="summary-title-group">
                <div class="summary-icon">
                  <app-icon name="layers" [size]="18" color="#22C55E"></app-icon>
                </div>
                <div>
                  <h3 class="summary-title">Resumo do atendimento</h3>
                  <p class="summary-subtitle">Extração operacional em tempo real</p>
                </div>
              </div>
              <span class="summary-status-pill" [class.ready]="currentStepIndex >= 6">
                {{ currentStepIndex >= 6 ? 'Estruturado' : 'Em Coleta' }}
              </span>
            </div>

            <div class="summary-body">
              <!-- Item: Tipo -->
              <div class="summary-item" [class.highlight]="isFieldRevealed('tipo')">
                <div class="item-label">Tipo de atendimento</div>
                <div class="item-value">
                  <span *ngIf="isFieldRevealed('tipo')">{{ summary.tipo }}</span>
                  <span *ngIf="!isFieldRevealed('tipo')" class="placeholder">— Aguardando contexto...</span>
                </div>
              </div>

              <!-- Item: Equipamento -->
              <div class="summary-item" [class.highlight]="isFieldRevealed('equipamento')">
                <div class="item-label">Equipamento</div>
                <div class="item-value">
                  <span *ngIf="isFieldRevealed('equipamento')">{{ summary.equipamento }}</span>
                  <span *ngIf="!isFieldRevealed('equipamento')" class="placeholder">— Aguardando informação...</span>
                </div>
              </div>

              <!-- Item: Marca -->
              <div class="summary-item" [class.highlight]="isFieldRevealed('marca')">
                <div class="item-label">Marca informada</div>
                <div class="item-value">
                  <span *ngIf="isFieldRevealed('marca')">{{ summary.marca }}</span>
                  <span *ngIf="!isFieldRevealed('marca')" class="placeholder">— Aguardando informação...</span>
                </div>
              </div>

              <!-- Item: Capacidade -->
              <div class="summary-item" [class.highlight]="isFieldRevealed('capacidade')">
                <div class="item-label">Capacidade informada</div>
                <div class="item-value">
                  <span *ngIf="isFieldRevealed('capacidade')">{{ summary.capacidade }}</span>
                  <span *ngIf="!isFieldRevealed('capacidade')" class="placeholder">— Aguardando informação...</span>
                </div>
              </div>

              <!-- Item: Problema -->
              <div class="summary-item" [class.highlight]="isFieldRevealed('problema')">
                <div class="item-label">Problema relatado</div>
                <div class="item-value">
                  <span *ngIf="isFieldRevealed('problema')">{{ summary.problema }}</span>
                  <span *ngIf="!isFieldRevealed('problema')" class="placeholder">— Aguardando relato...</span>
                </div>
              </div>

              <!-- Item: Próxima Etapa -->
              <div class="summary-item highlight-final" [class.highlight]="isFieldRevealed('proximaEtapa')">
                <div class="item-label">Próxima etapa operacional</div>
                <div class="item-value next-step">
                  <app-icon name="check-circle" [size]="16" color="#22C55E" *ngIf="isFieldRevealed('proximaEtapa')"></app-icon>
                  <span *ngIf="isFieldRevealed('proximaEtapa')">{{ summary.proximaEtapa }}</span>
                  <span *ngIf="!isFieldRevealed('proximaEtapa')" class="placeholder">— Aguardando conclusão...</span>
                </div>
              </div>
            </div>

            <!-- Footer do Resumo -->
            <div class="summary-footer">
              <app-icon name="shield" [size]="14" color="#A855F7"></app-icon>
              <span>Demonstração ilustrativa da experiência pretendida pela Vozly.</span>
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
    }

    .call-glow {
      top: 30%;
      left: 50%;
      transform: translateX(-50%);
      width: 700px;
      height: 450px;
      opacity: 0.18;
    }

    /* Container Dual-Column */
    .demo-card-container {
      display: grid;
      grid-template-columns: 1fr;
      gap: 28px;
      background: rgba(15, 15, 20, 0.7);
      border: 1px solid var(--border-card);
      border-radius: var(--radius-xl);
      padding: 24px;
      backdrop-filter: blur(16px);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(109, 0, 255, 0.1);
      position: relative;
      z-index: 1;
    }

    @media (min-width: 992px) {
      .demo-card-container {
        grid-template-columns: 1.15fr 0.85fr;
        padding: 32px;
      }
    }

    /* Coluna 1: Telefone */
    .phone-column {
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
      min-height: 480px;
    }

    .phone-header {
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .caller-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar-ring {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(109, 0, 255, 0.15);
      border: 1px solid var(--purple-border);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .caller-name {
      font-size: 14px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .caller-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--text-muted);
    }

    .pulse-green {
      width: 6px;
      height: 6px;
      background: var(--status-green);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--status-green);
    }

    /* Visualizador de Ondas */
    .sound-visualizer {
      display: flex;
      align-items: center;
      gap: 3px;
      height: 20px;
    }

    .s-bar {
      width: 3px;
      background: var(--light-purple);
      border-radius: 2px;
      animation: waveBar 1.2s ease-in-out infinite;
    }

    .s-bar:nth-child(odd) { animation-delay: 0.2s; height: 14px; }
    .s-bar:nth-child(even) { animation-delay: 0.4s; height: 8px; }

    /* Caixa de Diálogo */
    .dialogue-scroll-box {
      flex: 1;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
      max-height: 360px;
    }

    .message-bubble {
      max-width: 82%;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      font-size: 14px;
      line-height: 1.5;
      animation: messageEnter 300ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .message-bubble.cliente {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: #E4E4E7;
      border-bottom-left-radius: 4px;
    }

    .message-bubble.vozly {
      align-self: flex-end;
      background: linear-gradient(135deg, rgba(109, 0, 255, 0.25) 0%, rgba(139, 61, 255, 0.15) 100%);
      border: 1px solid rgba(168, 85, 247, 0.35);
      color: #FFFFFF;
      border-bottom-right-radius: 4px;
    }

    .msg-meta {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 4px;
      font-size: 11px;
    }

    .msg-sender {
      font-weight: 600;
      color: var(--light-purple);
    }

    .cliente .msg-sender {
      color: var(--text-secondary);
    }

    .msg-time {
      color: var(--text-muted);
      font-family: var(--font-mono);
    }

    /* Typing indicator */
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: rgba(109, 0, 255, 0.08);
      border-radius: var(--radius-sm);
      align-self: flex-end;
    }

    .typing-dot {
      width: 5px;
      height: 5px;
      background: var(--light-purple);
      border-radius: 50%;
      animation: typingPulse 1s infinite;
    }

    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }

    .typing-text {
      font-size: 11px;
      color: var(--text-muted);
      margin-left: 6px;
    }

    /* Barra de Controles */
    .demo-controls-bar {
      padding: 14px 20px;
      background: rgba(11, 11, 15, 0.95);
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .controls-left {
      display: flex;
      gap: 8px;
    }

    .control-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      font-size: 12px;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }

    .control-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #FFFFFF;
    }

    .control-btn.active {
      background: rgba(109, 0, 255, 0.15);
      border-color: var(--light-purple);
      color: var(--light-purple);
    }

    /* Coluna 2: Resumo Estruturado */
    .summary-column {
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 24px;
    }

    .summary-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 20px;
    }

    .summary-title-group {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .summary-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(34, 197, 94, 0.12);
      border: 1px solid rgba(34, 197, 94, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .summary-title {
      font-size: 17px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .summary-subtitle {
      font-size: 12px;
      color: var(--text-muted);
    }

    .summary-status-pill {
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 4px;
      background: rgba(168, 85, 247, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.3);
      color: var(--light-purple);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .summary-status-pill.ready {
      background: rgba(34, 197, 94, 0.15);
      border-color: rgba(34, 197, 94, 0.3);
      color: var(--status-green);
    }

    .summary-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
      flex: 1;
    }

    .summary-item {
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      transition: all var(--transition-base);
    }

    .summary-item.highlight {
      background: rgba(109, 0, 255, 0.08);
      border-color: rgba(168, 85, 247, 0.4);
      transform: translateX(4px);
    }

    .summary-item.highlight-final.highlight {
      background: rgba(34, 197, 94, 0.08);
      border-color: rgba(34, 197, 94, 0.4);
    }

    .item-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2px;
    }

    .item-value {
      font-size: 14px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .item-value.next-step {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #22C55E;
    }

    .placeholder {
      color: var(--text-dim);
      font-weight: 400;
      font-style: italic;
    }

    .summary-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid var(--border-subtle);
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.4;
    }

    @keyframes messageEnter {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes typingPulse {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
  `]
})
export class CallDemoComponent implements OnInit, OnDestroy {
  dialogues: DialogueStep[] = [
    {
      speaker: 'cliente',
      text: 'Olá, preciso de ajuda com minha máquina de lavar.',
      time: '14:20:05',
      reveals: ['tipo', 'equipamento']
    },
    {
      speaker: 'vozly',
      text: 'Claro! Posso ajudar. Você sabe me informar qual é o modelo do equipamento?',
      time: '14:20:08',
      reveals: []
    },
    {
      speaker: 'cliente',
      text: 'É uma Brastemp de 12 quilos.',
      time: '14:20:13',
      reveals: ['marca', 'capacidade']
    },
    {
      speaker: 'vozly',
      text: 'Entendi. O que está acontecendo com ela?',
      time: '14:20:16',
      reveals: []
    },
    {
      speaker: 'cliente',
      text: 'Ela está fazendo um barulho muito forte durante a centrifugação.',
      time: '14:20:21',
      reveals: ['problema']
    },
    {
      speaker: 'vozly',
      text: 'Entendi. Vou organizar essas informações para que sua solicitação possa ser encaminhada à assistência técnica.',
      time: '14:20:26',
      reveals: ['proximaEtapa']
    }
  ];

  summary: SummaryData = {
    tipo: 'Assistência técnica',
    equipamento: 'Máquina de lavar',
    marca: 'Brastemp',
    capacidade: '12 kg',
    problema: 'Ruído durante a centrifugação',
    proximaEtapa: 'Encaminhamento para atendimento'
  };

  currentStepIndex = 3; // Starts with first 3 visible for instant impact
  isAutoPlaying = false;
  isProcessing = false;
  private autoPlayTimer: any;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  get visibleMessages(): DialogueStep[] {
    return this.dialogues.slice(0, this.currentStepIndex);
  }

  isFieldRevealed(fieldKey: string): boolean {
    const revealedKeys = new Set<string>();
    for (let i = 0; i < this.currentStepIndex; i++) {
      this.dialogues[i].reveals.forEach(k => revealedKeys.add(k));
    }
    return revealedKeys.has(fieldKey);
  }

  nextStep(): void {
    if (this.currentStepIndex < this.dialogues.length) {
      this.currentStepIndex++;
    } else {
      this.stopAutoPlay();
    }
  }

  resetDemo(): void {
    this.stopAutoPlay();
    this.currentStepIndex = 1;
  }

  toggleAutoPlay(): void {
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  startAutoPlay(): void {
    if (this.currentStepIndex >= this.dialogues.length) {
      this.currentStepIndex = 0;
    }
    this.isAutoPlaying = true;
    this.scheduleNextMessage();
  }

  private scheduleNextMessage(): void {
    if (!this.isAutoPlaying) return;

    if (this.currentStepIndex < this.dialogues.length) {
      this.isProcessing = true;
      this.autoPlayTimer = setTimeout(() => {
        this.isProcessing = false;
        this.currentStepIndex++;
        if (this.currentStepIndex < this.dialogues.length) {
          this.scheduleNextMessage();
        } else {
          this.stopAutoPlay();
        }
      }, 1800);
    } else {
      this.stopAutoPlay();
    }
  }

  private stopAutoPlay(): void {
    this.isAutoPlaying = false;
    this.isProcessing = false;
    if (this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
    }
  }
}
