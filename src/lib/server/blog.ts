import prisma from '@/lib/prisma';

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

// Blog queries
export async function getBlogs(search?: string) {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return blogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function getBlogsAll(search?: string) {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        status: 'PUBLISHED',

      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return blogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
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

// Category queries
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

// Frontend blog queries
export async function getBlogBySlug(slug: string) {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        slug,
        status: 'PUBLISHED', // Only show published blogs
      },
      include: {
        category: true,
      },
    });

    if (!blog) {
      return { success: false, error: 'Blog not found' };
    }

    return { success: true, blog };
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return { success: false, error: 'Failed to fetch blog' };
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.blogCategory.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            blogs: {
              where: {
                status: 'PUBLISHED', // Only count published blogs
              },
            },
          },
        },
      },
    });

    return category;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

export async function getBlogsByCategory(categoryId: string) {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        categoryId,
        status: 'PUBLISHED', // Only show published blogs
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return blogs;
  } catch (error) {
    console.error('Error fetching blogs by category:', error);
    return [];
  }
}

export async function getRelatedBlogs(
  categoryId: string,
  excludeBlogId: string,
  limit: number = 3
) {
  try {
    const relatedBlogs = await prisma.blog.findMany({
      where: {
        categoryId,
        status: 'PUBLISHED',
        id: {
          not: excludeBlogId, // Exclude the current blog
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return relatedBlogs;
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
}
