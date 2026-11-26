'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Move, RotateCcw } from 'lucide-react';
import { useOS } from '@/components/motion/AppProviders';
import { cn } from '@/lib/utils';

interface DraggableWindowProps {
  title: string;
  pathLabel: string;
  children: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
  defaultExpanded?: boolean;
}

export function DraggableWindow({
  title,
  pathLabel,
  children,
  className,
  badge,
  defaultExpanded = true,
}: DraggableWindowProps) {
  const { reducedMotion } = useOS();
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [minimized, setMinimized] = useState<boolean>(!defaultExpanded);
  const [expandedWidth, setExpandedWidth] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  const draggingRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  useEffect(() => {
    const checkViewport = (): void => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => {
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  const canDrag = isDesktop && !reducedMotion;

  const onPointerDownHeader = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      if (!canDrag) return;
      const target = event.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea')) return;

      draggingRef.current = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        originX: offset.x,
        originY: offset.y,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [canDrag, offset.x, offset.y],
  );

  const onPointerMoveHeader = useCallback((event: React.PointerEvent<HTMLDivElement>): void => {
    if (!draggingRef.current.active) return;
    const dx = event.clientX - draggingRef.current.startX;
    const dy = event.clientY - draggingRef.current.startY;
    const clampedX = Math.max(-220, Math.min(220, draggingRef.current.originX + dx));
    const clampedY = Math.max(-120, Math.min(120, draggingRef.current.originY + dy));
    setOffset({ x: clampedX, y: clampedY });
  }, []);

  const onPointerUpHeader = useCallback((event: React.PointerEvent<HTMLDivElement>): void => {
    if (!draggingRef.current.active) return;
    draggingRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const isMoved = offset.x !== 0 || offset.y !== 0;

  return (
    <div
      style={{
        transform: isMoved ? `translate3d(${offset.x}px, ${offset.y}px, 0)` : undefined,
      }}
      className={cn(
        'glass-panel relative overflow-hidden rounded-2xl border border-slate-700/60 transition-shadow',
        expandedWidth ? 'ring-1 ring-sky-400/40' : '',
        className,
      )}
    >
      <div
        onPointerDown={onPointerDownHeader}
        onPointerMove={onPointerMoveHeader}
        onPointerUp={onPointerUpHeader}
        onPointerCancel={onPointerUpHeader}
        className={cn(
          'flex items-center justify-between gap-3 border-b border-slate-800/90 bg-slate-950/60 px-4 py-2.5 select-none',
          canDrag ? 'cursor-grab active:cursor-grabbing' : '',
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 font-mono text-xs font-medium text-slate-200">{title}</span>
            <span className="hidden truncate font-mono text-[11px] text-slate-500 xl:inline">
              {pathLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {badge}
          {canDrag ? (
            <span className="hidden items-center gap-1 font-mono text-[10px] text-slate-500 lg:inline-flex">
              <Move className="h-3 w-3" aria-hidden="true" />
              Drag
            </span>
          ) : null}
          {isMoved ? (
            <button
              type="button"
              onClick={() => setOffset({ x: 0, y: 0 })}
              aria-label={`Reset ${title} window position`}
              className="rounded-md p-1 text-sky-300 hover:bg-sky-400/15"
              title="Snap back to grid"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setExpandedWidth((prev) => !prev)}
            aria-label={expandedWidth ? `Restore ${title} highlight` : `Focus ${title} window`}
            className="hidden rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 sm:inline-flex"
          >
            {expandedWidth ? (
              <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMinimized((prev) => !prev)}
            aria-expanded={!minimized}
            aria-label={minimized ? `Expand ${title}` : `Minimize ${title}`}
            className="rounded-md border border-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300 hover:border-slate-700 hover:text-white"
          >
            {minimized ? 'Open' : 'Hide'}
          </button>
        </div>
      </div>

      {!minimized ? <div className="p-4 sm:p-6">{children}</div> : null}
    </div>
  );
}
