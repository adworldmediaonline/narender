import { Prisma } from '@prisma/client';

// Prisma-generated types using GetPayload utility
export type BlogWithCategory = Prisma.BlogGetPayload<{
  include: {
    category: true;
  };
}>;

export type BlogCategoryWithBlogs = Prisma.BlogCategoryGetPayload<{
  include: {
    blogs: true;
  };
}>;

export type BlogCategoryWithBlogCount = Prisma.BlogCategoryGetPayload<{
  include: {
    _count: {
      select: {
        blogs: true;
      };
    };
  };
}>;

export type BlogCategory = Prisma.BlogCategoryGetPayload<Record<string, never>>;

// Cloudinary image data type (for JSON fields)
export interface CloudinaryImageData {
  public_id: string;
  url: string;
  alt: string;
}

// Form data types for blog creation/editing
export interface CreateBlogFormData {
  title: string;
  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  excerpt?: string;
  description: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  blogImage: File | null;
  bannerImage: File | null;
  categoryId: string;

  tags?: string[];
  imageAltText?: string;
}

export interface EditBlogFormData extends CreateBlogFormData {
  id: string;
}

// Category form data type
export type BlogCategoryFormData = {
  name: string;
  slug: string;
  description?: string;
  bannerImage?: File | null;
};
