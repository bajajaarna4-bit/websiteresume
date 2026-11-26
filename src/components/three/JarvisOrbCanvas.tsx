'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useOS } from '@/components/motion/AppProviders';
import { ErrorBoundary } from '@/components/os/ErrorBoundary';
import { JarvisFallback } from '@/components/three/JarvisFallback';

const LazyJarvisOrbScene = dynamic(() => import('@/components/three/JarvisOrbScene'), {
  ssr: false,
  loading: () => <JarvisFallback statusLabel="LOADING 3D CORE" />,
});

function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function JarvisOrbCanvas() {
  const { reducedMotion, pointerRef, scrollProgressRef } = useOS();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [renderState, setRenderState] = useState<{
    capable: boolean;
    isMobile: boolean;
  }>({
    capable: false,
    isMobile: false,
  });

  useEffect(() => {
    const mobileViewport = window.innerWidth < 768;
    const lowHardware =
      typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 2;

    const timer = window.setTimeout(() => {
      const canRender = !reducedMotion && !lowHardware && detectWebGLSupport();
      setRenderState({
        capable: canRender,
        isMobile: mobileViewport,
      });
    }, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first) {
          setIsVisible(first.isIntersecting);
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);

  const show3D = renderState.capable && !reducedMotion;

  return (
    <div
      ref={containerRef}
      className="relative h-72 w-full sm:h-80 lg:h-[380px]"
      aria-label="Reactive JARVIS 3D particle core"
    >
      {/* Persistent HUD radial aura behind Canvas so viewport never looks blank during lazy mount or headless software GL */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <JarvisFallback statusLabel="" />
      </div>

      {show3D ? (
        <div className="relative z-10 h-full w-full">
          <ErrorBoundary title="3D Viewport Fallback" fallback={<span className="sr-only" />}>
            <Suspense fallback={null}>
              <LazyJarvisOrbScene
                pointerRef={pointerRef}
                scrollProgressRef={scrollProgressRef}
                isVisible={isVisible}
                isMobile={renderState.isMobile}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      ) : null}

      <span className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-sky-400/35 bg-slate-950/90 px-3 py-1 font-mono text-[10px] tracking-widest whitespace-nowrap text-sky-300 uppercase">
        {reducedMotion
          ? 'JARVIS HUD // REDUCED MOTION'
          : show3D
            ? 'JARVIS CORE // WEBGL ACTIVE'
            : 'JARVIS HUD // ONLINE'}
      </span>
    </div>
  );
}
