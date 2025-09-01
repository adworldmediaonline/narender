import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface CTAButton {
  text: string;
  href: string;
  icon?: LucideIcon;
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

interface CTASectionProps {
  title: string;
  description: string;
  buttons: CTAButton[];
  background?: 'gradient' | 'solid' | 'image';
  className?: string;
}

export default function CTASection({
  title,
  description,
  buttons,
  background = 'gradient',
  className,
}: CTASectionProps) {
  const backgroundClasses = {
    gradient:
      'bg-gradient-to-r from-primary via-[var(--color-gradient-secondary)] to-primary',
    solid: 'bg-primary',
    image:
      'bg-gradient-to-r from-primary/90 via-[var(--color-gradient-secondary)]/90 to-primary/90',
  };

  return (
    <div
      className={cn(
        'py-24 text-white relative overflow-hidden',
        backgroundClasses[background],
        className
      )}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            {title}
          </h2>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          {buttons.map((button, index) => {
            const Icon = button.icon;
            return (
              <Button
                key={index}
                asChild
                size="lg"
                variant={button.variant || 'default'}
                className={cn(
                  'px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300',
                  button.variant === 'secondary' &&
                    'bg-white text-primary hover:bg-white/90',
                  button.variant === 'outline' &&
                    'border-primary/30 text-primary hover:bg-primary hover:text-white',
                  button.className
                )}
              >
                <Link href={button.href} className="flex items-center gap-2">
                  {Icon && <Icon className="h-5 w-5" />}
                  {button.text}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
