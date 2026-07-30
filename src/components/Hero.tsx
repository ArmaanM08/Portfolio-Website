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
  const [visibleCards, setVisibleCards] = useState<string[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    video.pause();

    const updateVideo = () => {
      const rect = section.getBoundingClientRect();
      const scrollRange = section.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollRange));

      if (video.readyState >= 1 && Number.isFinite(video.duration)) {
        video.currentTime = progress * video.duration;
      }

      if (heroTextRef.current) {
        const opacity = Math.max(0, 1 - progress / 0.08);
        heroTextRef.current.style.opacity = String(opacity);
        heroTextRef.current.style.transform = `translateY(${progress * 30}px)`;
        heroTextRef.current.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
      }

      const visible = ANNOTATIONS
        .filter((a) => progress >= a.show && progress < a.hide)
        .map((a) => a.id);
      const key = [...visible].sort().join(',');
      if (key !== prevVisibleRef.current) {
        prevVisibleRef.current = key;
        setVisibleCards(visible);
      }
    };

    window.addEventListener('scroll', updateVideo, { passive: true });
    updateVideo();

    return () => {
      window.removeEventListener('scroll', updateVideo);
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