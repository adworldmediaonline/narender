import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SocialLabelProps {
  name: string;
  icon: LucideIcon;
  className?: string;
}

export default function SocialLabel({
  name,
  icon: Icon,
  className,
}: SocialLabelProps) {
  return (
    <div className={cn('space-y-4 group', className)}>
      <div className="w-16 h-16 mx-auto rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div className="font-semibold text-lg">{name}</div>
    </div>
  );
}
