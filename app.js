const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log('Connecting to database...');
require('./database/connection');

// --- Load Routes Automatically ---
function loadRoutes(dir, baseRoute = "") {
    const files = fs.readdirSync(dir);

    // Sort to ensure 'api' directory loads before 'index.js'
    files.sort((a, b) => {
        const aIsDir = fs.statSync(path.join(dir, a)).isDirectory();
        const bIsDir = fs.statSync(path.join(dir, b)).isDirectory();

        // Directories first, then files
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;

        // index.js last among files
        if (a === 'index.js') return 1;
        if (b === 'index.js') return -1;

        return a.localeCompare(b);
    });

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            loadRoutes(fullPath, path.join(baseRoute, file));
        } else if (file.endsWith(".js")) {
            const route = require(fullPath);
            const routeName = file === "index.js" ? "" : file.replace(".js", "");
            const routePath = path.join("/", baseRoute, routeName).replace(/\\/g, "/");

            app.use(routePath, route);
            console.log(`✅ Loaded route: ${routePath}`);
        }
    });
}

loadRoutes(path.join(__dirname, "routes"));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});