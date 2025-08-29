export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>header</header>
      {children}
      <footer>footer</footer>
    </>
  );
}
