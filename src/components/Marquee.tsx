'use client';

import styles from './Marquee.module.css';

const TECH = [
  'Python',
  'TypeScript',
  'React / Next.js',
  'Node.js',
  'Machine Learning',
  'FastAPI',
  'MySQL',
  'MongoDB',
  'AWS',
  'Docker',
  'Kubernetes',
  'Jenkins',
  'Git',
];

export default function Marquee() {
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        {[0, 1].map((group) => (
          <div className={styles.group} key={group}>
            {TECH.map((t, i) => (
              <span className={styles.item} key={`${group}-${i}`}>
                <span className={styles.star}>&#10038;</span>
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
