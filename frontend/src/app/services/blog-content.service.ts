import { Injectable } from '@angular/core';
import { BlogCategory, BlogPost } from '../models/blog.models';
import { ALL_BLOG_POSTS, BLOG_CATEGORIES } from '../content/blog';

@Injectable({
  providedIn: 'root'
})
export class BlogContentService {
  private readonly categories: BlogCategory[] = BLOG_CATEGORIES;
  private readonly posts: BlogPost[] = ALL_BLOG_POSTS;

  public getCategories(): BlogCategory[] {
    return [...this.categories];
  }

  public getCategoryBySlug(slug: string): BlogCategory | undefined {
    return this.categories.find(c => c.slug === slug);
  }

  public getAllPosts(): BlogPost[] {
    return [...this.posts];
  }

  public getFeaturedPost(): BlogPost {
    const featured = this.posts.find(p => p.featured);
    return featured || this.posts[0];
  }

  public getRecentPosts(excludeSlug?: string, limit: number = 6): BlogPost[] {
    return this.posts
      .filter(p => !excludeSlug || p.slug !== excludeSlug)
      .slice(0, limit);
  }

  public getPostsByCategory(categorySlug: string): BlogPost[] {
    return this.posts.filter(p => p.categorySlug === categorySlug);
  }

  public getPostBySlug(categorySlug: string, postSlug: string): BlogPost | undefined {
    return this.posts.find(
      p => p.categorySlug === categorySlug && p.slug === postSlug
    );
  }

  public getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
    // 1. Same category first, excluding itself
    const sameCategory = this.posts.filter(
      p => p.categorySlug === currentPost.categorySlug && p.slug !== currentPost.slug
    );

    if (sameCategory.length >= limit) {
      return sameCategory.slice(0, limit);
    }

    // 2. Fallback to any other post
    const others = this.posts.filter(
      p => p.categorySlug !== currentPost.categorySlug && p.slug !== currentPost.slug
    );

    return [...sameCategory, ...others].slice(0, limit);
  }

  public searchPosts(query: string, categorySlug?: string): BlogPost[] {
    const clean = query.trim().toLowerCase();
    if (!clean && !categorySlug) {
      return this.getAllPosts();
    }

    return this.posts.filter(p => {
      const matchesCategory = !categorySlug || p.categorySlug === categorySlug;
      if (!matchesCategory) return false;

      if (!clean) return true;

      const titleMatch = p.title.toLowerCase().includes(clean);
      const excerptMatch = p.excerpt.toLowerCase().includes(clean);
      const tagMatch = p.tags.some(t => t.toLowerCase().includes(clean));

      return titleMatch || excerptMatch || tagMatch;
    });
  }
}
