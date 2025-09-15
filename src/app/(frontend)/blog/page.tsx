import { BlogCard } from '@/components/blog-card';
import Section from '@/components/section';
import { Skeleton } from '@/components/ui/skeleton';
import { getBlogs } from '@/lib/server/blog';
import { Award, Hotel, Newspaper, Star } from 'lucide-react';
import { Suspense } from 'react';
import { BlogWithCategory } from '../../../lib/types/blog';

export default async function BlogPage() {
  return (
    <main>
      {/* Hero Section */}
      <Section className="py-8 md:py-10 bg-gradient-to-br from-background to-muted/50 flex items-center">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
            Insights, Inspiration & Innovation – By Narender Pahuja
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The blog section of Narender (Naren) Pahuja's official website is
            where hospitality meets lifestyle and entrepreneurship. From
            nightlife management tips to travel experiences and entrepreneurial
            lessons, this blog is a gateway to fresh ideas, expert insights, and
            inspirational stories.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-center max-w-6xl mx-auto">
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Hotel className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Hospitality Management: Guest experience, luxury nightlife &
                club operations.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Entrepreneurship: Business lessons, leadership tips, and
                personal growth.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Newspaper className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Travel & Lifestyle: Curated journeys, destinations, and
                experiences.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                Success Stories: Insights from Narender Pahuja's career &
                ventures.
              </p>
            </div>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground">
            Stay tuned for weekly updates, stories, and tips directly from Naren
            Pahuja's journey of success and innovation.
          </p>
        </div>
      </Section>

      {/* Blog Posts */}
      <Suspense fallback={<BlogPostsSkeleton />}>
        <BlogPosts />
      </Suspense>
    </main>
  );
}

async function BlogPosts() {
  const blogs = await getBlogs();

  if (!blogs) {
    return (
      <main>
        <Section className="py-8 md:py-10 flex items-center justify-center">
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

  return (
    <Section className="py-8 md:py-10">
      <div className="max-w-7xl mx-auto">
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No Blog Posts Yet</h2>
            <p className="text-muted-foreground">
              Check back soon for exciting content from Narender Pahuja.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {blogs.map((blog: BlogWithCategory) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </>
        )}
      </div>
    </Section>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden border border-border/50 rounded-lg bg-background">
      {/* Image skeleton */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted/20">
        <Skeleton className="w-full h-full" />
        {/* Category badge skeleton */}
        <div className="absolute top-3 left-3">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-6 space-y-3">
        {/* Date skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Title skeleton */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />

        {/* Excerpt skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}

function BlogPostsSkeleton() {
  return (
    <Section className="py-8 md:py-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {Array.from({ length: 6 }).map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}
