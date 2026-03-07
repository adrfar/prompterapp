import { describe, expect, it } from 'vitest';

import { defaultSettings, normalizeSettings, settingBounds } from './settings';

describe('normalizeSettings', () => {
  it('returns defaults for non-object input', () => {
    expect(normalizeSettings(null)).toEqual(defaultSettings);
    expect(normalizeSettings('invalid')).toEqual(defaultSettings);
  });

  it('clamps numeric values to configured bounds', () => {
    const normalized = normalizeSettings({
      speedPxPerSecond: 5000,
      fontSizePx: 12,
      lineHeight: 100,
      sidePaddingPx: -10,
      mirrorHorizontal: true,
      mirrorVertical: false,
      showGuideLine: true
    });

    expect(normalized.speedPxPerSecond).toBe(settingBounds.speedPxPerSecond.max);
    expect(normalized.fontSizePx).toBe(settingBounds.fontSizePx.min);
    expect(normalized.lineHeight).toBe(settingBounds.lineHeight.max);
    expect(normalized.sidePaddingPx).toBe(settingBounds.sidePaddingPx.min);
    expect(normalized.mirrorHorizontal).toBe(true);
    expect(normalized.mirrorVertical).toBe(false);
    expect(normalized.showGuideLine).toBe(true);
  });

  it('falls back to defaults for invalid booleans and numbers', () => {
    const normalized = normalizeSettings({
      speedPxPerSecond: Number.NaN,
      fontSizePx: '40',
      lineHeight: Infinity,
      sidePaddingPx: undefined,
      mirrorHorizontal: 'yes',
      mirrorVertical: 1,
      showGuideLine: null
    });

    expect(normalized).toEqual(defaultSettings);
  });
});
