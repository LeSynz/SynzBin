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