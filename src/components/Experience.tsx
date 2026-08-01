'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import styles from './Experience.module.css';

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  period: string;
  type: 'work';
  bullets?: string[];
}

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  type: 'education';
}

interface ExperienceProps {
  data: ExperienceItem[];
  education: EducationItem[];
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
  },
};

type TimelineEntry = ExperienceItem | EducationItem;

export default function Experience({ data, education }: ExperienceProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 80%', 'end 60%'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const isCurrent = (period: string) =>
    period.toLowerCase().includes('present');

  const renderEntry = (entry: TimelineEntry) => {
    const current = isCurrent(entry.period);
    const edu = entry.type === 'education';
    return (
      <motion.div
        key={entry.id}
        className={`${styles.card} ${edu ? styles.educationCard : ''}`}
        variants={item}
        onMouseMove={(e) => {
          const el = e.currentTarget;
          const rect = el.getBoundingClientRect();
          el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
          el.style.setProperty('--my', `${e.clientY - rect.top}px`);
        }}
      >
        <span className={`${styles.node} ${current ? styles.nodeCurrent : ''}`}>
          <span className={styles.nodeDot} />
        </span>

        <div className={styles.cardBody}>
          <div className={styles.cardTop}>
            <div>
              <h3 className={styles.company}>
                {edu ? entry.institution : entry.company}
              </h3>
              <span className={styles.position}>
                {edu ? entry.degree : entry.position}
              </span>
            </div>
            <span className={styles.period}>
              {current && (
                <span className={styles.currentPill}>
                  <span className={styles.currentDot} />
                  Current
                </span>
              )}
              {entry.period}
            </span>
          </div>

          {!edu && entry.bullets && (
            <ul className={styles.bullets}>
              {entry.bullets.map((b, i) => (
                <li key={i} className={styles.bullet}>
                  {b}
                </li>
              ))}
            </ul>
          )}

          {edu && (
            <div className={styles.educationTag}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10 12 5 2 10l10 5 10-5z" />
                <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
              </svg>
              Bachelor of Technology · Computer Science
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <section id="experience" className={`section-padding ${styles.section}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring' as const, stiffness: 100, damping: 20 }}
          className={styles.headerWrap}
        >
          <span className="eyebrow-badge">Experience</span>
          <h2 className={`bold-heading ${styles.heading}`}>
            My <span className="gradient-text">Journey</span>
          </h2>
        </motion.div>

        <div className={styles.railWrap} ref={railRef}>
          <div className={styles.rail} aria-hidden="true">
            <motion.div
              className={styles.railFill}
              style={{ scaleY, transformOrigin: 'top' }}
            />
          </div>
          <motion.div
            className={styles.list}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {data.map(renderEntry)}
            {education.map(renderEntry)}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
