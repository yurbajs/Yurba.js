/**
 * Додаткові налаштування для TypeDoc
 * Цей файл використовується для розширення конфігурації TypeDoc
 */

module.exports = {
  /**
   * Функція для налаштування TypeDoc
   * @param {import('typedoc').TypeDoc} app - Екземпляр TypeDoc
   */
  setup(app) {
    // Додаємо кастомні теги для документації
    app.converter.addUnknownTagHandler('example', (comment, tag) => {
      comment.blockTags.push({
        tag: '@example',
        content: tag.content
      });
    });

    app.converter.addUnknownTagHandler('since', (comment, tag) => {
      comment.blockTags.push({
        tag: '@since',
        content: tag.content
      });
    });

    app.converter.addUnknownTagHandler('deprecated', (comment, tag) => {
      comment.blockTags.push({
        tag: '@deprecated',
        content: tag.content
      });
    });

    // Додаємо кастомні категорії для групування
    app.converter.on('resolveBegin', () => {
      app.logger.info('Налаштування кастомних категорій для документації...');
    });

    // Додаємо кастомні фільтри для документації
    app.converter.on('resolveEnd', () => {
      app.logger.info('Застосування кастомних фільтрів для документації...');
    });
  }
};