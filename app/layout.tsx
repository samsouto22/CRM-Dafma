import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const metadata = {
  title: 'DAFMA Agency - Marketing CRM',
  description: 'Professional CRM for modern marketing agencies',
};

import { ConfigProvider } from '@/lib/config-context';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${manrope.variable}`}>
      <body className="font-sans antialiased bg-[#f8f9f9] text-[#191c1c]" suppressHydrationWarning>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
