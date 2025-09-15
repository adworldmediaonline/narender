import { cn } from '@/lib/utils';

interface HeroTwoColumnProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  className?: string;
  contentOrder?: 'default' | 'reverse'; // default: content-left, image-right; reverse: image-left, content-right
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  verticalAlignment?: 'start' | 'center' | 'end';
}

const gapClasses = {
  sm: 'gap-6',
  md: 'gap-8',
  lg: 'gap-12',
  xl: 'gap-16',
};

const alignmentClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
};

export default function HeroTwoColumn({
  leftContent,
  rightContent,
  className,
  contentOrder = 'default',
  gap = 'lg',
  verticalAlignment = 'center',
}: HeroTwoColumnProps) {
  const leftOrderClasses =
    contentOrder === 'default' ? 'order-2 lg:order-1' : 'order-1 lg:order-1';
  const rightOrderClasses =
    contentOrder === 'default' ? 'order-1 lg:order-2' : 'order-2 lg:order-2';

  return (
    <div className={cn('max-w-7xl mx-auto', className)}>
      <div
        className={cn(
          'grid gap-8 lg:grid-cols-2',
          gapClasses[gap],
          alignmentClasses[verticalAlignment]
        )}
      >
        {/* Left Content */}
        <div className={cn('text-center lg:text-left', leftOrderClasses)}>
          {leftContent}
        </div>

        {/* Right Content */}
        <div
          className={cn(
            'flex justify-center lg:justify-end',
            rightOrderClasses
          )}
        >
          {rightContent}
        </div>
      </div>
    </div>
  );
}
