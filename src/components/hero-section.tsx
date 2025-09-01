import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  primaryButton?: {
    text: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
  secondaryButton?: {
    text: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

export default function HeroSection({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background to-muted/50">
      <div className="container px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium">
              {subtitle}
            </p>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          {(primaryButton || secondaryButton) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {primaryButton && (
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href={primaryButton.href}>
                    {primaryButton.icon && (
                      <primaryButton.icon className="mr-2 h-5 w-5" />
                    )}
                    {primaryButton.text}
                  </Link>
                </Button>
              )}
              {secondaryButton && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  <Link href={secondaryButton.href}>
                    {secondaryButton.icon && (
                      <secondaryButton.icon className="mr-2 h-5 w-5" />
                    )}
                    {secondaryButton.text}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
