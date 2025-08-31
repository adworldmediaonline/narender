import { format } from 'date-fns';
import { ArrowLeft, CalendarDays, Share2, Tag, User } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getBlogBySlug, getRelatedBlogs } from '@/lib/server/blog';
import type { CloudinaryImageData } from '@/lib/types/blog';

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  try {
    const blog = await getBlogBySlug(params.slug);

    if (!blog) {
      return {
        title: 'Blog Not Found',
        description: 'The requested blog post could not be found.',
      };
    }

    const bannerImageUrl =
      blog.bannerImage &&
      typeof blog.bannerImage === 'object' &&
      'secure_url' in blog.bannerImage
        ? (blog.bannerImage as CloudinaryImageData).secure_url
        : null;

    return {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt || '',
      keywords: blog.metaKeywords?.join(', ') || '',
      openGraph: {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.excerpt || '',
        type: 'article',
        publishedTime: blog.createdAt.toISOString(),
        modifiedTime: blog.updatedAt.toISOString(),
        authors: ['Blog Admin'],
        images: bannerImageUrl
          ? [
              {
                url: bannerImageUrl,
                width: 1200,
                height: 630,
                alt: blog.title,
              },
            ]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.excerpt || '',
        images: bannerImageUrl ? [bannerImageUrl] : [],
      },
    };
  } catch {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(blog.categoryId, blog.id);

  const bannerImageUrl =
    blog.bannerImage &&
    typeof blog.bannerImage === 'object' &&
    'secure_url' in blog.bannerImage
      ? (blog.bannerImage as CloudinaryImageData).secure_url
      : null;

  const blogImageUrl =
    blog.blogImage &&
    typeof blog.blogImage === 'object' &&
    'secure_url' in blog.blogImage
      ? (blog.blogImage as CloudinaryImageData).secure_url
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
      {bannerImageUrl && (
        <div className="relative h-[400px] w-full">
          <Image
            src={bannerImageUrl}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-8">
              <div className="max-w-4xl">
                <Badge variant="secondary" className="mb-4">
                  {blog.category?.name || 'Uncategorized'}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {blog.h1 || blog.title}
                </h1>
                {blog.excerpt && (
                  <p className="text-xl text-gray-200 max-w-2xl">
                    {blog.excerpt}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header (if no banner image) */}
          {!bannerImageUrl && (
            <header className="mb-8">
              <Badge variant="secondary" className="mb-4">
                {blog.category?.name || 'Uncategorized'}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {blog.h1 || blog.title}
              </h1>
              {blog.excerpt && (
                <p className="text-xl text-muted-foreground mb-6">
                  {blog.excerpt}
                </p>
              )}
            </header>
          )}

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <time dateTime={blog.createdAt.toISOString()}>
                {format(blog.createdAt, 'MMMM dd, yyyy')}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Admin</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              <Button variant="ghost" size="sm" className="h-auto p-0">
                Share
              </Button>
            </div>
          </div>

          {/* Blog Image */}
          {blogImageUrl && (
            <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={blogImageUrl}
                alt={blog.imageAltText || blog.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose-tiptap mb-8">
            <div
              className="tiptap"
              dangerouslySetInnerHTML={{
                __html: blog.description,
              }}
            />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tags:</span>
              {blog.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="my-8" />

          {/* Related Articles */}
          {relatedBlogs && relatedBlogs.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedBlogs.map(relatedBlog => {
                  const relatedImageUrl =
                    relatedBlog.blogImage &&
                    typeof relatedBlog.blogImage === 'object' &&
                    'secure_url' in relatedBlog.blogImage
                      ? (relatedBlog.blogImage as CloudinaryImageData)
                          .secure_url
                      : null;

                  return (
                    <Card key={relatedBlog.id} className="overflow-hidden">
                      <Link href={`/blog/${relatedBlog.slug}`}>
                        {relatedImageUrl && (
                          <div className="relative aspect-video w-full">
                            <Image
                              src={relatedImageUrl}
                              alt={relatedBlog.title}
                              fill
                              className="object-cover transition-transform hover:scale-105"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <Badge variant="outline" className="mb-2 text-xs">
                            {relatedBlog.category?.name || 'Uncategorized'}
                          </Badge>
                          <h3 className="font-semibold mb-2 line-clamp-2">
                            {relatedBlog.title}
                          </h3>
                          {relatedBlog.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {relatedBlog.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3" />
                            <time
                              dateTime={relatedBlog.createdAt.toISOString()}
                            >
                              {format(relatedBlog.createdAt, 'MMM dd, yyyy')}
                            </time>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}
