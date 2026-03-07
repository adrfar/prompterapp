import { describe, expect, it } from 'vitest';

import { advanceAutoScroll } from './autoScrollMath';

describe('advanceAutoScroll', () => {
  it('accumulates fractional movement across frames', () => {
    const speedPxPerSecond = 15;
    const deltaSeconds = 1 / 60;
    const maxScrollTop = 5000;

    let virtualScrollTop: number | null = null;
    let renderedScrollTop = 0;

    for (let frame = 0; frame < 60; frame += 1) {
      const result = advanceAutoScroll({
        renderedScrollTop,
        virtualScrollTop,
        speedPxPerSecond,
        deltaSeconds,
        maxScrollTop
      });

      virtualScrollTop = result.nextVirtualScrollTop;
      renderedScrollTop = Math.floor(result.nextRenderedScrollTop);
    }

    expect(virtualScrollTop).toBeCloseTo(15, 3);
    expect(renderedScrollTop).toBe(15);
  });

  it('flags end of content', () => {
    const result = advanceAutoScroll({
      renderedScrollTop: 96,
      virtualScrollTop: 96,
      speedPxPerSecond: 50,
      deltaSeconds: 0.2,
      maxScrollTop: 100
    });

    expect(result.nextVirtualScrollTop).toBe(100);
    expect(result.reachedEnd).toBe(true);
  });
});
