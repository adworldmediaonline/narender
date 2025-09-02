'use server';

import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { deleteFromCloudinary, uploadToCloudinary } from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import type {
  BlogCategoryFormData,
  CreateBlogFormData,
  EditBlogFormData,
} from '@/lib/types/blog';
import slugify from 'slugify';

export async function createBlog(data: CreateBlogFormData) {
  try {
    let blogImageData: Prisma.JsonValue = null;
    let bannerImageData: Prisma.JsonValue = null;

    // Handle blog image upload
    if (data.blogImage && data.blogImage instanceof File) {
      const uploadedImage = await uploadToCloudinary(
        data.blogImage,
        'blog-images'
      );
      blogImageData = uploadedImage as unknown as Prisma.JsonValue;
    }

    // Handle banner image upload
    if (data.bannerImage && data.bannerImage instanceof File) {
      const uploadedImage = await uploadToCloudinary(
        data.bannerImage,
        'blog-banners'
      );
      bannerImageData = uploadedImage as unknown as Prisma.JsonValue;
    }

    const blog = await prisma.blog.create({
      data: {
        id: crypto.randomUUID(),
        title: data.title,
        h1: data.h1,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        excerpt: data.excerpt,
        description: data.description,
        slug: slugify(data.title, { lower: true, strict: true }),
        status: data.status,
        blogImage: blogImageData,
        bannerImage: bannerImageData,
        imageAltText: data.imageAltText,
        categoryId: data.categoryId,
        tags: data.tags,
      },
    });

    revalidatePath('/dashboard/blogs');
    return { success: true, blog };
  } catch (error) {
    console.error('Error creating blog:', error);
    return { success: false, error: 'Failed to create blog' };
  }
}

export async function updateBlog(id: string, data: EditBlogFormData) {
  try {
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return { success: false, error: 'Blog not found' };
    }

    let blogImageData: Prisma.JsonValue = existingBlog.blogImage;
    let bannerImageData: Prisma.JsonValue = existingBlog.bannerImage;

    // Handle blog image upload/update
    if (data.blogImage && data.blogImage instanceof File) {
      // Delete old image if exists
      if (
        existingBlog.blogImage &&
        typeof existingBlog.blogImage === 'object' &&
        'public_id' in existingBlog.blogImage
      ) {
        const existingImage = existingBlog.blogImage as Record<string, unknown>;
        if (
          existingImage?.public_id &&
          typeof existingImage.public_id === 'string'
        ) {
          await deleteFromCloudinary(existingImage.public_id);
        }
      }
      const uploadedImage = await uploadToCloudinary(
        data.blogImage,
        'blog-images'
      );
      blogImageData = uploadedImage as unknown as Prisma.JsonValue;
    }

    // Handle banner image upload/update
    if (data.bannerImage && data.bannerImage instanceof File) {
      // Delete old image if exists
      if (
        existingBlog.bannerImage &&
        typeof existingBlog.bannerImage === 'object' &&
        'public_id' in existingBlog.bannerImage
      ) {
        const existingBanner = existingBlog.bannerImage as Record<
          string,
          unknown
        >;
        if (
          existingBanner?.public_id &&
          typeof existingBanner.public_id === 'string'
        ) {
          await deleteFromCloudinary(existingBanner.public_id);
        }
      }
      const uploadedImage = await uploadToCloudinary(
        data.bannerImage,
        'blog-banners'
      );
      bannerImageData = uploadedImage as unknown as Prisma.JsonValue;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title: data.title,
        h1: data.h1,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        excerpt: data.excerpt,
        description: data.description,
        slug: slugify(data.title, { lower: true, strict: true }),
        status: data.status,
        blogImage: blogImageData,
        bannerImage: bannerImageData,
        imageAltText: data.imageAltText,
        categoryId: data.categoryId,
        tags: data.tags,
      },
    });

    revalidatePath('/dashboard/blogs');
    return { success: true, blog: updatedBlog };
  } catch (error) {
    console.error('Error updating blog:', error);
    return { success: false, error: 'Failed to update blog' };
  }
}

export async function deleteBlog(id: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return { success: false, error: 'Blog not found' };
    }

    // Delete images from Cloudinary
    if (
      blog.blogImage &&
      typeof blog.blogImage === 'object' &&
      'public_id' in blog.blogImage
    ) {
      const blogImage = blog.blogImage as Record<string, unknown>;
      if (blogImage?.public_id && typeof blogImage.public_id === 'string') {
        await deleteFromCloudinary(blogImage.public_id);
      }
    }
    if (
      blog.bannerImage &&
      typeof blog.bannerImage === 'object' &&
      'public_id' in blog.bannerImage
    ) {
      const bannerImage = blog.bannerImage as Record<string, unknown>;
      if (bannerImage?.public_id && typeof bannerImage.public_id === 'string') {
        await deleteFromCloudinary(bannerImage.public_id);
      }
    }

    await prisma.blog.delete({
      where: { id },
    });

    revalidatePath('/dashboard/blogs');
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog:', error);
    return { success: false, error: 'Failed to delete blog' };
  }
}

export async function createCategory(data: BlogCategoryFormData) {
  try {
    let bannerImageData: Prisma.JsonValue = null;

    // Handle banner image upload
    if (data.bannerImage && data.bannerImage instanceof File) {
      const uploadedImage = await uploadToCloudinary(
        data.bannerImage,
        'category-banners'
      );
      bannerImageData = uploadedImage as unknown as Prisma.JsonValue;
    }

    const category = await prisma.blogCategory.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name,
        slug: slugify(data.name, { lower: true, strict: true }),
        description: data.description,
        bannerImage: bannerImageData,
      },
    });

    revalidatePath('/dashboard/categories');
    return { success: true, category };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(id: string, data: BlogCategoryFormData) {
  try {
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return { success: false, error: 'Category not found' };
    }

    let bannerImageData: Prisma.JsonValue = existingCategory.bannerImage;

    // Handle banner image upload/update
    if (data.bannerImage && data.bannerImage instanceof File) {
      // Delete old image if exists
      if (
        existingCategory.bannerImage &&
        typeof existingCategory.bannerImage === 'object' &&
        'public_id' in existingCategory.bannerImage
      ) {
        const existingBanner = existingCategory.bannerImage as Record<
          string,
          unknown
        >;
        if (
          existingBanner?.public_id &&
          typeof existingBanner.public_id === 'string'
        ) {
          await deleteFromCloudinary(existingBanner.public_id);
        }
      }
      const uploadedImage = await uploadToCloudinary(
        data.bannerImage,
        'category-banners'
      );
      bannerImageData = uploadedImage as unknown as Prisma.JsonValue;
    }

    const updatedCategory = await prisma.blogCategory.update({
      where: { id },
      data: {
        name: data.name,
        slug: slugify(data.name, { lower: true, strict: true }),
        description: data.description,
        bannerImage: bannerImageData,
      },
    });

    revalidatePath('/dashboard/categories');
    return { success: true, category: updatedCategory };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  try {
    const category = await prisma.blogCategory.findUnique({
      where: { id },
    });

    if (!category) {
      return { success: false, error: 'Category not found' };
    }

    // Check if category has blogs
    const blogCount = await prisma.blog.count({
      where: { categoryId: id },
    });

    if (blogCount > 0) {
      return {
        success: false,
        error: 'Cannot delete category with existing blogs',
      };
    }

    // Delete banner image from Cloudinary
    if (
      category.bannerImage &&
      typeof category.bannerImage === 'object' &&
      'public_id' in category.bannerImage
    ) {
      const bannerImage = category.bannerImage as Record<string, unknown>;
      if (bannerImage?.public_id && typeof bannerImage.public_id === 'string') {
        await deleteFromCloudinary(bannerImage.public_id);
      }
    }

    await prisma.blogCategory.delete({
      where: { id },
    });

    revalidatePath('/dashboard/categories');
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}
