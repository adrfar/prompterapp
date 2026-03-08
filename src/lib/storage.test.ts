import { beforeEach, describe, expect, it } from 'vitest';

import { defaultSettings } from './settings';
import { loadScript, loadSettings, saveScript, saveSettings, storageKeys } from './storage';

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('persists and loads script text', () => {
    saveScript('Hello teleprompter');
    expect(loadScript()).toBe('Hello teleprompter');
  });

  it('returns an empty script when not found', () => {
    expect(loadScript()).toBe('');
  });

  it('persists and loads settings', () => {
    const settings = {
      ...defaultSettings,
      speedPxPerSecond: 145,
      mirrorHorizontal: true
    };

    saveSettings(settings);

    expect(loadSettings()).toEqual(settings);
  });

  it('falls back to defaults for invalid JSON', () => {
    window.localStorage.setItem(storageKeys.settings, '{invalid json');
    expect(loadSettings()).toEqual(defaultSettings);
  });

  it('normalizes malformed stored settings', () => {
    window.localStorage.setItem(
      storageKeys.settings,
      JSON.stringify({
        speedPxPerSecond: 999,
        fontSizePx: 3,
        lineHeight: 0,
        sidePaddingPx: 300,
        scrollDirection: 'left',
        mirrorHorizontal: 'not-a-bool'
      })
    );

    const settings = loadSettings();

    expect(settings.speedPxPerSecond).toBe(600);
    expect(settings.fontSizePx).toBe(24);
    expect(settings.lineHeight).toBe(1);
    expect(settings.sidePaddingPx).toBe(120);
    expect(settings.scrollDirection).toBe('down');
    expect(settings.mirrorHorizontal).toBe(false);
  });
});
