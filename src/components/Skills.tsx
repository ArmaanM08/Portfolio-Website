import styles from './Skills.module.css';

interface Skill {
    id: string;
    name: string;
    category: string;
    level: number;
}

interface SkillsProps {
    data: Skill[];
}

export default function Skills({ data }: SkillsProps) {
    const categories = Array.from(new Set(data.map(s => s.category)));

    return (
        <section id="skills" className={styles.section}>
            <div className={`container ${styles.container}`}>
                <div className={styles.visualSide}>
                    <h2 className={`bold-heading animate-fade-in-up delay-1`}>
                        Technical <br /><span className="gradient-text">Arsenal</span>
                    </h2>
                    <div className={`${styles.statsCard} card animate-fade-in-up delay-2`}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{data.length}+</span>
                            <span className={styles.statLabel}>Core Technologies</span>
                        </div>
                    </div>
                </div>

                <div className={styles.skillsSide}>
                    {categories.map((category, catIndex) => (
                        <div key={category} className={`${styles.categoryGroup} animate-fade-in-up delay-${(catIndex % 3) + 1}`}>
                            <h3 className={styles.categoryTitle}>{category}</h3>
                            <div className={styles.skillsWrap}>
                                {data.filter(s => s.category === category).map((skill, index) => (
                                    <div key={skill.id} className={styles.skillItem} style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className={styles.skillHeader}>
                                            <span>{skill.name}</span>
                                            <span>{skill.level}%</span>
                                        </div>
                                        <div className={styles.progressBarBg}>
                                            <div
                                                className={styles.progressBarFill}
                                                style={{ width: `${skill.level}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
