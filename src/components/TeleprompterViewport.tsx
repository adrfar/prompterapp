import { forwardRef } from 'react';

import { getMirrorTransform } from '../lib/mirror';
import type { TeleprompterSettings } from '../lib/settings';

interface TeleprompterViewportProps {
  script: string;
  settings: TeleprompterSettings;
}

export const TeleprompterViewport = forwardRef<HTMLDivElement, TeleprompterViewportProps>(
  ({ script, settings }, ref) => {
    const mirrorTransform = getMirrorTransform({
      mirrorHorizontal: settings.mirrorHorizontal,
      mirrorVertical: settings.mirrorVertical
    });

    return (
      <section
        ref={ref}
        className="teleprompter-viewport"
        aria-label="Teleprompter viewport"
        data-testid="teleprompter-viewport"
      >
        {settings.showGuideLine ? <div className="guide-line" data-testid="guide-line" /> : null}

        <div className="content-layer" style={{ transform: mirrorTransform }} data-testid="teleprompter-content-layer">
          <div
            className={`script-content ${script ? '' : 'placeholder'}`}
            style={{
              fontSize: `${settings.fontSizePx}px`,
              lineHeight: settings.lineHeight,
              paddingInline: `${settings.sidePaddingPx}px`
            }}
            data-testid="teleprompter-script"
          >
            {script || 'Paste a script or upload a .txt/.docx file to begin.'}
          </div>
        </div>
      </section>
    );
  }
);

TeleprompterViewport.displayName = 'TeleprompterViewport';
