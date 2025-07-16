/**
 * Скрипт для додавання кастомних стилів до згенерованої документації
 */
const fs = require('fs');
const path = require('path');

// Шлях до директорії з документацією
const docsDir = path.join(__dirname, 'dist');

// Шлях до кастомних стилів
const customCssPath = path.join(__dirname, 'theme/assets/style.css');
const customJsPath = path.join(__dirname, 'theme/assets/custom.js');

// Шлях до директорії assets в документації
const assetsDir = path.join(docsDir, 'assets');

// Перевіряємо, чи існує директорія з документацією
if (!fs.existsSync(docsDir)) {
  console.error('Директорія з документацією не існує!');
  process.exit(1);
}

// Перевіряємо, чи існує директорія assets
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Копіюємо кастомні стилі
if (fs.existsSync(customCssPath)) {
  fs.copyFileSync(customCssPath, path.join(assetsDir, 'custom-style.css'));
  console.log('Кастомні стилі скопійовано');
}

// Копіюємо кастомний JavaScript
if (fs.existsSync(customJsPath)) {
  fs.copyFileSync(customJsPath, path.join(assetsDir, 'custom.js'));
  console.log('Кастомний JavaScript скопійовано');
}

// Копіюємо логотип та банер
const logoSrc = path.join(process.cwd(), 'assets/logo.svg');
const bannerSrc = path.join(process.cwd(), 'assets/banner.svg');

if (fs.existsSync(logoSrc)) {
  fs.copyFileSync(logoSrc, path.join(assetsDir, 'logo.svg'));
  console.log('Логотип скопійовано');
}

if (fs.existsSync(bannerSrc)) {
  fs.copyFileSync(bannerSrc, path.join(assetsDir, 'banner.svg'));
  console.log('Банер скопійовано');
}

// Додаємо посилання на кастомні стилі до всіх HTML файлів
function addCustomStylesToHtml(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      addCustomStylesToHtml(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Додаємо посилання на кастомні стилі
      if (!content.includes('custom-style.css')) {
        // Для index.html використовуємо прямий шлях
        const cssPath = file === 'index.html' ? './assets/custom-style.css' : getRelativePath(filePath, 'assets/custom-style.css');
        content = content.replace(
          '</head>',
          `    <link rel="stylesheet" href="${cssPath}">\n</head>`
        );
      }
      
      // Додаємо кастомний скрипт
      if (!content.includes('custom.js')) {
        // Для index.html використовуємо прямий шлях
        const jsPath = file === 'index.html' ? './assets/custom.js' : getRelativePath(filePath, 'assets/custom.js');
        content = content.replace(
          '</body>',
          `    <script src="${jsPath}"></script>\n</body>`
        );
      }
      
      fs.writeFileSync(filePath, content);
    }
  });
}

// Функція для отримання відносного шляху
function getRelativePath(fromPath, toPath) {
  const relativePath = path.relative(path.dirname(fromPath), path.join(docsDir, toPath));
  return relativePath.replace(/\\/g, '/');
}

// Додаємо кастомні стилі до всіх HTML файлів
addCustomStylesToHtml(docsDir);
console.log('Кастомні стилі додано до всіх HTML файлів');

console.log('Готово! Кастомні стилі успішно застосовано.');