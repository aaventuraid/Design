import './globals.css';
import type { Metadata } from 'next';
import { Poppins, Montserrat, Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-montserrat',
});
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Yuki Yaki Corner – Image Pro Studio',
  description: 'Ubah foto makanan jadi profesional untuk GoFood, GrabFood, ShopeeFood.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Yuki Yaki Corner – Studio Foto F&B Profesional',
    description: 'Transformasi foto makanan jadi kualitas marketplace secara instan dengan AI.',
    type: 'website',
    url: 'https://example.com',
    locale: 'id_ID',
    siteName: 'Yuki Yaki Corner',
    images: [
      {
        url: '/logo.svg',
        width: 512,
        height: 512,
        alt: 'Logo Yuki Yaki Corner',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Yuki Yaki Corner – AI Studio Foto F&B',
    description: 'Hapus background & optimalkan foto makanan untuk GoFood, GrabFood, ShopeeFood.',
    images: ['/logo.svg'],
  },
};

// Next.js 15: themeColor should be declared in viewport export instead of metadata
export const viewport = {
  themeColor: '#F28C28'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${poppins.variable} ${montserrat.variable} ${inter.variable}`}>       
      <body className="min-h-screen flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {try { const pref = localStorage.getItem('theme'); if (pref==='dark' || (!pref && window.matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark'); } catch(e) {}})();`,
          }}
        />
        {/* Skip link for accessibility */}
        <a
          href="#main"
          className="skip-link absolute left-4 top-[-40px] focus:top-4 focus:z-[100] bg-white text-neutral-dark px-4 py-2 rounded-lg shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange/60"
        >
          Lewati ke konten utama
        </a>
        <AuthProvider>
          <Header />
          <main id="main" className="flex-1 container mx-auto px-4 py-6 sm:py-8 lg:py-10">
            {children}
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1E1E1E',
                border: '1px solid #F28C28',
              },
              success: {
                iconTheme: {
                  primary: '#F28C28',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
