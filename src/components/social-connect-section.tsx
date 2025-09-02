import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SocialLink {
  name: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
}

interface SocialConnectSectionProps {
  badge?: {
    text: string;
    icon?: LucideIcon;
  };
  title: string;
  titleHighlight?: string;
  description: string;
  socialLinks: SocialLink[];
  className?: string;
}

export default function SocialConnectSection({
  badge,
  title,
  titleHighlight,
  description,
  socialLinks,
  className,
}: SocialConnectSectionProps) {
  return (
    <div className={cn('max-w-5xl mx-auto text-center space-y-12', className)}>
      {/* Header */}
      <div className="space-y-6">
        {badge && (
          <Badge variant="outline" className="px-4 py-2">
            {badge.icon && <badge.icon className="w-4 h-4 mr-2" />}
            {badge.text}
          </Badge>
        )}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
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
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-6">
        {socialLinks.map(social => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.href}
              className={`group relative p-6 rounded-2xl bg-gradient-to-br ${social.gradient} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
            >
              <Icon className="h-8 w-8 text-white drop-shadow-lg" />
              <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
