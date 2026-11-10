import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { Agent, KnowledgeItem, ReadinessCheckResult } from '../../../models/dashboard.models';

interface WizardStep {
  index: number;
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

@Component({
  selector: 'app-agent-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="wizard-page">
      <!-- Topo: Voltar e Identificação do Agente -->
      <div class="wizard-header">
        <a routerLink="/dashboard/agents" class="back-link">
          <app-icon name="arrow-right" [size]="16" class="rotate-180"></app-icon>
          <span>Voltar para Lista de Agentes</span>
        </a>

        <div class="wizard-title-row">
          <div>
            <div class="badge-self-service">
              <span class="live-dot"></span>
              <span>JORNADA SELF-SERVICE GUIADA (DOCS/06 & ADR-002)</span>
            </div>
            <h1 class="wizard-title">
              {{ isEditing() ? 'Configurar ' + agentForm.name : 'Criar Novo Agente de Voz' }}
            </h1>
          </div>

          <div class="header-action-group">
            <button class="btn btn-secondary btn-sm" (click)="saveDraft()" [disabled]="isSaving()">
              <app-icon name="check" [size]="16"></app-icon>
              <span>{{ isSaving() ? 'Salvando...' : 'Salvar Rascunho' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Alerta Informativo de Feedback de Salvamento -->
      <div class="alert-toast dash-glass-card" *ngIf="feedbackMessage()">
        <app-icon name="check-circle" [size]="16" color="#4ADE80"></app-icon>
        <span>{{ feedbackMessage() }}</span>
      </div>

      <!-- Estrutura do Wizard (Stepper Lateral + Área de Conteúdo da Etapa) -->
      <div class="wizard-layout-grid">
        <!-- BARRA LATERAL DE ETAPAS (STEPPER) -->
        <aside class="stepper-sidebar dash-glass-card" aria-label="Progresso da configuração">
          <h3 class="stepper-heading">Etapas de Configuração</h3>

          <ol class="step-list">
            <li
              class="step-item"
              *ngFor="let step of steps"
              [class.active]="currentStep() === step.index"
              [class.completed]="currentStep() > step.index"
              (click)="goToStep(step.index)"
            >
              <div class="step-indicator">
                <span *ngIf="currentStep() <= step.index">{{ step.index }}</span>
                <app-icon name="check" [size]="14" *ngIf="currentStep() > step.index"></app-icon>
              </div>

              <div class="step-text">
                <span class="step-title">{{ step.title }}</span>
                <span class="step-sub">{{ step.subtitle }}</span>
              </div>
            </li>
          </ol>

          <!-- Card de Prontidão no Rodapé do Stepper -->
          <div class="stepper-readiness-card">
            <div class="readiness-top">
              <span class="rc-label">Prontidão para Publicar</span>
              <span class="rc-badge" [class.ready]="readiness().isReady">
                {{ readiness().isReady ? 'Pronto' : 'Pendente' }}
              </span>
            </div>
            <div class="readiness-progress-bar">
              <div
                class="progress-fill"
                [style.width.%]="readinessScore"
              ></div>
            </div>
            <span class="readiness-hint">
              {{ passedMandatoryChecks }} de {{ totalMandatoryChecks }} requisitos obrigatórios cumpridos
            </span>
          </div>
        </aside>

        <!-- ÁREA PRINCIPAL DA ETAPA ATUAL -->
        <main class="wizard-stage-card dash-glass-card">
          <!-- ETAPA 1: IDENTIFICAÇÃO DO AGENTE -->
          <section *ngIf="currentStep() === 1" class="step-pane">
            <div class="pane-header">
              <h2>1. Identidade & Objetivo do Agente</h2>
              <p>Defina o nome, a finalidade comercial e as diretrizes básicas de identificação.</p>
            </div>

            <div class="form-grid">
              <div class="form-group full-width">
                <label class="dash-label">Nome do Agente *</label>
                <input
                  type="text"
                  [(ngModel)]="agentForm.name"
                  placeholder="Ex: Helena — Atendimento Principal & SAC"
                  class="dash-input"
                  required
                />
                <span class="input-hint">Nome visual exibido no painel e na identificação das chamadas.</span>
              </div>

              <div class="form-group full-width">
                <label class="dash-label">Descrição / Finalidade *</label>
                <textarea
                  [(ngModel)]="agentForm.description"
                  rows="3"
                  placeholder="Descreva o propósito operacional deste agente no seu negócio..."
                  class="dash-input"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="dash-label">Idioma Principal</label>
                <select [(ngModel)]="agentForm.language" class="dash-input">
                  <option value="pt-BR">Português do Brasil (pt-BR)</option>
                </select>
                <span class="input-hint">No MVP, o idioma padrão homologado é o português brasileiro.</span>
              </div>

              <div class="form-group">
                <label class="dash-label">Fuso Horário Operacional</label>
                <select class="dash-input">
                  <option>América/São Paulo (UTC-3 - Horário de Brasília)</option>
                </select>
              </div>
            </div>
          </section>

          <!-- ETAPA 2: INSTRUÇÕES & COMPORTAMENTO -->
          <section *ngIf="currentStep() === 2" class="step-pane">
            <div class="pane-header">
              <h2>2. Instruções & Comportamento do Agente</h2>
              <p>Configure a mensagem de saudação, prompt de comando e diretrizes de fallback.</p>
            </div>

            <div class="form-grid">
              <div class="form-group full-width">
                <label class="dash-label">Instruções Mestras do Agente (Prompt de Sistema) *</label>
                <textarea
                  [(ngModel)]="agentForm.instructions"
                  rows="6"
                  placeholder="Você é um assistente de voz profissional. Seu objetivo é ajudar clientes com educação..."
                  class="dash-input code-font"
                ></textarea>
                <span class="input-hint">O agente utilizará exclusivamente essas instruções para guiar a conversa telefônica.</span>
              </div>

              <div class="form-group full-width">
                <label class="dash-label">Saudação Inicial (Primeira fala ao atender a chamada) *</label>
                <input
                  type="text"
                  [(ngModel)]="agentForm.behavior.openingMessage"
                  placeholder="Ex: Olá! Sou a Helena, assistente virtual da Vozly. Como posso ajudar você hoje?"
                  class="dash-input"
                />
              </div>

              <div class="form-group full-width">
                <label class="dash-label">Mensagem de Fallback (Contingência / Incompreensão) *</label>
                <input
                  type="text"
                  [(ngModel)]="agentForm.behavior.fallbackMessage"
                  placeholder="Ex: Desculpe, não consegui entender perfeitamente. Vou transferir para nossa equipe."
                  class="dash-input"
                />
              </div>

              <div class="form-group full-width">
                <label class="dash-label">Mensagem de Encerramento Amigável</label>
                <input
                  type="text"
                  [(ngModel)]="agentForm.behavior.closingMessage"
                  placeholder="Ex: Foi um prazer atender você! Tenha um ótimo dia e até logo."
                  class="dash-input"
                />
              </div>
            </div>
          </section>

          <!-- ETAPA 3: VOZ & PARÂMETROS DE ÁUDIO -->
          <section *ngIf="currentStep() === 3" class="step-pane">
            <div class="pane-header">
              <h2>3. Voz Neural & Síntese de Áudio</h2>
              <p>Escolha a voz que representará sua empresa e calibre a velocidade da fala.</p>
            </div>

            <div class="voices-selector-grid">
              <div
                class="voice-card dash-glass-card"
                *ngFor="let voice of availableVoices"
                [class.selected]="agentForm.voiceConfig.voiceId === voice.id"
                (click)="selectVoice(voice)"
              >
                <div class="voice-top">
                  <div class="voice-avatar-pill">
                    <app-icon name="volume-2" [size]="18"></app-icon>
                  </div>
                  <span class="voice-gender-badge">{{ voice.gender }}</span>
                </div>
                <h4 class="voice-name">{{ voice.name }}</h4>
                <p class="voice-tone">{{ voice.description }}</p>

                <button
                  type="button"
                  class="btn-preview-audio"
                  (click)="playSampleAudio(voice, $event)"
                >
                  <app-icon [name]="playingVoiceId() === voice.id ? 'pause' : 'play'" [size]="14"></app-icon>
                  <span>{{ playingVoiceId() === voice.id ? 'Reproduzindo...' : 'Ouvir Amostra' }}</span>
                </button>
              </div>
            </div>

            <div class="audio-tuning-grid">
              <div class="tuning-card">
                <label class="dash-label">Velocidade da Fala ({{ agentForm.voiceConfig.speed }}x)</label>
                <input
                  type="range"
                  min="0.8"
                  max="1.2"
                  step="0.05"
                  [(ngModel)]="agentForm.voiceConfig.speed"
                  class="range-slider"
                />
                <div class="range-labels">
                  <span>Mais lenta (0.8x)</span>
                  <span>Normal (1.0x)</span>
                  <span>Mais rápida (1.2x)</span>
                </div>
              </div>

              <div class="tuning-card">
                <label class="dash-label">Sensibilidade a Interrupções (Barge-in)</label>
                <select [(ngModel)]="agentForm.voiceConfig.interruptionSensitivity" class="dash-input">
                  <option value="HIGH">Alta (Interrompe assim que o cliente fala)</option>
                  <option value="NORMAL">Normal (Equilibrada)</option>
                  <option value="LOW">Baixa (Evita interrupções acidentais por ruído)</option>
                </select>
              </div>
            </div>
          </section>

          <!-- ETAPA 4: BASE DE CONHECIMENTO -->
          <section *ngIf="currentStep() === 4" class="step-pane">
            <div class="pane-header">
              <h2>4. Base de Conhecimento Empresarial</h2>
              <p>Vincule perguntas frequentes e diretrizes para o agente fundamentar respostas reais.</p>
            </div>

            <div class="knowledge-selection-list">
              <div
                class="knowledge-item-row"
                *ngFor="let item of state.knowledgeItems()"
                [class.selected]="isKnowledgeSelected(item.id)"
                (click)="toggleKnowledge(item.id)"
              >
                <input
                  type="checkbox"
                  [checked]="isKnowledgeSelected(item.id)"
                  (change)="toggleKnowledge(item.id)"
                  class="custom-check"
                />
                <div class="ki-content">
                  <div class="ki-title-line">
                    <span class="ki-badge">{{ item.category }}</span>
                    <h4 class="ki-title">{{ item.title }}</h4>
                  </div>
                  <p class="ki-preview">{{ item.content }}</p>
                </div>
                <span class="ki-tokens">{{ item.tokenCount }} tokens</span>
              </div>
            </div>

            <div class="info-callout">
              <app-icon name="info" [size]="16" color="#A855F7"></app-icon>
              <span>O agente nunca inventará informações. Caso a pergunta não esteja contemplada nos itens vinculados, o fallback será acionado com segurança.</span>
            </div>
          </section>

          <!-- ETAPA 5: FERRAMENTAS & INTEGRAÇÕES -->
          <section *ngIf="currentStep() === 5" class="step-pane">
            <div class="pane-header">
              <h2>5. Ferramentas & Integrações Autorizadas</h2>
              <p>Habilite capacidades explícitas do catálogo oficial suportado pela Vozly.</p>
            </div>

            <div class="tools-selection-list">
              <div
                class="tool-card-item"
                *ngFor="let tool of state.toolDefinitions()"
                [class.enabled]="isToolEnabled(tool.key)"
                (click)="toggleTool(tool.key)"
              >
                <div class="tool-top">
                  <div class="tool-icon-pill" [class.active]="isToolEnabled(tool.key)">
                    <app-icon [name]="tool.implementationType === 'NATIVE' ? 'zap' : 'cpu'" [size]="16"></app-icon>
                  </div>
                  <div class="tool-tags">
                    <span class="dash-badge dash-badge-neutral">{{ tool.implementationType }}</span>
                    <span class="dash-badge" [ngClass]="tool.riskLevel === 'HIGH' ? 'dash-badge-red' : 'dash-badge-green'">
                      Risco {{ tool.riskLevel }}
                    </span>
                  </div>
                </div>

                <div class="tool-info">
                  <h4 class="tool-title">{{ tool.name }}</h4>
                  <code class="tool-key">{{ tool.key }}</code>
                  <p class="tool-desc">{{ tool.description }}</p>
                </div>

                <div class="tool-toggle-row">
                  <span class="toggle-status">{{ isToolEnabled(tool.key) ? 'Habilitada' : 'Desabilitada' }}</span>
                  <div class="custom-switch" [class.on]="isToolEnabled(tool.key)">
                    <div class="switch-handle"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ETAPA 6: TELEFONIA & REGRAS DE ATENDIMENTO -->
          <section *ngIf="currentStep() === 6" class="step-pane">
            <div class="pane-header">
              <h2>6. Telefonia & Regras Operacionais</h2>
              <p>Configure a linha telefônica, horários de atendimento e transferência humana.</p>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="dash-label">Linha Telefônica Vinculada</label>
                <select [(ngModel)]="agentForm.telephony.phoneNumber" class="dash-input">
                  <option value="">Nenhum número vinculado no momento</option>
                  <option *ngFor="let phone of state.phoneNumbers()" [value]="phone.formatted">
                    {{ phone.formatted }} ({{ phone.provider }})
                  </option>
                </select>
                <span class="input-hint">Você pode vincular ou alterar números após a publicação.</span>
              </div>

              <div class="form-group">
                <label class="dash-label">Horário de Atendimento da Linha</label>
                <input
                  type="text"
                  [(ngModel)]="agentForm.telephony.businessHours"
                  placeholder="Ex: Seg-Sex 08:00 - 18:00"
                  class="dash-input"
                />
              </div>

              <div class="form-group full-width">
                <label class="dash-label">Número para Transferência Humana (Transbordo)</label>
                <input
                  type="tel"
                  [(ngModel)]="agentForm.behavior.transferPolicy.destinationNumber"
                  placeholder="+55 (11) 98765-4321"
                  class="dash-input"
                />
                <span class="input-hint">Quando o cliente solicitar ou o fallback for atingido, a chamada será transferida para este número.</span>
              </div>

              <div class="form-group full-width">
                <label class="dash-label">Comportamento Fora do Expediente</label>
                <select [(ngModel)]="agentForm.telephony.afterHoursBehavior" class="dash-input">
                  <option value="CLOSING_MESSAGE">Reproduzir mensagem informativa e encerrar</option>
                  <option value="TRANSFER">Transferir imediatamente para número de plantão</option>
                  <option value="VOICEMAIL">Registrar solicitação de retorno para o dia seguinte</option>
                </select>
              </div>
            </div>
          </section>

          <!-- ETAPA 7: PRONTIDÃO, TESTE & PUBLICAÇÃO -->
          <section *ngIf="currentStep() === 7" class="step-pane">
            <div class="pane-header">
              <h2>7. Verificação de Prontidão & Publicação</h2>
              <p>Revise os itens obrigatórios e publique uma versão imutável para atendimento.</p>
            </div>

            <!-- Checklist de Prontidão -->
            <div class="readiness-checklist">
              <div
                class="checklist-item"
                *ngFor="let check of readiness().checks"
                [class.passed]="check.passed"
              >
                <div class="check-icon-circle" [class.passed]="check.passed">
                  <app-icon [name]="check.passed ? 'check' : 'alert-circle'" [size]="16"></app-icon>
                </div>
                <div class="check-content">
                  <div class="check-title-row">
                    <span class="check-name">{{ check.title }}</span>
                    <span class="check-req-badge" [class.mand]="check.mandatory">
                      {{ check.mandatory ? 'Obrigatório' : 'Recomendado' }}
                    </span>
                  </div>
                  <p class="check-desc">{{ check.description }}</p>
                </div>
                <button
                  class="btn-fix"
                  *ngIf="!check.passed && check.stepIndex"
                  (click)="goToStep(check.stepIndex)"
                >
                  Configurar
                </button>
              </div>
            </div>

            <!-- Card de Publicação Oficial -->
            <div class="publish-action-box dash-glass-card" [class.ready-box]="readiness().isReady">
              <div class="pab-text">
                <h3>{{ readiness().isReady ? 'Tudo pronto para publicação!' : 'Pendências obrigatórias identificadas' }}</h3>
                <p>
                  {{ readiness().isReady
                    ? 'A publicação gerará uma versão imutável. Alterações futuras ficarão salvas em rascunho sem impactar as chamadas ativas.'
                    : 'Corrija os passos obrigatórios indicados acima antes de publicar seu agente.' }}
                </p>
              </div>

              <button
                class="btn btn-primary btn-lg btn-publish"
                [disabled]="!readiness().isReady || isPublishing()"
                (click)="publishAgent()"
              >
                <app-icon name="sparkles" [size]="18"></app-icon>
                <span>{{ isPublishing() ? 'Publicando Versão...' : 'Publicar Snapshot Imutável' }}</span>
              </button>
            </div>
          </section>

          <!-- RODAPÉ DE NAVEGAÇÃO ENTRE ETAPAS -->
          <div class="wizard-nav-footer">
            <button
              class="btn btn-secondary btn-sm"
              (click)="previousStep()"
              [disabled]="currentStep() === 1"
            >
              <span>Voltar</span>
            </button>

            <span class="step-counter">Etapa {{ currentStep() }} de {{ steps.length }}</span>

            <button
              class="btn btn-primary btn-sm"
              *ngIf="currentStep() < steps.length"
              (click)="nextStep()"
            >
              <span>Próxima Etapa</span>
              <app-icon name="arrow-right" [size]="16"></app-icon>
            </button>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .wizard-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .wizard-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--text-muted);
      font-size: 13px;
      transition: color var(--transition-fast);
    }

    .back-link:hover {
      color: #FFFFFF;
    }

    .rotate-180 {
      transform: rotate(180deg);
    }

    .wizard-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .badge-self-service {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      color: #C084FC;
      letter-spacing: 0.05em;
    }

    .live-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #A855F7;
    }

    .wizard-title {
      font-size: 26px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    .alert-toast {
      padding: 12px 18px;
      border-color: rgba(34, 197, 94, 0.4);
      background: rgba(34, 197, 94, 0.12);
      color: #4ADE80;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13.5px;
      font-weight: 500;
      border-radius: 12px;
      animation: fadeIn 0.3s ease-out;
    }

    /* Layout do Wizard */
    .wizard-layout-grid {
      display: grid;
      grid-template-columns: 290px 1fr;
      gap: 24px;
      align-items: start;
    }

    @media (max-width: 900px) {
      .wizard-layout-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Stepper Lateral */
    .stepper-sidebar {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .stepper-heading {
      font-size: 15px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .step-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .step-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 12px;
      cursor: pointer;
      transition: all var(--transition-fast);
      background: transparent;
    }

    .step-item:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .step-item.active {
      background: rgba(109, 0, 255, 0.18);
      border: 1px solid rgba(168, 85, 247, 0.35);
    }

    .step-indicator {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      flex-shrink: 0;
    }

    .step-item.active .step-indicator {
      background: #A855F7;
      border-color: #C084FC;
      color: #FFFFFF;
      box-shadow: 0 0 10px #A855F7;
    }

    .step-item.completed .step-indicator {
      background: rgba(34, 197, 94, 0.2);
      border-color: #4ADE80;
      color: #4ADE80;
    }

    .step-text {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .step-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .step-item.active .step-title {
      color: #FFFFFF;
    }

    .step-sub {
      font-size: 11px;
      color: var(--text-dim);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .stepper-readiness-card {
      padding: 14px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .readiness-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .rc-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .rc-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 9999px;
      background: rgba(245, 158, 11, 0.15);
      color: #FBBF24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .rc-badge.ready {
      background: rgba(34, 197, 94, 0.15);
      color: #4ADE80;
      border-color: rgba(34, 197, 94, 0.3);
    }

    .readiness-progress-bar {
      height: 6px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.06);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #6D00FF 0%, #A855F7 100%);
      transition: width var(--transition-base);
    }

    .readiness-hint {
      font-size: 10.5px;
      color: var(--text-muted);
    }

    /* Painel Central */
    .wizard-stage-card {
      padding: 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 580px;
    }

    .step-pane {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .pane-header h2 {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 4px;
    }

    .pane-header p {
      font-size: 13.5px;
      color: var(--text-secondary);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }

    .form-group.full-width {
      grid-column: span 2;
    }

    @media (max-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      .form-group.full-width {
        grid-column: span 1;
      }
    }

    .input-hint {
      font-size: 11.5px;
      color: var(--text-muted);
      margin-top: 5px;
      display: block;
    }

    .code-font {
      font-family: var(--font-mono);
      font-size: 13px;
      line-height: 1.6;
    }

    /* Etapa de Voz */
    .voices-selector-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
    }

    .voice-card {
      padding: 18px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: all var(--transition-fast);
    }

    .voice-card.selected {
      border-color: #A855F7;
      background: rgba(109, 0, 255, 0.16);
      box-shadow: 0 0 20px rgba(109, 0, 255, 0.25);
    }

    .voice-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .voice-avatar-pill {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: rgba(109, 0, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #C084FC;
    }

    .voice-gender-badge {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-muted);
    }

    .voice-name {
      font-size: 15px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .voice-tone {
      font-size: 12px;
      color: var(--text-secondary);
      flex: 1;
    }

    .btn-preview-audio {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-secondary);
      font-size: 11.5px;
      cursor: pointer;
      transition: all var(--transition-fast);
      margin-top: 6px;
    }

    .btn-preview-audio:hover {
      background: rgba(109, 0, 255, 0.2);
      color: #FFFFFF;
    }

    .audio-tuning-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-top: 10px;
    }

    @media (max-width: 600px) {
      .audio-tuning-grid {
        grid-template-columns: 1fr;
      }
    }

    .tuning-card {
      padding: 16px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .range-slider {
      width: 100%;
      accent-color: var(--light-purple);
      cursor: pointer;
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      color: var(--text-muted);
    }

    /* Etapa de Conhecimento */
    .knowledge-selection-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .knowledge-item-row {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 14px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .knowledge-item-row:hover {
      background: rgba(109, 0, 255, 0.08);
      border-color: rgba(168, 85, 247, 0.3);
    }

    .knowledge-item-row.selected {
      background: rgba(109, 0, 255, 0.15);
      border-color: rgba(168, 85, 247, 0.4);
    }

    .custom-check {
      margin-top: 4px;
      accent-color: var(--primary-purple);
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    .ki-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .ki-title-line {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ki-badge {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 6px;
      background: rgba(109, 0, 255, 0.2);
      color: #C084FC;
      font-weight: 600;
    }

    .ki-title {
      font-size: 14px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .ki-preview {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .ki-tokens {
      font-size: 11px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      white-space: nowrap;
    }

    .info-callout {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 12px;
      background: rgba(109, 0, 255, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.2);
      font-size: 12px;
      color: var(--text-secondary);
    }

    /* Etapa de Ferramentas */
    .tools-selection-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 14px;
    }

    .tool-card-item {
      padding: 16px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .tool-card-item:hover {
      background: rgba(109, 0, 255, 0.08);
      border-color: rgba(168, 85, 247, 0.3);
    }

    .tool-card-item.enabled {
      background: rgba(109, 0, 255, 0.16);
      border-color: rgba(168, 85, 247, 0.45);
    }

    .tool-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .tool-icon-pill {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
    }

    .tool-icon-pill.active {
      background: rgba(109, 0, 255, 0.25);
      color: #C084FC;
    }

    .tool-tags {
      display: flex;
      gap: 6px;
    }

    .tool-title {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 2px;
    }

    .tool-key {
      font-size: 11px;
      color: var(--light-purple);
      font-family: var(--font-mono);
      display: block;
      margin-bottom: 6px;
    }

    .tool-desc {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .tool-toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 10px;
    }

    .toggle-status {
      font-size: 11.5px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .tool-card-item.enabled .toggle-status {
      color: #4ADE80;
    }

    .custom-switch {
      width: 36px;
      height: 20px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.1);
      position: relative;
      transition: background var(--transition-fast);
    }

    .custom-switch.on {
      background: #A855F7;
    }

    .switch-handle {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #FFFFFF;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: transform var(--transition-fast);
    }

    .custom-switch.on .switch-handle {
      transform: translateX(16px);
    }

    /* Etapa 7: Prontidão e Publicação */
    .readiness-checklist {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .checklist-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .checklist-item.passed {
      border-color: rgba(34, 197, 94, 0.2);
    }

    .check-icon-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(245, 158, 11, 0.15);
      color: #FBBF24;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .check-icon-circle.passed {
      background: rgba(34, 197, 94, 0.15);
      color: #4ADE80;
    }

    .check-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .check-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .check-name {
      font-size: 13.5px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .check-req-badge {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
    }

    .check-req-badge.mand {
      background: rgba(109, 0, 255, 0.2);
      color: #C084FC;
    }

    .check-desc {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .btn-fix {
      font-size: 12px;
      color: var(--light-purple);
      background: transparent;
      border: 1px solid rgba(168, 85, 247, 0.3);
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .btn-fix:hover {
      background: rgba(109, 0, 255, 0.2);
      color: #FFFFFF;
    }

    .publish-action-box {
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 16px;
    }

    .publish-action-box.ready-box {
      border-color: rgba(168, 85, 247, 0.45);
      background: linear-gradient(135deg, rgba(109, 0, 255, 0.18) 0%, rgba(21, 21, 27, 0.95) 100%);
      box-shadow: 0 0 30px rgba(109, 0, 255, 0.2);
    }

    .pab-text h3 {
      font-size: 17px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 4px;
    }

    .pab-text p {
      font-size: 13px;
      color: var(--text-secondary);
      max-width: 580px;
    }

    .btn-publish {
      box-shadow: 0 6px 24px rgba(109, 0, 255, 0.5);
    }

    /* Rodapé do Wizard */
    .wizard-nav-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 20px;
      margin-top: 28px;
    }

    .step-counter {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class AgentWizardComponent implements OnInit {
  currentStep = signal<number>(1);
  isEditing = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isPublishing = signal<boolean>(false);
  feedbackMessage = signal<string | null>(null);
  playingVoiceId = signal<string | null>(null);

  agentId: string | null = null;

  readonly steps: WizardStep[] = [
    { index: 1, id: 'identity', title: 'Identificação', subtitle: 'Nome e objetivo', icon: 'bot' },
    { index: 2, id: 'instructions', title: 'Instruções', subtitle: 'Prompt e fallback', icon: 'file-text' },
    { index: 3, id: 'voice', title: 'Voz & Áudio', subtitle: 'Modelo e velocidade', icon: 'mic' },
    { index: 4, id: 'knowledge', title: 'Conhecimento', subtitle: 'Base e FAQs', icon: 'book-open' },
    { index: 5, id: 'tools', title: 'Ferramentas', subtitle: 'Capacidades e APIs', icon: 'cpu' },
    { index: 6, id: 'telephony', title: 'Telefonia', subtitle: 'Linha e horários', icon: 'phone' },
    { index: 7, id: 'publish', title: 'Prontidão', subtitle: 'Revisão e publicação', icon: 'sparkles' }
  ];

  readonly availableVoices = [
    { id: 'pt-BR-Wavenet-Helena', name: 'Helena', gender: 'Feminina', description: 'Neural expressiva, clara e amigável.' },
    { id: 'pt-BR-Neural-Vitor', name: 'Vitor', gender: 'Masculina', description: 'Tom firme, corporativo e seguro.' },
    { id: 'pt-BR-Wavenet-Larissa', name: 'Larissa', gender: 'Feminina', description: 'Suave, empática e atenciosa.' },
    { id: 'pt-BR-Neural-Mateus', name: 'Mateus', gender: 'Masculina', description: 'Ágil, dinâmico e comercial.' }
  ];

  agentForm: Agent = {
    id: '',
    status: 'DRAFT',
    draftRevision: 1,
    currentPublishedVersion: null,
    createdAt: '',
    updatedAt: '',
    metrics: {
      totalCalls: 0,
      completedCalls: 0,
      transferredCalls: 0,
      resolutionRate: 0,
      avgDurationSeconds: 0
    },
    name: '',
    description: '',
    language: 'pt-BR',
    instructions: '',
    voiceConfig: {
      voiceId: 'pt-BR-Wavenet-Helena',
      voiceName: 'Helena (Neural Clara pt-BR)',
      provider: 'Neural Voice Engine',
      language: 'pt-BR',
      speed: 1.0,
      pitch: 1.0,
      interruptionSensitivity: 'HIGH'
    },
    behavior: {
      openingMessage: '',
      fallbackMessage: '',
      closingMessage: '',
      transferPolicy: { enabled: true, destinationNumber: '', department: 'Suporte' },
      collectSummary: true
    },
    telephony: {
      phoneNumber: '',
      businessHours: 'Seg-Sex 08:00 - 18:00',
      afterHoursBehavior: 'CLOSING_MESSAGE'
    },
    knowledgeItemIds: ['kn-01'],
    tools: [
      { toolKey: 'knowledge.search', toolName: 'Consultar Conhecimento', enabled: true, implementationType: 'NATIVE' },
      { toolKey: 'conversation.collect', toolName: 'Coletar Informações', enabled: true, implementationType: 'NATIVE' },
      { toolKey: 'call.transfer', toolName: 'Transferir Atendimento', enabled: true, implementationType: 'NATIVE' },
      { toolKey: 'call.end', toolName: 'Encerrar Atendimento', enabled: true, implementationType: 'NATIVE' }
    ]
  };

  constructor(
    public state: DashboardStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.agentId = id;
      const existing = this.state.agents().find(a => a.id === id);
      if (existing) {
        this.isEditing.set(true);
        this.agentForm = JSON.parse(JSON.stringify(existing));
      }
    } else {
      // Pré-preenchimento demonstrativo para agilizar avaliação
      this.agentForm.name = 'Novo Agente de Atendimento';
      this.agentForm.description = 'Assistente de voz para triagem de dúvidas e solicitações frequentes.';
      this.agentForm.instructions =
        'Você é um assistente de voz profissional da empresa. Responda com clareza, objetividade e empatia.';
      this.agentForm.behavior!.openingMessage = 'Olá! Como posso ajudar você hoje?';
      this.agentForm.behavior!.fallbackMessage =
        'Desculpe, não consegui entender essa solicitação. Vou conectar você com a nossa equipe.';
      this.agentForm.behavior!.closingMessage = 'Agradecemos sua ligação. Tenha um ótimo dia!';
    }
  }

  readiness(): ReadinessCheckResult {
    return this.state.checkAgentReadiness(this.agentForm as Agent);
  }

  get readinessScore(): number {
    const checks = this.readiness().checks;
    const passed = checks.filter(c => c.passed).length;
    return Math.round((passed / checks.length) * 100);
  }

  get passedMandatoryChecks(): number {
    return this.readiness().checks.filter(c => c.mandatory && c.passed).length;
  }

  get totalMandatoryChecks(): number {
    return this.readiness().checks.filter(c => c.mandatory).length;
  }

  goToStep(step: number): void {
    this.currentStep.set(step);
  }

  nextStep(): void {
    if (this.currentStep() < this.steps.length) {
      this.currentStep.update(s => s + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  selectVoice(voice: { id: string; name: string }): void {
    this.agentForm.voiceConfig!.voiceId = voice.id;
    this.agentForm.voiceConfig!.voiceName = `${voice.name} (Neural pt-BR)`;
  }

  playSampleAudio(voice: { id: string; name: string }, event: Event): void {
    event.stopPropagation();
    if (this.playingVoiceId() === voice.id) {
      this.playingVoiceId.set(null);
    } else {
      this.playingVoiceId.set(voice.id);
      setTimeout(() => {
        this.playingVoiceId.set(null);
      }, 2000);
    }
  }

  isKnowledgeSelected(id: string): boolean {
    return this.agentForm.knowledgeItemIds?.includes(id) ?? false;
  }

  toggleKnowledge(id: string): void {
    if (!this.agentForm.knowledgeItemIds) {
      this.agentForm.knowledgeItemIds = [];
    }
    const idx = this.agentForm.knowledgeItemIds.indexOf(id);
    if (idx >= 0) {
      this.agentForm.knowledgeItemIds.splice(idx, 1);
    } else {
      this.agentForm.knowledgeItemIds.push(id);
    }
  }

  isToolEnabled(key: string): boolean {
    return this.agentForm.tools?.some(t => t.toolKey === key && t.enabled) ?? false;
  }

  toggleTool(key: string): void {
    if (!this.agentForm.tools) {
      this.agentForm.tools = [];
    }
    const existing = this.agentForm.tools.find(t => t.toolKey === key);
    if (existing) {
      existing.enabled = !existing.enabled;
    } else {
      const def = this.state.toolDefinitions().find(d => d.key === key);
      if (def) {
        this.agentForm.tools.push({
          toolKey: def.key,
          toolName: def.name,
          enabled: true,
          implementationType: def.implementationType
        });
      }
    }
  }

  async saveDraft(): Promise<void> {
    this.isSaving.set(true);
    await new Promise(r => setTimeout(r, 400));

    if (this.isEditing() && this.agentId) {
      this.state.updateAgent(this.agentId, this.agentForm);
    } else {
      const created = this.state.createAgent(this.agentForm);
      this.agentId = created.id;
      this.isEditing.set(true);
    }

    this.isSaving.set(false);
    this.feedbackMessage.set('Rascunho salvo localmente com sucesso.');
    setTimeout(() => this.feedbackMessage.set(null), 3500);
  }

  async publishAgent(): Promise<void> {
    if (!this.readiness().isReady) return;

    this.isPublishing.set(true);
    await new Promise(r => setTimeout(r, 700));

    if (!this.agentId) {
      const created = this.state.createAgent(this.agentForm);
      this.agentId = created.id;
    } else {
      this.state.updateAgent(this.agentId, this.agentForm);
    }

    const res = this.state.publishAgent(this.agentId);
    this.isPublishing.set(false);

    if (res.success) {
      this.feedbackMessage.set(res.message);
      setTimeout(() => {
        this.router.navigate(['/dashboard/agents']);
      }, 1200);
    }
  }
}
