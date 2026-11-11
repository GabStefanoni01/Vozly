import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogCategory, BlogPost } from '../../../models/blog.models';
import { BlogContentService } from '../../../services/blog-content.service';
import { SeoService } from '../../../services/seo.service';
import { BlogHeaderComponent } from '../../../components/blog/blog-header/blog-header.component';
import { BlogFeaturedCardComponent } from '../../../components/blog/blog-featured-card/blog-featured-card.component';
import { BlogPostCardComponent } from '../../../components/blog/blog-post-card/blog-post-card.component';
import { BlogFooterComponent } from '../../../components/blog/blog-footer/blog-footer.component';

@Component({
  selector: 'app-blog-home',
  standalone: true,
  imports: [CommonModule, RouterLink, BlogHeaderComponent, BlogFeaturedCardComponent, BlogPostCardComponent, BlogFooterComponent],
  template: `
    <div class="bp">
      <app-blog-header [categories]="categories" (search)="onSearch($event)"></app-blog-header>

      <main class="bp-wrap">
        <!-- Busca -->
        <section *ngIf="isSearching; else editorial" class="bp-section">
          <h2 class="bp-label">
            {{ filteredPosts.length }} {{ filteredPosts.length === 1 ? 'resultado' : 'resultados' }} para “{{ currentSearchQuery }}”
          </h2>
          <div *ngIf="filteredPosts.length; else empty" class="bp-grid">
            <app-blog-post-card *ngFor="let post of filteredPosts" [post]="post"></app-blog-post-card>
          </div>
          <ng-template #empty>
            <p class="bp-empty">Nenhum artigo encontrado. Tente termos como “latência”, “LGPD” ou “Anatel”.</p>
          </ng-template>
        </section>

        <ng-template #editorial>
          <!-- Publicações mais recentes -->
          <section class="bp-section">
            <h2 class="bp-label">Publicações recentes</h2>
            <app-blog-featured-card *ngIf="featuredPost" [post]="featuredPost"></app-blog-featured-card>
            <div class="bp-grid bp-grid-spaced">
              <app-blog-post-card *ngFor="let post of recentPosts" [post]="post"></app-blog-post-card>
            </div>
          </section>

          <!-- Em destaque por categoria -->
          <section *ngFor="let cat of categories" class="bp-section bp-section-ruled">
            <div class="bp-section-head">
              <h2 class="bp-label">Em destaque: {{ cat.name }}</h2>
              <a [routerLink]="['/blog', cat.slug]" class="bp-more">Ver tudo →</a>
            </div>
            <div class="bp-grid">
              <app-blog-post-card *ngFor="let post of postsByCategory[cat.slug]" [post]="post"></app-blog-post-card>
            </div>
          </section>
        </ng-template>
      </main>

      <app-blog-footer [categories]="categories"></app-blog-footer>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .bp { background: #08080c; color: #ededf2; min-height: 100vh; }
    .bp-wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
    .bp-section { padding-top: 40px; }
    .bp-section-ruled { margin-top: 56px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
    .bp-section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
    .bp-label { font-size: 16px; font-weight: 500; color: #d4d4dc; margin: 0 0 24px; }
    .bp-more { font-size: 13px; color: #a78bfa; text-decoration: none; white-space: nowrap; }
    .bp-more:hover { color: #c4b5fd; }
    .bp-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 48px 28px; }
    .bp-grid-spaced { margin-top: 56px; }
    .bp-empty { color: #8a8a98; font-size: 14px; }
    @media (max-width: 960px) { .bp-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 600px) {
      .bp-wrap { padding: 0 16px; }
      .bp-grid { grid-template-columns: 1fr; gap: 36px; }
      .bp-grid-spaced { margin-top: 40px; }
    }
  `]
})
export class BlogHomeComponent implements OnInit {
  categories: BlogCategory[] = [];
  featuredPost?: BlogPost;
  recentPosts: BlogPost[] = [];
  postsByCategory: Record<string, BlogPost[]> = {};
  filteredPosts: BlogPost[] = [];
  isSearching = false;
  currentSearchQuery = '';

  constructor(
    private blogService: BlogContentService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.seoService.setBlogHomeSeo();
    this.categories = this.blogService.getCategories();
    this.featuredPost = this.blogService.getFeaturedPost();
    this.recentPosts = this.blogService
      .getAllPosts()
      .filter(p => p.slug !== this.featuredPost?.slug)
      .slice(0, 6);
    for (const cat of this.categories) {
      this.postsByCategory[cat.slug] = this.blogService.getPostsByCategory(cat.slug).slice(0, 3);
    }
  }

  onSearch(query: string): void {
    this.currentSearchQuery = query.trim();
    this.isSearching = this.currentSearchQuery.length > 0;
    this.filteredPosts = this.isSearching ? this.blogService.searchPosts(this.currentSearchQuery) : [];
  }
}
