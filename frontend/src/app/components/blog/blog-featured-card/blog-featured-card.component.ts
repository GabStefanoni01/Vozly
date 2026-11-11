import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../../../models/blog.models';
import { blogShortDate } from '../shared/blog-date';

/** Publicação em destaque: capa grande à esquerda, título e resumo à direita. */
@Component({
  selector: 'app-blog-featured-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <article class="fc">
      <a [routerLink]="['/blog', post.categorySlug, post.slug]" class="fc-cover" [attr.aria-label]="post.title">
        <img [src]="post.coverImage" [alt]="post.coverImageAlt" fetchpriority="high" decoding="async" />
      </a>
      <div class="fc-body">
        <span class="fc-cat">{{ post.categoryName }}</span>
        <a [routerLink]="['/blog', post.categorySlug, post.slug]" class="fc-title-link">
          <h2 class="fc-title">{{ post.title }}</h2>
        </a>
        <p class="fc-sub">{{ post.subtitle }}</p>
        <div class="fc-meta">
          <img src="brand/vozly-app-icon-trim.png" alt="" class="fc-avatar" />
          <span>{{ post.author.name }}</span>
          <span class="dot">·</span>
          <time [attr.datetime]="post.publishedAt">{{ shortDate(post.publishedAt) }}</time>
          <span class="dot">·</span>
          <span>{{ post.readTimeMinutes }} min de leitura</span>
        </div>
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; }
    .fc { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 32px; align-items: start; }
    .fc-cover { display: block; aspect-ratio: 2 / 1; overflow: hidden; border-radius: 2px; background: #15151c; }
    .fc-cover img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s ease; }
    .fc-cover:hover img { transform: scale(1.03); }
    .fc-body { display: flex; flex-direction: column; gap: 12px; padding-top: 4px; }
    .fc-cat { font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: #a78bfa; }
    .fc-title-link { color: inherit; text-decoration: none; }
    .fc-title { font-size: 28px; line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; margin: 0; color: #ededf2; transition: color 0.2s; }
    .fc-title-link:hover .fc-title { color: #c4b5fd; }
    .fc-sub { font-size: 15px; line-height: 1.6; color: #a1a1ae; margin: 0; }
    .fc-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; font-size: 12px; color: #7a7a88; }
    .fc-avatar { width: 16px; height: auto; }
    .dot { color: #4a4a55; }
    @media (max-width: 820px) {
      .fc { grid-template-columns: 1fr; gap: 20px; }
      .fc-title { font-size: 22px; }
    }
  `]
})
export class BlogFeaturedCardComponent {
  @Input({ required: true }) post!: BlogPost;
  readonly shortDate = blogShortDate;
}
