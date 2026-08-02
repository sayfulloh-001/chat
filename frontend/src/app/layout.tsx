import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'NovaChat — World-Class Real-Time HD Video Chat Platform',
  description: 'Connect instantly with people worldwide via WebRTC video chat, AI real-time translation, and safety moderation.',
  keywords: ['NovaChat', 'Video Chat', 'Omegle Alternative', 'OmeTV', 'WebRTC', 'Next.js', 'AI Moderator'],
  authors: [{ name: 'NovaChat AI Team' }],
  openGraph: {
    title: 'NovaChat — World-Class Real-Time Video Chat Platform',
    description: 'Instant HD video chat, random matchmaking, AI translation, and Apple-grade ultra modern design.',
    url: 'http://localhost:3000',
    siteName: 'NovaChat',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'NovaChat Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  manifest: '/manifest.json',
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 font-sans antialiased selection:bg-purple-500 selection:text-white min-h-screen flex flex-col overflow-x-hidden">
        <AuthProvider>
          <SocketProvider>
            <div className="flex flex-col min-h-screen bg-mesh relative">
              <Navbar />
              <main className="flex-grow pt-16 relative z-10">{children}</main>
              <Footer />
            </div>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
