import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStatCardComponent } from '../../../components/dashboard/dashboard-stat-card/dashboard-stat-card.component';
import { DashboardActivityChartComponent } from '../../../components/dashboard/dashboard-activity-chart/dashboard-activity-chart.component';
import { DashboardRecentCallsComponent } from '../../../components/dashboard/dashboard-recent-calls/dashboard-recent-calls.component';
import { DashboardTelephonyMapComponent } from '../../../components/dashboard/dashboard-telephony-map/dashboard-telephony-map.component';
import { DashboardPerformanceDonutComponent } from '../../../components/dashboard/dashboard-performance-donut/dashboard-performance-donut.component';
import { DashboardSystemStatusComponent } from '../../../components/dashboard/dashboard-system-status/dashboard-system-status.component';
import { DashboardQuickActionsComponent } from '../../../components/dashboard/dashboard-quick-actions/dashboard-quick-actions.component';
import { VoiceTestModalComponent } from '../../../components/dashboard/voice-test-modal/voice-test-modal.component';
import { CallDetailsModalComponent } from '../../../components/dashboard/call-details-modal/call-details-modal.component';
import { DashboardStateService } from '../../../services/dashboard-state.service';
import { Agent, Call } from '../../../models/dashboard.models';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    DashboardStatCardComponent,
    DashboardActivityChartComponent,
    DashboardRecentCallsComponent,
    DashboardTelephonyMapComponent,
    DashboardPerformanceDonutComponent,
    DashboardSystemStatusComponent,
    DashboardQuickActionsComponent,
    VoiceTestModalComponent,
    CallDetailsModalComponent
  ],
  template: `
    <div class="overview-shell">
      <!-- 5.1. SAUDAÇÃO E CONTEXTO (Conforme Imagem 02 de Referência) -->
      <section class="overview-hero">
        <div class="hero-left">
          <h1 class="hero-greeting">
            Bom dia, {{ state.currentUser().name.split(' ')[0] }} <span class="wave-hand">👋</span>
          </h1>
          <p class="hero-subtitle">
            Aqui está o status operacional da sua central de voz inteligente hoje.
          </p>
        </div>

        <div class="hero-right">
          <!-- Pílula de Workspace Ativo e Status de IA -->
          <div class="hero-status-pill">
            <span class="hero-live-dot"></span>
            <span class="hero-status-text">Central de Voz Conectada</span>
            <span class="hero-agent-active">Agente Helena Ativo (v2.0)</span>
          </div>
        </div>
      </section>

      <!-- 5.2. CARDS DE INDICADORES (4 Colunas com Sparkline e Cores da Imagem 02) -->
      <section class="metrics-grid">
        <app-dashboard-stat-card
          label="Total de Chamadas"
          value="1.284"
          trendText="+12.5% em relação ao mês anterior"
          [isTrendPositive]="true"
          iconName="phone"
          iconVariant="purple"
          [sparklineData]="[30, 45, 40, 60, 55, 75, 85, 98]"
        ></app-dashboard-stat-card>

        <app-dashboard-stat-card
          label="Em Andamento"
          value="642"
          trendText="+8.2% em relação ao mês anterior"
          [isTrendPositive]="true"
          iconName="phone-incoming"
          iconVariant="purple"
          [sparklineData]="[20, 28, 25, 38, 42, 50, 48, 62]"
        ></app-dashboard-stat-card>

        <app-dashboard-stat-card
          label="Atendimentos Concluídos"
          value="532"
          trendText="+15.3% em relação ao mês anterior"
          [isTrendPositive]="true"
          iconName="check-circle"
          iconVariant="purple"
          [sparklineData]="[15, 20, 28, 35, 45, 50, 58, 66]"
        ></app-dashboard-stat-card>

        <app-dashboard-stat-card
          label="Taxa de Resolução / SLA"
          value="98.6"
          unit="%"
          trendText="+2.7% em relação ao mês anterior"
          [isTrendPositive]="true"
          iconName="sparkles"
          iconVariant="purple"
          [sparklineData]="[92, 94, 93, 96, 95, 97, 98, 98.6]"
        ></app-dashboard-stat-card>
      </section>

      <!-- SEÇÃO PRINCIPAL 01: GRÁFICO DE ATIVIDADE & CHAMADAS RECENTES (Imagem 02) -->
      <section class="main-split-grid row-1">
        <div class="col-chart">
          <app-dashboard-activity-chart></app-dashboard-activity-chart>
        </div>
        <div class="col-recent">
          <app-dashboard-recent-calls
            [calls]="state.calls()"
            (selectCall)="onOpenCallDetails($event)"
          ></app-dashboard-recent-calls>
        </div>
      </section>

      <!-- SEÇÃO PRINCIPAL 02: MAPA DE CANAIS DE TELEFONIA & PERFORMANCE (Imagem 02) -->
      <section class="main-split-grid row-2">
        <div class="col-map">
          <app-dashboard-telephony-map></app-dashboard-telephony-map>
        </div>
        <div class="col-donut">
          <app-dashboard-performance-donut
            [averageScore]="state.averageResolutionRate()"
          ></app-dashboard-performance-donut>
        </div>
      </section>

      <!-- SEÇÃO PRINCIPAL 03: STATUS DOS SISTEMAS & AÇÕES RÁPIDAS COM CUBO 3D (Imagem 02) -->
      <section class="main-split-grid row-3">
        <div class="col-status">
          <app-dashboard-system-status></app-dashboard-system-status>
        </div>
        <div class="col-actions">
          <app-dashboard-quick-actions
            (openVoiceTest)="onOpenVoiceSimulator()"
          ></app-dashboard-quick-actions>
        </div>
      </section>
    </div>

    <!-- Modais de Interação Visual Local -->
    <app-voice-test-modal
      [isOpen]="isVoiceModalOpen()"
      [selectedAgent]="activeAgent()"
      (closeEvent)="onCloseVoiceSimulator()"
    ></app-voice-test-modal>

    <app-call-details-modal
      [isOpen]="isCallModalOpen()"
      [call]="inspectedCall()"
      (closeEvent)="onCloseCallDetails()"
    ></app-call-details-modal>
  `,
  styles: [`
    .overview-shell {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    /* Saudação e Cabeçalho */
    .overview-hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .hero-greeting {
      font-size: 28px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.03em;
      line-height: 1.2;
    }

    .wave-hand {
      display: inline-block;
      animation: waveHand 2.5s infinite;
      transform-origin: 70% 70%;
    }

    @keyframes waveHand {
      0%, 100% { transform: rotate(0deg); }
      20% { transform: rotate(14deg); }
      40% { transform: rotate(-10deg); }
      60% { transform: rotate(14deg); }
      80% { transform: rotate(-4deg); }
    }

    .hero-subtitle {
      font-size: 14px;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .hero-status-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      border-radius: 9999px;
      background: rgba(18, 16, 26, 0.8);
      border: 1px solid rgba(168, 85, 247, 0.25);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }

    .hero-live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4ADE80;
      box-shadow: 0 0 10px #4ADE80;
      animation: pulseGlow 2s infinite;
    }

    .hero-status-text {
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .hero-agent-active {
      font-size: 11.5px;
      color: var(--light-purple);
      padding-left: 10px;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Grid de Métricas */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    @media (max-width: 1200px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Grids das Linhas Principais */
    .main-split-grid {
      display: grid;
      gap: 20px;
    }

    .main-split-grid.row-1 {
      grid-template-columns: 7fr 5fr;
    }

    .main-split-grid.row-2 {
      grid-template-columns: 6.5fr 5.5fr;
    }

    .main-split-grid.row-3 {
      grid-template-columns: 4fr 8fr;
    }

    @media (max-width: 1080px) {
      .main-split-grid.row-1,
      .main-split-grid.row-2,
      .main-split-grid.row-3 {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OverviewComponent {
  isVoiceModalOpen = signal<boolean>(false);
  isCallModalOpen = signal<boolean>(false);
  inspectedCall = signal<Call | null>(null);

  constructor(public state: DashboardStateService) {}

  activeAgent(): Agent {
    return this.state.agents().find(a => a.status === 'ACTIVE') || this.state.agents()[0];
  }

  onOpenVoiceSimulator(): void {
    this.isVoiceModalOpen.set(true);
  }

  onCloseVoiceSimulator(): void {
    this.isVoiceModalOpen.set(false);
  }

  onOpenCallDetails(call: Call): void {
    this.inspectedCall.set(call);
    this.isCallModalOpen.set(true);
  }

  onCloseCallDetails(): void {
    this.isCallModalOpen.set(false);
  }
}
