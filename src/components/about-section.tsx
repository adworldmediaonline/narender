import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface AboutSectionProps {
  badge?: {
    text: string;
    icon?: LucideIcon;
    className?: string;
  };
  title: string;
  titleHighlight?: string;
  paragraphs: string[];
  ctaButton?: {
    text: string;
    href: string;
    icon?: LucideIcon;
    className?: string;
  };
  visualElement?: {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    gradient?: string;
    className?: string;
  };
  className?: string;
  reverseLayout?: boolean;
}

export default function AboutSection({
  badge,
  title,
  titleHighlight,
  paragraphs,
  ctaButton,
  visualElement,
  className,
  reverseLayout = false,
}: AboutSectionProps) {
  const contentOrder = reverseLayout
    ? 'order-2 lg:order-1'
    : 'order-1 lg:order-1';
  const visualOrder = reverseLayout
    ? 'order-1 lg:order-2'
    : 'order-2 lg:order-2';

  return (
    <div className={cn('max-w-5xl mx-auto', className)}>
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div className={cn('space-y-8', contentOrder)}>
          {badge && (
            <Badge
              variant="secondary"
              className={cn('px-3 py-1', badge.className)}
            >
              {badge.icon && <badge.icon className="w-4 h-4 mr-2" />}
              {badge.text}
            </Badge>
          )}

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {title}
              {titleHighlight && (
                <>
                  <br />
                  <span className="bg-gradient-to-r from-primary to-[var(--color-gradient-secondary)] bg-clip-text text-transparent">
                    {titleHighlight}
                  </span>
                </>
              )}
            </h2>
          </div>

          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {ctaButton && (
            <Button
              asChild
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href={ctaButton.href} className="flex items-center gap-2">
                {ctaButton.text}
                {ctaButton.icon && <ctaButton.icon className="h-4 w-4" />}
              </Link>
            </Button>
          )}
        </div>

        {/* Visual Element */}
        {visualElement && (
          <div className={cn('relative', visualOrder)}>
            <div
              className={cn(
                'aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-[var(--color-gradient-secondary)]/20 p-8 flex items-center justify-center',
                visualElement.className
              )}
            >
              <div className="text-center space-y-6">
                <div
                  className={cn(
                    'w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl bg-gradient-to-br from-primary to-[var(--color-gradient-secondary)]',
                    visualElement.gradient
                  )}
                >
                  <visualElement.icon className="h-16 w-16 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{visualElement.title}</h3>
                  <p className="text-muted-foreground">
                    {visualElement.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
