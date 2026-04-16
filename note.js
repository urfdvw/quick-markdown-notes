/* ============================
   Constants and Configuration
   ============================ */

const COLORS = {
    yellow: 'rgb(238, 229, 148)',
    green: 'rgb(159, 223, 163)',
    red: 'rgb(240, 153, 140)',
    blue: 'rgb(124, 205, 255)',
    purple: 'rgb(201, 171, 238)',
    gray: 'lightgray'
};

const STORAGE_KEYS = {
    DARK_THEME: 'floating_notes_dark_theme',
    CURRENT_TAB: 'floating_notes_current_tab',
    SPLIT_RATIO: 'floating_notes_split_ratio'
};

const DEFAULT_SPLIT_RATIO = 50;

/* ============================
   State Management
   ============================ */

let currentTab = localStorage.getItem(STORAGE_KEYS.CURRENT_TAB) || 'yellow';
let darkTheme = localStorage.getItem(STORAGE_KEYS.DARK_THEME) === 'true';
let splitRatio = parseFloat(localStorage.getItem(STORAGE_KEYS.SPLIT_RATIO)) || DEFAULT_SPLIT_RATIO;
let initialized = false;

/* ============================
   Editor Setup
   ============================ */

const editor = ace.edit("editor");
editor.setOptions({
    placeholder: "Markdown here...",
    fontSize: "12pt",
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: false
});
editor.session.setUseWrapMode(true);
editor.session.setMode("ace/mode/markdown");
editor.setShowPrintMargin(false);

editor.commands.addCommand({
    name: "Save",
    bindKey: { win: "Ctrl-S", mac: "Cmd-S" },
    exec: () => {
        saveCurrentTab();
        console.log("Note saved");
    }
});

editor.commands.addCommand({
    name: "Indent",
    bindKey: { win: "Ctrl-]", mac: "Cmd-]" },
    exec: (editor) => {
        editor.blockIndent();
    }
});

editor.commands.addCommand({
    name: "Dedent",
    bindKey: { win: "Ctrl-[", mac: "Cmd-[" },
    exec: (editor) => {
        editor.blockOutdent();
    }
});

editor.focus();

/* ============================
   Tab Management
   ============================ */

function getTabStorageKey(color) {
    return `floating_notes_tab_${color}`;
}

function saveCurrentTab() {
    const content = editor.getValue();
    localStorage.setItem(getTabStorageKey(currentTab), content);
}

function loadTab(color) {
    // Save current tab before switching (skip on first load to avoid overwriting with empty editor)
    if (initialized) {
        saveCurrentTab();
    }

    // Switch to new tab
    currentTab = color;
    localStorage.setItem(STORAGE_KEYS.CURRENT_TAB, color);

    // Load new tab content
    const content = localStorage.getItem(getTabStorageKey(color)) || '';
    editor.setValue(content, -1);

    // Update background color
    document.body.style.backgroundColor = COLORS[color];

    // Update active tab indicator
    document.querySelectorAll('.color-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.color-tab[data-color="${color}"]`).classList.add('active');

    // Update title
    updateTitle();
}

function updateTitle() {
    const content = editor.getValue().trim();
    const firstLine = content.split('\n')[0];
    const name = firstLine.replace(/^#+\s*/, '').trim();
    document.title = name || 'MD Notes';
}

/* ============================
   Editor Events
   ============================ */

editor.session.on("change", () => {
    // Update preview
    document.getElementById("disp").innerHTML = editor.getValue();

    // Update title
    updateTitle();

    // Auto-save
    saveCurrentTab();
});

/* ============================
   Split View with Draggable Divider
   ============================ */

function initSplitView() {
    const editorContainer = document.getElementById('editor-container');
    const previewContainer = document.getElementById('preview-container');
    const divider = document.getElementById('divider');

    // Set initial split ratio
    editorContainer.style.width = `${splitRatio}%`;
    previewContainer.style.width = `${100 - splitRatio}%`;

    let isResizing = false;

    divider.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const mainRect = document.getElementById('main').getBoundingClientRect();
        const newRatio = ((e.clientX - mainRect.left) / mainRect.width) * 100;

        // Constrain ratio between 20% and 80%
        if (newRatio >= 20 && newRatio <= 80) {
            splitRatio = newRatio;
            editorContainer.style.width = `${splitRatio}%`;
            previewContainer.style.width = `${100 - splitRatio}%`;

            // Resize editor
            editor.resize();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            // Save split ratio
            localStorage.setItem(STORAGE_KEYS.SPLIT_RATIO, splitRatio.toString());
        }
    });
}

/* ============================
   Dark Mode
   ============================ */

function applyDarkMode() {
    const darkModeBtn = document.getElementById('dark-mode-btn');

    if (!darkTheme) {
        const existingStyle = document.getElementById('dark-mode-style');
        if (existingStyle) {
            existingStyle.remove();
        }
        darkModeBtn.innerText = '🌑';
    } else {
        const css = `
            html {
                -webkit-filter: invert(87%) hue-rotate(180deg);
                -moz-filter: invert(87%) hue-rotate(180deg);
                -o-filter: invert(87%) hue-rotate(180deg);
                -ms-filter: invert(87%) hue-rotate(180deg);
                filter: invert(87%) hue-rotate(180deg);
            }
        `;

        let style = document.getElementById('dark-mode-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'dark-mode-style';
            style.type = 'text/css';
            document.head.appendChild(style);
        }

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.textContent = css;
        }

        darkModeBtn.innerText = '🌞';
    }
}

function toggleDarkTheme() {
    darkTheme = !darkTheme;
    localStorage.setItem(STORAGE_KEYS.DARK_THEME, darkTheme.toString());
    applyDarkMode();
}

/* ============================
   File Download
   ============================ */

function downloadFile(data, filename, type) {
    const blob = new Blob([data], { type });

    if (window.navigator.msSaveOrOpenBlob) {
        // IE10+
        window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }
}

function saveNote() {
    const content = editor.getValue();
    if (content.length > 0) {
        const filename = `${document.title}.md`;
        downloadFile(content, filename, 'text/markdown');
    }
}

/* ============================
   Editor Toggle
   ============================ */

function toggleEditor() {
    const editorContainer = document.getElementById('editor-container');
    const divider = document.getElementById('divider');
    const previewContainer = document.getElementById('preview-container');

    if (editorContainer.style.display === 'none') {
        // Show editor
        editorContainer.style.display = '';
        editorContainer.style.width = `${splitRatio}%`;
        divider.style.display = '';
        previewContainer.style.width = `${100 - splitRatio}%`;
        editor.focus();
    } else {
        // Hide editor
        editorContainer.style.display = 'none';
        divider.style.display = 'none';
        previewContainer.style.width = '100%';
    }
}

/* ============================
   Event Listeners
   ============================ */

function initEventListeners() {
    // Color tab buttons
    document.querySelectorAll('.color-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            loadTab(color);
        });
    });

    // Toggle editor button
    document.getElementById('toggle-editor-btn').addEventListener('click', (e) => {
        e.preventDefault();
        toggleEditor();
    });

    // Save button
    document.getElementById('save-btn').addEventListener('click', (e) => {
        e.preventDefault();
        saveNote();
    });

    // Dark mode button
    document.getElementById('dark-mode-btn').addEventListener('click', (e) => {
        e.preventDefault();
        toggleDarkTheme();
    });

    // Prevent accidental page leave
    window.addEventListener('beforeunload', (e) => {
        const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
        e.returnValue = confirmationMessage;
        return confirmationMessage;
    });
}

/* ============================
   Initialization
   ============================ */

function init() {
    // Initialize split view
    initSplitView();

    // Initialize event listeners
    initEventListeners();

    // Apply dark mode
    applyDarkMode();

    // Load current tab
    loadTab(currentTab);
    initialized = true;
}

// Start the application when DOM is ready
init();
