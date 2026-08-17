import type { Metadata } from 'next';
import './globals.css';
import SiteChrome from '../components/SiteChrome';
import SmoothScrollProvider from '../components/SmoothScrollProvider';

export const metadata: Metadata = {
  title: 'Portfolio | Armaan Mulani',
  description: 'Personal portfolio of Armaan Mulani, an aspiring data scientist and full-stack developer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  if (!t) {
                    t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (t) document.documentElement.setAttribute('data-theme', t);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <SmoothScrollProvider>
          <SiteChrome />
          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}