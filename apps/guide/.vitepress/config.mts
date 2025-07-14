import { defineConfig } from 'vitepress'
import versions from './versions.json'
import links from './links.json'
import { sidebar } from './sidebar'
import { t, createNavItem } from './utils/i18n'



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
          { text: 'Посібник', link: '/uk/introduction' },
          { text: 'Документація', link: links.docs },
          { text: 'Приклади', link: '/uk/examples' },
          {
            text: `v${versions.current}`,
            items: [
              { text: 'Зміни', link: links.changelog },
              ...versions.versions.map(v => ({
                text: v.archived ? `${v.label.replace('current', 'поточна')} (архів)` : v.label.replace('current', 'поточна'),
                link: v.path === '/' ? '/uk/' : `/uk${v.path}`
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
          pattern: `${links.github}/edit/main/apps/guide/:path`,
          text: 'Редагувати цю сторінку'
        },
        notFound: {
          title: t('notFound.title', 'uk'),
          quote: t('notFound.quote', 'uk'),
          linkText: t('notFound.linkText', 'uk'),
          linkLabel: t('notFound.linkText', 'uk')
        }
      }
    }
  },


  themeConfig: {
    logo: '/logo.png',
    nav: [
      createNavItem('nav.guide', '/introduction'),
      { text: t('nav.documentation'), link: links.docs },
      createNavItem('nav.examples', '/examples'),
      {
        text: `v${versions.current}`,
        items: [
          { text: 'Changelog', link: links.changelog },
          ...versions.versions.map(v => ({
            text: v.archived ? `${v.label} (archived)` : v.label,
            link: v.path
          }))
        ]
      }
    ],

    sidebar: {
      '/': sidebar,
      '/uk/': []
    },

    aside: false,

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
      { icon: 'github', link: links.github },
      { icon: 'npm', link: links.npm }
    ],

    footer: {
      message: 'Released under the Apache-2.0 License.',
      copyright: 'Copyright © 2025 RastGame'
    },

    editLink: {
      pattern: `${links.github}/edit/main/apps/guide/:path`
    },

    // Додаткові функції
    outline: false,

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
    i18nRouting: false,

    notFound: {
      title: t('notFound.title'),
      quote: t('notFound.quote'),
      linkText: t('notFound.linkText'),
      linkLabel: t('notFound.linkText')
    }
  }
})
