import { type ScrollDirection } from '../lib/settings';

export interface AdvanceAutoScrollInput {
  renderedScrollTop: number;
  virtualScrollTop: number | null;
  speedPxPerSecond: number;
  deltaSeconds: number;
  maxScrollTop: number;
  direction: ScrollDirection;
}

export interface AdvanceAutoScrollResult {
  nextVirtualScrollTop: number;
  nextRenderedScrollTop: number;
  reachedEnd: boolean;
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const advanceAutoScroll = ({
  renderedScrollTop,
  virtualScrollTop,
  speedPxPerSecond,
  deltaSeconds,
  maxScrollTop,
  direction
}: AdvanceAutoScrollInput): AdvanceAutoScrollResult => {
  const base = virtualScrollTop ?? renderedScrollTop;
  const directionSign = direction === 'down' ? 1 : -1;
  const nextVirtualScrollTop = clamp(base + speedPxPerSecond * deltaSeconds * directionSign, 0, maxScrollTop);
  const nextRenderedScrollTop = clamp(nextVirtualScrollTop, 0, maxScrollTop);
  const reachedEnd = direction === 'down' ? nextVirtualScrollTop >= maxScrollTop : nextVirtualScrollTop <= 0;

  return {
    nextVirtualScrollTop,
    nextRenderedScrollTop,
    reachedEnd
  };
};
