import FeatureCard from '@/components/feature-card';
import Section from '@/components/section';
import { Button } from '@/components/ui/button';
import { Award, Eye, Film, Heart, Target } from 'lucide-react';
import Link from 'next/link';

const visionMission = [
  {
    title: 'Vision',
    description:
      'To create films and experiences that inspire, entertain, and leave a lasting impact on society.',
    icon: Eye,
  },
  {
    title: 'Mission',
    description:
      'To combine creativity, innovation, and entrepreneurship for building a legacy of meaningful storytelling and world-class hospitality.',
    icon: Target,
  },
];

const quickInfo = [
  {
    title: '🏢 Production House',
    description: 'JRK Films',
    icon: Film,
  },
  {
    title: '🎬 Notable Works',
    description:
      'Nikita Roy, Fauji Calling, Pagalpanti, Insurance Jimmy, All The Best Pandya, Aao na song.',
    icon: Award,
  },
  {
    title: '🔖 Tagline',
    description: 'Jimmy Asija is a film producer with a golden heart.',
    icon: Heart,
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <Section className="bg-gradient-to-br from-background to-muted/50 min-h-[60vh] flex items-center">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
            About Jimmy Asija
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Jimmy Asija is a passionate film producer, entrepreneur, and
            hospitality innovator from Gurgaon, Haryana, India. He has carved
            his own niche in Bollywood by backing impactful films and inspiring
            stories that resonate with audiences.
          </p>
        </div>
      </Section>

      {/* Main About Content */}
      <Section>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="prose prose-lg mx-auto text-center">
            <p className="text-lg md:text-xl leading-relaxed">
              From commercial entertainers like Pagalpanti to heartfelt films
              like Fauji Calling, Jimmy believes in balancing entertainment with
              purpose. His upcoming projects, including Nikita Roy and All The
              Best Pandya, are proof of his vision for meaningful cinema.
            </p>
            <br />
            <p className="text-lg md:text-xl leading-relaxed">
              Beyond films, Jimmy owns hospitality outlets where he ensures
              every guest feels the warmth of Indian culture blended with modern
              luxury. His commitment to excellence makes him a respected name
              across industries.
            </p>
          </div>
        </div>
      </Section>

      {/* Vision & Mission */}
      <Section className="bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Vision & Mission
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {visionMission.map((item, index) => (
              <FeatureCard
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
                className="text-center"
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Quick Info */}
      <Section>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Quick Info
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {quickInfo.map((info, index) => (
              <FeatureCard
                key={index}
                title={info.title}
                description={info.description}
                icon={info.icon}
                className="text-center"
              />
            ))}
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
            Explore Jimmy's latest projects and stay updated with his journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/blog">📖 Read My Blog</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6"
            >
              <Link href="/">🏠 Back to Home</Link>
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
