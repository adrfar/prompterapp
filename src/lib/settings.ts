export interface TeleprompterSettings {
  speedPxPerSecond: number;
  fontSizePx: number;
  lineHeight: number;
  sidePaddingPx: number;
  mirrorHorizontal: boolean;
  mirrorVertical: boolean;
  showGuideLine: boolean;
}

export const settingBounds = {
  speedPxPerSecond: { min: 0, max: 600, step: 5 },
  fontSizePx: { min: 24, max: 96, step: 1 },
  lineHeight: { min: 1, max: 2.2, step: 0.05 },
  sidePaddingPx: { min: 8, max: 120, step: 1 }
} as const;

export const defaultSettings: TeleprompterSettings = {
  speedPxPerSecond: 70,
  fontSizePx: 44,
  lineHeight: 1.35,
  sidePaddingPx: 32,
  mirrorHorizontal: false,
  mirrorVertical: false,
  showGuideLine: false
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const clampNumber = (value: unknown, min: number, max: number, fallback: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, value));
};

const normalizeBoolean = (value: unknown, fallback: boolean): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  return fallback;
};

export const normalizeSettings = (value: unknown): TeleprompterSettings => {
  if (!isObject(value)) {
    return { ...defaultSettings };
  }

  return {
    speedPxPerSecond: clampNumber(
      value.speedPxPerSecond,
      settingBounds.speedPxPerSecond.min,
      settingBounds.speedPxPerSecond.max,
      defaultSettings.speedPxPerSecond
    ),
    fontSizePx: clampNumber(
      value.fontSizePx,
      settingBounds.fontSizePx.min,
      settingBounds.fontSizePx.max,
      defaultSettings.fontSizePx
    ),
    lineHeight: clampNumber(
      value.lineHeight,
      settingBounds.lineHeight.min,
      settingBounds.lineHeight.max,
      defaultSettings.lineHeight
    ),
    sidePaddingPx: clampNumber(
      value.sidePaddingPx,
      settingBounds.sidePaddingPx.min,
      settingBounds.sidePaddingPx.max,
      defaultSettings.sidePaddingPx
    ),
    mirrorHorizontal: normalizeBoolean(value.mirrorHorizontal, defaultSettings.mirrorHorizontal),
    mirrorVertical: normalizeBoolean(value.mirrorVertical, defaultSettings.mirrorVertical),
    showGuideLine: normalizeBoolean(value.showGuideLine, defaultSettings.showGuideLine)
  };
};
