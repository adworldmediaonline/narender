export type BlogStatus = 'DRAFT' | 'PUBLISHED';

export interface BlogImage {
  public_id: string;
  url: string;
  alt: string;
}

export interface Blog {
  id: string;
  title: string;
  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  excerpt?: string;
  description: string;
  slug: string;
  status: BlogStatus;
  blogImage?: BlogImage;
  bannerImage?: BlogImage;
  imageAltText?: string;
  categoryId: string;
  category: BlogCategory;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  bannerImage?: BlogImage;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    blogs: number;
  };
}

export interface BlogFormData {
  title: string;
  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  excerpt?: string;
  description: string;
  status: BlogStatus;
  blogImage?: File | BlogImage;
  bannerImage?: File | BlogImage;
  imageAltText?: string;
  categoryId: string;
  tags: string[];
}

export interface BlogCategoryFormData {
  name: string;
  description?: string;
  bannerImage?: File | BlogImage;
}
