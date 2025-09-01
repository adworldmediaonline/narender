import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import { Award, Film } from 'lucide-react';
import Image from 'next/image';

interface FloatingCard {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  gradient: string;
}

interface HeroProfileImageProps {
  src: string;
  alt: string;
  className?: string;
  floatingCards?: FloatingCard[];
}

const defaultFloatingCards: FloatingCard[] = [
  {
    position: 'top-left',
    icon: Film,
    title: 'JRK Films',
    subtitle: 'Production House',
    gradient: 'from-primary to-[var(--color-gradient-secondary)]',
  },
  {
    position: 'bottom-right',
    icon: Award,
    title: '8+ Films',
    subtitle: 'Produced',
    gradient: 'from-[var(--color-gradient-accent)] to-orange-600',
  },
];

const getPositionClasses = (position: FloatingCard['position']) => {
  const positions = {
    'top-left': '-top-4 left-4',
    'top-right': '-top-4 right-4',
    'bottom-left': '-bottom-4 left-4',
    'bottom-right': '-bottom-4 right-4',
  };
  return positions[position];
};

export default function HeroProfileImage({
  src,
  alt,
  className,
  floatingCards = defaultFloatingCards,
}: HeroProfileImageProps) {
  return (
    <div className={cn('relative w-full max-w-lg', className)}>
      {/* Background Decorative Elements */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-[var(--color-gradient-secondary)]/20 rounded-3xl blur-2xl"></div>
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-xl"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-[var(--color-gradient-secondary)]/30 to-transparent rounded-full blur-xl"></div>

      {/* Profile Image Container */}
      <div className="relative bg-gradient-to-br from-primary/10 to-[var(--color-gradient-secondary)]/10 p-2 rounded-3xl backdrop-blur-sm border border-primary/20">
        <AspectRatio ratio={4 / 5} className="rounded-2xl overflow-hidden">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
          />
        </AspectRatio>
      </div>

      {/* Floating Cards */}
      {floatingCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={cn(
              'absolute bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-primary/10',
              getPositionClasses(card.position)
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br',
                  card.gradient
                )}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">{card.title}</p>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
