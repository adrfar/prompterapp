# Teleprompter v1

Mobile-first teleprompter web app built with React + TypeScript + Vite, optimized for iPhone Safari and Home Screen usage.

## Features

- Paste script text directly
- Upload `.txt` and `.docx` files and extract plain text
- Full-screen style teleprompter viewport with internal scrolling
- Play/Pause auto-scroll powered by `requestAnimationFrame`
- Speed control in **pixels per second**
- Auto-scroll direction control (up or down)
- Font size, line height, and side padding controls
- Horizontal and vertical mirror toggles (applied only to teleprompter content)
- Optional center guide line
- `localStorage` persistence for script and settings
- PWA manifest for Home Screen installation

## Tech Stack

- React
- TypeScript (strict mode)
- Vite
- Vitest + React Testing Library
- Playwright (mobile Safari profile)

## Getting Started

### 1. Install

```bash
npm install
```

### 2. Start dev server

```bash
npm run dev
```

### 3. Build production bundle

```bash
npm run build
```

### 4. Type check

```bash
npm run typecheck
```

### 5. Run tests

```bash
npm test
npm run test:e2e
```

## Usage

1. Open the app on mobile Safari.
2. Paste script text or upload a `.txt`/`.docx` file.
3. Adjust speed, typography, and padding.
4. Enable mirror toggles if using reflective teleprompter hardware.
5. Tap `Play` to begin smooth auto-scroll.
6. Optionally add to Home Screen from Safari Share menu.

## Testing Coverage

### Unit tests

- Settings normalization and clamping
- Mirror transform logic
- Persistence load/save behavior with invalid storage handling
- Reading-position capture/restore logic

### Component tests

- Control interactions and file upload callback behavior
- Viewport placeholder, mirror transform application, guide-line rendering
- App-level persistence + mirror scope integration

### E2E tests

- Core reading flow (paste script, play, observe internal scroll movement)
- Persistence flow (reload and restore script/settings)

## Architecture Notes

- Small focused modules under `src/lib` for normalization, persistence, mirror, file parsing, and reading-position utilities.
- `useAutoScroll` hook encapsulates `requestAnimationFrame` loop and px/s movement.
- Teleprompter content is mirrored in a dedicated content layer so controls remain unaffected.
- Scroll behavior is internal to viewport (`overflow-y: auto`) while page scrolling is disabled.

## Tradeoffs and v1 Limitations

- `.docx` parsing intentionally extracts plain visible paragraph text only (no advanced formatting/embedded object support).
- No backend/auth/cloud sync by design; data is local to the current browser/device.
- No PDF import support in v1.
- No service worker caching/offline strategy beyond manifest/home-screen capability.
