'use client';

import { motion } from 'framer-motion';
import styles from './Projects.module.css';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
  featured?: boolean;
  repo?: string | null;
  demo?: string | null;
}

interface ProjectsProps {
  data: Project[];
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
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

function ProjectLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.projectLink}
    >
      {label}
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
  );
}

export default function Projects({ data }: ProjectsProps) {
  const [featured, ...rest] = data;

  return (
    <section id="projects" className={`section-padding ${styles.section}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring' as const, stiffness: 100, damping: 20 }}
          className={styles.headerWrap}
        >
          <span className="eyebrow-badge">Portfolio</span>
          <h2 className={`bold-heading ${styles.heading}`}>
            Selected <span className="gradient-text">Works</span>
          </h2>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {featured && (
            <motion.div
              key={featured.id}
              className={`${styles.projectCard} ${styles.featured}`}
              variants={item}
              onMouseMove={(e) => {
                const el = e.currentTarget;
                const rect = el.getBoundingClientRect();
                el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                el.style.setProperty('--my', `${e.clientY - rect.top}px`);
              }}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className={styles.index}>01</span>
                  <span className={styles.featuredBadge}>Featured</span>
                </div>
                <h3 className={styles.cardTitle}>
                  <a
                    href={featured.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cardTitleLink}
                  >
                    {featured.title}
                  </a>
                </h3>
                <p className={styles.cardDesc}>{featured.description}</p>
                <div className={styles.tags}>
                  {featured.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <div className={styles.cardLinks}>
                  {featured.repo && <ProjectLink href={featured.repo} label="Code" />}
                  {featured.demo && <ProjectLink href={featured.demo} label="Live Demo" />}
                </div>
              </div>
            </motion.div>
          )}

          {rest.map((project, i) => (
            <motion.div
              key={project.id}
              className={styles.projectCard}
              variants={item}
              onMouseMove={(e) => {
                const el = e.currentTarget;
                const rect = el.getBoundingClientRect();
                el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                el.style.setProperty('--my', `${e.clientY - rect.top}px`);
              }}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className={styles.index}>
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <span className={styles.iconLink}>↗</span>
                </div>
                <h3 className={styles.cardTitle}>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cardTitleLink}
                  >
                    {project.title}
                  </a>
                </h3>
                <p className={styles.cardDesc}>{project.description}</p>
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <div className={styles.cardLinks}>
                  {project.repo && <ProjectLink href={project.repo} label="Code" />}
                  {project.demo && <ProjectLink href={project.demo} label="Live Demo" />}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
