/**
 * Плагін для TypeDoc, який додає додаткові функції
 */
const { Application } = require('typedoc');

/**
 * Завантажує плагін
 * @param {Application} app - Екземпляр TypeDoc Application
 */
function load(app) {
  // Додаємо хук для модифікації згенерованого HTML
  app.renderer.on('endPage', (page) => {
    // Додаємо кастомний скрипт для покращення навігації
    if (page.contents) {
      // Додаємо Google Analytics або інші скрипти за потреби
      page.contents = page.contents.replace(
        '</head>',
        `  <meta name="theme-color" content="#41d1ff">
  <meta name="description" content="Yurba.js API Documentation - Офіційна документація для розробників">
  <meta property="og:title" content="Yurba.js API Documentation">
  <meta property="og:description" content="Повна документація API для розробників Yurba.js">
  <meta property="og:image" content="https://yurbajs.vercel.app/banner.svg">
  <link rel="icon" href="https://yurbajs.vercel.app/logo.svg" type="image/svg+xml">
</head>`
      );
      
      // Додаємо кастомний футер
      page.contents = page.contents.replace(
        '<footer class="tsd-generator">',
        `<footer class="tsd-generator">
        <div style="margin-bottom: 20px;">
          <a href="https://yurba.js.org" target="_blank" rel="noopener noreferrer">Yurba.js</a> | 
          <a href="https://github.com/RastGame/Yurba.js" target="_blank" rel="noopener noreferrer">GitHub</a> | 
          <a href="https://www.npmjs.com/package/yurba.js" target="_blank" rel="noopener noreferrer">npm</a>
        </div>`
      );
    }
  });
}

module.exports = { load };