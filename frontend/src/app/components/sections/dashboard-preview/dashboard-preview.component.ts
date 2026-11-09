import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface CallRecord {
  time: string;
  caller: string;
  intent: string;
  segment: string;
  status: 'Agendada' | 'Em Triagem' | 'Encaminhada' | 'Finalizada';
}

@Component({
  selector: 'app-dashboard-preview',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="section dashboard-preview-section" id="painel">
      <div class="ambient-glow glow-violet dash-glow"></div>

      <div class="container">
        <!-- Cabeçalho -->
        <div class="section-header">
          <h2 class="section-title">
            Sua operação, em uma<br>
            <span class="gradient-text">visão mais organizada.</span>
          </h2>
          <p class="section-subtitle">
            Uma interface centralizada para acompanhar as interações e organizar o fluxo de atendimento da sua empresa em tempo real.
          </p>
        </div>

        <!-- Mockup do Painel de Controle -->
        <div class="dashboard-window">
          <!-- Top Bar da Janela do Software -->
          <div class="dash-window-header">
            <div class="window-dots">
              <span class="w-dot red"></span>
              <span class="w-dot yellow"></span>
              <span class="w-dot green"></span>
            </div>
            <div class="window-title-badge">
              <span class="dot-active"></span>
              app.vozly.com.br — Painel de Controle Demonstrativo
            </div>
            <div class="window-right-meta">
              <span class="demo-badge-subtle">Interface Demonstrativa</span>
            </div>
          </div>

          <!-- Conteúdo Interno do Dashboard: Sidebar + Main Content -->
          <div class="dash-body">
            <!-- Sidebar Demonstrativa -->
            <aside class="dash-sidebar">
              <div class="sidebar-brand">
                <img src="brand/vozly-logo-horizontal.png" alt="Vozly" class="dash-brand-img">
              </div>

              <div class="sidebar-workspace">
                <div class="ws-avatar">AT</div>
                <div class="ws-info">
                  <div class="ws-name">EletroService Sul</div>
                  <div class="ws-plan">Workspace Ativo</div>
                </div>
              </div>

              <nav class="sidebar-nav">
                <a href="javascript:void(0)" class="dash-nav-item active">
                  <app-icon name="activity" [size]="16"></app-icon>
                  <span>Visão Geral</span>
                </a>
                <a href="javascript:void(0)" class="dash-nav-item">
                  <app-icon name="phone-call" [size]="16"></app-icon>
                  <span>Chamadas Telefônicas</span>
                  <span class="nav-count">3</span>
                </a>
                <a href="javascript:void(0)" class="dash-nav-item">
                  <app-icon name="layers" [size]="16"></app-icon>
                  <span>Solicitações</span>
                </a>
                <a href="javascript:void(0)" class="dash-nav-item">
                  <app-icon name="calendar" [size]="16"></app-icon>
                  <span>Agendamentos</span>
                </a>
                <a href="javascript:void(0)" class="dash-nav-item">
                  <app-icon name="sliders" [size]="16"></app-icon>
                  <span>Regras do Agente</span>
                </a>
              </nav>

              <div class="sidebar-agent-status">
                <div class="agent-pulse-box">
                  <span class="agent-dot"></span>
                  <span class="agent-text">Agente Ativo (Linha 0800)</span>
                </div>
              </div>
            </aside>

            <!-- Conteúdo Principal do Painel -->
            <main class="dash-main">
              <!-- Barra de Título Interna -->
              <div class="dash-inner-header">
                <div>
                  <h3 class="dash-view-title">Visão Geral das Chamadas</h3>
                  <p class="dash-view-sub">Fluxo consolidado das interações recebidas</p>
                </div>
                <div class="dash-date-picker">
                  <app-icon name="calendar" [size]="14"></app-icon>
                  <span>Hoje • Demonstração Operacional</span>
                </div>
              </div>

              <!-- Indicadores de Atividade (KPIs Demonstrativos) -->
              <div class="kpi-grid">
                <div class="kpi-card" *ngFor="let kpi of kpiList">
                  <div class="kpi-top">
                    <span class="kpi-label">{{ kpi.label }}</span>
                    <div class="kpi-icon-wrap">
                      <app-icon [name]="kpi.icon" [size]="16" color="#A855F7"></app-icon>
                    </div>
                  </div>
                  <div class="kpi-value-row">
                    <span class="kpi-number">{{ kpi.value }}</span>
                    <span class="kpi-tag">{{ kpi.statusNote }}</span>
                  </div>
                </div>
              </div>

              <!-- Gráfico de Volume de Chamadas por Horário (SVG Vetorial) -->
              <div class="chart-container-card">
                <div class="chart-header">
                  <div>
                    <h4 class="chart-title">Volume de Chamadas por Faixa de Horário</h4>
                    <span class="chart-sub">Distribuição demonstrativa de interações ao longo do dia</span>
                  </div>
                  <div class="chart-legend">
                    <span class="legend-dot"></span>
                    <span>Chamadas recebidas pela IA</span>
                  </div>
                </div>

                <div class="svg-chart-box">
                  <svg viewBox="0 0 700 160" preserveAspectRatio="none" class="chart-svg">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#8B3DFF" stop-opacity="0.45" />
                        <stop offset="100%" stop-color="#6D00FF" stop-opacity="0.0" />
                      </linearGradient>
                    </defs>

                    <!-- Linhas Guia Horizontais -->
                    <line x1="0" y1="40" x2="700" y2="40" stroke="#221F2B" stroke-dasharray="3 3"/>
                    <line x1="0" y1="90" x2="700" y2="90" stroke="#221F2B" stroke-dasharray="3 3"/>
                    <line x1="0" y1="140" x2="700" y2="140" stroke="#221F2B" stroke-dasharray="3 3"/>

                    <!-- Área Preenchida com Gradiente -->
                    <path
                      d="M0,130 C70,120 120,60 200,85 C280,110 340,30 420,40 C500,50 560,95 640,45 L700,55 L700,160 L0,160 Z"
                      fill="url(#chartGradient)"
                    />

                    <!-- Linha do Gráfico -->
                    <path
                      d="M0,130 C70,120 120,60 200,85 C280,110 340,30 420,40 C500,50 560,95 640,45 L700,55"
                      fill="none"
                      stroke="#A855F7"
                      stroke-width="3"
                    />

                    <!-- Pontos de Destaque -->
                    <circle cx="200" cy="85" r="4" fill="#FFFFFF" stroke="#8B3DFF" stroke-width="2"/>
                    <circle cx="420" cy="40" r="5" fill="#FFFFFF" stroke="#8B3DFF" stroke-width="3"/>
                    <circle cx="640" cy="45" r="4" fill="#FFFFFF" stroke="#8B3DFF" stroke-width="2"/>
                  </svg>

                  <div class="chart-x-labels">
                    <span>08:00</span>
                    <span>10:00</span>
                    <span>12:00</span>
                    <span>14:00</span>
                    <span>16:00</span>
                    <span>18:00 (Fora do Exp.)</span>
                    <span>20:00</span>
                    <span>22:00</span>
                  </div>
                </div>
              </div>

              <!-- Tabela Demonstrativa de Chamadas Recentes -->
              <div class="recent-calls-card">
                <div class="table-header-row">
                  <h4 class="table-title">Chamadas Recentes e Solicitações Organizadas</h4>
                  <span class="table-counter">4 registros demonstrativos</span>
                </div>

                <div class="table-responsive">
                  <table class="dash-table">
                    <thead>
                      <tr>
                        <th>Horário</th>
                        <th>Interlocutor</th>
                        <th>Motivo / Solicitação</th>
                        <th>Segmento</th>
                        <th>Status Operacional</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let row of callRecords">
                        <td class="col-time">{{ row.time }}</td>
                        <td class="col-caller">{{ row.caller }}</td>
                        <td class="col-intent">{{ row.intent }}</td>
                        <td class="col-segment">{{ row.segment }}</td>
                        <td>
                          <span class="status-badge-table" [ngClass]="row.status.toLowerCase().replace(' ', '-')">
                            {{ row.status }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .dashboard-preview-section {
      position: relative;
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
    }

    .dash-glow {
      top: 35%;
      left: 50%;
      transform: translateX(-50%);
      width: 750px;
      height: 500px;
      opacity: 0.18;
    }

    /* Janela de Software SaaS */
    .dashboard-window {
      background: var(--bg-primary);
      border: 1px solid rgba(139, 61, 255, 0.3);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9), 0 0 35px rgba(109, 0, 255, 0.15);
      position: relative;
      z-index: 1;
    }

    /* Top Bar da Janela */
    .dash-window-header {
      background: #111117;
      padding: 12px 20px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .window-dots {
      display: flex;
      gap: 6px;
    }

    .w-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .w-dot.red { background: #EF4444; }
    .w-dot.yellow { background: #F59E0B; }
    .w-dot.green { background: #10B981; }

    .window-title-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.03);
      padding: 3px 12px;
      border-radius: 4px;
      border: 1px solid var(--border-subtle);
    }

    .dot-active {
      width: 6px;
      height: 6px;
      background: var(--light-purple);
      border-radius: 50%;
    }

    .demo-badge-subtle {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Layout Interno */
    .dash-body {
      display: grid;
      grid-template-columns: 1fr;
    }

    @media (min-width: 900px) {
      .dash-body {
        grid-template-columns: 240px 1fr;
      }
    }

    /* Sidebar */
    .dash-sidebar {
      background: #0E0E14;
      border-right: 1px solid var(--border-subtle);
      padding: 24px 16px;
      display: none;
      flex-direction: column;
      gap: 24px;
    }

    @media (min-width: 900px) {
      .dash-sidebar {
        display: flex;
      }
    }

    .sidebar-brand {
      padding: 0 8px;
    }

    .dash-brand-img {
      height: 26px;
      width: auto;
      object-fit: contain;
    }

    .sidebar-workspace {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
    }

    .ws-avatar {
      width: 32px;
      height: 32px;
      background: var(--gradient-primary);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 12px;
      color: #fff;
    }

    .ws-name {
      font-size: 12px;
      font-weight: 600;
      color: #fff;
    }

    .ws-plan {
      font-size: 10px;
      color: var(--text-muted);
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .dash-nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
      text-decoration: none;
    }

    .dash-nav-item:hover {
      background: rgba(255, 255, 255, 0.04);
      color: #fff;
    }

    .dash-nav-item.active {
      background: rgba(109, 0, 255, 0.15);
      color: var(--light-purple);
      border: 1px solid rgba(168, 85, 247, 0.3);
    }

    .nav-count {
      margin-left: auto;
      font-size: 10px;
      font-family: var(--font-mono);
      background: rgba(109, 0, 255, 0.3);
      padding: 2px 6px;
      border-radius: 4px;
      color: #fff;
    }

    .sidebar-agent-status {
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid var(--border-subtle);
    }

    .agent-pulse-box {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--text-muted);
    }

    .agent-dot {
      width: 7px;
      height: 7px;
      background: var(--status-green);
      border-radius: 50%;
      box-shadow: 0 0 6px var(--status-green);
    }

    /* Área Principal */
    .dash-main {
      padding: 28px;
      background: var(--bg-primary);
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .dash-inner-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .dash-view-title {
      font-size: 20px;
      font-weight: 700;
      color: #fff;
    }

    .dash-view-sub {
      font-size: 13px;
      color: var(--text-muted);
    }

    .dash-date-picker {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      padding: 6px 12px;
      border-radius: var(--radius-sm);
    }

    /* KPIs */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    @media (min-width: 768px) {
      .kpi-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .kpi-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 16px;
    }

    .kpi-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .kpi-label {
      font-size: 12px;
      color: var(--text-muted);
    }

    .kpi-icon-wrap {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: rgba(109, 0, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .kpi-value-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }

    .kpi-number {
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .kpi-tag {
      font-size: 11px;
      color: var(--light-purple);
    }

    /* Gráfico */
    .chart-container-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 20px;
    }

    .chart-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .chart-title {
      font-size: 15px;
      font-weight: 600;
      color: #fff;
    }

    .chart-sub {
      font-size: 12px;
      color: var(--text-muted);
    }

    .chart-legend {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--light-purple);
    }

    .svg-chart-box {
      width: 100%;
    }

    .chart-svg {
      width: 100%;
      height: 140px;
      display: block;
    }

    .chart-x-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--text-muted);
    }

    /* Tabela */
    .recent-calls-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 20px;
    }

    .table-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .table-title {
      font-size: 15px;
      font-weight: 600;
      color: #fff;
    }

    .table-counter {
      font-size: 11px;
      color: var(--text-muted);
    }

    .table-responsive {
      overflow-x: auto;
    }

    .dash-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }

    .dash-table th {
      padding: 10px 12px;
      color: var(--text-muted);
      font-weight: 500;
      border-bottom: 1px solid var(--border-subtle);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .dash-table td {
      padding: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.02);
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .col-time {
      font-family: var(--font-mono);
      color: var(--text-muted);
      font-size: 12px;
    }

    .col-caller {
      font-weight: 600;
      color: #fff;
    }

    .col-intent {
      color: #E4E4E7;
    }

    .status-badge-table {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .status-badge-table.agendada {
      background: rgba(34, 197, 94, 0.15);
      color: var(--status-green);
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .status-badge-table.em-triagem {
      background: rgba(245, 158, 11, 0.15);
      color: #FBBF24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .status-badge-table.encaminhada {
      background: rgba(168, 85, 247, 0.15);
      color: var(--light-purple);
      border: 1px solid rgba(168, 85, 247, 0.3);
    }

    .status-badge-table.finalizada {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
      border: 1px solid var(--border-subtle);
    }
  `]
})
export class DashboardPreviewComponent {
  kpiList = [
    {
      label: 'Chamadas recebidas',
      value: '24',
      icon: 'phone-incoming',
      statusNote: 'Hoje'
    },
    {
      label: 'Atendimentos em andamento',
      value: '2',
      icon: 'activity',
      statusNote: 'Linhas ativas'
    },
    {
      label: 'Solicitações registradas',
      value: '19',
      icon: 'layers',
      statusNote: 'Fichas salvas'
    },
    {
      label: 'Agendamentos solicitados',
      value: '11',
      icon: 'calendar',
      statusNote: 'Prontos p/ confirmação'
    }
  ];

  callRecords: CallRecord[] = [
    {
      time: '14:20',
      caller: 'Ligação Externa (011)',
      intent: 'Ruído centrífuga Brastemp 12kg',
      segment: 'Assistência Técnica',
      status: 'Agendada'
    },
    {
      time: '14:05',
      caller: 'Ligação Externa (019)',
      intent: 'Dúvida horário de atendimento',
      segment: 'Clínica Médica',
      status: 'Finalizada'
    },
    {
      time: '13:48',
      caller: 'Ligação Externa (021)',
      intent: 'Avaliação barulho freio sedan',
      segment: 'Oficina Mecânica',
      status: 'Encaminhada'
    },
    {
      time: '13:30',
      caller: 'Ligação Externa (031)',
      intent: 'Solicitação de visita predial',
      segment: 'Manutenção',
      status: 'Em Triagem'
    }
  ];
}
