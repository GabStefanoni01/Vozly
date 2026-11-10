import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChartDataPoint {
  label: string;
  value: number;
  highlight?: boolean;
}

@Component({
  selector: 'app-dashboard-activity-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dash-glass-card chart-card">
      <!-- Cabeçalho do Painel Gráfico -->
      <div class="chart-header">
        <div class="chart-title-wrap">
          <h3 class="chart-title">Atividade de Chamadas</h3>
          <p class="chart-subtitle">Volume diário de interações telefônicas atendidas pela IA</p>
        </div>

        <!-- Seletor de Período -->
        <div class="time-filter-pills">
          <button
            class="filter-pill"
            [class.active]="selectedPeriod() === 'today'"
            (click)="selectPeriod('today')"
          >
            Hoje
          </button>
          <button
            class="filter-pill"
            [class.active]="selectedPeriod() === 'week'"
            (click)="selectPeriod('week')"
          >
            Esta Semana
          </button>
          <button
            class="filter-pill"
            [class.active]="selectedPeriod() === 'month'"
            (click)="selectPeriod('month')"
          >
            Este Mês
          </button>
        </div>
      </div>

      <!-- Área do Gráfico SVG Vetorial -->
      <div class="chart-canvas-wrapper" (mouseleave)="clearHover()">
        <svg
          viewBox="0 0 680 260"
          class="chart-svg"
          preserveAspectRatio="none"
          (mousemove)="onChartMouseMove($event)"
        >
          <defs>
            <!-- Gradiente de Preenchimento da Curva Violeta -->
            <linearGradient id="chartAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#8B3DFF" stop-opacity="0.65" />
              <stop offset="45%" stop-color="#6D00FF" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#15151B" stop-opacity="0.0" />
            </linearGradient>

            <!-- Filtro de Neon Glow na Linha Principal -->
            <filter id="neonGlowLine" x="-10%" y="-10%" width="120%" height="130%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- Linhas de Grade Horizontais e Ticks no Eixo Y -->
          <g class="grid-lines" stroke="rgba(255, 255, 255, 0.05)" stroke-dasharray="4 4">
            <line x1="45" y1="30" x2="660" y2="30" />
            <text x="35" y="34" class="axis-label" text-anchor="end">300</text>

            <line x1="45" y1="90" x2="660" y2="90" />
            <text x="35" y="94" class="axis-label" text-anchor="end">200</text>

            <line x1="45" y1="150" x2="660" y2="150" />
            <text x="35" y="154" class="axis-label" text-anchor="end">100</text>

            <line x1="45" y1="210" x2="660" y2="210" stroke="rgba(255, 255, 255, 0.12)" stroke-dasharray="none" />
            <text x="35" y="214" class="axis-label" text-anchor="end">0</text>
          </g>

          <!-- Área Preenchida com Gradiente Roxo -->
          <path [attr.d]="areaPath" fill="url(#chartAreaGradient)" />

          <!-- Linha Spline Suave Contínua -->
          <path
            [attr.d]="linePath"
            fill="none"
            stroke="#C084FC"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            filter="url(#neonGlowLine)"
          />

          <!-- Linha Vertical Indicadora de Hover -->
          <line
            *ngIf="hoveredIndex() !== null"
            [attr.x1]="points[hoveredIndex()!].x"
            y1="30"
            [attr.x2]="points[hoveredIndex()!].x"
            y2="210"
            stroke="rgba(168, 85, 247, 0.45)"
            stroke-width="1.5"
            stroke-dasharray="3 3"
          />

          <!-- Pontos Interativos com Pulso Glow -->
          <g *ngFor="let p of points; let i = index">
            <!-- Ponto de Destaque -->
            <circle
              [attr.cx]="p.x"
              [attr.cy]="p.y"
              [attr.r]="hoveredIndex() === i || p.highlight ? 7 : 4.5"
              [attr.fill]="hoveredIndex() === i || p.highlight ? '#FFFFFF' : '#8B3DFF'"
              stroke="#6D00FF"
              stroke-width="3"
              class="point-circle"
            />

            <!-- Pílula Flutuante de Destaque (Conforme "245 Hoje" da Imagem 02) -->
            <g *ngIf="(p.highlight && hoveredIndex() === null) || hoveredIndex() === i">
              <!-- Balão de Tooltip -->
              <rect
                [attr.x]="p.x - 42"
                [attr.y]="p.y - 48"
                width="84"
                height="38"
                rx="10"
                fill="#181524"
                stroke="#A855F7"
                stroke-width="1.5"
                filter="drop-shadow(0 4px 14px rgba(109, 0, 255, 0.45))"
              />
              <text
                [attr.x]="p.x"
                [attr.y]="p.y - 30"
                fill="#FFFFFF"
                font-size="13"
                font-weight="700"
                text-anchor="middle"
                font-family="var(--font-display)"
              >
                {{ p.value }}
              </text>
              <text
                [attr.x]="p.x"
                [attr.y]="p.y - 17"
                fill="#C084FC"
                font-size="10"
                font-weight="500"
                text-anchor="middle"
              >
                {{ p.label }}
              </text>
            </g>

            <!-- Ticks do Eixo X -->
            <text [attr.x]="p.x" y="235" class="axis-label x-axis" text-anchor="middle">
              {{ p.label }}
            </text>
          </g>
        </svg>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .chart-card {
      padding: 24px 28px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
    }

    .chart-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .chart-title-wrap {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .chart-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #FFFFFF;
    }

    .chart-subtitle {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .time-filter-pills {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 4px;
    }

    .filter-pill {
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 12.5px;
      font-weight: 500;
      color: var(--text-secondary);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .filter-pill:hover {
      color: #FFFFFF;
    }

    .filter-pill.active {
      background: linear-gradient(135deg, rgba(109, 0, 255, 0.8) 0%, rgba(139, 61, 255, 0.7) 100%);
      color: #FFFFFF;
      font-weight: 600;
      box-shadow: 0 2px 10px rgba(109, 0, 255, 0.35);
    }

    .chart-canvas-wrapper {
      width: 100%;
      height: 250px;
      position: relative;
    }

    .chart-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
      cursor: crosshair;
    }

    .axis-label {
      font-size: 11px;
      fill: var(--text-muted);
      font-family: var(--font-sans);
    }

    .axis-label.x-axis {
      fill: var(--text-secondary);
      font-weight: 500;
    }

    .point-circle {
      transition: r 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `]
})
export class DashboardActivityChartComponent {
  selectedPeriod = signal<'today' | 'week' | 'month'>('week');
  hoveredIndex = signal<number | null>(null);

  // Dados para os períodos
  private readonly weekData: ChartDataPoint[] = [
    { label: 'Seg', value: 110 },
    { label: 'Ter', value: 135 },
    { label: 'Qua', value: 180 },
    { label: 'Qui', value: 205 },
    { label: 'Sex', value: 245, highlight: true },
    { label: 'Sáb', value: 165 },
    { label: 'Dom', value: 95 }
  ];

  private readonly todayData: ChartDataPoint[] = [
    { label: '08h', value: 18 },
    { label: '10h', value: 45 },
    { label: '12h', value: 72 },
    { label: '14h', value: 88 },
    { label: '16h', value: 110, highlight: true },
    { label: '18h', value: 92 },
    { label: '20h', value: 35 }
  ];

  private readonly monthData: ChartDataPoint[] = [
    { label: 'Sem 1', value: 680 },
    { label: 'Sem 2', value: 820 },
    { label: 'Sem 3', value: 940, highlight: true },
    { label: 'Sem 4', value: 890 }
  ];

  get currentData(): ChartDataPoint[] {
    switch (this.selectedPeriod()) {
      case 'today':
        return this.todayData;
      case 'month':
        return this.monthData;
      case 'week':
      default:
        return this.weekData;
    }
  }

  get points(): { x: number; y: number; label: string; value: number; highlight?: boolean }[] {
    const data = this.currentData;
    const startX = 60;
    const endX = 640;
    const minY = 30;
    const maxY = 210;
    const maxVal = Math.max(...data.map(d => d.value), 300);

    return data.map((d, index) => {
      const x = startX + (index / (data.length - 1)) * (endX - startX);
      const y = maxY - (d.value / maxVal) * (maxY - minY);
      return { x, y, label: d.label, value: d.value, highlight: d.highlight };
    });
  }

  get linePath(): string {
    const pts = this.points;
    if (pts.length < 2) return '';

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }

  get areaPath(): string {
    const line = this.linePath;
    if (!line) return '';
    const pts = this.points;
    const firstX = pts[0].x;
    const lastX = pts[pts.length - 1].x;
    return `${line} L ${lastX} 210 L ${firstX} 210 Z`;
  }

  selectPeriod(period: 'today' | 'week' | 'month'): void {
    this.selectedPeriod.set(period);
    this.hoveredIndex.set(null);
  }

  onChartMouseMove(event: MouseEvent): void {
    const svg = event.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const svgX = ((event.clientX - rect.left) / rect.width) * 680;

    let closestIdx = 0;
    let minDistance = Infinity;

    this.points.forEach((p, idx) => {
      const dist = Math.abs(p.x - svgX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    if (minDistance < 60) {
      this.hoveredIndex.set(closestIdx);
    } else {
      this.hoveredIndex.set(null);
    }
  }

  clearHover(): void {
    this.hoveredIndex.set(null);
  }
}
