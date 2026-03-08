import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ControlPanel } from './components/ControlPanel';
import { TeleprompterViewport } from './components/TeleprompterViewport';
import { extractScriptFromFile, isSupportedScriptFile } from './lib/fileParser';
import { captureReadingPosition, restoreReadingPosition, type ReadingPosition } from './lib/readingPosition';
import { normalizeSettings, type ScrollDirection, type TeleprompterSettings } from './lib/settings';
import { loadScript, loadSettings, saveScript, saveSettings } from './lib/storage';
import { useAutoScroll } from './hooks/useAutoScroll';

const typographyKeys: Array<keyof TeleprompterSettings> = ['fontSizePx', 'lineHeight', 'sidePaddingPx'];

const isTypographyPatch = (patch: Partial<TeleprompterSettings>): boolean =>
  typographyKeys.some((key) => key in patch);

export default function App(): JSX.Element {
  const initialScript = useRef(loadScript()).current;

  const [script, setScript] = useState<string>(initialScript);
  const [settings, setSettings] = useState<TeleprompterSettings>(() => loadSettings());
  const [isPlaying, setIsPlaying] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(() => initialScript.trim().length === 0);
  const [fileError, setFileError] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const pendingPositionRef = useRef<ReadingPosition | null>(null);

  const hasScript = script.trim().length > 0;

  const capturePositionForTypographyUpdate = useCallback(() => {
    if (!viewportRef.current) {
      return;
    }

    pendingPositionRef.current = captureReadingPosition(viewportRef.current);
  }, []);

  const updateSettings = useCallback((patch: Partial<TeleprompterSettings>) => {
    if (isTypographyPatch(patch)) {
      capturePositionForTypographyUpdate();
    }

    setSettings((current) => normalizeSettings({
      ...current,
      ...patch
    }));
  }, [capturePositionForTypographyUpdate]);

  useLayoutEffect(() => {
    if (!pendingPositionRef.current || !viewportRef.current) {
      return;
    }

    restoreReadingPosition(viewportRef.current, pendingPositionRef.current);
    pendingPositionRef.current = null;
  }, [settings.fontSizePx, settings.lineHeight, settings.sidePaddingPx]);

  useEffect(() => {
    saveScript(script);
  }, [script]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleReachedEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useAutoScroll({
    containerRef: viewportRef,
    isPlaying,
    speedPxPerSecond: settings.speedPxPerSecond,
    direction: settings.scrollDirection,
    onReachedEnd: handleReachedEnd
  });

  const resetViewportScroll = (): void => {
    if (!viewportRef.current) {
      return;
    }

    viewportRef.current.scrollTop = 0;
  };

  const handleScriptChange = (nextScript: string): void => {
    setFileError(null);
    setIsPlaying(false);
    setScript(nextScript);
  };

  const handleFileUpload = async (file: File | null): Promise<void> => {
    if (!file) {
      return;
    }

    setFileError(null);
    setIsPlaying(false);

    if (!isSupportedScriptFile(file)) {
      setFileError('Unsupported file. Please upload a .txt or .docx file.');
      return;
    }

    try {
      const extractedScript = await extractScriptFromFile(file);
      setScript(extractedScript);
      resetViewportScroll();
    } catch {
      setFileError('Could not parse the selected file. Please verify the file and try again.');
    }
  };

  const handlePlayPause = (): void => {
    if (!hasScript) {
      return;
    }

    setIsPlaying((current) => !current);
  };

  const handleControlsToggle = (): void => {
    setControlsOpen((open) => !open);
  };

  return (
    <main className="app-shell">
      <TeleprompterViewport ref={viewportRef} script={script} settings={settings} />

      <ControlPanel
        script={script}
        settings={settings}
        isPlaying={isPlaying}
        canPlay={hasScript}
        controlsOpen={controlsOpen}
        fileError={fileError}
        onToggleControls={handleControlsToggle}
        onPlayPause={handlePlayPause}
        onScriptChange={handleScriptChange}
        onFileUpload={(file) => {
          void handleFileUpload(file);
        }}
        onSpeedChange={(value) => updateSettings({ speedPxPerSecond: value })}
        onDirectionChange={(direction: ScrollDirection) => updateSettings({ scrollDirection: direction })}
        onFontSizeChange={(value) => updateSettings({ fontSizePx: value })}
        onLineHeightChange={(value) => updateSettings({ lineHeight: value })}
        onSidePaddingChange={(value) => updateSettings({ sidePaddingPx: value })}
        onMirrorHorizontalToggle={(checked) => updateSettings({ mirrorHorizontal: checked })}
        onMirrorVerticalToggle={(checked) => updateSettings({ mirrorVertical: checked })}
        onGuideLineToggle={(checked) => updateSettings({ showGuideLine: checked })}
      />
    </main>
  );
}
