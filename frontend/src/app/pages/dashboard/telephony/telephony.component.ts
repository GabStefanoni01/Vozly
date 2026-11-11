import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { PhoneNumber } from '../../../models/dashboard.models';

@Component({
  selector: 'app-telephony',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="telephony-page">
      <!-- Cabeçalho -->
      <header class="page-header">
        <div class="header-titles">
          <div class="badge-title">
            <span class="badge-dot"></span>
            <span>RECURSOS TELEFÔNICOS & ENCAMINHAMENTO (DOCS/05)</span>
          </div>
          <h1 class="page-title">Linhas Telefônicas & Roteamento SIP</h1>
          <p class="page-subtitle">
            Gerencie seus números telefônicos conectados, rotas de entrada, horários de atendimento e regras de transbordo.
          </p>
        </div>

        <button class="btn btn-primary btn-sm" (click)="openAddNumberModal()">
          <app-icon name="plus" [size]="16"></app-icon>
          <span>Conectar Linha</span>
        </button>
      </header>

      <!-- Status dos Troncos e Disponibilidade -->
      <section class="telephony-stats-grid">
        <div class="dash-glass-card stat-item">
          <div class="si-icon purple">
            <app-icon name="phone" [size]="18"></app-icon>
          </div>
          <div class="si-meta">
            <span class="si-label">Linhas Ativas</span>
            <span class="si-value">{{ activeLines() }} / {{ state.phoneNumbers().length }}</span>
          </div>
        </div>

        <div class="dash-glass-card stat-item">
          <div class="si-icon green">
            <app-icon name="wifi" [size]="18"></app-icon>
          </div>
          <div class="si-meta">
            <span class="si-label">Tronco SIP Nacional</span>
            <span class="si-value">Não configurado</span>
          </div>
        </div>

        <div class="dash-glass-card stat-item">
          <div class="si-icon blue">
            <app-icon name="phone-forwarded" [size]="18"></app-icon>
          </div>
          <div class="si-meta">
            <span class="si-label">Destino de Transbordo</span>
            <span class="si-value">Não configurado</span>
          </div>
        </div>
      </section>

      <!-- Lista de Números Telefônicos -->
      <section class="numbers-list-section">
        <div class="numbers-card dash-glass-card" *ngFor="let phone of state.phoneNumbers()">
          <div class="nc-main-col">
            <div class="nc-top-line">
              <span class="nc-number">{{ phone.formatted }}</span>
              <span class="dash-badge" [ngClass]="phone.status === 'ACTIVE' ? 'dash-badge-green' : 'dash-badge-amber'">
                {{ phone.status === 'ACTIVE' ? 'Ativo & Operacional' : 'Aguardando Provisionamento' }}
              </span>
            </div>

            <div class="nc-details-grid">
              <div class="nc-detail-item">
                <span class="ncd-label">Provedor Telefônico:</span>
                <span class="ncd-val">{{ phone.provider }}</span>
              </div>
              <div class="nc-detail-item">
                <span class="ncd-label">Agente Vinculado:</span>
                <span class="ncd-val highlight">{{ phone.assignedAgentName || 'Nenhum agente vinculado' }}</span>
              </div>
              <div class="nc-detail-item">
                <span class="ncd-label">Horário de Operação:</span>
                <span class="ncd-val">{{ phone.routingConfig.businessHours }}</span>
              </div>
              <div class="nc-detail-item">
                <span class="ncd-label">Número de Fallback:</span>
                <span class="ncd-val">{{ phone.routingConfig.fallbackDestination || 'Não configurado' }}</span>
              </div>
            </div>
          </div>

          <div class="nc-actions">
            <button class="btn btn-secondary btn-sm" (click)="editRouting(phone)">
              <app-icon name="settings" [size]="14"></app-icon>
              <span>Configurar Roteamento</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Informação Arquitetural -->
      <div class="info-card dash-glass-card">
        <app-icon name="info" [size]="18" color="#A855F7"></app-icon>
        <div class="info-text">
          <h4>Arquitetura de Telefonia e Runtime de Voz (docs/10)</h4>
          <p>
            O runtime de voz recebe chamadas dos provedores telefônicos autorizados, resolve o tenant pelo vínculo seguro do número e encaminha o áudio para o pipeline de reconhecimento e orquestração. Nenhuma chamada de cliente cruza dados entre tenants.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .telephony-page {
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

    .telephony-stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    @media (max-width: 768px) {
      .telephony-stats-grid {
        grid-template-columns: 1fr;
      }
    }

    .stat-item {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .si-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .si-icon.purple { background: rgba(109, 0, 255, 0.2); color: #C084FC; }
    .si-icon.green { background: rgba(34, 197, 94, 0.2); color: #4ADE80; }
    .si-icon.blue { background: rgba(56, 189, 248, 0.2); color: #38BDF8; }

    .si-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .si-label {
      font-size: 11.5px;
      color: var(--text-muted);
    }

    .si-value {
      font-size: 15px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .si-value.green { color: #4ADE80; }

    .numbers-list-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .numbers-card {
      padding: 22px 26px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 20px;
    }

    .nc-main-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .nc-top-line {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .nc-number {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      font-family: var(--font-display);
      letter-spacing: -0.01em;
    }

    .nc-details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px 24px;
    }

    @media (max-width: 600px) {
      .nc-details-grid {
        grid-template-columns: 1fr;
      }
    }

    .nc-detail-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12.5px;
    }

    .ncd-label {
      color: var(--text-muted);
    }

    .ncd-val {
      color: #FFFFFF;
      font-weight: 500;
    }

    .ncd-val.highlight {
      color: var(--light-purple);
      font-weight: 600;
    }

    .info-card {
      padding: 18px 22px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .info-text h4 {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 4px;
    }

    .info-text p {
      font-size: 12.5px;
      color: var(--text-secondary);
      line-height: 1.5;
    }
  `]
})
export class TelephonyComponent {
  readonly activeLines = computed(() => this.state.phoneNumbers().filter(n => n.status === 'ACTIVE').length);
  constructor(public state: DashboardStateService) {}

  openAddNumberModal(): void {
    // Interação demonstrativa
  }

  editRouting(phone: PhoneNumber): void {
    // Interação demonstrativa
  }
}
