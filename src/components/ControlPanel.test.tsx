import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { defaultSettings } from '../lib/settings';
import { ControlPanel } from './ControlPanel';

describe('ControlPanel', () => {
  it('handles primary control interactions', async () => {
    const user = userEvent.setup();

    const callbacks = {
      onToggleControls: vi.fn(),
      onPlayPause: vi.fn(),
      onScriptChange: vi.fn(),
      onFileUpload: vi.fn(),
      onSpeedChange: vi.fn(),
      onFontSizeChange: vi.fn(),
      onLineHeightChange: vi.fn(),
      onSidePaddingChange: vi.fn(),
      onMirrorHorizontalToggle: vi.fn(),
      onMirrorVerticalToggle: vi.fn(),
      onGuideLineToggle: vi.fn()
    };

    render(
      <ControlPanel
        script=""
        settings={defaultSettings}
        isPlaying={false}
        canPlay
        controlsOpen
        fileError={null}
        {...callbacks}
      />
    );

    await user.click(screen.getByTestId('play-pause-button'));
    expect(callbacks.onPlayPause).toHaveBeenCalledTimes(1);

    await user.type(screen.getByTestId('script-textarea'), 'My script');
    expect(callbacks.onScriptChange).toHaveBeenCalled();

    const speedSlider = screen.getByTestId('speed-slider');
    fireEvent.change(speedSlider, { target: { value: '120' } });
    expect(callbacks.onSpeedChange).toHaveBeenCalledWith(120);

    await user.click(screen.getByTestId('mirror-horizontal-toggle'));
    expect(callbacks.onMirrorHorizontalToggle).toHaveBeenCalledWith(true);

    await user.click(screen.getByTestId('guide-line-toggle'));
    expect(callbacks.onGuideLineToggle).toHaveBeenCalledWith(true);
  });

  it('forwards uploaded files', async () => {
    const user = userEvent.setup();
    const onFileUpload = vi.fn();

    render(
      <ControlPanel
        script=""
        settings={defaultSettings}
        isPlaying={false}
        canPlay
        controlsOpen
        fileError={null}
        onToggleControls={vi.fn()}
        onPlayPause={vi.fn()}
        onScriptChange={vi.fn()}
        onFileUpload={onFileUpload}
        onSpeedChange={vi.fn()}
        onFontSizeChange={vi.fn()}
        onLineHeightChange={vi.fn()}
        onSidePaddingChange={vi.fn()}
        onMirrorHorizontalToggle={vi.fn()}
        onMirrorVerticalToggle={vi.fn()}
        onGuideLineToggle={vi.fn()}
      />
    );

    const file = new File(['Hello'], 'sample.txt', { type: 'text/plain' });
    const input = screen.getByTestId('file-input');

    await user.upload(input, file);

    expect(onFileUpload).toHaveBeenCalledTimes(1);
    const firstCallArgument = onFileUpload.mock.calls[0]?.[0];
    expect(firstCallArgument).toBe(file);
  });
});
