'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/portfolio')
            .then(res => res.json())
            .then(fetchedData => {
                setData(fetchedData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const res = await fetch('/api/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setMessage('Changes saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Failed to save changes.');
            }
        } catch (err) {
            setMessage('Error saving changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (section: string, field: string, value: string) => {
        setData((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // Helper for arrays like projects or skills
    const handleArrayChange = (section: string, index: number, field: string, value: any) => {
        setData((prev: any) => {
            const newArray = [...prev[section]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [section]: newArray };
        });
    };

    // Helpers for tags inside projects
    const handleTagChange = (projectIndex: number, tagIndex: number, value: string) => {
        setData((prev: any) => {
            const newProjects = [...prev.projects];
            const newTags = [...newProjects[projectIndex].tags];
            newTags[tagIndex] = value;
            newProjects[projectIndex] = { ...newProjects[projectIndex], tags: newTags };
            return { ...prev, projects: newProjects };
        });
    };

    const addTag = (projectIndex: number) => {
        setData((prev: any) => {
            const newProjects = [...prev.projects];
            newProjects[projectIndex] = {
                ...newProjects[projectIndex],
                tags: [...newProjects[projectIndex].tags, 'New Tag']
            };
            return { ...prev, projects: newProjects };
        });
    };

    const removeTag = (projectIndex: number, tagIndex: number) => {
        setData((prev: any) => {
            const newProjects = [...prev.projects];
            const newTags = [...newProjects[projectIndex].tags];
            newTags.splice(tagIndex, 1);
            newProjects[projectIndex] = { ...newProjects[projectIndex], tags: newTags };
            return { ...prev, projects: newProjects };
        });
    };

    if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;
    if (!data) return <div className={styles.error}>Failed to load data.</div>;

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1 className="bold-heading gradient-text" style={{ fontSize: '2.5rem', marginBottom: 0 }}>Admin Dashboard</h1>
                <div className={styles.actions}>
                    {message && <span className={styles.message}>{message}</span>}
                    <button onClick={handleSave} className="btn" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className={styles.grid}>
                {/* HERO SECTION */}
                <div className={`card ${styles.sectionCard} animate-fade-in-up delay-1`}>
                    <h2>Hero Section</h2>
                    <div className={styles.formGroup}>
                        <label>Greeting</label>
                        <input
                            type="text"
                            className="input-field"
                            value={data.hero.greeting}
                            onChange={e => handleChange('hero', 'greeting', e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Title</label>
                        <input
                            type="text"
                            className="input-field"
                            value={data.hero.title}
                            onChange={e => handleChange('hero', 'title', e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            className="input-field"
                            rows={4}
                            value={data.hero.description}
                            onChange={e => handleChange('hero', 'description', e.target.value)}
                        />
                    </div>
                </div>

                {/* CONTACT SECTION */}
                <div className={`card ${styles.sectionCard} animate-fade-in-up delay-2`}>
                    <h2>Contact Section</h2>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={data.contact.email}
                            onChange={e => handleChange('contact', 'email', e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>LinkedIn URL</label>
                        <input
                            type="text"
                            className="input-field"
                            value={data.contact.linkedin}
                            onChange={e => handleChange('contact', 'linkedin', e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>GitHub URL</label>
                        <input
                            type="text"
                            className="input-field"
                            value={data.contact.github}
                            onChange={e => handleChange('contact', 'github', e.target.value)}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Message</label>
                        <textarea
                            className="input-field"
                            rows={3}
                            value={data.contact.message}
                            onChange={e => handleChange('contact', 'message', e.target.value)}
                        />
                    </div>
                </div>

                {/* PROJECTS SECTION */}
                <div className={`card ${styles.sectionCard} ${styles.fullWidth} animate-fade-in-up delay-3`}>
                    <h2>Projects</h2>
                    <div className={styles.arrayList}>
                        {data.projects.map((project: any, index: number) => (
                            <div key={project.id} className={styles.arrayItem}>
                                <div className={styles.formGroup}>
                                    <label>Project Title</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={project.title}
                                        onChange={e => handleArrayChange('projects', index, 'title', e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Project Link</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={project.link}
                                        onChange={e => handleArrayChange('projects', index, 'link', e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <textarea
                                        className="input-field"
                                        rows={2}
                                        value={project.description}
                                        onChange={e => handleArrayChange('projects', index, 'description', e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Tech Stack / Tags</label>
                                    <div className={styles.tagsContainer}>
                                        {project.tags.map((tag: string, tagIndex: number) => (
                                            <div key={tagIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <input
                                                    type="text"
                                                    className="input-field"
                                                    style={{ marginBottom: 0 }}
                                                    value={tag}
                                                    onChange={e => handleTagChange(index, tagIndex, e.target.value)}
                                                />
                                                <button
                                                    onClick={() => removeTag(index, tagIndex)}
                                                    className="btn"
                                                    style={{ padding: '0.5rem 1rem', background: '#ff4d4f', color: 'white' }}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addTag(index)}
                                            className="btn"
                                            style={{ padding: '0.5rem 1rem', marginTop: '0.5rem', fontSize: '0.9rem' }}
                                        >
                                            + Add Tag
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
