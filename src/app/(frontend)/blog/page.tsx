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
import { getBlogs } from '@/lib/server/blog';
import { ArrowRight, Calendar, Eye, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function BlogPage() {
  const result = await getBlogs();

  if (!result.success || !result.blogs) {
    return (
      <main>
        <Section className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Error Loading Blogs</h1>
            <p className="text-muted-foreground">
              Unable to load blog posts at this time.
            </p>
          </div>
        </Section>
      </main>
    );
  }

  const { blogs } = result;

  return (
    <main>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-background to-muted/50 min-h-[60vh] flex items-center">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">Blogs</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Welcome to the official blog of Jimmy Asija – a space where cinema
            meets creativity and business blends with storytelling.
          </p>

          <div className="grid gap-4 md:grid-cols-3 text-center max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl">🎬</div>
              <p className="text-sm md:text-base text-muted-foreground">
                Exclusive behind-the-scenes insights into Bollywood productions.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🌟</div>
              <p className="text-sm md:text-base text-muted-foreground">
                Stories of challenges, success, and inspiration from Jimmy's
                career.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">📰</div>
              <p className="text-sm md:text-base text-muted-foreground">
                Updates on upcoming movies and personal thoughts.
              </p>
            </div>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground">
            Stay tuned for regular updates, film news, and personal thoughts
            directly from Jimmy Asija.
          </p>
        </div>
      </Section>

      {/* Blog Posts */}
      <Section>
        <div className="max-w-7xl mx-auto">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">No Blog Posts Yet</h2>
              <p className="text-muted-foreground">
                Check back soon for exciting content from Jimmy Asija.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
                {blogs.map(blog => (
                  <Card
                    key={blog.id}
                    className="group hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      {blog.blogImage ? (
                        <Image
                          src={String(blog.blogImage)}
                          alt={blog.imageAltText || blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <div className="text-4xl">🎬</div>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge
                          variant={
                            blog.status === 'PUBLISHED'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {blog.status}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        {blog.category && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {blog.category.name}
                            </Badge>
                          </>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {blog.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 mb-4">
                        {blog.excerpt ||
                          blog.description
                            .replace(/<[^>]*>/g, '')
                            .substring(0, 150) + '...'}
                      </CardDescription>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Jimmy Asija</span>
                        </div>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                          <Link href={`/blog/${blog.slug}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Read More
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </Section>
    </main>
  );
}
