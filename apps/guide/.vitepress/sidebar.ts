export const sidebar = [
  {
    text: 'Welcome',
    collapsed: false,
    items: [
      { text: 'Introduction', link: '/introduction' },
      { text: "What's new?", link: '/welcome/whats-new' }
    ]
  },
  {
    text: 'Installation & Setup',
    collapsed: true,
    items: [
      { text: 'Installation', link: '/setup/installation' },
      { text: 'Setting up bot account', link: '/setup/setting-up-bot-account' },
      { text: 'Чат з ботом', link: '/setup/chat-with-bot' }
    ]
  },
  {
    text: 'Creating bot',
    collapsed: true,
    items: [
      { text: 'Create project', link: '/creating/create' },
      { text: 'Events', link: '/events' }
    ]
  },
  {
    text: 'Examples',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/examples' }
    ]
  }
]