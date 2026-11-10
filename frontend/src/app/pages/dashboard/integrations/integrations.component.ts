import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { ConnectionStatus, IntegrationConnection, ToolDefinition } from '../../../models/dashboard.models';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="integrations-page">
      <!-- Cabeçalho -->
      <header class="page-header">
        <div class="header-titles">
          <div class="badge-title">
            <span class="badge-dot"></span>
            <span>CATÁLOGO OFICIAL & CONECTORES (DOCS/07)</span>
          </div>
          <h1 class="page-title">Ferramentas & Integrações Empresariais</h1>
          <p class="page-subtitle">
            Gerencie as ferramentas operacionais permitidas aos seus agentes de voz e configure conexões externas seguras.
          </p>
        </div>

        <button class="btn btn-primary btn-sm" (click)="openConnectModal()">
          <app-icon name="plus" [size]="16"></app-icon>
          <span>Nova Conexão</span>
        </button>
      </header>

      <!-- Abas de Navegação -->
      <div class="tabs-header dash-glass-card">
        <button
          class="tab-btn"
          [class.active]="activeTab() === 'NATIVE'"
          (click)="activeTab.set('NATIVE')"
        >
          <app-icon name="zap" [size]="16"></app-icon>
          <span>Ferramentas Nativas Vozly ({{ nativeTools.length }})</span>
        </button>

        <button
          class="tab-btn"
          [class.active]="activeTab() === 'CONNECTIONS'"
          (click)="activeTab.set('CONNECTIONS')"
        >
          <app-icon name="cpu" [size]="16"></app-icon>
          <span>Conexões Externas ({{ state.connections().length }})</span>
        </button>
      </div>

      <!-- ABA 1: FERRAMENTAS NATIVAS -->
      <section class="tools-grid" *ngIf="activeTab() === 'NATIVE'">
        <div class="dash-glass-card tool-item-card" *ngFor="let tool of nativeTools">
          <div class="tic-header">
            <div class="tic-icon">
              <app-icon name="zap" [size]="18"></app-icon>
            </div>
            <div class="tic-badges">
              <span class="dash-badge dash-badge-purple">Nativa Vozly</span>
              <span class="dash-badge" [ngClass]="tool.riskLevel === 'HIGH' ? 'dash-badge-red' : 'dash-badge-green'">
                Risco {{ tool.riskLevel }}
              </span>
            </div>
          </div>

          <div class="tic-body">
            <h3 class="tic-name">{{ tool.name }}</h3>
            <code class="tic-key">{{ tool.key }}</code>
            <p class="tic-desc">{{ tool.description }}</p>
          </div>

          <div class="tic-schema-box">
            <span class="tsb-label">Schema de Entrada Validado:</span>
            <code class="tsb-code">{{ tool.inputSchemaSummary }}</code>
          </div>

          <div class="tic-footer">
            <span class="tic-status-pill">
              <span class="dot-green"></span>
              Disponível para todos os agentes
            </span>
          </div>
        </div>
      </section>

      <!-- ABA 2: CONEXÕES EXTERNAS -->
      <section class="connections-list" *ngIf="activeTab() === 'CONNECTIONS'">
        <div class="dash-glass-card conn-card" *ngFor="let conn of state.connections()">
          <div class="conn-top">
            <div class="conn-icon-pill">
              <app-icon [name]="conn.integrationKey === 'http.rest' ? 'share-2' : 'terminal'" [size]="20"></app-icon>
            </div>

            <div class="conn-meta-col">
              <div class="conn-title-line">
                <h3 class="conn-name">{{ conn.name }}</h3>
                <span class="dash-badge" [ngClass]="getConnectionStatusClass(conn.status)">
                  {{ formatConnectionStatus(conn.status) }}
                </span>
              </div>
              <span class="conn-url">{{ conn.baseUrl || 'Endpoint sob demanda' }}</span>
            </div>

            <div class="conn-actions">
              <button class="btn btn-secondary btn-sm" (click)="testConnection(conn)" [disabled]="isTesting()">
                <app-icon name="refresh-cw" [size]="14"></app-icon>
                <span>Testar Conexão</span>
              </button>
            </div>
          </div>

          <!-- Indicador de Proteção de Segredos (Conforme docs/07 & docs/09) -->
          <div class="security-banner">
            <div class="sb-left">
              <app-icon name="lock" [size]="14" color="#4ADE80"></app-icon>
              <span>Credencial Configurada & Protegida por Envelope Criptográfico</span>
            </div>
            <span class="sb-auth-type">{{ conn.authType }}</span>
          </div>
        </div>
      </section>

      <!-- Alerta Informativo de Segurança -->
      <div class="security-info-box dash-glass-card">
        <div class="sib-icon">
          <app-icon name="shield-check" [size]="20" color="#C084FC"></app-icon>
        </div>
        <div class="sib-content">
          <h4>Princípio Arquitetural de Segurança (docs/07 & ADR-002)</h4>
          <p>
            O cliente configura apenas parâmetros permitidos. O backend valida tenant_id e permissões antes de qualquer execução. Credenciais e segredos nunca são retornados à interface, não entram em prompts de IA e não constam em logs.
          </p>
        </div>
      </div>

      <!-- Modal de Nova Conexão -->
      <div class="modal-backdrop" *ngIf="isModalOpen()" (click)="isModalOpen.set(false)">
        <div class="modal-card dash-glass-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Cadastrar Nova Conexão</h3>
            <button class="close-btn" (click)="isModalOpen.set(false)">
              <app-icon name="x" [size]="18"></app-icon>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="dash-label">Tipo de Conector</label>
              <select [(ngModel)]="newConnKey" class="dash-input">
                <option value="http.rest">API REST Corporativa (http.rest)</option>
                <option value="http.webhook">Webhook de Eventos (http.webhook)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="dash-label">Nome Amigável da Conexão *</label>
              <input
                type="text"
                [(ngModel)]="newConnName"
                placeholder="Ex: API do ERP Financeiro"
                class="dash-input"
              />
            </div>

            <div class="form-group">
              <label class="dash-label">URL Base do Endpoint *</label>
              <input
                type="url"
                [(ngModel)]="newConnUrl"
                placeholder="https://api.empresa.com.br/v1"
                class="dash-input"
              />
            </div>

            <div class="form-group">
              <label class="dash-label">Método de Autenticação</label>
              <select [(ngModel)]="newConnAuth" class="dash-input">
                <option value="BEARER_TOKEN">Bearer Token (JWT / API Token)</option>
                <option value="API_KEY">Header API Key (X-Api-Key)</option>
                <option value="NONE">Sem Autenticação Direta</option>
              </select>
            </div>

            <div class="form-group" *ngIf="newConnAuth !== 'NONE'">
              <label class="dash-label">Token / Segredo (Criptografado no envio)</label>
              <input
                type="password"
                [(ngModel)]="newConnSecret"
                placeholder="Insira o token seguro..."
                class="dash-input"
              />
              <span class="input-hint">O segredo será cifrado e nunca mais será exibido após gravação.</span>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" (click)="isModalOpen.set(false)">Cancelar</button>
            <button class="btn btn-primary btn-sm" (click)="saveNewConnection()" [disabled]="!newConnName">
              Salvar Conexão
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .integrations-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .header-titles {
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

    .tabs-header {
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

    .tab-btn:hover {
      color: #FFFFFF;
    }

    .tab-btn.active {
      background: linear-gradient(135deg, rgba(109, 0, 255, 0.8) 0%, rgba(139, 61, 255, 0.7) 100%);
      color: #FFFFFF;
    }

    /* Grid de Ferramentas */
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 20px;
    }

    @media (max-width: 600px) {
      .tools-grid {
        grid-template-columns: 1fr;
      }
    }

    .tool-item-card {
      padding: 22px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
    }

    .tic-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .tic-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: rgba(109, 0, 255, 0.2);
      border: 1px solid rgba(168, 85, 247, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #C084FC;
    }

    .tic-badges {
      display: flex;
      gap: 6px;
    }

    .tic-name {
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .tic-key {
      font-size: 11.5px;
      color: var(--light-purple);
      font-family: var(--font-mono);
      display: block;
      margin: 4px 0 8px;
    }

    .tic-desc {
      font-size: 12.5px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .tic-schema-box {
      padding: 10px;
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .tsb-label {
      font-size: 10.5px;
      color: var(--text-muted);
    }

    .tsb-code {
      font-size: 11px;
      color: #C084FC;
      font-family: var(--font-mono);
    }

    .tic-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 10px;
    }

    .tic-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      color: var(--text-secondary);
    }

    .dot-green {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #4ADE80;
    }

    /* Conexões */
    .connections-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .conn-card {
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .conn-top {
      display: flex;
      align-items: center;
      gap: 18px;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .conn-icon-pill {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(109, 0, 255, 0.18);
      border: 1px solid rgba(168, 85, 247, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #C084FC;
      flex-shrink: 0;
    }

    .conn-meta-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .conn-title-line {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .conn-name {
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .conn-url {
      font-size: 12px;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }

    .security-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(34, 197, 94, 0.08);
      border: 1px solid rgba(34, 197, 94, 0.2);
      font-size: 11.5px;
    }

    .sb-left {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #4ADE80;
      font-weight: 500;
    }

    .sb-auth-type {
      font-family: var(--font-mono);
      color: var(--text-muted);
      font-size: 10.5px;
    }

    .security-info-box {
      padding: 20px 24px;
      display: flex;
      align-items: flex-start;
      gap: 16px;
      border-color: rgba(168, 85, 247, 0.25);
    }

    .sib-icon {
      margin-top: 2px;
    }

    .sib-content h4 {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 4px;
    }

    .sib-content p {
      font-size: 12.5px;
      color: var(--text-secondary);
      line-height: 1.5;
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
      max-width: 520px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
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

    .input-hint {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 4px;
    }
  `]
})
export class IntegrationsComponent {
  activeTab = signal<'NATIVE' | 'CONNECTIONS'>('NATIVE');
  isTesting = signal<boolean>(false);

  isModalOpen = signal<boolean>(false);
  newConnKey: string = 'http.rest';
  newConnName: string = '';
  newConnUrl: string = '';
  newConnAuth: 'BEARER_TOKEN' | 'API_KEY' | 'NONE' = 'BEARER_TOKEN';
  newConnSecret: string = '';

  constructor(public state: DashboardStateService) {}

  get nativeTools(): ToolDefinition[] {
    return this.state.toolDefinitions().filter(t => t.implementationType === 'NATIVE');
  }

  formatConnectionStatus(status: ConnectionStatus): string {
    switch (status) {
      case 'CONNECTED': return 'Conectado';
      case 'PENDING_VALIDATION': return 'Pendente de Validação';
      case 'ERROR': return 'Erro de Autenticação';
      case 'REVOKED': return 'Revogado';
      default: return status;
    }
  }

  getConnectionStatusClass(status: ConnectionStatus): string {
    switch (status) {
      case 'CONNECTED': return 'dash-badge-green';
      case 'PENDING_VALIDATION': return 'dash-badge-amber';
      case 'ERROR': return 'dash-badge-red';
      default: return 'dash-badge-neutral';
    }
  }

  async testConnection(conn: IntegrationConnection): Promise<void> {
    this.isTesting.set(true);
    await new Promise(r => setTimeout(r, 600));
    this.isTesting.set(false);
  }

  openConnectModal(): void {
    this.newConnKey = 'http.rest';
    this.newConnName = '';
    this.newConnUrl = '';
    this.newConnAuth = 'BEARER_TOKEN';
    this.newConnSecret = '';
    this.isModalOpen.set(true);
  }

  saveNewConnection(): void {
    if (!this.newConnName) return;
    this.state.createConnection({
      name: this.newConnName,
      integrationKey: this.newConnKey,
      baseUrl: this.newConnUrl,
      authType: this.newConnAuth
    });
    this.isModalOpen.set(false);
  }
}
