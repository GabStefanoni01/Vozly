import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <header class="header" [class.scrolled]="isScrolled" [class.menu-open]="mobileMenuOpen">
      <div class="container header-container">
        <!-- Logo Oficial Vozly (Símbolo + Tipografia) -->
        <a href="#" class="brand-link" aria-label="Vozly Início">
          <div class="brand-logo-wrapper">
            <img
              src="brand/vozly-logo-horizontal.png"
              alt="Vozly"
              class="brand-logo-full"
            />
          </div>
        </a>

        <!-- Navegação Desktop Central -->
        <nav class="nav-desktop" aria-label="Navegação principal">
          <ul class="nav-list">
            <li><a href="#como-funciona" class="nav-link">Como funciona</a></li>
            <li><a href="#demonstracao" class="nav-link">Demonstração</a></li>
            <li><a href="#recursos" class="nav-link">Recursos</a></li>
            <li><a href="#aplicacoes" class="nav-link">Aplicações</a></li>
            <li><a href="#painel" class="nav-link">Painel</a></li>
            <li><a href="#sobre" class="nav-link">Sobre</a></li>
            <li><a routerLink="/blog" class="nav-link">Blog</a></li>
          </ul>
        </nav>

        <!-- Ações à Direita -->
        <div class="header-actions">
          <a routerLink="/login" class="btn btn-ghost btn-sm btn-login">
            Entrar
          </a>
          <button class="btn btn-primary btn-sm btn-cta" (click)="openStartDemo()">
            Começar agora
          </button>

          <!-- Botão Hamburger Mobile -->
          <button
            class="mobile-toggle"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="mobileMenuOpen"
            aria-label="Alternar menu de navegação"
          >
            <app-icon [name]="mobileMenuOpen ? 'x' : 'menu'" [size]="24"></app-icon>
          </button>
        </div>
      </div>

      <!-- Menu Mobile Dropdown -->
      <div class="mobile-drawer" *ngIf="mobileMenuOpen">
        <nav class="mobile-nav" aria-label="Navegação móvel">
          <ul class="mobile-nav-list">
            <li>
              <a href="#como-funciona" (click)="closeMobileMenu()" class="mobile-nav-link">
                <app-icon name="activity" [size]="18" color="#A855F7"></app-icon>
                Como funciona
              </a>
            </li>
            <li>
              <a href="#demonstracao" (click)="closeMobileMenu()" class="mobile-nav-link">
                <app-icon name="phone-call" [size]="18" color="#A855F7"></app-icon>
                Demonstração da Chamada
              </a>
            </li>
            <li>
              <a href="#recursos" (click)="closeMobileMenu()" class="mobile-nav-link">
                <app-icon name="sparkles" [size]="18" color="#A855F7"></app-icon>
                Recursos
              </a>
            </li>
            <li>
              <a href="#aplicacoes" (click)="closeMobileMenu()" class="mobile-nav-link">
                <app-icon name="briefcase" [size]="18" color="#A855F7"></app-icon>
                Aplicações
              </a>
            </li>
            <li>
              <a href="#painel" (click)="closeMobileMenu()" class="mobile-nav-link">
                <app-icon name="layers" [size]="18" color="#A855F7"></app-icon>
                Painel
              </a>
            </li>
            <li>
              <a href="#sobre" (click)="closeMobileMenu()" class="mobile-nav-link">
                <app-icon name="shield-check" [size]="18" color="#A855F7"></app-icon>
                Sobre
              </a>
            </li>
            <li>
              <a routerLink="/blog" (click)="closeMobileMenu()" class="mobile-nav-link">
                <app-icon name="book-open" [size]="18" color="#A855F7"></app-icon>
                Blog & Insights
              </a>
            </li>
          </ul>

          <div class="mobile-drawer-actions">
            <a routerLink="/login" (click)="closeMobileMenu()" class="btn btn-secondary w-full">
              Entrar
            </a>
            <button class="btn btn-primary w-full" (click)="openStartDemo(); closeMobileMenu()">
              Começar agora
            </button>
          </div>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--header-height);
      z-index: 1000;
      background: rgba(5, 5, 5, 0.4);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-bottom: 1px solid transparent;
      transition: all var(--transition-base);
    }

    .header.scrolled {
      background: rgba(11, 11, 15, 0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom-color: rgba(41, 37, 48, 0.6);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
    }

    .header-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    /* Logo Oficial */
    .brand-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      transition: opacity var(--transition-fast);
    }

    .brand-link:hover {
      opacity: 0.9;
    }

    .brand-logo-wrapper {
      display: flex;
      align-items: center;
      height: 38px;
    }

    .brand-logo-full {
      height: 34px;
      width: auto;
      object-fit: contain;
    }

    /* Navegação Desktop */
    .nav-desktop {
      display: none;
    }

    @media (min-width: 900px) {
      .nav-desktop {
        display: block;
      }
    }

    .nav-list {
      display: flex;
      align-items: center;
      gap: 32px;
      list-style: none;
    }

    .nav-link {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      transition: color var(--transition-fast);
      position: relative;
      padding: 6px 0;
    }

    .nav-link:hover {
      color: #FFFFFF;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--light-purple);
      transition: width var(--transition-fast);
      border-radius: 2px;
    }

    .nav-link:hover::after {
      width: 100%;
    }

    /* Ações */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-login {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .btn-cta {
      font-size: 14px;
      padding: 8px 20px;
    }

    /* Toggle Mobile */
    .mobile-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      color: var(--text-primary);
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
    }

    @media (min-width: 900px) {
      .mobile-toggle {
        display: none;
      }
    }

    /* Mobile Drawer */
    .mobile-drawer {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(11, 11, 15, 0.98);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--border-subtle);
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
      animation: slideDown 250ms ease-out;
    }

    @media (min-width: 900px) {
      .mobile-drawer {
        display: none;
      }
    }

    .mobile-nav-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 15px;
      font-weight: 500;
      color: var(--text-secondary);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      background: rgba(255, 255, 255, 0.02);
    }

    .mobile-nav-link:hover {
      color: #FFFFFF;
      background: rgba(109, 0, 255, 0.1);
    }

    .mobile-drawer-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .w-full {
      width: 100%;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class HeaderComponent {
  @Output() openDemo = new EventEmitter<{ title: string; desc: string }>();

  isScrolled = false;
  mobileMenuOpen = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  openAuthDemo(): void {
    this.openDemo.emit({
      title: 'Ambiente de Acesso — Vozly',
      desc: 'Área de autenticação demonstrativa da plataforma. A autenticação com isolamento multi-tenant será implementada na etapa de backend e microsserviços.'
    });
  }

  openStartDemo(): void {
    this.openDemo.emit({
      title: 'Iniciar com a Vozly',
      desc: 'Cadastre sua empresa na lista antecipada para acompanhar os testes operacionais do agente de voz inteligente.'
    });
  }
}
