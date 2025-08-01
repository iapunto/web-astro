export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  pubDate: Date;
  description: string;
  cover: string;
  coverAlt?: string;
  author: {
    name: string;
    description: string;
    image: string;
  };
  category: string;
  subcategory?: string;
  tags: string[];
  quote?: string;
  content: string;
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface MediaFile {
  id: string;
  filename: string;
  url: string;
  alt?: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export interface CMSSettings {
  siteName: string;
  siteDescription: string;
  defaultAuthor: {
    name: string;
    description: string;
    image: string;
  };
  defaultCategory: string;
  defaultTags: string[];
} 