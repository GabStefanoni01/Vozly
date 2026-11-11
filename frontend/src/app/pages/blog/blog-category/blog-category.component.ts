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
import { BlogFooterComponent } from '../../../components/blog/blog-footer/blog-footer.component';

@Component({
  selector: 'app-blog-category',
  standalone: true,
  imports: [CommonModule, RouterLink, BlogHeaderComponent, BlogPostCardComponent, BlogFeaturedCardComponent, BlogFooterComponent],
  template: `
    <div class="bp">
      <app-blog-header [categories]="allCategories" (search)="onSearch($event)"></app-blog-header>

      <main class="bp-wrap">
        <header *ngIf="category" class="cat-head">
          <h1 class="cat-title">{{ category.name }}</h1>
          <p class="cat-desc">{{ category.longDescription }}</p>
          <span class="cat-count">{{ categoryPosts.length }} {{ categoryPosts.length === 1 ? 'publicação' : 'publicações' }}</span>
        </header>

        <section *ngIf="isSearching; else list" class="bp-section">
          <h2 class="bp-label">{{ filteredPosts.length }} resultados para “{{ currentSearchQuery }}”</h2>
          <div *ngIf="filteredPosts.length; else empty" class="bp-grid">
            <app-blog-post-card *ngFor="let post of filteredPosts" [post]="post"></app-blog-post-card>
          </div>
          <ng-template #empty><p class="bp-empty">Nenhum artigo encontrado nesta categoria.</p></ng-template>
        </section>

        <ng-template #list>
          <section *ngIf="categoryPosts.length" class="bp-section">
            <h2 class="bp-label">Mais recente</h2>
            <app-blog-featured-card [post]="categoryPosts[0]"></app-blog-featured-card>
            <div *ngIf="categoryPosts.length > 1" class="bp-grid bp-grid-spaced">
              <app-blog-post-card *ngFor="let post of categoryPosts.slice(1)" [post]="post"></app-blog-post-card>
            </div>
          </section>
        </ng-template>

        <section class="bp-section bp-section-ruled">
          <h2 class="bp-label">Outras categorias</h2>
          <div class="other-list">
            <a *ngFor="let other of otherCategories" [routerLink]="['/blog', other.slug]" class="other">
              <span class="other-name">{{ other.name }} →</span>
              <span class="other-desc">{{ other.description }}</span>
            </a>
          </div>
        </section>
      </main>

      <app-blog-footer [categories]="allCategories"></app-blog-footer>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .bp { background: #08080c; color: #ededf2; min-height: 100vh; }
    .bp-wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
    .cat-head { padding: 48px 0 8px; max-width: 720px; }
    .cat-title { font-size: 36px; line-height: 1.15; font-weight: 600; letter-spacing: -0.02em; margin: 0 0 12px; }
    .cat-desc { font-size: 15px; line-height: 1.65; color: #a1a1ae; margin: 0 0 12px; }
    .cat-count { font-size: 12px; color: #7a7a88; }
    .bp-section { padding-top: 40px; }
    .bp-section-ruled { margin-top: 56px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
    .bp-label { font-size: 16px; font-weight: 500; color: #d4d4dc; margin: 0 0 24px; }
    .bp-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 48px 28px; }
    .bp-grid-spaced { margin-top: 56px; }
    .bp-empty { color: #8a8a98; font-size: 14px; }
    .other-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .other {
      display: flex; flex-direction: column; gap: 6px; padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 4px; text-decoration: none; color: inherit;
      transition: border-color 0.2s;
    }
    .other:hover { border-color: rgba(139, 92, 246, 0.6); }
    .other-name { font-size: 15px; font-weight: 500; }
    .other-desc { font-size: 13px; color: #8a8a98; line-height: 1.5; }
    @media (max-width: 960px) { .bp-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 600px) {
      .bp-wrap { padding: 0 16px; }
      .cat-title { font-size: 28px; }
      .bp-grid, .other-list { grid-template-columns: 1fr; }
      .bp-grid { gap: 36px; }
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
