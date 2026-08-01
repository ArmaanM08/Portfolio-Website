'use client';

import { motion } from 'framer-motion';
import styles from './Experience.module.css';

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  period: string;
  bullets: string[];
}

interface ExperienceProps {
  data: ExperienceItem[];
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

export default function Experience({ data }: ExperienceProps) {
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
            Where I&apos;ve <span className="gradient-text">Worked</span>
          </h2>
        </motion.div>

        <motion.div
          className={styles.list}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {data.map((exp) => (
            <motion.div
              key={exp.id}
              className={styles.card}
              variants={item}
              onMouseMove={(e) => {
                const el = e.currentTarget;
                const rect = el.getBoundingClientRect();
                el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                el.style.setProperty('--my', `${e.clientY - rect.top}px`);
              }}
            >
              <div className={styles.cardTop}>
                <div>
                  <h3 className={styles.company}>{exp.company}</h3>
                  <span className={styles.position}>{exp.position}</span>
                </div>
                <span className={styles.period}>{exp.period}</span>
              </div>
              <ul className={styles.bullets}>
                {exp.bullets.map((b, i) => (
                  <li key={i} className={styles.bullet}>{b}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}