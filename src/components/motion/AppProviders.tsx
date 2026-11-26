'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export type SectionId =
  | 'hero'
  | 'philosophy'
  | 'github-live'
  | 'featured-project'
  | 'ai-lab'
  | 'startup-idea'
  | 'podcast-stage'
  | 'security-lab'
  | 'contact';

export interface OSContextValue {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
  scrollToSection: (id: SectionId) => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pointerRef: React.RefObject<{ x: number; y: number }>;
  scrollProgressRef: React.RefObject<number>;
}

const OSContext = createContext<OSContextValue | null>(null);

export function useOS(): OSContextValue {
  const ctx = useContext(OSContext);
  if (!ctx) {
    throw new Error('useOS must be used within AppProviders.');
  }
  return ctx;
}

interface AppProvidersProps {
  children: React.ReactNode;
  nonce?: string;
}

export function AppProviders({ children, nonce }: AppProvidersProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [systemReducedMotion, setSystemReducedMotion] = useState<boolean>(false);
  const [manualReducedMotion, setManualReducedMotion] = useState<boolean | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  const lenisRef = useRef<Lenis | null>(null);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const scrollProgressRef = useRef<number>(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = (): void => {
      setSystemReducedMotion(mediaQuery.matches);
    };
    syncPreference();
    mediaQuery.addEventListener('change', syncPreference);
    return () => {
      mediaQuery.removeEventListener('change', syncPreference);
    };
  }, []);

  const reducedMotion = manualReducedMotion ?? systemReducedMotion;

  useEffect(() => {
    const onPointerMove = (event: PointerEvent): void => {
      if (window.innerWidth === 0 || window.innerHeight === 0) return;
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onScroll = (): void => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = scrollable > 0 ? window.scrollY / scrollable : 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (reducedMotion || isCoarsePointer) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });
    lenisRef.current = lenis;

    const handleScrollTriggerUpdate = (): void => {
      ScrollTrigger.update();
    };
    lenis.on('scroll', handleScrollTriggerUpdate);

    const tick = (time: number): void => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', handleScrollTriggerUpdate);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-section-id]'));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section-id') as SectionId | null;
            if (id) {
              setActiveSection(id);
            }
          }
        }
      },
      {
        rootMargin: '-35% 0px -50% 0px',
        threshold: 0.01,
      },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = useCallback(
    (id: SectionId): void => {
      const target = document.getElementById(id);
      if (!target) return;
      setActiveSection(id);

      if (lenisRef.current && !reducedMotion) {
        lenisRef.current.scrollTo(target, { offset: -64 });
      } else {
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    },
    [reducedMotion],
  );

  const toggleReducedMotion = useCallback((): void => {
    setManualReducedMotion((prev) => !(prev ?? systemReducedMotion));
  }, [systemReducedMotion]);

  const value = useMemo<OSContextValue>(
    () => ({
      activeSection,
      setActiveSection,
      scrollToSection,
      reducedMotion,
      toggleReducedMotion,
      commandPaletteOpen,
      setCommandPaletteOpen,
      pointerRef,
      scrollProgressRef,
    }),
    [
      activeSection,
      scrollToSection,
      reducedMotion,
      toggleReducedMotion,
      commandPaletteOpen,
    ],
  );

  return (
    <OSContext.Provider value={value}>
      <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'} nonce={nonce}>
        {children}
      </MotionConfig>
    </OSContext.Provider>
  );
}
