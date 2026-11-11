import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogCategory, BlogPost } from '../../../models/blog.models';
import { BlogContentService } from '../../../services/blog-content.service';
import { SeoService } from '../../../services/seo.service';
import { BlogHeaderComponent } from '../../../components/blog/blog-header/blog-header.component';
import { BlogPostCardComponent } from '../../../components/blog/blog-post-card/blog-post-card.component';
import { BlogFooterComponent } from '../../../components/blog/blog-footer/blog-footer.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';

@Component({
  selector: 'app-blog-article',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BlogHeaderComponent,
    BlogPostCardComponent,
    BlogFooterComponent,
    IconComponent
  ],
  template: `
    <div class="article-page-wrapper">
      <app-blog-header [categories]="categories"></app-blog-header>

      <main *ngIf="article" class="article-main">
        <div class="blog-container">
          <!-- Breadcrumb Navigation -->
          <nav class="breadcrumb-bar" aria-label="Breadcrumb">
            <ol class="breadcrumb-list">
              <li><a routerLink="/" class="crumb-link">Início</a></li>
              <li class="crumb-separator">/</li>
              <li><a routerLink="/blog" class="crumb-link">Blog</a></li>
              <li class="crumb-separator">/</li>
              <li>
                <a [routerLink]="['/blog', article.categorySlug]" class="crumb-link">
                  {{ article.categoryName }}
                </a>
              </li>
              <li class="crumb-separator">/</li>
              <li class="crumb-current" aria-current="page">{{ article.title }}</li>
            </ol>
          </nav>

          <!-- Article Header -->
          <header class="article-header">
            <div class="header-badge-row">
              <a [routerLink]="['/blog', article.categorySlug]" class="category-pill">
                {{ article.categoryName }}
              </a>
              <span class="meta-dot">•</span>
              <span class="read-estimate flex items-center gap-1.5">
                <app-icon name="clock" [size]="14" color="#A1A1AA"></app-icon>
                {{ article.readTimeMinutes }} min de leitura
              </span>
            </div>

            <h1 class="article-h1">{{ article.title }}</h1>
            <p class="article-subtitle">{{ article.subtitle }}</p>

            <!-- Author & Metadata Row -->
            <div class="author-meta-bar">
              <div class="author-profile">
                <img [src]="article.author.avatarUrl" [alt]="article.author.name" class="author-avatar" />
                <div class="author-details">
                  <span class="author-name">{{ article.author.name }}</span>
                  <span class="author-role">{{ article.author.role }}</span>
                </div>
              </div>

              <div class="date-and-actions">
                <div class="date-group">
                  <span class="published-date">Publicado em {{ article.publishedAtFormatted }}</span>
                  <span *ngIf="article.updatedAtFormatted" class="updated-date">
                    (Atualizado em {{ article.updatedAtFormatted }})
                  </span>
                </div>

                <!-- Social Share Buttons -->
                <div class="share-actions">
                  <button (click)="copyArticleLink()" class="share-btn" title="Copiar link do artigo" aria-label="Copiar link">
                    <app-icon [name]="linkCopied ? 'check' : 'copy'" [size]="16" [color]="linkCopied ? '#22C55E' : '#C084FC'"></app-icon>
                    <span *ngIf="linkCopied" class="text-xs text-green-400 font-semibold">Copiado!</span>
                  </button>

                  <a [href]="getLinkedInShareUrl()" target="_blank" rel="noopener noreferrer" class="share-btn" title="Compartilhar no LinkedIn" aria-label="Compartilhar no LinkedIn">
                    <span class="font-bold text-xs">in</span>
                  </a>

                  <a [href]="getTwitterShareUrl()" target="_blank" rel="noopener noreferrer" class="share-btn" title="Compartilhar no X (Twitter)" aria-label="Compartilhar no X">
                    <span class="font-bold text-xs">𝕏</span>
                  </a>

                  <a [href]="getWhatsAppShareUrl()" target="_blank" rel="noopener noreferrer" class="share-btn" title="Compartilhar no WhatsApp" aria-label="Compartilhar no WhatsApp">
                    <span class="font-bold text-xs">WA</span>
                  </a>
                </div>
              </div>
            </div>
          </header>

          <!-- Large Featured Cover Image -->
          <figure class="article-cover-figure">
            <img
              [src]="article.coverImage"
              [alt]="article.coverImageAlt"
              class="article-cover-img"
              loading="eager"
            />
            <figcaption class="cover-caption">
              <span>Foto: {{ article.coverImageCredit }}</span>
              <span class="caption-separator">•</span>
              <span>Licença: {{ article.coverImageLicense }}</span>
            </figcaption>
          </figure>

          <!-- Main Layout: Sidebar (Table of Contents) + Content Body -->
          <div class="article-body-layout">
            <!-- Sidebar / Table of Contents (Sticky) -->
            <aside class="article-sidebar">
              <div class="toc-sticky-box">
                <h4 class="toc-title">
                  <app-icon name="book-open" [size]="16" color="#A855F7"></app-icon>
                  Índice de Conteúdo
                </h4>

                <nav aria-label="Índice da publicação">
                  <ul class="toc-list">
                    <li
                      *ngFor="let item of article.tableOfContents"
                      [class.pl-3]="item.level === 3"
                      class="toc-item"
                    >
                      <a (click)="scrollToSection(item.id)" class="toc-link">
                        {{ item.title }}
                      </a>
                    </li>
                  </ul>
                </nav>

                <!-- Quick Share in Sidebar -->
                <div class="sidebar-share-box">
                  <span class="sidebar-share-label">Compartilhar Ensaio</span>
                  <div class="flex items-center gap-2 mt-2">
                    <button (click)="copyArticleLink()" class="sidebar-share-btn">
                      <app-icon name="copy" [size]="14" color="#A855F7"></app-icon>
                      <span>{{ linkCopied ? 'Link Copiado' : 'Copiar Link' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            <!-- Prose Content Body -->
            <article class="article-prose">
              <ng-container *ngFor="let block of article.contentBlocks">
                <!-- Paragraph -->
                <p *ngIf="block.type === 'paragraph'" class="prose-p">
                  {{ block.text }}
                </p>

                <!-- Heading 2 -->
                <h2
                  *ngIf="block.type === 'heading2'"
                  [id]="block.headingId"
                  class="prose-h2"
                >
                  {{ block.text }}
                </h2>

                <!-- Heading 3 -->
                <h3
                  *ngIf="block.type === 'heading3'"
                  [id]="block.headingId"
                  class="prose-h3"
                >
                  {{ block.text }}
                </h3>

                <!-- Blockquote -->
                <blockquote *ngIf="block.type === 'blockquote'" class="prose-quote">
                  <p class="quote-text">“{{ block.text }}”</p>
                </blockquote>

                <!-- Callout Box -->
                <div
                  *ngIf="block.type === 'callout'"
                  [ngClass]="'callout-' + (block.calloutType || 'info')"
                  class="prose-callout"
                >
                  <div class="callout-header">
                    <app-icon
                      [name]="getCalloutIcon(block.calloutType)"
                      [size]="18"
                      [color]="getCalloutColor(block.calloutType)"
                    ></app-icon>
                    <span class="callout-title">{{ block.calloutTitle }}</span>
                  </div>
                  <p class="callout-body">{{ block.text }}</p>
                </div>

                <!-- Code Block -->
                <div *ngIf="block.type === 'code'" class="prose-code-block">
                  <div class="code-header">
                    <span class="code-lang">{{ block.codeLanguage || 'código' }}</span>
                    <button
                      (click)="copyCode(block.codeSnippet || '')"
                      class="copy-code-btn"
                      title="Copiar código"
                    >
                      <app-icon name="copy" [size]="13" color="#A1A1AA"></app-icon>
                      <span>Copiar</span>
                    </button>
                  </div>
                  <pre class="code-pre"><code>{{ block.codeSnippet }}</code></pre>
                </div>

                <!-- List -->
                <ul *ngIf="block.type === 'list'" class="prose-ul">
                  <li *ngFor="let item of block.listItems" class="prose-li">
                    {{ item }}
                  </li>
                </ul>

                <!-- Table -->
                <div *ngIf="block.type === 'table'" class="table-container">
                  <table class="prose-table">
                    <thead>
                      <tr>
                        <th *ngFor="let header of block.tableHeaders">{{ header }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let row of block.tableRows">
                        <td *ngFor="let cell of row">{{ cell }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </ng-container>

              <!-- Tags -->
              <div *ngIf="article.tags && article.tags.length > 0" class="tags-container">
                <span class="tags-label">Tópicos:</span>
                <div class="tags-list">
                  <span *ngFor="let tag of article.tags" class="tag-pill">#{{ tag }}</span>
                </div>
              </div>

              <!-- Author Bio Box -->
              <div class="author-bio-box">
                <img [src]="article.author.avatarUrl" [alt]="article.author.name" class="bio-avatar" />
                <div class="bio-info">
                  <span class="bio-label">Sobre o Autor</span>
                  <h4 class="bio-name">{{ article.author.name }}</h4>
                  <p class="bio-role">{{ article.author.role }}</p>
                  <p class="bio-desc">{{ article.author.bio }}</p>
                </div>
              </div>

              <!-- Sources & References -->
              <div *ngIf="article.sources && article.sources.length > 0" class="sources-section">
                <h4 class="sources-heading">Fontes e Referências Citadas</h4>
                <ul class="sources-list">
                  <li *ngFor="let src of article.sources" class="source-item">
                    <a
                      *ngIf="src.url"
                      [href]="src.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="source-link"
                    >
                      {{ src.title }}
                      <app-icon name="external-link" [size]="12" color="#A855F7"></app-icon>
                    </a>
                    <span *ngIf="!src.url" class="source-text">{{ src.title }}</span>
                    <span *ngIf="src.publication" class="source-pub">({{ src.publication }}<ng-container *ngIf="src.date">, {{ src.date }}</ng-container>)</span>
                  </li>
                </ul>
              </div>
            </article>
          </div>

          <!-- Related Articles Section -->
          <section *ngIf="relatedArticles.length > 0" class="related-section">
            <div class="related-header">
              <div>
                <span class="related-tag">Continuidade de Leitura</span>
                <h3 class="related-title">Artigos Relacionados</h3>
              </div>
              <a [routerLink]="['/blog', article.categorySlug]" class="related-all-link">
                <span>Ver mais em {{ article.categoryName }}</span>
                <app-icon name="arrow-right" [size]="14" color="#C084FC"></app-icon>
              </a>
            </div>

            <div class="related-grid">
              <app-blog-post-card
                *ngFor="let related of relatedArticles"
                [post]="related"
              ></app-blog-post-card>
            </div>
          </section>
        </div>
      </main>

      <app-blog-footer [categories]="categories"></app-blog-footer>
    </div>
  `,
  styles: [`
    .article-page-wrapper {
      background: #060609;
      color: #FFFFFF;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .article-main {
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
      margin-bottom: 28px;
    }

    .breadcrumb-list {
      display: flex;
      align-items: center;
      gap: 8px;
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 13px;
      flex-wrap: wrap;
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
      max-width: 320px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Header */
    .article-header {
      max-width: 860px;
      margin: 0 auto 40px;
    }

    .header-badge-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 18px;
    }

    .category-pill {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #A855F7;
      background: rgba(168, 85, 247, 0.12);
      border: 1px solid rgba(168, 85, 247, 0.28);
      padding: 5px 14px;
      border-radius: 6px;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .category-pill:hover {
      background: rgba(168, 85, 247, 0.25);
      color: #FFFFFF;
    }

    .meta-dot {
      color: #52525B;
    }

    .read-estimate {
      font-size: 13.5px;
      color: #A1A1AA;
    }

    .article-h1 {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: clamp(30px, 4.5vw, 46px);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.2;
      color: #FFFFFF;
      margin: 0 0 16px;
    }

    .article-subtitle {
      font-family: var(--font-sans, 'Inter', sans-serif);
      font-size: clamp(16px, 2.2vw, 19px);
      color: #A1A1AA;
      line-height: 1.6;
      margin: 0 0 32px;
    }

    /* Author Meta Bar */
    .author-meta-bar {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    @media (min-width: 768px) {
      .author-meta-bar {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .author-profile {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .author-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1.5px solid #8B3DFF;
      background: #15151F;
    }

    .author-details {
      display: flex;
      flex-direction: column;
    }

    .author-name {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .author-role {
      font-size: 12px;
      color: #A1A1AA;
    }

    .date-and-actions {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }

    .date-group {
      display: flex;
      flex-direction: column;
      font-size: 12px;
      color: #71717A;
    }

    .share-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .share-btn {
      height: 34px;
      padding: 0 12px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(168, 85, 247, 0.22);
      border-radius: 8px;
      color: #FFFFFF;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .share-btn:hover {
      background: rgba(168, 85, 247, 0.16);
      border-color: #A855F7;
    }

    /* Cover Figure */
    .article-cover-figure {
      max-width: 980px;
      margin: 0 auto 56px;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(139, 61, 255, 0.25);
      background: #0E0D14;
      box-shadow: 0 15px 50px -10px rgba(0, 0, 0, 0.8);
    }

    .article-cover-img {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      display: block;
    }

    .cover-caption {
      padding: 12px 20px;
      background: #09080F;
      font-size: 12px;
      color: #71717A;
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .caption-separator {
      color: #3F3F46;
    }

    /* Body Layout */
    .article-body-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 48px;
      max-width: 1120px;
      margin: 0 auto 80px;
    }

    @media (min-width: 1024px) {
      .article-body-layout {
        grid-template-columns: 280px minmax(0, 1fr);
        align-items: start;
      }
    }

    /* Sidebar / Table of Contents */
    .article-sidebar {
      display: none;
    }

    @media (min-width: 1024px) {
      .article-sidebar {
        display: block;
      }
    }

    .toc-sticky-box {
      position: sticky;
      top: 32px;
      background: #0B0A12;
      border: 1px solid rgba(139, 61, 255, 0.2);
      border-radius: 14px;
      padding: 24px 20px;
    }

    .toc-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toc-link {
      font-size: 13px;
      color: #A1A1AA;
      cursor: pointer;
      transition: color 0.15s ease;
      line-height: 1.4;
      display: block;
    }

    .toc-link:hover {
      color: #C084FC;
    }

    .sidebar-share-box {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .sidebar-share-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #71717A;
    }

    .sidebar-share-btn {
      width: 100%;
      height: 36px;
      background: rgba(168, 85, 247, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.25);
      border-radius: 8px;
      color: #C084FC;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .sidebar-share-btn:hover {
      background: rgba(168, 85, 247, 0.2);
      color: #FFFFFF;
    }

    /* Prose Elements */
    .article-prose {
      max-width: 760px;
    }

    .prose-p {
      font-family: var(--font-sans, 'Inter', sans-serif);
      font-size: 16.5px;
      line-height: 1.75;
      color: #D4D4D8;
      margin: 0 0 24px;
    }

    .prose-h2 {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #FFFFFF;
      margin: 48px 0 20px;
      line-height: 1.3;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .prose-h3 {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 36px 0 16px;
      line-height: 1.35;
    }

    .prose-quote {
      margin: 36px 0;
      padding: 20px 28px;
      background: rgba(109, 0, 255, 0.08);
      border-left: 4px solid #8B3DFF;
      border-radius: 0 14px 14px 0;
    }

    .quote-text {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: 18px;
      font-style: italic;
      color: #E4E4E7;
      line-height: 1.6;
      margin: 0;
    }

    /* Callouts */
    .prose-callout {
      margin: 32px 0;
      padding: 22px 24px;
      border-radius: 14px;
    }

    .callout-tech {
      background: rgba(109, 0, 255, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.35);
    }

    .callout-warning {
      background: rgba(234, 179, 8, 0.08);
      border: 1px solid rgba(234, 179, 8, 0.3);
    }

    .callout-market {
      background: rgba(56, 189, 248, 0.08);
      border: 1px solid rgba(56, 189, 248, 0.3);
    }

    .callout-info {
      background: rgba(139, 61, 255, 0.08);
      border: 1px solid rgba(139, 61, 255, 0.25);
    }

    .callout-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .callout-title {
      font-size: 14.5px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .callout-body {
      font-size: 14.5px;
      color: #D4D4D8;
      line-height: 1.65;
      margin: 0;
    }

    /* Code */
    .prose-code-block {
      margin: 32px 0;
      background: #09080F;
      border: 1px solid rgba(139, 61, 255, 0.22);
      border-radius: 12px;
      overflow: hidden;
    }

    .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: #110F1D;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .code-lang {
      font-family: var(--font-mono, monospace);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #C084FC;
    }

    .copy-code-btn {
      background: transparent;
      border: none;
      color: #A1A1AA;
      cursor: pointer;
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: color 0.15s ease;
    }

    .copy-code-btn:hover {
      color: #FFFFFF;
    }

    .code-pre {
      padding: 20px;
      margin: 0;
      overflow-x: auto;
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
      font-size: 13.5px;
      line-height: 1.6;
      color: #E2E8F0;
    }

    /* Lists */
    .prose-ul {
      margin: 0 0 28px 24px;
      padding: 0;
      list-style-type: square;
    }

    .prose-li {
      font-size: 16px;
      color: #D4D4D8;
      line-height: 1.65;
      margin-bottom: 10px;
    }

    .prose-li::marker {
      color: #A855F7;
    }

    /* Table */
    .table-container {
      margin: 32px 0;
      overflow-x: auto;
      border-radius: 12px;
      border: 1px solid rgba(139, 61, 255, 0.2);
    }

    .prose-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13.5px;
    }

    .prose-table th {
      background: #12101C;
      color: #FFFFFF;
      padding: 14px 18px;
      font-weight: 700;
      border-bottom: 1px solid rgba(168, 85, 247, 0.25);
    }

    .prose-table td {
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #D4D4D8;
    }

    .prose-table tr:last-child td {
      border-bottom: none;
    }

    /* Tags */
    .tags-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 40px 0;
      flex-wrap: wrap;
    }

    .tags-label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #71717A;
    }

    .tags-list {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .tag-pill {
      font-size: 12px;
      color: #C084FC;
      background: rgba(168, 85, 247, 0.1);
      border: 1px solid rgba(168, 85, 247, 0.22);
      padding: 4px 12px;
      border-radius: 9999px;
    }

    /* Author Bio Box */
    .author-bio-box {
      margin: 48px 0;
      padding: 28px;
      background: #0E0D16;
      border: 1px solid rgba(139, 61, 255, 0.25);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    @media (min-width: 640px) {
      .author-bio-box {
        flex-direction: row;
        align-items: flex-start;
      }
    }

    .bio-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 2px solid #8B3DFF;
      background: #181525;
      flex-shrink: 0;
    }

    .bio-info {
      display: flex;
      flex-direction: column;
    }

    .bio-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #A855F7;
      margin-bottom: 4px;
    }

    .bio-name {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0 0 4px;
    }

    .bio-role {
      font-size: 13px;
      color: #C084FC;
      margin: 0 0 10px;
    }

    .bio-desc {
      font-size: 14px;
      color: #A1A1AA;
      line-height: 1.6;
      margin: 0;
    }

    /* Sources */
    .sources-section {
      margin: 40px 0;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .sources-heading {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #FFFFFF;
      margin: 0 0 14px;
    }

    .sources-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .source-item {
      font-size: 13px;
      color: #A1A1AA;
    }

    .source-link {
      color: #C084FC;
      text-decoration: underline;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .source-pub {
      margin-left: 6px;
      color: #71717A;
    }

    /* Related Section */
    .related-section {
      margin-top: 72px;
      padding-top: 48px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .related-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 32px;
    }

    .related-tag {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #A855F7;
      margin-bottom: 6px;
      display: block;
    }

    .related-title {
      font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
      font-size: 24px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0;
    }

    .related-all-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: #C084FC;
      text-decoration: none;
    }

    .related-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 28px;
    }

    @media (min-width: 640px) {
      .related-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .related-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .newsletter-wrap {
      margin-top: 64px;
      margin-bottom: 40px;
    }
  `]
})
export class BlogArticleComponent implements OnInit, OnDestroy {
  public article?: BlogPost;
  public categories: BlogCategory[] = [];
  public relatedArticles: BlogPost[] = [];
  public linkCopied: boolean = false;

  private routeSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogContentService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.categories = this.blogService.getCategories();

    this.routeSub = this.route.paramMap.subscribe(params => {
      const categorySlug = params.get('category');
      const postSlug = params.get('slug');

      if (!categorySlug || !postSlug) {
        this.router.navigate(['/blog']);
        return;
      }

      this.article = this.blogService.getPostBySlug(categorySlug, postSlug);
      if (!this.article) {
        this.router.navigate(['/blog', categorySlug]);
        return;
      }

      // 1. Atualizar SEO com Meta e JSON-LD BlogPosting
      this.seoService.setArticleSeo(this.article);

      // 2. Carregar Artigos Relacionados
      this.relatedArticles = this.blogService.getRelatedPosts(this.article, 3);

      // Rolar suavemente para o topo na navegação
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  public scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  public copyArticleLink(): void {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      this.linkCopied = true;
      setTimeout(() => (this.linkCopied = false), 2500);
    }
  }

  public copyCode(snippet: string): void {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(snippet);
    }
  }

  public getLinkedInShareUrl(): string {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://vozly.ai/blog');
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  }

  public getTwitterShareUrl(): string {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://vozly.ai/blog');
    const text = encodeURIComponent(this.article?.title || 'Vozly Insights');
    return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
  }

  public getWhatsAppShareUrl(): string {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://vozly.ai/blog');
    const text = encodeURIComponent(`${this.article?.title} - ${url}`);
    return `https://api.whatsapp.com/send?text=${text}`;
  }

  public getCalloutIcon(type?: string): string {
    switch (type) {
      case 'warning': return 'alert-circle';
      case 'tech': return 'cpu';
      case 'market': return 'trending-up';
      default: return 'info';
    }
  }

  public getCalloutColor(type?: string): string {
    switch (type) {
      case 'warning': return '#EAB308';
      case 'tech': return '#C084FC';
      case 'market': return '#38BDF8';
      default: return '#A855F7';
    }
  }
}
