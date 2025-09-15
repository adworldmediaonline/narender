import AboutSection from '@/components/about-section';
import AchievementsSection from '@/components/achievements-section';
import HeroContent from '@/components/hero-content';
import HeroProfileImage from '@/components/hero-profile-image';
import HeroTwoColumn from '@/components/hero-two-column';
import Section from '@/components/section';
import SocialConnectSection from '@/components/social-connect-section';
import StatsGrid from '@/components/stats-grid';
import {
  Award,
  Facebook,
  Film,
  Instagram,
  Play,
  Star,
  Target,
  Youtube,
  Building2,
  Hotel,
  Sparkles,
} from 'lucide-react';
import { InfiniteMovieSlider } from '../../components/infinite-movie-slider';

const achievements = [
  {
    title: 'Hospitality Ventures',
    description:
      'Zorro Club, Diego Club, MEA Goa, Decode Airbar, Gracias Cafe & Resort, Tramiso Travels.',
    icon: Building2,
    gradient:
      'from-[var(--color-gradient-primary)] via-primary to-[var(--color-gradient-info)]',
  },
  {
    title: 'Nightlife Excellence',
    description: 'Premium nightclubs and lifestyle experiences.',
    icon: Sparkles,
    gradient: 'from-[var(--color-gradient-success)] via-green-600 to-teal-600',
  },
  {
    title: 'Hospitality Leadership',
    description: 'Leading innovation in hospitality and tourism.',
    icon: Hotel,
    gradient: 'from-[var(--color-gradient-accent)] via-orange-600 to-red-600',
  },
  {
    title: 'Visionary Entrepreneur',
    description: "Shaping India's hospitality industry with passion.",
    icon: Target,
    gradient:
      'from-[var(--color-gradient-secondary)] via-purple-600 to-violet-600',
  },
];

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/naren_pahuja_official/',
    icon: Instagram,
    color: 'hover:text-pink-600',
    gradient: 'from-pink-600 via-rose-600 to-pink-700',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/NarendraNarenPahuja',
    icon: Facebook,
    color: 'hover:text-primary',
    gradient: 'from-[var(--color-gradient-primary)] via-primary to-blue-700',
  },
  {
    name: 'LinkedIn',
    href: 'https://in.linkedin.com/in/narendra-pahuja',
    icon: Target,
    color: 'hover:text-blue-600',
    gradient: 'from-[var(--color-gradient-info)] via-blue-600 to-blue-700',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@narendrapahuja9522',
    icon: Youtube,
    color: 'hover:text-red-600',
    gradient: 'from-[var(--color-gradient-accent)] via-orange-600 to-red-700',
  },
];

const stats = [
  { label: 'Hospitality Ventures', value: '6+', icon: Building2 },
  { label: 'Years Experience', value: '10+', icon: Award },
  { label: 'Happy Guests', value: '50K+', icon: Play },
  { label: 'Locations', value: 'Pan India', icon: Target },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background -z-10" />

      {/* Hero Section */}
      <Section className="relative flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background py-2 md:py-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-[var(--color-gradient-secondary)]/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,var(--color-gradient-primary),0.03),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,var(--color-gradient-secondary),0.02),transparent_60%)]" />

        <div className="container px-4 py-8 md:py-12 lg:py-16 relative z-10">
          <HeroTwoColumn
            leftContent={
              <HeroContent
                badge={{
                  text: 'Visionary Entrepreneur | Hospitality Leader | Lifestyle Innovator',
                  icon: Star,
                }}
                title="Narender (Naren) Pahuja"
                subtitle="Hospitality Leader & Entrepreneur"
                description="Narender Pahuja, popularly known as Naren Pahuja, is a dynamic entrepreneur shaping India's hospitality and lifestyle industry. With ventures like Zorro Club, Diego Club, MEA Goa, Decode Airbar, Gracias Cafe & Resort, and Tramiso Travels, he has built a reputation for creating world-class experiences that blend luxury, comfort, and innovation. Whether it's managing premium nightclubs, establishing hospitality brands, or designing memorable travel experiences, Naren Pahuja stands as a symbol of excellence and passion.

What You'll Find Here:
• Exclusive insights into Naren Pahuja's journey
• Updates on his ventures & lifestyle projects
• Blogs covering hospitality, travel, entrepreneurship & leadership
• Access to his social media and public appearances

Stay connected and be part of the journey of a visionary who redefines hospitality in India."
                alignment="left"
                buttons={[
                  {
                    text: 'Explore My Journey',
                    href: '/about',
                    icon: Film,
                    variant: 'default',
                  },
                  {
                    text: 'Read My Blog',
                    href: '/blog',
                    icon: Play,
                    variant: 'outline',
                  },
                ]}
              />
            }
            rightContent={
              <HeroProfileImage
                src="/images/narender.webp"
                alt="Narender Pahuja - Hospitality Leader & Entrepreneur"
              />
            }
            gap="md"
            verticalAlignment="center"
          />
        </div>
      </Section>

      {/* Hospitality Outlets Section */}
      <Section className="py-10 md:py-12 bg-gradient-to-r from-primary/5 via-muted/5 to-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Narender Pahuja's Hospitality Outlets
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Zorro Club', location: 'Gurgaon', type: 'Nightclub' },
              { name: 'Diego Club', location: 'Delhi NCR', type: 'Nightclub' },
              { name: 'MEA Goa', location: 'Goa', type: 'Resort & Club' },
              { name: 'Decode Airbar', location: 'Delhi NCR', type: 'Lounge' },
              {
                name: 'Gracias Cafe & Resort',
                location: 'Goa',
                type: 'Cafe & Resort',
              },
              {
                name: 'Tramiso Travels',
                location: 'Pan India',
                type: 'Travel Agency',
              },
            ].map((outlet, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-border/50 bg-background hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{outlet.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {outlet.location}
                </p>
                <p className="text-sm font-medium text-primary">
                  {outlet.type}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="py-10 md:py-12 bg-gradient-to-r from-primary/5 via-muted/5 to-primary/5">
        <StatsGrid
          stats={stats}
          columns={{
            mobile: 2,
            tablet: 4,
            desktop: 4,
          }}
        />
      </Section>

      {/* About Section */}
      <Section className="py-10 md:py-12 bg-gradient-to-br from-background to-muted/30 border-y border-border/50">
        <AboutSection
          badge={{ text: 'About Naren' }}
          title="Visionary Entrepreneur &"
          titleHighlight="Hospitality Leader"
          paragraphs={[
            "Narender Pahuja, popularly known as Naren Pahuja, is a dynamic entrepreneur shaping India's hospitality and lifestyle industry. With ventures like Zorro Club, Diego Club, MEA Goa, Decode Airbar, Gracias Cafe & Resort, and Tramiso Travels, he has built a reputation for creating world-class experiences that blend luxury, comfort, and innovation.",
            "Whether it's managing premium nightclubs, establishing hospitality brands, or designing memorable travel experiences, Naren Pahuja stands as a symbol of excellence and passion.",
          ]}
          ctaButton={{
            text: 'Learn More About Naren',
            href: '/about',
            icon: Play,
          }}
          visualElement={{
            icon: Hotel,
            title: 'Hospitality Ventures',
            subtitle: '6+ Successful Brands',
          }}
        />
      </Section>

      {/* Infinite Movie Slider */}
      <Section className="py-10 md:py-12 bg-gradient-to-r from-primary/5 via-muted/5 to-primary/5">
        <InfiniteMovieSlider />
      </Section>

      {/* Achievements Section */}
      <Section className="py-10 md:py-12 bg-gradient-to-r from-muted/50 via-background to-muted/50 border-y border-border/50">
        <AchievementsSection
          badge={{ text: 'Achievements & Highlights', icon: Award }}
          title="Celebrating Success &"
          titleHighlight="Innovation"
          description="A journey of creativity, leadership, and entrepreneurial excellence"
          achievements={achievements}
          columns={{ mobile: 2, tablet: 2, desktop: 4 }}
        />
      </Section>

      {/* Social Connect Section */}
      <Section className="py-10 md:py-12 bg-gradient-to-br from-primary/5 via-muted/5 to-primary/5 border-y border-border/50">
        <SocialConnectSection
          badge={{ text: 'Connect with Naren', icon: Star }}
          title="Stay Connected &"
          titleHighlight="Follow My Journey"
          description="Follow Narender Pahuja on social media to stay updated with his latest hospitality ventures:"
          socialLinks={socialLinks}
        />
      </Section>

      {/* Social Media CTA Section */}
      <Section className="py-10 md:py-12 bg-gradient-to-br from-primary/5 via-muted/5 to-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Follow Narender Pahuja
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://www.instagram.com/naren_pahuja_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-700 hover:to-rose-700 h-11 px-6 py-6 text-lg gap-2"
            >
              <Instagram className="h-5 w-5" />
              Instagram
            </a>
            <a
              href="https://in.linkedin.com/in/narendra-pahuja"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 h-11 px-6 py-6 text-lg gap-2"
            >
              <Target className="h-5 w-5" />
              LinkedIn
            </a>
            <a
              href="https://youtube.com/@narendrapahuja9522"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 h-11 px-6 py-6 text-lg gap-2"
            >
              <Youtube className="h-5 w-5" />
              YouTube
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
