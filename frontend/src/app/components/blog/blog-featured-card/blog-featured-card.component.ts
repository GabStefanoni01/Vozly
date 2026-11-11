import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../../../models/blog.models';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-blog-featured-card',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <article *ngIf="post" class="featured-card group">
      <div class="featured-grid">
        <!-- Visual Cover Media -->
        <a [routerLink]="['/blog', post.categorySlug, post.slug]" class="media-container" [attr.aria-label]="post.title">
          <div class="media-inner">
            <img
              [src]="post.coverImage"
              [alt]="post.coverImageAlt"
              class="cover-image"
              loading="eager"
            />
            <div class="media-overlay"></div>
            <div class="featured-pill">
              <span class="star-icon">★</span>
              <span>Destaque Editorial</span>
            </div>
          </div>
        </a>

        <!-- Content Area -->
        <div class="content-container">
          <div class="meta-header">
            <a [routerLink]="['/blog', post.categorySlug]" class="category-badge">
              {{ post.categoryName }}
            </a>
            <span class="meta-dot">•</span>
            <span class="read-time flex items-center gap-1">
              <app-icon name="clock" [size]="13" color="#A1A1AA"></app-icon>
              {{ post.readTimeMinutes }} min de leitura
            </span>
          </div>

          <h2 class="featured-title">
            <a [routerLink]="['/blog', post.categorySlug, post.slug]" class="title-link">
              {{ post.title }}
            </a>
          </h2>

          <p class="featured-excerpt">
            {{ post.excerpt }}
          </p>

          <!-- Footer Meta: Author & Action -->
          <div class="card-footer">
            <div class="author-info">
              <img [src]="post.author.avatarUrl" [alt]="post.author.name" class="author-avatar" />
              <div class="author-text">
                <span class="author-name">{{ post.author.name }}</span>
                <span class="publish-date">{{ post.publishedAtFormatted }}</span>
              </div>
            </div>

            <a [routerLink]="['/blog', post.categorySlug, post.slug]" class="read-btn group/btn">
              <span>Ler artigo completo</span>
              <app-icon name="arrow-right" [size]="16" class="transition-transform group-hover/btn:translate-x-1" color="#C084FC"></app-icon>
            </a>
          </div>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .featured-card {
      background: linear-gradient(180deg, rgba(28, 24, 43, 0.45) 0%, rgba(15, 14, 23, 0.85) 100%);
      border: 1px solid rgba(168, 85, 247, 0.28);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.7);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .featured-card:hover {
      border-color: rgba(168, 85, 247, 0.55);
      box-shadow: 0 15px 50px -10px rgba(109, 0, 255, 0.28);
      transform: translateY(-2px);
    }

    .featured-grid {
      display: grid;
      grid-template-columns: 1fr;
    }

    @media (min-width: 1024px) {
      .featured-grid {
        grid-template-columns: 1.25fr 1fr;
      }
    }

    /* Media */
    .media-container {
      position: relative;
      display: block;
      overflow: hidden;
      min-height: 280px;
    }

    @media (min-width: 1024px) {
      .media-container {
        min-height: 420px;
      }
    }

    .media-inner {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .featured-card:hover .cover-image {
      transform: scale(1.03);
    }

    .media-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(10, 10, 15, 0.6) 100%);
    }

    .featured-pill {
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(15, 14, 23, 0.85);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(168, 85, 247, 0.4);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #C084FC;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .star-icon {
      color: #EAB308;
    }

    /* Content */
    .content-container {
      padding: 32px 28px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 20px;
    }

    @media (min-width: 1024px) {
      .content-container {
        padding: 44px 40px;
      }
    }

    .meta-header {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .category-badge {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #A855F7;
      background: rgba(168, 85, 247, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.25);
      padding: 4px 12px;
      border-radius: 6px;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .category-badge:hover {
      background: rgba(168, 85, 247, 0.25);
      color: #FFFFFF;
    }

    .meta-dot {
      color: #52525B;
    }

    .read-time {
      font-size: 13px;
      color: #A1A1AA;
    }

    .featured-title {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: clamp(22px, 3vw, 32px);
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.25;
      margin: 0;
    }

    .title-link {
      color: #FFFFFF;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .title-link:hover {
      color: #C084FC;
    }

    .featured-excerpt {
      font-family: var(--font-sans, 'Inter', sans-serif);
      font-size: 15px;
      color: #A1A1AA;
      line-height: 1.65;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Footer */
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .author-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .author-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1.5px solid #8B3DFF;
      background: #15151F;
    }

    .author-text {
      display: flex;
      flex-direction: column;
    }

    .author-name {
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .publish-date {
      font-size: 12px;
      color: #71717A;
    }

    .read-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13.5px;
      font-weight: 600;
      color: #C084FC;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .read-btn:hover {
      color: #FFFFFF;
    }
  `]
})
export class BlogFeaturedCardComponent {
  @Input({ required: true }) post!: BlogPost;
}
