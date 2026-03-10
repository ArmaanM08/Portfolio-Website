import type { Metadata } from 'next';
import './globals.css';
import ThemeToggle from '../components/ThemeToggle';
import Link from 'next/link';

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
    <html lang="en" data-theme="dark">
      <body>
        <header className="header">
          <div className="container nav-container">
            <Link href="/" className="logo gradient-text">ARMAAN</Link>
            <nav className="nav-links">
              <Link href="/#projects" className="nav-link">Projects</Link>
              <Link href="/#skills" className="nav-link">Skills</Link>
              <Link href="/#contact" className="nav-link">Contact</Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
