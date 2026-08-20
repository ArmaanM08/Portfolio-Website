'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

// Theme toggle
const [isDark, setIsDark] = useState(
    () => document.documentElement.getAttribute('data-theme') !== 'light'
);
useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
    }
}, [isDark]);

interface HeroData {
    greeting: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
}

interface WorkItem {
    id: string;
    company: string;
    position: string;
    period: string;
    type: 'work';
    bullets: string[];
}

interface EducationItem {
    id: string;
    institution: string;
    degree: string;
    period: string;
    type: 'education';
}

interface ProjectItem {
    id: string;
    title: string;
    description: string;
    tags: string[];
    featured: boolean;
    link: string;
    repo: string | null;
    demo: string | null;
}

interface SkillItem {
    id: string;
    name: string;
    category: string;
    level: number;
}

interface CertificationItem {
    id: string;
    title: string;
    issuer: string;
    date: string;
    image: string | null;
    file: string;
    verify: string | null;
    description: string;
}

interface ContactData {
    email: string;
    phone: string;
    location: string;
    status: string;
    linkedin: string;
    github: string;
    message: string;
}

interface PortfolioData {
    hero: HeroData;
    experience: WorkItem[];
    education: EducationItem[];
    projects: ProjectItem[];
    certifications: CertificationItem[];
    skills: SkillItem[];
    contact: ContactData;
    resume: { file: string | null };
}

type ArraySection = 'experience' | 'education' | 'projects' | 'skills' | 'certifications';

const emptyPortfolio = (): PortfolioData => ({
    hero: { greeting: '', title: '', description: '', ctaText: 'View My Work', ctaLink: '#projects' },
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    skills: [],
    contact: { email: '', phone: '', location: '', status: '', linkedin: '', github: '', message: '' },
    resume: { file: null }
});

function newId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return Math.random().toString(36).slice(2, 10);
}

interface TextFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
}

function TextField({ label, value, onChange, type = 'text', placeholder }: TextFieldProps) {
    return (
        <div className={styles.formGroup}>
            <label>{label}</label>
            <input
                type={type}
                className="input-field"
                value={value ?? ''}
                placeholder={placeholder}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}

interface TextAreaFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}

function TextAreaField({ label, value, onChange, rows = 3 }: TextAreaFieldProps) {
    return (
        <div className={styles.formGroup}>
            <label>{label}</label>
            <textarea
                className="input-field"
                rows={rows}
                value={value ?? ''}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}

interface ListEditorProps {
    items: string[];
    onChange: (next: string[]) => void;
    placeholder?: string;
    addLabel?: string;
}

function ListEditor({ items, onChange, placeholder, addLabel = 'Add Item' }: ListEditorProps) {
    const list = items ?? [];
    return (
        <div className={styles.tagsContainer}>
            {list.map((item, i) => (
                <div key={i} className={styles.listRow}>
                    <input
                        type="text"
                        className="input-field"
                        style={{ marginBottom: 0 }}
                        value={item}
                        placeholder={placeholder}
                        onChange={e => {
                            const next = [...list];
                            next[i] = e.target.value;
                            onChange(next);
                        }}
                    />
                    <button
                        type="button"
                        className={styles.iconBtn}
                        title="Remove"
                        onClick={() => onChange(list.filter((_, j) => j !== i))}
                    >
                        ✕
                    </button>
                </div>
            ))}
            <button
                type="button"
                className={styles.addBtn}
                onClick={() => onChange([...list, ''])}
            >
                + {addLabel}
            </button>
        </div>
    );
}

export default function AdminDashboard() {
    const router = useRouter();
    const [data, setData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');

    useEffect(() => {
        fetch('/api/portfolio')
            .then(res => res.json())
            .then((fetchedData: Partial<PortfolioData>) => {
                const base = emptyPortfolio();
                setData({
                    ...fetchedData,
                    hero: fetchedData.hero ?? base.hero,
                    experience: fetchedData.experience ?? base.experience,
                    education: fetchedData.education ?? base.education,
                    projects: fetchedData.projects ?? base.projects,
                    certifications: fetchedData.certifications ?? base.certifications,
                    skills: fetchedData.skills ?? base.skills,
                    contact: fetchedData.contact ?? base.contact,
                    resume: fetchedData.resume ?? base.resume
                });
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        if (!data) return;
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
        } catch {
            setMessage('Error saving changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadMessage('');
        try {
            const form = new FormData();
            form.append('file', file);
            const res = await fetch('/api/resume', { method: 'POST', body: form });
            if (res.ok) {
                setData(prev => (prev ? { ...prev, resume: { file: '/resume.pdf' } } : prev));
                setUploadMessage('Resume uploaded successfully!');
            } else {
                setUploadMessage('Failed to upload resume.');
            }
        } catch {
            setUploadMessage('Error uploading resume.');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const updateField = <K extends 'hero' | 'contact'>(section: K, field: keyof PortfolioData[K], value: string) => {
        setData(prev => {
            if (!prev) return prev;
            return { ...prev, [section]: { ...prev[section], [field]: value } as PortfolioData[K] };
        });
    };

    const updateItem = (
        section: ArraySection,
        index: number,
        field: string,
        value: string | number | boolean | string[] | null
    ) => {
        setData(prev => {
            if (!prev) return prev;
            const arr = [...prev[section]] as unknown as Array<Record<string, unknown>>;
            arr[index] = { ...arr[index], [field]: value };
            return { ...prev, [section]: arr as unknown as PortfolioData[ArraySection] };
        });
    };

    const addItem = <K extends ArraySection>(section: K, item: PortfolioData[K][number]) => {
        setData(prev => {
            if (!prev) return prev;
            return { ...prev, [section]: [...prev[section], item] };
        });
    };

    const removeItem = <K extends ArraySection>(section: K, index: number) => {
        setData(prev => {
            if (!prev) return prev;
            return { ...prev, [section]: prev[section].filter((_, i) => i !== index) };
        });
    };

    const moveItem = <K extends ArraySection>(section: K, index: number, direction: -1 | 1) => {
        setData(prev => {
            if (!prev) return prev;
            const arr = [...prev[section]];
            const target = index + direction;
            if (target < 0 || target >= arr.length) return prev;
            [arr[index], arr[target]] = [arr[target], arr[index]];
            return { ...prev, [section]: arr };
        });
    };

    const toggleFeatured = (index: number) => {
        setData(prev => {
            if (!prev) return prev;
            return { ...prev, projects: prev.projects.map((p, i) => ({ ...p, featured: i === index })) };
        });
    };

    if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;
    if (!data) return <div className={styles.error}>Failed to load data.</div>;

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1 className="bold-heading gradient-text" style={{ fontSize: '2.5rem', marginBottom: 0 }}>Admin Dashboard</h1>
                <div className={styles.actions}>
                    <a className={styles.viewLink} href="/" target="_blank">View Site ↗</a>
                    {message && <span className={styles.message}>{message}</span>}
                    <button onClick={handleLogout} className={`btn btn-secondary ${styles.btnSmall}`}>Logout</button>
                    <button onClick={handleSave} className={`btn ${styles.btnSmall}`} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={() => setIsDark((prev) => !prev)}
                        className={`btn ${styles.btnSmall}`}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </div>

            <div className={styles.grid}>
                {/* HERO SECTION */}
                <div className={`card ${styles.sectionCard} animate-fade-in-up delay-1`}>
                    <h2>Hero Section</h2>
                    <TextField label="Greeting" value={data.hero.greeting} onChange={v => updateField('hero', 'greeting', v)} />
                    <TextField
                        label="Title (split on &amp; into two styled lines)"
                        value={data.hero.title}
                        placeholder="Machine Learning & Full-Stack Developer"
                        onChange={v => updateField('hero', 'title', v)}
                    />
                    <TextAreaField label="Description" value={data.hero.description} onChange={v => updateField('hero', 'description', v)} rows={4} />
                    <TextField label="CTA Button Text" value={data.hero.ctaText} onChange={v => updateField('hero', 'ctaText', v)} />
                    <TextField label="CTA Button Link" value={data.hero.ctaLink} placeholder="#projects" onChange={v => updateField('hero', 'ctaLink', v)} />
                </div>

                {/* CONTACT SECTION */}
                <div className={`card ${styles.sectionCard} animate-fade-in-up delay-2`}>
                    <h2>Contact Section</h2>
                    <TextField label="Email" type="email" value={data.contact.email} onChange={v => updateField('contact', 'email', v)} />
                    <TextField label="Phone" value={data.contact.phone} onChange={v => updateField('contact', 'phone', v)} />
                    <TextField label="Location" value={data.contact.location} onChange={v => updateField('contact', 'location', v)} />
                    <TextField label="Availability Status" value={data.contact.status} onChange={v => updateField('contact', 'status', v)} />
                    <TextField label="LinkedIn URL" value={data.contact.linkedin} onChange={v => updateField('contact', 'linkedin', v)} />
                    <TextField label="GitHub URL" value={data.contact.github} onChange={v => updateField('contact', 'github', v)} />
                    <TextAreaField label="Message" value={data.contact.message} onChange={v => updateField('contact', 'message', v)} rows={3} />
                </div>

                {/* RESUME SECTION */}
                <div className={`card ${styles.sectionCard} animate-fade-in-up delay-3`}>
                    <h2>Resume</h2>
                    {data.resume?.file ? (
                        <p className={styles.resumeStatus}>
                            Current file: <a href={data.resume.file} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>{data.resume.file}</a>
                        </p>
                    ) : (
                        <p className={styles.resumeStatus}>No resume uploaded yet. Upload a PDF and the Download Resume button will appear on the site.</p>
                    )}
                    <div className={styles.formGroup}>
                        <label>Upload Resume (PDF)</label>
                        <input
                            type="file"
                            accept=".pdf,application/pdf"
                            className="input-field"
                            onChange={handleResumeUpload}
                            disabled={uploading}
                            style={{ padding: '0.6rem' }}
                        />
                    </div>
                    {uploadMessage && <span className={styles.message}>{uploadMessage}</span>}
                </div>

                {/* EXPERIENCE SECTION */}
                <div className={`card ${styles.sectionCard} ${styles.fullWidth} animate-fade-in-up delay-4`}>
                    <h2>Experience</h2>
                    <div className={styles.arrayList}>
                        {data.experience.map((item: WorkItem, index: number) => (
                            <div key={item.id} className={styles.arrayItem}>
                                <div className={styles.arrayItemHeader}>
                                    <h3>{item.company || `Experience ${index + 1}`}</h3>
                                    <div className={styles.itemActions}>
                                        <button type="button" className={styles.iconBtn} title="Move up" onClick={() => moveItem('experience', index, -1)}>↑</button>
                                        <button type="button" className={styles.iconBtn} title="Move down" onClick={() => moveItem('experience', index, 1)}>↓</button>
                                        <button type="button" className={styles.iconBtn} title="Delete" onClick={() => removeItem('experience', index)}>✕</button>
                                    </div>
                                </div>
                                <div className={styles.grid2}>
                                    <TextField label="Company" value={item.company} onChange={v => updateItem('experience', index, 'company', v)} />
                                    <TextField label="Position" value={item.position} onChange={v => updateItem('experience', index, 'position', v)} />
                                </div>
                                <TextField label="Period" value={item.period} placeholder="July 2026 – Present" onChange={v => updateItem('experience', index, 'period', v)} />
                                <div className={styles.formGroup}>
                                    <label>Key Responsibilities / Bullets</label>
                                    <ListEditor
                                        items={item.bullets}
                                        onChange={next => updateItem('experience', index, 'bullets', next)}
                                        placeholder="Achievement or responsibility"
                                        addLabel="Add Bullet"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.sectionAction}>
                        <button type="button" className={`btn ${styles.btnSmall}`} onClick={() => addItem('experience', { id: newId(), company: '', position: '', period: '', type: 'work', bullets: [] })}>+ Add Experience</button>
                    </div>
                </div>

                {/* EDUCATION SECTION */}
                <div className={`card ${styles.sectionCard} ${styles.fullWidth} animate-fade-in-up delay-5`}>
                    <h2>Education</h2>
                    <div className={styles.arrayList}>
                        {data.education.map((item: EducationItem, index: number) => (
                            <div key={item.id} className={styles.arrayItem}>
                                <div className={styles.arrayItemHeader}>
                                    <h3>{item.institution || `Education ${index + 1}`}</h3>
                                    <div className={styles.itemActions}>
                                        <button type="button" className={styles.iconBtn} title="Move up" onClick={() => moveItem('education', index, -1)}>↑</button>
                                        <button type="button" className={styles.iconBtn} title="Move down" onClick={() => moveItem('education', index, 1)}>↓</button>
                                        <button type="button" className={styles.iconBtn} title="Delete" onClick={() => removeItem('education', index)}>✕</button>
                                    </div>
                                </div>
                                <div className={styles.grid2}>
                                    <TextField label="Institution" value={item.institution} onChange={v => updateItem('education', index, 'institution', v)} />
                                    <TextField label="Degree" value={item.degree} onChange={v => updateItem('education', index, 'degree', v)} />
                                </div>
                                <TextField label="Period" value={item.period} placeholder="2024 – Present" onChange={v => updateItem('education', index, 'period', v)} />
                            </div>
                        ))}
                    </div>
                    <div className={styles.sectionAction}>
                        <button type="button" className={`btn ${styles.btnSmall}`} onClick={() => addItem('education', { id: newId(), institution: '', degree: '', period: '', type: 'education' })}>+ Add Education</button>
                    </div>
                </div>

                {/* PROJECTS SECTION */}
                <div className={`card ${styles.sectionCard} ${styles.fullWidth} animate-fade-in-up delay-6`}>
                    <h2>Projects</h2>
                    <div className={styles.arrayList}>
                        {data.projects.map((project: ProjectItem, index: number) => (
                            <div key={project.id} className={styles.arrayItem}>
                                <div className={styles.arrayItemHeader}>
                                    <h3>{project.title || `Project ${index + 1}`}</h3>
                                    <div className={styles.itemActions}>
                                        <button type="button" className={styles.iconBtn} title="Move up" onClick={() => moveItem('projects', index, -1)}>↑</button>
                                        <button type="button" className={styles.iconBtn} title="Move down" onClick={() => moveItem('projects', index, 1)}>↓</button>
                                        <button type="button" className={styles.iconBtn} title="Delete" onClick={() => removeItem('projects', index)}>✕</button>
                                    </div>
                                </div>
                                <label className={styles.checkRow}>
                                    <input
                                        type="checkbox"
                                        checked={!!project.featured}
                                        onChange={() => toggleFeatured(index)}
                                    />
                                    <span>Featured project (displayed as the large card)</span>
                                </label>
                                <div className={styles.grid2}>
                                    <TextField label="Project Title" value={project.title} onChange={v => updateItem('projects', index, 'title', v)} />
                                    <TextField label="Primary Link" value={project.link} onChange={v => updateItem('projects', index, 'link', v)} />
                                </div>
                                <TextAreaField label="Description" value={project.description} onChange={v => updateItem('projects', index, 'description', v)} rows={2} />
                                <div className={styles.grid2}>
                                    <TextField label="Code / GitHub URL (leave blank to hide)" value={project.repo ?? ''} onChange={v => updateItem('projects', index, 'repo', v || null)} placeholder="https://github.com/..." />
                                    <TextField label="Live Demo URL (leave blank to hide)" value={project.demo ?? ''} onChange={v => updateItem('projects', index, 'demo', v || null)} placeholder="https://..." />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Tech Stack / Tags</label>
                                    <ListEditor
                                        items={project.tags}
                                        onChange={next => updateItem('projects', index, 'tags', next)}
                                        placeholder="e.g. ReactJs"
                                        addLabel="Add Tag"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.sectionAction}>
                        <button type="button" className={`btn ${styles.btnSmall}`} onClick={() => addItem('projects', { id: newId(), title: '', description: '', tags: [], featured: false, link: '', repo: null, demo: null })}>+ Add Project</button>
                    </div>
                </div>

                {/* CERTIFICATIONS SECTION */}
                <div className={`card ${styles.sectionCard} ${styles.fullWidth} animate-fade-in-up delay-7`}>
                    <h2>Certifications</h2>
                    <div className={styles.arrayList}>
                        {data.certifications.map((cert: CertificationItem, index: number) => (
                            <div key={cert.id} className={styles.arrayItem}>
                                <div className={styles.arrayItemHeader}>
                                    <h3>{cert.title || `Certification ${index + 1}`}</h3>
                                    <div className={styles.itemActions}>
                                        <button type="button" className={styles.iconBtn} title="Move up" onClick={() => moveItem('certifications', index, -1)}>↑</button>
                                        <button type="button" className={styles.iconBtn} title="Move down" onClick={() => moveItem('certifications', index, 1)}>↓</button>
                                        <button type="button" className={styles.iconBtn} title="Delete" onClick={() => removeItem('certifications', index)}>✕</button>
                                    </div>
                                </div>
                                <div className={styles.grid2}>
                                    <TextField label="Certificate Title" value={cert.title} onChange={v => updateItem('certifications', index, 'title', v)} />
                                    <TextField label="Issuer" value={cert.issuer} onChange={v => updateItem('certifications', index, 'issuer', v)} />
                                </div>
                                <div className={styles.grid2}>
                                    <TextField label="Date (e.g. Feb 2026)" value={cert.date} onChange={v => updateItem('certifications', index, 'date', v)} />
                                    <TextField label="Preview Image Path (public/…)" value={cert.image ?? ''} onChange={v => updateItem('certifications', index, 'image', v || null)} placeholder="/certifications/cert.png" />
                                </div>
                                <TextField label="PDF Path (public/…)" value={cert.file} placeholder="/certifications/cert.pdf" onChange={v => updateItem('certifications', index, 'file', v)} />
                                <TextField label="Verification URL (leave blank to hide)" value={cert.verify ?? ''} onChange={v => updateItem('certifications', index, 'verify', v || null)} placeholder="https://coursera.org/verify/..." />
                                <TextAreaField label="Description" value={cert.description} onChange={v => updateItem('certifications', index, 'description', v)} rows={2} />
                            </div>
                        ))}
                    </div>
                    <div className={styles.sectionAction}>
                        <button type="button" className={`btn ${styles.btnSmall}`} onClick={() => addItem('certifications', { id: newId(), title: '', issuer: '', date: '', image: null, file: '', verify: null, description: '' })}>+ Add Certification</button>
                    </div>
                </div>

                {/* SKILLS SECTION */}
                <div className={`card ${styles.sectionCard} ${styles.fullWidth} animate-fade-in-up delay-8`}>
                    <h2>Skills</h2>
                    <div className={styles.arrayList}>
                        {data.skills.map((skill: SkillItem, index: number) => (
                            <div key={skill.id} className={styles.arrayItem}>
                                <div className={styles.arrayItemHeader}>
                                    <h3>{skill.name || `Skill ${index + 1}`}</h3>
                                    <div className={styles.itemActions}>
                                        <button type="button" className={styles.iconBtn} title="Move up" onClick={() => moveItem('skills', index, -1)}>↑</button>
                                        <button type="button" className={styles.iconBtn} title="Move down" onClick={() => moveItem('skills', index, 1)}>↓</button>
                                        <button type="button" className={styles.iconBtn} title="Delete" onClick={() => removeItem('skills', index)}>✕</button>
                                    </div>
                                </div>
                                <div className={styles.grid2}>
                                    <TextField label="Skill Name" value={skill.name} onChange={v => updateItem('skills', index, 'name', v)} />
                                    <TextField label="Category" value={skill.category} placeholder="Languages, Web Dev, ..." onChange={v => updateItem('skills', index, 'category', v)} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Proficiency ({skill.level}%)</label>
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={skill.level ?? 0}
                                        onChange={e => updateItem('skills', index, 'level', Number(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--accent-color)' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.sectionAction}>
                        <button type="button" className={`btn ${styles.btnSmall}`} onClick={() => addItem('skills', { id: newId(), name: '', category: 'Languages', level: 70 })}>+ Add Skill</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
