import Footer from '@/components/footer';
import Header from '@/components/header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.narenderpahuja.in'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
