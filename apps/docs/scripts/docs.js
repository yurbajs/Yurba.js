console.log("Documentation")
const fs = require('fs');
const path = require('path');

/**
 * Виправляє шляхи в HTML файлах та додає покращення
 * @param {string} dir - Директорія з HTML файлами
 */
function fixHtmlFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`Директорія ${dir} не існує!`);
    return;
  }
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Виправляємо відносні шляхи для роботи з file:// протоколом
      content = content.replace(/href="assets\//g, 'href="./assets/');
      content = content.replace(/src="assets\//g, 'src="./assets/');
      content = content.replace(/href="\.\.\/assets\//g, 'href="../assets/');
      content = content.replace(/src="\.\.\/assets\//g, 'src="../assets/');
      
      // Додаємо мета-теги для SEO
      content = content.replace(
        /<head>/,
        `<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <meta name="description" content="Yurba.js API Documentation - Офіційна документація для розробників">\n    <meta name="keywords" content="yurba, yurba.js, api, documentation, javascript, typescript">\n    <meta name="author" content="Yurba.js Team">`
      );
      
      // Додаємо підтримку підсвічування синтаксису
      content = content.replace(
        /<\/head>/,
        `    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/default.min.css">\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>\n</head>`
      );
      
      // Додаємо favicon
      content = content.replace(
        /<\/head>/,
        `    <link rel="icon" href="./assets/logo.svg" type="image/svg+xml">\n</head>`
      );
      
      fs.writeFileSync(filePath, content);
      console.log(`Оновлено файл: ${filePath}`);
    }
  });
}

/**
 * Створює файл robots.txt для SEO
 * @param {string} docsDir - Директорія з документацією
 */
function createRobotsTxt(docsDir) {
  const robotsContent = `User-agent: *\nAllow: /\n\nSitemap: https://yurbajs.pages.dev/sitemap.xml`;
  fs.writeFileSync(path.join(docsDir, 'robots.txt'), robotsContent);
  console.log('Створено robots.txt');
}

/**
 * Створює файл sitemap.xml для SEO
 * @param {string} docsDir - Директорія з документацією
 */
function createSitemap(docsDir) {
  const baseUrl = 'https://yurbajs.pages.dev';
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Рекурсивно додаємо всі HTML файли до sitemap
  function addHtmlFiles(dir, baseUrl) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        addHtmlFiles(filePath, baseUrl);
      } else if (file.endsWith('.html')) {
        const relativePath = path.relative(docsDir, filePath).replace(/\\/g, '/');
        const url = `${baseUrl}/${relativePath}`;
        
        sitemap += '  <url>\n';
        sitemap += `    <loc>${url}</loc>\n`;
        sitemap += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        sitemap += '    <changefreq>weekly</changefreq>\n';
        sitemap += '  </url>\n';
      }
    });
  }
  
  addHtmlFiles(docsDir, baseUrl);
  sitemap += '</urlset>';
  
  fs.writeFileSync(path.join(docsDir, 'sitemap.xml'), sitemap);
  console.log('Створено sitemap.xml');
}

console.log('Покращення згенерованої документації...');
const docsDir = './apps/docs/dist';

if (!fs.existsSync(docsDir)) {
  console.error(`Директорія ${docsDir} не існує! Спочатку згенеруйте документацію.`);
  process.exit(1);
}

fixHtmlFiles(docsDir);
createRobotsTxt(docsDir);
createSitemap(docsDir);

console.log('Готово! Документація успішно покращена.');
