import styles from './Footer.module.css';

const NAV = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

interface FooterProps {
  contact: { email?: string; phone?: string };
  resume?: { file?: string | null } | null;
}

export default function Footer({ contact, resume }: FooterProps) {
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

        {(contact.email || contact.phone || resume?.file) && (
          <div className={styles.contact}>
            {contact.email && (
              <a href={`mailto:${contact.email}`} className={styles.contactLink}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {contact.email}
              </a>
            )}
            {contact.phone && (
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className={styles.contactLink}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {contact.phone}
              </a>
            )}
            {resume?.file && (
              <a href={resume.file} download className={styles.contactLink}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Resume
              </a>
            )}
          </div>
        )}

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