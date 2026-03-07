import { describe, expect, it } from 'vitest';

import { captureReadingPosition, restoreReadingPosition, type ScrollLikeElement } from './readingPosition';

describe('reading position utilities', () => {
  it('captures relative reading progress', () => {
    const element: ScrollLikeElement = {
      scrollTop: 375,
      scrollHeight: 2000,
      clientHeight: 500
    };

    expect(captureReadingPosition(element).progress).toBeCloseTo(0.25);
  });

  it('restores progress after content height changes', () => {
    const before: ScrollLikeElement = {
      scrollTop: 375,
      scrollHeight: 2000,
      clientHeight: 500
    };

    const position = captureReadingPosition(before);

    const after: ScrollLikeElement = {
      scrollTop: 0,
      scrollHeight: 3000,
      clientHeight: 500
    };

    restoreReadingPosition(after, position);

    expect(after.scrollTop).toBeCloseTo(625);
  });

  it('handles non-scrollable content safely', () => {
    const element: ScrollLikeElement = {
      scrollTop: 0,
      scrollHeight: 500,
      clientHeight: 500
    };

    const position = captureReadingPosition(element);
    expect(position.progress).toBe(0);

    restoreReadingPosition(element, { progress: 0.9 });
    expect(element.scrollTop).toBe(0);
  });
});
