var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    lineNumbers: true,
    mode: null,
    theme: "material",
    indentUnit: 4,
    tabSize: 4,
    viewportMargin: Infinity
});

const modes = {
    plaintext: null,
    javascript: "javascript",
    python: "python",
    java: "text/x-java",
    csharp: "text/x-csharp",
    cpp: "text/x-c++src",
    php: "php",
    ruby: "ruby",
    go: "go",
    rust: "rust",
    html: "htmlmixed",
    css: "css",
    sql: "sql",
    bash: "shell",
    json: { name: "javascript", json: true },
    xml: "xml",
    markdown: "markdown"
};

const extensionMap = {
    'js': 'javascript',
    'py': 'python',
    'java': 'java',
    'cs': 'csharp',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'c': 'cpp',
    'h': 'cpp',
    'hpp': 'cpp',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'sql': 'sql',
    'sh': 'bash',
    'bash': 'bash',
    'json': 'json',
    'xml': 'xml',
    'md': 'markdown'
};

function detectLanguageFromContent(content) {
    content = content.trim();

    if ((content.startsWith('{') && content.endsWith('}')) ||
        (content.startsWith('[') && content.endsWith(']'))) {
        try {
            JSON.parse(content);
            return 'json';
        } catch (e) { }
    }

    if (content.startsWith('<!DOCTYPE') || content.startsWith('<html')) return 'html';
    if (content.startsWith('<?xml') || /^<\w+/.test(content)) return 'xml';

    if (content.startsWith('<?php')) return 'php';

    if (/^(def|class|import|from|if __name__|print\()/m.test(content)) return 'python';

    if (/^(const|let|var|function|class|import|export|=>)/m.test(content)) return 'javascript';

    if (/^(public class|private class|package|import java)/m.test(content)) return 'java';

    if (/^(using System|namespace|public class.*\{)/m.test(content)) return 'csharp';

    if (/#include\s*<|using namespace std/m.test(content)) return 'cpp';

    if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s/im.test(content)) return 'sql';

    if (content.startsWith('#!') || /^(sudo|apt|echo|cd|ls|mkdir)\s/m.test(content)) return 'bash';

    if (/[\w-]+\s*\{[\s\S]*\}/m.test(content) && content.includes(':')) return 'css';

    if (/^(#|\*|-|\d+\.)\s/m.test(content)) return 'markdown';

    return null;
}

const filenameInput = document.querySelector('input[name="filename"]');
const languageSelect = document.getElementById('language-select');

languageSelect.value = 'plaintext';

filenameInput.addEventListener('input', function () {
    const filename = this.value.trim();
    const extension = filename.split('.').pop().toLowerCase();
    const detectedLang = extensionMap[extension];

    if (detectedLang) {
        languageSelect.value = detectedLang;
        const mode = modes[detectedLang] || null;
        editor.setOption("mode", mode);
    }
});

editor.on('change', function () {
    const content = editor.getValue();
    if (content.length > 20 && languageSelect.value === 'plaintext') {
        const detectedLang = detectLanguageFromContent(content);
        if (detectedLang) {
            languageSelect.value = detectedLang;
            const mode = modes[detectedLang] || null;
            editor.setOption("mode", mode);
        }
    }
});

languageSelect.addEventListener('change', function () {
    const mode = modes[this.value] || null;
    editor.setOption("mode", mode);
});

function autoResizeEditor() {
    const lineCount = editor.lineCount();
    const lineHeight = 24;
    const minHeight = 200;
    const newHeight = Math.max(minHeight, lineCount * lineHeight);
    editor.setSize(null, newHeight);
}

editor.on("change", autoResizeEditor);
autoResizeEditor();

document.getElementById('paste-form').addEventListener('submit', function (e) {
    document.getElementById('editor').value = editor.getValue();
});