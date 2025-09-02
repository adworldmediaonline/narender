import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BlogWithCategory } from '@/lib/types/blog';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
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
    blog?.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';

  return (
    <Card
      className={`group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-background to-muted/20 pt-0 ${className}`}
    >
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={blog?.imageAltText ?? blog?.title ?? ''}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              <p className="text-sm font-medium">No Image</p>
            </div>
          </div>
        )}

        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge - positioned over image */}
        {blog.category && (
          <div className="absolute top-4 left-4">
            <Badge
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white border-0 shadow-lg backdrop-blur-sm"
            >
              {blog.category.name}
            </Badge>
          </div>
        )}

        {/* Read time indicator */}
        <div className="absolute top-4 right-4">
          <Badge
            variant="outline"
            className="bg-black/20 text-white border-white/30 hover:bg-black/30 backdrop-blur-sm"
          >
            <Clock className="h-3 w-3 mr-1" />
            {Math.ceil(
              blog.description.replace(/<[^>]*>/g, '').length / 200
            )}{' '}
            min read
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Calendar className="h-3 w-3" />
          <span className="font-medium">
            {new Date(blog?.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <CardTitle className="line-clamp-2 text-lg font-bold group-hover:text-primary transition-colors duration-300 leading-tight">
          {blog?.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <CardDescription className="line-clamp-3 text-sm leading-relaxed mb-3 text-muted-foreground">
          {excerpt}
        </CardDescription>

        {/* Enhanced CTA Button */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="group/btn p-0 h-auto font-medium text-primary hover:text-primary/80 hover:bg-primary/5 transition-all duration-200"
        >
          <Link
            href={`/blog/${blog?.slug}`}
            className="flex items-center gap-2 px-3 py-2 rounded-md"
          >
            <span>Read Article</span>
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Link>
        </Button>
      </CardContent>

      {/* Subtle bottom accent */}
      <div className="h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </Card>
  );
}
