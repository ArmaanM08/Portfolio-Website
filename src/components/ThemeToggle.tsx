'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from '@phosphor-icons/react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const t = prefersDark ? 'dark' : 'light';
      setTheme(t);
      document.documentElement.setAttribute('data-theme', t);
    }
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <button onClick={toggle} className="theme-toggle-btn" aria-label="Toggle Theme">
      {mounted ? (
        theme === 'light' ? <Moon size={18} weight="bold" /> : <Sun size={18} weight="bold" />
      ) : (
        <span style={{ width: 18, height: 18 }} />
      )}
    </button>
  );
}