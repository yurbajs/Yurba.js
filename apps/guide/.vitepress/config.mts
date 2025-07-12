import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Yurba.js",
  description: "The powerful library for creating bots and integrating with the Yurba API",
  base: '/',
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    uk: {
      label: 'Українська',
      lang: 'uk',
      title: 'Yurba.js',
      description: 'Потужна бібліотека для створення ботів та інтеграції з Yurba API',
      themeConfig: {
        nav: [
          { text: 'Посібник', link: '/uk/getting-started' },
          { text: 'Документація', link: 'https://yurbajs.pages.dev/' },
          { text: 'Приклади', link: '/uk/examples' }
        ],
        outline: {
          label: 'На цій сторінці'
        },
        lastUpdated: {
          text: 'Оновлено'
        },
        docFooter: {
          prev: 'Попередня сторінка',
          next: 'Наступна сторінка'
        },
        darkModeSwitchLabel: 'Вигляд',
        lightModeSwitchTitle: 'Переключити на світлу тему',
        darkModeSwitchTitle: 'Переключити на темну тему',
        returnToTopLabel: 'Повернутися до початку',
        sidebarMenuLabel: 'Меню',
        editLink: {
          pattern: 'https://github.com/RastGame/Yurba.js/edit/main/apps/guide/:path',
          text: 'Редагувати цю сторінку'
        }
      }
    }
  },


  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'Documentation', link: 'https://yurbajs.pages.dev/' },
      { text: 'Examples', link: '/examples' },
      {
        text: 'v0.1.9',
        items: [
          { text: 'Changelog', link: 'https://github.com/RastGame/Yurba.js/tags' },
          { text: 'v0.1.9 (current)', link: '/' },
          { text: 'v0.1.8', link: 'https://github.com/RastGame/Yurba.js/tree/v0.1.8' }
        ]
      }
    ],

    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/introduction' },
            { text: 'Installation', link: '/installation' },
            { text: 'Quick Start', link: '/getting-started' }
          ]
        },
        {
          text: 'Guide',
          items: [
            { text: 'Creating a Bot', link: '/creating-bot' },
            { text: 'Commands', link: '/commands' },
            { text: 'Events', link: '/events' },
            { text: 'Middleware', link: '/middleware' }
          ]
        },
        {
          text: 'Examples',
          items: [
            { text: 'Basic Bot', link: '/examples/basic-bot' },
            { text: 'Command Handler', link: '/examples/command-handler' },
            { text: 'Event Handling', link: '/examples/event-handling' }
          ]
        }
      ],
      '/uk/': [
        {
          text: 'Початок роботи',
          items: [
            { text: 'Вступ', link: '/uk/introduction' },
            { text: 'Встановлення', link: '/uk/installation' },
            { text: 'Швидкий старт', link: '/uk/getting-started' }
          ]
        }
      ]
    },

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          searchOptions: {
            combineWith: 'AND',
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 2, titles: 1 }
          },
          options: {
            fields: ['title', 'titles', 'text'],
            storeFields: ['title', 'titles'],
            searchOptions: {
              fuzzy: 0.2,
              prefix: true,
              boost: { title: 4, text: 2, titles: 1 }
            }
          }
        },
        _render(src, env, md) {
          const html = md.render(src, env)
          if (env.frontmatter?.search === false) return ''
          if (env.relativePath.startsWith('uk/')) {
            return html
          }
          return html
        },
        locales: {
          uk: {
            translations: {
              button: {
                buttonText: 'Пошук',
                buttonAriaLabel: 'Пошук документації'
              },
              modal: {
                displayDetails: 'Показати детальний список',
                resetButtonTitle: 'Скинути пошук',
                backButtonTitle: 'Закрити пошук',
                noResultsText: 'Немає результатів для',
                footer: {
                  selectText: 'вибрати',
                  selectKeyAriaLabel: 'enter',
                  navigateText: 'навігувати',
                  navigateUpKeyAriaLabel: 'стрілка вгору',
                  navigateDownKeyAriaLabel: 'стрілка вниз',
                  closeText: 'закрити',
                  closeKeyAriaLabel: 'escape'
                }
              }
            }
          },
          root: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search docs'
              },
              modal: {
                displayDetails: 'Display detailed list',
                resetButtonTitle: 'Reset search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results for',
                footer: {
                  selectText: 'to select',
                  selectKeyAriaLabel: 'enter',
                  navigateText: 'to navigate',
                  navigateUpKeyAriaLabel: 'up arrow',
                  navigateDownKeyAriaLabel: 'down arrow',
                  closeText: 'to close',
                  closeKeyAriaLabel: 'escape'
                }
              }
            }
          }
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/RastGame/Yurba.js' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/yurba.js' }
    ],

    footer: {
      message: 'Released under the Apache-2.0 License.',
      copyright: 'Copyright © 2025 RastGame'
    },

    editLink: {
      pattern: 'https://github.com/RastGame/Yurba.js/edit/main/apps/guide/:path'
    },

    // Додаткові функції
    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    },

    darkModeSwitchLabel: 'Appearance',
    lightModeSwitchTitle: 'Switch to light theme',
    darkModeSwitchTitle: 'Switch to dark theme',

    // Українські переклади
    localeLinks: {
      text: 'Мова',
      items: [
        { text: 'English', link: '/' },
        { text: 'Українська', link: '/uk/' }
      ]
    },

    // Переклади для української версії
    i18nRouting: false
  }
})
