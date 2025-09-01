import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface CTAButton {
  text: string;
  href: string;
  icon: LucideIcon;
  variant?: 'default' | 'outline';
  className?: string;
}

interface HeroContentProps {
  badge?: {
    text: string;
    icon?: LucideIcon;
  };
  title: string;
  subtitle: string;
  description: string;
  buttons: CTAButton[];
  alignment?: 'left' | 'center';
  className?: string;
}

export default function HeroContent({
  badge,
  title,
  subtitle,
  description,
  buttons,
  alignment = 'center',
  className,
}: HeroContentProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
  };

  const badgeAlignmentClasses = {
    left: 'mx-0',
    center: 'mx-auto',
  };

  const dividerAlignmentClasses = {
    left: 'mx-0',
    center: 'mx-auto',
  };

  const buttonAlignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
  };

  return (
    <div className={cn(alignmentClasses[alignment], 'space-y-6', className)}>
      {/* Badge */}
      {badge && (
        <Badge
          variant="outline"
          className={cn(
            'px-4 py-2 text-sm font-medium bg-background/80 backdrop-blur-sm border-primary/20',
            badgeAlignmentClasses[alignment]
          )}
        >
          {badge.icon && <badge.icon className="w-4 h-4 mr-2 text-primary" />}
          {badge.text}
        </Badge>
      )}

      {/* Main Heading */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-[var(--color-gradient-secondary)] bg-clip-text text-transparent leading-tight">
          {title}
        </h1>
        <div
          className={cn(
            'w-20 h-1 bg-gradient-to-r from-primary to-[var(--color-gradient-secondary)] rounded-full',
            dividerAlignmentClasses[alignment]
          )}
        />
        <p className="text-lg md:text-xl lg:text-2xl font-medium text-foreground">
          {subtitle}
        </p>
      </div>

      {/* Description */}
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
        {description}
      </p>

      {/* CTA Buttons */}
      <div
        className={cn(
          'flex flex-col sm:flex-row gap-3 pt-2',
          buttonAlignmentClasses[alignment]
        )}
      >
        {buttons.map((button, index) => {
          const Icon = button.icon;
          return (
            <Button
              key={index}
              asChild
              size="lg"
              variant={button.variant || 'default'}
              className={cn(
                'px-6 py-4 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300',
                button.variant === 'default' &&
                  'bg-gradient-to-r from-primary to-[var(--color-gradient-secondary)] hover:from-primary/90 hover:to-[var(--color-gradient-secondary)]/90',
                button.variant === 'outline' &&
                  'border-2 hover:bg-primary hover:text-primary-foreground',
                button.className
              )}
            >
              <Link href={button.href} className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                {button.text}
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
