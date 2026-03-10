import styles from './Hero.module.css';

interface HeroProps {
    data: {
        greeting: string;
        title: string;
        description: string;
        ctaText: string;
        ctaLink: string;
    };
}

export default function Hero({ data }: HeroProps) {
    return (
        <section className={styles.heroSection}>
            <div className={`container ${styles.heroContainer}`}>
                <div className="animate-fade-in-up delay-1">
                    <p className={styles.greeting}>{data.greeting}</p>
                    <h1 className={`bold-heading ${styles.title}`}>
                        <span className="gradient-text">{data.title.split('&')[0]}</span>
                        <br />
                        & {data.title.split('&')[1]}
                    </h1>
                    <p className={styles.description}>{data.description}</p>
                    <a href={data.ctaLink} className="btn">{data.ctaText}</a>
                </div>

                <div className={`${styles.heroVisual} animate-fade-in-up delay-2`}>
                    <div className={styles.glowCircle}></div>
                    <div className={styles.glowCircle2}></div>
                    <div className={styles.glassCard}>
                        <h3>Data <br />&lt;/Code&gt;</h3>
                    </div>
                </div>
            </div>
        </section>
    );
}
