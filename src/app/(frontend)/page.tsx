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
  Instagram,
  Play,
  Star,
  Target,
  Youtube,
  Building2,
  Hotel,
  Sparkles,
  Wine,
  MapPin,
  Coffee,
  Plane,
  Waves,
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
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 -z-10" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section */}
      <Section className="relative flex items-center justify-center bg-gradient-to-r from-transparent via-orange-100/20 to-transparent py-8 sm:py-12 md:py-16">
        <div className="container px-4 sm:px-6 py-4 sm:py-6 md:py-8 lg:py-12 xl:py-16 relative z-10 max-w-7xl mx-auto">
          <HeroTwoColumn
            leftContent={
              <HeroContent
                badge={{
                  text: 'Visionary Entrepreneur & Hospitality Leader',
                  icon: Star,
                  className:
                    'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-xl rounded-full px-3 py-2 sm:px-6 sm:py-2 font-semibold text-xs sm:text-sm',
                }}
                title="Narender (Naren) Pahuja"
                subtitle="Hospitality Leader & Entrepreneur"
                description="Narender Pahuja, popularly known as Naren Pahuja, is a dynamic entrepreneur shaping India's hospitality and lifestyle industry. With ventures like Zorro Club, Diego Club, MEA Goa, Decode Airbar, Gracias Cafe & Resort, and Tramiso Travels, he has built a reputation for creating world-class experiences.

What You'll Find Here:
• Exclusive insights into Naren's journey
• Updates on his ventures & lifestyle projects
• Blogs covering hospitality, travel & entrepreneurship
• Access to his social media and public appearances

Stay connected and be part of the journey of a visionary who redefines hospitality in India."
                alignment="left"
                buttons={[
                  {
                    text: 'Explore Journey',
                    href: '/about',
                    icon: Hotel,
                    variant: 'default',
                    className:
                      'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3',
                  },
                  {
                    text: 'Read Blog',
                    href: '/blog',
                    icon: Play,
                    variant: 'outline',
                    className:
                      'border-2 border-amber-600 text-amber-700 hover:bg-amber-50 hover:border-amber-700 transform hover:scale-105 transition-all duration-200 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3',
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
      <Section className="py-8 md:py-16 lg:py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
        {/* Decorative Elements - Hidden on mobile */}
        <div className="hidden md:block absolute top-10 left-10 w-32 h-32 bg-amber-200 rounded-full opacity-20 animate-pulse" />
        <div className="hidden md:block absolute bottom-10 right-10 w-24 h-24 bg-orange-200 rounded-full opacity-20 animate-pulse" />
        <div className="hidden lg:block absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-20 animate-pulse" />

        <div className="max-w-7xl mx-auto text-center space-y-6 md:space-y-12 relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
              Narender Pahuja's Hospitality Outlets
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-amber-800 max-w-3xl mx-auto font-medium px-4">
              Discover the premium hospitality experiences crafted by a
              visionary leader across India
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Zorro Club',
                location: 'Gurgaon',
                type: 'Nightclub',
                icon: Wine,
                color: 'from-purple-500 to-pink-500',
              },
              {
                name: 'Diego Club',
                location: 'Delhi NCR',
                type: 'Nightclub',
                icon: Sparkles,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                name: 'MEA Goa',
                location: 'Goa',
                type: 'Resort & Club',
                icon: Waves,
                color: 'from-green-500 to-teal-500',
              },
              {
                name: 'Decode Airbar',
                location: 'Delhi NCR',
                type: 'Lounge',
                icon: Building2,
                color: 'from-indigo-500 to-purple-500',
              },
              {
                name: 'Gracias Cafe & Resort',
                location: 'Goa',
                type: 'Cafe & Resort',
                icon: Coffee,
                color: 'from-orange-500 to-red-500',
              },
              {
                name: 'Tramiso Travels',
                location: 'Pan India',
                type: 'Travel Agency',
                icon: Plane,
                color: 'from-amber-500 to-orange-500',
              },
            ].map((outlet, index) => (
              <div
                key={index}
                className="group relative p-4 sm:p-6 md:p-8 rounded-2xl bg-white border border-gray-200/60 hover:border-amber-300/60 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${outlet.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                />
                <div className="relative z-10 text-center space-y-4 sm:space-y-6">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div
                      className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${outlet.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <outlet.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors duration-300 leading-tight">
                    {outlet.name}
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-medium text-amber-600 bg-amber-50 px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-amber-200 group-hover:bg-amber-100 transition-colors duration-300">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{outlet.location}</span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-600 bg-gray-50 px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-gray-200 group-hover:bg-gray-100 transition-colors duration-300">
                      {outlet.type}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="py-8 sm:py-12 md:py-16 bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f59e0b' fill-opacity='0.05'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10">
          <StatsGrid
            stats={stats}
            columns={{
              mobile: 2,
              tablet: 4,
              desktop: 4,
            }}
            className="text-amber-900"
          />
        </div>
      </Section>

      {/* About Section */}
      <Section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f59e0b' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10">
          <AboutSection
            badge={{
              text: 'About Naren',
              className:
                'bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg',
            }}
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
              className:
                'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200',
            }}
            visualElement={{
              icon: Hotel,
              title: 'Hospitality Ventures',
              subtitle: '6+ Successful Brands',
              className:
                'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6',
            }}
          />
        </div>
      </Section>

      {/* Hospitality Venues Showcase */}
      <Section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-amber-400 via-orange-400 to-red-400" />
        <div className="text-center mb-8 sm:mb-12 relative z-10 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
            Experience Luxury Hospitality
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-amber-800 max-w-3xl mx-auto font-medium px-4">
            Discover Narender Pahuja's premium hospitality venues across India
            through stunning visuals
          </p>
        </div>
        <InfiniteMovieSlider />
      </Section>

      {/* Achievements Section */}
      <Section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ea580c' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10">
          <AchievementsSection
            badge={{
              text: 'Achievements & Highlights',
              icon: Award,
              className:
                'bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg',
            }}
            title="Celebrating Success &"
            titleHighlight="Innovation"
            description="A journey of creativity, leadership, and entrepreneurial excellence"
            achievements={achievements}
            columns={{ mobile: 2, tablet: 2, desktop: 4 }}
            className="text-orange-900"
          />
        </div>
      </Section>

      {/* Social Connect Section */}
      <Section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 relative">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />
        <div className="relative z-10">
          <SocialConnectSection
            badge={{
              text: 'Connect with Naren',
              icon: Star,
              className:
                'bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg',
            }}
            title="Stay Connected &"
            titleHighlight="Follow My Journey"
            description="Follow Narender Pahuja on social media to stay updated with his latest hospitality ventures:"
            socialLinks={socialLinks}
            className="text-amber-900"
          />
        </div>
      </Section>
    </main>
  );
}
