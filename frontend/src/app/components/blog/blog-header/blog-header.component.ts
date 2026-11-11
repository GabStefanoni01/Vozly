import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../ui/icon/icon.component';
import { BlogCategory } from '../../../models/blog.models';

@Component({
  selector: 'app-blog-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule, IconComponent],
  template: `
    <header class="blog-header-root">
      <!-- Barra Superior Institucional -->
      <div class="top-util-bar">
        <div class="blog-container flex-between">
          <a routerLink="/" class="back-link group" aria-label="Retornar à plataforma Vozly">
            <app-icon name="arrow-right" [size]="14" class="rotate-180 transition-transform group-hover:-translate-x-1" color="#A855F7"></app-icon>
            <span class="text-xs text-zinc-400 group-hover:text-white transition-colors">Retornar a vozly.ai</span>
          </a>

          <div class="editorial-badge">
            <span class="pulse-dot"></span>
            <span class="text-[11px] font-mono uppercase tracking-wider text-purple-300/90">Publicação Editorial Oficial</span>
          </div>

          <div class="top-actions">
            <a routerLink="/login" class="text-xs text-zinc-300 hover:text-white transition-colors font-medium mr-4">Painel</a>
            <a routerLink="/register" class="btn-pill-sm">Acessar Vozly</a>
          </div>
        </div>
      </div>

      <!-- Banner Principal (VOZLY INSIGHTS) -->
      <div class="hero-banner">
        <div class="ambient-glow-mesh"></div>
        <div class="blog-container hero-content">
          <div class="brand-row">
            <a routerLink="/blog" class="brand-link" aria-label="Vozly Insights Início">
              <img src="brand/vozly-logo-horizontal.png" alt="Vozly" class="h-8 md:h-9 w-auto object-contain" />
            </a>
            <span class="divider-slash">/</span>
            <span class="publication-tag">INSIGHTS</span>
          </div>

          <h1 class="main-editorial-title">
            VOZLY <span class="gradient-text">INSIGHTS</span>
          </h1>

          <p class="main-editorial-subtitle">
            Perspectivas, tecnologia e inteligência para o futuro das empresas.
          </p>

          <!-- Barra de Busca Rápida -->
          <div class="search-wrapper">
            <div class="search-input-box">
              <app-icon name="search" [size]="18" color="#A1A1AA" class="search-icon"></app-icon>
              <input
                type="text"
                placeholder="Pesquisar artigos, tópicos de IA ou engenharia..."
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange($event)"
                class="search-input"
                aria-label="Pesquisar no blog"
              />
              <button
                *ngIf="searchQuery"
                (click)="clearSearch()"
                class="clear-btn"
                aria-label="Limpar busca"
              >
                <app-icon name="x" [size]="14" color="#A1A1AA"></app-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra Horizontal de Navegação por Categorias (Palantir Style) -->
      <nav class="category-nav-bar" aria-label="Navegação por categorias do blog">
        <div class="blog-container">
          <ul class="category-list">
            <li class="category-item">
              <a
                routerLink="/blog"
                [routerLinkActiveOptions]="{ exact: true }"
                routerLinkActive="active"
                class="category-link"
              >
                Todas as Publicações
              </a>
            </li>

            <li *ngFor="let cat of categories" class="category-item">
              <a
                [routerLink]="['/blog', cat.slug]"
                routerLinkActive="active"
                class="category-link"
              >
                {{ cat.name }}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .blog-header-root {
      background: #060609;
      border-bottom: 1px solid rgba(139, 61, 255, 0.15);
      position: relative;
      z-index: 20;
    }

    .blog-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .top-util-bar {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 10px 0;
      background: rgba(8, 8, 12, 0.7);
      backdrop-filter: blur(12px);
    }

    .flex-between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }

    .editorial-badge {
      display: none;
      align-items: center;
      gap: 8px;
      padding: 3px 12px;
      border-radius: 9999px;
      background: rgba(109, 0, 255, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.25);
    }

    @media (min-width: 768px) {
      .editorial-badge {
        display: inline-flex;
      }
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #A855F7;
      box-shadow: 0 0 8px #A855F7;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .top-actions {
      display: flex;
      align-items: center;
    }

    .btn-pill-sm {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: #fff;
      background: linear-gradient(135deg, #6D00FF 0%, #A855F7 100%);
      padding: 6px 14px;
      border-radius: 9999px;
      text-decoration: none;
      transition: all 0.2s ease;
      box-shadow: 0 2px 10px rgba(109, 0, 255, 0.3);
    }

    .btn-pill-sm:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(168, 85, 247, 0.45);
    }

    /* Hero Banner */
    .hero-banner {
      position: relative;
      padding: 64px 0 52px;
      overflow: hidden;
      background: radial-gradient(circle at 50% 0%, rgba(109, 0, 255, 0.14) 0%, rgba(6, 6, 9, 0) 70%);
    }

    .ambient-glow-mesh {
      position: absolute;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      width: 700px;
      height: 350px;
      background: radial-gradient(ellipse at center, rgba(168, 85, 247, 0.18) 0%, rgba(109, 0, 255, 0.04) 60%, transparent 80%);
      filter: blur(50px);
      pointer-events: none;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .brand-link {
      display: inline-flex;
      align-items: center;
    }

    .divider-slash {
      color: rgba(168, 85, 247, 0.5);
      font-size: 20px;
      font-weight: 300;
    }

    .publication-tag {
      font-family: var(--font-mono, monospace);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: #C084FC;
      background: rgba(168, 85, 247, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.25);
      padding: 3px 10px;
      border-radius: 4px;
    }

    .main-editorial-title {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: clamp(32px, 6vw, 56px);
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #FFFFFF;
      margin: 0 0 16px;
      line-height: 1.1;
    }

    .gradient-text {
      background: linear-gradient(135deg, #FFFFFF 20%, #C084FC 70%, #8B3DFF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .main-editorial-subtitle {
      font-family: var(--font-sans, 'Inter', sans-serif);
      font-size: clamp(15px, 2vw, 18px);
      color: #A1A1AA;
      max-width: 640px;
      margin: 0 0 32px;
      line-height: 1.6;
    }

    /* Search */
    .search-wrapper {
      width: 100%;
      max-width: 520px;
    }

    .search-input-box {
      position: relative;
      display: flex;
      align-items: center;
      background: rgba(21, 21, 27, 0.85);
      border: 1px solid rgba(168, 85, 247, 0.22);
      border-radius: 12px;
      padding: 0 16px;
      transition: all 0.25s ease;
    }

    .search-input-box:focus-within {
      border-color: #A855F7;
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.25);
      background: rgba(25, 25, 34, 0.95);
    }

    .search-icon {
      margin-right: 12px;
      flex-shrink: 0;
    }

    .search-input {
      width: 100%;
      height: 46px;
      background: transparent;
      border: none;
      outline: none;
      color: #FFFFFF;
      font-size: 14px;
    }

    .search-input::placeholder {
      color: #71717A;
    }

    .clear-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Category Nav Bar */
    .category-nav-bar {
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      background: #09090D;
    }

    .category-list {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: none;
      padding: 14px 0;
      margin: 0;
      list-style: none;
    }

    .category-list::-webkit-scrollbar {
      display: none;
    }

    .category-item {
      flex-shrink: 0;
    }

    .category-link {
      display: inline-block;
      padding: 8px 18px;
      border-radius: 9999px;
      font-size: 13.5px;
      font-weight: 500;
      color: #A1A1AA;
      text-decoration: none;
      transition: all 0.2s ease;
      border: 1px solid transparent;
      white-space: nowrap;
    }

    .category-link:hover {
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.04);
    }

    .category-link.active {
      color: #FFFFFF;
      background: rgba(109, 0, 255, 0.2);
      border-color: rgba(168, 85, 247, 0.45);
      box-shadow: 0 0 16px rgba(109, 0, 255, 0.25);
      font-weight: 600;
    }
  `]
})
export class BlogHeaderComponent {
  @Input() categories: BlogCategory[] = [];
  @Output() search = new EventEmitter<string>();

  public searchQuery: string = '';

  public onSearchChange(query: string): void {
    this.search.emit(query);
  }

  public clearSearch(): void {
    this.searchQuery = '';
    this.search.emit('');
  }
}
