import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';
import { DashboardStateService } from '../../../services/dashboard-state.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, IconComponent],
  template: `
    <div class="dash-shell">
      <!-- Luzes de Fundo Atmosféricas Neon Violeta -->
      <div class="ambient-glow glow-purple shell-glow-1" aria-hidden="true"></div>
      <div class="ambient-glow glow-violet shell-glow-2" aria-hidden="true"></div>

      <!-- Barra de Aviso Demonstrativo Superior -->
      <aside class="demo-banner" aria-label="Aviso de ambiente de demonstração">
        <div class="demo-banner-inner">
          <span class="demo-badge">
            <span class="demo-dot"></span>
            FASE 02 — MODO DEMONSTRAÇÃO
          </span>
          <span class="demo-text">
            Você está navegando na interface visual e interativa da Vozly. Dados e simulações operam localmente em preparação para integração com a API Spring Boot.
          </span>
          <a routerLink="/" class="demo-home-link">
            <span>Ir para Landing Page</span>
            <app-icon name="external-link" [size]="14"></app-icon>
          </a>
        </div>
      </aside>

      <div class="dash-body">
        <!-- ==============================================
             SIDEBAR LATERAL (Conforme Imagem 02 de Referência)
             ============================================== -->
        <aside
          class="dash-sidebar"
          [class.collapsed]="isCollapsed()"
          [class.mobile-open]="mobileNavOpen()"
          aria-label="Menu principal"
        >
          <!-- Topo da Sidebar: Logo & Workspace -->
          <div class="sidebar-header">
            <a routerLink="/dashboard" class="sidebar-brand">
              <div class="brand-logo-pill">
                <img src="brand/vozly-app-icon.png" alt="Vozly" class="brand-logo-img" />
              </div>
              <div class="brand-info" *ngIf="!isCollapsed()">
                <span class="brand-name">Vozly <span class="brand-ai">AI</span></span>
                <span class="brand-tag">Voice Operating System</span>
              </div>
            </a>

            <!-- Botão de Fechar Mobile -->
            <button class="mobile-close-btn" (click)="closeMobileNav()" aria-label="Fechar menu">
              <app-icon name="x" [size]="20"></app-icon>
            </button>
          </div>

          <!-- Seletor / Identificador de Workspace Ativo -->
          <div class="workspace-pill" *ngIf="!isCollapsed()">
            <div class="workspace-icon">
              <app-icon name="building" [size]="16" color="#A855F7"></app-icon>
            </div>
            <div class="workspace-details">
              <span class="ws-name">{{ state.currentWorkspace().name }}</span>
              <span class="ws-plan">{{ state.currentWorkspace().plan }}</span>
            </div>
          </div>

          <!-- Grupos de Navegação -->
          <nav class="sidebar-nav" aria-label="Navegação do painel">
            <div class="nav-group" *ngFor="let group of navGroups">
              <span class="group-title" *ngIf="!isCollapsed()">{{ group.groupName }}</span>

              <ul class="nav-list">
                <li *ngFor="let item of group.items">
                  <a
                    [routerLink]="item.path"
                    routerLinkActive="active"
                    [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
                    (click)="closeMobileNav()"
                    class="nav-link"
                    [title]="item.label"
                  >
                    <div class="nav-icon-wrapper">
                      <app-icon [name]="item.icon" [size]="18"></app-icon>
                    </div>
                    <span class="nav-label" *ngIf="!isCollapsed()">{{ item.label }}</span>
                    <span class="nav-item-badge" *ngIf="item.badge && !isCollapsed()">{{ item.badge }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          <!-- Card Inferior de Suporte & Recolhimento -->
          <div class="sidebar-footer">
            <div class="support-card" *ngIf="!isCollapsed()">
              <div class="support-icon">
                <app-icon name="sparkles" [size]="18" color="#A855F7"></app-icon>
              </div>
              <div class="support-info">
                <span class="support-title">Documentação Ativa</span>
                <span class="support-desc">Guia self-service e contratos</span>
              </div>
            </div>

            <!-- Botão Recolher / Expandir Sidebar (Desktop) -->
            <button
              class="collapse-toggle-btn"
              (click)="toggleCollapse()"
              [title]="isCollapsed() ? 'Expandir Menu' : 'Recolher Menu'"
              aria-label="Alternar tamanho da barra lateral"
            >
              <app-icon [name]="isCollapsed() ? 'chevron-right' : 'x'" [size]="18"></app-icon>
              <span class="collapse-label" *ngIf="!isCollapsed()">Recolher painel</span>
            </button>
          </div>
        </aside>

        <!-- Overlay Mobile -->
        <div
          class="sidebar-overlay"
          *ngIf="mobileNavOpen()"
          (click)="closeMobileNav()"
          aria-hidden="true"
        ></div>

        <!-- ==============================================
             ÁREA PRINCIPAL COM HEADER & ROUTER OUTLET
             ============================================== -->
        <div class="dash-main-area">
          <!-- CABEÇALHO SUPERIOR (Conforme Imagem 02 de Referência) -->
          <header class="dash-header">
            <div class="header-left">
              <!-- Botão Menu Mobile -->
              <button class="mobile-menu-btn" (click)="openMobileNav()" aria-label="Abrir menu lateral">
                <app-icon name="menu" [size]="22"></app-icon>
              </button>

              <!-- Barra de Pesquisa Global com Glassmorphism -->
              <div class="header-search">
                <app-icon name="search" [size]="16" color="#71717A"></app-icon>
                <input
                  type="text"
                  placeholder="Pesquisar agentes, chamadas, ferramentas..."
                  [value]="state.searchQuery()"
                  (input)="onSearchInput($event)"
                  class="search-input"
                  aria-label="Pesquisar em todo o painel"
                />
                <span class="search-shortcut">⌘K</span>
              </div>
            </div>

            <div class="header-right">
              <!-- Pill de Data / Status Operacional -->
              <div class="date-pill hide-mobile">
                <app-icon name="calendar" [size]="15" color="#A855F7"></app-icon>
                <span>Novembro 2026</span>
              </div>

              <!-- Notificações com Dropdown -->
              <div class="header-dropdown-wrap">
                <button
                  class="header-action-btn"
                  (click)="toggleNotifications()"
                  aria-label="Notificações operacionais"
                  [attr.aria-expanded]="showNotifications()"
                >
                  <app-icon name="bell" [size]="18"></app-icon>
                  <span class="notification-dot" aria-label="3 novas notificações"></span>
                </button>

                <!-- Dropdown de Notificações -->
                <div class="notifications-dropdown dash-glass-card" *ngIf="showNotifications()">
                  <div class="notif-header">
                    <h4>Notificações Operacionais</h4>
                    <span class="notif-count">3 novas</span>
                  </div>
                  <div class="notif-list">
                    <div class="notif-item">
                      <div class="notif-icon-pill green">
                        <app-icon name="check-circle" [size]="14"></app-icon>
                      </div>
                      <div class="notif-content">
                        <p class="notif-title">Agente Helena publicado com sucesso</p>
                        <span class="notif-time">Há 15 minutos • Versão v2.0</span>
                      </div>
                    </div>
                    <div class="notif-item">
                      <div class="notif-icon-pill purple">
                        <app-icon name="phone-incoming" [size]="14"></app-icon>
                      </div>
                      <div class="notif-content">
                        <p class="notif-title">Pico de 8 chamadas concorrentes</p>
                        <span class="notif-time">Há 42 minutos • Tronco SIP estável</span>
                      </div>
                    </div>
                    <div class="notif-item">
                      <div class="notif-icon-pill amber">
                        <app-icon name="alert-circle" [size]="14"></app-icon>
                      </div>
                      <div class="notif-content">
                        <p class="notif-title">Conexão ERP requer validação de token</p>
                        <span class="notif-time">Há 2 horas • Modo Rascunho</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Perfil do Usuário com Role Badge -->
              <div class="header-user-card" (click)="toggleUserMenu()">
                <img
                  [src]="state.currentUser().avatarUrl"
                  [alt]="state.currentUser().name"
                  class="user-avatar"
                />
                <div class="user-meta hide-mobile">
                  <span class="user-name">{{ state.currentUser().name }}</span>
                  <span class="user-role-badge">{{ state.currentUser().role }}</span>
                </div>
                <app-icon name="chevron-down" [size]="14" color="#71717A" class="hide-mobile"></app-icon>

                <!-- Dropdown do Usuário -->
                <div class="user-dropdown dash-glass-card" *ngIf="showUserMenu()">
                  <div class="user-dropdown-header">
                    <span class="ud-name">{{ state.currentUser().name }}</span>
                    <span class="ud-email">{{ state.currentUser().email }}</span>
                  </div>
                  <ul class="user-dropdown-nav">
                    <li>
                      <a routerLink="/dashboard/settings" (click)="showUserMenu.set(false)">
                        <app-icon name="settings" [size]="16"></app-icon>
                        <span>Configurações do Workspace</span>
                      </a>
                    </li>
                    <li>
                      <a routerLink="/dashboard/audit" (click)="showUserMenu.set(false)">
                        <app-icon name="shield-check" [size]="16"></app-icon>
                        <span>Trilha de Auditoria</span>
                      </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                      <a routerLink="/" (click)="showUserMenu.set(false)">
                        <app-icon name="log-out" [size]="16"></app-icon>
                        <span>Sair para Início</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Botão Principal de Ação Rápida (+ Novo Agente) -->
              <a routerLink="/dashboard/agents/new" class="btn btn-primary btn-sm btn-header-cta">
                <app-icon name="plus" [size]="16"></app-icon>
                <span class="hide-mobile">Novo Agente</span>
              </a>
            </div>
          </header>

          <!-- CONTEÚDO PRINCIPAL (ROUTER OUTLET) -->
          <main id="dashboard-content" class="dash-content-container">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      position: relative;
    }

    .dash-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow-x: hidden;
      background: radial-gradient(circle at 15% 10%, rgba(109, 0, 255, 0.08) 0%, transparent 45%),
                  radial-gradient(circle at 85% 80%, rgba(139, 61, 255, 0.06) 0%, transparent 50%),
                  var(--bg-primary);
    }

    /* Brilhos de fundo */
    .shell-glow-1 {
      top: -150px;
      left: 10%;
      width: 500px;
      height: 500px;
    }

    .shell-glow-2 {
      bottom: 10%;
      right: 5%;
      width: 600px;
      height: 600px;
    }

    /* Banner Superior Demonstrativo */
    .demo-banner {
      background: linear-gradient(90deg, rgba(109, 0, 255, 0.22) 0%, rgba(18, 16, 26, 0.95) 50%, rgba(109, 0, 255, 0.22) 100%);
      border-bottom: 1px solid rgba(168, 85, 247, 0.25);
      padding: 8px 24px;
      font-size: 13px;
      z-index: 50;
      backdrop-filter: blur(12px);
    }

    .demo-banner-inner {
      max-width: 1600px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .demo-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: 9999px;
      background: rgba(109, 0, 255, 0.25);
      border: 1px solid rgba(168, 85, 247, 0.4);
      color: #E9D5FF;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    .demo-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #A855F7;
      box-shadow: 0 0 8px #A855F7;
      animation: pulseGlow 2s infinite;
    }

    .demo-text {
      color: var(--text-secondary);
      flex: 1;
      font-size: 12.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .demo-home-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #C084FC;
      font-weight: 500;
      font-size: 12px;
      transition: color var(--transition-fast);
      white-space: nowrap;
    }

    .demo-home-link:hover {
      color: #FFFFFF;
      text-decoration: underline;
    }

    /* Estrutura Principal */
    .dash-body {
      display: flex;
      flex: 1;
      min-height: calc(100vh - 42px);
      position: relative;
    }

    /* =================================================
       SIDEBAR
       ================================================= */
    .dash-sidebar {
      width: 270px;
      background: rgba(11, 11, 15, 0.88);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-right: 1px solid rgba(168, 85, 247, 0.15);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: width var(--transition-smooth), transform var(--transition-smooth);
      z-index: 40;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }

    .dash-sidebar.collapsed {
      width: 80px;
    }

    .sidebar-header {
      padding: 24px 20px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo-pill {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(109, 0, 255, 0.3) 0%, rgba(139, 61, 255, 0.1) 100%);
      border: 1px solid rgba(168, 85, 247, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px rgba(109, 0, 255, 0.25);
    }

    .brand-logo-img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }

    .brand-info {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #FFFFFF;
      line-height: 1.1;
    }

    .brand-ai {
      color: var(--light-purple);
      font-weight: 800;
      text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
    }

    .brand-tag {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    .mobile-close-btn {
      display: none;
      color: var(--text-muted);
      padding: 6px;
    }

    /* Pílula de Workspace */
    .workspace-pill {
      margin: 4px 16px 18px;
      padding: 10px 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .workspace-icon {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: rgba(109, 0, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .workspace-details {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .ws-name {
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ws-plan {
      font-size: 11px;
      color: var(--light-purple);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Navegação */
    .sidebar-nav {
      flex: 1;
      padding: 0 12px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .group-title {
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: var(--text-dim);
      padding: 0 12px 6px;
    }

    .nav-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 12px;
      color: var(--text-secondary);
      font-size: 14px;
      font-weight: 500;
      transition: all var(--transition-fast);
      position: relative;
    }

    .nav-link:hover {
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.04);
    }

    /* Estado Ativo conforme Imagem 02 */
    .nav-link.active {
      background: linear-gradient(135deg, rgba(109, 0, 255, 0.9) 0%, rgba(139, 61, 255, 0.85) 100%);
      color: #FFFFFF;
      font-weight: 600;
      box-shadow: 0 4px 20px rgba(109, 0, 255, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .nav-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      flex-shrink: 0;
    }

    .nav-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nav-item-badge {
      font-size: 11px;
      padding: 2px 7px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.15);
      color: #FFFFFF;
      font-weight: 600;
    }

    /* Rodapé da Sidebar */
    .sidebar-footer {
      padding: 16px 12px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .support-card {
      padding: 12px;
      border-radius: 14px;
      background: rgba(109, 0, 255, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.2);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .support-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(109, 0, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .support-info {
      display: flex;
      flex-direction: column;
    }

    .support-title {
      font-size: 12.5px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .support-desc {
      font-size: 11px;
      color: var(--text-secondary);
    }

    .collapse-toggle-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 10px;
      color: var(--text-muted);
      font-size: 13px;
      transition: all var(--transition-fast);
      width: 100%;
    }

    .collapse-toggle-btn:hover {
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.04);
    }

    /* =================================================
       ÁREA PRINCIPAL & CABEÇALHO SUPERIOR
       ================================================= */
    .dash-main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      background: transparent;
    }

    .dash-header {
      height: 72px;
      padding: 0 32px;
      background: rgba(11, 11, 15, 0.65);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(168, 85, 247, 0.12);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 30;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      max-width: 480px;
    }

    .mobile-menu-btn {
      display: none;
      color: var(--text-secondary);
      padding: 6px;
    }

    .header-search {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      background: rgba(21, 21, 27, 0.7);
      border: 1px solid rgba(168, 85, 247, 0.18);
      border-radius: 12px;
      padding: 8px 14px;
      transition: all var(--transition-fast);
    }

    .header-search:focus-within {
      border-color: var(--light-purple);
      box-shadow: 0 0 16px rgba(109, 0, 255, 0.25);
    }

    .search-input {
      background: transparent;
      border: none;
      color: #FFFFFF;
      font-size: 13.5px;
      width: 100%;
      outline: none;
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .search-shortcut {
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-muted);
      font-family: var(--font-mono);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
    }

    .date-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 14px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 13px;
      color: var(--text-secondary);
    }

    .header-action-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      position: relative;
      transition: all var(--transition-fast);
    }

    .header-action-btn:hover {
      background: rgba(109, 0, 255, 0.2);
      border-color: rgba(168, 85, 247, 0.4);
      color: #FFFFFF;
    }

    .notification-dot {
      position: absolute;
      top: 9px;
      right: 9px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #A855F7;
      box-shadow: 0 0 8px #A855F7;
    }

    /* Dropdown de Notificações */
    .notifications-dropdown {
      position: absolute;
      top: 50px;
      right: 140px;
      width: 340px;
      padding: 16px;
      z-index: 100;
    }

    .notif-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .notif-header h4 {
      font-size: 14px;
      font-weight: 600;
    }

    .notif-count {
      font-size: 11px;
      color: var(--light-purple);
      background: rgba(109, 0, 255, 0.2);
      padding: 2px 8px;
      border-radius: 9999px;
    }

    .notif-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .notif-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 8px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.02);
      transition: background var(--transition-fast);
    }

    .notif-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .notif-icon-pill {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .notif-icon-pill.green {
      background: rgba(34, 197, 94, 0.2);
      color: #4ADE80;
    }

    .notif-icon-pill.purple {
      background: rgba(109, 0, 255, 0.2);
      color: #C084FC;
    }

    .notif-icon-pill.amber {
      background: rgba(245, 158, 11, 0.2);
      color: #FBBF24;
    }

    .notif-content {
      display: flex;
      flex-direction: column;
    }

    .notif-title {
      font-size: 12.5px;
      color: #FFFFFF;
      font-weight: 500;
      line-height: 1.3;
    }

    .notif-time {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* Cartão do Usuário */
    .header-user-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 8px 4px 4px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      cursor: pointer;
      position: relative;
      transition: all var(--transition-fast);
    }

    .header-user-card:hover {
      border-color: rgba(168, 85, 247, 0.4);
      background: rgba(109, 0, 255, 0.1);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      object-fit: cover;
      border: 1px solid rgba(168, 85, 247, 0.5);
    }

    .user-meta {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 1.1;
    }

    .user-role-badge {
      font-size: 10px;
      font-weight: 700;
      color: var(--light-purple);
      letter-spacing: 0.03em;
    }

    /* Dropdown do Usuário */
    .user-dropdown {
      position: absolute;
      top: 48px;
      right: 0;
      width: 240px;
      padding: 12px;
      z-index: 100;
    }

    .user-dropdown-header {
      padding: 6px 8px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      flex-direction: column;
    }

    .ud-name {
      font-size: 13.5px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .ud-email {
      font-size: 11.5px;
      color: var(--text-muted);
    }

    .user-dropdown-nav {
      list-style: none;
      padding: 8px 0 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-dropdown-nav a {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 8px;
      font-size: 13px;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .user-dropdown-nav a:hover {
      background: rgba(109, 0, 255, 0.18);
      color: #FFFFFF;
    }

    .user-dropdown-nav .divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.06);
      margin: 4px 0;
    }

    .btn-header-cta {
      box-shadow: 0 4px 18px rgba(109, 0, 255, 0.45);
    }

    /* Conteúdo Principal */
    .dash-content-container {
      padding: 28px 32px 48px;
      flex: 1;
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
    }

    /* =================================================
       RESPONSIVIDADE (Tablets e Mobile)
       ================================================= */
    @media (max-width: 1024px) {
      .dash-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        transform: translateX(-100%);
        box-shadow: 10px 0 30px rgba(0, 0, 0, 0.8);
      }

      .dash-sidebar.mobile-open {
        transform: translateX(0);
      }

      .mobile-close-btn {
        display: block;
      }

      .sidebar-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        z-index: 35;
      }

      .mobile-menu-btn {
        display: block;
      }

      .collapse-toggle-btn {
        display: none;
      }

      .dash-header {
        padding: 0 20px;
      }

      .dash-content-container {
        padding: 20px 20px 40px;
      }
    }

    @media (max-width: 768px) {
      .hide-mobile {
        display: none !important;
      }

      .demo-text {
        display: none;
      }

      .demo-banner-inner {
        justify-content: space-between;
      }

      .header-search {
        max-width: 200px;
      }

      .dash-header {
        height: 64px;
      }
    }
  `]
})
export class DashboardLayoutComponent {
  isCollapsed = signal<boolean>(false);
  mobileNavOpen = signal<boolean>(false);
  showNotifications = signal<boolean>(false);
  showUserMenu = signal<boolean>(false);

  readonly navGroups: NavGroup[] = [
    {
      groupName: 'Visão Geral',
      items: [
        { label: 'Visão Geral', path: '/dashboard', icon: 'layout-dashboard' }
      ]
    },
    {
      groupName: 'Operação',
      items: [
        { label: 'Agentes de IA', path: '/dashboard/agents', icon: 'bot' },
        { label: 'Conversas & Chamadas', path: '/dashboard/conversations', icon: 'phone-call', badge: 'Ao vivo' },
        { label: 'Base de Conhecimento', path: '/dashboard/knowledge', icon: 'book-open' },
        { label: 'Ferramentas & Conectores', path: '/dashboard/integrations', icon: 'cpu' },
        { label: 'Telefonia & Linhas', path: '/dashboard/telephony', icon: 'phone' }
      ]
    },
    {
      groupName: 'Gestão',
      items: [
        { label: 'Utilização & Consumo', path: '/dashboard/usage', icon: 'bar-chart-2' },
        { label: 'Trilha de Auditoria', path: '/dashboard/audit', icon: 'shield-check' },
        { label: 'Configurações Workspace', path: '/dashboard/settings', icon: 'settings' }
      ]
    }
  ];

  constructor(public state: DashboardStateService, private router: Router) {}

  toggleCollapse(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

  openMobileNav(): void {
    this.mobileNavOpen.set(true);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  toggleNotifications(): void {
    this.showNotifications.set(!this.showNotifications());
    if (this.showNotifications()) {
      this.showUserMenu.set(false);
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu.set(!this.showUserMenu());
    if (this.showUserMenu()) {
      this.showNotifications.set(false);
    }
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.state.searchQuery.set(value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.header-dropdown-wrap') && !target.closest('.header-user-card')) {
      this.showNotifications.set(false);
      this.showUserMenu.set(false);
    }
  }
}
