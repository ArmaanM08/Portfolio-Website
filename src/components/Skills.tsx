'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Skills.module.css';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

interface SkillsProps {
  data: Skill[];
  projectsCount?: number;
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
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

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let start: number | null = null;
    const duration = 1400;

    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      setVal(Math.round(p * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span className={styles.statNumber} ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

export default function Skills({ data, projectsCount = 0 }: SkillsProps) {
  const categories = Array.from(new Set(data.map((s) => s.category)));
  const stats = [
    { to: data.length, suffix: '+', label: 'Core Technologies' },
    { to: categories.length, suffix: '', label: 'Skill Categories' },
    { to: projectsCount, suffix: '', label: 'Projects Shipped' },
  ];

  return (
    <section id="skills" className={`section-padding ${styles.section}`}>
      <div className={`container ${styles.container}`}>
        <motion.div
          className={styles.visualSide}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <span className="eyebrow-badge">Expertise</span>
          <h2 className={`bold-heading`}>
            Technical <br /><span className="gradient-text">Arsenal</span>
          </h2>
          <div className={styles.statsCard}>
            {stats.map((s) => (
              <div key={s.label} className={styles.statItem}>
                <CountUp to={s.to} suffix={s.suffix} />
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.skillsSide}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {categories.map((category) => (
            <motion.div key={category} className={styles.categoryGroup} variants={item}>
              <h3 className={styles.categoryTitle}>{category}</h3>
              <div className={styles.skillsWrap}>
                {data.filter((s) => s.category === category).map((skill, index) => (
                  <div
                    key={skill.id}
                    className={styles.skillItem}
                    style={{ transitionDelay: `${index * 0.05}s` }}
                  >
                    <div className={styles.skillHeader}>
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className={styles.progressBarBg}>
                      <motion.div
                        className={styles.progressBarFill}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: index * 0.1,
                          ease: [0.175, 0.885, 0.32, 1.275],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}