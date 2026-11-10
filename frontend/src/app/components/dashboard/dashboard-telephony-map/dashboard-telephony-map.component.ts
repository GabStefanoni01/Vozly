import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

interface TelephonyNode {
  id: string;
  city: string;
  region: string;
  activeChannels: number;
  latencyMs: number;
  xPercent: number;
  yPercent: number;
  selected?: boolean;
}

@Component({
  selector: 'app-dashboard-telephony-map',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="dash-glass-card map-card">
      <div class="map-header">
        <div class="title-wrap">
          <h3 class="map-title">Canais de Voz & Troncos Telefônicos</h3>
          <span class="map-subtitle">Distribuição de chamadas e roteamento SIP em tempo real</span>
        </div>

        <div class="map-controls">
          <select class="map-select" aria-label="Filtrar por região ou tronco">
            <option value="all">Todas as Regiões</option>
            <option value="sp">São Paulo & Grande SP</option>
            <option value="rj">Rio de Janeiro</option>
            <option value="mg">Minas Gerais</option>
          </select>
          <div class="zoom-controls">
            <button class="zoom-btn" (click)="zoomIn()" aria-label="Aumentar zoom">+</button>
            <button class="zoom-btn" (click)="zoomOut()" aria-label="Diminuir zoom">-</button>
          </div>
        </div>
      </div>

      <!-- Mapa Estilizado com Efeito Noturno e Nós de Voz Conectados -->
      <div class="map-stage">
        <!-- SVG com Linhas de Conexão entre Nódulos Telefônicos -->
        <svg class="map-svg-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="trunkLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#6D00FF" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#C084FC" stop-opacity="0.4" />
            </linearGradient>
          </defs>

          <!-- Linhas de Conexão SIP inter-regiões -->
          <line x1="58" y1="52" x2="38" y2="45" stroke="url(#trunkLineGradient)" stroke-width="1.2" stroke-dasharray="2 2" />
          <line x1="58" y1="52" x2="72" y2="60" stroke="url(#trunkLineGradient)" stroke-width="1.2" stroke-dasharray="2 2" />
          <line x1="58" y1="52" x2="68" y2="35" stroke="url(#trunkLineGradient)" stroke-width="1.2" stroke-dasharray="2 2" />
          <line x1="38" y1="45" x2="25" y2="68" stroke="url(#trunkLineGradient)" stroke-width="1.2" stroke-dasharray="2 2" />
        </svg>

        <!-- Nódulos Geográficos com Ondas de Pulso Neon Roxo (Conforme Imagem 02) -->
        <div
          class="map-pin-wrapper"
          *ngFor="let node of nodes"
          [style.left.%]="node.xPercent"
          [style.top.%]="node.yPercent"
          (click)="selectNode(node)"
        >
          <div class="pin-pulse" [class.active-pulse]="node.selected"></div>
          <div class="pin-glow"></div>
          <div class="pin-core"></div>
        </div>

        <!-- Card Flutuante de Detalhes do Ponto Ativo (Conforme "New York, NY — 12 Active Requests" da Imagem 02) -->
        <div
          class="map-floating-card dash-glass-card"
          [style.left.%]="activeNode().xPercent - 14"
          [style.top.%]="activeNode().yPercent - 24"
        >
          <div class="mfc-header">
            <div class="mfc-icon">
              <app-icon name="phone-call" [size]="14"></app-icon>
            </div>
            <div class="mfc-text">
              <span class="mfc-city">{{ activeNode().city }}</span>
              <span class="mfc-channels">{{ activeNode().activeChannels }} Canais Simultâneos</span>
            </div>
          </div>
          <div class="mfc-footer">
            <span class="mfc-latency">Latência: {{ activeNode().latencyMs }}ms</span>
            <span class="mfc-status">Operacional</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .map-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
      min-height: 290px;
    }

    .map-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .title-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .map-title {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.02em;
    }

    .map-subtitle {
      font-size: 12.5px;
      color: var(--text-secondary);
    }

    .map-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .map-select {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      color: var(--text-primary);
      padding: 6px 12px;
      font-size: 12.5px;
      outline: none;
      cursor: pointer;
    }

    .map-select option {
      background: #15151B;
      color: #FFFFFF;
    }

    .zoom-controls {
      display: flex;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      overflow: hidden;
    }

    .zoom-btn {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .zoom-btn:hover {
      background: rgba(109, 0, 255, 0.25);
      color: #FFFFFF;
    }

    .map-stage {
      flex: 1;
      width: 100%;
      min-height: 210px;
      background: radial-gradient(circle at 60% 50%, rgba(109, 0, 255, 0.12) 0%, transparent 60%),
                  linear-gradient(180deg, rgba(14, 12, 20, 0.9) 0%, rgba(8, 7, 12, 0.95) 100%);
      border: 1px solid rgba(168, 85, 247, 0.15);
      border-radius: 16px;
      position: relative;
      overflow: hidden;
    }

    .map-svg-connections {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .map-pin-wrapper {
      position: absolute;
      transform: translate(-50%, -50%);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pin-core {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #FFFFFF;
      box-shadow: 0 0 10px #A855F7, 0 0 20px #6D00FF;
      position: relative;
      z-index: 3;
    }

    .pin-glow {
      position: absolute;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.7) 0%, rgba(109, 0, 255, 0) 70%);
      z-index: 2;
    }

    .pin-pulse {
      position: absolute;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1.5px solid rgba(168, 85, 247, 0.45);
      animation: pulseGlow 2.5s infinite;
      z-index: 1;
    }

    .active-pulse {
      border-color: #C084FC;
      box-shadow: 0 0 15px rgba(109, 0, 255, 0.4);
    }

    .map-floating-card {
      position: absolute;
      width: 200px;
      padding: 10px 14px;
      border-radius: 12px;
      background: rgba(24, 20, 36, 0.92);
      border: 1px solid rgba(168, 85, 247, 0.4);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8), 0 0 20px rgba(109, 0, 255, 0.3);
      z-index: 10;
      pointer-events: none;
      animation: floatSlow 4s ease-in-out infinite;
    }

    .mfc-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }

    .mfc-icon {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: rgba(109, 0, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #C084FC;
    }

    .mfc-city {
      display: block;
      font-size: 12.5px;
      font-weight: 700;
      color: #FFFFFF;
      line-height: 1.1;
    }

    .mfc-channels {
      display: block;
      font-size: 11px;
      color: var(--light-purple);
      font-weight: 500;
    }

    .mfc-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 5px;
      font-size: 10px;
    }

    .mfc-latency {
      color: var(--text-muted);
    }

    .mfc-status {
      color: #4ADE80;
      font-weight: 600;
    }
  `]
})
export class DashboardTelephonyMapComponent {
  readonly nodes: TelephonyNode[] = [
    { id: 'sp', city: 'São Paulo, SP', region: 'Sudeste', activeChannels: 12, latencyMs: 16, xPercent: 58, yPercent: 52, selected: true },
    { id: 'rj', city: 'Rio de Janeiro, RJ', region: 'Sudeste', activeChannels: 6, latencyMs: 22, xPercent: 72, yPercent: 60 },
    { id: 'bh', city: 'Belo Horizonte, MG', region: 'Sudeste', activeChannels: 4, latencyMs: 25, xPercent: 68, yPercent: 35 },
    { id: 'cwb', city: 'Curitiba, PR', region: 'Sul', activeChannels: 5, latencyMs: 19, xPercent: 38, yPercent: 45 },
    { id: 'poa', city: 'Porto Alegre, RS', region: 'Sul', activeChannels: 3, latencyMs: 28, xPercent: 25, yPercent: 68 }
  ];

  activeNode = signal<TelephonyNode>(this.nodes[0]);

  selectNode(node: TelephonyNode): void {
    this.nodes.forEach(n => (n.selected = n.id === node.id));
    this.activeNode.set(node);
  }

  zoomIn(): void {
    // Interação visual
  }

  zoomOut(): void {
    // Interação visual
  }
}
