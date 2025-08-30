import { deleteFromCloudinary, uploadToCloudinary } from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import { BlogCategoryFormData, BlogFormData } from '@/lib/types/blog';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

// Blog Actions
export async function createBlog(data: BlogFormData) {
  try {
    let blogImageData = null;
    let bannerImageData = null;

    // Handle blog image upload
    if (data.blogImage && data.blogImage instanceof File) {
      blogImageData = await uploadToCloudinary(data.blogImage, 'blog-images');
    }

    // Handle banner image upload
    if (data.bannerImage && data.bannerImage instanceof File) {
      bannerImageData = await uploadToCloudinary(
        data.bannerImage,
        'blog-banners'
      );
    }

    const slug = slugify(data.title, { lower: true, strict: true });

    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        h1: data.h1,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        excerpt: data.excerpt,
        description: data.description,
        slug,
        status: data.status,
        blogImage: blogImageData,
        bannerImage: bannerImageData,
        imageAltText: data.imageAltText,
        categoryId: data.categoryId,
        tags: data.tags,
      },
      include: {
        category: true,
      },
    });

    revalidatePath('/dashboard/blogs');
    return { success: true, blog };
  } catch (error) {
    console.error('Error creating blog:', error);
    return { success: false, error: 'Failed to create blog' };
  }
}

export async function updateBlog(id: string, data: BlogFormData) {
  try {
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return { success: false, error: 'Blog not found' };
    }

    let blogImageData = existingBlog.blogImage;
    let bannerImageData = existingBlog.bannerImage;

    // Handle blog image upload/update
    if (data.blogImage && data.blogImage instanceof File) {
      // Delete old image if exists
      if (existingBlog.blogImage?.public_id) {
        await deleteFromCloudinary(existingBlog.blogImage.public_id);
      }
      blogImageData = await uploadToCloudinary(data.blogImage, 'blog-images');
    }

    // Handle banner image upload/update
    if (data.bannerImage && data.bannerImage instanceof File) {
      // Delete old image if exists
      if (existingBlog.bannerImage?.public_id) {
        await deleteFromCloudinary(existingBlog.bannerImage.public_id);
      }
      bannerImageData = await uploadToCloudinary(
        data.bannerImage,
        'blog-banners'
      );
    }

    const slug = slugify(data.title, { lower: true, strict: true });

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: data.title,
        h1: data.h1,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        excerpt: data.excerpt,
        description: data.description,
        slug,
        status: data.status,
        blogImage: blogImageData,
        bannerImage: bannerImageData,
        imageAltText: data.imageAltText,
        categoryId: data.categoryId,
        tags: data.tags,
      },
      include: {
        category: true,
      },
    });

    revalidatePath('/dashboard/blogs');
    revalidatePath(`/dashboard/blogs/${id}`);
    return { success: true, blog };
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
    if (blog.blogImage?.public_id) {
      await deleteFromCloudinary(blog.blogImage.public_id);
    }
    if (blog.bannerImage?.public_id) {
      await deleteFromCloudinary(blog.bannerImage.public_id);
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

export async function getBlogs(
  search?: string,
  status?: string,
  categoryId?: string
) {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { excerpt: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(status && { status }),
        ...(categoryId && { categoryId }),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, blogs };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { success: false, error: 'Failed to fetch blogs', blogs: [] };
  }
}

export async function getBlogById(id: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!blog) {
      return { success: false, error: 'Blog not found' };
    }

    return { success: true, blog };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return { success: false, error: 'Failed to fetch blog' };
  }
}

// Category Actions
export async function createCategory(data: BlogCategoryFormData) {
  try {
    let bannerImageData = null;

    // Handle banner image upload
    if (data.bannerImage && data.bannerImage instanceof File) {
      bannerImageData = await uploadToCloudinary(
        data.bannerImage,
        'category-banners'
      );
    }

    const slug = slugify(data.name, { lower: true, strict: true });

    const category = await prisma.blogCategory.create({
      data: {
        name: data.name,
        slug,
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

    let bannerImageData = existingCategory.bannerImage;

    // Handle banner image upload/update
    if (data.bannerImage && data.bannerImage instanceof File) {
      // Delete old image if exists
      if (existingCategory.bannerImage?.public_id) {
        await deleteFromCloudinary(existingCategory.bannerImage.public_id);
      }
      bannerImageData = await uploadToCloudinary(
        data.bannerImage,
        'category-banners'
      );
    }

    const slug = slugify(data.name, { lower: true, strict: true });

    const category = await prisma.blogCategory.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description,
        bannerImage: bannerImageData,
      },
    });

    revalidatePath('/dashboard/categories');
    revalidatePath(`/dashboard/categories/${id}`);
    return { success: true, category };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  try {
    const category = await prisma.blogCategory.findUnique({
      where: { id },
      include: {
        blogs: true,
      },
    });

    if (!category) {
      return { success: false, error: 'Category not found' };
    }

    // Check if category has blogs
    if (category.blogs.length > 0) {
      return {
        success: false,
        error: 'Cannot delete category with existing blogs',
      };
    }

    // Delete banner image from Cloudinary
    if (category.bannerImage?.public_id) {
      await deleteFromCloudinary(category.bannerImage.public_id);
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

export async function getCategories(search?: string) {
  try {
    const categories = await prisma.blogCategory.findMany({
      where: {
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, categories };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      error: 'Failed to fetch categories',
      categories: [],
    };
  }
}

export async function getCategoryById(id: string) {
  try {
    const category = await prisma.blogCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, error: 'Category not found' };
    }

    return { success: true, category };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { success: false, error: 'Failed to fetch category' };
  }
}

// Utility function to get all categories for dropdowns
export async function getAllCategories() {
  try {
    const categories = await prisma.blogCategory.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return { success: true, categories };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      error: 'Failed to fetch categories',
      categories: [],
    };
  }
}

// Dashboard stats
export async function getDashboardStats() {
  try {
    const [totalBlogs, publishedBlogs, draftBlogs, totalCategories] =
      await Promise.all([
        prisma.blog.count(),
        prisma.blog.count({ where: { status: 'PUBLISHED' } }),
        prisma.blog.count({ where: { status: 'DRAFT' } }),
        prisma.blogCategory.count(),
      ]);

    const recentBlogs = await prisma.blog.findMany({
      take: 5,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const categoriesWithCount = await prisma.blogCategory.findMany({
      take: 5,
      include: {
        _count: {
          select: {
            blogs: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      stats: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalCategories,
        recentBlogs,
        categoriesWithCount,
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error: 'Failed to fetch dashboard stats' };
  }
}
