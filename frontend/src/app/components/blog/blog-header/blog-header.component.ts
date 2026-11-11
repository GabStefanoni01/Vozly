import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BlogCategory } from '../../../models/blog.models';
import { IconComponent } from '../../ui/icon/icon.component';

/**
 * Cabeçalho da publicação Vozly Insights.
 * Estrutura editorial: faixa com a marca em destaque → linha da publicação → abas por categoria.
 */
@Component({
  selector: 'app-blog-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <header class="bh">
      <!-- Faixa da marca -->
      <div class="bh-masthead">
        <div class="bh-wrap bh-masthead-inner">
          <span class="bh-meta bh-meta-left">Vozly Insights<br />Blog da Vozly</span>
          <a routerLink="/blog" class="bh-wordmark" aria-label="Vozly Insights — início do blog">
            <img src="brand/vozly-wordmark-trim.png" alt="Vozly" width="431" height="107" />
          </a>
          <span class="bh-meta bh-meta-right">Voz, IA e<br />telecomunicações</span>
        </div>
      </div>

      <!-- Linha da publicação -->
      <div class="bh-wrap bh-pub">
        <a routerLink="/blog" class="bh-pub-id">
          <img src="brand/vozly-app-icon-trim.png" alt="" class="bh-pub-icon" width="173" height="158" />
          <span class="bh-pub-text">
            <span class="bh-pub-name">Vozly Insights</span>
            <span class="bh-pub-desc">Engenharia de agentes de voz, inteligência artificial e o mercado de telecom.</span>
          </span>
        </a>
        <a routerLink="/" class="bh-cta">Conhecer a Vozly</a>
      </div>

      <!-- Abas -->
      <nav class="bh-tabs-row" aria-label="Categorias do blog">
        <div class="bh-wrap bh-tabs-inner">
          <div class="bh-tabs">
            <a routerLink="/blog" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="bh-tab">Início</a>
            <a
              *ngFor="let cat of categories"
              [routerLink]="['/blog', cat.slug]"
              routerLinkActive="active"
              class="bh-tab"
            >{{ cat.name }}</a>
            <span class="bh-tab-sep" aria-hidden="true"></span>
            <a routerLink="/" class="bh-tab">vozly.ai</a>
          </div>

          <label class="bh-search" *ngIf="search.observed">
            <app-icon name="search" [size]="14" color="#8A8A98"></app-icon>
            <input
              type="search"
              placeholder="Buscar no blog"
              aria-label="Buscar artigos"
              (input)="search.emit($any($event.target).value)"
            />
          </label>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    :host { display: block; }
    .bh { background: #08080c; color: #ededf2; }
    .bh-wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px; }

    .bh-masthead {
      background:
        radial-gradient(60% 120% at 50% 0%, rgba(124, 58, 237, 0.22), transparent 70%),
        #0d0d13;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .bh-masthead-inner {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 24px;
      padding-top: 36px;
      padding-bottom: 36px;
    }
    .bh-meta {
      font-size: 10px;
      line-height: 1.5;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #6f6f7d;
    }
    .bh-meta-right { text-align: right; }
    .bh-wordmark img { display: block; height: 72px; width: auto; }

    .bh-pub {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding-top: 28px;
      padding-bottom: 24px;
    }
    .bh-pub-id { display: flex; align-items: center; gap: 16px; text-decoration: none; color: inherit; min-width: 0; }
    .bh-pub-icon { width: 56px; height: auto; flex-shrink: 0; }
    .bh-pub-text { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
    .bh-pub-name { font-size: 24px; font-weight: 600; letter-spacing: -0.01em; }
    .bh-pub-desc { font-size: 13px; color: #8a8a98; }
    .bh-cta {
      flex-shrink: 0;
      font-size: 13px;
      font-weight: 500;
      color: #ededf2;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      transition: border-color 0.2s, background 0.2s;
    }
    .bh-cta:hover { border-color: #8b5cf6; background: rgba(139, 92, 246, 0.12); }

    .bh-tabs-row { border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .bh-tabs-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
    .bh-tabs { display: flex; align-items: center; gap: 28px; overflow-x: auto; scrollbar-width: none; }
    .bh-tabs::-webkit-scrollbar { display: none; }
    .bh-tab {
      position: relative;
      white-space: nowrap;
      font-size: 13px;
      color: #9a9aa8;
      text-decoration: none;
      padding: 14px 0;
      transition: color 0.2s;
    }
    .bh-tab:hover { color: #ededf2; }
    .bh-tab.active { color: #ededf2; }
    .bh-tab.active::after {
      content: '';
      position: absolute;
      left: 0; right: 0; bottom: -1px;
      height: 2px;
      background: #8b5cf6;
    }
    .bh-tab-sep { width: 1px; height: 16px; background: rgba(255, 255, 255, 0.14); flex-shrink: 0; }

    .bh-search {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      padding: 6px 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .bh-search:focus-within { border-color: rgba(139, 92, 246, 0.6); }
    .bh-search input {
      width: 160px;
      background: transparent;
      border: 0;
      outline: none;
      color: #ededf2;
      font-size: 13px;
    }
    .bh-search input::placeholder { color: #6f6f7d; }

    @media (max-width: 720px) {
      .bh-masthead-inner { grid-template-columns: 1fr; justify-items: center; padding-top: 28px; padding-bottom: 28px; }
      .bh-meta { display: none; }
      .bh-wordmark img { height: 48px; }
      .bh-pub { flex-direction: column; align-items: flex-start; }
      .bh-pub-name { font-size: 20px; }
      .bh-tabs-inner { flex-direction: column; align-items: stretch; gap: 0; }
      .bh-search { margin: 0 0 12px; }
      .bh-search input { width: 100%; }
    }
  `]
})
export class BlogHeaderComponent {
  @Input() categories: BlogCategory[] = [];
  @Output() search = new EventEmitter<string>();
}
