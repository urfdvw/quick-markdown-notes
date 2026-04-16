# CLAUDE.md - Sticky Notes

## Overview

Sticky Notes is a zero-build, client-side markdown note-taking app. It runs entirely in the browser with no backend, no bundler, and no package manager. All state is persisted via `localStorage`.

## Tech Stack

- **Vanilla JavaScript (ES6+)** - No frameworks
- **Ace Editor** (v1.15.3, CDN) - Markdown editing with syntax highlighting and autocompletion
- **Zero-MD** (v2, CDN) - Real-time markdown-to-HTML rendering
- **CSS** - Inline in `index.html`, no preprocessor
- **localStorage** - All persistence (notes, preferences, layout state)

## Project Structure

```
index.html    - Entry point, layout, and all CSS
note.js       - All application logic
favicon.ico   - App icon
```

There are no config files, no `package.json`, no build steps. The app is served as static files.

## Design Principles

1. **Zero dependencies to install.** All libraries load from CDNs. There is no `npm install`, no build, no transpile. Open `index.html` and it works.

2. **Single-file logic.** All JavaScript lives in `note.js`, organized into clearly labeled sections (constants, state, editor setup, tab management, split view, dark mode, file download, editor toggle, event listeners, initialization). This keeps the app easy to navigate without module boundaries.

3. **localStorage as the data layer.** Notes are saved per-tab under `floating_notes_tab_{color}`. Preferences (dark mode, active tab, split ratio) are stored under `floating_notes_*` keys. There is no server, no database, no sync.

4. **Event-driven auto-save.** Every editor change triggers an immediate save to localStorage. There is no explicit "save" action for persistence — the save button exports to a `.md` file.

5. **Minimal UI surface.** The toolbar has only what's needed: color tabs for switching notes, and three action buttons (toggle editor, download, dark mode). No menus, no modals, no settings panels.

6. **CSS filter dark mode.** Dark mode uses `filter: invert(87%) hue-rotate(180deg)` on the `<html>` element rather than maintaining a separate color scheme. This is a deliberate tradeoff: simple implementation, works across all content including the markdown preview.

## Architecture

- **State** is held in module-level variables (`currentTab`, `darkTheme`, `splitRatio`) synchronized bidirectionally with localStorage.
- **Editor** is an Ace Editor instance configured for markdown mode with word wrap and autocompletion.
- **Preview** is a `<zero-md>` web component whose inner `<script type="text/markdown">` content is updated on every editor change.
- **Tabs** are color-coded buttons that each map to a separate localStorage key. Switching tabs saves the current content and loads the new tab's content.
- **Split view** uses percentage-based widths on the editor and preview containers, with a draggable divider constrained between 20% and 80%.

## Storage Keys

| Key | Purpose |
|-----|---------|
| `floating_notes_tab_{color}` | Note content for each color tab |
| `floating_notes_current_tab` | Active tab color name |
| `floating_notes_dark_theme` | Dark mode toggle (`"true"` / `"false"`) |
| `floating_notes_split_ratio` | Editor/preview width ratio (percentage) |

## Conventions

- No build tools. Changes are tested by opening `index.html` in a browser.
- CSS lives in `<style>` inside `index.html`, not in external files.
- JavaScript sections are delimited by comment banners (`/* ==== Section Name ==== */`).
- The app targets modern browsers. No polyfills.
