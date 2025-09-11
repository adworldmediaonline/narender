import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BlogWithCategory } from '@/lib/types/blog';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
  blog: BlogWithCategory;
  className?: string;
}

export function BlogCard({ blog, className }: BlogCardProps) {
  const imageUrl = (
    blog.blogImage as {
      url: string;
      public_id: string;
    }
  )?.url;

  const excerpt =
    blog?.excerpt ||
    blog?.description.replace(/<[^>]*>/g, '').substring(0, 120) + '...';

  return (
    <Link href={`/blog/${blog?.slug}`} className={`block group ${className}`}>
      <Card className="pt-0 overflow-hidden border border-border/50 hover:border-border transition-all duration-300 hover:shadow-md bg-background">
        {/* Image Section */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted/20">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={blog?.imageAltText ?? blog?.title ?? ''}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-muted-foreground text-center">
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}

          {/* Category badge */}
          {blog.category && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="text-xs font-medium">
                {blog.category.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardHeader className="pb-3 pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(blog?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          <CardTitle className="line-clamp-2 text-lg font-semibold leading-tight group-hover:text-primary transition-colors duration-200">
            {blog?.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <CardDescription className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {excerpt}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
