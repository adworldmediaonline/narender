import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface Achievement {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

interface AchievementsSectionProps {
  badge?: {
    text: string;
    icon?: LucideIcon;
    className?: string;
  };
  title: string;
  titleHighlight?: string;
  description: string;
  achievements: Achievement[];
  columns?: {
    mobile: 1 | 2;
    tablet: 2 | 3 | 4;
    desktop: 2 | 3 | 4 | 5 | 6;
  };
  className?: string;
}

const getColumnClasses = (columns: AchievementsSectionProps['columns']) => {
  const mobile = `grid-cols-${columns?.mobile || 2}`;
  const tablet = `md:grid-cols-${columns?.tablet || 4}`;
  const desktop = `lg:grid-cols-${columns?.desktop || 4}`;

  return `${mobile} ${tablet} ${desktop}`;
};

export default function AchievementsSection({
  badge,
  title,
  titleHighlight,
  description,
  achievements,
  columns,
  className,
}: AchievementsSectionProps) {
  return (
    <div className={cn('max-w-7xl mx-auto', className)}>
      {/* Header */}
      <div className="text-center mb-16">
        {badge && (
          <Badge variant="outline" className="mb-4 px-4 py-2">
            {badge.icon && <badge.icon className="w-4 h-4 mr-2" />}
            {badge.text}
          </Badge>
        )}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
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
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {description}
        </p>
      </div>

      {/* Achievements Grid */}
      <div className={cn('grid gap-8', getColumnClasses(columns))}>
        {achievements.map((achievement, index) => (
          <div key={index} className="group h-full">
            <div className="h-full bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 group-hover:border-primary/20 relative overflow-hidden">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-[var(--color-gradient-secondary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              {/* Content */}
              <div className="relative z-10">
                <div
                  className={cn(
                    'w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg bg-gradient-to-br',
                    achievement.gradient
                  )}
                >
                  <achievement.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-card-foreground">
                  {achievement.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {achievement.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
