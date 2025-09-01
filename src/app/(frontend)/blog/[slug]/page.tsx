import Section from '@/components/section';
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
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Get related blogs from the same category
  const relatedBlogs = await getRelatedBlogs(blog.categoryId, blog.id, 3);

  return (
    <main>
      {/* Back to Blog Button */}
      <Section className="pt-8">
        <div className="max-w-4xl mx-auto">
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </Section>

      {/* Hero Section with Blog Image */}
      {blog.blogImage && (
        <Section className="py-0">
          <div className="relative aspect-video max-w-6xl mx-auto overflow-hidden rounded-lg">
            <Image
              src={String(blog.blogImage)}
              alt={blog.imageAltText || blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </Section>
      )}

      {/* Article Header */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              {blog.category && (
                <Badge variant="outline" className="text-sm">
                  {blog.category.name}
                </Badge>
              )}
              <Badge
                variant={blog.status === 'PUBLISHED' ? 'default' : 'secondary'}
              >
                {blog.status}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {blog.title}
            </h1>

            {blog.h1 && (
              <h2 className="text-xl md:text-2xl text-muted-foreground font-medium">
                {blog.h1}
              </h2>
            )}

            <div className="flex items-center gap-6 text-muted-foreground border-b pb-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Jimmy Asija</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
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
      </Section>

      {/* Article Content */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="prose-tiptap prose-lg max-w-none">
            <div
              className="tiptap"
              dangerouslySetInnerHTML={{ __html: blog.description }}
            />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-8 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold">
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
      </Section>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <Section className="bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
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
                        src={String(relatedBlog.blogImage)}
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
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(relatedBlog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedBlog.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-4">
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
        </Section>
      )}

      {/* Navigation */}
      <Section>
        <div className="max-w-4xl mx-auto">
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
      </Section>
    </main>
  );
}
