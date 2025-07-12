import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Yurba.js",
  description: "The powerful library for creating bots and integrating with the Yurba API",
  base: '/',
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', href: '/assets/logo.svg' }]
  ],
  
  // Локалізації
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    uk: {
      label: 'Українська',
      lang: 'uk',
      title: 'Yurba.js',
      description: 'Потужна бібліотека для створення ботів та інтеграції з Yurba API'
    }
  },

  // Algolia пошук
  search: {
    provider: 'algolia',
    options: {
      appId: 'BH4D9OD16A',
      apiKey: 'b573aa848fd57fb47d693b531297d32f',
      indexName: 'yurbajs',
      locales: {
        uk: {
          placeholder: 'Пошук документації',
          translations: {
            button: {
              buttonText: 'Пошук',
              buttonAriaLabel: 'Пошук'
            },
            modal: {
              searchBox: {
                resetButtonTitle: 'Очистити запит',
                resetButtonAriaLabel: 'Очистити запит',
                cancelButtonText: 'Скасувати',
                cancelButtonAriaLabel: 'Скасувати'
              },
              startScreen: {
                recentSearchesTitle: 'Останні пошуки',
                noRecentSearchesText: 'Немає останніх пошуків',
                saveRecentSearchButtonTitle: 'Зберегти цей пошук',
                removeRecentSearchButtonTitle: 'Видалити цей пошук з історії',
                favoriteSearchesTitle: 'Улюблені',
                removeFavoriteSearchButtonTitle: 'Видалити з улюблених'
              },
              errorScreen: {
                titleText: 'Неможливо отримати результати',
                helpText: 'Можливо, варто перевірити мережеве з\'єднання.'
              },
              footer: {
                selectText: 'вибрати',
                navigateText: 'навігувати',
                closeText: 'закрити',
                searchByText: 'пошук від'
              },
              noResultsScreen: {
                noResultsText: 'Немає результатів для',
                suggestedQueryText: 'Спробуйте пошукати',
                reportMissingResultsText: 'Вважаєте, що цей запит повинен повертати результати?',
                reportMissingResultsLinkText: 'Повідомте нас.'
              }
            }
          }
        }
      }
    }
  },

  themeConfig: {
    logo: '/assets/logo.svg',
    
    // Навігація з версіями
    nav: [
      { text: 'Guide', link: '/getting-started' },
      { text: 'API Reference', link: '../docs/' },
      { text: 'Examples', link: '/examples' },
      {
        text: 'v0.1.9',
        items: [
          { text: 'Changelog', link: 'https://github.com/RastGame/Yurba.js/releases' },
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

    socialLinks: [
      { icon: 'github', link: 'https://github.com/RastGame/Yurba.js' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/yurba.js' }
    ],

    footer: {
      message: 'Released under the Apache-2.0 License.',
      copyright: 'Copyright © 2024 RastGame'
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
    darkModeSwitchTitle: 'Switch to dark theme'
  }
})
