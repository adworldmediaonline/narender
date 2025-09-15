import { InfiniteSlider } from '@/components/ui/infinite-slider';
import Image from 'next/image';

const venues = [
  {
    src: '/images/zoro.webp',
    alt: 'Zorro Club - Premium Nightclub in Gurgaon',
    title: 'Zorro Club',
    description: 'Premium Nightclub Experience',
  },
  {
    src: '/images/diego.webp',
    alt: 'Diego Club - Luxury Nightclub in Delhi NCR',
    title: 'Diego Club',
    description: 'Luxury Nightlife Destination',
  },
  {
    src: '/images/mea-goa-cafe.webp',
    alt: 'MEA Goa - Resort & Club in Goa',
    title: 'MEA Goa',
    description: 'Beachfront Resort & Club',
  },
  {
    src: '/images/gracias.webp',
    alt: 'Gracias Cafe & Resort - Cafe & Resort in Goa',
    title: 'Gracias Cafe & Resort',
    description: 'Premium Cafe & Resort',
  },
];

export function InfiniteMovieSlider() {
  return (
    <InfiniteSlider speedOnHover={20} gap={32}>
      {venues.map((venue, index) => (
        <div key={index} className="group">
          <div className="relative">
            <Image
              src={venue.src}
              alt={venue.alt}
              width={220}
              height={180}
              className="w-[220px] md:w-[240px] lg:w-[260px] h-[140px] md:h-[160px] lg:h-[180px] rounded-[12px] object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-[12px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-lg font-semibold mb-1">{venue.title}</h3>
              <p className="text-sm opacity-90">{venue.description}</p>
            </div>
          </div>
        </div>
      ))}
    </InfiniteSlider>
  );
}
