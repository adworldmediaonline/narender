import { Facebook, Hotel, Instagram, Youtube, Target } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/naren_pahuja_official/',
    icon: Instagram,
    color: 'hover:text-pink-600',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/NarendraNarenPahuja',
    icon: Facebook,
    color: 'hover:text-blue-600',
  },
  {
    name: 'LinkedIn',
    href: 'https://in.linkedin.com/in/narendra-pahuja',
    icon: Target,
    color: 'hover:text-blue-600',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@narendrapahuja9522',
    icon: Youtube,
    color: 'hover:text-red-600',
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Hotel className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Narender Pahuja</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Visionary Entrepreneur | Hospitality Leader | Lifestyle Innovator
              shaping India's hospitality industry.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Blog
              </Link>
            </nav>
          </div>

          {/* Social Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Follow Narender Pahuja</h3>
            <div className="flex space-x-4">
              {socialLinks.map(social => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`text-muted-foreground transition-colors ${social.color}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              Stay connected with Naren's hospitality journey
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Narender Pahuja. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
