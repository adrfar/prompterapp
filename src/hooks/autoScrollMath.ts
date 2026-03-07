export interface AdvanceAutoScrollInput {
  renderedScrollTop: number;
  virtualScrollTop: number | null;
  speedPxPerSecond: number;
  deltaSeconds: number;
  maxScrollTop: number;
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
  maxScrollTop
}: AdvanceAutoScrollInput): AdvanceAutoScrollResult => {
  const base = virtualScrollTop ?? renderedScrollTop;
  const nextVirtualScrollTop = clamp(base + speedPxPerSecond * deltaSeconds, 0, maxScrollTop);
  const nextRenderedScrollTop = clamp(nextVirtualScrollTop, 0, maxScrollTop);

  return {
    nextVirtualScrollTop,
    nextRenderedScrollTop,
    reachedEnd: nextVirtualScrollTop >= maxScrollTop
  };
};
