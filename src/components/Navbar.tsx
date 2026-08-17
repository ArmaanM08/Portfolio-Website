'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useEffect, useState } from 'react';
import { List, X } from '@phosphor-icons/react';

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setHidden(current > lastScroll && current > 80);
      setLastScroll(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScroll]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className={`header ${hidden ? 'header-hidden' : ''}`}>
      <div className="container nav-container">
        <Link href="/" className="logo gradient-text" onClick={() => setMenuOpen(false)}>ARMAAN</Link>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>

        <nav className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`} aria-label="Main navigation">
          <Link href="/#projects" className="nav-link" onClick={() => setMenuOpen(false)}>Projects</Link>
          <Link href="/#certifications" className="nav-link" onClick={() => setMenuOpen(false)}>Certifications</Link>
          <Link href="/#skills" className="nav-link" onClick={() => setMenuOpen(false)}>Skills</Link>
          <Link href="/#contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</Link>
          <ThemeToggle />
        </nav>
      </div>

      {menuOpen && <div className="nav-overlay" onClick={() => setMenuOpen(false)} />}
    </header>
  );
}