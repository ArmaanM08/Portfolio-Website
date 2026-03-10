import styles from './Contact.module.css';

interface ContactData {
    email: string;
    linkedin: string;
    github: string;
    message: string;
}

interface ContactProps {
    data: ContactData;
}

export default function Contact({ data }: ContactProps) {
    return (
        <section id="contact" className={styles.section}>
            <div className={`container ${styles.container}`}>
                <div className={`card ${styles.contactCard} animate-fade-in-up`}>
                    <h2 className="bold-heading">
                        Let's <span className="gradient-text">Talk</span>
                    </h2>
                    <p className={styles.message}>{data.message}</p>

                    <div className={styles.links}>
                        <a href={`mailto:${data.email}`} className="btn">Email Me</a>
                        <div className={styles.socials}>
                            <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                LinkedIn
                            </a>
                            <a href={data.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
