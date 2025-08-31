import { Prisma } from '@prisma/client';

// Use Prisma's generated types
export type Blog = Prisma.BlogGetPayload<{
  include: {
    category: true;
  };
}>;

export type BlogCategory = Prisma.BlogCategoryGetPayload<{
  include: {
    _count: {
      select: {
        blogs: true;
      };
    };
  };
}>;

// Cloudinary image interface compatible with Prisma JsonValue
export interface CloudinaryImageData {
  public_id: string;
  secure_url: string;
  url?: string; // Optional for backward compatibility
  width: number;
  height: number;
  format: string;
  alt?: string;
  [key: string]: string | number | boolean | undefined; // Index signature for JsonValue compatibility
}

// Base form data type
type BaseFormData = {
  title: string;
  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  excerpt?: string;
  description: string;
  status: BlogStatus;
  imageAltText?: string;
  categoryId: string;
  tags: string[];
};

// Create form data - images are required
export type CreateBlogFormData = BaseFormData & {
  blogImage: File | CloudinaryImageData | null;
  bannerImage: File | CloudinaryImageData | null;
};

// Edit form data - images are optional (can keep existing)
export type EditBlogFormData = BaseFormData & {
  blogImage?: File | CloudinaryImageData | null;
  bannerImage?: File | CloudinaryImageData | null;
};

// General blog form data type (for compatibility)
export type BlogFormData = BaseFormData & {
  blogImage?: File | CloudinaryImageData | null;
  bannerImage?: File | CloudinaryImageData | null;
};

export type BlogCategoryFormData = {
  name: string;
  description?: string;
  bannerImage?: File | CloudinaryImageData;
};

// Define BlogStatus enum locally since it's defined in Prisma schema
export type BlogStatus = 'DRAFT' | 'PUBLISHED';
