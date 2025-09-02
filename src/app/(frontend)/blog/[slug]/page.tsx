import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getBlogBySlug, getRelatedBlogs } from '@/lib/server/blog';
import { ArrowLeft, ArrowRight, Calendar, Share2, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blogResult = await getBlogBySlug(slug);

  if (!blogResult.success || !blogResult.blog) {
    notFound();
  }

  const blog = blogResult.blog;

  // Get related blogs from the same category
  const relatedBlogs = await getRelatedBlogs(blog.categoryId, blog.id, 3);

  return (
    <main className="min-h-screen">
      {/* Back to Blog Button */}
      {/* <div className="pt-4 pb-2">
        <div className="max-w-4xl mx-auto px-4">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div> */}

      {/* Hero Section with Blog Image */}
      {blog.blogImage && (
        <div className="mb-4 pt-4 pb-2">
          <div className="relative aspect-[3/2] max-w-4xl mx-auto px-4 overflow-hidden rounded-lg">
            <Image
              src={(blog.blogImage as { url: string })?.url || ''}
              alt={blog.imageAltText || blog.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* Article Header */}
      <div className="pb-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              {blog.category && (
                <Badge variant="outline" className="text-sm">
                  {blog.category.name}
                </Badge>
              )}
              <Badge
                variant={blog.status === 'PUBLISHED' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {blog.status}
              </Badge>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {blog.title}
            </h1>

            {blog.h1 && (
              <h2 className="text-lg md:text-xl text-muted-foreground font-medium">
                {blog.h1}
              </h2>
            )}

            <div className="flex items-center gap-6 text-muted-foreground border-b pb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">Jimmy Asija</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-base font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold">
                  Share this article:
                </span>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div className="py-12 bg-muted/50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Related Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map(relatedBlog => (
                <Card
                  key={relatedBlog.id}
                  className="group hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    {relatedBlog.blogImage ? (
                      <Image
                        src={
                          (relatedBlog.blogImage as { url: string })?.url || ''
                        }
                        alt={relatedBlog.imageAltText || relatedBlog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <div className="text-4xl">🎬</div>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(relatedBlog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base">
                      {relatedBlog.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="line-clamp-3 mb-4 text-sm">
                      {relatedBlog.excerpt ||
                        relatedBlog.description
                          .replace(/<[^>]*>/g, '')
                          .substring(0, 150) + '...'}
                    </CardDescription>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      <Link href={`/blog/${relatedBlog.slug}`}>
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <Button asChild variant="outline">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Articles
              </Link>
            </Button>
            <Button asChild>
              <Link href="/">
                Back to Home
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
