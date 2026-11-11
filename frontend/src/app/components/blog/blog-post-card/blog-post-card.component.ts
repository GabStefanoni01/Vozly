import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../../../models/blog.models';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-blog-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <article *ngIf="post" class="post-card group">
      <!-- Media Cover -->
      <a [routerLink]="['/blog', post.categorySlug, post.slug]" class="media-link" [attr.aria-label]="post.title">
        <div class="image-wrapper">
          <img
            [src]="post.coverImage"
            [alt]="post.coverImageAlt"
            class="card-image"
            loading="lazy"
          />
          <div class="hover-glow"></div>
        </div>
      </a>

      <!-- Body -->
      <div class="card-body">
        <div class="meta-row">
          <a [routerLink]="['/blog', post.categorySlug]" class="category-tag">
            {{ post.categoryName }}
          </a>
          <span class="read-estimate flex items-center gap-1">
            <app-icon name="clock" [size]="12" color="#71717A"></app-icon>
            {{ post.readTimeMinutes }} min
          </span>
        </div>

        <h3 class="card-title">
          <a [routerLink]="['/blog', post.categorySlug, post.slug]" class="title-anchor">
            {{ post.title }}
          </a>
        </h3>

        <p class="card-excerpt">
          {{ post.excerpt }}
        </p>

        <!-- Footer -->
        <div class="card-footer">
          <span class="date-text">{{ post.publishedAtFormatted }}</span>
          <a [routerLink]="['/blog', post.categorySlug, post.slug]" class="read-more-link" aria-label="Ler publicação">
            <span class="text-xs font-semibold text-purple-400 group-hover:text-purple-300">Ler</span>
            <app-icon name="arrow-right" [size]="14" class="transition-transform group-hover:translate-x-1" color="#A855F7"></app-icon>
          </a>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .post-card {
      background: #0E0D14;
      border: 1px solid rgba(139, 61, 255, 0.16);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .post-card:hover {
      border-color: rgba(168, 85, 247, 0.45);
      box-shadow: 0 10px 30px -10px rgba(109, 0, 255, 0.22);
      transform: translateY(-3px);
      background: #12101B;
    }

    /* Media */
    .media-link {
      display: block;
      position: relative;
      overflow: hidden;
      aspect-ratio: 16 / 9;
    }

    .image-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }

    .post-card:hover .card-image {
      transform: scale(1.04);
    }

    .hover-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .post-card:hover .hover-glow {
      opacity: 1;
    }

    /* Body */
    .card-body {
      padding: 22px 20px 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .category-tag {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #C084FC;
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .category-tag:hover {
      color: #FFFFFF;
    }

    .read-estimate {
      font-size: 12px;
      color: #71717A;
    }

    .card-title {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: 18px;
      font-weight: 700;
      line-height: 1.35;
      margin: 0 0 10px;
      color: #FFFFFF;
    }

    .title-anchor {
      color: #FFFFFF;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .title-anchor:hover {
      color: #C084FC;
    }

    .card-excerpt {
      font-family: var(--font-sans, 'Inter', sans-serif);
      font-size: 13.5px;
      color: #A1A1AA;
      line-height: 1.6;
      margin: 0 0 20px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex-grow: 1;
    }

    /* Footer */
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      margin-top: auto;
    }

    .date-text {
      font-size: 12px;
      color: #71717A;
    }

    .read-more-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }
  `]
})
export class BlogPostCardComponent {
  @Input({ required: true }) post!: BlogPost;
}
