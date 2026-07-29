'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setHidden(current > lastScroll && current > 100);
      setLastScroll(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScroll]);

  return (
    <header className={`header ${hidden ? 'header-hidden' : ''}`}>
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
  );
}