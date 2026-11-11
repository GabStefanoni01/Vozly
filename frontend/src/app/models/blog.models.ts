export interface Author {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
}

export interface BlogCategory {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  badgeLabel: string;
  coverImage: string;
  coverImageAlt: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export type ContentBlockType =
  | 'paragraph'
  | 'heading2'
  | 'heading3'
  | 'blockquote'
  | 'callout'
  | 'code'
  | 'list'
  | 'table'
  | 'image';

export interface BlogPostContentBlock {
  type: ContentBlockType;
  text?: string;
  headingId?: string;
  calloutType?: 'info' | 'tech' | 'market' | 'warning';
  calloutTitle?: string;
  codeLanguage?: string;
  codeSnippet?: string;
  listItems?: string[];
  tableHeaders?: string[];
  tableRows?: string[][];
  imageUrl?: string;
  imageCaption?: string;
  imageAlt?: string;
}

export interface ContentSource {
  title: string;
  url?: string;
  publication?: string;
  date?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  categorySlug: 'tecnologia-inovacao' | 'engenharia-inteligencia-artificial' | 'ultimas-noticias' | string;
  categoryName: string;
  coverImage: string;
  coverImageAlt: string;
  coverImageCredit: string;
  coverImageLicense: string;
  author: Author;
  publishedAt: string;
  publishedAtFormatted: string;
  updatedAt?: string;
  updatedAtFormatted?: string;
  readTimeMinutes: number;
  featured?: boolean;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  tableOfContents: TableOfContentsItem[];
  contentBlocks: BlogPostContentBlock[];
  sources?: ContentSource[];
}

export interface SEOConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  section?: string;
  tags?: string[];
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}
