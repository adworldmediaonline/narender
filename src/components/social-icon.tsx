import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SocialIconProps {
  name: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'p-4 h-6 w-6',
  md: 'p-6 h-8 w-8',
  lg: 'p-8 h-10 w-10',
};

export default function SocialIcon({
  name,
  href,
  icon: Icon,
  gradient,
  size = 'md',
  className,
}: SocialIconProps) {
  const [padding, iconSize] = sizeClasses[size].split(' ');

  return (
    <a
      href={href}
      className={cn(
        'group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 bg-gradient-to-br',
        padding,
        gradient,
        className
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
    >
      <Icon className={cn(iconSize, 'text-white drop-shadow-lg')} />
      <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </a>
  );
}
