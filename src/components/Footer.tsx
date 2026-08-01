import styles from './Footer.module.css';

const NAV = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.top}>
          <a href="#top" className={styles.brand}>
            Armaan <span className="gradient-text">Mulani</span>
          </a>
          <nav className={styles.nav} aria-label="Footer navigation">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className={styles.link}>
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#top" className={styles.toTop} aria-label="Back to top">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
            Back to top
          </a>
        </div>
        <div className={styles.bottom}>
          <span>
            &copy; {new Date().getFullYear()} Armaan Mulani. Built with Next.js
            &amp; a lot of coffee.
          </span>
          <span className={styles.tagline}>
            Machine Learning &amp; Full-Stack Developer
          </span>
        </div>
      </div>
    </footer>
  );
}
