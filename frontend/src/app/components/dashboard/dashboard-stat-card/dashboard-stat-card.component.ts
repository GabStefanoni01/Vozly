import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-dashboard-stat-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="dash-glass-card stat-card" [class.highlighted]="isHighlight">
      <div class="card-glow-accent" aria-hidden="true"></div>

      <div class="stat-header">
        <div class="stat-icon-pill" [ngClass]="iconVariant">
          <app-icon [name]="iconName" [size]="20"></app-icon>
        </div>
        <span class="stat-trend" *ngIf="trendText" [class.trend-up]="isTrendPositive" [class.trend-down]="!isTrendPositive">
          <app-icon [name]="isTrendPositive ? 'trending-up' : 'trending-down'" [size]="14"></app-icon>
          <span>{{ trendText }}</span>
        </span>
      </div>

      <div class="stat-body">
        <span class="stat-label">{{ label }}</span>
        <div class="stat-value-row">
          <h3 class="stat-value">{{ value }}</h3>
          <span class="stat-unit" *ngIf="unit">{{ unit }}</span>
        </div>
        <p class="stat-subtext" *ngIf="subtext">{{ subtext }}</p>
      </div>

      <!-- Sparkline SVG com Curva Neon Violeta Brilhante (Conforme Imagem 02) -->
      <div class="sparkline-container" *ngIf="sparklineData && sparklineData.length > 0">
        <svg viewBox="0 0 160 40" class="sparkline-svg" preserveAspectRatio="none">
          <defs>
            <linearGradient [id]="'sparkGrad-' + cardId" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#A855F7" stop-opacity="0.45" />
              <stop offset="100%" stop-color="#6D00FF" stop-opacity="0.0" />
            </linearGradient>
            <filter [id]="'sparkGlow-' + cardId" x="-10%" y="-10%" width="120%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <!-- Área preenchida sob a curva -->
          <path [attr.d]="areaPath" [attr.fill]="'url(#sparkGrad-' + cardId + ')'" />

          <!-- Linha neon brilhante -->
          <path
            [attr.d]="linePath"
            fill="none"
            stroke="#C084FC"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            [attr.filter]="'url(#sparkGlow-' + cardId + ')'"
          />
        </svg>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .stat-card {
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      min-height: 175px;
      position: relative;
      overflow: hidden;
      border-radius: 20px;
    }

    .card-glow-accent {
      position: absolute;
      top: -20px;
      right: -20px;
      width: 90px;
      height: 90px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%);
      pointer-events: none;
    }

    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .stat-icon-pill {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-base);
    }

    .stat-icon-pill.purple {
      background: rgba(109, 0, 255, 0.18);
      border: 1px solid rgba(168, 85, 247, 0.35);
      color: #C084FC;
      box-shadow: 0 0 16px rgba(109, 0, 255, 0.28);
    }

    .stat-icon-pill.green {
      background: rgba(34, 197, 94, 0.16);
      border: 1px solid rgba(34, 197, 94, 0.35);
      color: #4ADE80;
      box-shadow: 0 0 16px rgba(34, 197, 94, 0.25);
    }

    .stat-icon-pill.blue {
      background: rgba(56, 189, 248, 0.16);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #38BDF8;
      box-shadow: 0 0 16px rgba(56, 189, 248, 0.25);
    }

    .stat-icon-pill.amber {
      background: rgba(245, 158, 11, 0.16);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #FBBF24;
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.25);
    }

    .stat-trend {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 9999px;
    }

    .trend-up {
      color: #4ADE80;
      background: rgba(34, 197, 94, 0.12);
      border: 1px solid rgba(34, 197, 94, 0.25);
    }

    .trend-down {
      color: #F87171;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.25);
    }

    .stat-body {
      display: flex;
      flex-direction: column;
      z-index: 2;
    }

    .stat-label {
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 500;
      margin-bottom: 4px;
    }

    .stat-value-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: #FFFFFF;
      line-height: 1.1;
      font-family: var(--font-display);
    }

    .stat-unit {
      font-size: 16px;
      color: var(--light-purple);
      font-weight: 600;
    }

    .stat-subtext {
      font-size: 11.5px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .sparkline-container {
      width: 100%;
      height: 38px;
      margin-top: 14px;
      position: relative;
    }

    .sparkline-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
  `]
})
export class DashboardStatCardComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() unit?: string;
  @Input() subtext?: string;
  @Input() trendText?: string;
  @Input() isTrendPositive: boolean = true;
  @Input() iconName: string = 'activity';
  @Input() iconVariant: 'purple' | 'green' | 'blue' | 'amber' = 'purple';
  @Input() isHighlight: boolean = false;
  @Input() cardId: string = Math.random().toString(36).substring(2, 7);

  @Input() sparklineData: number[] = [20, 25, 22, 35, 28, 45, 52, 60];

  get linePath(): string {
    if (!this.sparklineData || this.sparklineData.length < 2) return '';
    const min = Math.min(...this.sparklineData);
    const max = Math.max(...this.sparklineData);
    const range = max - min || 1;
    const width = 160;
    const height = 32;

    const points = this.sparklineData.map((val, idx) => {
      const x = (idx / (this.sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return { x, y };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  }

  get areaPath(): string {
    const line = this.linePath;
    if (!line) return '';
    return `${line} L 160 40 L 0 40 Z`;
  }
}
