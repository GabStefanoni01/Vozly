import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogCategory, BlogPost } from '../../../models/blog.models';
import { BlogContentService } from '../../../services/blog-content.service';
import { SeoService } from '../../../services/seo.service';
import { BlogHeaderComponent } from '../../../components/blog/blog-header/blog-header.component';
import { BlogPostCardComponent } from '../../../components/blog/blog-post-card/blog-post-card.component';
import { BlogFeaturedCardComponent } from '../../../components/blog/blog-featured-card/blog-featured-card.component';
import { BlogNewsletterComponent } from '../../../components/blog/blog-newsletter/blog-newsletter.component';
import { BlogFooterComponent } from '../../../components/blog/blog-footer/blog-footer.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';

@Component({
  selector: 'app-blog-category',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BlogHeaderComponent,
    BlogPostCardComponent,
    BlogFeaturedCardComponent,
    BlogNewsletterComponent,
    BlogFooterComponent,
    IconComponent
  ],
  template: `
    <div class="category-page-wrapper">
      <app-blog-header [categories]="allCategories" (search)="onSearch($event)"></app-blog-header>

      <main class="category-main">
        <div class="blog-container">
          <!-- Breadcrumb Navigation -->
          <nav class="breadcrumb-bar" aria-label="Breadcrumb">
            <ol class="breadcrumb-list">
              <li><a routerLink="/" class="crumb-link">Início</a></li>
              <li class="crumb-separator">/</li>
              <li><a routerLink="/blog" class="crumb-link">Blog</a></li>
              <li class="crumb-separator">/</li>
              <li class="crumb-current" aria-current="page">{{ category?.name }}</li>
            </ol>
          </nav>

          <!-- Category Hero Banner -->
          <header *ngIf="category" class="category-hero">
            <div class="category-badge-pill">
              <app-icon [name]="category.icon" [size]="16" color="#C084FC"></app-icon>
              <span>{{ category.badgeLabel }}</span>
            </div>

            <h1 class="category-title">{{ category.name }}</h1>
            <p class="category-description">{{ category.longDescription }}</p>

            <div class="category-meta-info">
              <span class="meta-tag">{{ categoryPosts.length }} publicações disponíveis</span>
              <span class="meta-dot">•</span>
              <span class="meta-tag">Atualizado periodicamente pela redação</span>
            </div>
          </header>

          <!-- Active Search within Category -->
          <div *ngIf="isSearching" class="search-results-box">
            <div class="search-header">
              <h2 class="search-title">Pesquisa em {{ category?.name }}: "{{ currentSearchQuery }}"</h2>
              <span class="search-count">{{ filteredPosts.length }} resultados</span>
            </div>

            <div class="articles-grid">
              <app-blog-post-card *ngFor="let post of filteredPosts" [post]="post"></app-blog-post-card>
            </div>
          </div>

          <!-- Category Posts List -->
          <div *ngIf="!isSearching && categoryPosts.length > 0" class="category-posts-layout">
            <!-- First post as Category Lead (if available) -->
            <section *ngIf="categoryPosts[0]" class="category-lead-section">
              <span class="lead-label">Mais recente em {{ category?.name }}</span>
              <app-blog-featured-card [post]="categoryPosts[0]"></app-blog-featured-card>
            </section>

            <!-- Remaining Category Articles Grid -->
            <section *ngIf="categoryPosts.length > 1" class="remaining-posts-section">
              <h2 class="remaining-heading">Outras publicações neste tema</h2>
              <div class="articles-grid">
                <app-blog-post-card
                  *ngFor="let post of categoryPosts.slice(1)"
                  [post]="post"
                ></app-blog-post-card>
              </div>
            </section>
          </div>

          <!-- Explore Other Categories Strip -->
          <section class="other-categories-section">
            <h3 class="other-title">Explorar outros temas editoriais</h3>
            <div class="other-grid">
              <a
                *ngFor="let other of otherCategories"
                [routerLink]="['/blog', other.slug]"
                class="other-card group"
              >
                <div class="other-card-header">
                  <app-icon [name]="other.icon" [size]="20" color="#A855F7"></app-icon>
                  <app-icon name="arrow-right" [size]="16" class="transition-transform group-hover:translate-x-1" color="#C084FC"></app-icon>
                </div>
                <h4 class="other-name">{{ other.name }}</h4>
                <p class="other-desc">{{ other.description }}</p>
              </a>
            </div>
          </section>

          <!-- Newsletter -->
          <section class="newsletter-wrap">
            <app-blog-newsletter></app-blog-newsletter>
          </section>
        </div>
      </main>

      <app-blog-footer [categories]="allCategories"></app-blog-footer>
    </div>
  `,
  styles: [`
    .category-page-wrapper {
      background: #060609;
      color: #FFFFFF;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .category-main {
      flex: 1;
      padding-top: 32px;
    }

    .blog-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Breadcrumbs */
    .breadcrumb-bar {
      margin-bottom: 32px;
    }

    .breadcrumb-list {
      display: flex;
      align-items: center;
      gap: 8px;
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 13px;
    }

    .crumb-link {
      color: #A1A1AA;
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .crumb-link:hover {
      color: #FFFFFF;
    }

    .crumb-separator {
      color: #52525B;
    }

    .crumb-current {
      color: #C084FC;
      font-weight: 500;
    }

    /* Category Hero */
    .category-hero {
      padding: 40px 0 56px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 48px;
    }

    .category-badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 14px;
      border-radius: 9999px;
      background: rgba(109, 0, 255, 0.15);
      border: 1px solid rgba(168, 85, 247, 0.3);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #C084FC;
      margin-bottom: 16px;
    }

    .category-title {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: clamp(32px, 5vw, 48px);
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #FFFFFF;
      margin: 0 0 16px;
      line-height: 1.15;
    }

    .category-description {
      font-family: var(--font-sans, 'Inter', sans-serif);
      font-size: clamp(15px, 2vw, 17px);
      color: #A1A1AA;
      line-height: 1.65;
      max-width: 760px;
      margin: 0 0 24px;
    }

    .category-meta-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: #71717A;
    }

    .meta-dot {
      color: #3F3F46;
    }

    /* Posts Layout */
    .category-lead-section {
      margin-bottom: 64px;
    }

    .lead-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #A855F7;
      margin-bottom: 12px;
    }

    .remaining-posts-section {
      margin-bottom: 72px;
    }

    .remaining-heading {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: 24px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 28px;
    }

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

    /* Other Categories */
    .other-categories-section {
      margin-bottom: 72px;
      padding-top: 48px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .other-title {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 24px;
    }

    .other-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }

    @media (min-width: 768px) {
      .other-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .other-card {
      background: #0E0D14;
      border: 1px solid rgba(139, 61, 255, 0.18);
      border-radius: 14px;
      padding: 24px;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .other-card:hover {
      background: #13111C;
      border-color: rgba(168, 85, 247, 0.45);
      transform: translateY(-2px);
    }

    .other-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .other-name {
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 6px;
      transition: color 0.15s ease;
    }

    .other-card:hover .other-name {
      color: #C084FC;
    }

    .other-desc {
      font-size: 13px;
      color: #A1A1AA;
      line-height: 1.55;
      margin: 0;
    }

    .newsletter-wrap {
      margin-bottom: 40px;
    }

    /* Search in Category */
    .search-results-box {
      margin-bottom: 60px;
    }

    .search-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      padding-bottom: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .search-title {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0;
    }

    .search-count {
      font-size: 13px;
      color: #A1A1AA;
    }
  `]
})
export class BlogCategoryComponent implements OnInit, OnDestroy {
  public category?: BlogCategory;
  public allCategories: BlogCategory[] = [];
  public otherCategories: BlogCategory[] = [];
  public categoryPosts: BlogPost[] = [];
  public filteredPosts: BlogPost[] = [];
  public isSearching: boolean = false;
  public currentSearchQuery: string = '';

  private routeSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogContentService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.allCategories = this.blogService.getCategories();

    this.routeSub = this.route.paramMap.subscribe(params => {
      const categorySlug = params.get('category');
      if (!categorySlug) {
        this.router.navigate(['/blog']);
        return;
      }

      this.category = this.blogService.getCategoryBySlug(categorySlug);
      if (!this.category) {
        this.router.navigate(['/blog']);
        return;
      }

      this.otherCategories = this.allCategories.filter(c => c.slug !== categorySlug);
      this.categoryPosts = this.blogService.getPostsByCategory(categorySlug);

      // Atualizar SEO
      this.seoService.setCategorySeo(this.category, this.categoryPosts.length);

      // Resetar busca
      this.isSearching = false;
      this.filteredPosts = [];
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  public onSearch(query: string): void {
    this.currentSearchQuery = query;
    if (query && query.trim().length > 0 && this.category) {
      this.isSearching = true;
      this.filteredPosts = this.blogService.searchPosts(query, this.category.slug);
    } else {
      this.isSearching = false;
      this.filteredPosts = [];
    }
  }
}
