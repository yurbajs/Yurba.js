import { Application, DefaultTheme, RendererEvent } from 'typedoc';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Кастомна тема для Yurba.js документації
 */
export class YurbaTheme extends DefaultTheme {
  /**
   * Конструктор теми
   */
  constructor(renderer: Application) {
    super(renderer);

    // Додаємо обробник події для копіювання кастомних стилів
    this.owner.on(RendererEvent.END, this.onRendererEnd.bind(this));
  }

  /**
   * Обробник події завершення рендерингу
   */
  private onRendererEnd() {
    this.copyCustomAssets();
    this.addCustomScriptToPages();
  }

  /**
   * Додає кастомний скрипт до всіх HTML сторінок
   */
  private addCustomScriptToPages() {
    const outDir = this.application.options.getValue('out') as string;
    if (!outDir) return;

    const addScriptToFile = (filePath: string) => {
      if (!filePath.endsWith('.html')) return;
      
      let content = fs.readFileSync(filePath, 'utf8');
      if (!content.includes('custom.js')) {
        content = content.replace(
          '</body>',
          '<script src="./assets/custom.js"></script>\n</body>'
        );
        fs.writeFileSync(filePath, content);
      }
    };

    // Рекурсивно обходимо всі HTML файли
    const processDir = (dir: string) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          processDir(filePath);
        } else {
          addScriptToFile(filePath);
        }
      }
    };

    processDir(outDir);
  }

  /**
   * Копіює кастомні стилі та скрипти
   */
  private copyCustomAssets() {
    const outDir = this.application.options.getValue('out') as string;
    if (!outDir) return;
    
    const assetsDir = path.join(outDir, 'assets');
    
    // Створюємо директорію для кастомних стилів
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    // Копіюємо кастомні стилі
    const customCssPath = path.join(__dirname, '../assets/style.css');
    const targetCssPath = path.join(assetsDir, 'custom-style.css');
    
    if (fs.existsSync(customCssPath)) {
      fs.copyFileSync(customCssPath, targetCssPath);
    }
    
    // Копіюємо кастомний скрипт
    const customJsPath = path.join(__dirname, '../assets/custom.js');
    const targetJsPath = path.join(assetsDir, 'custom.js');
    
    if (fs.existsSync(customJsPath)) {
      fs.copyFileSync(customJsPath, targetJsPath);
    }
    
    // Додаємо посилання на кастомні стилі до head
    const headFile = path.join(outDir, 'assets/head.js');
    if (fs.existsSync(headFile)) {
      let headContent = fs.readFileSync(headFile, 'utf8');
      if (!headContent.includes('custom-style.css')) {
        headContent = headContent.replace(
          'return [',
          'return [\n    \'<link rel="stylesheet" href="./assets/custom-style.css">\','
        );
        fs.writeFileSync(headFile, headContent);
      }
    }
    
    // Копіюємо логотип та інші зображення
    const logoSrc = path.join(process.cwd(), 'assets/logo.svg');
    const bannerSrc = path.join(process.cwd(), 'assets/banner.svg');
    
    if (fs.existsSync(logoSrc)) {
      fs.copyFileSync(logoSrc, path.join(assetsDir, 'logo.svg'));
    }
    
    if (fs.existsSync(bannerSrc)) {
      fs.copyFileSync(bannerSrc, path.join(assetsDir, 'banner.svg'));
    }
  }
}

/**
 * Експортуємо тему для TypeDoc
 */
export function load(app: Application) {
  app.renderer.defineTheme('yurba', YurbaTheme);
}