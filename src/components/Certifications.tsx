'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import styles from './Certifications.module.css';
import Magnetic from './Magnetic';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image?: string | null;
  file: string;
  verify?: string | null;
  description?: string;
}

interface CertificationsProps {
  data: Certification[];
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
  },
};

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 18 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={styles.tilt}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}

export default function Certifications({ data }: CertificationsProps) {
  if (!data || data.length === 0) return null;

  return (
    <section id="certifications" className={`section-padding ${styles.section}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring' as const, stiffness: 100, damping: 20 }}
          className={styles.headerWrap}
        >
          <span className="eyebrow-badge">Credentials</span>
          <h2 className={`bold-heading ${styles.heading}`}>
            Verified <span className="gradient-text">Certifications</span>
          </h2>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {data.map((cert) => (
            <motion.div key={cert.id} className={styles.item} variants={item}>
              <TiltCard>
                <div
                  className={styles.card}
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
                  }}
                >
                  {cert.image && (
                    <a
                      href={cert.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.imageLink}
                      aria-label={`View ${cert.title} certificate`}
                    >
                      <motion.div
                        className={styles.imageFrame}
                        initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: -1 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                      >
                        <img
                          src={cert.image}
                          alt={`${cert.title} certificate`}
                          className={styles.certImage}
                          loading="lazy"
                        />
                        <span className={styles.imageOverlay}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          View Certificate
                        </span>
                      </motion.div>
                    </a>
                  )}

                  <div className={styles.cardBody}>
                    <span className={styles.issuerBadge}>{cert.issuer}</span>
                    <h3 className={styles.title}>{cert.title}</h3>
                    {cert.description && <p className={styles.desc}>{cert.description}</p>}

                    <div className={styles.meta}>
                      <span className={styles.dateChip}>
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {cert.date}
                      </span>
                      {cert.verify && (
                        <a
                          href={cert.verify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.verifyLink}
                        >
                          Verify ↗
                        </a>
                      )}
                    </div>

                    <div className={styles.actions}>
                      <Magnetic>
                        <a
                          href={cert.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`btn ${styles.cardBtn}`}
                        >
                          View Certificate
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </a>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
