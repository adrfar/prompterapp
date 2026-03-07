import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { defaultSettings } from '../lib/settings';
import { TeleprompterViewport } from './TeleprompterViewport';

describe('TeleprompterViewport', () => {
  it('shows placeholder text when script is empty', () => {
    render(<TeleprompterViewport script="" settings={defaultSettings} />);

    expect(screen.getByText(/paste a script or upload/i)).toBeInTheDocument();
  });

  it('applies mirror transform to content layer only', () => {
    render(
      <TeleprompterViewport
        script="Mirror me"
        settings={{ ...defaultSettings, mirrorHorizontal: true, mirrorVertical: false }}
      />
    );

    const contentLayer = screen.getByTestId('teleprompter-content-layer');
    const viewport = screen.getByTestId('teleprompter-viewport');

    expect(contentLayer).toHaveStyle({ transform: 'scale(-1, 1)' });
    expect(viewport).not.toHaveStyle({ transform: 'scale(-1, 1)' });
  });

  it('renders optional center guide line', () => {
    const { rerender } = render(<TeleprompterViewport script="Guide" settings={defaultSettings} />);

    expect(screen.queryByTestId('guide-line')).not.toBeInTheDocument();

    rerender(
      <TeleprompterViewport
        script="Guide"
        settings={{ ...defaultSettings, showGuideLine: true }}
      />
    );

    expect(screen.getByTestId('guide-line')).toBeInTheDocument();
  });
});
