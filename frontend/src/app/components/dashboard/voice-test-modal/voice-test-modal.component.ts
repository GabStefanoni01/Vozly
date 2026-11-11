import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../ui/icon/icon.component';
import { Agent, ConversationTurn } from '../../../models/dashboard.models';

@Component({
  selector: 'app-voice-test-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="closeModal()">
      <div class="modal-card dash-glass-card" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
        <!-- Cabeçalho do Modal -->
        <div class="modal-header">
          <div class="modal-title-col">
            <div class="agent-badge">
              <span class="live-dot"></span>
              <span>SIMULADOR DE VOZ CONTROLADO</span>
            </div>
            <h3 class="modal-title">Testar Conversação com {{ selectedAgent?.name }}</h3>
          </div>
          <button class="close-btn" (click)="closeModal()" aria-label="Fechar simulador">
            <app-icon name="x" [size]="20"></app-icon>
          </button>
        </div>

        <!-- Barra de Configuração e Status do Runtime de Teste -->
        <div class="runtime-bar">
          <div class="runtime-meta">
            <span class="meta-item">
              <app-icon name="mic" [size]="14" color="#A855F7"></app-icon>
              {{ selectedAgent?.voiceConfig?.voiceName || 'Voz Neural Padrão' }}
            </span>
            <span class="meta-item">
              <app-icon name="cpu" [size]="14" color="#4ADE80"></app-icon>
              Latência Estimada: 280ms
            </span>
          </div>

          <!-- Onda Sonora Animada quando o agente está respondendo -->
          <div class="audio-wave-wrap" *ngIf="isSpeaking()">
            <span class="wave-bar b1"></span>
            <span class="wave-bar b2"></span>
            <span class="wave-bar b3"></span>
            <span class="wave-bar b4"></span>
            <span class="wave-bar b5"></span>
            <span class="wave-status">Sintetizando Voz...</span>
          </div>
        </div>

        <!-- Histórico do Diálogo de Teste -->
        <div class="dialogue-container" #dialogueScroll>
          <div class="dialogue-list">
            <div
              class="chat-bubble-wrap"
              *ngFor="let turn of turns"
              [class.user]="turn.role === 'user'"
              [class.assistant]="turn.role === 'assistant'"
            >
              <div class="bubble-avatar">
                <app-icon [name]="turn.role === 'user' ? 'user' : 'bot'" [size]="14"></app-icon>
              </div>
              <div class="bubble-content">
                <div class="bubble-header">
                  <span class="bubble-sender">{{ turn.role === 'user' ? 'Você (Interlocutor)' : selectedAgent?.name }}</span>
                  <span class="bubble-time">{{ turn.timestamp }}</span>
                </div>
                <p class="bubble-text">{{ turn.content }}</p>

                <!-- Pílula de Ferramenta Executada -->
                <div class="tool-pill" *ngIf="turn.toolCall">
                  <div class="tool-icon">
                    <app-icon name="zap" [size]="12"></app-icon>
                  </div>
                  <div class="tool-info">
                    <span class="tool-name">Executou {{ turn.toolCall.toolKey }} ({{ turn.toolCall.executionTimeMs }}ms)</span>
                    <span class="tool-output">{{ turn.toolCall.outputSummary }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Indicador de Digitação / Processamento -->
            <div class="typing-indicator" *ngIf="isProcessing()">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-text">Agente processando intenção e base de conhecimento...</span>
            </div>
          </div>
        </div>

        <!-- Sugestões Rápidas de Perguntas para Testar -->
        <div class="quick-prompts">
          <span class="qp-label">Perguntas Rápidas de Teste:</span>
          <div class="qp-buttons">
            <button
              class="qp-btn"
              *ngFor="let q of quickQuestions"
              (click)="sendQuickQuestion(q)"
              [disabled]="isProcessing() || isSpeaking()"
            >
              {{ q }}
            </button>
          </div>
        </div>

        <!-- Barra de Entrada de Fala / Texto -->
        <div class="input-bar">
          <input
            type="text"
            [(ngModel)]="userMessage"
            (keydown.enter)="sendMessage()"
            placeholder="Digite ou fale para interagir com o agente..."
            class="dialogue-input"
            [disabled]="isProcessing() || isSpeaking()"
          />
          <button
            class="btn btn-primary send-btn"
            (click)="sendMessage()"
            [disabled]="!userMessage.trim() || isProcessing() || isSpeaking()"
            aria-label="Enviar mensagem para o agente"
          >
            <app-icon name="arrow-right" [size]="16"></app-icon>
          </button>
        </div>

        <!-- Rodapé Informativo de Segurança -->
        <div class="modal-footer-note">
          <app-icon name="shield-check" [size]="14" color="#4ADE80"></app-icon>
          <span>Ambiente de simulação isolado: chamadas para integrações reais operam em modo somente-leitura demonstrativo.</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
      animation: fadeIn 0.2s ease-out;
    }

    .modal-card {
      width: 100%;
      max-width: 680px;
      height: 85vh;
      max-height: 740px;
      display: flex;
      flex-direction: column;
      padding: 24px;
      background: rgba(18, 16, 26, 0.95);
      border: 1px solid rgba(168, 85, 247, 0.35);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(109, 0, 255, 0.25);
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .modal-title-col {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .agent-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      color: #C084FC;
      letter-spacing: 0.05em;
    }

    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4ADE80;
      box-shadow: 0 0 8px #4ADE80;
    }

    .modal-title {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .close-btn {
      color: var(--text-muted);
      padding: 6px;
      border-radius: 8px;
      transition: all var(--transition-fast);
      cursor: pointer;
    }

    .close-btn:hover {
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.08);
    }

    .runtime-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      margin: 12px 0;
      font-size: 12px;
    }

    .runtime-meta {
      display: flex;
      align-items: center;
      gap: 14px;
      color: var(--text-secondary);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .audio-wave-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .wave-bar {
      width: 3px;
      background: #A855F7;
      border-radius: 2px;
      animation: waveBar 0.8s ease-in-out infinite;
    }

    .wave-bar.b1 { animation-delay: 0.1s; }
    .wave-bar.b2 { animation-delay: 0.2s; }
    .wave-bar.b3 { animation-delay: 0.3s; }
    .wave-bar.b4 { animation-delay: 0.4s; }
    .wave-bar.b5 { animation-delay: 0.5s; }

    .wave-status {
      font-size: 11px;
      color: #C084FC;
      margin-left: 6px;
      font-weight: 600;
    }

    .dialogue-container {
      flex: 1;
      overflow-y: auto;
      padding: 12px 4px;
      margin-bottom: 12px;
    }

    .dialogue-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .chat-bubble-wrap {
      display: flex;
      gap: 10px;
      max-width: 85%;
    }

    .chat-bubble-wrap.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .chat-bubble-wrap.assistant {
      align-self: flex-start;
    }

    .bubble-avatar {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 4px;
    }

    .chat-bubble-wrap.user .bubble-avatar {
      background: rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
    }

    .chat-bubble-wrap.assistant .bubble-avatar {
      background: rgba(109, 0, 255, 0.3);
      color: #C084FC;
      border: 1px solid rgba(168, 85, 247, 0.4);
    }

    .bubble-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .bubble-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
    }

    .bubble-sender {
      font-weight: 600;
      color: var(--text-secondary);
    }

    .bubble-time {
      color: var(--text-muted);
    }

    .bubble-text {
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.5;
    }

    .chat-bubble-wrap.user .bubble-text {
      background: linear-gradient(135deg, #6D00FF 0%, #8B3DFF 100%);
      color: #FFFFFF;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 14px rgba(109, 0, 255, 0.3);
    }

    .chat-bubble-wrap.assistant .bubble-text {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #FFFFFF;
      border-bottom-left-radius: 4px;
    }

    .tool-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 10px;
      background: rgba(109, 0, 255, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.3);
      margin-top: 4px;
    }

    .tool-icon {
      width: 20px;
      height: 20px;
      border-radius: 6px;
      background: rgba(109, 0, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #C084FC;
    }

    .tool-info {
      display: flex;
      flex-direction: column;
    }

    .tool-name {
      font-size: 11px;
      font-weight: 600;
      color: #E9D5FF;
    }

    .tool-output {
      font-size: 10.5px;
      color: var(--text-muted);
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;
      width: fit-content;
    }

    .typing-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #A855F7;
      animation: pulseGlow 1.2s infinite;
    }

    .typing-text {
      font-size: 11.5px;
      color: var(--text-muted);
      margin-left: 6px;
    }

    .quick-prompts {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 10px;
    }

    .qp-label {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 600;
    }

    .qp-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .qp-btn {
      padding: 5px 10px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-secondary);
      font-size: 11.5px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .qp-btn:hover:not(:disabled) {
      background: rgba(109, 0, 255, 0.2);
      border-color: rgba(168, 85, 247, 0.4);
      color: #FFFFFF;
    }

    .input-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }

    .dialogue-input {
      flex: 1;
      background: rgba(11, 11, 15, 0.9);
      border: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: 12px;
      padding: 12px 16px;
      color: #FFFFFF;
      font-size: 14px;
      outline: none;
    }

    .dialogue-input:focus {
      border-color: var(--light-purple);
      box-shadow: 0 0 16px rgba(109, 0, 255, 0.3);
    }

    .send-btn {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      padding: 0;
    }

    .modal-footer-note {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--text-muted);
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class VoiceTestModalComponent {
  @Input() isOpen: boolean = false;
  @Input() selectedAgent: Agent | null = null;
  @Output() closeEvent = new EventEmitter<void>();

  userMessage: string = '';
  isProcessing = signal<boolean>(false);
  isSpeaking = signal<boolean>(false);

  readonly quickQuestions = [
    'Como emitir a segunda via do meu boleto?',
    'Qual o horário de atendimento comercial?',
    'Quero falar com um atendente humano agora'
  ];

  turns: ConversationTurn[] = [];

  ngOnChanges(): void {
    if (this.isOpen && this.selectedAgent) {
      this.initDialogue();
    }
  }

  initDialogue(): void {
    const greeting =
      this.selectedAgent?.behavior?.openingMessage ||
      'Olá! Sou assistente virtual da Vozly. Como posso ajudar você hoje?';

    this.turns = [
      {
        sequence: 1,
        role: 'assistant',
        content: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  }

  async sendMessage(): Promise<void> {
    const text = this.userMessage.trim();
    if (!text) return;

    this.turns.push({
      sequence: this.turns.length + 1,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.userMessage = '';
    this.isProcessing.set(true);

    // Simulação de latência de IA (STT + Orquestrador + Tool)
    await new Promise(r => setTimeout(r, 650));
    this.isProcessing.set(false);
    this.isSpeaking.set(true);

    let reply = '';
    let toolCall = undefined;

    const lower = text.toLowerCase();
    if (lower.includes('boleto') || lower.includes('fatura') || lower.includes('segunda via')) {
      reply =
        'Localizei as regras em nossa base de conhecimento: você pode emitir a 2ª via pelo CNPJ/CPF ou receber a chave PIX Copia e Cola via SMS. Deseja que eu envie agora?';
      toolCall = {
        toolKey: 'knowledge.search',
        inputSummary: 'segunda via fatura boleto pix',
        outputSummary: 'Item kn-02 localizado com 96% de relevância',
        executionTimeMs: 140
      };
    } else if (lower.includes('humano') || lower.includes('atendente') || lower.includes('transferir')) {
      reply =
        'Com certeza! Conforme configurado nas regras de contingência, estou transferindo você para a nossa fila de atendimento humano.';
      toolCall = {
        toolKey: 'call.transfer',
        inputSummary: '{ reason: "Solicitação explícita do cliente" }',
        outputSummary: 'Transferência aprovada para o ramal +5511987654321',
        executionTimeMs: 190
      };
    } else if (lower.includes('horário') || lower.includes('comercial') || lower.includes('plantão')) {
      reply =
        'Nosso horário comercial é de segunda a sexta, das 8h às 18h. Para emergências técnicas, nosso plantão telefônico opera 24 horas pelo ramal 990.';
      toolCall = {
        toolKey: 'knowledge.search',
        inputSummary: 'horário comercial atendimento plantão',
        outputSummary: 'Item kn-01 localizado com 99% de relevância',
        executionTimeMs: 110
      };
    } else {
      reply =
        'Entendido. Consultei a base de conhecimento do workspace e organizei as informações para o seu atendimento telefônico. Há mais alguma dúvida em que eu possa auxiliar?';
    }

    this.turns.push({
      sequence: this.turns.length + 1,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolCall
    });

    // Simula áudio de voz neural sendo tocado por 1.8 segundos
    setTimeout(() => {
      this.isSpeaking.set(false);
    }, 1800);
  }

  sendQuickQuestion(q: string): void {
    this.userMessage = q;
    this.sendMessage();
  }

  closeModal(): void {
    this.isSpeaking.set(false);
    this.isProcessing.set(false);
    this.closeEvent.emit();
  }
}
