import { InfiniteSlider } from '@/components/ui/infinite-slider';
import Image from 'next/image';

const movies = [
  {
    src: '/images/movie/all_the_best.jpg',
    alt: 'All The Best Pandya - Bollywood Film',
    title: 'All The Best Pandya',
  },
  {
    src: '/images/movie/Nikita_Roy.jpeg',
    alt: 'Nikita Roy - Bollywood Film',
    title: 'Nikita Roy',
  },
  {
    src: '/images/movie/aao_song.jpg',
    alt: 'Aao Na Song - Bollywood Film',
    title: 'Aao Na Song',
  },
  {
    src: '/images/movie/Pagalpanti.jpg',
    alt: 'Pagalpanti - Bollywood Film',
    title: 'Pagalpanti',
  },
  {
    src: '/images/movie/fauji.jpg',
    alt: 'Fauji Calling - Bollywood Film',
    title: 'Fauji Calling',
  },
  {
    src: '/images/movie/Insurance_Jimmy.jpg',
    alt: 'Insurance Jimmy - Bollywood Film',
    title: 'Insurance Jimmy',
  },
];

export function InfiniteMovieSlider() {
  return (
    <InfiniteSlider speedOnHover={20} gap={32}>
      {movies.map((movie, index) => (
        <div key={index} className="group">
          <Image
            src={movie.src}
            alt={movie.alt}
            width={180}
            height={270}
            className="w-[180px] md:w-[200px] lg:w-[220px] rounded-[8px] object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ))}
    </InfiniteSlider>
  );
}
