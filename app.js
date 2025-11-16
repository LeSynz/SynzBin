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

function loadRoutes(dir, baseRoute = '') {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            loadRoutes(fullPath, path.join(baseRoute, file));
        } else if (file.endsWith('.js')) {
            const route = require(fullPath);
            let routePath;
            if (file === 'index.js') {
                routePath = baseRoute || '/';
            } else {
                routePath = path.join(baseRoute, file.replace('.js', ''));
                if (!routePath.startsWith('/')) {
                    routePath = '/' + routePath;
                }
            }
            app.use(routePath, route);
        }
    });
}

loadRoutes(path.join(__dirname, 'routes'));

console.log('Connecting to database...');
require('./database/connection');

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});