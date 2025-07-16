const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Шлях до директорії теми
const themeDir = path.join(__dirname, 'theme');

// Компілюємо тему
console.log('Компіляція кастомної теми TypeDoc...');
try {
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
  fs.readdirSync(assetsDir).forEach(file => {
    fs.copyFileSync(
      path.join(assetsDir, file),
      path.join(distAssetsDir, file)
    );
  });
  
  // Компілюємо TypeScript
  execSync('npx tsc', { cwd: themeDir, stdio: 'inherit' });
  
  console.log('Кастомна тема успішно скомпільована!');
} catch (error) {
  console.error('Помилка при компіляції теми:', error);
  process.exit(1);
}