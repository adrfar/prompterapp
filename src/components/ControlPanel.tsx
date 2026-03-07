import { ChangeEvent, useRef } from 'react';

import { settingBounds, type TeleprompterSettings } from '../lib/settings';

interface ControlPanelProps {
  script: string;
  settings: TeleprompterSettings;
  isPlaying: boolean;
  canPlay: boolean;
  controlsOpen: boolean;
  fileError: string | null;
  onToggleControls: () => void;
  onPlayPause: () => void;
  onScriptChange: (script: string) => void;
  onFileUpload: (file: File | null) => void;
  onSpeedChange: (value: number) => void;
  onFontSizeChange: (value: number) => void;
  onLineHeightChange: (value: number) => void;
  onSidePaddingChange: (value: number) => void;
  onMirrorHorizontalToggle: (checked: boolean) => void;
  onMirrorVerticalToggle: (checked: boolean) => void;
  onGuideLineToggle: (checked: boolean) => void;
}

const parseSliderValue = (event: ChangeEvent<HTMLInputElement>): number =>
  Number.parseFloat(event.target.value);

export const ControlPanel = ({
  script,
  settings,
  isPlaying,
  canPlay,
  controlsOpen,
  fileError,
  onToggleControls,
  onPlayPause,
  onScriptChange,
  onFileUpload,
  onSpeedChange,
  onFontSizeChange,
  onLineHeightChange,
  onSidePaddingChange,
  onMirrorHorizontalToggle,
  onMirrorVerticalToggle,
  onGuideLineToggle
}: ControlPanelProps): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const panelId = 'teleprompter-controls-panel';

  const handleUploadChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const [file] = event.target.files ?? [];
    onFileUpload(file ?? null);

    // Allow selecting the same file again after a failed parse.
    event.currentTarget.value = '';
  };

  return (
    <aside className="control-shell" data-testid="control-shell">
      <div className="top-controls">
        <button
          className="primary-button"
          type="button"
          onClick={onPlayPause}
          data-testid="play-pause-button"
          disabled={!canPlay}
          aria-label={isPlaying ? 'Pause autoscroll' : 'Start autoscroll'}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={onToggleControls}
          aria-expanded={controlsOpen}
          aria-controls={panelId}
          data-testid="toggle-controls-button"
        >
          {controlsOpen ? 'Hide Controls' : 'Show Controls'}
        </button>
      </div>

      {controlsOpen ? (
        <div id={panelId} className="panel" data-testid="control-panel">
          <section className="panel-section">
            <label className="field-label" htmlFor="script-input">
              Script
            </label>
            <textarea
              id="script-input"
              className="script-input"
              value={script}
              onChange={(event) => onScriptChange(event.target.value)}
              placeholder="Paste your script here"
              rows={6}
              data-testid="script-textarea"
            />
            <div className="upload-row">
              <input
                ref={fileInputRef}
                id="script-file"
                className="file-input"
                type="file"
                accept=".txt,.docx,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleUploadChange}
                data-testid="file-input"
              />
              <button className="secondary-button" type="button" onClick={() => fileInputRef.current?.click()}>
                Upload .txt / .docx
              </button>
            </div>
            {fileError ? (
              <p role="alert" className="error-message" data-testid="file-error">
                {fileError}
              </p>
            ) : null}
          </section>

          <section className="panel-section slider-grid">
            <label className="slider-label" htmlFor="speed-slider">
              Speed ({Math.round(settings.speedPxPerSecond)} px/s)
            </label>
            <input
              id="speed-slider"
              type="range"
              min={settingBounds.speedPxPerSecond.min}
              max={settingBounds.speedPxPerSecond.max}
              step={settingBounds.speedPxPerSecond.step}
              value={settings.speedPxPerSecond}
              onChange={(event) => onSpeedChange(parseSliderValue(event))}
              data-testid="speed-slider"
            />

            <label className="slider-label" htmlFor="font-size-slider">
              Font Size ({Math.round(settings.fontSizePx)} px)
            </label>
            <input
              id="font-size-slider"
              type="range"
              min={settingBounds.fontSizePx.min}
              max={settingBounds.fontSizePx.max}
              step={settingBounds.fontSizePx.step}
              value={settings.fontSizePx}
              onChange={(event) => onFontSizeChange(parseSliderValue(event))}
              data-testid="font-size-slider"
            />

            <label className="slider-label" htmlFor="line-height-slider">
              Line Height ({settings.lineHeight.toFixed(2)})
            </label>
            <input
              id="line-height-slider"
              type="range"
              min={settingBounds.lineHeight.min}
              max={settingBounds.lineHeight.max}
              step={settingBounds.lineHeight.step}
              value={settings.lineHeight}
              onChange={(event) => onLineHeightChange(parseSliderValue(event))}
              data-testid="line-height-slider"
            />

            <label className="slider-label" htmlFor="side-padding-slider">
              Side Padding ({Math.round(settings.sidePaddingPx)} px)
            </label>
            <input
              id="side-padding-slider"
              type="range"
              min={settingBounds.sidePaddingPx.min}
              max={settingBounds.sidePaddingPx.max}
              step={settingBounds.sidePaddingPx.step}
              value={settings.sidePaddingPx}
              onChange={(event) => onSidePaddingChange(parseSliderValue(event))}
              data-testid="side-padding-slider"
            />
          </section>

          <section className="panel-section toggle-grid">
            <label className="toggle-row" htmlFor="mirror-horizontal-toggle">
              <input
                id="mirror-horizontal-toggle"
                type="checkbox"
                checked={settings.mirrorHorizontal}
                onChange={(event) => onMirrorHorizontalToggle(event.target.checked)}
                data-testid="mirror-horizontal-toggle"
              />
              Horizontal Mirror
            </label>

            <label className="toggle-row" htmlFor="mirror-vertical-toggle">
              <input
                id="mirror-vertical-toggle"
                type="checkbox"
                checked={settings.mirrorVertical}
                onChange={(event) => onMirrorVerticalToggle(event.target.checked)}
                data-testid="mirror-vertical-toggle"
              />
              Vertical Mirror
            </label>

            <label className="toggle-row" htmlFor="guide-line-toggle">
              <input
                id="guide-line-toggle"
                type="checkbox"
                checked={settings.showGuideLine}
                onChange={(event) => onGuideLineToggle(event.target.checked)}
                data-testid="guide-line-toggle"
              />
              Center Guide Line
            </label>
          </section>
        </div>
      ) : null}
    </aside>
  );
};
