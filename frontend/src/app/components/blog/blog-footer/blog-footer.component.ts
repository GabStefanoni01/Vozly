import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogCategory } from '../../../models/blog.models';

@Component({
  selector: 'app-blog-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bf">
      <div class="bf-wrap">
        <div class="bf-top">
          <a routerLink="/blog" class="bf-brand" aria-label="Vozly Insights">
            <img src="brand/vozly-wordmark-trim.png" alt="Vozly" width="431" height="107" />
            <span>Insights</span>
          </a>
          <nav class="bf-links" aria-label="Rodapé do blog">
            <a routerLink="/blog">Início</a>
            <a *ngFor="let cat of categories" [routerLink]="['/blog', cat.slug]">{{ cat.name }}</a>
            <a routerLink="/">vozly.ai</a>
          </nav>
        </div>
        <div class="bf-bottom">
          <span>© {{ year }} Vozly. Todos os direitos reservados.</span>
          <span>Fotos das capas: Wikimedia Commons — autor e licença indicados em cada artigo.</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }
    .bf { border-top: 1px solid rgba(255, 255, 255, 0.08); background: #08080c; color: #8a8a98; margin-top: 96px; }
    .bf-wrap { max-width: 1120px; margin: 0 auto; padding: 40px 24px 32px; }
    .bf-top { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
    .bf-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #ededf2; font-size: 15px; font-weight: 500; }
    .bf-brand img { height: 22px; width: auto; display: block; }
    .bf-links { display: flex; flex-wrap: wrap; gap: 20px; }
    .bf-links a { color: #9a9aa8; text-decoration: none; font-size: 13px; }
    .bf-links a:hover { color: #ededf2; }
    .bf-bottom {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      font-size: 12px;
      color: #6f6f7d;
    }
  `]
})
export class BlogFooterComponent {
  @Input() categories: BlogCategory[] = [];
  readonly year = new Date().getFullYear();
}
