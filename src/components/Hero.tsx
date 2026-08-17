'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Magnetic from './Magnetic';
import styles from './Hero.module.css';

const ANNOTATIONS = [
  { id: 'discover', label: 'Full-Stack Developer', show: 0.10, hide: 0.45 },
  { id: 'innovate', label: 'Machine Learning', show: 0.50, hide: 0.85 },
];

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&';

// Prefetches the whole video into a Blob and feeds it to the <video> via an
// object URL. Once fully loaded, seeking/scrubbing is instant because every
// frame lives in memory — no network round-trips to fetch byte ranges that
// may still be buffering (the cause of the video "sticking" on slow links).
function useBlobVideo(
  ref: React.RefObject<HTMLVideoElement | null>,
  src: string,
  getTarget: () => number
) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let cancelled = false;
    let objectUrl: string | null = null;

    const apply = (url: string) => {
      if (cancelled) return;
      objectUrl = url;
      const restore = () => {
        const t = getTarget();
        if (Number.isFinite(t)) {
          try {
            video.currentTime = t;
          } catch {
            /* ignore */
          }
        }
      };
      video.addEventListener('loadedmetadata', restore, { once: true });
      video.src = url;
    };

    fetch(src, { cache: 'force-cache' })
      .then((r) => {
        if (!r.ok) throw new Error('video prefetch failed');
        return r.blob();
      })
      .then((blob) => {
        if (!cancelled) apply(URL.createObjectURL(blob));
      })
      .catch(() => {
        // Keep the original streaming src as a fallback.
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [ref, src, getTarget]);
}

function useScramble(text: string, active: boolean, duration = 1200) {
  const [display, setDisplay] = useState(active ? text : '');

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let start = 0;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const revealCount = Math.floor(p * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ') out += ' ';
        else if (i < revealCount) out += ch;
        else out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      setDisplay(out);
      if (p < 1) raf = requestAnimationFrame(step);
      else setDisplay(text);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, active, duration]);

  return display;
}

function ScrambleLabel({ label, active, side }: { label: string; active: boolean; side: 'left' | 'right' }) {
  const upper = label.toUpperCase();
  const display = useScramble(upper, active);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setSettled(true), 1250);
    return () => {
      clearTimeout(t);
      setSettled(false);
    };
  }, [active]);

  return (
    <div
      className={`${styles.annotation} ${active ? styles.annotationVisible : ''} ${settled ? styles.annotationSettled : ''}`}
      style={
        side === 'left'
          ? { top: '30%', left: '5%', right: 'auto' }
          : { top: '55%', left: 'auto', right: '5%' }
      }
    >
      <span className={styles.annotationDot} />
      <span className={styles.annotationLine} />
      <span className={styles.annotationBadge}>
        <span className={styles.annotationGlow} aria-hidden="true">{upper}</span>
        <span className={styles.annotationText}>{display || '\u00A0'}</span>
      </span>
    </div>
  );
}

interface HeroProps {
  data: {
    greeting: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  };
  resume?: { file?: string | null } | null;
}

export default function Hero({ data, resume }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const darkVideoRef = useRef<HTMLVideoElement>(null);
  const lightVideoRef = useRef<HTMLVideoElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const prevVisibleRef = useRef('');
  const lastTimeRef = useRef(-1);
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-theme') !== 'light'
      : true
  );
  const [visibleCards, setVisibleCards] = useState<string[]>([]);

  const getTarget = useCallback(
    () => (Number.isFinite(lastTimeRef.current) ? lastTimeRef.current : 0),
    []
  );
  useBlobVideo(darkVideoRef, '/hero-video.mp4', getTarget);
  useBlobVideo(lightVideoRef, '/white-bg-video.mp4', getTarget);

  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setIsDark(el.getAttribute('data-theme') !== 'light');
    const mo = new MutationObserver(sync);
    mo.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    const darkVideo = darkVideoRef.current;
    const lightVideo = lightVideoRef.current;
    const section = sectionRef.current;
    const heroText = heroTextRef.current;
    if (!darkVideo || !lightVideo || !section || !heroText) return;

    let rafId = 0;
    let inView = false;
    const videos = [darkVideo, lightVideo];

    const updateHeroText = (progress: number) => {
      const opacity = Math.max(0, 1 - progress / 0.08);
      heroText.style.opacity = String(opacity);
      heroText.style.transform = `translateY(${progress * 30}px)`;
      heroText.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
    };

    const updateAnnotations = (progress: number) => {
      const visible = ANNOTATIONS
        .filter((a) => progress >= a.show && progress < a.hide)
        .map((a) => a.id);
      const key = [...visible].sort().join(',');
      if (key !== prevVisibleRef.current) {
        prevVisibleRef.current = key;
        setVisibleCards(visible);
      }
    };

    const render = () => {
      rafId = requestAnimationFrame(render);
      if (!inView) return;

      const rect = section.getBoundingClientRect();
      const scrollRange = section.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollRange));

      let duration = NaN;
      for (const v of videos) {
        if (v.readyState >= 1 && Number.isFinite(v.duration) && v.duration > 0) {
          duration = v.duration;
          break;
        }
      }
      if (Number.isFinite(duration)) {
        const target = progress * duration;
        if (Math.abs(target - lastTimeRef.current) > 0.005) {
          lastTimeRef.current = target;
          for (const v of videos) {
            if (v.readyState >= 1) v.currentTime = target;
          }
        }
      }

      updateHeroText(progress);
      updateAnnotations(progress);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !rafId) {
          rafId = requestAnimationFrame(render);
        } else if (!inView && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.05 }
    );
    io.observe(section);

    const unlock = (v: HTMLVideoElement) => {
      const p = v.play();
      if (p) {
        p.then(() => {
          v.pause();
        }).catch(() => {});
      }
    };
    const unlockers = videos.map((v) => {
      const h = () => unlock(v);
      return { v, h };
    });
    for (const { v, h } of unlockers) {
      if (v.readyState >= 2) unlock(v);
      else v.addEventListener('canplay', h, { once: true });
    }

    const onVisibility = () => {
      if (!document.hidden) {
        lastTimeRef.current = -1;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      for (const { v, h } of unlockers) v.removeEventListener('canplay', h);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <section ref={sectionRef} id="top" className={styles.section}>
      <div className={styles.sticky}>
        <video
          ref={darkVideoRef}
          className={`${styles.video} ${isDark ? styles.videoActive : styles.videoInactive}`}
          muted
          playsInline
          preload="auto"
          aria-hidden={!isDark}
          poster="/hero-poster.jpg"
          src="/hero-video.mp4"
        />
        <video
          ref={lightVideoRef}
          className={`${styles.video} ${isDark ? styles.videoInactive : styles.videoActive}`}
          muted
          playsInline
          preload="auto"
          aria-hidden={isDark}
          poster="/white-bg-poster.jpg"
          src="/white-bg-video.mp4"
        />

        <div className={styles.overlay} />

        <div ref={heroTextRef} className={styles.heroText}>
          <div className={styles.textBackdrop}>
            <h1 className={styles.title}>
              <span className="gradient-text">{data.title.split('&')[0]}</span>
              {data.title.split('&')[1] !== undefined && (
                <>
                  <span className={styles.titleBreak}>&</span>
                  <span>{data.title.split('&')[1]}</span>
                </>
              )}
            </h1>
            <p className={styles.description}>{data.description}</p>
            <div className={styles.ctaRow}>
              <Magnetic>
                <a href={data.ctaLink} className="btn">
                  {data.ctaText}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </Magnetic>
              {resume?.file && (
                <Magnetic>
                  <a href={resume.file} download className="btn btn-secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download Resume
                  </a>
                </Magnetic>
              )}
            </div>
          </div>
        </div>

        {ANNOTATIONS.map((a) => (
          <ScrambleLabel
            key={a.id}
            label={a.label}
            active={visibleCards.includes(a.id)}
            side={a.id === 'discover' ? 'left' : 'right'}
          />
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