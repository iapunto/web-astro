export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Strapi v5 - Los campos están directamente en el objeto, no en attributes
export interface StrapiImage {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

export interface StrapiCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiTag {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiAuthor {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatar?: StrapiImage;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiArticle {
  id: number;
  documentId: string; // Importante para Strapi v5
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  description?: string; // Campo que agregamos durante la migración
  coverAlt?: string; // Campo que agregamos durante la migración
  featured?: boolean;
  article_status: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cover?: StrapiImage;
  author?: StrapiAuthor;
  category?: StrapiCategory;
  tags?: StrapiTag[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    canonicalURL?: string;
  };
}

export interface StrapiGlobal {
  id: number;
  attributes: {
    siteName: string;
    siteDescription: string;
    defaultSeo: {
      metaTitle: string;
      metaDescription: string;
      shareImage?: StrapiImage;
    };
    favicon?: StrapiImage;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}
