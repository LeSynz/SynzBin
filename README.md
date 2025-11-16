# 🎨 SynzBin

A modern, sleek pastebin application for developers to share code snippets with syntax highlighting and clean URLs.

![SynzBin](https://img.shields.io/badge/version-1.0.0-red)
![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🚀 **Lightning Fast** - Create and share code snippets in seconds
- 🎨 **Syntax Highlighting** - Support for 15+ programming languages with CodeMirror
- 🔗 **Clean URLs** - Short, memorable links for easy sharing
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🌙 **Dark Theme** - Beautiful dark UI optimized for developers
- 📊 **View Tracking** - See how many times your paste has been viewed
- 📋 **Copy & Share** - One-click copy to clipboard and link sharing
- 🔍 **Raw View** - Access raw paste content directly

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templates, Tailwind CSS
- **Editor**: CodeMirror 5
- **Database**: [Synz-DB](https://github.com/LeSynz/synz-db) - Custom JSON-based database inspired by MongoDB
- **Architecture**: MVC pattern with modular routing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LeSynz/synzbin.git
   cd synzbin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🎯 Usage

### Creating a Paste

1. Visit the homepage and click "Create New Paste"
2. Enter a title and description (optional)
3. Select your programming language
4. Add a filename (optional)
5. Paste or type your code
6. Click "Save Paste"

### Viewing a Paste

- Navigate to `/{shortId}` to view any paste
- Use the "Share" button to copy the link
- Use the "Copy" button to copy the code
- Click "Raw" to view the raw content

### Supported Languages

- JavaScript
- Python
- Java
- C# / C++
- PHP
- Ruby
- Go
- Rust
- HTML/CSS
- SQL
- Bash
- JSON
- XML
- Markdown
- Plain Text

## 📁 Project Structure

```
SynzBin/
├── app.js                 # Main application entry point
├── package.json          # Project dependencies
├── database/
│   └── connection.js     # Synz-DB configuration
├── models/
│   └── PasteModel.js     # Paste data model
├── routes/
│   ├── index.js          # Home and view routes
│   ├── raw.js            # Raw paste route
│   └── api/
│       └── new.js        # Create paste API
├── views/
│   ├── index.ejs         # Homepage
│   ├── new.ejs           # Create paste page
│   ├── view.ejs          # View paste page
│   ├── 404.ejs           # Not found page
│   └── 500.ejs           # Error page
├── public/
│   ├── css/
│   │   ├── style.css     # Compiled Tailwind CSS
│   │   ├── input.css     # Tailwind source
│   │   └── material.css  # CodeMirror theme
│   ├── js/
│   │   ├── editor.js     # Editor functionality
│   │   └── viewer.js     # Viewer functionality
│   └── images/
└── data/
    └── paste.json        # Paste storage (Synz-DB)
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

### Database

The application uses **Synz-DB**, a custom-built JSON database inspired by MongoDB's API. It provides:
- MongoDB-like query syntax
- Fast read/write operations
- Zero configuration required
- File-based persistence

Paste data is stored in `data/paste.json`.

#### Synz-DB Example Usage

```javascript
const db = require('./database/connection');

// Create
await db.create('paste', pasteData);

// Find
const paste = await db.findOne('paste', { shortId: 'abc123' });

// Update
await db.update('paste', { shortId: 'abc123' }, { views: 10 });

// Delete
await db.delete('paste', { shortId: 'abc123' });
```

## 🚀 Development

### Build CSS

If you modify Tailwind classes:

```bash
npm run build:css
```

### Watch Mode

For automatic CSS rebuilding during development:

```bash
npm run watch:css
```

## 📝 API Endpoints

### POST /api/new
Create a new paste

**Request Body:**
```json
{
  "title": "My Code Snippet",
  "description": "Optional description",
  "language": "javascript",
  "filename": "example.js",
  "content": "console.log('Hello World');"
}
```

**Response:**
```json
{
  "success": true,
  "shortId": "abc123"
}
```

### GET /:shortId
View a paste

### GET /raw/:shortId
Get raw paste content

## 🎨 Customization

### Changing Theme Colors

Edit `public/css/input.css` and modify the Tailwind color classes:

```css
/* Change primary color from red-400 to your choice */
.text-red-400 { ... }
.bg-red-500 { ... }
```

Then rebuild:
```bash
npm run build:css
```

### Adding New Languages

1. Add the language to the select dropdown in `views/new.ejs`
2. Include the CodeMirror mode script in the head section
3. Add the mode mapping in `public/js/editor.js` and `public/js/viewer.js`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Synz**
- Website: [synz.xyz](https://synz.xyz)
- GitHub: [@LeSynz](https://github.com/LeSynz)

## 🙏 Acknowledgments

- [CodeMirror](https://codemirror.net/) - Code editor component
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Express.js](https://expressjs.com/) - Web framework
- [Synz-DB](https://github.com/LeSynz/synz-db) - Custom JSON database

## 📊 Future Enhancements

- [ ] User authentication (Discord OAuth2)
- [ ] Paste expiration dates
- [ ] Private/encrypted pastes
- [ ] Paste editing
- [ ] Fork/clone functionality
- [ ] Syntax themes selection
- [ ] Rate limiting
- [ ] Search functionality
- [ ] Paste categories/tags
- [ ] API rate limiting
- [ ] Paste analytics

---

Made with ❤️ by [Synz](https://synz.xyz) © 2025