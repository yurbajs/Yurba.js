const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// Шлях до директорії теми
const themeDir = path.join(__dirname, 'theme');

// Підготовка теми
console.log('Підготовка кастомної теми TypeDoc...');

// Переконуємося, що директорія dist існує
if (!fs.existsSync(path.join(themeDir, 'dist'))) {
  fs.mkdirSync(path.join(themeDir, 'dist'), { recursive: true });
}

// Копіюємо assets директорію
const assetsDir = path.join(themeDir, 'assets');
const distAssetsDir = path.join(themeDir, 'dist', 'assets');

if (!fs.existsSync(distAssetsDir)) {
  fs.mkdirSync(distAssetsDir, { recursive: true });
}

// Копіюємо всі файли з assets в dist/assets
if (fs.existsSync(assetsDir)) {
  fs.readdirSync(assetsDir).forEach(file => {
    fs.copyFileSync(
      path.join(assetsDir, file),
      path.join(distAssetsDir, file)
    );
  });
}

// Копіюємо вихідний код в dist
const srcDir = path.join(themeDir, 'src');
const distDir = path.join(themeDir, 'dist');

if (fs.existsSync(srcDir)) {
  // Копіюємо індексний файл
  const srcIndexPath = path.join(srcDir, 'index.ts');
  const distIndexPath = path.join(distDir, 'index.js');
  
  if (fs.existsSync(srcIndexPath)) {
    // Читаємо вміст TypeScript файлу
    let content = fs.readFileSync(srcIndexPath, 'utf8');
    
    // Проста трансформація в JavaScript
    content = content
      .replace(/import\s+\{([^}]+)\}\s+from\s+['"](.*)['"];?/g, 'const { $1 } = require("$2");')
      .replace(/export\s+class\s+([^\s{]+)/g, 'class $1')
      .replace(/export\s+function\s+([^\s(]+)/g, 'function $1')
      .replace(/private\s+([^(]+)\(/g, '$1(')
      .replace(/:\s*[A-Za-z<>\[\]|]+/g, '') // Видаляємо типи
      .replace(/as\s+string/g, '');
    
    // Додаємо експорт в кінці
    content += '\n\nmodule.exports = { YurbaTheme, load };';
    
    // Записуємо JavaScript файл
    fs.writeFileSync(distIndexPath, content);
  }
}

console.log('Кастомна тема успішно підготовлена!');