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

// Form data types that extend Prisma types
export type BlogFormData = {
  title: string;
  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  excerpt?: string;
  description: string;
  status: BlogStatus;
  blogImage?: File | CloudinaryImageData;
  bannerImage?: File | CloudinaryImageData;
  imageAltText?: string;
  categoryId: string;
  tags?: string[];
};

export type BlogCategoryFormData = {
  name: string;
  description?: string;
  bannerImage?: File | CloudinaryImageData;
};

// Define BlogStatus enum locally since it's defined in Prisma schema
export type BlogStatus = 'DRAFT' | 'PUBLISHED';
