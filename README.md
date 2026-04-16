# Markdown Notes

A lightweight, browser-based markdown note-taking app. No installation, no accounts, no server — just open and start writing.

## Getting Started

https://github.com/urfdvw/quick-markdown-notes

## Features

### Color-Coded Tabs

Six color tabs (yellow, green, red, blue, purple, gray) at the bottom of the screen let you organize separate notes. Click a tab to switch. Each tab stores its own content independently.

### Markdown Editor + Live Preview

The screen is split into two panes:
- **Left** - A markdown editor with syntax highlighting and autocompletion (powered by Ace Editor)
- **Right** - A live preview that renders your markdown as you type

### Resizable Split View

Drag the divider between the editor and preview to adjust the layout. Your preferred ratio is saved automatically.

### Auto-Save

All notes are saved to your browser's local storage on every keystroke. Your notes persist across browser sessions — no manual save needed.

### Export to File

Click the disk icon (💾) to download the current note as a `.md` file. The filename is derived from the first heading in your note.

### Dark Mode

Click the moon icon (🌑) to toggle dark mode. Your preference is remembered.

### Hide Editor

Click the pencil icon (✏️) to hide the editor and view the preview in full width. Click again to restore the editor.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd-]` / `Ctrl-]` | Indent selected lines |
| `Cmd-[` / `Ctrl-[` | Dedent selected lines |

Standard Ace Editor shortcuts (tab, indent, undo/redo, etc.) are also available.

## Data Storage

All data is stored in your browser's `localStorage`. Nothing is sent to any server. Clearing your browser data will delete your notes.

To back up your notes, use the export button (💾) to download each tab as a markdown file.

## Browser Requirements

- A modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection on first load (to fetch Ace Editor and Zero-MD from CDNs; cached afterward)

## License

GNU General Public License v3.0 — see [LICENSE](LICENSE).
