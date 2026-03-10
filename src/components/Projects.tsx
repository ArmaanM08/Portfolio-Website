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

export default function Projects({ data }: ProjectsProps) {
    return (
        <section id="projects" className={styles.section}>
            <div className="container">
                <h2 className={`bold-heading ${styles.heading} animate-fade-in-up`}>
                    Selected <span className="gradient-text">Works</span>
                </h2>

                <div className={styles.grid}>
                    {data.map((project, index) => (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" key={project.id} className={`card ${styles.projectCard} animate-fade-in-up`} style={{ animationDelay: `${index * 0.2 + 0.2}s`, display: 'flex', textDecoration: 'none', color: 'inherit' }}>
                            <div className={styles.cardHeader}>
                                <h3>{project.title}</h3>
                                <span className={styles.iconLink}>
                                    ↗
                                </span>
                            </div>
                            <p>{project.description}</p>
                            <div className={styles.tags}>
                                {project.tags.map((tag) => (
                                    <span key={tag} className={styles.tag}>{tag}</span>
                                ))}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
