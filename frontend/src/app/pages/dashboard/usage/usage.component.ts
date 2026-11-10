import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStateService } from '../../../services/dashboard-state.service';

@Component({
  selector: 'app-usage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="usage-page">
      <!-- Cabeçalho -->
      <header class="page-header">
        <div class="header-titles">
          <div class="badge-title">
            <span class="badge-dot"></span>
            <span>OBSERVABILIDADE OPERACIONAL & METRICS (DOCS/08)</span>
          </div>
          <h1 class="page-title">Utilização & Consumo da Plataforma</h1>
          <p class="page-subtitle">
            Acompanhe o consumo mensal de minutos neurais de voz, chamadas atendidas e pico de canais concorrentes.
          </p>
        </div>
      </header>

      <!-- Grade de Cards de Indicadores de Consumo -->
      <section class="usage-metrics-grid">
        <div class="dash-glass-card usage-card">
          <div class="uc-top">
            <span class="uc-label">Minutos de Voz Consumidos</span>
            <span class="dash-badge dash-badge-purple">Novembro 2026</span>
          </div>
          <div class="uc-val-row">
            <h3 class="uc-val">{{ state.usage().totalMinutesUsed }}</h3>
            <span class="uc-limit">/ {{ state.usage().monthlyMinutesLimit }} min</span>
          </div>

          <!-- Barra de Progresso com Gradiente Roxo -->
          <div class="usage-bar-track">
            <div
              class="usage-bar-fill"
              [style.width.%]="(state.usage().totalMinutesUsed / state.usage().monthlyMinutesLimit) * 100"
            ></div>
          </div>
          <span class="uc-sub">
            {{ ((state.usage().totalMinutesUsed / state.usage().monthlyMinutesLimit) * 100).toFixed(1) }}% da cota mensal demonstrativa utilizada
          </span>
        </div>

        <div class="dash-glass-card usage-card">
          <div class="uc-top">
            <span class="uc-label">Canais de Voz Concorrentes (Pico)</span>
            <span class="dash-badge dash-badge-green">Capacidade Adequada</span>
          </div>
          <div class="uc-val-row">
            <h3 class="uc-val">{{ state.usage().concurrentPeakChannels }}</h3>
            <span class="uc-limit">/ {{ state.usage().concurrentChannelsLimit }} canais simultâneos</span>
          </div>

          <div class="usage-bar-track">
            <div
              class="usage-bar-fill green-gradient"
              [style.width.%]="(state.usage().concurrentPeakChannels / state.usage().concurrentChannelsLimit) * 100"
            ></div>
          </div>
          <span class="uc-sub">Pico registrado na Quinta-feira às 14h20</span>
        </div>

        <div class="dash-glass-card usage-card">
          <div class="uc-top">
            <span class="uc-label">Execuções de Ferramentas</span>
            <span class="dash-badge dash-badge-neutral">Catálogo</span>
          </div>
          <div class="uc-val-row">
            <h3 class="uc-val">{{ state.usage().toolExecutionsCount }}</h3>
            <span class="uc-limit">chamadas a tools</span>
          </div>
          <div class="usage-bar-track">
            <div class="usage-bar-fill blue-gradient" style="width: 62%;"></div>
          </div>
          <span class="uc-sub">99.4% das execuções concluídas com sucesso</span>
        </div>
      </section>

      <!-- Painel Gráfico de Consumo Diário -->
      <section class="daily-usage-card dash-glass-card">
        <div class="duc-header">
          <div>
            <h3 class="duc-title">Consumo Diário de Minutos Telefônicos</h3>
            <span class="duc-sub">Evolução do tempo de atendimento processado nos últimos 7 dias</span>
          </div>
          <span class="dash-badge dash-badge-neutral">Últimos 7 dias</span>
        </div>

        <div class="bars-chart-container">
          <div class="bar-col" *ngFor="let day of state.usage().dailyUsage">
            <div class="bar-track">
              <div class="bar-fill" [style.height.%]="(day.minutes / 700) * 100">
                <span class="bar-tooltip">{{ day.minutes }}m ({{ day.calls }} chamadas)</span>
              </div>
            </div>
            <span class="bar-label">{{ day.date }}</span>
          </div>
        </div>
      </section>

      <!-- Tabela de Detalhamento por Componente -->
      <section class="breakdown-card dash-glass-card">
        <h3 class="breakdown-title">Detalhamento por Agente de IA</h3>
        <table class="breakdown-table">
          <thead>
            <tr>
              <th>Agente</th>
              <th>Status</th>
              <th>Chamadas Atendidas</th>
              <th>Minutos Totais</th>
              <th>Duração Média</th>
              <th>Participação no Consumo</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let agent of state.agents()">
              <td>
                <span class="agent-table-name">{{ agent.name }}</span>
              </td>
              <td>
                <span class="dash-badge" [ngClass]="agent.status === 'ACTIVE' ? 'dash-badge-green' : 'dash-badge-amber'">
                  {{ agent.status === 'ACTIVE' ? 'Ativo' : 'Rascunho' }}
                </span>
              </td>
              <td>{{ agent.metrics.totalCalls }}</td>
              <td>{{ Math.round((agent.metrics.totalCalls * agent.metrics.avgDurationSeconds) / 60) }} min</td>
              <td>{{ agent.metrics.avgDurationSeconds }}s</td>
              <td>
                <div class="table-progress">
                  <div
                    class="table-progress-fill"
                    [style.width.%]="agent.metrics.totalCalls > 0 ? (agent.metrics.totalCalls / 1926) * 100 : 0"
                  ></div>
                  <span class="tp-text">
                    {{ agent.metrics.totalCalls > 0 ? ((agent.metrics.totalCalls / 1926) * 100).toFixed(0) : 0 }}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  `,
  styles: [`
    .usage-page {
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

    .usage-metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    @media (max-width: 900px) {
      .usage-metrics-grid {
        grid-template-columns: 1fr;
      }
    }

    .usage-card {
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .uc-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .uc-label {
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .uc-val-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .uc-val {
      font-size: 32px;
      font-weight: 700;
      color: #FFFFFF;
      font-family: var(--font-display);
      line-height: 1;
    }

    .uc-limit {
      font-size: 13px;
      color: var(--text-muted);
    }

    .usage-bar-track {
      height: 8px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.06);
      overflow: hidden;
      margin: 4px 0;
    }

    .usage-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #6D00FF 0%, #A855F7 100%);
      border-radius: 9999px;
    }

    .usage-bar-fill.green-gradient {
      background: linear-gradient(90deg, #16A34A 0%, #4ADE80 100%);
    }

    .usage-bar-fill.blue-gradient {
      background: linear-gradient(90deg, #0284C7 0%, #38BDF8 100%);
    }

    .uc-sub {
      font-size: 11.5px;
      color: var(--text-muted);
    }

    /* Gráfico de Barras */
    .daily-usage-card {
      padding: 24px 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .duc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .duc-title {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .duc-sub {
      font-size: 12.5px;
      color: var(--text-secondary);
    }

    .bars-chart-container {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 180px;
      padding: 20px 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      gap: 12px;
    }

    .bar-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: flex-end;
      gap: 10px;
    }

    .bar-track {
      width: 100%;
      max-width: 44px;
      height: 140px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      display: flex;
      align-items: flex-end;
      overflow: visible;
      position: relative;
    }

    .bar-fill {
      width: 100%;
      background: linear-gradient(180deg, #A855F7 0%, #6D00FF 100%);
      border-radius: 8px;
      transition: height 0.4s ease-out;
      position: relative;
      cursor: pointer;
    }

    .bar-fill:hover {
      box-shadow: 0 0 16px rgba(168, 85, 247, 0.5);
    }

    .bar-tooltip {
      position: absolute;
      top: -34px;
      left: 50%;
      transform: translateX(-50%);
      background: #181524;
      border: 1px solid #A855F7;
      color: #FFFFFF;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 6px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity var(--transition-fast);
      z-index: 10;
    }

    .bar-fill:hover .bar-tooltip {
      opacity: 1;
    }

    .bar-label {
      font-size: 11.5px;
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Tabela */
    .breakdown-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-x: auto;
    }

    .breakdown-title {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .breakdown-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }

    .breakdown-table th {
      padding: 12px 16px;
      color: var(--text-muted);
      font-size: 11.5px;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .breakdown-table td {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }

    .agent-table-name {
      font-weight: 600;
      color: #FFFFFF;
    }

    .table-progress {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 140px;
    }

    .table-progress-fill {
      height: 6px;
      border-radius: 9999px;
      background: #A855F7;
    }

    .tp-text {
      font-size: 11px;
      color: var(--text-muted);
    }
  `]
})
export class UsageComponent {
  Math = Math;
  constructor(public state: DashboardStateService) {}
}
