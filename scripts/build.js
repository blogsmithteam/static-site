const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');
const moment = require('moment');

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

// Add this function to process blog posts
async function processBlogPosts() {
    const blogDir = path.join(__dirname, '../src/content/blog');
    const blogTemplate = await fs.readFile(path.join(__dirname, '../src/templates/blog.html'), 'utf8');
    
    // Create blog directory if it doesn't exist
    await fs.mkdir(path.join(__dirname, '../public/blog'), { recursive: true });
    
    const blogFiles = await fs.readdir(blogDir);
    
    for (const file of blogFiles) {
        if (file.endsWith('.md')) {
            const content = await fs.readFile(path.join(blogDir, file), 'utf8');
            const { data, content: htmlContent } = matter(content);
            const rendered = marked(htmlContent);
            
            // Format the date
            const dateFormatted = moment(data.date).format('MMMM D, YYYY');
            
            const html = blogTemplate
                .replace('{{title}}', data.title)
                .replace('{{date}}', data.date)
                .replace('{{dateFormatted}}', dateFormatted)
                .replace('{{{content}}}', rendered);
            
            // Create a directory for each post
            const slug = file.replace('.md', '');
            const postDir = path.join(__dirname, '../public/blog', slug);
            await fs.mkdir(postDir, { recursive: true });
            
            // Write index.html in the post directory
            const outputFile = path.join(postDir, 'index.html');
            await fs.writeFile(outputFile, html);
        }
    }
}

// Add to the main build function
async function build() {
    await buildPages();
    await processBlogPosts();
}

build().catch(console.error); 