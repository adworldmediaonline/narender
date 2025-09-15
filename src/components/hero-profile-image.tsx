import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
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

export default function HeroProfileImage({
  src,
  alt,
  className,
}: HeroProfileImageProps) {
  return (
    <div
      className={cn(
        'relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto',
        className
      )}
    >
      {/* Background Decorative Elements - Hidden on mobile */}
      <div className="hidden sm:block absolute -inset-4 bg-gradient-to-r from-primary/20 to-[var(--color-gradient-secondary)]/20 rounded-3xl blur-2xl"></div>
      <div className="hidden md:block absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-xl"></div>
      <div className="hidden md:block absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-[var(--color-gradient-secondary)]/30 to-transparent rounded-full blur-xl"></div>

      {/* Profile Image Container */}
      <div className="relative bg-gradient-to-br from-primary/10 to-[var(--color-gradient-secondary)]/10 p-1 sm:p-2 rounded-2xl sm:rounded-3xl backdrop-blur-sm border border-primary/20">
        <AspectRatio
          ratio={4 / 5}
          className="rounded-xl sm:rounded-2xl overflow-hidden"
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, 480px"
          />
        </AspectRatio>
      </div>
    </div>
  );
}
