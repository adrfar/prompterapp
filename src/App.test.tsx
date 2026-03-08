import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import App from './App';
import { storageKeys } from './lib/storage';

describe('App integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('persists script and settings in localStorage', () => {
    render(<App />);

    const textarea = screen.getByTestId('script-textarea');
    fireEvent.change(textarea, { target: { value: 'Persistent script' } });

    const mirrorToggle = screen.getByTestId('mirror-horizontal-toggle');
    fireEvent.click(mirrorToggle);
    fireEvent.click(screen.getByTestId('direction-up'));

    expect(window.localStorage.getItem(storageKeys.script)).toBe('Persistent script');

    const rawSettings = window.localStorage.getItem(storageKeys.settings);
    expect(rawSettings).not.toBeNull();
    expect(rawSettings).toContain('"mirrorHorizontal":true');
    expect(rawSettings).toContain('"scrollDirection":"up"');
  });

  it('loads persisted state on mount', () => {
    window.localStorage.setItem(storageKeys.script, 'Saved script');
    window.localStorage.setItem(
      storageKeys.settings,
      JSON.stringify({
        speedPxPerSecond: 80,
        fontSizePx: 44,
        lineHeight: 1.35,
        sidePaddingPx: 32,
        scrollDirection: 'up',
        mirrorHorizontal: true,
        mirrorVertical: false,
        showGuideLine: false
      })
    );

    render(<App />);

    expect(screen.getByTestId('teleprompter-script')).toHaveTextContent('Saved script');
    expect(screen.getByTestId('teleprompter-content-layer')).toHaveStyle({ transform: 'scale(-1, 1)' });
    expect(screen.getByTestId('control-shell')).not.toHaveStyle({ transform: 'scale(-1, 1)' });

    fireEvent.click(screen.getByTestId('toggle-controls-button'));
    expect(screen.getByDisplayValue('Saved script')).toBeInTheDocument();
  });

  it('disables play until script exists', () => {
    render(<App />);

    const playButton = screen.getByTestId('play-pause-button');
    expect(playButton).toBeDisabled();

    fireEvent.change(screen.getByTestId('script-textarea'), { target: { value: 'Line 1' } });
    expect(playButton).not.toBeDisabled();
  });

  it('shows an error for unsupported uploads', () => {
    render(<App />);

    const fileInput = screen.getByTestId('file-input');
    const unsupportedFile = new File(['fake'], 'script.pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [unsupportedFile] } });

    expect(screen.getByTestId('file-error')).toHaveTextContent('Unsupported file');
  });
});
