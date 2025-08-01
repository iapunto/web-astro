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

export interface StrapiImage {
  id: number;
  attributes: {
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
  };
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
  attributes: {
    name: string;
    slug: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface StrapiTag {
  id: number;
  attributes: {
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface StrapiAuthor {
  id: number;
  attributes: {
    name: string;
    email: string;
    bio?: string;
    avatar?: StrapiImage;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface StrapiArticle {
  id: number;
  attributes: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featured?: boolean;
    status: 'draft' | 'published';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    cover?: StrapiImage;
    author?: {
      data: StrapiAuthor;
    };
    category?: {
      data: StrapiCategory;
    };
    tags?: {
      data: StrapiTag[];
    };
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string;
      canonicalURL?: string;
    };
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