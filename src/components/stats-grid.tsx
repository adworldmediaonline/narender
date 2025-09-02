import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
}

interface StatsGridProps {
  stats: Stat[];
  columns?: {
    mobile: 2 | 3 | 4;
    tablet: 2 | 3 | 4;
    desktop: 2 | 3 | 4 | 5 | 6;
  };
  className?: string;
}

const getColumnClasses = (columns: StatsGridProps['columns']) => {
  const mobile = `grid-cols-${columns?.mobile || 2}`;
  const tablet = `md:grid-cols-${columns?.tablet || 4}`;
  const desktop = `lg:grid-cols-${columns?.desktop || 4}`;

  return `${mobile} ${tablet} ${desktop}`;
};

export default function StatsGrid({
  stats,
  columns,
  className,
}: StatsGridProps) {
  return (
    <div className={cn('max-w-6xl mx-auto', className)}>
      <div className={cn('grid gap-8', getColumnClasses(columns))}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/10 to-[var(--color-gradient-secondary)]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
