import { RefObject, useEffect, useRef } from 'react';
import { advanceAutoScroll } from './autoScrollMath';
import { type ScrollDirection } from '../lib/settings';

interface UseAutoScrollOptions {
  containerRef: RefObject<HTMLElement>;
  isPlaying: boolean;
  speedPxPerSecond: number;
  direction: ScrollDirection;
  onReachedEnd?: () => void;
}

export const useAutoScroll = ({
  containerRef,
  isPlaying,
  speedPxPerSecond,
  direction,
  onReachedEnd
}: UseAutoScrollOptions): void => {
  const rafIdRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const virtualScrollTopRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = null;
      previousTimeRef.current = null;
      virtualScrollTopRef.current = null;
      return;
    }

    const tick = (timestamp: number): void => {
      const container = containerRef.current;
      if (!container) {
        rafIdRef.current = window.requestAnimationFrame(tick);
        return;
      }

      if (previousTimeRef.current === null) {
        previousTimeRef.current = timestamp;
        rafIdRef.current = window.requestAnimationFrame(tick);
        return;
      }

      const deltaSeconds = (timestamp - previousTimeRef.current) / 1000;
      previousTimeRef.current = timestamp;

      const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
      const nextState = advanceAutoScroll({
        renderedScrollTop: container.scrollTop,
        virtualScrollTop: virtualScrollTopRef.current,
        speedPxPerSecond,
        deltaSeconds,
        maxScrollTop,
        direction
      });
      virtualScrollTopRef.current = nextState.nextVirtualScrollTop;
      container.scrollTop = nextState.nextRenderedScrollTop;

      if (nextState.reachedEnd) {
        onReachedEnd?.();
        rafIdRef.current = null;
        previousTimeRef.current = null;
        virtualScrollTopRef.current = null;
        return;
      }

      rafIdRef.current = window.requestAnimationFrame(tick);
    };

    rafIdRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = null;
      previousTimeRef.current = null;
      virtualScrollTopRef.current = null;
    };
  }, [containerRef, direction, isPlaying, onReachedEnd, speedPxPerSecond]);
};
