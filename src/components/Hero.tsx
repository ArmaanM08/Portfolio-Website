'use client';

import { useRef, useEffect, useState } from 'react';
import { useLenis } from 'lenis/react';
import styles from './Hero.module.css';

const ANNOTATIONS = [
  { id: 'discover', label: 'Full-Stack Developer', show: 0.10, hide: 0.45 },
  { id: 'innovate', label: 'Machine Learning', show: 0.50, hide: 0.85 },
];

const FRAME_COUNT = 150;

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
  const tickingRef = useRef(false);
  const prevVisibleRef = useRef('');
  const videoReadyRef = useRef(false);
  const [visibleCards, setVisibleCards] = useState<string[]>([]);

  useLenis((lenis) => {
    if (tickingRef.current) return;
    tickingRef.current = true;

    requestAnimationFrame(() => {
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section || !video) {
        tickingRef.current = false;
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const raw = -rect.top / scrollable;
      const p = Math.min(1, Math.max(0, raw));

      if (videoReadyRef.current && video.duration) {
        video.currentTime = p * video.duration;
      }

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

      tickingRef.current = false;
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      videoReadyRef.current = true;
      video.currentTime = 0;
    };

    if (video.readyState >= 2) {
      onLoaded();
    } else {
      video.addEventListener('loadedmetadata', onLoaded);
    }

    return () => video.removeEventListener('loadedmetadata', onLoaded);
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.sticky}>
        <video
          ref={videoRef}
          className={styles.video}
          muted
          playsInline
          loop
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