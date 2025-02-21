const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Ensure build directories exist
fs.ensureDirSync('public');
fs.ensureDirSync('public/blog');
fs.ensureDirSync('public/css');
fs.ensureDirSync('public/js');

// Basic HTML template
const wrapHTML = (content, title) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - My Site</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <nav>
        <a href="/">Home</a>
        <a href="/blog">Blog</a>
        <a href="/about.html">About</a>
        <a href="/faq.html">FAQ</a>
        <a href="/contact.html">Contact</a>
    </nav>
    <main>
        ${content}
    </main>
    <footer>
        <p>&copy; ${new Date().getFullYear()} My Site</p>
    </footer>
</body>
</html>
`;

// Convert markdown files to HTML
async function buildPages() {
    const contentDir = path.join(__dirname, '../src/content/pages');
    const files = await fs.readdir(contentDir);
    
    for (const file of files) {
        if (file.endsWith('.md')) {
            const content = await fs.readFile(path.join(contentDir, file), 'utf-8');
            const html = marked(content);
            const title = file.replace('.md', '');
            const fullHtml = wrapHTML(html, title.charAt(0).toUpperCase() + title.slice(1));
            
            await fs.writeFile(
                path.join(__dirname, '../public', `${title}.html`),
                fullHtml
            );
        }
    }
}

buildPages().catch(console.error); 