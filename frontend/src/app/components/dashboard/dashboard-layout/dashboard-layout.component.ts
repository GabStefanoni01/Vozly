import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';
import { SessionStore } from '../../../core/api/session.store';
import { TenantStatus } from '../../../core/api/dashboard-api.models';
import { ApiAuthService } from '../../../services/api-auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

/**
 * Shell do painel (sidebar + header).
 *
 * Dados do shell vêm do SessionStore:
 * - Usuário: GET /api/v1/auth/me (✅ disponível — userId, tenantId, role, name, email)
 * - Workspace: GET /api/v1/tenants/current (⏳ pendente — módulo tenants)
 * - Status da API: GET /actuator/health (✅ disponível)
 */
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent],
  template: `
    <div class="dash-shell">
      <!-- SIDEBAR -->
      <aside
        class="dash-sidebar"
        [class.collapsed]="isCollapsed()"
        [class.mobile-open]="mobileNavOpen()"
        aria-label="Menu principal"
      >
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-brand" aria-label="Vozly — Visão geral">
            @if (isCollapsed()) {
              <img src="brand/vozly-symbol-pure.png" alt="Vozly" class="brand-symbol" width="166" height="112" />
            } @else {
              <img src="brand/vozly-logo-horizontal.png" alt="Vozly" class="brand-logo" width="433" height="142" />
              <span class="brand-chip">Painel</span>
            }
          </a>

          <button class="mobile-close-btn" (click)="closeMobileNav()" aria-label="Fechar menu">
            <app-icon name="x" [size]="20"></app-icon>
          </button>
        </div>

        <!-- Workspace ativo — GET /api/v1/tenants/current -->
        @if (!isCollapsed()) {
          <div class="workspace-pill">
            <span class="workspace-icon">
              <app-icon name="building" [size]="16" color="#A855F7"></app-icon>
            </span>
            <span class="workspace-details">
              @if (session.tenant.data(); as tenant) {
                <span class="ws-name">{{ tenant.name }}</span>
                <span class="ws-plan">{{ tenantStatusLabel[tenant.status] }}</span>
              } @else {
                <span class="ws-name">Workspace</span>
                <span class="ws-plan ws-pending" title="Implementar GET /api/v1/tenants/current">Aguardando /tenants/current</span>
              }
            </span>
          </div>
        }

        <nav class="sidebar-nav" aria-label="Navegação do painel">
          @for (group of navGroups; track group.groupName) {
            <div class="nav-group">
              @if (!isCollapsed()) {
                <span class="group-title">{{ group.groupName }}</span>
              }
              <ul class="nav-list">
                @for (item of group.items; track item.path) {
                  <li>
                    <a
                      [routerLink]="item.path"
                      routerLinkActive="active"
                      [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
                      (click)="closeMobileNav()"
                      class="nav-link"
                      [title]="item.label"
                    >
                      <span class="nav-icon-wrapper">
                        <app-icon [name]="item.icon" [size]="18"></app-icon>
                      </span>
                      @if (!isCollapsed()) {
                        <span class="nav-label">{{ item.label }}</span>
                      }
                    </a>
                  </li>
                }
              </ul>
            </div>
          }
        </nav>

        <div class="sidebar-footer">
          @if (!isCollapsed()) {
            <div class="api-card" [attr.data-state]="apiState()">
              <span class="api-dot"></span>
              <span class="api-info">
                <span class="api-title">API {{ apiLabel() }}</span>
                <span class="api-desc">{{ apiDescription() }}</span>
              </span>
            </div>
          }

          <button
            class="collapse-toggle-btn"
            (click)="toggleCollapse()"
            [title]="isCollapsed() ? 'Expandir menu' : 'Recolher menu'"
            aria-label="Alternar tamanho da barra lateral"
          >
            <span class="collapse-icon" [class.flipped]="!isCollapsed()">
              <app-icon name="chevron-right" [size]="16"></app-icon>
            </span>
            @if (!isCollapsed()) {
              <span>Recolher menu</span>
            }
          </button>
        </div>
      </aside>

      @if (mobileNavOpen()) {
        <div class="sidebar-overlay" (click)="closeMobileNav()" aria-hidden="true"></div>
      }

      <!-- ÁREA PRINCIPAL -->
      <div class="dash-main-area">
        <header class="dash-header">
          <div class="header-left">
            <button class="mobile-menu-btn" (click)="openMobileNav()" aria-label="Abrir menu lateral">
              <app-icon name="menu" [size]="22"></app-icon>
            </button>

            <!--
              Busca global: não há endpoint de busca em docs/09.
              Quando existir (ex.: GET /api/v1/search?q=), ligar este campo com
              debounce e resultados agrupados por recurso, sempre tenant-scoped.
            -->
            <label class="header-search" title="Busca global ainda não disponível na API">
              <app-icon name="search" [size]="16" color="#71717A"></app-icon>
              <input
                type="search"
                placeholder="Buscar agentes, chamadas, conhecimento…"
                class="search-input"
                aria-label="Busca global (indisponível)"
                disabled
              />
              <span class="search-shortcut">Em breve</span>
            </label>
          </div>

          <div class="header-right">
            <div class="date-pill hide-mobile">
              <app-icon name="calendar" [size]="15" color="#A855F7"></app-icon>
              <span>{{ todayLabel }}</span>
            </div>

            <!--
              Notificações: sem fonte definida nos docs. Sugestão: GET /api/v1/notifications
              (ou SSE) derivado de audit_events e eventos operacionais. Não exibir itens
              até o endpoint existir.
            -->
            <div class="header-dropdown-wrap">
              <button
                class="header-action-btn"
                (click)="toggleNotifications()"
                aria-label="Notificações"
                [attr.aria-expanded]="showNotifications()"
              >
                <app-icon name="bell" [size]="18"></app-icon>
              </button>

              @if (showNotifications()) {
                <div class="dropdown notifications-dropdown">
                  <div class="dropdown-header">
                    <h4>Notificações</h4>
                  </div>
                  <div class="notif-empty">
                    <app-icon name="bell" [size]="20"></app-icon>
                    <p>Nenhuma notificação</p>
                    <span>O feed depende de um endpoint de notificações/eventos ainda não definido na API.</span>
                  </div>
                </div>
              }
            </div>

            <!-- Usuário — GET /api/v1/auth/me (userId, tenantId, role, name, email) -->
            <div class="header-dropdown-wrap">
              <button type="button" class="header-user-card" (click)="toggleUserMenu()" [attr.aria-expanded]="showUserMenu()">
                <span class="user-avatar" [class.pending]="!session.me.isReady()">
                  @if (session.initials(); as initials) {
                    {{ initials }}
                  } @else {
                    <app-icon name="user" [size]="16"></app-icon>
                  }
                </span>
                <span class="user-meta hide-mobile">
                  @if (session.me.data(); as me) {
                    <span class="user-name">{{ me.name ?? 'Minha conta' }}</span>
                    <span class="user-role-badge">{{ session.roleLabel() }}</span>
                  } @else {
                    <span class="user-name">Sessão</span>
                    <span class="user-role-badge pending">não autenticada</span>
                  }
                </span>
                <app-icon name="chevron-down" [size]="14" color="#71717A" class="hide-mobile"></app-icon>
              </button>

              @if (showUserMenu()) {
                <div class="dropdown user-dropdown">
                  <div class="dropdown-header user-dropdown-header">
                    @if (session.me.data(); as me) {
                      <span class="ud-name">{{ me.name ?? 'Conta autenticada' }}</span>
                      <span class="ud-email">{{ me.email ?? session.roleLabel() + ' do workspace' }}</span>
                    } @else {
                      <span class="ud-name">Sessão não carregada</span>
                      <span class="ud-email">GET /api/v1/auth/me não respondeu</span>
                    }
                  </div>
                  <ul class="user-dropdown-nav">
                    <li>
                      <a routerLink="/dashboard/settings" (click)="showUserMenu.set(false)">
                        <app-icon name="settings" [size]="16"></app-icon>
                        <span>Configurações do workspace</span>
                      </a>
                    </li>
                    <li>
                      <a routerLink="/dashboard/audit" (click)="showUserMenu.set(false)">
                        <app-icon name="shield-check" [size]="16"></app-icon>
                        <span>Trilha de auditoria</span>
                      </a>
                    </li>
                    <li class="divider"></li>
                    <li>
                      <button type="button" (click)="logout()">
                        <app-icon name="log-out" [size]="16"></app-icon>
                        <span>Sair da conta</span>
                      </button>
                    </li>
                  </ul>
                </div>
              }
            </div>

            <a routerLink="/dashboard/agents/new" class="vz-btn vz-btn-primary header-cta">
              <app-icon name="plus" [size]="16"></app-icon>
              <span class="hide-mobile">Novo agente</span>
            </a>
          </div>
        </header>

        <main id="dashboard-content" class="dash-content-container">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--bg-primary);
      color: var(--text-primary);
    }

    .dash-shell {
      min-height: 100vh;
      display: flex;
      background:
        radial-gradient(900px 500px at 20% -10%, rgba(109, 0, 255, 0.10), transparent 60%),
        var(--bg-primary);
    }

    /* ================= SIDEBAR ================= */
    .dash-sidebar {
      width: 256px;
      flex-shrink: 0;
      background: #09080D;
      border-right: 1px solid var(--vz-border);
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: width var(--transition-smooth), transform var(--transition-smooth);
      z-index: 40;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .dash-sidebar.collapsed { width: 76px; }

    /* Altura igual à do header (68px) para a logo alinhar com a barra superior. */
    .sidebar-header {
      height: 68px;
      flex-shrink: 0;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--vz-border);
    }
    .collapsed .sidebar-header { padding: 0; justify-content: center; }

    .sidebar-brand { display: flex; align-items: center; gap: 10px; min-width: 0; }

    .brand-logo { height: 26px; width: auto; object-fit: contain; }
    .brand-symbol { height: 22px; width: auto; object-fit: contain; }

    .brand-chip {
      font-size: 10.5px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #C084FC;
      padding: 2px 7px;
      border-radius: 6px;
      background: var(--vz-accent-soft);
      border: 1px solid rgba(168, 85, 247, 0.25);
      line-height: 1.4;
    }

    .mobile-close-btn { display: none; color: var(--text-muted); padding: 6px; }

    .workspace-pill {
      margin: 8px 14px 4px;
      padding: 10px 12px;
      border-radius: 12px;
      background: var(--vz-surface);
      border: 1px solid var(--vz-border);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .workspace-icon {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: var(--vz-accent-soft);
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .workspace-details { display: flex; flex-direction: column; min-width: 0; line-height: 1.35; }
    .ws-name { font-size: 13px; font-weight: 600; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ws-plan { font-size: 11.5px; color: var(--light-purple); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ws-pending { color: var(--text-muted); }

    .sidebar-nav { flex: 1; padding: 6px 12px; display: flex; flex-direction: column; gap: 18px; }
    .collapsed .sidebar-nav { padding: 6px 14px; }

    .group-title {
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: var(--text-dim);
      padding: 0 10px 6px;
    }

    .nav-list { list-style: none; display: flex; flex-direction: column; gap: 2px; }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 9px 10px;
      border-radius: 10px;
      color: var(--text-secondary);
      font-size: 13.5px;
      font-weight: 500;
      transition: background var(--transition-fast), color var(--transition-fast);
      border: 1px solid transparent;
    }
    .collapsed .nav-link { justify-content: center; padding: 10px 0; }
    .nav-link:hover { color: #FFFFFF; background: rgba(255, 255, 255, 0.04); }
    .nav-link.active {
      background: var(--vz-accent);
      color: #FFFFFF;
      font-weight: 600;
      border-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 6px 18px -6px rgba(139, 92, 246, 0.7);
    }

    .nav-icon-wrapper { display: grid; place-items: center; width: 20px; flex-shrink: 0; }
    .nav-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .sidebar-footer {
      padding: 12px 12px 18px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-top: 1px solid var(--vz-border);
    }

    .api-card {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px;
      border-radius: 12px;
      background: var(--vz-surface);
      border: 1px solid var(--vz-border);
    }
    .api-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; background: #71717A; }
    .api-card[data-state='online'] .api-dot { background: #4ADE80; box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.18); }
    .api-card[data-state='offline'] .api-dot { background: #F87171; box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.18); }
    .api-info { display: flex; flex-direction: column; min-width: 0; line-height: 1.4; }
    .api-title { font-size: 12.5px; font-weight: 600; color: #FFFFFF; }
    .api-desc { font-size: 11.5px; color: var(--text-muted); }

    .collapse-toggle-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 10px;
      color: var(--text-muted);
      font-size: 12.5px;
      width: 100%;
      transition: all var(--transition-fast);
    }
    .collapsed .collapse-toggle-btn { justify-content: center; }
    .collapse-toggle-btn:hover { color: #FFFFFF; background: rgba(255, 255, 255, 0.04); }
    .collapse-icon { display: grid; place-items: center; transition: transform var(--transition-base); }
    .collapse-icon.flipped { transform: rotate(180deg); }

    /* ================= ÁREA PRINCIPAL ================= */
    .dash-main-area { flex: 1; display: flex; flex-direction: column; min-width: 0; }

    .dash-header {
      height: 68px;
      padding: 0 28px;
      background: rgba(5, 5, 5, 0.72);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--vz-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 30;
    }

    .header-left { display: flex; align-items: center; gap: 12px; flex: 1; max-width: 460px; min-width: 0; }

    .mobile-menu-btn { display: none; color: var(--text-secondary); padding: 6px; }

    .header-search {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-width: 0;
      background: var(--vz-surface);
      border: 1px solid var(--vz-border);
      border-radius: 11px;
      padding: 8px 12px;
      cursor: not-allowed;
    }
    .search-input {
      background: transparent;
      border: none;
      color: #FFFFFF;
      font-size: 13px;
      width: 100%;
      min-width: 0;
      outline: none;
      cursor: not-allowed;
    }
    .search-input::placeholder { color: var(--text-muted); }
    .search-shortcut {
      font-size: 10.5px;
      padding: 2px 7px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--vz-border);
      color: var(--text-muted);
      white-space: nowrap;
    }

    .header-right { display: flex; align-items: center; gap: 10px; }

    .date-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 10px;
      background: var(--vz-surface);
      border: 1px solid var(--vz-border);
      font-size: 12.5px;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .header-action-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: var(--vz-surface);
      border: 1px solid var(--vz-border);
      display: grid;
      place-items: center;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }
    .header-action-btn:hover { border-color: var(--vz-border-strong); color: #FFFFFF; }

    .header-dropdown-wrap { position: relative; }

    .dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      z-index: 100;
      background: #131218;
      border: 1px solid var(--vz-border);
      border-radius: 14px;
      box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.8);
      padding: 12px;
    }
    .notifications-dropdown { width: 320px; }
    .dropdown-header { padding: 4px 6px 10px; border-bottom: 1px solid var(--vz-border); }
    .dropdown-header h4 { font-size: 14px; font-weight: 600; }

    .notif-empty { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 20px 12px 8px; text-align: center; color: var(--text-muted); }
    .notif-empty p { font-size: 13.5px; font-weight: 600; color: var(--text-primary); margin-top: 6px; }
    .notif-empty span { font-size: 12px; line-height: 1.5; }

    .header-user-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 4px 10px 4px 4px;
      border-radius: 11px;
      background: var(--vz-surface);
      border: 1px solid var(--vz-border);
      transition: border-color var(--transition-fast);
      text-align: left;
    }
    .header-user-card:hover { border-color: var(--vz-border-strong); }

    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 9px;
      display: grid;
      place-items: center;
      font-size: 12px;
      font-weight: 700;
      color: #FFFFFF;
      background: linear-gradient(135deg, #7C3AED, #A855F7);
      flex-shrink: 0;
    }
    .user-avatar.pending { background: var(--vz-surface-2); color: var(--text-muted); border: 1px dashed rgba(255, 255, 255, 0.15); }

    .user-meta { display: flex; flex-direction: column; line-height: 1.25; }
    .user-name { font-size: 12.5px; font-weight: 600; color: #FFFFFF; white-space: nowrap; }
    .user-role-badge { font-size: 10.5px; font-weight: 700; color: var(--light-purple); letter-spacing: 0.03em; }
    .user-role-badge.pending { color: var(--text-muted); font-weight: 500; letter-spacing: 0; }

    .user-dropdown { width: 260px; }
    .user-dropdown-header { display: flex; flex-direction: column; }
    .ud-name { font-size: 13.5px; font-weight: 600; color: #FFFFFF; }
    .ud-email { font-size: 11.5px; color: var(--text-muted); }

    .user-dropdown-nav { list-style: none; padding-top: 8px; display: flex; flex-direction: column; gap: 2px; }
    .user-dropdown-nav a, .user-dropdown-nav button {
      width: 100%;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 8px;
      font-size: 13px;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }
    .user-dropdown-nav a:hover, .user-dropdown-nav button:hover { background: var(--vz-accent-soft); color: #FFFFFF; }
    .user-dropdown-nav .divider { height: 1px; background: var(--vz-border); margin: 4px 0; }

    .header-cta { padding: 9px 14px; font-size: 13px; }

    .dash-content-container {
      padding: 28px 28px 48px;
      flex: 1;
      width: 100%;
      max-width: 1680px;
      margin: 0 auto;
    }

    /* ================= RESPONSIVO ================= */
    @media (max-width: 1024px) {
      .dash-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 256px;
        transform: translateX(-100%);
        box-shadow: 10px 0 30px rgba(0, 0, 0, 0.8);
      }
      .dash-sidebar.collapsed { width: 256px; }
      .dash-sidebar.mobile-open { transform: translateX(0); }
      .mobile-close-btn { display: block; }
      .sidebar-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(3px); z-index: 35; }
      .mobile-menu-btn { display: block; }
      .collapse-toggle-btn { display: none; }
      .dash-header { padding: 0 16px; }
      .dash-content-container { padding: 20px 16px 40px; }
    }

    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .header-user-card { padding: 4px; }
      .dash-header { height: 60px; }
      .search-shortcut { display: none; }
    }
  `]
})
export class DashboardLayoutComponent {
  readonly session = inject(SessionStore);
  private readonly auth = inject(ApiAuthService);
  private readonly router = inject(Router);

  readonly isCollapsed = signal(false);
  readonly mobileNavOpen = signal(false);
  readonly showNotifications = signal(false);
  readonly showUserMenu = signal(false);

  readonly todayLabel = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    .format(new Date())
    .replace('.', '');

  readonly tenantStatusLabel: Record<TenantStatus, string> = {
    ACTIVE: 'Workspace ativo',
    ONBOARDING: 'Em configuração',
    SUSPENDED: 'Suspenso'
  };

  readonly navGroups: NavGroup[] = [
    {
      groupName: 'Geral',
      items: [{ label: 'Visão geral', path: '/dashboard', icon: 'layout-dashboard' }]
    },
    {
      groupName: 'Operação',
      items: [
        { label: 'Agentes de IA', path: '/dashboard/agents', icon: 'bot' },
        { label: 'Conversas e chamadas', path: '/dashboard/conversations', icon: 'phone-call' },
        { label: 'Base de conhecimento', path: '/dashboard/knowledge', icon: 'book-open' },
        { label: 'Ferramentas e conectores', path: '/dashboard/integrations', icon: 'cpu' },
        { label: 'Telefonia e linhas', path: '/dashboard/telephony', icon: 'phone' }
      ]
    },
    {
      groupName: 'Gestão',
      items: [
        { label: 'Utilização e consumo', path: '/dashboard/usage', icon: 'bar-chart-2' },
        { label: 'Trilha de auditoria', path: '/dashboard/audit', icon: 'shield-check' },
        { label: 'Configurações', path: '/dashboard/settings', icon: 'settings' }
      ]
    }
  ];

  apiState(): 'online' | 'offline' | 'checking' {
    const status = this.session.health.status();
    if (status === 'loading') return 'checking';
    return this.session.apiOnline() ? 'online' : 'offline';
  }

  apiLabel(): string {
    return { online: 'conectada', offline: 'offline', checking: 'verificando…' }[this.apiState()];
  }

  apiDescription(): string {
    return {
      online: 'Spring Boot respondendo /actuator/health',
      offline: 'Inicie o backend em localhost:8080',
      checking: 'Consultando /actuator/health'
    }[this.apiState()];
  }

  /** POST /api/v1/auth/logout revoga o refresh token e limpa o cookie. */
  async logout(): Promise<void> {
    this.showUserMenu.set(false);
    try {
      await this.auth.logout();
    } catch {
      this.auth.clearLocalSession();
    }
    await this.router.navigate(['/login']);
  }

  toggleCollapse(): void {
    this.isCollapsed.update(v => !v);
  }

  openMobileNav(): void {
    this.mobileNavOpen.set(true);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }

  toggleNotifications(): void {
    this.showNotifications.update(v => !v);
    if (this.showNotifications()) this.showUserMenu.set(false);
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
    if (this.showUserMenu()) this.showNotifications.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.header-dropdown-wrap')) {
      this.showNotifications.set(false);
      this.showUserMenu.set(false);
    }
  }
}
