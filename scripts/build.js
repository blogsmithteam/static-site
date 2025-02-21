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
    // Strip out any existing html, head, and body tags from content
    const strippedContent = content
        .replace(/<\/?html[^>]*>/g, '')
        .replace(/<\/?head[^>]*>[\s\S]*?<\/head>/g, '')
        .replace(/<\/?body[^>]*>/g, '');

    return template
        .replace('{{title}}', title)
        .replace('{{content}}', strippedContent)
        .replace('{{year}}', new Date().getFullYear());
};

// Convert markdown files to HTML
async function buildPages() {
    const pages = fs.readdirSync('src/content/pages');
    
    for (const page of pages) {
        // Skip processing index.html
        if (page === 'index.md') continue;
        
        if (page.endsWith('.md')) {
            const content = await fs.readFile(path.join('src/content/pages', page), 'utf-8');
            const html = marked(content);
            const title = page.replace('.md', '');
            const fullHtml = wrapHTML(html, title.charAt(0).toUpperCase() + title.slice(1));
            
            await fs.writeFile(
                path.join(__dirname, '../public', `${title}.html`),
                fullHtml
            );
        }
    }

    // Handle root index.html specially - just wrap it with the template
    try {
        const indexContent = await fs.readFile(path.join(__dirname, '../index.html'), 'utf-8');
        const fullHtml = wrapHTML(indexContent, 'Home');
        await fs.writeFile(
            path.join(__dirname, '../public/index.html'),
            fullHtml
        );
    } catch (err) {
        console.log('No index.html found in root directory - skipping');
    }
}

buildPages().catch(console.error); 