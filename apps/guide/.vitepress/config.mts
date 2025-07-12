import { defineConfig } from 'vitepress'
import versions from './versions.json'
import links from './links.json'

export default defineConfig({
  title: "Yurba.js",
  description: "The powerful library for creating bots and integrating with the Yurba API",
  base: '/',
  cleanUrls: true,
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  
  srcDir: '.',
  rewrites: {
    'en/(.*)': '(.*)',
  },
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
          { text: 'Посібник', link: links.uk.guide },
          { text: 'Документація', link: links.external.docs },
          { text: 'Приклади', link: links.uk.examples },
          {
            text: `v${versions.current}`,
            items: [
              { text: 'Зміни', link: links.external.changelog },
              ...versions.versions.map(v => ({
                text: v.label.replace('current', 'поточна'),
                link: v.archived ? v.archiveUrl : (v.path === '/' ? '/uk/' : `/uk${v.path}`)
              }))
            ]
          }
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
          pattern: `${links.external.github}/edit/main/apps/guide/:path`,
          text: 'Редагувати цю сторінку'
        }
      }
    }
  },


  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: links.internal.guide },
      { text: 'Documentation', link: links.external.docs },
      { text: 'Examples', link: links.internal.examples },
      {
        text: `v${versions.current}`,
        items: [
          { text: 'Changelog', link: links.external.changelog },
          ...versions.versions.map(v => ({
            text: v.label,
            link: v.archived ? v.archiveUrl : v.path
          }))
        ]
      }
    ],

    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: links.internal.introduction },
            { text: 'Installation', link: links.internal.installation },
            { text: 'Quick Start', link: links.internal.guide }
          ]
        },
        {
          text: 'Guide',
          items: [
            { text: 'Creating a Bot', link: links.internal.creatingBot },
            { text: 'Commands', link: links.internal.commands },
            { text: 'Events', link: links.internal.events },
            { text: 'Middleware', link: '/middleware' }
          ]
        },
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: links.internal.examples },
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
            { text: 'Вступ', link: links.uk.introduction },
            { text: 'Встановлення', link: links.uk.installation },
            { text: 'Швидкий старт', link: links.uk.guide }
          ]
        },
        {
          text: 'Посібник',
          items: [
            { text: 'Створення бота', link: links.uk.creatingBot },
            { text: 'Команди', link: links.uk.commands },
            { text: 'Події', link: links.uk.events }
          ]
        },
        {
          text: 'Приклади',
          items: [
            { text: 'Огляд', link: links.uk.examples }
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
      { icon: 'github', link: links.external.github },
      { icon: 'npm', link: links.external.npm }
    ],

    footer: {
      message: 'Released under the Apache-2.0 License.',
      copyright: 'Copyright © 2025 RastGame'
    },

    editLink: {
      pattern: `${links.external.github}/edit/main/apps/guide/:path`
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
