import './globals.css';

export const metadata = {
  title: 'ZenEnhance — Visual Effects Engine for Zenler',
  description: 'Transform your Zenler course pages with 25+ modern CSS effects powered by AI. Gradient text, glassmorphism, animated shadows, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
