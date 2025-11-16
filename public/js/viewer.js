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

const viewerElement = document.getElementById('viewer');
const language = viewerElement.dataset.language;

const viewer = CodeMirror.fromTextArea(viewerElement, {
    lineNumbers: true,
    mode: modes[language] || null,
    theme: "material",
    readOnly: true,
    viewportMargin: Infinity
});

function autoResizeViewer() {
    const lineCount = viewer.lineCount();
    const lineHeight = 24;
    const minHeight = 200;
    const newHeight = Math.max(minHeight, lineCount * lineHeight);
    viewer.setSize(null, newHeight);
}

autoResizeViewer();

document.getElementById('copy-btn').addEventListener('click', function () {
    navigator.clipboard.writeText(viewer.getValue()).then(() => {
        this.textContent = 'Copied!';
        setTimeout(() => {
            this.textContent = 'Copy';
        }, 2000);
    });
});

document.getElementById('share-btn').addEventListener('click', function () {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        const originalText = this.innerHTML;
        this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>Copied Link!';
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
    });
});