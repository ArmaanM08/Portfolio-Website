'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './Hero.module.css';

const ANNOTATIONS = [
  { id: 'discover', label: 'Full-Stack Developer', show: 0.10, hide: 0.45 },
  { id: 'innovate', label: 'Machine Learning', show: 0.50, hide: 0.85 },
];

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const prevVisibleRef = useRef('');
  const syncRef = useRef<number>(0);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    let ready = false;
    let lastP = 0;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise) playPromise.catch(() => {});

    const seekTo = (p: number) => {
      lastP = p;
      if (video.duration) {
        video.currentTime = p * video.duration;
      }
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const raw = -rect.top / scrollable;
      const p = Math.min(1, Math.max(0, raw));
      seekTo(p);

      if (heroTextRef.current) {
        const opacity = Math.max(0, 1 - p / 0.08);
        heroTextRef.current.style.opacity = String(opacity);
        heroTextRef.current.style.transform = `translateY(${p * 30}px)`;
        heroTextRef.current.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
      }

      const visible = ANNOTATIONS
        .filter((a) => p >= a.show && p < a.hide)
        .map((a) => a.id);
      const key = [...visible].sort().join(',');
      if (key !== prevVisibleRef.current) {
        prevVisibleRef.current = key;
        setVisibleCards(visible);
      }
    };

    const rafLoop = () => {
      if (video.duration && video.readyState >= 2) {
        video.currentTime = lastP * video.duration;
      }
      syncRef.current = requestAnimationFrame(rafLoop);
    };
    syncRef.current = requestAnimationFrame(rafLoop);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(syncRef.current);
      video.pause();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.sticky}>
        <video
          ref={videoRef}
          className={styles.video}
          muted
          playsInline
          preload="auto"
          src="/hero-video.mp4"
        />

        <div className={styles.overlay} />
        <div className={styles.vignette} />

        <div ref={heroTextRef} className={styles.heroText}>
          <div className={styles.textBackdrop}>
            <h1 className={styles.title}>
              <span className="gradient-text">{data.title.split('&')[0]}</span>
              <span className={styles.titleBreak}>&</span>
              <span>{data.title.split('&')[1]}</span>
            </h1>
            <p className={styles.description}>{data.description}</p>
            <a href={data.ctaLink} className="btn">
              {data.ctaText}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>

        {ANNOTATIONS.map((a) => (
          <div
            key={a.id}
            className={`${styles.annotation} ${visibleCards.includes(a.id) ? styles.annotationVisible : ''}`}
            style={{
              top: a.id === 'discover' ? '30%' : '55%',
              left: a.id === 'discover' ? '5%' : 'auto',
              right: a.id === 'discover' ? 'auto' : '5%',
            }}
          >
            <div className={styles.annotationDot} />
            <div className={styles.annotationContent}>
              <span className={styles.annotationLabel}>{a.label}</span>
            </div>
          </div>
        ))}

        <div className={styles.scrollHint}>
          <div className={styles.scrollMouse}>
            <div className={styles.scrollWheel} />
          </div>
          <span>Scroll</span>
        </div>
      </div>
    </section>
  );
}