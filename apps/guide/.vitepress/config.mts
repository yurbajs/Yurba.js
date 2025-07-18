import { defineConfig } from 'vitepress'
import versions from './versions.json'
import links from './links.json'
import { sidebar } from './sidebar'
import { t, createNavItem } from './utils/i18n'

export default defineConfig({
  title: "Yurba.js",
  titleTemplate: ":title",
  description: "The powerful library for creating bots and integrating with the Yurba API",
  base: '/',
  cleanUrls: true,
  ignoreDeadLinks: [
    // ignore exact url "/playground"
    './LICENSE',
    // ignore all localhost links
    /^https?:\/\/localhost/,
    // ignore all links include "/repl/""
    /\/repl\//,
    // custom function, ignore all links include "ignore"
    (url) => {
      return url.toLowerCase().includes('ignore')
    }
  ],
  metaChunk: true,
  sitemap: {
    hostname: 'https://yurba.js.org',
    lastmodDateOnly: false,
    transformItems: (items) => {
      // Створюємо Map для уникнення дублікатів
      const urlMap = new Map()
      
      // Додаємо всі існуючі елементи
      items.forEach(item => {
        const url = item.url.replace('https://yurba.js.org', '')
        urlMap.set(url, {
          url: item.url,
          changefreq: item.changefreq || 'monthly',
          priority: item.priority || 0.5,
          lastmod: item.lastmod || new Date().toISOString()
        })
      })
      
      // Встановлюємо пріоритети для важливих сторінок
      if (urlMap.has('/')) {
        urlMap.get('/').changefreq = 'weekly'
        urlMap.get('/').priority = 1.0
      }
      
      if (urlMap.has('/introduction')) {
        urlMap.get('/introduction').changefreq = 'monthly'
        urlMap.get('/introduction').priority = 0.8
      }
      
      // Встановлюємо пріоритети для інших сторінок
      urlMap.forEach((item, url) => {
        if (url.startsWith('/setup/')) {
          item.priority = 0.7
          item.changefreq = 'monthly'
        } else if (url.startsWith('/development/')) {
          item.priority = 0.6
          item.changefreq = 'monthly'
        } else if (url.startsWith('/welcome/')) {
          item.priority = 0.5
          item.changefreq = 'yearly'
        }
      })
      
      return Array.from(urlMap.values())
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#00c7be' }],
    ['meta', { name: 'author', content: 'RastGame' }],
    ['meta', { name: 'keywords', content: 'yurba.js, yurba, bot, api, javascript, typescript, library' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Yurba.js' }],
    ['meta', { property: 'og:title', content: 'Yurba.js - Powerful Bot Library' }],
    ['meta', { property: 'og:description', content: 'The powerful library for creating bots and integrating with the Yurba API' }],
    ['meta', { property: 'og:image', content: 'https://yurba.js.org/banner.svg' }],
    ['meta', { property: 'og:url', content: 'https://yurba.js.org' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Yurba.js - Powerful Bot Library' }],
    ['meta', { name: 'twitter:description', content: 'The powerful library for creating bots and integrating with the Yurba API' }],
    ['meta', { name: 'twitter:image', content: 'https://yurba.js.org/banner.svg' }],
    ['link', { rel: 'canonical', href: 'https://yurba.js.org' }]
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
      titleTemplate: ':title | Yurba.js',
      description: 'Потужна бібліотека для створення ботів та інтеграції з Yurba API',
      head: [
        ['meta', { property: 'og:title', content: 'Yurba.js - Потужна бібліотека для ботів' }],
        ['meta', { property: 'og:description', content: 'Потужна бібліотека для створення ботів та інтеграції з Yurba API' }],
        ['meta', { name: 'twitter:title', content: 'Yurba.js - Потужна бібліотека для ботів' }],
        ['meta', { name: 'twitter:description', content: 'Потужна бібліотека для створення ботів та інтеграції з Yurba API' }]
      ],
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
    },
    'help-translate': {
      label: t('nav.help_translate'),
      link: 'https://crowdin.com/project/yurbajs'
    }
  },


  themeConfig: {
    logo: { src: '/logo.png', alt: 'Yurba.js Logo' },
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

    aside: true,

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          searchOptions: {
            combineWith: 'AND',
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 2, titles: 1 }
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
      { icon: 'github', link: links.github, ariaLabel: 'GitHub Repository' },
      { icon: 'npm', link: links.npm, ariaLabel: 'NPM Package' }
    ],

    footer: {
      message: 'Released under the Apache-2.0 License.',
      copyright: 'Copyright © 2025 RastGame'
    },

    editLink: {
      pattern: `${links.github}/edit/main/apps/guide/:path`,
      text: 'Edit this page on GitHub'
    },

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    },

    darkModeSwitchLabel: 'Appearance',
    lightModeSwitchTitle: 'Switch to light theme',
    darkModeSwitchTitle: 'Switch to dark theme',
    returnToTopLabel: 'Return to top',
    sidebarMenuLabel: 'Menu',

    externalLinkIcon: true,

    notFound: {
      title: '404 - Page Not Found',
      quote: 'But if you don\'t change your direction, and if you keep looking, you may end up where you are heading.',
      linkText: 'Take me home',
      linkLabel: 'Go to homepage'
    }
  }
})
