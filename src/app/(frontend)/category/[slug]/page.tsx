import { format } from 'date-fns';
import { ArrowLeft, BookOpen, CalendarDays } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getBlogsByCategory, getCategoryBySlug } from '@/lib/server/blog';
import type { CloudinaryImageData } from '@/lib/types/blog';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  try {
    const category = await getCategoryBySlug(params.slug);

    if (!category) {
      return {
        title: 'Category Not Found',
        description: 'The requested category could not be found.',
      };
    }

    const bannerImageUrl =
      category.bannerImage &&
      typeof category.bannerImage === 'object' &&
      'secure_url' in category.bannerImage
        ? (category.bannerImage as CloudinaryImageData).secure_url
        : null;

    return {
      title: `${category.name} | Blog Category`,
      description:
        category.description ||
        `Browse all posts in the ${category.name} category.`,
      openGraph: {
        title: `${category.name} | Blog Category`,
        description:
          category.description ||
          `Browse all posts in the ${category.name} category.`,
        type: 'website',
        images: bannerImageUrl
          ? [
              {
                url: bannerImageUrl,
                width: 1200,
                height: 630,
                alt: category.name,
              },
            ]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${category.name} | Blog Category`,
        description:
          category.description ||
          `Browse all posts in the ${category.name} category.`,
        images: bannerImageUrl ? [bannerImageUrl] : [],
      },
    };
  } catch {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const blogs = await getBlogsByCategory(category.id);

  const bannerImageUrl =
    category.bannerImage &&
    typeof category.bannerImage === 'object' &&
    'secure_url' in category.bannerImage
      ? (category.bannerImage as CloudinaryImageData).secure_url
      : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      {bannerImageUrl ? (
        <div className="relative h-[300px] w-full">
          <Image
            src={bannerImageUrl}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-xl text-gray-200 max-w-2xl">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-4 text-gray-200">
                  <BookOpen className="h-5 w-5" />
                  <span>
                    {blogs.length} article{blogs.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-xl text-muted-foreground max-w-2xl mb-4">
                  {category.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-5 w-5" />
                <span>
                  {blogs.length} article{blogs.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Articles */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {blogs.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map(blog => {
                const blogImageUrl =
                  blog.blogImage &&
                  typeof blog.blogImage === 'object' &&
                  'secure_url' in blog.blogImage
                    ? (blog.blogImage as CloudinaryImageData).secure_url
                    : null;

                return (
                  <Card
                    key={blog.id}
                    className="overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/blog/${blog.slug}`}>
                      {blogImageUrl && (
                        <div className="relative aspect-video w-full overflow-hidden">
                          <Image
                            src={blogImageUrl}
                            alt={blog.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant={
                              blog.status === 'PUBLISHED'
                                ? 'default'
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {blog.status.toLowerCase()}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3" />
                            <time dateTime={blog.createdAt.toISOString()}>
                              {format(blog.createdAt, 'MMM dd, yyyy')}
                            </time>
                          </div>
                        </div>

                        <h2 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {blog.title}
                        </h2>

                        {blog.excerpt && (
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {blog.excerpt}
                          </p>
                        )}

                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {blog.tags.slice(0, 3).map(tag => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {blog.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{blog.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Link>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No articles yet</h2>
              <p className="text-muted-foreground">
                There are no published articles in this category yet.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
