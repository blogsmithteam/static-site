const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Ensure build directories exist
fs.ensureDirSync('public');
fs.ensureDirSync('public/blog');
fs.ensureDirSync('public/css');
fs.ensureDirSync('public/js');

// Load template
const templatePath = path.join(__dirname, '../src/templates/base.html');
const template = fs.readFileSync(templatePath, 'utf8');

const wrapHTML = (content, title) => {
    return template
        .replace('{{title}}', title)
        .replace('{{content}}', content)
        .replace('{{year}}', new Date().getFullYear());
};

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