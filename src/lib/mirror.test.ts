import { describe, expect, it } from 'vitest';

import { getMirrorTransform } from './mirror';

describe('getMirrorTransform', () => {
  it('returns none when no mirror is enabled', () => {
    expect(getMirrorTransform({ mirrorHorizontal: false, mirrorVertical: false })).toBe('none');
  });

  it('returns horizontal mirror transform', () => {
    expect(getMirrorTransform({ mirrorHorizontal: true, mirrorVertical: false })).toBe('scale(-1, 1)');
  });

  it('returns vertical mirror transform', () => {
    expect(getMirrorTransform({ mirrorHorizontal: false, mirrorVertical: true })).toBe('scale(1, -1)');
  });

  it('returns combined mirror transform', () => {
    expect(getMirrorTransform({ mirrorHorizontal: true, mirrorVertical: true })).toBe('scale(-1, -1)');
  });
});
