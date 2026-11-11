import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { BlogCategory, BlogPost, SEOConfig } from '../models/blog.models';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly baseUrl = 'https://vozly.ai';
  private readonly defaultOgImage = 'https://vozly.ai/brand/dashboard-devices.png';
  private readonly siteName = 'Vozly — Inteligência Artificial Telefônica';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  public updateSeo(config: SEOConfig): void {
    // 1. Title
    this.titleService.setTitle(config.title);

    // 2. Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: config.description });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });

    // 3. Canonical URL
    this.setCanonicalUrl(config.canonicalUrl);

    // 4. Open Graph Tags
    this.metaService.updateTag({ property: 'og:site_name', content: this.siteName });
    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    this.metaService.updateTag({ property: 'og:url', content: config.canonicalUrl });
    this.metaService.updateTag({ property: 'og:type', content: config.ogType || 'website' });
    this.metaService.updateTag({ property: 'og:locale', content: 'pt_BR' });
    this.metaService.updateTag({
      property: 'og:image',
      content: config.ogImage ? this.resolveAbsoluteUrl(config.ogImage) : this.defaultOgImage
    });

    if (config.ogType === 'article') {
      if (config.publishedTime) {
        this.metaService.updateTag({ property: 'article:published_time', content: config.publishedTime });
      }
      if (config.modifiedTime) {
        this.metaService.updateTag({ property: 'article:modified_time', content: config.modifiedTime });
      }
      if (config.authorName) {
        this.metaService.updateTag({ property: 'article:author', content: config.authorName });
      }
      if (config.section) {
        this.metaService.updateTag({ property: 'article:section', content: config.section });
      }
      if (config.tags && config.tags.length > 0) {
        this.metaService.updateTag({ property: 'article:tag', content: config.tags.join(', ') });
      }
    }

    // 5. Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });
    this.metaService.updateTag({
      name: 'twitter:image',
      content: config.ogImage ? this.resolveAbsoluteUrl(config.ogImage) : this.defaultOgImage
    });

    // 6. JSON-LD Structured Data
    if (config.jsonLd) {
      this.setJsonLd(config.jsonLd);
    }
  }

  public setBlogHomeSeo(): void {
    const canonical = `${this.baseUrl}/blog`;
    const title = 'Vozly Insights — Tecnologia, Inteligência Artificial & Inovação';
    const description =
      'Publicação editorial da Vozly sobre o avanço da inteligência artificial conversacional, telecomunicações em nuvem, engenharia de sistemas e tendências do mercado B2B.';

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://vozly.ai/#organization',
          'name': 'Vozly',
          'url': 'https://vozly.ai',
          'logo': 'https://vozly.ai/brand/vozly-logo-horizontal.png',
          'description': 'Plataforma de inteligência artificial aplicada ao atendimento telefônico empresarial.'
        },
        {
          '@type': 'Blog',
          '@id': 'https://vozly.ai/blog/#blog',
          'name': 'Vozly Insights',
          'url': canonical,
          'description': description,
          'publisher': {
            '@id': 'https://vozly.ai/#organization'
          },
          'inLanguage': 'pt-BR'
        },
        {
          '@type': 'BreadcrumbList',
          '@id': 'https://vozly.ai/blog/#breadcrumbs',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Início',
              'item': 'https://vozly.ai'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Blog & Insights',
              'item': canonical
            }
          ]
        }
      ]
    };

    this.updateSeo({
      title,
      description,
      canonicalUrl: canonical,
      ogType: 'website',
      ogImage: '/brand/dashboard-devices.png',
      jsonLd
    });
  }

  public setCategorySeo(category: BlogCategory, postCount: number): void {
    const canonical = `${this.baseUrl}/blog/${category.slug}`;
    const title = `${category.name} — Vozly Insights`;
    const description = `${category.longDescription} Confira os artigos e análises técnicas publicadas pela redação da Vozly.`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${canonical}/#collection`,
          'name': category.name,
          'url': canonical,
          'description': description,
          'isPartOf': {
            '@type': 'Blog',
            '@id': 'https://vozly.ai/blog/#blog',
            'name': 'Vozly Insights'
          },
          'inLanguage': 'pt-BR'
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonical}/#breadcrumbs`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Início',
              'item': 'https://vozly.ai'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Blog',
              'item': 'https://vozly.ai/blog'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': category.name,
              'item': canonical
            }
          ]
        }
      ]
    };

    this.updateSeo({
      title,
      description,
      canonicalUrl: canonical,
      ogType: 'website',
      ogImage: category.coverImage,
      section: category.name,
      jsonLd
    });
  }

  public setArticleSeo(article: BlogPost): void {
    const canonical = `${this.baseUrl}/blog/${article.categorySlug}/${article.slug}`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `${canonical}/#article`,
          'headline': article.title,
          'alternativeHeadline': article.subtitle,
          'description': article.excerpt,
          'url': canonical,
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': canonical
          },
          'datePublished': article.publishedAt,
          'dateModified': article.updatedAt || article.publishedAt,
          'author': {
            '@type': 'Person',
            'name': article.author.name,
            'jobTitle': article.author.role,
            'worksFor': {
              '@type': 'Organization',
              'name': 'Vozly'
            }
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'Vozly',
            'url': 'https://vozly.ai',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://vozly.ai/brand/vozly-logo-horizontal.png'
            }
          },
          'image': this.resolveAbsoluteUrl(article.coverImage),
          'articleSection': article.categoryName,
          'keywords': article.tags.join(', '),
          'inLanguage': 'pt-BR'
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonical}/#breadcrumbs`,
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Início',
              'item': 'https://vozly.ai'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Blog',
              'item': 'https://vozly.ai/blog'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': article.categoryName,
              'item': `https://vozly.ai/blog/${article.categorySlug}`
            },
            {
              '@type': 'ListItem',
              'position': 4,
              'name': article.title,
              'item': canonical
            }
          ]
        }
      ]
    };

    this.updateSeo({
      title: `${article.title} — Vozly Insights`,
      description: article.metaDescription,
      canonicalUrl: canonical,
      ogType: 'article',
      ogImage: article.coverImage,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authorName: article.author.name,
      section: article.categoryName,
      tags: article.tags,
      jsonLd
    });
  }

  private setCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(schema: Record<string, unknown> | Array<Record<string, unknown>>): void {
    let script: HTMLScriptElement | null = this.document.getElementById('vozly-jsonld') as HTMLScriptElement;
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'vozly-jsonld';
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema, null, 2);
  }

  private resolveAbsoluteUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${cleanPath}`;
  }
}
