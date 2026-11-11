import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogCategory, BlogPost } from '../../../models/blog.models';
import { BlogContentService } from '../../../services/blog-content.service';
import { SeoService } from '../../../services/seo.service';
import { BlogHeaderComponent } from '../../../components/blog/blog-header/blog-header.component';
import { BlogFeaturedCardComponent } from '../../../components/blog/blog-featured-card/blog-featured-card.component';
import { BlogPostCardComponent } from '../../../components/blog/blog-post-card/blog-post-card.component';
import { BlogNewsletterComponent } from '../../../components/blog/blog-newsletter/blog-newsletter.component';
import { BlogFooterComponent } from '../../../components/blog/blog-footer/blog-footer.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';

@Component({
  selector: 'app-blog-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BlogHeaderComponent,
    BlogFeaturedCardComponent,
    BlogPostCardComponent,
    BlogNewsletterComponent,
    BlogFooterComponent,
    IconComponent
  ],
  template: `
    <div class="blog-page-wrapper">
      <!-- Cabeçalho & Navegação Editorial -->
      <app-blog-header
        [categories]="categories"
        (search)="onSearch($event)"
      ></app-blog-header>

      <main class="blog-main-content">
        <div class="blog-container">
          <!-- Modo Busca Ativa -->
          <div *ngIf="isSearching" class="search-results-section">
            <div class="results-header">
              <h2 class="results-title">
                Resultados para: <span class="highlight">"{{ currentSearchQuery }}"</span>
              </h2>
              <span class="results-count">{{ filteredPosts.length }} publicações encontradas</span>
            </div>

            <div *ngIf="filteredPosts.length > 0" class="articles-grid">
              <app-blog-post-card
                *ngFor="let post of filteredPosts"
                [post]="post"
              ></app-blog-post-card>
            </div>

            <div *ngIf="filteredPosts.length === 0" class="no-results-box">
              <app-icon name="search" [size]="32" color="#A855F7"></app-icon>
              <p class="text-zinc-300 font-medium text-base mt-3">Nenhum artigo encontrado com os termos pesquisados.</p>
              <p class="text-zinc-500 text-sm mt-1">Tente pesquisar por palavras-chave como "STT", "LGPD", "latência" ou "Anatel".</p>
            </div>
          </div>

          <!-- Modo Editorial Padrão (Sem Busca) -->
          <div *ngIf="!isSearching">
            <!-- 1. Artigo Principal em Destaque (Palantir Style Hero) -->
            <section *ngIf="featuredPost" class="section-featured" aria-labelledby="featured-heading">
              <div class="section-badge-row">
                <span class="section-lead-tag">Destaque da Edição</span>
              </div>
              <app-blog-featured-card [post]="featuredPost"></app-blog-featured-card>
            </section>

            <!-- 2. Publicações Recentes (Grade de 3 Colunas) -->
            <section class="section-recent" aria-labelledby="recent-heading">
              <div class="section-header-row">
                <div>
                  <h2 id="recent-heading" class="section-heading">Publicações Recentes</h2>
                  <p class="section-subtext">Ensaios técnicos, análises de mercado e pesquisas de ponta.</p>
                </div>
              </div>

              <div class="articles-grid">
                <app-blog-post-card
                  *ngFor="let post of recentPosts"
                  [post]="post"
                ></app-blog-post-card>
              </div>
            </section>

            <!-- 3. Seções Temáticas por Categoria -->
            <section *ngFor="let cat of categories" class="category-showcase-section">
              <div class="category-section-header">
                <div>
                  <span class="category-meta-badge">{{ cat.badgeLabel }}</span>
                  <h3 class="category-section-title">{{ cat.name }}</h3>
                  <p class="category-section-desc">{{ cat.description }}</p>
                </div>
                <a [routerLink]="['/blog', cat.slug]" class="view-category-btn group">
                  <span>Explorar tema</span>
                  <app-icon name="arrow-right" [size]="15" class="transition-transform group-hover:translate-x-1" color="#C084FC"></app-icon>
                </a>
              </div>

              <div class="articles-grid">
                <app-blog-post-card
                  *ngFor="let post of getPostsForCategory(cat.slug)"
                  [post]="post"
                ></app-blog-post-card>
              </div>
            </section>

            <!-- 4. Caixa de Newsletter / Inscrição Editorial -->
            <section class="newsletter-section">
              <app-blog-newsletter></app-blog-newsletter>
            </section>
          </div>
        </div>
      </main>

      <!-- Rodapé Editorial -->
      <app-blog-footer [categories]="categories"></app-blog-footer>
    </div>
  `,
  styles: [`
    .blog-page-wrapper {
      background: #060609;
      color: #FFFFFF;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .blog-main-content {
      flex: 1;
      padding-top: 48px;
    }

    .blog-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Sections */
    .section-featured {
      margin-bottom: 72px;
    }

    .section-badge-row {
      margin-bottom: 16px;
    }

    .section-lead-tag {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #C084FC;
      background: rgba(168, 85, 247, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.25);
      padding: 4px 12px;
      border-radius: 9999px;
    }

    .section-recent {
      margin-bottom: 80px;
    }

    .section-header-row {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .section-heading {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: clamp(24px, 3vw, 32px);
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #FFFFFF;
      margin: 0 0 6px;
    }

    .section-subtext {
      font-size: 14.5px;
      color: #A1A1AA;
      margin: 0;
    }

    /* 3-Column Grid */
    .articles-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
    }

    @media (min-width: 640px) {
      .articles-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .articles-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    /* Category Showcase */
    .category-showcase-section {
      margin-bottom: 80px;
      padding-top: 40px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .category-section-header {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 32px;
    }

    @media (min-width: 768px) {
      .category-section-header {
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
      }
    }

    .category-meta-badge {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #A855F7;
      margin-bottom: 6px;
      display: inline-block;
    }

    .category-section-title {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: 24px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 4px;
    }

    .category-section-desc {
      font-size: 14px;
      color: #A1A1AA;
      margin: 0;
      max-width: 580px;
    }

    .view-category-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
      font-weight: 600;
      color: #C084FC;
      text-decoration: none;
      white-space: nowrap;
      padding: 8px 16px;
      border-radius: 8px;
      background: rgba(168, 85, 247, 0.08);
      border: 1px solid rgba(168, 85, 247, 0.2);
      transition: all 0.2s ease;
    }

    .view-category-btn:hover {
      background: rgba(168, 85, 247, 0.18);
      color: #FFFFFF;
      border-color: rgba(168, 85, 247, 0.4);
    }

    /* Newsletter */
    .newsletter-section {
      margin-bottom: 40px;
    }

    /* Search Results */
    .search-results-section {
      padding-bottom: 60px;
    }

    .results-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .results-title {
      font-size: 22px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0;
    }

    .highlight {
      color: #C084FC;
    }

    .results-count {
      font-size: 13.5px;
      color: #A1A1AA;
    }

    .no-results-box {
      text-align: center;
      padding: 64px 20px;
      background: #0E0D14;
      border: 1px dashed rgba(168, 85, 247, 0.3);
      border-radius: 16px;
    }
  `]
})
export class BlogHomeComponent implements OnInit {
  public categories: BlogCategory[] = [];
  public featuredPost?: BlogPost;
  public recentPosts: BlogPost[] = [];
  public filteredPosts: BlogPost[] = [];
  public isSearching: boolean = false;
  public currentSearchQuery: string = '';

  constructor(
    private blogService: BlogContentService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    // 1. Configurar SEO para a Home do Blog
    this.seoService.setBlogHomeSeo();

    // 2. Carregar Categorias e Artigos
    this.categories = this.blogService.getCategories();
    this.featuredPost = this.blogService.getFeaturedPost();
    
    // Obter posts recentes excluindo o post em destaque
    const all = this.blogService.getAllPosts();
    this.recentPosts = all
      .filter(p => !this.featuredPost || p.slug !== this.featuredPost.slug)
      .slice(0, 6);
  }

  public getPostsForCategory(categorySlug: string): BlogPost[] {
    return this.blogService.getPostsByCategory(categorySlug).slice(0, 3);
  }

  public onSearch(query: string): void {
    this.currentSearchQuery = query;
    if (query && query.trim().length > 0) {
      this.isSearching = true;
      this.filteredPosts = this.blogService.searchPosts(query);
    } else {
      this.isSearching = false;
      this.filteredPosts = [];
    }
  }
}
