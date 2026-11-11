import { BlogCategory, BlogPost } from '../../models/blog.models';
import { BLOG_CATEGORIES } from './categories.data';
import { TECNOLOGIA_INOVACAO_POSTS } from './tecnologia-inovacao';
import { ENGENHARIA_IA_POSTS } from './engenharia-inteligencia-artificial';
import { ULTIMAS_NOTICIAS_POSTS } from './ultimas-noticias';

export const ALL_BLOG_POSTS: BlogPost[] = [
  ...ENGENHARIA_IA_POSTS,
  ...TECNOLOGIA_INOVACAO_POSTS,
  ...ULTIMAS_NOTICIAS_POSTS
].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export {
  BLOG_CATEGORIES,
  TECNOLOGIA_INOVACAO_POSTS,
  ENGENHARIA_IA_POSTS,
  ULTIMAS_NOTICIAS_POSTS
};
