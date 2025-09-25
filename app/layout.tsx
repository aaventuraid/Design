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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${poppins.variable} ${montserrat.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
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
