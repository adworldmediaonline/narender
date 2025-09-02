import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  className?: string;
}

export default function AchievementCard({
  title,
  description,
  icon: Icon,
  gradient,
  className,
}: AchievementCardProps) {
  return (
    <div className={cn('group relative', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-[var(--color-gradient-secondary)]/5 rounded-2xl transform rotate-1 group-hover:rotate-0 transition-transform duration-300" />
      <div className="relative bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50">
        <div
          className={cn(
            'w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg bg-gradient-to-br',
            gradient
          )}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-card-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
