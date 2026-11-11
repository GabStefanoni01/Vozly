import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../../../models/blog.models';
import { blogShortDate } from '../shared/blog-date';

/** Card de publicação: capa 16:9, título, resumo e linha de metadados. */
@Component({
  selector: 'app-blog-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <article class="pc">
      <a [routerLink]="['/blog', post.categorySlug, post.slug]" class="pc-link">
        <div class="pc-cover">
          <img [src]="post.coverImage" [alt]="post.coverImageAlt" loading="lazy" decoding="async" />
        </div>
        <span class="pc-cat">{{ post.categoryName }}</span>
        <h3 class="pc-title">{{ post.title }}</h3>
        <p class="pc-excerpt">{{ post.subtitle }}</p>
      </a>
      <div class="pc-meta">
        <img src="brand/vozly-app-icon-trim.png" alt="" class="pc-avatar" />
        <span>{{ post.author.name }}</span>
        <span class="dot">·</span>
        <time [attr.datetime]="post.publishedAt">{{ shortDate(post.publishedAt) }}</time>
        <span class="dot">·</span>
        <span>{{ post.readTimeMinutes }} min de leitura</span>
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; min-width: 0; }
    .pc { display: flex; flex-direction: column; height: 100%; }
    .pc-link { color: inherit; text-decoration: none; display: flex; flex-direction: column; }
    .pc-cover {
      aspect-ratio: 16 / 9;
      overflow: hidden;
      border-radius: 2px;
      background: #15151c;
      margin-bottom: 16px;
    }
    .pc-cover img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease, filter 0.3s; }
    .pc-link:hover .pc-cover img { transform: scale(1.03); }
    .pc-cat { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: #a78bfa; margin-bottom: 8px; }
    .pc-title {
      font-size: 17px;
      line-height: 1.35;
      font-weight: 600;
      color: #ededf2;
      margin: 0 0 8px;
      transition: color 0.2s;
    }
    .pc-link:hover .pc-title { color: #c4b5fd; }
    .pc-excerpt {
      font-size: 13.5px;
      line-height: 1.55;
      color: #9a9aa8;
      margin: 0 0 14px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .pc-meta {
      margin-top: auto;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 12px;
      color: #7a7a88;
    }
    .pc-avatar { width: 16px; height: auto; }
    .dot { color: #4a4a55; }
  `]
})
export class BlogPostCardComponent {
  @Input({ required: true }) post!: BlogPost;
  readonly shortDate = blogShortDate;
}
