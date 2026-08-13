export interface Author {
  id: number;
  name: string;
  slug: string;
  avatar: string | null;
  bio: string | null;
  role: string | null;
  social: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  } | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  color: string | null;
  description: string | null;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  thumbnail: string | null;
  featuredImage: string | null;
  category: { id: number; name: string; slug: string; color: string | null };
  author: Author;
  publishedAt: string | null;
  readingTime: number;
  viewCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
  tags: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  focusKeyword?: string | null;
  updatedAt?: string | null;
}

export interface GetArticlesOptions {
  limit?: number;
  categorySlug?: string;
  authorSlug?: string;
  featured?: boolean;
  breaking?: boolean;
  page?: number;
  search?: string;
}
