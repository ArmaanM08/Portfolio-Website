'use client';

import { motion } from 'framer-motion';
import styles from './Projects.module.css';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
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

export default function Projects({ data }: ProjectsProps) {
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
          {data.map((project) => (
            <motion.a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectCard}
              variants={item}
            >
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3>{project.title}</h3>
                  <span className={styles.iconLink}>↗</span>
                </div>
                <p className={styles.cardDesc}>{project.description}</p>
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}