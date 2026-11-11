import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { UserRole } from '../../../models/dashboard.models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="settings-page">
      <!-- Cabeçalho -->
      <header class="page-header">
        <div class="header-titles">
          <div class="badge-title">
            <span class="badge-dot"></span>
            <span>GESTÃO MULTI-TENANT & PREFERÊNCIAS (DOCS/01 & DOCS/08)</span>
          </div>
          <h1 class="page-title">Configurações do Workspace</h1>
          <p class="page-subtitle">
            Administre os dados da sua empresa, gerencie os membros da equipe e calibre políticas de privacidade.
          </p>
        </div>
      </header>

      <!-- Barra de Abas -->
      <div class="tabs-bar dash-glass-card">
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'GENERAL'"
          (click)="activeTab.set('GENERAL')"
        >
          <app-icon name="building" [size]="16"></app-icon>
          <span>Dados do Workspace</span>
        </button>

        <button
          class="tab-btn"
          [class.active]="activeTab() === 'MEMBERS'"
          (click)="activeTab.set('MEMBERS')"
        >
          <app-icon name="users" [size]="16"></app-icon>
          <span>Membros da Equipe & Papéis ({{ state.teamMembers().length }})</span>
        </button>

        <button
          class="tab-btn"
          [class.active]="activeTab() === 'PRIVACY'"
          (click)="activeTab.set('PRIVACY')"
        >
          <app-icon name="shield-check" [size]="16"></app-icon>
          <span>Políticas de Retenção & LGPD</span>
        </button>
      </div>

      <!-- Toast de Sucesso -->
      <div class="alert-toast dash-glass-card" *ngIf="feedbackMessage()">
        <app-icon name="check-circle" [size]="16" color="#4ADE80"></app-icon>
        <span>{{ feedbackMessage() }}</span>
      </div>

      <!-- ABA 1: DADOS DO WORKSPACE -->
      <section class="tab-pane dash-glass-card" *ngIf="activeTab() === 'GENERAL'">
        <div class="pane-header">
          <h3>Identificação da Empresa</h3>
          <p>Informações básicas utilizadas para faturamento e vinculação dos agentes.</p>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="dash-label">Nome do Workspace / Empresa</label>
            <input
              type="text"
              [(ngModel)]="workspaceName"
              class="dash-input"
            />
          </div>

          <div class="form-group">
            <label class="dash-label">Identificador Exclusivo (Slug)</label>
            <input
              type="text"
              [value]="state.currentWorkspace().slug"
              disabled
              class="dash-input disabled"
            />
            <span class="input-hint">O identificador slug é imutável após a criação do workspace.</span>
          </div>

          <div class="form-group">
            <label class="dash-label">Plano Vigente</label>
            <input
              type="text"
              [value]="state.currentWorkspace().plan"
              disabled
              class="dash-input disabled"
            />
          </div>

          <div class="form-group">
            <label class="dash-label">Fuso Horário Padrão</label>
            <input
              type="text"
              [value]="state.currentWorkspace().timezone"
              class="dash-input"
            />
          </div>
        </div>

        <div class="pane-footer">
          <button class="btn btn-primary btn-sm" (click)="saveWorkspaceGeneral()">
            Salvar Alterações
          </button>
        </div>
      </section>

      <!-- ABA 2: MEMBROS DA EQUIPE & PAPÉIS -->
      <section class="tab-pane dash-glass-card" *ngIf="activeTab() === 'MEMBERS'">
        <div class="pane-header-with-action">
          <div>
            <h3>Usuários com Acesso ao Painel</h3>
            <p>Gerencie papéis conforme a matriz de permissões (OWNER, ADMIN, OPERATOR).</p>
          </div>
          <button class="btn btn-primary btn-sm" (click)="isInviteModalOpen.set(true)">
            <app-icon name="plus" [size]="16"></app-icon>
            <span>Convidar Membro</span>
          </button>
        </div>

        <div class="table-responsive">
          <table class="members-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>E-mail</th>
                <th>Papel de Acesso</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let member of state.teamMembers()">
                <td>
                  <div class="user-row-cell">
                    <img
                      [src]="member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'"
                      [alt]="member.name"
                      class="member-avatar"
                    />
                    <span class="member-name">{{ member.name }}</span>
                  </div>
                </td>
                <td>{{ member.email }}</td>
                <td>
                  <span class="dash-badge" [ngClass]="getRoleBadgeClass(member.role)">
                    {{ member.role }}
                  </span>
                </td>
                <td>
                  <span class="member-status-text" [class.green]="member.status === 'ACTIVE'">
                    {{ member.status === 'ACTIVE' ? 'Ativo' : 'Convite Pendente' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ABA 3: POLÍTICAS DE RETENÇÃO & LGPD -->
      <section class="tab-pane dash-glass-card" *ngIf="activeTab() === 'PRIVACY'">
        <div class="pane-header">
          <h3>Conformidade e Proteção de Dados (LGPD)</h3>
          <p>Parâmetros de minimização de dados e ciclo de vida de transcrições telefônicas.</p>
        </div>

        <div class="policies-list">
          <div class="policy-item">
            <div class="policy-info">
              <h4>Consentimento e Transparência Prévia</h4>
              <p>O agente sempre informa ao interlocutor na mensagem inicial que o atendimento é automatizado por inteligência artificial.</p>
            </div>
            <span class="dash-badge dash-badge-green">Ativo por Padrão</span>
          </div>

          <div class="policy-item">
            <div class="policy-info">
              <h4>Retenção de Transcrições Telefônicas</h4>
              <p>Período de guarda de textos transcritos das chamadas antes da exclusão automática pelo banco.</p>
            </div>
            <select class="dash-input compact-select">
              <option>90 dias (Padrão de Auditoria)</option>
              <option>180 dias</option>
              <option>365 dias</option>
            </select>
          </div>

          <div class="policy-item">
            <div class="policy-info">
              <h4>Sanitização Automática de Dados Sensíveis (PII Masking)</h4>
              <p>Mascaramento em tempo real de CPFs, senhas faladas e números de cartão em relatórios e transcrições.</p>
            </div>
            <span class="dash-badge dash-badge-green">Ativo</span>
          </div>
        </div>
      </section>

      <!-- Modal Convidar Membro -->
      <div class="modal-backdrop" *ngIf="isInviteModalOpen()" (click)="isInviteModalOpen.set(false)">
        <div class="modal-card dash-glass-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Convidar Novo Membro da Equipe</h3>
            <button class="close-btn" (click)="isInviteModalOpen.set(false)">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="dash-label">E-mail Corporativo *</label>
              <input
                type="email"
                [(ngModel)]="inviteEmail"
                placeholder="nome@empresa.com.br"
                class="dash-input"
              />
            </div>

            <div class="form-group">
              <label class="dash-label">Papel de Acesso *</label>
              <select [(ngModel)]="inviteRole" class="dash-input">
                <option value="OPERATOR">OPERATOR — Consulta chamadas e relatórios</option>
                <option value="ADMIN">ADMIN — Gerencia agentes, integrações e conhecimento</option>
                <option value="OWNER">OWNER — Controle total do workspace e membros</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" (click)="isInviteModalOpen.set(false)">Cancelar</button>
            <button class="btn btn-primary btn-sm" (click)="sendInvite()" [disabled]="!inviteEmail">
              Enviar Convite
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .badge-title {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      color: #C084FC;
      letter-spacing: 0.05em;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #A855F7;
    }

    .page-title {
      font-size: 26px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      font-size: 13.5px;
      color: var(--text-secondary);
      max-width: 640px;
    }

    .tabs-bar {
      display: flex;
      gap: 8px;
      padding: 8px;
    }

    .tab-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .tab-btn:hover { color: #FFFFFF; }

    .tab-btn.active {
      background: linear-gradient(135deg, rgba(109, 0, 255, 0.8) 0%, rgba(139, 61, 255, 0.7) 100%);
      color: #FFFFFF;
    }

    .tab-pane {
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .pane-header h3, .pane-header-with-action h3 {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 2px;
    }

    .pane-header p, .pane-header-with-action p {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .pane-header-with-action {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 16px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }

    @media (max-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    .input-hint {
      font-size: 11.5px;
      color: var(--text-muted);
      margin-top: 5px;
      display: block;
    }

    .disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .pane-footer {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 16px;
    }

    /* Tabela */
    .table-responsive {
      overflow-x: auto;
      width: 100%;
    }

    .members-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }

    .members-table th {
      padding: 12px 16px;
      color: var(--text-muted);
      font-size: 11.5px;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .members-table td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }

    .user-row-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .member-avatar {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      object-fit: cover;
    }

    .member-name {
      font-weight: 600;
      color: #FFFFFF;
    }

    .member-status-text {
      font-size: 12px;
      color: var(--text-muted);
    }

    .member-status-text.green { color: #4ADE80; font-weight: 600; }

    /* Políticas */
    .policies-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .policy-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      gap: 16px;
    }

    .policy-info h4 {
      font-size: 14.5px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 3px;
    }

    .policy-info p {
      font-size: 12.5px;
      color: var(--text-secondary);
      max-width: 600px;
    }

    .compact-select {
      max-width: 200px;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-card {
      width: 100%;
      max-width: 480px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: rgba(18, 16, 26, 0.98);
      border-radius: 20px;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-header h3 {
      font-size: 17px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .close-btn { color: var(--text-muted); cursor: pointer; }

    .modal-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
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
    }
  `]
})
export class SettingsComponent {
  activeTab = signal<'GENERAL' | 'MEMBERS' | 'PRIVACY'>('GENERAL');
  workspaceName: string = '';
  feedbackMessage = signal<string | null>(null);

  isInviteModalOpen = signal<boolean>(false);
  inviteEmail: string = '';
  inviteRole: UserRole = 'OPERATOR';

  constructor(public state: DashboardStateService) {
    this.workspaceName = state.currentWorkspace().name;
  }

  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case 'OWNER': return 'dash-badge-purple';
      case 'ADMIN': return 'dash-badge-blue';
      case 'OPERATOR': return 'dash-badge-neutral';
      default: return 'dash-badge-neutral';
    }
  }

  saveWorkspaceGeneral(): void {
    this.state.currentWorkspace.update(ws => ({ ...ws, name: this.workspaceName }));
    this.feedbackMessage.set('Configurações do workspace atualizadas com sucesso.');
    setTimeout(() => this.feedbackMessage.set(null), 3000);
  }

  sendInvite(): void {
    if (!this.inviteEmail) return;
    this.state.inviteTeamMember(this.inviteEmail, this.inviteRole);
    this.isInviteModalOpen.set(false);
    this.feedbackMessage.set(`Convite enviado com sucesso para ${this.inviteEmail}.`);
    this.inviteEmail = '';
    setTimeout(() => this.feedbackMessage.set(null), 3500);
  }
}
