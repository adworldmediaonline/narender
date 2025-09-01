import AboutSection from '@/components/about-section';
import AchievementsSection from '@/components/achievements-section';
import CTASection from '@/components/cta-section';
import HeroContent from '@/components/hero-content';
import HeroProfileImage from '@/components/hero-profile-image';
import HeroTwoColumn from '@/components/hero-two-column';
import Section from '@/components/section';
import SocialConnectSection from '@/components/social-connect-section';
import StatsGrid from '@/components/stats-grid';
import {
  Award,
  Camera,
  Facebook,
  Film,
  Instagram,
  Play,
  Star,
  Target,
  TrendingUp,
  Twitter,
  Utensils,
  Youtube,
} from 'lucide-react';

const achievements = [
  {
    title: 'Film Producer',
    description:
      'Nikita Roy, Pagalpanti, Fauji Calling, All The Best Pandya, Insurance Jimmy, Aao Na Song.',
    icon: Film,
    gradient:
      'from-[var(--color-gradient-primary)] via-primary to-[var(--color-gradient-info)]',
  },
  {
    title: 'Hospitality Business',
    description: 'Building unique lifestyle experiences.',
    icon: Utensils,
    gradient: 'from-[var(--color-gradient-success)] via-green-600 to-teal-600',
  },
  {
    title: 'Entrepreneurship',
    description: 'Founder of multiple successful ventures.',
    icon: TrendingUp,
    gradient: 'from-[var(--color-gradient-accent)] via-orange-600 to-red-600',
  },
  {
    title: 'Visionary',
    description: 'Known for creativity, leadership & innovation.',
    icon: Target,
    gradient:
      'from-[var(--color-gradient-secondary)] via-purple-600 to-violet-600',
  },
];

const socialLinks = [
  {
    name: 'Facebook',
    href: '#',
    icon: Facebook,
    color: 'hover:text-primary',
    gradient: 'from-[var(--color-gradient-primary)] via-primary to-blue-700',
  },
  {
    name: 'Instagram',
    href: '#',
    icon: Instagram,
    color: 'hover:text-pink-600',
    gradient: 'from-pink-600 via-rose-600 to-pink-700',
  },
  {
    name: 'Twitter',
    href: '#',
    icon: Twitter,
    color: 'hover:text-primary',
    gradient: 'from-[var(--color-gradient-info)] via-primary to-blue-700',
  },
  {
    name: 'YouTube',
    href: '#',
    icon: Youtube,
    color: 'hover:text-red-600',
    gradient: 'from-[var(--color-gradient-accent)] via-orange-600 to-red-700',
  },
];

const stats = [
  { label: 'Films Produced', value: '8+', icon: Camera },
  { label: 'Years Experience', value: '15+', icon: Award },
  { label: 'Business Ventures', value: '5+', icon: Star },
  { label: 'Happy Clients', value: '1000+', icon: Play },
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
                  text: 'Visionary Film Producer & Entrepreneur',
                  icon: Star,
                }}
                title="Jimmy Asija"
                subtitle="A Film Producer with a Golden Heart"
                description="Welcome to the official website of Jimmy Asija – a visionary entrepreneur, passionate filmmaker, and hospitality innovator."
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
                src="/images/Jimmy Asija.jpeg"
                alt="Jimmy Asija - Film Producer & Entrepreneur"
              />
            }
            gap="md"
            verticalAlignment="center"
          />
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
          badge={{ text: 'About Jimmy' }}
          title="Dynamic Entrepreneur &"
          titleHighlight="Film Producer"
          paragraphs={[
            'Jimmy Asija is a dynamic entrepreneur and Bollywood film producer known for movies like Fauji Calling, Pagalpanti, All The Best Pandya, Insurance Jimmy, Nikita Roy, and many more. With a golden heart and a sharp business mind, he has built a name in both the film industry and the hospitality sector.',
            'His production house JRK Films is focused on delivering stories that connect with audiences on an emotional level. Alongside films, Jimmy is also dedicated to creating unforgettable experiences in the hospitality world.',
          ]}
          ctaButton={{
            text: 'Learn More About Jimmy',
            href: '/about',
            icon: Play,
          }}
          visualElement={{
            icon: Film,
            title: 'JRK Films',
            subtitle: 'Production House',
          }}
        />
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
          badge={{ text: 'Social Connect Section', icon: Star }}
          title="Stay Connected &"
          titleHighlight="Follow My Journey"
          description="Follow Jimmy Asija on social media to stay updated:"
          socialLinks={socialLinks}
          showLabels={true}
        />
      </Section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Explore?"
        description="Discover more about Jimmy Asija's journey in filmmaking and entrepreneurship"
        buttons={[
          {
            text: 'Explore My Journey',
            href: '/about',
            icon: Film,
            variant: 'secondary',
          },
          {
            text: 'Read My Blog',
            href: '/blog',
            icon: Play,
            variant: 'outline',
          },
        ]}
        background="gradient"
      />
    </main>
  );
}
