import Section from '@/components/section';
import { Facebook, Instagram, Target, Youtube } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Narender Pahuja',
  description: 'About Narender Pahuja',
  alternates: {
    canonical: '/about',
  },
};

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/naren_pahuja_official/',
    icon: Instagram,
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/NarendraNarenPahuja',
    icon: Facebook,
  },
  {
    name: 'LinkedIn',
    href: 'https://in.linkedin.com/in/narendra-pahuja',
    icon: Target,
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@narendrapahuja9522',
    icon: Youtube,
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-background to-muted/50 min-h-[60vh] flex items-center">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
            About Narender (Naren) Pahuja
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Narender Pahuja, affectionately called Naren Pahuja, is a
            hospitality leader and entrepreneur known for creating exceptional
            guest experiences. With years of expertise in nightlife, travel, and
            premium hospitality, he has transformed his vision into reality
            through multiple successful ventures across India.
          </p>
        </div>
      </Section>

      {/* Journey & Career */}
      <Section className="bg-muted/30">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Journey & Career
            </h2>
          </div>
          <div className="prose prose-lg mx-auto">
            <p className="text-lg md:text-xl leading-relaxed text-center ">
              From his early days as a passionate visionary to becoming a
              successful hospitality owner, Naren Pahuja's career reflects his
              belief in innovation, hard work, and customer-centric values.
              Today, his brands such as Zorro Club Gurgaon, Diego Club, MEA Goa
              Resort & Club, Decode Airbar, Gracias Cafe & Resort, and Tramiso
              Travels are benchmarks in the hospitality industry.
            </p>
          </div>
        </div>
      </Section>

      {/* Philosophy */}
      <Section>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 ">
              Philosophy
            </h2>
          </div>
          <div className="prose prose-lg mx-auto">
            <p className="text-lg md:text-xl leading-relaxed text-center ">
              For Naren, hospitality is not just about managing spaces — it's
              about creating memories and connections. His philosophy combines
              luxury, detail, and warmth, making every guest experience truly
              unforgettable.
            </p>
          </div>
        </div>
      </Section>

      {/* Vision */}
      <Section className="bg-muted/30">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 ">
              Vision
            </h2>
          </div>
          <div className="prose prose-lg mx-auto">
            <p className="text-lg md:text-xl leading-relaxed text-center ">
              Naren Pahuja continues to expand his horizons in hospitality,
              travel, and lifestyle, with a goal to establish India as a global
              hub for world-class nightlife and tourism experiences.
            </p>
          </div>
        </div>
      </Section>

      {/* Connect with Naren Pahuja */}
      <Section>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Connect with Narender Pahuja
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {socialLinks.map(social => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{social.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-muted/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Learn More?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Explore Naren's hospitality ventures and stay updated with his
            journey in the industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-6 text-lg"
            >
              📖 Read My Insights
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 py-6 text-lg"
            >
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
